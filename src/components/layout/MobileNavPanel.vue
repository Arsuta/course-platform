<script setup lang="ts">
import { 
  HomeIcon, 
  AcademicCapIcon, 
  InformationCircleIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

const navItems = computed(() => [
  { title: 'Главная', path: '/', icon: HomeIcon },
  { title: 'Курсы', path: '/courses', icon: AcademicCapIcon },
  { title: 'О нас', path: '/about', icon: InformationCircleIcon },
  ...(user.value ? [
    { title: 'Профиль', path: `/profile/${user.value.id}`, icon: UserCircleIcon },
    { title: 'Настройки', path: '/settings', icon: CogIcon }
  ] : [
    { title: 'Войти', path: '/auth/login', icon: UserCircleIcon }
  ])
])

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
    <div class="flex justify-around items-center h-16 px-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-primary transition-colors px-1"
        :class="{ 'text-primary': $route.path.startsWith(item.path) }"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-xs mt-1 truncate w-full text-center">{{ item.title }}</span>
      </RouterLink>
      
      <button
        v-if="user"
        @click="handleLogout"
        class="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-primary transition-colors px-1"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span class="text-xs mt-1 truncate w-full text-center">Выйти</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-primary;
}
</style> 