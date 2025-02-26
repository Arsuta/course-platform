import axios from 'axios'

// Флаг для использования моковых данных
export const USE_MOCK_DATA = true

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  // Если включен режим моковых данных, прерываем запрос
  if (USE_MOCK_DATA) {
    return Promise.reject(new Error('Using mock data'))
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Обработка истекшего токена
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
) 