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
const following = ref<User[]>([])
const totalFollowing = ref(0)
const currentPage = ref(1)
const perPage = ref(10)

const fetchFollowing = async () => {
  try {
    loading.value = true
    error.value = null
    
    const userId = route.params.id as string
    if (!userId) return
    
    const response = await profileStore.getUserById(userId)
    const user = response.data
    
    if (user.following) {
      following.value = []
      totalFollowing.value = user.following.length
      
      // Получаем информацию о каждом подписчике
      const followingPromises = user.following.map((id: string) => 
        profileStore.getUserById(id)
      )
      
      const followingResponses = await Promise.all(followingPromises)
      following.value = followingResponses.map((response: ApiResponse<User>) => response.data)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке подписок'
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  const start = (page - 1) * perPage.value
  const end = start + perPage.value
  following.value = following.value.slice(start, end)
}

onMounted(() => {
  fetchFollowing()
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

    <div v-else-if="following.length === 0" class="text-center text-gray-500">
      Нет подписок
    </div>

    <div v-else class="grid gap-4">
      <div v-for="user in following" :key="user.id" class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div class="flex items-center space-x-4">
          <img :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full">
          <div>
            <h3 class="font-medium">{{ user.first_name }} {{ user.last_name }}</h3>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        
        <button 
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
          @click="profileStore.unfollowUser(user.id)"
        >
          Отписаться
        </button>
      </div>
    </div>

    <div v-if="totalFollowing > perPage" class="flex justify-center mt-4">
      <button 
        v-for="page in Math.ceil(totalFollowing / perPage)" 
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