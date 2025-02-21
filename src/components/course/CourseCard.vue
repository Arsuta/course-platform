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
    class="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl h-full flex"
    @click="handleClick"
  >
    <!-- Превью с градиентом -->
    <div class="relative w-1/3 overflow-hidden">
      <img 
        :src="course.image" 
        :alt="course.title"
        class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div 
        class="absolute inset-0 bg-gradient-to-br opacity-60"
        :class="course.gradient || getDefaultGradient(course.id)"
      />
    </div>

    <!-- Контент -->
    <div class="p-4 flex-1 flex flex-col">
      <!-- Метки -->
      <div class="flex flex-wrap gap-1.5 mb-2">
        <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
          {{ categoryLabel }}
        </span>
        <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          {{ levelLabel }}
        </span>
      </div>

      <!-- Заголовок -->
      <h3 class="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
        {{ course.title }}
      </h3>

      <!-- Описание -->
      <p class="text-sm text-gray-600 line-clamp-2 mb-4">
        {{ course.description }}
      </p>

      <!-- Информация -->
      <div class="mt-auto">
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{{ formatDuration(course.duration) }}</span>
          <span>{{ course.modules.length }} модулей</span>
        </div>

        <!-- Разделитель -->
        <div class="border-t border-gray-100 mb-4"></div>

        <!-- Кнопки -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900">
              {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
            </span>
            <div class="flex items-center space-x-1">
              <span class="text-yellow-400">★</span>
              <span class="text-sm text-gray-600">{{ course.rating }}</span>
            </div>
          </div>
          <button 
            class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
            @click.stop="$emit('enroll', course.id)"
          >
            {{ course.isEnrolled ? 'Продолжить' : 'Записаться' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .bg-gradient-to-br {
  opacity: 80;
}
</style>
