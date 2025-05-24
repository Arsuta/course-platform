import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { Course, PaginationQuery, PaginatedResponse, Lesson, APIResponse } from '@/types/course'

export const useCourseStore = defineStore('courses', () => {
  const popularCourses = ref<Course[]>([])
  const coursesByCategory = ref<Course[]>([])
  const searchResults = ref<Course[]>([])
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPopularCourses = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.getAllCourses({ 
        page: 1, 
        per_page: 10,
        sort_by: 'rating',
        order: 'desc'
      })
      popularCourses.value = response.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
      console.error('Error fetching popular courses:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchCoursesByCategory = async (categoryId: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.getCoursesByCategory(categoryId, {
        page: 1,
        per_page: 10
      })
      coursesByCategory.value = response.data.data
      courses.value = response.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
      console.error('Error fetching courses by category:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (courseId: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.getCourseById(courseId)
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курса'
      throw e
    } finally {
      loading.value = false
    }
  }

  const searchCourses = async (query: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.searchCourses(query, {
        page: 1,
        per_page: 10
      })
      searchResults.value = response.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при поиске курсов'
      console.error('Error searching courses:', e)
    } finally {
      loading.value = false
    }
  }

  const enrollCourse = async (courseId: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      await api.courses.purchaseCourse(courseId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при записи на курс'
      console.error('Error enrolling in course:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchCourses = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.getAllCourses({ 
        page: 1, 
        per_page: 10
      })
      courses.value = response.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
      console.error('Error fetching courses:', e)
    } finally {
      loading.value = false
    }
  }

  const getCourseLessons = async (courseId: string): Promise<APIResponse<Lesson[]>> => {
    try {
      loading.value = true
      error.value = null
      const response = await api.courses.getCourseLessons(courseId)
      return {
        data: response.data as unknown as Lesson[],
        status: response.status,
        message: response.message
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке уроков'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    popularCourses,
    coursesByCategory,
    searchResults,
    courses,
    loading,
    error,
    fetchPopularCourses,
    fetchCoursesByCategory,
    fetchCourseById,
    searchCourses,
    enrollCourse,
    fetchCourses,
    getCourseLessons
  }
}) 