import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosHeaders } from 'axios';
import { apiClient } from './client';
import type { ApiResponse } from './types';

/**
 * Базовый класс для API сервисов
 */
export class BaseApiService {
  protected client: AxiosInstance;
  private lastRequestTime: number = 0;
  private readonly MIN_REQUEST_INTERVAL: number = 500; // минимальный интервал между запросами (в мс)

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
    this.setupInterceptors();
  }

  /**
   * Настройка перехватчиков запросов и ответов
   */
  private setupInterceptors() {
    // Перехватчик запросов для добавления задержки и заголовков CORS
    this.client.interceptors.request.use(
      async (config) => {
        await this.ensureRequestDelay();
        
        // Добавляем заголовки для работы с CORS
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        
        // Удаляем проблемные заголовки, вызывающие ошибки
        // config.headers.set('Origin', window.location.origin);
        // config.headers.set('Access-Control-Request-Method', config.method?.toUpperCase() || 'GET');
        
        // Журналирование запроса без дублирования baseURL
        console.log(`Отправка ${config.method?.toUpperCase()} запроса на ${config.url}`, {
          headers: config.headers,
          data: config.data
        });
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Обеспечивает минимальную задержку между запросами
   */
  private async ensureRequestDelay(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    
    if (elapsed < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - elapsed;
      console.log(`Добавляем задержку ${delay}мс между запросами`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Отправка GET запроса
   */
  protected async get<R>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const response = await this.client.get<ApiResponse<R>>(url, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Отправка POST запроса
   */
  protected async post<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      // Убираем дублирование baseURL в логах
      console.log(`POST ${url}`, { data });
      const response = await this.client.post<ApiResponse<R>>(url, data, config);
      console.log(`Ответ от сервера [POST ${url}]:`, { 
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data 
      });
      return response.data;
    } catch (error: any) {
      console.error(`Ошибка при выполнении POST ${url}:`, error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Отправка PUT запроса
   */
  protected async put<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const response = await this.client.put<ApiResponse<R>>(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Отправка PATCH запроса
   */
  protected async patch<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    const response = await this.client.patch<ApiResponse<R>>(url, data, config);
    return response.data;
  }

  /**
   * Отправка DELETE запроса
   */
  protected async delete<R>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
    try {
      const response = await this.client.delete<ApiResponse<R>>(url, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Замена параметров в URL
   * Например: replaceUrlParams('/users/:id', { id: 1 }) => '/users/1'
   */
  protected replaceUrlParams(url: string, params: Record<string, string | number>): string {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, String(value));
    });
    return result;
  }

  /**
   * Обработка ошибок API
   */
  private handleError(error: any) {
    if (error.response) {
      // Ошибка от сервера
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.response?.config?.url,
        method: error.response?.config?.method,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Детальное логирование различных типов ошибок
      if (error.response.status === 401) {
        console.error('Ошибка авторизации: Не авторизован (401)');
      } else if (error.response.status === 403) {
        console.error('Ошибка доступа: Запрещено (403)');
      } else if (error.response.status === 404) {
        console.error('Ресурс не найден (404):', error.response?.config?.url);
      } else if (error.response.status === 500) {
        console.error('Внутренняя ошибка сервера (500)');
      } else if (error.response.status === 409) {
        console.error('Конфликт данных (409):', error.response.data);
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('API No Response:', {
        request: error.request,
        url: error.config?.url,
        method: error.config?.method
      });
      console.error('Не получен ответ от сервера. Проверьте подключение к интернету или доступность сервера.');
    } else {
      // Произошла ошибка при настройке запроса
      console.error('API Request Error:', error.message);
      console.error('Детали ошибки:', error);
    }
    
    // Ошибка rate limit - логируем отдельно
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit exceeded. Waiting before next request...');
    }
  }
} 