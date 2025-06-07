import { ref } from 'vue'

export function useLoading(initialState = false) {
  const isLoading = ref(initialState)
  const error = ref<string | null>(null)

  async function withLoading<T>(callback: () => Promise<T>): Promise<T> {
    try {
      isLoading.value = true
      error.value = null
      return await callback()
    } catch (e: any) {
      error.value = e.response?.data?.message || e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    withLoading
  }
} 