<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Интерфейс пользователя
interface User {
  id: number
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  followers: number[]
  following: number[]
}

// Получаем данные пользователя профиля
const profileUser = computed(() => {
  const profileId = Number(route.params.id)
  return authStore.getUserById(profileId)
})

// Получаем список подписчиков
const followers = computed<User[]>(() => {
  if (!profileUser.value?.followers) return []
  return profileUser.value.followers
    .map(id => authStore.getUserById(id))
    .filter((user): user is User => user !== null)
})

// Проверяем, подписан ли текущий пользователь на профиль
const isSubscribed = computed(() => {
  const currentUser = authStore.currentUser
  const profile = profileUser.value
  if (!currentUser?.following || !profile) return false
  return currentUser.following.includes(profile.id)
})

// Обработчик подписки/отписки
const handleSubscribe = (userId: number) => {
  if (!authStore.currentUser) return
  if (isSubscribed.value) {
    authStore.unfollow(userId)
  } else {
    authStore.follow(userId)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок с количеством подписчиков -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800">
        Подписчики
      </h3>
      <div class="text-sm text-gray-500">
        Всего: {{ followers.length }}
      </div>
    </div>

    <!-- Список подписчиков -->
    <div v-if="followers.length" class="grid gap-4 sm:grid-cols-2">
      <div 
        v-for="follower in followers" 
        :key="follower.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-4 flex items-center space-x-4">
          <!-- Аватар и информация -->
          <div 
            class="flex items-center space-x-4 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            @click="$router.push(`/profile/${follower.id}`)"
          >
            <img 
              :src="follower.avatar" 
              :alt="follower.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-800 truncate">
                {{ follower.name }}
              </h4>
              <p class="text-sm text-gray-500 truncate">
                {{ follower.email }}
              </p>
            </div>
          </div>

          <!-- Кнопка подписки -->
          <button
            v-if="authStore.currentUser?.id !== follower.id"
            @click="handleSubscribe(follower.id)"
            class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            :class="isSubscribed ? 
              'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
              'bg-primary text-white hover:bg-primary-dark'"
          >
            {{ isSubscribed ? 'Отписаться' : 'Подписаться' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Сообщение об отсутствии подписчиков -->
    <div 
      v-else 
      class="text-center py-12 text-gray-500"
    >
      У пользователя пока нет подписчиков
    </div>
  </div>
</template> 