import { apiClient } from './client'
import type { AxiosRequestConfig } from 'axios'

export interface APIResponse<T> {
  data: T
  status: number
  message?: string
}

export interface APIError {
  message: string
  status: number
  code?: string
}

export class BaseAPI {
  protected token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await apiClient.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      }
    })
    return {
      data: response.data,
      status: response.status,
      message: response.statusText
    }
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await apiClient.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      }
    })
    return {
      data: response.data,
      status: response.status,
      message: response.statusText
    }
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await apiClient.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      }
    })
    return {
      data: response.data,
      status: response.status,
      message: response.statusText
    }
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await apiClient.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      }
    })
    return {
      data: response.data,
      status: response.status,
      message: response.statusText
    }
  }
} 