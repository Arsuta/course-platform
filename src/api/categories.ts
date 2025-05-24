import { BaseAPI } from './base';
import type { Category } from './types';

export class CategoriesAPI extends BaseAPI {
  async getAllCategories(): Promise<Category[]> {
    const { data } = await this.api.get('/categories');
    return data;
  }
} 