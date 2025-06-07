import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { coursesService } from '@/api/services'
import type { Course } from '@/api/types'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const popularCourses = ref<Course[]>([])
  const currentCourse = ref<Course | null>(null)
  const enrolledCourses = ref<Course[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Загрузить все курсы
  async function fetchCourses(params?: { page?: number; limit?: number; category_id?: string }) {
    try {
      isLoading.value = true
      error.value = null
      
      // Если передан category_id, используем метод getCoursesByCategory
      if (params?.category_id) {
        const categoryId = params.category_id
        const { page, limit } = params
        const response = await coursesService.getCoursesByCategory(categoryId, { page, limit })
        courses.value = response.data || []
        return courses.value
      } else {
        // Иначе получаем все курсы
        const response = await coursesService.getCourses(params)
        courses.value = response.data || []
        return courses.value
      }
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке курсов'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Загрузить популярные курсы
  async function fetchPopularCourses(limit = 6) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await coursesService.getCourses({ limit })
      popularCourses.value = response.data || []
      return popularCourses.value
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке популярных курсов'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Загрузить детали курса
  async function fetchCourseById(id: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await coursesService.getCourse(id)
      currentCourse.value = response.data || null
      return currentCourse.value
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке курса'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // Купить курс
  async function purchaseCourse(courseId: string) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await coursesService.purchaseCourse(courseId)
      
      if (response.success) {
        // После успешной покупки можно получить обновленный список курсов
        await fetchEnrolledCourses()
        return true
      }
      
      return false
    } catch (err: any) {
      error.value = err.message || 'Ошибка при покупке курса'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Загрузить купленные курсы через profileService
  async function fetchEnrolledCourses() {
    try {
      isLoading.value = true
      error.value = null
      
      // Используем profileService для получения купленных курсов
      // Этот метод должен быть реализован в profileStore
      const { profileService } = await import('@/api/services')
      const response = await profileService.getEnrolledCourses()
      
      enrolledCourses.value = response.data || []
      return enrolledCourses.value
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке купленных курсов'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    courses,
    popularCourses,
    currentCourse,
    enrolledCourses,
    isLoading,
    error,
    fetchCourses,
    fetchPopularCourses,
    fetchCourseById,
    fetchEnrolledCourses,
    purchaseCourse
  }
}) 