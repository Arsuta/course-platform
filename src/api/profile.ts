import { BaseAPI } from './base';
import type { UserProfile, Course } from './types';

export class ProfileAPI extends BaseAPI {
  async getProfile(): Promise<UserProfile> {
    const { data } = await this.api.get('/profile');
    return data;
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await this.api.put('/profile', profile);
    return data;
  }

  async getPurchasedCourses(): Promise<Course[]> {
    const { data } = await this.api.get('/profile/courses');
    return data;
  }

  async getTotalXP(): Promise<number> {
    const { data } = await this.api.get('/profile/xp');
    return data.total_xp;
  }
} 