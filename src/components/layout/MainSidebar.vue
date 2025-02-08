<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-auto lg:w-64"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="h-full flex flex-col">
      <!-- Кнопка закрытия на мобильных -->
      <div class="p-4 lg:hidden">
        <button
          class="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          @click="$emit('close')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Навигация -->
      <nav class="flex-1 px-4 py-4 space-y-2">
        <RouterLink
          v-for="item in [
            { to: '/', label: 'Главная', icon: 'home' },
            { to: '/courses', label: 'Курсы', icon: 'book' },
            { to: '/about', label: 'О нас', icon: 'info' }
          ]"
          :key="item.to"
          :to="item.to"
          class="flex items-center px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
</template> 