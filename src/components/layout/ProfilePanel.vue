<script setup lang="ts">
import { 
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const menuItems = [
  { title: 'Настройки', path: '/settings', icon: CogIcon },
  { title: 'Выйти', path: '/auth/logout', icon: ArrowRightOnRectangleIcon }
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
    class="bg-white shadow-lg transition-all duration-500 ease-in-out cursor-pointer hover:shadow-xl hover:scale-[1.02] p-2"
    :class="[isCollapsed ? 'w-16' : 'w-64']"
  >
    <div class="mb-4">
      <UserCircleIcon class="h-6 w-6 text-gray-600 mx-auto" />
    </div>

    <div class="space-y-4 px-1">
      <!-- Профиль пользователя -->
      <div 
        class="flex items-center py-2 bg-gray-50 rounded-md transition-colors duration-500"
        :class="{ 'justify-center': isCollapsed, 'px-3': !isCollapsed }"
        @click.stop
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium bg-primary-light flex-shrink-0"
          :class="{ 'ml-2': isCollapsed }"
        >
          U
        </div>
        <div 
          class="ml-2 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :style="{ maxWidth: isCollapsed ? '0' : '200px', opacity: isCollapsed ? 0 : 1 }"
        >
          <h3 class="font-medium text-gray-900">Имя пользователя</h3>
          <p class="text-sm text-gray-500">user@example.com</p>
        </div>
      </div>

      <!-- Меню профиля -->
      <div class="space-y-1 px-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.title"
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
      </div>
    </div>
  </div>
</template>
