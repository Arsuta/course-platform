<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'

const route = useRoute()
const authStore = useAuthStore()

const profileUser = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchUser = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Если id не указан или равен undefined, используем текущего пользователя
    const userId = route.params.id as string
    
    if (!userId || userId === 'undefined') {
      console.log('Sidebar: ID не указан, используем профиль текущего пользователя')
      // Используем данные текущего пользователя из authStore
      profileUser.value = authStore.currentUser as User
      
      // Если данных пользователя нет, загрузим их
      if (!profileUser.value) {
        const currentUserData = await authStore.loadUserProfile()
        profileUser.value = currentUserData as User
      }
    } else {
      console.log(`Sidebar: Загрузка профиля пользователя с ID: ${userId}`)
      const response = await authStore.getUserById(userId)
      profileUser.value = (response as any).data || response as User
    }
    
    if (!profileUser.value) {
      throw new Error('Не удалось загрузить данные пользователя')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке пользователя'
    profileUser.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUser()
})

// Проверяем, является ли текущий пользователь владельцем профиля
const isOwner = computed(() => {
  if (!route.params.id || route.params.id === 'undefined') {
    return true; // Если ID не указан, значит это текущий пользователь
  }
  return authStore.currentUser?.id === route.params.id
})

// Проверяем, подписан ли текущий пользователь на профиль
const isSubscribed = computed(() => {
  const currentUser = authStore.currentUser as User | null
  if (!currentUser || isOwner.value) return false
  return currentUser.following?.includes(route.params.id as string) || false
})

// Вычисляем прогресс XP до следующего уровня
const xpProgress = computed(() => {
  if (!profileUser.value) return 0
  const xpForNextLevel = (profileUser.value.level || 0) * 1000
  return ((profileUser.value.xp || 0) % xpForNextLevel) / xpForNextLevel * 100
})

// Обработчик подписки/отписки
const handleSubscribe = () => {
  if (!authStore.currentUser) return
  const userId = route.params.id as string
  if (isSubscribed.value) {
    authStore.unfollow(userId)
  } else {
    authStore.follow(userId)
  }
}
</script>

<template>
  <div v-if="loading" class="flex justify-center p-6">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="error" class="p-6 text-red-500 text-center">
    {{ error }}
  </div>

  <div v-else-if="profileUser" class="p-6 space-y-6">
    <!-- Аватар и имя -->
    <div class="text-center">
      <div class="relative inline-block">
        <img 
          :src="profileUser.avatar" 
          :alt="profileUser.name || ''"
          class="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
        />
        <div 
          class="absolute -bottom-2 -right-2 bg-primary text-white rounded-full px-3 py-1 text-sm font-medium shadow-md"
        >
          Lvl {{ profileUser.level || 0 }}
        </div>
      </div>
      <h2 class="mt-4 text-2xl font-bold text-gray-800">
        {{ profileUser.name || `${profileUser.first_name} ${profileUser.last_name}` }}
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