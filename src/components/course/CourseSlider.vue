<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { Course } from '@/types/course'
import { CourseModel } from '@/models/course'
import CourseCard from './CourseCard.vue'

const props = defineProps<{
  courses: Course[]
}>()

const currentSlide = ref(0)
const autoplayInterval = ref<number | null>(null)
const AUTOPLAY_DELAY = 8000

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.courses.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? props.courses.length - 1 
    : currentSlide.value - 1
}

const startAutoplay = () => {
  autoplayInterval.value = setInterval(nextSlide, AUTOPLAY_DELAY)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
}

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <div v-if="courses.length > 0" class="relative group">
    <div class="overflow-hidden">
      <div 
        class="flex transition-transform duration-500 ease-in-out mx-2 md:mx-4 mb-[25px]"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="w-full flex-shrink-0 px-2 md:px-4"
        >
          <CourseCard :course="course" class="h-[600px] md:h-[500px]" />
        </div>
      </div>
    </div>

    <!-- Навигационные кнопки - скрыты на мобильных -->
    <button 
      @click="prevSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="hidden md:block absolute left-2 md:left-10 top-1/4 -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
    >
      <ChevronLeftIcon class="w-6 h-6 text-gray-500" />
    </button>

    <button 
      @click="nextSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="hidden md:block absolute right-2 md:right-10 top-1/4 -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
    >
      <ChevronRightIcon class="w-6 h-6 text-gray-500" />
    </button>

    <!-- Индикатор прогресса -->
    <div class="absolute bottom-[280px] left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 h-1 bg-gray-200/50 rounded-full overflow-hidden z-10">
      <div 
        class="h-full bg-black/30 transition-all duration-300"
        :style="{ width: `${((currentSlide) / (courses.length - 1)) * 100}%` }"
      />
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-72">
    <p class="text-gray-500">Загрузка курсов...</p>
  </div>
</template>
