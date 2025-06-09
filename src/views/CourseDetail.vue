<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import type { Course, Lesson } from '@/api/types'
import { COURSE_CONSTANTS } from '@/constants/course'
import type { CategoryId } from '@/types/course'
import { api } from '@/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseStore = useCoursesStore()

const course = ref<Course | null>(null)
const lessons = ref<Lesson[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showEnrollConfirm = ref(false)
const enrolling = ref(false)
const purchaseLoading = ref(false)
const purchaseError = ref<string | null>(null)
const enrollmentSuccess = ref(false)

const formattedDescription = computed(() => {
  if (!course.value?.description) return ''
  return marked.parse(course.value.description)
})

const isEnrolled = computed(() => {
  if (!course.value) return false
  return courseStore.isEnrolled(course.value.id)
})

const getCategoryLabel = (categoryId: string) => {
  return COURSE_CONSTANTS?.CATEGORY_LABELS?.[categoryId as CategoryId] || categoryId
}

const getLevelLabel = (level: string) => {
  return COURSE_CONSTANTS?.LEVEL_LABELS?.[level as keyof typeof COURSE_CONSTANTS.LEVEL_LABELS] || level
}

const formatDuration = (minutes: number = 0): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}

const formatPrice = (price: number = 0): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const fetchCourseData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const courseId = route.params.id as string
    
    // Используем метод fetchCourse вместо fetchCourseById
    course.value = await courseStore.fetchCourse(courseId)
    
    // Загружаем уроки курса
    const lessonsResponse = await api.courses.getCourseLessons(courseId)
    lessons.value = Array.isArray(lessonsResponse) ? lessonsResponse : 
                   (lessonsResponse && lessonsResponse.data ? lessonsResponse.data : [])
    
    loading.value = false
  } catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке курса'
    loading.value = false
  }
}

// Запись на курс
const handleEnroll = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }

  if (!course.value) return
  
  try {
    enrolling.value = true
    const result = await courseStore.enrollCourse(course.value.id)
    
    if (result.success) {
      enrollmentSuccess.value = true
      showEnrollConfirm.value = true
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при записи на курс'
  } finally {
    enrolling.value = false
  }
}

// Отмена записи на курс
const handleUnenroll = async () => {
  if (!course.value) return
  
  try {
    enrolling.value = true
    const result = await courseStore.unenrollCourse(course.value.id)
    
    if (result.success) {
      enrollmentSuccess.value = false
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при отмене записи на курс'
  } finally {
    enrolling.value = false
  }
}

// Переход к обучению после успешной записи
const startLearning = () => {
  if (!course.value) return
  router.push(`/courses/${course.value.id}/learn`)
}

onMounted(async () => {
  await fetchCourseData()
  // Загружаем курсы, если они еще не загружены
  if (courseStore.courses.length === 0) {
    await courseStore.fetchCourses()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center text-red-600">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-lg">{{ error }}</p>
        <button @click="router.go(-1)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Вернуться назад
        </button>
      </div>
    </div>

    <!-- Содержимое курса -->
    <div v-else-if="course" class="container mx-auto px-4 py-8">
      <!-- Заголовок курса -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ course.title }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-gray-600">
          <div class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {{ getCategoryLabel(course.category_id || '') }}
          </div>
          <span>{{ formatDuration(course.duration) }}</span>
          <span>•</span>
          <span>{{ getLevelLabel(course.status || '') }}</span>
          <span>•</span>
          <span>{{ lessons.length }} уроков</span>
          <div class="flex items-center space-x-1 text-yellow-400">
            <span>★</span>
            <span class="text-gray-700">{{ course.rating?.toFixed(1) || "Нет оценок" }}</span>
          </div>
        </div>
      </div>
      
      <!-- Основная информация -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Описание курса и содержание -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Описание курса -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">О курсе</h2>
            <div class="prose max-w-none" v-html="formattedDescription"></div>
          </div>

          <!-- Список уроков -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Программа курса</h2>
            
            <div v-if="lessons.length === 0" class="text-gray-500 italic">
              Информация о содержании курса будет доступна после записи.
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(lesson, index) in lessons" :key="lesson.id" 
                   class="border-b border-gray-200 last:border-0 pb-4">
                <div class="flex items-start gap-3">
                  <div class="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 shrink-0">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ lesson.title }}</h3>
                    <p v-if="lesson.content" class="text-gray-600 mt-1 line-clamp-2">
                      {{ lesson.content.substring(0, 150) }}...
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span v-if="lesson.has_test" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Включает тест
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Боковая панель -->
        <div class="space-y-6">
          <!-- Карточка с ценой и кнопкой записи -->
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <div class="flex items-center justify-between mb-6">
              <div class="text-3xl font-bold">
                {{ formatPrice(course.price) }}
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-yellow-400">★</span>
                <span>{{ course.rating?.toFixed(1) || "N/A" }}</span>
              </div>
            </div>

            <!-- Информация о курсе -->
            <div class="mb-6 space-y-4 text-gray-600">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatDuration(course.duration) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ getLevelLabel(course.status || '') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{{ lessons.length }} уроков</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ course.students_count || 0 }} студентов</span>
              </div>
            </div>

            <!-- Кнопка записи или начала обучения -->
            <button 
              v-if="!isEnrolled"
              @click="handleEnroll"
              :disabled="enrolling"
              class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors 
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span v-if="!enrolling">Записаться на курс</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка...
              </span>
            </button>
            
            <div v-else class="space-y-3">
              <button
                @click="startLearning"
                class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Начать обучение
              </button>
              
              <button
                @click="handleUnenroll"
                :disabled="enrolling"
                class="w-full py-2 px-4 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg transition-colors
                       disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <span v-if="!enrolling">Отписаться от курса</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Обработка...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения записи -->
    <div v-if="showEnrollConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Поздравляем!</h3>
        <p class="text-gray-600 mb-6">Вы успешно записались на курс "{{ course?.title }}".</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showEnrollConfirm = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Закрыть
          </button>
          <button
            @click="startLearning"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Начать обучение
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 