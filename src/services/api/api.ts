import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { AxiosHeaders } from "axios";

// --- Extend Axios metadata safely ---
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: { startTime: Date };
    _retry?: boolean;
  }
}

// --- Create axios instance ---
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// --- Request interceptor ---
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }

  config.metadata = { startTime: new Date() };
  return config;
});

// --- Response interceptor ---
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.metadata?.startTime) {
      const duration =
        Date.now() - response.config.metadata.startTime.getTime();
      console.log(`API Duration: ${duration}ms`);
    }
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    // ✔ Fix: ensure originalRequest exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const refreshUrl = `${
          import.meta.env.VITE_API_BASE_URL
        }/api/auth/refresh-token`;

        const res = await axios.post(refreshUrl, { refreshToken });
        const newToken = res.data.token;

        localStorage.setItem("authToken", newToken);

        if (!originalRequest.headers) {
          originalRequest.headers = AxiosHeaders.from({});
        }

        (originalRequest.headers as any).set(
          "Authorization",
          `Bearer ${newToken}`
        );

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// --- Typed API wrapper (NO MORE unknown errors) ---
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config).then((res) => res.data as T),

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance.post(url, data, config).then((res) => res.data as T),

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    axiosInstance.put(url, data, config).then((res) => res.data as T),

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config).then((res) => res.data as T),
};

// ✔ No default export → correct usage
export { axiosInstance };
