<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { courses, courseProgress } from '@/mocks/courses'
import type { Module, CourseProgress } from '@/types/course'

const route = useRoute()

const course = computed(() => {
  return courses.find(c => c.id === Number(route.params.id))
})

const progress = computed(() => {
  const courseId = Number(route.params.id)
  return (courseProgress as Record<number, CourseProgress>)[courseId]
})

const selectedModule = ref<Module | null>(null)

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ч ${minutes % 60} мин`
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const enrollInCourse = () => {
  // TODO: Реализовать запись на курс
  console.log('Enrolling in course:', course.value?.id)
}
</script>

<template>
  <div v-if="course" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Основная информация -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            :src="course.image"
            :alt="course.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <span 
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800': course.level === 'beginner',
                  'bg-yellow-100 text-yellow-800': course.level === 'intermediate',
                  'bg-red-100 text-red-800': course.level === 'advanced'
                }"
              >
                {{ course.level === 'beginner' ? 'Начинающий' : 
                   course.level === 'intermediate' ? 'Средний' : 'Продвинутый' }}
              </span>
              <span class="text-sm text-gray-500">
                {{ formatDuration(course.duration) }}
              </span>
            </div>

            <h1 class="text-2xl font-bold text-gray-900">
              {{ course.title }}
            </h1>

            <p class="text-gray-600">
              {{ course.description }}
            </p>

            <div class="flex items-center space-x-4">
              <img
                :src="course.author.avatar"
                :alt="course.author.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 class="text-sm font-medium text-gray-900">
                  {{ course.author.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ course.author.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-4 pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-1">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium text-gray-900">{{ course.rating }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ course.studentsCount }} студентов</span>
              <span class="text-sm text-gray-500">Последнее обновление {{ new Date(course.updatedAt).toLocaleDateString('ru-RU') }}</span>
            </div>
          </div>
        </div>

        <!-- Содержание курса -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 space-y-6">
            <h2 class="text-xl font-semibold text-gray-900">Содержание курса</h2>
            
            <div class="space-y-4">
              <div
                v-for="module in course.modules"
                :key="module.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  @click="selectedModule = selectedModule?.id === module.id ? null : module"
                >
                  <div class="flex items-center space-x-3">
                    <span 
                      class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                      :class="module.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'"
                    >
                      <svg v-if="module.isCompleted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else>{{ module.order }}</span>
                    </span>
                    <span class="font-medium text-gray-900">{{ module.title }}</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-sm text-gray-500">
                      {{ module.lessons.length }} уроков
                    </span>
                    <svg
                      class="w-5 h-5 text-gray-400 transform transition-transform"
                      :class="selectedModule?.id === module.id ? 'rotate-180' : ''"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  v-if="selectedModule?.id === module.id"
                  class="border-t border-gray-200"
                >
                  <div
                    v-for="lesson in module.lessons"
                    :key="lesson.id"
                    class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-center space-x-3">
                      <span 
                        class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                        :class="lesson.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'"
                      >
                        <svg v-if="lesson.isCompleted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span v-else>{{ lesson.order }}</span>
                      </span>
                      <span class="text-sm text-gray-900">{{ lesson.title }}</span>
                    </div>
                    <span class="text-sm text-gray-500">{{ formatDuration(lesson.duration) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Требования к курсу -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 space-y-4">
            <h2 class="text-xl font-semibold text-gray-900">Требования</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li v-for="(requirement, index) in course.requirements" :key="index">
                {{ requirement }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Навыки, которые получит студент -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 space-y-4">
            <h2 class="text-xl font-semibold text-gray-900">Чему вы научитесь</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li v-for="(skill, index) in course.skills" :key="index">
                {{ skill }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="lg:col-span-1 space-y-6">
        <div class="sticky top-6">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 space-y-4">
              <div class="text-center">
                <span class="text-3xl font-bold text-gray-900">
                  {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
                </span>
              </div>

              <button
                v-if="!course.isEnrolled"
                @click="enrollInCourse"
                class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Записаться на курс
              </button>

              <router-link
                v-else
                :to="`/courses/${course.id}/learn`"
                class="block w-full px-6 py-3 text-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Продолжить обучение
              </router-link>

              <div v-if="progress" class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Прогресс</span>
                  <span class="font-medium text-gray-900">{{ progress.progress }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all duration-300"
                    :style="{ width: `${progress.progress}%` }"
                  />
                </div>
                <p class="text-xs text-gray-500">
                  Последний просмотр: {{ new Date(progress.lastAccessAt).toLocaleDateString('ru-RU') }}
                </p>
              </div>

              <ul class="space-y-3 text-sm">
                <li class="flex items-center space-x-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatDuration(course.duration) }} контента</span>
                </li>
                <li class="flex items-center space-x-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>{{ course.modules.length }} модулей</span>
                </li>
                <li class="flex items-center space-x-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{{ course.modules.reduce((acc, m) => acc + m.lessons.length, 0) }} уроков</span>
                </li>
                <li class="flex items-center space-x-2 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Сертификат по окончании</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <h2 class="text-2xl font-semibold text-gray-900">Курс не найден</h2>
    <p class="mt-2 text-gray-600">Возможно, курс был удален или перемещен</p>
    <router-link
      to="/courses"
      class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
    >
      Вернуться к списку курсов
    </router-link>
  </div>
</template> 