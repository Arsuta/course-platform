<template>
  <div class="course-progress-container">
    <div class="progress-header">
      <h3 class="text-lg font-semibold mb-2">Прогресс курса</h3>
      <div class="progress-stats">
        <span>{{ progress.completed_lessons }} / {{ progress.total_lessons }} уроков</span>
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress.progress_percent}%` }"></div>
    </div>
    
    <div class="progress-footer">
      <div class="progress-percent">{{ progress.progress_percent }}% завершено</div>
      <div v-if="progress.completed" class="completed-badge">
        Курс завершен
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, PropType } from 'vue'
import type { CourseProgress as ProgressType } from '@/api/types'
import { progressService } from '@/api/services'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  }
})

const progress = ref<ProgressType>({
  course_id: props.courseId,
  completed_lessons: 0,
  total_lessons: 0,
  progress_percent: 0,
  last_activity: '',
  completed: false
})

const isLoading = ref(false)
const error = ref<string | null>(null)

// Загрузка прогресса курса
onMounted(async () => {
  try {
    isLoading.value = true
    const response = await progressService.getCourseProgress(props.courseId)
    if (response.data) {
      progress.value = response.data
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке прогресса'
    console.error('Failed to load course progress:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.course-progress-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-bar-container {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completed-badge {
  background-color: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
}
</style> 