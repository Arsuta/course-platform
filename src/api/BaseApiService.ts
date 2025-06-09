import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, ApiError } from '@/api/types'
import { API_ERROR_CODES, DEFAULT_API_TIMEOUT } from '@/api/constants'
import { useAuthStore } from '@/stores/auth'

export default class BaseApiService {
  protected baseUrl: string
  protected timeout: number

  constructor(baseUrl: string, timeout: number = DEFAULT_API_TIMEOUT) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  /**
   * Выполнить GET запрос
   */
  protected async get<T>(url: string, params: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params
    })
  }

  /**
   * Выполнить POST запрос
   */
  protected async post<T>(url: string, data: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data
    })
  }

  /**
   * Выполнить PUT запрос
   */
  protected async put<T>(url: string, data: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data
    })
  }

  /**
   * Выполнить DELETE запрос
   */
  protected async delete<T>(url: string, params: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params
    })
  }

  /**
   * Выполнить запрос к API
   */
  protected async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Добавляем токен авторизации, если пользователь авторизован
      const authStore = useAuthStore()
      const headers: Record<string, string> = {}

      if (authStore.isAuthenticated && authStore.token) {
        headers['Authorization'] = `Bearer ${authStore.token}`
      }

      // Полный URL для запроса
      const fullUrl = `${this.baseUrl}${config.url}`

      // Конфигурация запроса
      const requestConfig: AxiosRequestConfig = {
        ...config,
        url: fullUrl,
        headers: {
          ...headers,
          ...config.headers
        },
        timeout: this.timeout
      }

      console.log(`API Request: ${config.method} ${fullUrl}`, config.params || config.data || '')

      // Выполняем запрос
      const response: AxiosResponse<T> = await axios(requestConfig)
      console.log(`API Response: ${response.status} ${config.method} ${fullUrl}`, response.data)

      return response.data
    } catch (error) {
      return this.handleError<T>(error as AxiosError)
    }
  }

  /**
   * Обработка ошибок API
   */
  protected handleError<T>(error: AxiosError): Promise<ApiResponse<T>> {
    const { response } = error
    
    // Сохраняем исходное сообщение об ошибке
    const originalMessage = error.message || 'Неизвестная ошибка'
    
    // Данные об ошибке
    const errorData: ApiError = {
      status: response?.status || 0,
      message: 'Произошла ошибка при выполнении запроса',
      details: originalMessage
    }

    // Расширяем информацию об ошибке в зависимости от статуса ответа
    if (response) {
      const { status } = response
      
      switch (status) {
        case API_ERROR_CODES.UNAUTHORIZED:
          errorData.message = 'Требуется авторизация'
          break
        case API_ERROR_CODES.FORBIDDEN:
          errorData.message = 'Доступ запрещен'
          break
        case API_ERROR_CODES.NOT_FOUND:
          errorData.message = 'Ресурс не найден'
          break
        case API_ERROR_CODES.CONFLICT:
          errorData.message = 'Конфликт данных'
          break
        case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
          errorData.message = 'Внутренняя ошибка сервера'
          break
        default:
          if (status >= 400 && status < 500) {
            errorData.message = 'Ошибка в запросе'
          } else if (status >= 500) {
            errorData.message = 'Ошибка сервера'
          }
      }

      // Если есть данные ответа, добавляем их в детали ошибки
      if (response.data) {
        try {
          const responseData = response.data as any
          if (typeof responseData === 'object') {
            errorData.details = JSON.stringify(responseData)
          } else if (typeof responseData === 'string') {
            errorData.details = responseData
          }
        } catch (e) {
          console.error('Ошибка при разборе данных ответа:', e)
        }
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      errorData.message = 'Нет ответа от сервера'
      
      // Проверяем таймаут
      if (error.code === 'ECONNABORTED') {
        errorData.message = 'Превышено время ожидания ответа'
      }
    }

    console.error(`API Error: ${errorData.status} ${errorData.message}`, errorData.details)
    
    return Promise.reject(errorData)
  }
} 