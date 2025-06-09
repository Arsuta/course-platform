import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, AxiosHeaders } from 'axios';
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
          config.headers = {} as AxiosHeaders;
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
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      console.log(`GET запрос к ${url}`, config);
      const response: AxiosResponse = await this.client.get(url, config);
      
      // Логируем успешный ответ
      console.log(`Успешный GET ответ от ${url}:`, response.status);
      
      // Обрабатываем ответ
      return this.processResponse<T>(response);
    } catch (error) {
      // Логируем ошибки
      console.error(`Ошибка GET запроса к ${url}:`, error);
      return this.processError<T>(error as AxiosError);
    }
  }

  /**
   * Отправка POST запроса
   */
  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      console.log(`POST запрос к ${url}`, { data, config });
      const response: AxiosResponse = await this.client.post(url, data, config);
      
      // Логируем успешный ответ
      console.log(`Успешный POST ответ от ${url}:`, response.status);
      
      // Обрабатываем ответ
      return this.processResponse<T>(response);
    } catch (error) {
      // Логируем ошибки
      console.error(`Ошибка POST запроса к ${url}:`, error);
      return this.processError<T>(error as AxiosError);
    }
  }

  /**
   * Отправка PUT запроса
   */
  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      console.log(`PUT запрос к ${url}`, { data, config });
      const response: AxiosResponse = await this.client.put(url, data, config);
      
      // Логируем успешный ответ
      console.log(`Успешный PUT ответ от ${url}:`, response.status);
      
      // Обрабатываем ответ
      return this.processResponse<T>(response);
    } catch (error) {
      // Логируем ошибки
      console.error(`Ошибка PUT запроса к ${url}:`, error);
      return this.processError<T>(error as AxiosError);
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
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      console.log(`DELETE запрос к ${url}`, config);
      const response: AxiosResponse = await this.client.delete(url, config);
      
      // Логируем успешный ответ
      console.log(`Успешный DELETE ответ от ${url}:`, response.status);
      
      // Обрабатываем ответ
      return this.processResponse<T>(response);
    } catch (error) {
      // Логируем ошибки
      console.error(`Ошибка DELETE запроса к ${url}:`, error);
      return this.processError<T>(error as AxiosError);
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
   * Обработать успешный ответ от сервера
   */
  private processResponse<T>(response: AxiosResponse): ApiResponse<T> {
    // Проверяем, есть ли данные в ответе
    const data = response.data;
    
    // Сначала проверяем, есть ли поле data в ответе
    if (data && data.data !== undefined) {
      // Возвращаем данные из поля data
      return data as ApiResponse<T>;
    } else {
      // Если поля data нет, возвращаем весь ответ
      return data as ApiResponse<T>;
    }
  }

  /**
   * Обработать ошибку запроса
   */
  private processError<T>(error: AxiosError): ApiResponse<T> {
    // Если есть ответ от сервера, возвращаем его
    if (error.response) {
      const errorData = error.response.data as any;
      const errorMessage = errorData.message || error.message;
      
      throw new Error(errorMessage);
    }
    
    // Иначе возвращаем ошибку сети
    throw new Error(error.message || 'Ошибка сети');
  }

  /**
   * Выполнить запрос к API (для прямого использования axios)
   */
  protected async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Выполняем запрос через axios
      console.log(`Прямой запрос ${config.method} к ${config.url}`, config);
      const response: AxiosResponse = await axios(config);
      
      // Логируем успешный ответ
      console.log(`Успешный ответ на прямой запрос:`, response.status);
      
      // Обрабатываем ответ
      return this.processResponse<T>(response);
    } catch (error) {
      // Логируем ошибки
      console.error(`Ошибка прямого запроса:`, error);
      return this.processError<T>(error as AxiosError);
    }
  }
} 