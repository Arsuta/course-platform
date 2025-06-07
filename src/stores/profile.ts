import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '@/api/services'
import type { UserProfile } from '@/api/types'

export const useProfileStore = defineStore('profile', () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getProfile = async (): Promise<UserProfile | null> => {
    try {
      loading.value = true
      error.value = null
      const response = await profileService.getProfile()
      user.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке профиля'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      loading.value = true
      error.value = null
      const response = await profileService.updateProfile(profileData)
      user.value = response
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при обновлении профиля'
      return null
    } finally {
      loading.value = false
    }
  }

  const getEnrolledCourses = async () => {
    try {
      loading.value = true
      error.value = null
      return await profileService.getEnrolledCourses()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
      return []
    } finally {
      loading.value = false
    }
  }

  const getXp = async () => {
    try {
      loading.value = true
      error.value = null
      return await profileService.getXp()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке XP'
      return 0
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    getProfile,
    updateProfile,
    getEnrolledCourses,
    getXp
  }
}) 