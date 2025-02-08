<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { CourseModel } from '@/models/course'
import type { Course, Module } from '@/types/course'
import { COURSE_CONSTANTS } from '@/constants/course'

const route = useRoute()
const router = useRouter()

const course = ref<Course | null>(null)
const selectedModule = ref<Module | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formattedDescription = computed(() => {
  if (!course.value?.fullDescription) return ''
  return marked(course.value.fullDescription)
})

const categoryLabel = computed(() => {
  if (!course.value?.category) return ''
  return COURSE_CONSTANTS.CATEGORY_LABELS[course.value.category]
})

const levelLabel = computed(() => {
  if (!course.value?.level) return ''
  return COURSE_CONSTANTS.LEVEL_LABELS[course.value.level]
})

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ч ${minutes % 60} мин`
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const loadCourse = async () => {
  try {
    loading.value = true
    const courseId = Number(route.params.id)
    const data = await CourseModel.getCourseById(courseId)
    if (!data) {
      error.value = 'Курс не найден'
      return
    }
    course.value = data
  } catch (e) {
    error.value = 'Ошибка при загрузке курса'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const enrollInCourse = async () => {
  if (!course.value) return
  
  try {
    await CourseModel.enrollCourse(course.value.id)
    // После успешной записи переходим к первому уроку
    const firstModule = course.value.modules[0]
    const firstLesson = firstModule.lessons[0]
    router.push({
      name: 'lesson-view',
      params: {
        courseId: course.value.id,
        lessonId: firstLesson.id
      }
    })
  } catch (error) {
    console.error('Failed to enroll:', error)
    // TODO: Показать уведомление об ошибке
  }
}

onMounted(loadCourse)
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>

  <div v-else-if="error" class="flex justify-center items-center min-h-screen">
    <div class="text-red-500">{{ error }}</div>
  </div>

  <div v-else-if="course" class="container mx-auto px-4 py-8 space-y-8">
    <!-- Заголовок и описание -->
    <div class="max-w-4xl space-y-6">
      <div class="flex items-center space-x-4">
        <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
          {{ categoryLabel }}
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          {{ levelLabel }}
        </span>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900">{{ course.title }}</h1>
      <p class="text-xl text-gray-600">{{ course.description }}</p>
    </div>

    <!-- Основной контент -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Левая колонка -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Описание курса -->
        <div class="prose max-w-none" v-html="formattedDescription" />

        <!-- Программа курса -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Программа курса</h2>
          <div class="space-y-4">
            <div
              v-for="module in course.modules"
              :key="module.id"
              class="border rounded-lg overflow-hidden"
            >
              <div
                class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                @click="selectedModule = selectedModule?.id === module.id ? null : module"
              >
                <div>
                  <h3 class="font-medium">{{ module.title }}</h3>
                  <p class="text-sm text-gray-500">{{ module.description }}</p>
                </div>
                <div class="text-sm text-gray-500">
                  {{ module.lessons.length }} уроков
                </div>
              </div>

              <div v-show="selectedModule?.id === module.id">
                <div
                  v-for="lesson in module.lessons"
                  :key="lesson.id"
                  class="p-4 hover:bg-gray-50 border-t"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ lesson.title }}</span>
                    <span class="text-sm text-gray-500">
                      {{ formatDuration(lesson.duration) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Навыки -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Чему вы научитесь</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li
              v-for="skill in course.skills"
              :key="skill"
              class="flex items-center space-x-2"
            >
              <span class="text-primary">✓</span>
              <span>{{ skill }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="lg:col-span-1">
        <div class="sticky top-8 space-y-6 bg-white rounded-xl shadow-sm p-6">
          <!-- Превью видео или изображение -->
          <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              :src="course.image"
              :alt="course.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Цена и рейтинг -->
          <div class="flex items-center justify-between">
            <div class="text-3xl font-bold">
              {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-yellow-400">★</span>
              <span class="font-medium">{{ course.rating }}</span>
            </div>
          </div>

          <!-- Кнопка записи -->
          <button
            @click="enrollInCourse"
            class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Записаться на курс
          </button>

          <!-- Информация о курсе -->
          <div class="space-y-3 text-sm text-gray-500">
            <div class="flex justify-between">
              <span>Продолжительность</span>
              <span class="font-medium text-gray-900">
                {{ formatDuration(course.duration) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Количество уроков</span>
              <span class="font-medium text-gray-900">
                {{ course.modules.reduce((acc, m) => acc + m.lessons.length, 0) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span>Студентов</span>
              <span class="font-medium text-gray-900">
                {{ course.studentsCount }}
              </span>
            </div>
          </div>

          <!-- Автор курса -->
          <div class="pt-6 border-t">
            <div class="flex items-center space-x-4">
              <img
                :src="course.author.avatar"
                :alt="course.author.name"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <div class="font-medium">{{ course.author.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ course.author.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 