import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { User } from '@/types/user'
import type { APIResponse } from '@/api/base'

export const useProfileStore = defineStore('profile', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getUserById = async (userId: string): Promise<APIResponse<User>> => {
    try {
      loading.value = true
      error.value = null
      return await api.profile.getUserById(userId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке профиля'
      throw e
    } finally {
      loading.value = false
    }
  }

  const followUser = async (userId: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await api.profile.followUser(userId)
      
      // Обновляем текущего пользователя после подписки
      if (user.value) {
        user.value.following = [...(user.value.following || []), userId]
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при подписке'
      throw e
    } finally {
      loading.value = false
    }
  }

  const unfollowUser = async (userId: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      await api.profile.unfollowUser(userId)
      
      // Обновляем текущего пользователя после отписки
      if (user.value?.following) {
        user.value.following = user.value.following.filter(id => id !== userId)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при отписке'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    getUserById,
    followUser,
    unfollowUser
  }
}) 