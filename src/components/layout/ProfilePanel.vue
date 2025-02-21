<script setup lang="ts">
import { 
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = authStore.currentUser

const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.push('/auth/login')
    window.location.reload() // Принудительно перезагружаем страницу для сброса состояния
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

const menuItems = [
  { title: 'Профиль', path: `/profile/${user?.id}`, icon: UserCircleIcon },
  { title: 'Настройки', path: '/settings', icon: CogIcon },
  { title: 'Выйти', action: handleLogout, icon: ArrowRightOnRectangleIcon }
]

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div
    @click="$emit('toggle')"
    class="bg-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer hover:shadow-xl hover:scale-[1.02] p-2 min-w-[72px]"
    :class="[isCollapsed ? 'w-[72px]' : 'w-64']"
    style="min-height: fit-content;"
  >
    <div class="mb-4">
      <UserCircleIcon class="h-6 w-6 text-gray-600 mx-auto" />
    </div>

    <div class="space-y-1 px-1">
      <!-- Профиль пользователя -->
      <div 
        class="flex items-center py-2 bg-gray-50 rounded-md transition-all duration-500 hover:bg-primary/5 cursor-pointer"
        :class="{ 'justify-center': isCollapsed, 'px-3': !isCollapsed }"
        @click.stop="router.push(`/profile/${user?.id}`)"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium bg-primary-light flex-shrink-0 overflow-hidden transition-transform duration-300 hover:scale-110"
          :class="{ 'ml-2': isCollapsed }"
        >
          <img 
            v-if="user?.avatar" 
            :src="user.avatar" 
            :alt="user.name"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ user?.name?.charAt(0) || 'U' }}</span>
        </div>
        <div 
          class="ml-2 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :style="{ maxWidth: isCollapsed ? '0' : '200px', opacity: isCollapsed ? 0 : 1 }"
        >
          <h3 class="font-medium text-gray-900">{{ user?.name || 'Гость' }}</h3>
          <p class="text-sm text-gray-500">{{ user?.email || 'Войдите в систему' }}</p>
        </div>
      </div>

      <!-- Меню профиля -->
      <div class="space-y-1 px-1">
        <template v-for="item in menuItems" :key="item.title">
          <RouterLink
            v-if="item.path"
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
          <button
            v-else
            @click.stop="item.action"
            class="w-full flex items-center py-2 text-gray-800 hover:bg-primary-light hover:text-white rounded-md transition-colors duration-500"
            :class="{ 
              'justify-center': isCollapsed,
              'px-3': !isCollapsed
            }"
          >
            <component 
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
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
