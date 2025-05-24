<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CourseProgress } from '@/api/types'
import { ProgressService } from '@/api/services/progress'

const props = defineProps<{
  courseId: string
}>()

const progressService = new ProgressService()
const loading = ref(false)
const error = ref<string | null>(null)
const progress = ref<CourseProgress | null>(null)

const loadProgress = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await progressService.getCourseProgress(props.courseId)
    progress.value = response.data
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке прогресса'
  } finally {
    loading.value = false
  }
}

onMounted(loadProgress)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else-if="progress" class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          Прогресс курса
        </h3>
        <span class="text-primary font-medium">
          {{ progress.percentage }}%
        </span>
      </div>

      <!-- Прогресс-бар -->
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-300"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>

      <div class="flex justify-between text-sm text-gray-600">
        <span>{{ progress.completed_lessons }} из {{ progress.total_lessons }} уроков</span>
        <span>{{ progress.xp_earned }} XP заработано</span>
      </div>

      <div v-if="progress.completed_at" class="text-sm text-gray-600">
        Курс завершен: {{ new Date(progress.completed_at).toLocaleDateString('ru-RU') }}
      </div>
    </div>

    <div v-else class="text-center text-gray-600">
      Нет данных о прогрессе
    </div>
  </div>
</template> 