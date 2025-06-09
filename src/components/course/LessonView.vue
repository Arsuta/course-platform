<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import type { Lesson } from '@/api/types'

const route = useRoute()
const router = useRouter()
const lesson = ref<Lesson | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showTest = ref(false)

const courseId = computed(() => route.params.courseId as string)
const lessonId = computed(() => route.params.lessonId as string)

const formattedContent = computed(() => {
  if (!lesson.value?.content) return ''
  return marked.parse(lesson.value.content)
})

onMounted(async () => {
  try {
    loading.value = true
    const { coursesService } = await import('@/api/services')
    const response = await coursesService.getLesson(lessonId.value)
    
    if (response.data) {
      lesson.value = response.data
      
      // Отмечаем урок как просмотренный
      await coursesService.markLessonViewed(lessonId.value)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке урока'
  } finally {
    loading.value = false
  }
})

// Начать тест
const startTest = async () => {
  showTest.value = true
}

// Перейти к следующему уроку
const nextLesson = async () => {
  // Здесь должна быть логика для перехода к следующему уроку
  // Это можно реализовать через получение структуры курса и поиск следующего урока
  router.push(`/courses/${courseId.value}/learn`)
}

// Завершить урок и вернуться к структуре курса
const finishLesson = () => {
  router.push(`/courses/${courseId.value}/learn`)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="text-center text-red-600 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-lg">{{ error }}</p>
        <button @click="router.go(-1)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Вернуться назад
        </button>
      </div>
    </div>
    
    <!-- Содержимое урока -->
    <div v-else-if="lesson" class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ lesson.title }}</h1>
      
      <!-- Видео (если есть) -->
      <div v-if="false" class="aspect-video bg-gray-100 rounded-lg">
        <!-- TODO: Видеоплеер или другой контент урока -->
        <video controls class="w-full h-full rounded-lg">
          <source src="" type="video/mp4">
          Ваш браузер не поддерживает видео.
        </video>
      </div>
      
      <!-- Текстовый контент урока -->
      <div class="prose max-w-none" v-html="formattedContent"></div>
      
      <!-- Действия -->
      <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          @click="finishLesson"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Вернуться к курсу
        </button>
        
        <div class="space-x-4">
          <button
            v-if="lesson.has_test && !showTest"
            @click="startTest"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Пройти тест
          </button>
          
          <button
            v-else
            @click="nextLesson"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Следующий урок
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 