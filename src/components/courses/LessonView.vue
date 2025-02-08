<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { courses } from '@/mocks/courses'
import { marked } from 'marked'

const route = useRoute()

const course = computed(() => {
  return courses.find(c => c.id === Number(route.params.courseId))
})

const currentModule = computed(() => {
  if (!course.value) return null
  return course.value.modules.find(m => m.lessons.some(l => l.id === Number(route.params.lessonId)))
})

const currentLesson = computed(() => {
  if (!currentModule.value) return null
  return currentModule.value.lessons.find(l => l.id === Number(route.params.lessonId))
})

const nextLesson = computed(() => {
  if (!course.value || !currentModule.value || !currentLesson.value) return null

  // Поиск следующего урока в текущем модуле
  const currentLessonIndex = currentModule.value.lessons.findIndex(l => l.id === currentLesson.value?.id)
  if (currentLessonIndex < currentModule.value.lessons.length - 1) {
    return currentModule.value.lessons[currentLessonIndex + 1]
  }

  // Поиск первого урока в следующем модуле
  const currentModuleIndex = course.value.modules.findIndex(m => m.id === currentModule.value?.id)
  if (currentModuleIndex < course.value.modules.length - 1) {
    const nextModule = course.value.modules[currentModuleIndex + 1]
    return nextModule.lessons[0]
  }

  return null
})

const previousLesson = computed(() => {
  if (!course.value || !currentModule.value || !currentLesson.value) return null

  // Поиск предыдущего урока в текущем модуле
  const currentLessonIndex = currentModule.value.lessons.findIndex(l => l.id === currentLesson.value?.id)
  if (currentLessonIndex > 0) {
    return currentModule.value.lessons[currentLessonIndex - 1]
  }

  // Поиск последнего урока в предыдущем модуле
  const currentModuleIndex = course.value.modules.findIndex(m => m.id === currentModule.value?.id)
  if (currentModuleIndex > 0) {
    const previousModule = course.value.modules[currentModuleIndex - 1]
    return previousModule.lessons[previousModule.lessons.length - 1]
  }

  return null
})

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ч ${minutes % 60} мин`
}

const markLessonAsCompleted = () => {
  if (currentLesson.value) {
    currentLesson.value.isCompleted = true
    // TODO: Отправить запрос на сервер для сохранения прогресса
  }
}
</script>

<template>
  <div v-if="course && currentLesson" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Основной контент -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Видео плеер -->
        <div v-if="currentLesson.videoUrl" class="bg-black rounded-xl overflow-hidden aspect-video">
          <video
            :src="currentLesson.videoUrl"
            controls
            class="w-full h-full"
          />
        </div>

        <!-- Информация об уроке -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ currentLesson.title }}
              </h1>
              <span class="text-sm text-gray-500">
                {{ formatDuration(currentLesson.duration) }}
              </span>
            </div>

            <div 
              class="prose prose-sm max-w-none"
              v-html="marked(currentLesson.content)"
            />

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-4">
                <router-link
                  v-if="previousLesson"
                  :to="`/courses/${course.id}/learn/${previousLesson.id}`"
                  class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Предыдущий урок</span>
                </router-link>

                <button
                  @click="markLessonAsCompleted"
                  class="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                  :disabled="currentLesson.isCompleted"
                >
                  {{ currentLesson.isCompleted ? 'Урок пройден' : 'Отметить как пройденный' }}
                </button>

                <router-link
                  v-if="nextLesson"
                  :to="`/courses/${course.id}/learn/${nextLesson.id}`"
                  class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Следующий урок</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель с содержанием курса -->
      <div class="lg:col-span-1">
        <div class="sticky top-6">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 space-y-4">
              <h2 class="text-lg font-semibold text-gray-900">Содержание курса</h2>

              <div class="space-y-4">
                <div
                  v-for="module in course.modules"
                  :key="module.id"
                  class="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div class="p-4 bg-gray-50">
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
                  </div>

                  <div class="divide-y divide-gray-200">
                    <router-link
                      v-for="lesson in module.lessons"
                      :key="lesson.id"
                      :to="`/courses/${course.id}/learn/${lesson.id}`"
                      class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      :class="{
                        'bg-primary/5': currentLesson.id === lesson.id
                      }"
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
                        <span 
                          class="text-sm"
                          :class="currentLesson.id === lesson.id ? 'text-primary font-medium' : 'text-gray-900'"
                        >
                          {{ lesson.title }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-500">{{ formatDuration(lesson.duration) }}</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <h2 class="text-2xl font-semibold text-gray-900">Урок не найден</h2>
    <p class="mt-2 text-gray-600">Возможно, урок был удален или перемещен</p>
    <router-link
      :to="`/courses/${route.params.courseId}`"
      class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
    >
      Вернуться к курсу
    </router-link>
  </div>
</template> 