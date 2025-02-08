import { courseApi } from '@/api/course'
import { courses } from '@/mocks/courses'
import type { Course } from '@/types/course'

export class CourseModel {
  static async getAllCourses(params?: {
    page?: number
    limit?: number
    category?: string
    level?: string
    search?: string
  }): Promise<Course[]> {
    try {
      const response = await courseApi.getCourses(params)
      return response.data
    } catch (error) {
      console.warn('Using mock data due to API error:', error)
      return courses
    }
  }

  static async getPopularCourses(): Promise<Course[]> {
    try {
      return await courseApi.getPopularCourses()
    } catch (error) {
      console.warn('Using mock data due to API error:', error)
      return courses
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
    }
  }

  static async getCourseById(id: number): Promise<Course | undefined> {
    try {
      return await courseApi.getCourse(id)
    } catch (error) {
      console.warn('Using mock data due to API error:', error)
      return courses.find(course => course.id === id)
    }
  }

  static async getCoursesByCategory(category: string): Promise<Course[]> {
    if (category === 'all') return courses
    return courses.filter(course => course.category === category)
  }

  static async enrollCourse(courseId: number): Promise<void> {
    try {
      await courseApi.enrollCourse(courseId)
    } catch (error) {
      console.error('Failed to enroll in course:', error)
      throw error
    }
  }

  static async getCourseProgress(courseId: number): Promise<number> {
    try {
      return await courseApi.getCourseProgress(courseId)
    } catch (error) {
      console.warn('Using mock data due to API error:', error)
      return 0
    }
  }
}
