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

// Получаем список подписок
const following = computed<User[]>(() => {
  if (!profileUser.value?.following) return []
  return profileUser.value.following
    .map(id => authStore.getUserById(id))
    .filter((user): user is User => user !== null)
})

// Проверяем, подписан ли текущий пользователь на профиль
const isSubscribedTo = (userId: number) => {
  const currentUser = authStore.currentUser
  if (!currentUser?.following) return false
  return currentUser.following.includes(userId)
}

// Обработчик подписки/отписки
const handleSubscribe = (userId: number) => {
  if (!authStore.currentUser) return
  if (isSubscribedTo(userId)) {
    authStore.unfollow(userId)
  } else {
    authStore.follow(userId)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок с количеством подписок -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800">
        Подписки
      </h3>
      <div class="text-sm text-gray-500">
        Всего: {{ following.length }}
      </div>
    </div>

    <!-- Список подписок -->
    <div v-if="following.length" class="grid gap-4 sm:grid-cols-2">
      <div 
        v-for="user in following" 
        :key="user.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-4 flex items-center space-x-4">
          <!-- Аватар и информация -->
          <div 
            class="flex items-center space-x-4 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            @click="$router.push(`/profile/${user.id}`)"
          >
            <img 
              :src="user.avatar" 
              :alt="user.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-800 truncate">
                {{ user.name }}
              </h4>
              <p class="text-sm text-gray-500 truncate">
                {{ user.email }}
              </p>
            </div>
          </div>

          <!-- Кнопка подписки -->
          <button
            v-if="authStore.currentUser?.id !== user.id"
            @click="handleSubscribe(user.id)"
            class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            :class="isSubscribedTo(user.id) ? 
              'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
              'bg-primary text-white hover:bg-primary-dark'"
          >
            {{ isSubscribedTo(user.id) ? 'Отписаться' : 'Подписаться' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Сообщение об отсутствии подписок -->
    <div 
      v-else 
      class="text-center py-12 text-gray-500"
    >
      Пользователь ни на кого не подписан
    </div>
  </div>
</template> 