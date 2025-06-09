<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useRouter } from 'vue-router'
import type { Course } from '@/api/types'
import type { MockCourse } from '@/stores/courses'

const coursesStore = useCoursesStore()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)

// Получаем записанные курсы
const enrolledCourses = computed(() => {
  return coursesStore.getEnrolledCourses
})

// Форматирование продолжительности курса
const formatDuration = (minutes: number = 0): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}

// Переход к странице курса
const navigateToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

// Переход к обучению
const startLearning = (courseId: string) => {
  router.push(`/courses/${courseId}/learn`)
}

// Отписка от курса
const unenrollCourse = async (courseId: string) => {
  try {
    loading.value = true
    await coursesStore.unenrollCourse(courseId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при отписке от курса'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (coursesStore.courses.length === 0) {
    try {
      loading.value = true
      await coursesStore.fetchCourses()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold text-gray-900">Мои курсы</h2>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ error }}
    </div>
    
    <div v-else-if="enrolledCourses.length === 0" class="bg-white rounded-xl p-6 text-center">
      <div class="flex flex-col items-center py-8">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-500 text-lg">У вас пока нет записанных курсов</p>
        <button 
          @click="router.push('/courses')" 
          class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Найти курсы
        </button>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="course in enrolledCourses" 
        :key="course.id" 
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="relative">
          <img 
            :src="course.thumbnail || 'https://via.placeholder.com/400x200?text=Курс'" 
            :alt="course.title" 
            class="w-full h-48 object-cover"
          />
          <div class="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
            {{ course.level }}
          </div>
        </div>
        
        <div class="p-5">
          <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{{ course.title }}</h3>
          
          <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>
          
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span class="flex items-center mr-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatDuration(course.duration) }}
            </span>
            
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Уроки
            </span>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              @click="startLearning(course.id)" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex-1"
            >
              Продолжить обучение
            </button>
            
            <button 
              @click="unenrollCourse(course.id)" 
              class="p-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
              :disabled="loading"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 