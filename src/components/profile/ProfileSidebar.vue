<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Получаем данные пользователя профиля
const profileUser = computed(() => {
  const profileId = Number(route.params.id)
  return authStore.getUserById(profileId)
})

// Проверяем, является ли текущий пользователь владельцем профиля
const isOwner = computed(() => {
  return authStore.currentUser?.id === Number(route.params.id)
})

// Проверяем, подписан ли текущий пользователь на профиль
const isSubscribed = computed(() => {
  if (!authStore.currentUser || isOwner.value) return false
  return authStore.currentUser.following?.includes(Number(route.params.id)) || false
})

// Вычисляем прогресс XP до следующего уровня
const xpProgress = computed(() => {
  if (!profileUser.value) return 0
  const xpForNextLevel = profileUser.value.level * 1000
  return (profileUser.value.xp % xpForNextLevel) / xpForNextLevel * 100
})

// Обработчик подписки/отписки
const handleSubscribe = () => {
  if (!authStore.currentUser) return
  if (isSubscribed.value) {
    authStore.unfollow(Number(route.params.id))
  } else {
    authStore.follow(Number(route.params.id))
  }
}
</script>

<template>
  <div v-if="profileUser" class="p-6 space-y-6">
    <!-- Аватар и имя -->
    <div class="text-center">
      <div class="relative inline-block">
        <img 
          :src="profileUser.avatar" 
          :alt="profileUser.name"
          class="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
        />
        <div 
          class="absolute -bottom-2 -right-2 bg-primary text-white rounded-full px-3 py-1 text-sm font-medium shadow-md"
        >
          Lvl {{ profileUser.level }}
        </div>
      </div>
      <h2 class="mt-4 text-2xl font-bold text-gray-800">
        {{ profileUser.name }}
      </h2>
      <p class="text-gray-500">{{ profileUser.email }}</p>
    </div>

    <!-- Прогресс XP -->
    <div class="space-y-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>XP до следующего уровня</span>
        <span>{{ Math.floor(xpProgress) }}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500"
          :style="{ width: `${xpProgress}%` }"
        />
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-800">
          {{ profileUser.followers?.length || 0 }}
        </div>
        <div class="text-sm text-gray-500">Подписчиков</div>
      </div>
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="text-2xl font-bold text-gray-800">
          {{ profileUser.following?.length || 0 }}
        </div>
        <div class="text-sm text-gray-500">Подписок</div>
      </div>
    </div>

    <!-- Кнопка подписки -->
    <button
      v-if="!isOwner && authStore.currentUser"
      @click="handleSubscribe"
      class="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300"
      :class="isSubscribed ? 
        'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
        'bg-primary text-white hover:bg-primary-dark'"
    >
      {{ isSubscribed ? 'Отписаться' : 'Подписаться' }}
    </button>
  </div>
</template> 