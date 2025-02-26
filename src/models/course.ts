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
    return courses
  }

  static async getPopularCourses(): Promise<Course[]> {
    return courses
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  static async getCourseById(id: number): Promise<Course | undefined> {
    return courses.find(course => course.id === id)
  }

  static async getCoursesByCategory(category: string): Promise<Course[]> {
    if (category === 'all') return courses
    return courses.filter(course => course.category === category)
  }

  static async enrollCourse(courseId: number): Promise<void> {
    console.log('Enrolled in course:', courseId)
  }

  static async getCourseProgress(courseId: number): Promise<number> {
    return Math.floor(Math.random() * 100)
  }
}
