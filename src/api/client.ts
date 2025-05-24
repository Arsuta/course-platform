import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      try {
        await authStore.refreshToken()
        const config = error.config
        if (config.headers) {
          config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return apiClient.request(config)
      } catch (refreshError) {
        authStore.logout()
        throw refreshError
      }
    }

    throw error
  }
) 