import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { Course } from '@/api/types'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const popularCourses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCourses = async (page = 1, limit = 10) => {
    loading.value = true
    error.value = null
    try {
      courses.value = await api.courses.getAllCourses(page, limit)
    } catch (err) {
      error.value = 'Не удалось загрузить курсы'
      console.error('Failed to fetch courses:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPopularCourses = async (page = 1, limit = 10) => {
    loading.value = true
    error.value = null
    try {
      popularCourses.value = await api.courses.getAllCourses(page, limit)
    } catch (err) {
      error.value = 'Не удалось загрузить популярные курсы'
      console.error('Failed to fetch popular courses:', err)
    } finally {
      loading.value = false
    }
  }

  const getCoursesByCategory = async (categoryId: string, page = 1, limit = 10) => {
    loading.value = true
    error.value = null
    try {
      courses.value = await api.courses.getCoursesByCategory(categoryId, page, limit)
    } catch (err) {
      error.value = 'Не удалось загрузить курсы категории'
      console.error('Failed to fetch category courses:', err)
    } finally {
      loading.value = false
    }
  }

  const enrollCourse = async (courseId: string) => {
    error.value = null
    try {
      await api.courses.purchaseCourse(courseId)
      return true
    } catch (err) {
      error.value = 'Не удалось записаться на курс'
      console.error('Failed to enroll in course:', err)
      return false
    }
  }

  return {
    courses,
    popularCourses,
    loading,
    error,
    fetchCourses,
    fetchPopularCourses,
    getCoursesByCategory,
    enrollCourse
  }
}) 