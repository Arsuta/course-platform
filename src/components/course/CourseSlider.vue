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
    <div class="overflow-hidden rounded-xl">
      <div class="absolute top-0 left-0 right-0 h-3 bg-white/20 z-10">
        <div 
          class="h-full bg-white transition-all duration-1000 ease-in-out"
          :style="{ 
            width: `${(currentSlide) * (100 / courses.length)}%`
          }"
        />
      </div>

      <div 
        class="flex transition-transform duration-1000 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="w-full flex-shrink-0"
        >
          <div class="max-w-[95%] lg:max-w-[85%] mx-auto">
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
      class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors z-10"
    >
      <ChevronLeftIcon class="w-6 h-6 text-white" />
    </button>

    <button 
      @click="nextSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors z-10"
    >
      <ChevronRightIcon class="w-6 h-6 text-white" />
    </button>
  </div>
  <div v-else class="flex justify-center items-center h-32 sm:h-48 lg:h-72">
    <p class="text-gray-500">Загрузка курсов...</p>
  </div>
</template>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}

/* Удаляем старые медиа-запросы, так как теперь используем процентное соотношение */
</style>
