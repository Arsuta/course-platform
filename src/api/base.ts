import axios, { AxiosInstance } from 'axios';

export class BaseAPI {
  protected api: AxiosInstance;
  protected token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: '', // Оставляем пустым, как requested
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Добавляем интерцептор для авторизации
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }
} 