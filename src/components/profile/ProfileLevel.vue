<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => {
  const profileId = Number(route.params.id)
  return authStore.getUserById(profileId)
})

const xpProgress = computed(() => {
  if (!user.value) return 0
  const xpForNextLevel = user.value.level * 1000
  return (user.value.xp % xpForNextLevel) / xpForNextLevel * 100
})

const totalXpForLevel = computed(() => {
  if (!user.value) return 0
  return user.value.level * 1000
})

const currentLevelXp = computed(() => {
  if (!user.value) return 0
  return user.value.xp % totalXpForLevel.value
})

const levelAchievements = [
  { level: 5, title: 'Начинающий', description: 'Достигнут 5 уровень' },
  { level: 10, title: 'Продвинутый', description: 'Достигнут 10 уровень' },
  { level: 15, title: 'Эксперт', description: 'Достигнут 15 уровень' },
  { level: 20, title: 'Мастер', description: 'Достигнут 20 уровень' },
  { level: 25, title: 'Легенда', description: 'Достигнут 25 уровень' }
]

const nextAchievement = computed(() => {
  if (!user.value) return null
  return levelAchievements.find(achievement => achievement.level > user.value!.level)
})

const earnedAchievements = computed(() => {
  if (!user.value) return []
  return levelAchievements.filter(achievement => achievement.level <= user.value!.level)
})

interface Course {
  id: number
  title: string
  progress: number
  totalXP: number
  earnedXP: number
  completed: boolean
}

const courses = ref<Course[]>([
  {
    id: 1,
    title: 'Основы Vue.js 3',
    progress: 100,
    totalXP: 1000,
    earnedXP: 1000,
    completed: true
  },
  {
    id: 2,
    title: 'TypeScript для профессионалов',
    progress: 65,
    totalXP: 800,
    earnedXP: 520,
    completed: false
  },
  {
    id: 3,
    title: 'Продвинутые анимации в CSS',
    progress: 30,
    totalXP: 600,
    earnedXP: 180,
    completed: false
  }
])

const filter = ref<'all' | 'completed' | 'in-progress'>('all')

const filterOptions = [
  { id: 'all' as const, label: 'Все курсы' },
  { id: 'completed' as const, label: 'Завершенные' },
  { id: 'in-progress' as const, label: 'В процессе' }
]

const filteredCourses = computed(() => {
  switch (filter.value) {
    case 'completed':
      return courses.value.filter(course => course.completed)
    case 'in-progress':
      return courses.value.filter(course => !course.completed)
    default:
      return courses.value
  }
})
</script>

<template>
  <div v-if="user" class="space-y-8">
    <!-- Текущий уровень и XP -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Уровень {{ user.level }}
        </h3>
        <div class="text-sm text-gray-500">
          {{ Math.floor(currentLevelXp) }} / {{ totalXpForLevel }} XP
        </div>
      </div>
      
      <!-- Прогресс-бар -->
      <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500 rounded-full"
          :style="{ width: `${xpProgress}%` }"
        />
      </div>

      <!-- Информация о следующем уровне -->
      <div class="mt-4 text-sm text-gray-600">
        До {{ user.level + 1 }} уровня осталось: 
        <span class="font-medium">
          {{ Math.ceil(totalXpForLevel - currentLevelXp) }} XP
        </span>
      </div>
    </div>

    <!-- Следующее достижение -->
    <div v-if="nextAchievement" class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Следующее достижение
      </h3>
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span class="text-primary font-bold">
            {{ nextAchievement.level }}
          </span>
        </div>
        <div>
          <div class="font-medium text-gray-800">
            {{ nextAchievement.title }}
          </div>
          <div class="text-sm text-gray-500">
            {{ nextAchievement.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Полученные достижения -->
    <div v-if="earnedAchievements.length" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">
        Полученные достижения
      </h3>
      <div class="grid gap-4 sm:grid-cols-2">
        <div 
          v-for="achievement in earnedAchievements" 
          :key="achievement.level"
          class="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4"
        >
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span class="text-primary font-bold">
              {{ achievement.level }}
            </span>
          </div>
          <div>
            <div class="font-medium text-gray-800">
              {{ achievement.title }}
            </div>
            <div class="text-sm text-gray-500">
              {{ achievement.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры курсов -->
    <div class="flex space-x-4">
      <button
        v-for="option in filterOptions"
        :key="option.id"
        @click="filter = option.id"
        class="px-4 py-2 rounded-lg font-medium transition-colors"
        :class="filter === option.id ? 
          'bg-primary text-white' : 
          'bg-white text-gray-600 hover:bg-gray-50'"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Список курсов -->
    <div class="grid gap-6">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        class="bg-white rounded-xl shadow-lg p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="font-semibold text-gray-900">{{ course.title }}</h4>
            <div class="text-sm text-gray-500">
              {{ course.earnedXP }} / {{ course.totalXP }} XP
            </div>
          </div>
          <div 
            class="px-3 py-1 rounded-lg text-sm font-medium"
            :class="course.completed ? 
              'bg-green-100 text-green-800' : 
              'bg-blue-100 text-blue-800'"
          >
            {{ course.completed ? 'Завершен' : 'В процессе' }}
          </div>
        </div>
        
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            :class="course.completed ? 'bg-green-500' : 'bg-primary'"
            :style="{ width: `${course.progress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template> 