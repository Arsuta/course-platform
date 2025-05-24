<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Course } from '@/api/types'

interface Props {
  courses: Course[];
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'enroll', courseId: string): void;
}>()

const currentSlide = ref(0)
const slideWidth = ref(0)
const sliderContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  updateSlideWidth()
  window.addEventListener('resize', updateSlideWidth)
})

const updateSlideWidth = () => {
  if (sliderContainer.value) {
    slideWidth.value = sliderContainer.value.offsetWidth
  }
}

const nextSlide = () => {
  if (currentSlide.value < props.courses.length - 1) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}
</script>

<template>
  <div class="relative" ref="sliderContainer">
    <!-- Слайдер -->
    <div class="overflow-hidden">
      <div
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }"
      >
        <div
          v-for="course in courses"
          :key="course.id"
          class="w-full flex-shrink-0"
        >
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              :src="course.thumbnail"
              :alt="course.title"
              class="w-full h-64 object-cover"
            />
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="text-2xl font-bold text-primary">
                  {{ formatPrice(course.price) }}
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-yellow-400">★</span>
                  <span class="font-medium">{{ course.rating.toFixed(1) }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatDuration(course.duration) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{{ course.students_count }} студентов</span>
                </div>
              </div>

              <button
                @click="$emit('enroll', course.id)"
                class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Записаться на курс
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки навигации -->
    <button
      v-if="currentSlide > 0"
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      v-if="currentSlide < courses.length - 1"
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}

.bg-white {
  background-color: #ffffff;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
