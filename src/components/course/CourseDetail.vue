<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { useAuthStore } from '@/stores/auth'
import { useCourseStore } from '@/stores/courses'
import type { Course } from '@/api/types'
import type { Lesson, Module } from '@/types/course'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseStore = useCourseStore()

const course = ref<Course | null>(null)
const lessons = ref<Lesson[]>([])
const selectedModule = ref<Module | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const courseGradients = {
  programming: 'bg-gradient-to-r from-blue-500 to-purple-500',
  design: 'bg-gradient-to-r from-pink-500 to-orange-500',
  marketing: 'bg-gradient-to-r from-green-500 to-teal-500',
  business: 'bg-gradient-to-r from-yellow-500 to-red-500'
} as const

type CourseCategory = keyof typeof courseGradients

const formattedDescription = computed(() => {
  if (!course.value) return ''
  return marked(course.value.description)
})

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

const getCategoryLabel = (categoryId: string) => {
  return categoryLabels[categoryId as keyof typeof categoryLabels] || categoryId
}

const getLevelLabel = (level: string) => {
  return levelLabels[level as keyof typeof levelLabels] || level
}

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

const categoryToType: Record<string, CourseCategory> = {
  '1': 'programming',
  '2': 'design',
  '3': 'marketing',
  '4': 'business'
}

const getCategoryGradient = (categoryId: string): string => {
  const defaultGradient = 'bg-gradient-to-r from-gray-500 to-gray-700'
  const categoryType = categoryToType[categoryId]
  return categoryType ? courseGradients[categoryType] : defaultGradient
}

// Получение уроков курса
const getCourseLessons = async (courseId: string): Promise<Lesson[]> => {
  try {
    // Здесь должен быть запрос к API за уроками курса
    // Пока возвращаем пустой массив
    return []
  } catch (e) {
    console.error('Ошибка при загрузке уроков:', e)
    return []
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const courseId = route.params.id as string
    const response = await courseStore.fetchCourseById(courseId)
    course.value = response
    
    lessons.value = await getCourseLessons(courseId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курса'
  } finally {
    loading.value = false
  }
})

const handleEnroll = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ 
      name: 'login',
      query: { redirect: route.fullPath },
      params: { message: 'Для записи на курс необходима авторизация' }
    })
    return
  }

  if (!course.value) return
  
  const success = await courseStore.enrollCourse(course.value.id)
  if (success) {
    // TODO: Показать уведомление об успешной записи
    router.push(`/courses/${course.value.id}/learn`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>

    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center text-red-600">
      {{ error }}
  </div>

    <div v-else-if="course" class="container mx-auto px-4 py-8">
      <!-- Заголовок курса -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ course.title }}</h1>
        <div class="flex items-center space-x-4 text-gray-600">
          <span>{{ formatDuration(course.duration) }}</span>
          <span>•</span>
          <span>{{ getLevelLabel(course.status) }}</span>
          <span>•</span>
          <span>{{ course.lessons_count }} уроков</span>
        </div>
      </div>
      
      <!-- Основная информация -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Описание курса -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">О курсе</h2>
            <div class="prose max-w-none" v-html="formattedDescription"></div>
              </div>

          <!-- Список уроков -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Программа курса</h2>
            <div class="space-y-4">
              <div v-for="lesson in lessons" :key="lesson.id" class="border-b border-gray-200 last:border-0 pb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ lesson.title }}</h3>
                <p class="text-gray-600 mt-1">{{ lesson.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="space-y-6">
          <!-- Карточка с ценой -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
            <div class="text-3xl font-bold">
                {{ formatPrice(course.price) }}
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-yellow-400">★</span>
                <span>{{ course.rating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- Кнопка записи -->
          <button
              @click="handleEnroll"
            class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Записаться на курс
          </button>

          <!-- Информация о курсе -->
            <div class="mt-6 space-y-4 text-gray-600">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatDuration(course.duration) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ getLevelLabel(course.status) }}</span>
            </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ course.lessons_count }} уроков</span>
            </div>
            </div>
          </div>

          <!-- Категория курса -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Категория</h3>
            <div :class="getCategoryGradient(course.category_id)" class="text-white rounded-lg p-4">
              {{ getCategoryLabel(course.category_id) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 