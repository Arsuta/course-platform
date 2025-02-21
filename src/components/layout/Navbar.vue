<script setup lang="ts">
import { 
  HomeIcon, 
  AcademicCapIcon, 
  InformationCircleIcon,
  Bars3Icon 
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

const navItems = [
  { title: 'Главная', path: '/', icon: HomeIcon },
  { title: 'Курсы', path: '/courses', icon: AcademicCapIcon },
  { title: 'О нас', path: '/about', icon: InformationCircleIcon },
]

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()
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
  </nav>
</template>
