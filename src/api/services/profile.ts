import { BaseAPI } from '../base'
import type { User } from '@/types/user'
import type { APIResponse } from '../base'
import { PROFILE } from '../endpoints'
import type { UserProfile, Course } from '../types'

export class ProfileService extends BaseAPI {
  async getProfile(): Promise<APIResponse<User>> {
    return this.get<User>(PROFILE.ME)
  }

  async updateProfile(data: Partial<User>): Promise<APIResponse<User>> {
    return this.put<User>(PROFILE.UPDATE, data)
  }

  async getUserById(userId: string): Promise<APIResponse<User>> {
    return this.get<User>(PROFILE.USER(userId))
  }

  async followUser(userId: string): Promise<APIResponse<void>> {
    return this.post<void>(PROFILE.FOLLOW(userId))
  }

  async unfollowUser(userId: string): Promise<APIResponse<void>> {
    return this.delete<void>(PROFILE.UNFOLLOW(userId))
  }

  async addXP(xp: number): Promise<APIResponse<User>> {
    return this.post<User>(PROFILE.ADD_XP, { xp })
  }

  async getPurchasedCourses(): Promise<APIResponse<Course[]>> {
    return this.get(PROFILE.COURSES)
  }

  async getTotalXP(): Promise<APIResponse<{ total_xp: number }>> {
    return this.get(PROFILE.XP)
  }
} 