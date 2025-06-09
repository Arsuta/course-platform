import { BaseApiService } from '../base';
import { authClient } from '../client';
import type { ApiResponse, TokenPair, UserLogin, UserCreate, VerificationRequest, 
  PasswordResetRequest, PasswordResetConfirm, RefreshInput } from '../types';
import { API_AUTH } from '../constants';

/**
 * Сервис для работы с авторизацией
 */
export class AuthService extends BaseApiService {
  constructor() {
    super(authClient);
  }
  
  /**
   * Аутентификация пользователя (первый шаг)
   */
  async login(credentials: UserLogin): Promise<ApiResponse<string> | TokenPair> {
    console.log(`Отправка запроса на вход по адресу: ${API_AUTH.LOGIN}`);
    
    try {
      // Отправляем запрос напрямую, без использования базового метода
      const response = await this.client.post(API_AUTH.LOGIN, credentials);
      console.log('Ответ от сервера [POST login]:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data 
      });
      
      // Если получили verification_id, сохраняем его для использования при верификации
      if (response.data && response.data.verification_id) {
        localStorage.setItem('verification_id', response.data.verification_id);
      }
      
      // Проверяем, есть ли в ответе токены напрямую (одноэтапная авторизация)
      if (response.data && response.data.access_token && response.data.refresh_token) {
        console.log('Получены токены напрямую после входа (без верификации)');
        return response.data as TokenPair;
      }
      
      // Иначе возвращаем данные для верификации
      return response.data;
    } catch (error: any) {
      console.error(`Ошибка при выполнении POST login:`, error);
      
      // Логируем подробности ошибки
      if (error.response) {
        console.error('Ошибка API:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Подтверждение входа (второй шаг)
   */
  async verifyLogin(data: VerificationRequest): Promise<ApiResponse<TokenPair> | TokenPair> {
    console.log(`Отправка запроса на верификацию входа по адресу: ${API_AUTH.VERIFY_LOGIN}`);
    console.log('Данные для верификации входа:', data);
    
    // Формируем запрос в формате, который ожидает сервер
    const verificationData = {
      code: data.code,
      email: data.email,
      // Серверу нужен verification_id, который был получен при логине
      verification_id: localStorage.getItem('verification_id') || undefined
    };
    
    console.log('Отправляемые данные для верификации входа:', verificationData);
    
    try {
      // Отправляем запрос с правильным URL
      const response = await this.client.post(API_AUTH.VERIFY_LOGIN, verificationData);
      console.log('Ответ от сервера [POST verify-login]:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data 
      });
      
      // Возвращаем данные напрямую, так как они могут быть токенами, а не обернуты в ApiResponse
      return response.data;
    } catch (error: any) {
      console.error(`Ошибка при выполнении POST verify-login:`, error);
      
      // Логируем подробности ошибки
      if (error.response) {
        console.error('Ошибка API верификации входа:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Регистрация нового пользователя (первый шаг)
   */
  async register(userData: UserCreate): Promise<ApiResponse<string>> {
    console.log(`Отправка запроса на регистрацию по адресу: ${API_AUTH.REGISTER}`);
    console.log('Данные для регистрации:', userData);
    
    try {
      const response = await this.post<string>(API_AUTH.REGISTER, userData);
      
      // Если получили verification_id в ответе, сохраняем его
      if (response && typeof response === 'object' && 'verification_id' in response) {
        localStorage.setItem('verification_id', response.verification_id as string);
      }
      
      console.log('Ответ API регистрации (сервис):', response);
      return response;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  }
  
  /**
   * Подтверждение email при регистрации (второй шаг)
   */
  async verifyEmail(data: VerificationRequest): Promise<ApiResponse<TokenPair> | TokenPair> {
    console.log(`Отправка запроса на верификацию email по адресу: ${API_AUTH.VERIFY_EMAIL}`);
    console.log('Данные для верификации:', data);
    
    // Формируем запрос в формате, который ожидает сервер
    const verificationData = {
      code: data.code,
      email: data.email,
      // Серверу нужен verification_id, который был получен при регистрации
      verification_id: localStorage.getItem('verification_id') || undefined
    };
    
    console.log('Отправляемые данные:', verificationData);
    
    try {
      // Отправляем запрос с правильным URL
      const response = await this.client.post(API_AUTH.VERIFY_EMAIL, verificationData);
      console.log('Ответ от сервера [POST verify-email]:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: response.headers,
        data: response.data 
      });
      
      // Возвращаем данные напрямую, так как они могут быть токенами, а не обернуты в ApiResponse
      return response.data;
    } catch (error: any) {
      console.error(`Ошибка при выполнении POST verify-email:`, error);
      
      // Логируем подробности ошибки
      if (error.response) {
        console.error('Ошибка API:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Запрос на сброс пароля
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<string>> {
    console.log(`Отправка запроса на сброс пароля по адресу: ${API_AUTH.RESET_PASSWORD_REQUEST}`);
    return this.post<string>(API_AUTH.RESET_PASSWORD_REQUEST, data);
  }
  
  /**
   * Подтверждение сброса пароля
   */
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<string>> {
    console.log(`Отправка запроса на подтверждение сброса пароля по адресу: ${API_AUTH.RESET_PASSWORD_CONFIRM}`);
    return this.post<string>(API_AUTH.RESET_PASSWORD_CONFIRM, data);
  }
  
  /**
   * Обновление токена доступа
   */
  async refreshToken(data: RefreshInput): Promise<ApiResponse<TokenPair>> {
    console.log(`Отправка запроса на обновление токена по адресу: ${API_AUTH.REFRESH}`);
    return this.post<TokenPair>(API_AUTH.REFRESH, data);
  }
  
  /**
   * OAuth авторизация через Google
   */
  async googleAuth(): Promise<ApiResponse<TokenPair>> {
    console.log(`Отправка запроса на OAuth авторизацию по адресу: ${API_AUTH.OAUTH_GOOGLE}`);
    return this.get<TokenPair>(API_AUTH.OAUTH_GOOGLE);
  }

  /**
   * Изменение пароля пользователя
   */
  async changePassword(data: { old_password: string; new_password: string }): Promise<ApiResponse<any>> {
    console.log(`Отправка запроса на изменение пароля по адресу: ${API_AUTH.CHANGE_PASSWORD}`);
    return this.post<any>(API_AUTH.CHANGE_PASSWORD, data);
  }
} 