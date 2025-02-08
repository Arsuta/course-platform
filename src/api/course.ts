import { apiClient } from './client'
import type { Course, CourseResponse } from '@/types/course'

export const courseApi = {
  async getCourses(params?: { 
    page?: number
    limit?: number
    category?: string
    level?: string
    search?: string 
  }): Promise<CourseResponse> {
    try {
      const { data } = await apiClient.get('/courses', { params })
      return data
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      throw error
    }
  },

  async getCourse(id: number): Promise<Course> {
    try {
      const { data } = await apiClient.get(`/courses/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to fetch course ${id}:`, error)
      throw error
    }
  },

  async getPopularCourses(): Promise<Course[]> {
    try {
      const { data } = await apiClient.get('/courses/popular')
      return data
    } catch (error) {
      console.error('Failed to fetch popular courses:', error)
      throw error
    }
  },

  async enrollCourse(courseId: number): Promise<void> {
    try {
      await apiClient.post(`/courses/${courseId}/enroll`)
    } catch (error) {
      console.error(`Failed to enroll in course ${courseId}:`, error)
      throw error
    }
  },

  async getCourseProgress(courseId: number): Promise<number> {
    try {
      const { data } = await apiClient.get(`/courses/${courseId}/progress`)
      return data.progress
    } catch (error) {
      console.error(`Failed to fetch progress for course ${courseId}:`, error)
      throw error
    }
  }
}
