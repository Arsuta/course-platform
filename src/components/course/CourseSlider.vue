<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Course } from '@/api/types'

const props = defineProps<{
  courses: Course[]
  formatPrice: (price: number) => string
}>()

const emit = defineEmits<{
  (e: 'enroll', courseId: number): void
}>()

const currentSlide = ref(0)
const slidesPerView = ref(3)

const updateSlidesPerView = () => {
  if (window.innerWidth < 640) {
    slidesPerView.value = 1
  } else if (window.innerWidth < 1024) {
    slidesPerView.value = 2
  } else {
    slidesPerView.value = 3
  }
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})

const nextSlide = () => {
  if (currentSlide.value < props.courses.length - slidesPerView.value) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}
</script>

<template>
  <div class="relative">
    <!-- Кнопки навигации -->
    <button
      v-show="currentSlide > 0"
      @click="prevSlide"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button
      v-show="currentSlide < courses.length - slidesPerView"
      @click="nextSlide"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Слайдер -->
    <div class="overflow-hidden">
      <div
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }"
      >
        <div
          v-for="course in courses"
          :key="course.id"
          :style="{ width: `${100 / slidesPerView}%` }"
          class="px-3"
        >
          <div class="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <img
              :src="course.thumbnail"
              :alt="course.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-primary-dark px-3 py-1 bg-primary/10 rounded-full">
                  {{ course.category }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ course.duration }} часов
                </span>
              </div>
              
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>
              
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center space-x-2">
                  <span class="text-lg font-bold text-primary">
                    {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
                  </span>
                  <span v-if="course.rating" class="text-sm text-gray-500">
                    {{ course.rating.toFixed(1) }} ★
                  </span>
                </div>
                
                <button
                  @click="emit('enroll', Number(course.id))"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Записаться
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
