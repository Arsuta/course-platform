import { BaseAPI, APIResponse } from './base';
import type { UserProfile, Course } from './types';

export class ProfileAPI extends BaseAPI {
  async getProfile(): Promise<APIResponse<UserProfile>> {
    return this.get('/profile');
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    return this.put('/profile', profile);
  }

  async getPurchasedCourses(): Promise<APIResponse<Course[]>> {
    return this.get('/profile/courses');
  }

  async getTotalXP(): Promise<APIResponse<{ total_xp: number }>> {
    return this.get('/profile/xp');
  }
} 