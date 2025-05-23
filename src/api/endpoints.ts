import type { AxiosResponse } from 'axios'
import apiClient from './client'
import type {
  Course,
  Lesson,
  UserProfile,
  CourseProgress,
  PaginationQuery,
  PaginatedResponse
} from '@/types/api'

// Courses API
export const coursesApi = {
  // Получить список всех курсов
  getAll: (params?: PaginationQuery): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get('/courses', { params })
  },

  // Получить курс по ID
  getById: (id: string): Promise<AxiosResponse<Course>> => {
    return apiClient.get(`/courses/${id}`)
  },

  // Получить курсы по категории
  getByCategory: (categoryId: string, params?: PaginationQuery): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get(`/courses/category/${categoryId}`, { params })
  },

  // Создать новый курс
  create: (course: Partial<Course>): Promise<AxiosResponse<Course>> => {
    return apiClient.post('/courses', course)
  },

  // Обновить курс
  update: (id: string, course: Partial<Course>): Promise<AxiosResponse<Course>> => {
    return apiClient.put(`/courses/${id}`, course)
  },

  // Удалить курс
  delete: (id: string): Promise<AxiosResponse<void>> => {
    return apiClient.delete(`/courses/${id}`)
  },

  // Купить курс
  purchase: (courseId: string): Promise<AxiosResponse<any>> => {
    return apiClient.post('/student/courses/purchase', { course_id: courseId })
  }
}

// Lessons API
export const lessonsApi = {
  // Получить список уроков курса
  getByCourse: (courseId: string): Promise<AxiosResponse<Lesson[]>> => {
    return apiClient.get(`/student/courses/${courseId}/lessons`)
  },

  // Получить урок по ID
  getById: (lessonId: string): Promise<AxiosResponse<Lesson>> => {
    return apiClient.get(`/student/lessons/${lessonId}`)
  },

  // Отметить урок как просмотренный
  markAsViewed: (lessonId: string): Promise<AxiosResponse<any>> => {
    return apiClient.post(`/progress/lessons/${lessonId}/view`)
  },

  // Отправить ответы на тест
  submitTest: (lessonId: string, answers: Record<string, number>): Promise<AxiosResponse<any>> => {
    return apiClient.post(`/progress/lessons/${lessonId}/test`, answers)
  }
}

// Profile API
export const profileApi = {
  // Получить профиль пользователя
  get: (): Promise<AxiosResponse<UserProfile>> => {
    return apiClient.get('/profile')
  },

  // Обновить профиль
  update: (profile: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> => {
    return apiClient.put('/profile', profile)
  },

  // Получить купленные курсы
  getPurchasedCourses: (): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get('/profile/courses')
  },

  // Получить общий XP
  getTotalXp: (): Promise<AxiosResponse<{ total_xp: number }>> => {
    return apiClient.get('/profile/xp')
  }
}

// Progress API
export const progressApi = {
  // Получить прогресс по курсу
  getCourseProgress: (courseId: string): Promise<AxiosResponse<CourseProgress>> => {
    return apiClient.get(`/progress/courses/${courseId}`)
  }
}

// Admin API
export const adminApi = {
  // Получить список курсов на модерации
  getPendingCourses: (params?: PaginationQuery): Promise<AxiosResponse<Course[]>> => {
    return apiClient.get('/admin/courses/pending', { params })
  },

  // Одобрить курс
  approveCourse: (courseId: string): Promise<AxiosResponse<any>> => {
    return apiClient.post(`/admin/courses/${courseId}/approve`)
  },

  // Отклонить курс
  rejectCourse: (courseId: string, reason: string): Promise<AxiosResponse<any>> => {
    return apiClient.post(`/admin/courses/${courseId}/reject`, { reason })
  }
} 