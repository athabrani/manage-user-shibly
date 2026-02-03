import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  // Mengambil URL dari .env
  baseURL: import.meta.env.API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Handle jika Token Expired (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
     
    }
    return Promise.reject(error);
  }
);

export default api;