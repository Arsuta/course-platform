import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesService } from '@/api/services'
import type { Category } from '@/api/types'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Загрузить все категории
  async function fetchCategories() {
    if (categories.value.length > 0) {
      return categories.value
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      const categoriesData = await categoriesService.getCategories()
      
      // Теперь getCategories() возвращает массив категорий напрямую
      categories.value = categoriesData
      return categoriesData
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке категорий'
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Получить категорию по ID
  function getCategoryById(id: string) {
    return categories.value.find(cat => cat.id === id) || null
  }
  
  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById
  }
}) 