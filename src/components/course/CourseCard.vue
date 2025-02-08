<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Course } from '@/types/course'
import { COURSE_CONSTANTS } from '@/constants/course'
import { COURSE_GRADIENTS } from '@/constants/gradients'

const props = defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  enroll: [id: number]
}>()

const router = useRouter()

const categoryLabel = computed(() => {
  return COURSE_CONSTANTS.CATEGORY_LABELS[props.course.category]
})

const levelLabel = computed(() => {
  return COURSE_CONSTANTS.LEVEL_LABELS[props.course.level]
})

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ч ${minutes % 60} мин`
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const handleClick = () => {
  router.push({
    name: 'course-detail',
    params: { id: props.course.id }
  })
}

const handleEnroll = (event: Event) => {
  event.stopPropagation() // Предотвращаем всплытие события
  emit('enroll', props.course.id)
}

const getDefaultGradient = (id: number) => {
  const gradients = [
    COURSE_GRADIENTS.VUE,
    COURSE_GRADIENTS.REACT,
    COURSE_GRADIENTS.DESIGN,
    COURSE_GRADIENTS.MARKETING,
    COURSE_GRADIENTS.DOCKER,
    COURSE_GRADIENTS.DEFAULT
  ]
  return gradients[id % gradients.length]
}
</script>

<template>
  <div 
    class="group relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col"
    @click="handleClick"
  >
    <!-- Превью с градиентом -->
    <div class="relative aspect-video overflow-hidden">
      <img 
        :src="course.image" 
        :alt="course.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div 
        class="absolute inset-0 bg-gradient-to-br opacity-60"
        :class="course.gradient || getDefaultGradient(course.id)"
      />
    </div>

    <!-- Контент -->
    <div class="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4 flex-grow flex flex-col">
      <!-- Метки -->
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <span class="px-2 py-1 sm:px-3 bg-primary/10 text-primary rounded-full text-xs sm:text-sm">
          {{ categoryLabel }}
        </span>
        <span class="px-2 py-1 sm:px-3 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
          {{ levelLabel }}
        </span>
      </div>

      <!-- Заголовок -->
      <h3 class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2">
        {{ course.title }}
      </h3>

      <!-- Описание -->
      <p class="text-xs sm:text-sm lg:text-base text-gray-600 line-clamp-2">
        {{ course.description }}
      </p>

      <!-- Информация -->
      <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mt-auto">
        <span>{{ formatDuration(course.duration) }}</span>
        <span>{{ course.modules.length }} модулей</span>
      </div>

      <!-- Разделитель -->
      <div class="border-t border-gray-100"></div>

      <!-- Футер -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img 
            :src="course.author.avatar" 
            :alt="course.author.name"
            class="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
          <span class="text-xs sm:text-sm text-gray-700 line-clamp-1 max-w-[120px] sm:max-w-[150px]">
            {{ course.author.name }}
          </span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="text-yellow-400">★</span>
          <span class="text-xs sm:text-sm font-medium">{{ course.rating }}</span>
        </div>
      </div>

      <!-- Цена и кнопка -->
      <div class="flex items-center justify-between mt-2">
        <div class="text-sm sm:text-base lg:text-lg font-bold">
          {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
        </div>
        <button
          class="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-xs sm:text-sm lg:text-base"
          @click="handleEnroll"
        >
          Записаться
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cls-2 {
  fill: currentColor;
}
</style>
