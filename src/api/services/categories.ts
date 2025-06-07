import { BaseApiService } from '../base';
import type { ApiResponse, Category } from '../types';

/**
 * Сервис для работы с категориями
 */
export class CategoriesService extends BaseApiService {
  /**
   * Получить список всех категорий
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.get<Category[]>('/categories');
  }

  /**
   * Получение категории по ID
   */
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return this.get<Category>(API_CATEGORIES.DETAILS(id));
  }
} 