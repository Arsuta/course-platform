import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { Category } from '@/api/types'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.categories.getAllCategories()
      categories.value = response.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке категорий'
      console.error('Failed to fetch categories:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}) 