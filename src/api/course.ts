import type { Course, CourseResponse } from '@/types/course'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const courseApi = {
  async getPopular(): Promise<CourseResponse> {
    const response = await fetch(`${API_URL}/courses/popular`)
    if (!response.ok) {
      throw new Error('Failed to fetch popular courses')
    }
    return response.json()
  },

  async getCourse(id: number): Promise<Course> {
    const response = await fetch(`${API_URL}/courses/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch course ${id}`)
    }
    return response.json()
  }
}
