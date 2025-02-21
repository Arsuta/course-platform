<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Course } from '@/types/course'
import LogoMain from './LogoMain.vue'
import LogoShort from './LogoShort.vue'
import { useSettingsStore } from '@/stores/settings'
import { CourseGradient } from '@/constants/gradients'

const settingsStore = useSettingsStore()
const isExpanded = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const isTransitioning = ref(false)

const selectedCourses = ref<Course[]>([
  {
    id: 1,
    title: 'Основы Vue.js 3',
    description: 'Изучите основы современного фреймворка Vue.js 3 с нуля',
    category: 'programming',
    level: 'beginner',
    image: 'https://picsum.photos/600/400?random=1',
    price: 0,
    isFree: true,
    rating: 4.8,
    studentsCount: 1234,
    duration: 1200,
    modules: [],
    skills: ['Vue.js 3', 'JavaScript', 'Composition API'],
    requirements: ['Базовые знания JavaScript'],
    author: {
      id: 1,
      name: 'Иван Петров',
      avatar: 'https://picsum.photos/100/100?random=1'
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    gradient: 'from-green-400 to-green-500' as CourseGradient
  }
])

const handleClickOutside = (event: MouseEvent) => {
  if (panelRef.value && !panelRef.value.contains(event.target as Node) && isExpanded.value) {
    isExpanded.value = false
    emit('update:blur', false)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emit = defineEmits(['update:blur'])

const togglePanel = (event: MouseEvent) => {
  event.stopPropagation()
  isTransitioning.value = true
  isExpanded.value = !isExpanded.value
  emit('update:blur', isExpanded.value)
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}
</script>

<template>
  <div 
    ref="panelRef"
    class="absolute top-0 left-0 z-50 w-full bg-gray-50"
  >
    <div class="relative">
      <!-- Закладка с логотипом -->
      <button 
        @click="togglePanel"
        class="absolute top-0 left-0 z-20 bg-white shadow-lg rounded-br-2xl overflow-hidden transition-all duration-1000 ease-in-out hover:shadow-xl"
        :class="[isExpanded ? 'p-4 scale-105' : 'p-3']"
      >
        <div class="relative w-[150px] h-12">
          <LogoMain
            :color="settingsStore.accentColor"
            class="absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out transform"
            :class="[
              isExpanded ? 'opacity-100 logo-rotate-expanded' : 'opacity-0 logo-rotate-collapsed',
              isTransitioning ? 'blur-sm' : ''
            ]"
          />
          <LogoShort
            :color="settingsStore.accentColor"
            class="absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out transform"
            :class="[
              isExpanded ? 'opacity-0 logo-rotate-collapsed' : 'opacity-100 logo-rotate-expanded',
              isTransitioning ? 'blur-sm' : ''
            ]"
          />
        </div>
      </button>

      <!-- Развернутая панель -->
      <transition
        enter-active-class="transition-all duration-1000 ease-in-out"
        enter-from-class="opacity-0 transform -translate-y-full"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-1000 ease-in-out"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-full"
      >
        <div 
          v-if="isExpanded"
          class="absolute top-0 left-0 w-full bg-white shadow-lg pt-20"
        >
          <div class="p-4">
            <div class="flex gap-4 overflow-x-auto pb-4">
              <div 
                v-for="course in selectedCourses" 
                :key="course.id"
                class="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 class="font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>Прогресс: 45%</span>
                  <button class="text-primary hover:text-primary-dark">
                    Продолжить
                  </button>
                </div>
              </div>

              <button class="flex-shrink-0 w-64 h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors">
                Добавить курс
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.scale-90 {
  transform: scale(0.9);
}

.scale-100 {
  transform: scale(1);
}

.logo-rotate-expanded {
  transform: rotate(360deg);
  transform-origin: center center;
}

.logo-rotate-collapsed {
  transform: rotate(0deg);
  transform-origin: center center;
}

@keyframes rotateExpand {
  0% {
    transform: rotate(0deg) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}

@keyframes rotateCollapse {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(0.9);
    opacity: 0;
  }
}

.logo-rotate-expanded {
  animation: rotateExpand 1s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
}

.logo-rotate-collapsed {
  animation: rotateCollapse 1s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
}
</style> 