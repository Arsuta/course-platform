import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/api/types'
import { api } from '@/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Загрузить все категории
  const fetchCategories = async () => {
    if (categories.value.length > 0) {
      return categories.value
    }
    
    try {
      loading.value = true
      error.value = null
      
      const response = await api.categories.getCategories()
      if (response && response.data) {
        categories.value = response.data
      }
      return categories.value
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке категорий'
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Получить категорию по ID
  const getCategoryById = (id: string) => {
    return categories.value.find(category => category.id === id)
  }
  
  // Получить все категории
  const getAllCategories = computed(() => categories.value)
  
  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getAllCategories
  }
}) 