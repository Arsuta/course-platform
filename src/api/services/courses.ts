import { BaseAPI } from '../base'
import type { Course, PaginationQuery, PaginatedResponse } from '@/types/course'
import type { APIResponse } from '../base'
import { COURSES } from '../endpoints'

export class CourseService extends BaseAPI {
  async getAllCourses(params: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get<PaginatedResponse<Course>>(COURSES.LIST, { params })
  }

  async getCourseById(id: string): Promise<APIResponse<Course>> {
    return this.get<Course>(COURSES.DETAIL(id))
  }

  async getCoursesByCategory(categoryId: string, params: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get<PaginatedResponse<Course>>(COURSES.CATEGORY(categoryId), { params })
  }

  async purchaseCourse(courseId: string): Promise<APIResponse<void>> {
    return this.post<void>(COURSES.PURCHASE, { courseId })
  }

  async searchCourses(query: string, params: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get<PaginatedResponse<Course>>(COURSES.LIST, { 
      params: {
        ...params,
        search: query,
        sort_by: 'relevance',
        order: 'desc'
      }
    })
  }

  async getCourseLessons(courseId: string): Promise<APIResponse<Course>> {
    return this.get<Course>(COURSES.LESSONS(courseId))
  }
} 