<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()

// Создаем вычисляемое свойство для имени пользователя
const userName = computed(() => {
  const user = authStore.currentUser
  if (!user) return 'Пользователь'
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  } else if (user.first_name) {
    return user.first_name
  } else if (user.last_name) {
    return user.last_name
  } else {
    return user.email
  }
})

defineEmits<{
  'toggle-sidebar': []
}>()
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Логотип и кнопка меню -->
        <div class="flex items-center">
          <button
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            @click="$emit('toggle-sidebar')"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <RouterLink to="/" class="text-xl font-bold text-gray-900 ml-2">
            Course Platform
          </RouterLink>
        </div>

        <!-- Навигация -->
        <nav class="hidden lg:flex items-center space-x-4">
          <RouterLink
            v-for="item in [
              { to: '/', label: 'Главная' },
              { to: '/courses', label: 'Курсы' },
              { to: '/about', label: 'О нас' }
            ]"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- Профиль -->
        <div class="flex items-center">
          <RouterLink
            :to="`/profile/${authStore.currentUser?.id}`"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <img
              :src="authStore.currentUser?.avatar || '/images/default-avatar.png'"
              :alt="userName"
              class="w-8 h-8 rounded-full"
            />
            <span class="hidden lg:block">{{ userName }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template> 