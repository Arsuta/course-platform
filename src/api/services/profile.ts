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
  
  /**
   * Обновить количество XP
   * @param xpToAdd - количество XP для добавления к текущему значению
   */
  async updateXp(xpToAdd: number): Promise<ApiResponse<{ total_xp: number }>> {
    // Сначала получаем текущий XP
    const currentXp = await this.getXp();
    
    // Приводим ответ к нужному типу
    const currentXpData = currentXp as any;
    const totalXp = currentXpData.total_xp || 0;
    
    // Создаем объект с обновленным значением XP
    const updateData = {
      total_xp: totalXp + xpToAdd
    };
    
    console.log(`Обновляем XP: текущий ${totalXp} + новый ${xpToAdd} = ${updateData.total_xp}`);
    
    // Используем профиль для обновления XP, так как для /profile/xp нет PUT эндпоинта
    const response = await this.put<UserProfile>(API_PROFILE.UPDATE, updateData);
    
    // Преобразуем ответ в ожидаемый формат
    const updatedXp = (response as any)?.total_xp || totalXp + xpToAdd;
    return { total_xp: updatedXp } as ApiResponse<{ total_xp: number }>;
  }
} 