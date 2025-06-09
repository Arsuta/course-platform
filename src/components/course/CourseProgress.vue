<template>
  <div class="course-progress-container">
    <div class="progress-header">
      <h3 class="text-lg font-semibold mb-2">Прогресс курса</h3>
      <div class="progress-stats">
        <span>{{ progress.completed_lessons }} / {{ progress.total_lessons }} уроков</span>
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
    </div>
    
    <div class="progress-footer">
      <div class="progress-percent">{{ progressPercent }}% завершено</div>
      <div v-if="isCompleted" class="completed-badge">
        Курс завершен
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CourseProgress } from '@/api/types'

const props = defineProps<{
  progress: CourseProgress
}>()

// Вычисляемые свойства для отображения прогресса
const progressPercent = ref(props.progress.percentage || 0)
const progressLabel = ref(`${props.progress.completed_lessons || 0}/${props.progress.total_lessons || 0}`)
const isCompleted = ref(!!props.progress.completed_at)

// Обновление данных при изменении props
onMounted(() => {
  updateProgress()
})

// Функция обновления прогресса
const updateProgress = () => {
  progressPercent.value = props.progress.percentage || 0
  progressLabel.value = `${props.progress.completed_lessons || 0}/${props.progress.total_lessons || 0}`
  isCompleted.value = !!props.progress.completed_at
}

// Определение CSS классов в зависимости от прогресса
const progressBarClass = ref({
  'bg-green-500': progressPercent.value > 75,
  'bg-blue-500': progressPercent.value > 50 && progressPercent.value <= 75,
  'bg-yellow-500': progressPercent.value > 25 && progressPercent.value <= 50,
  'bg-red-500': progressPercent.value <= 25
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