import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_API_BASE_URL, EDU_API_BASE_URL, GAME_API_BASE_URL } from './constants';
import { useAuthStore } from '@/stores/auth';

// Общие настройки для всех экземпляров axios
const commonConfig = {
  timeout: 30000, // 30 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Важно для работы с CORS
  withCredentials: false
};

// Создаем экземпляр axios с базовыми настройками для основного API
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  ...commonConfig
});

// Создаем экземпляр axios для Auth API
export const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  ...commonConfig
});

// Создаем экземпляр axios для Edu API
export const eduClient: AxiosInstance = axios.create({
  baseURL: EDU_API_BASE_URL,
  ...commonConfig
});

// Создаем экземпляр axios для Game API
export const gameClient: AxiosInstance = axios.create({
  baseURL: GAME_API_BASE_URL,
  ...commonConfig
});

// Интерцептор для добавления токена в заголовки запросов
const setupRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore();
      const token = authStore.token;
      
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

// Интерцептор для обработки ответов и обновления токена
const setupResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const authStore = useAuthStore();
      
      // Если получили 401 Unauthorized и запрос ещё не повторялся
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Пытаемся обновить токен
          await authStore.refreshUserToken();
          
          // Повторяем оригинальный запрос с новым токеном
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${authStore.token}`;
          }
          
          return client(originalRequest);
        } catch (refreshError) {
          // Если не удалось обновить токен, разлогиниваем пользователя
          authStore.logout();
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Инициализация интерцепторов для API-клиентов
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

setupRequestInterceptor(eduClient);
setupResponseInterceptor(eduClient);

setupRequestInterceptor(gameClient);
setupResponseInterceptor(gameClient);

// Для авторизационного API тоже нужны интерцепторы, 
// чтобы добавлять Authorization заголовок для refresh token запросов
setupRequestInterceptor(authClient); 