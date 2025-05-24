<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Course } from '@/types/course'
import type { CourseGradient } from '@/constants/gradients'
import { COURSE_GRADIENTS } from '@/constants/gradients'
import { defineProps, defineEmits } from 'vue'

const categoryLabels = {
  programming: 'Программирование',
  design: 'Дизайн',
  marketing: 'Маркетинг',
  business: 'Бизнес'
} as const

const levelLabels = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
} as const

const props = defineProps<{
  course: Course
  onEnroll?: (courseId: string) => void
}>()

const emit = defineEmits<{
  (e: 'enroll', courseId: string): void
}>()

const router = useRouter()

const categoryLabel = computed(() => {
  return getCategoryLabel(props.course.category)
})

const levelLabel = computed(() => {
  return getLevelLabel(props.course.level)
})

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const handleClick = () => {
  router.push({
    name: 'course-detail',
    params: { id: props.course.id }
  })
}

const getDefaultGradient = (id: string): CourseGradient => {
  const index = parseInt(id, 10) % COURSE_GRADIENTS.length
  return COURSE_GRADIENTS[index]
}

const handleEnroll = () => {
  if (props.onEnroll) {
    props.onEnroll(props.course.id)
  } else {
    emit('enroll', props.course.id)
  }
}

const getCategoryLabel = (categoryId: string) => {
  return categoryLabels[categoryId as keyof typeof categoryLabels] || categoryId
}

const getLevelLabel = (level: string) => {
  return levelLabels[level as keyof typeof levelLabels] || level
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
          <span v-if="course.modules">{{ course.modules.length }} модулей</span>
        </div>

        <!-- Разделитель -->
        <div class="border-t border-gray-100 mb-4"></div>

        <!-- Кнопки -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900">
              {{ formatPrice(course.price) }}
            </span>
            <div class="flex items-center space-x-1">
              <span class="text-yellow-400">★</span>
              <span class="text-sm text-gray-600">{{ course.rating }}</span>
            </div>
          </div>
          <button 
            class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
            @click.stop="handleEnroll"
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
