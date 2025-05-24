import { BaseAPI, APIResponse } from './base';
import type { Category } from './types';

export class CategoriesAPI extends BaseAPI {
  async getAllCategories(): Promise<APIResponse<Category[]>> {
    return this.get('/categories');
  }
} 