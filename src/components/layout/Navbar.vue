<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  HomeIcon, 
  AcademicCapIcon, 
  InformationCircleIcon,
  Bars3Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  PuzzlePieceIcon
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Переменная isCollapsed из props
const { isCollapsed } = defineProps<{
  isCollapsed: boolean
}>()

// Определяем emit событие toggle
const emit = defineEmits<{
  toggle: []
}>()

// Навигационные элементы в зависимости от статуса авторизации
const navItems = computed(() => {
  const baseItems = [
    { title: 'Главная', path: '/', icon: HomeIcon },
    { title: 'О нас', path: '/about', icon: InformationCircleIcon },
  ]

  if (authStore.isAuthenticated) {
    return [
      ...baseItems,
      { title: 'Курсы', path: '/courses', icon: AcademicCapIcon },
      { title: 'Мини-игры', path: '/games', icon: PuzzlePieceIcon },
      { 
        title: 'Профиль', 
        path: `/profile/${authStore.user?.id}`, 
        icon: UserIcon 
      },
      { title: 'Настройки', path: '/settings', icon: CogIcon },
    ]
  } else {
    return [
      ...baseItems,
      { title: 'Каталог курсов', path: '/courses/preview', icon: AcademicCapIcon },
      { title: 'Войти', path: '/login' },
      { title: 'Регистрация', path: '/register', variant: 'primary' },
    ]
  }
})

const handleAuthAction = () => {
  if (authStore.isAuthenticated) {
    authStore.logout()
    router.push('/')
  } else {
    router.push('/auth/login')
  }
}
</script>

<template>
  <nav
    @click="$emit('toggle')"
    class="bg-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer hover:shadow-xl hover:scale-[1.02] p-2 min-w-[64px]"
    :class="[isCollapsed ? 'w-16' : 'w-64']"
    style="min-height: fit-content;"
  >
    <div class="mb-4">
      <Bars3Icon class="h-6 w-6 text-gray-600 mx-auto" />
    </div>

    <div class="space-y-1 px-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center py-2 text-gray-800 hover:bg-primary-light hover:text-white rounded-md transition-colors duration-500"
        :class="{ 
          'justify-center': isCollapsed,
          'px-3': !isCollapsed,
          'bg-primary-light text-white': $route.path === item.path
        }"
        @click.stop
      >
        <component 
          v-if="'icon' in item"
          :is="item.icon" 
          class="h-5 w-5 flex-shrink-0"
          :class="{ 'ml-2': isCollapsed }"
        />
        <span 
          class="ml-3 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :style="{ maxWidth: isCollapsed ? '0' : '200px', opacity: isCollapsed ? 0 : 1 }"
        >
          {{ item.title }}
        </span>
      </RouterLink>

      <!-- Кнопка входа/выхода -->
      <button
        @click.stop="handleAuthAction"
        class="w-full flex items-center py-2 text-gray-800 hover:bg-primary-light hover:text-white rounded-md transition-colors duration-500"
        :class="{ 
          'justify-center': isCollapsed,
          'px-3': !isCollapsed
        }"
      >
        <ArrowRightOnRectangleIcon 
          class="h-5 w-5 flex-shrink-0"
          :class="{ 
            'ml-2': isCollapsed,
            'transform rotate-180': authStore.isAuthenticated 
          }"
        />
        <span 
          class="ml-3 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :style="{ maxWidth: isCollapsed ? '0' : '200px', opacity: isCollapsed ? 0 : 1 }"
        >
          {{ authStore.isAuthenticated ? 'Выйти' : 'Войти' }}
        </span>
      </button>
    </div>
  </nav>
</template>
