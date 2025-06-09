<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore, BASE_XP_PER_LEVEL, XP_MULTIPLIER, calculateLevel } from '@/stores/profile'
import type { UserProfile } from '@/api/types'

const route = useRoute()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const user = ref<UserProfile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const lastXp = ref(0) // Отслеживаем предыдущий XP
const showLevelUpEffect = ref(false)
const levelUpValue = ref(0)

// Получить пользователя по ID или текущего пользователя
const fetchUser = async () => {
  try {
    loading.value = true
    error.value = null

    // Проверяем, есть ли ID пользователя в маршруте
    const userId = route.params.id as string
    
    if (userId) {
      // Запрашиваем пользователя по ID
      const response = await authStore.getUserById(userId)
      // Приводим ответ к нужному типу
      user.value = response as any as UserProfile || null
    } else {
      // Используем текущего пользователя
      if (authStore.currentUser) {
        user.value = authStore.currentUser
      } else {
        // Если текущего пользователя нет, загружаем его
        await authStore.loadUserProfile()
        user.value = authStore.currentUser
      }
      
      // Дополнительно загружаем профиль для получения актуальных XP
      const profileData = await profileStore.getProfile()
      if (profileData) {
        // Обновляем XP у текущего пользователя
        if (user.value && profileData.total_xp !== undefined) {
          user.value.total_xp = profileData.total_xp
          lastXp.value = profileData.total_xp
        }
      }
    }
  } catch (e) {
    console.error('Ошибка при загрузке пользователя:', e)
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке пользователя'
    user.value = null
  } finally {
    loading.value = false
  }
}

// Функция для показа анимации повышения уровня
const showLevelUp = (level: number) => {
  levelUpValue.value = level
  showLevelUpEffect.value = true
  
  // Скрываем эффект через 3 секунды
  setTimeout(() => {
    showLevelUpEffect.value = false
  }, 3000)
}

let refreshInterval: number | null = null

onMounted(() => {
  fetchUser()
  
  // Обновляем профиль каждые 30 секунд
  refreshInterval = window.setInterval(refreshProfile, 30000)
  
  // Подписываемся на изменения XP
  const unsubscribe = profileStore.subscribeToXpChanges('profile-level', (newXp, oldXp) => {
    console.log(`XP изменился в ProfileLevel: ${oldXp} → ${newXp} (+${newXp - oldXp})`)
    
    // Обновляем пользователя с новыми данными
    if (user.value) {
      user.value.total_xp = newXp
    }
    
    // Проверяем, повысился ли уровень
    const newLevel = profileStore.getCurrentLevel()
    const oldLevel = calculateLevel(oldXp)
    
    if (newLevel > oldLevel) {
      console.log(`Уровень повышен! ${oldLevel} → ${newLevel}`)
      showLevelUp(newLevel)
    }
  })
  
  // Отписываемся при уничтожении компонента
  onUnmounted(() => {
    if (refreshInterval) clearInterval(refreshInterval)
    unsubscribe()
  })
})

// Периодически обновляем профиль
const refreshProfile = async () => {
  try {
    // Получаем свежие данные профиля
    await profileStore.getProfile()
    
    // Обновляем пользователя с новыми данными
    if (user.value && profileStore.user) {
      const newXp = profileStore.user.total_xp
      if (newXp !== undefined && user.value.total_xp !== newXp) {
        user.value.total_xp = newXp
      }
    }
  } catch (e) {
    console.error('Ошибка при обновлении профиля:', e)
  }
}

// Вычисляем уровень пользователя на основе XP
const userLevel = computed(() => {
  // Используем метод из profileStore
  return profileStore.getCurrentLevel()
})

// Вычисляем XP для следующего уровня
const xpForNextLevel = computed(() => {
  // Используем метод из profileStore
  return profileStore.getXpForNextLevel()
})

// Вычисляем, сколько XP уже набрано для текущего уровня
const currentLevelXp = computed(() => {
  if (!user.value || user.value.total_xp === undefined) return 0
  
  const xp = user.value.total_xp
  let totalXpForPreviousLevels = 0
  
  // Суммируем XP для всех предыдущих уровней
  for (let i = 1; i < userLevel.value; i++) {
    totalXpForPreviousLevels += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, i - 1))
  }
  
  return xp - totalXpForPreviousLevels
})

// Вычисляем процент прогресса для текущего уровня
const xpProgress = computed(() => {
  // Используем метод из profileStore
  return profileStore.getLevelProgress()
})

// Определяем достижения по уровням
const levelAchievements = [
  { level: 5, title: 'Начинающий', description: 'Достигнут 5 уровень' },
  { level: 10, title: 'Продвинутый', description: 'Достигнут 10 уровень' },
  { level: 15, title: 'Эксперт', description: 'Достигнут 15 уровень' },
  { level: 20, title: 'Мастер', description: 'Достигнут 20 уровень' },
  { level: 25, title: 'Легенда', description: 'Достигнут 25 уровень' }
]

// Следующее достижение
const nextAchievement = computed(() => {
  if (!user.value) return null
  return levelAchievements.find(achievement => achievement.level > userLevel.value)
})

// Полученные достижения
const earnedAchievements = computed(() => {
  if (!user.value) return []
  return levelAchievements.filter(achievement => achievement.level <= userLevel.value)
})

// Получаем список курсов пользователя
const fetchCourses = async () => {
  try {
    const response = await profileStore.getEnrolledCourses();
    if (response) {
      courses.value = (response as any).map((course: any) => ({
        id: course.id,
        title: course.title,
        progress: course.progress || 0,
        totalXP: course.xp || 0,
        earnedXP: Math.floor((course.progress || 0) * (course.xp || 0) / 100),
        completed: (course.progress || 0) >= 100
      }));
    }
  } catch (e) {
    console.error('Ошибка при загрузке курсов:', e)
  }
}

// Определение типа для курса
interface Course {
  id: string;
  title: string;
  progress: number;
  totalXP: number;
  earnedXP: number;
  completed: boolean;
}

const courses = ref<Course[]>([])
const filter = ref<'all' | 'completed' | 'in-progress'>('all')

const filterOptions = [
  { id: 'all' as const, label: 'Все курсы' },
  { id: 'completed' as const, label: 'Завершенные' },
  { id: 'in-progress' as const, label: 'В процессе' }
]

// Отфильтрованные курсы
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

// Загружаем курсы при монтировании компонента
onMounted(async () => {
  await fetchCourses()
})
</script>

<template>
  <div v-if="loading" class="flex justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="error" class="text-red-500 text-center">
    {{ error }}
  </div>

  <div v-else-if="user" class="space-y-8">
    <!-- Текущий уровень и XP -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          Уровень {{ userLevel }}
        </h3>
        <div class="text-sm text-gray-500">
          {{ Math.floor(currentLevelXp) }} / {{ xpForNextLevel }} XP
        </div>
      </div>
      
      <!-- Прогресс-бар -->
      <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500 rounded-full"
          :style="{ width: `${Math.min(xpProgress, 100)}%` }"
        />
      </div>

      <!-- Информация о следующем уровне -->
      <div class="mt-4 text-sm text-gray-600">
        До {{ userLevel + 1 }} уровня осталось: 
        <span class="font-medium">
          {{ Math.ceil(xpForNextLevel - currentLevelXp) }} XP
        </span>
      </div>
      
      <!-- Общее количество XP -->
      <div class="mt-2 text-sm text-gray-600">
        Всего XP: <span class="font-medium">{{ user.total_xp || 0 }}</span>
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
    <div v-if="courses.length > 0" class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-800">
        Курсы и прогресс
      </h3>
      
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
          
          <!-- Прогресс-бар -->
          <div class="mt-2">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Прогресс</span>
              <span>{{ Math.floor(course.progress) }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-primary transition-all duration-500 rounded-full"
                :style="{ width: `${course.progress}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500">
      У вас пока нет курсов
    </div>
  </div>
  <div v-else class="text-center text-gray-500">
    Пользователь не найден
  </div>

  <!-- Эффект повышения уровня -->
  <transition name="fade">
    <div v-if="showLevelUpEffect" class="level-up-effect">
      <div class="level-up-container">
        <div class="level-up-icon">🏆</div>
        <div class="level-up-title">Уровень повышен!</div>
        <div class="level-up-level">{{ levelUpValue }}</div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.level-up-effect {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.level-up-container {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: pulse 1s ease-in-out infinite;
}

.level-up-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.level-up-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.level-up-level {
  font-size: 3rem;
  font-weight: bold;
  color: #4c51bf;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 