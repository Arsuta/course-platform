import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { Category } from '@/api/types'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      categories.value = await api.categories.getAllCategories()
    } catch (err) {
      error.value = 'Не удалось загрузить категории'
      console.error('Failed to fetch categories:', err)
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