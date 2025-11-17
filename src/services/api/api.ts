import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from "../../helpers/url_helper";

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
console.log(import.meta.env.VITE_APP_API_URL)


// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`API Request Duration: ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}/api${API_ENDPOINTS.REFRESH_TOKEN}`;
          const response = await axios.post(
            refreshUrl,
            { refreshToken }
          );

          const { token } = response.data;
          localStorage.setItem('authToken', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {

          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('authToken');
      }
    }
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
