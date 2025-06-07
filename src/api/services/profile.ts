import { BaseApiService } from '../base';
import { eduClient } from '../client';
import type { ApiResponse, UserProfile, Course } from '../types';
import { API_PROFILE } from '../constants';

/**
 * Сервис для работы с профилем пользователя
 */
export class ProfileService extends BaseApiService {
  constructor() {
    super(eduClient); // Используем eduClient для запросов к образовательному API
  }

  /**
   * Получить профиль пользователя
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    // Используем константу API_PROFILE.DETAILS из constants.ts
    return this.get<UserProfile>(API_PROFILE.DETAILS);
  }

  /**
   * Получить профиль пользователя по ID
   * Примечание: использует эндпоинт профиля вместо несуществующего /users
   */
  async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    // По документации API, нет отдельного метода для получения пользователя по ID
    // Используем профиль текущего пользователя в качестве замены
    console.log(`Запрос профиля пользователя с ID: ${id}, используем ${API_PROFILE.DETAILS} вместо /users/${id}`);
    
    if (!id || id === 'undefined') {
      console.warn('ID пользователя не определен, используем текущий профиль');
      return this.getProfile();
    }
    
    // В текущем API нет метода для получения профиля другого пользователя
    // Это заглушка, которая будет использовать getProfile в любом случае
    return this.getProfile();
  }

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.put<UserProfile>(API_PROFILE.UPDATE, profile);
  }

  // Методы для работы с аватаром и подписками удалены, т.к. они не соответствуют API

  /**
   * Получить список купленных курсов
   */
  async getEnrolledCourses(): Promise<ApiResponse<Course[]>> {
    return this.get<Course[]>(API_PROFILE.COURSES);
  }

  /**
   * Получить общее количество XP
   */
  async getXp(): Promise<ApiResponse<{ total_xp: number }>> {
    return this.get<{ total_xp: number }>(API_PROFILE.XP);
  }
} 