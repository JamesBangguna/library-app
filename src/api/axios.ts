/// <reference types="vite/client" />

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://library-backend-production-b9cf.up.railway.app';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ======================
// Request Interceptor
// ======================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================
// Response Interceptor
// ======================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle 401 → Logout + Redirect
    if (status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register')
      ) {
        window.location.href = '/';
      }

      return Promise.reject(error);
    }

    // Tampilkan toast otomatis untuk error selain 401
    if (status && status !== 401) {
      const message = getErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
