<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { Course } from '@/types/course'
import CourseCard from './CourseCard.vue'

const props = defineProps<{
  courses: Course[]
}>()

defineEmits<{
  enroll: [id: number]
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
  autoplayInterval.value = setInterval(nextSlide, AUTOPLAY_DELAY) as unknown as number
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
  <div v-if="courses.length > 0" class="relative">
    <!-- Слайдер -->
    <div class="overflow-hidden">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="w-full flex-shrink-0 px-2 sm:px-3 lg:px-4"
        >
          <div class="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <CourseCard 
              :course="course" 
              @enroll="$emit('enroll', course.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Навигационные кнопки -->
    <button 
      @click="prevSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="hidden md:flex absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors z-10"
    >
      <ChevronLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
    </button>

    <button 
      @click="nextSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="hidden md:flex absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors z-10"
    >
      <ChevronRightIcon class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
    </button>

    <!-- Индикатор прогресса -->
    <div class="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 w-4/5 sm:w-2/3 lg:w-1/2 h-1 bg-gray-200/50 rounded-full overflow-hidden z-10">
      <div 
        class="h-full bg-primary transition-all duration-300"
        :style="{ width: `${((currentSlide) / (courses.length - 1)) * 100}%` }"
      />
    </div>

    <!-- Мобильные точки навигации -->
    <div class="flex md:hidden justify-center space-x-1.5 mt-4">
      <button
        v-for="(_, index) in courses"
        :key="index"
        @click="currentSlide = index"
        class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors"
        :class="currentSlide === index ? 'bg-primary' : 'bg-gray-300'"
      />
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-32 sm:h-48 lg:h-72">
    <p class="text-gray-500">Загрузка курсов...</p>
  </div>
</template>

<style scoped>
.overflow-hidden {
  overflow: hidden;
  margin: 0 -8px;
}

@media (min-width: 640px) {
  .overflow-hidden {
    margin: 0 -12px;
  }
}

@media (min-width: 1024px) {
  .overflow-hidden {
    margin: 0 -16px;
  }
}
</style>
