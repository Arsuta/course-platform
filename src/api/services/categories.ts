import { BaseAPI, APIResponse } from '../base'
import { CATEGORIES } from '../endpoints'
import type { Category } from '../types'

export class CategoryService extends BaseAPI {
  async getAllCategories(): Promise<APIResponse<Category[]>> {
    return this.get(CATEGORIES.LIST)
  }
} 