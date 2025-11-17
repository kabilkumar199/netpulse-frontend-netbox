import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

// --- Constants ---
export const PROTOCOL = "http";
export const DOMAIN = import.meta.env.VITE_APP_API_URL || '192.168.31.209';
export const PORT_8081 = 8081;
export const BASE_URL = '/api'; 

const API_DEFAULT_ROOT = `${PROTOCOL}://${DOMAIN}${BASE_URL}`;
const API_8081_ROOT = `${PROTOCOL}://${DOMAIN}:${PORT_8081}`;

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const errorResponseInterceptor = (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

const apiClient = axios.create({
  baseURL: DOMAIN, 
  headers: {
    'Accept': 'application/json, text/plain, */*',
  }
});

apiClient.interceptors.request.use(authRequestInterceptor);
apiClient.interceptors.response.use((response) => response, errorResponseInterceptor);

const apiClient8081 = axios.create({
  baseURL: API_8081_ROOT, 
  headers: {
    'Accept': 'application/json, text/plain, */*',
  }
});

apiClient8081.interceptors.request.use(authRequestInterceptor);
apiClient8081.interceptors.response.use((response) => response, errorResponseInterceptor);

export const api = {
  get: <T>(url: string, config?: any) =>
    apiClient.get<T>(url, config).then(res => res.data),

  post: <T>(url: string, data: any, config?: any) =>
    apiClient.post<T>(url, data, config).then(res => res.data),
};

export const api8081 = {
  get: <T>(url: string, config?: any) =>
    apiClient8081.get<T>(url, config).then(res => res.data),

  post: <T>(url: string, data: any, config?: any) =>
    apiClient8081.post<T>(url, data, config).then(res => res.data),
};

export default api;