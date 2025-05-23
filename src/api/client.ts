import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Флаг для использования моковых данных
export const USE_MOCK_DATA = true

const API_URL = 'http://92.42.96.10:8080/api/v1'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const authStore = useAuthStore()
      
      try {
        await authStore.refreshToken()
        // Повторяем оригинальный запрос с новым токеном
        if (error.config) {
          const config = { ...error.config }
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${authStore.token}`
          return apiClient(config)
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        authStore.logout()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient 