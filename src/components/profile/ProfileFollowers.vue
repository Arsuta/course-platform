<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'

const route = useRoute()
const profileStore = useProfileStore()

const loading = ref(false)
const error = ref<string | null>(null)
const followers = ref<User[]>([])
const totalFollowers = ref(0)
const currentPage = ref(1)
const perPage = ref(10)

// Добавить моковые данные для подписчиков
const mockFollowers = ref([
  {
    id: '1',
    first_name: 'Иван',
    last_name: 'Петров',
    email: 'ivan@example.com',
    avatar: '/avatars/user1.jpg',
    isFollowing: true
  },
  {
    id: '2',
    first_name: 'Анна',
    last_name: 'Сидорова',
    email: 'anna@example.com',
    avatar: '/avatars/user2.jpg',
    isFollowing: false
  },
  {
    id: '3',
    first_name: 'Алексей',
    last_name: 'Иванов',
    email: 'alex@example.com',
    avatar: '/avatars/user3.jpg',
    isFollowing: true
  }
])

// Заменить вызовы API на работу с моковыми данными
const getFollowers = async () => {
  loading.value = true
  try {
    // Имитация загрузки данных
    await new Promise(resolve => setTimeout(resolve, 500))
    followers.value = mockFollowers.value
  } catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке подписчиков'
  } finally {
    loading.value = false
  }
}

// Метод для отписки от пользователя
const unfollowUser = async (userId: string) => {
  try {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Обновляем статус подписки в моковых данных
    const follower = mockFollowers.value.find(f => f.id === userId)
    if (follower) {
      follower.isFollowing = false
    }
    
    // Обновляем отображаемый список
    followers.value = [...mockFollowers.value]
  } catch (err: any) {
    console.error('Ошибка при отписке:', err)
  }
}

// Метод для подписки на пользователя
const followUser = async (userId: string) => {
  try {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Обновляем статус подписки в моковых данных
    const follower = mockFollowers.value.find(f => f.id === userId)
    if (follower) {
      follower.isFollowing = true
    }
    
    // Обновляем отображаемый список
    followers.value = [...mockFollowers.value]
  } catch (err: any) {
    console.error('Ошибка при подписке:', err)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  const start = (page - 1) * perPage.value
  const end = start + perPage.value
  followers.value = followers.value.slice(start, end)
}

const isFollowing = (userId: string): boolean => {
  const currentUser = profileStore.user
  return currentUser?.following?.includes(userId) || false
}

onMounted(() => {
  getFollowers()
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <div v-else-if="followers.length === 0" class="text-center text-gray-500">
      Нет подписчиков
    </div>

    <div v-else class="grid gap-4">
      <div v-for="user in followers" :key="user.id" class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div class="flex items-center space-x-4">
          <img :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full">
          <div>
            <h3 class="font-medium">{{ user.first_name }} {{ user.last_name }}</h3>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        
        <button 
          v-if="isFollowing(user.id)"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
          @click="unfollowUser(user.id)"
        >
          Отписаться
        </button>
        <button 
          v-else
          class="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white"
          @click="followUser(user.id)"
        >
          Подписаться
        </button>
      </div>
    </div>

    <div v-if="totalFollowers > perPage" class="flex justify-center mt-4">
      <button 
        v-for="page in Math.ceil(totalFollowers / perPage)" 
        :key="page"
        :class="[
          'mx-1 px-3 py-1 rounded-md',
          currentPage === page 
            ? 'bg-primary text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        ]"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template> 