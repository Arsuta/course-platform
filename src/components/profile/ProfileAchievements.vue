<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Получаем данные пользователя
const user = computed(() => {
  const profileId = Number(route.params.id)
  return authStore.getUserById(profileId)
})

// Типы для редкости достижений
type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
type RarityFilter = Rarity | 'all'

// Фильтр по редкости
const selectedRarity = ref<RarityFilter>('all')

// Интерфейс для прогресса достижения
interface AchievementProgress {
  current: number
  required: number
}

// Интерфейс достижения
interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  rarity: Rarity
  earned: boolean
  date?: string
  progress?: AchievementProgress
}

// Список всех достижений
const achievements = computed<Achievement[]>(() => {
  if (!user.value) return []

  return [
    {
      id: 1,
      title: 'Первые шаги',
      description: 'Завершите свой первый курс',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      rarity: 'common',
      earned: true,
      date: '2024-02-15'
    },
    {
      id: 2,
      title: 'Быстрый старт',
      description: 'Пройдите 3 курса за месяц',
      icon: 'M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z',
      rarity: 'rare',
      earned: true,
      date: '2024-02-28'
    },
    {
      id: 3,
      title: 'Мастер кода',
      description: 'Получите 100% по всем тестам в курсе',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      rarity: 'epic',
      earned: true,
      date: '2024-03-05'
    },
    {
      id: 4,
      title: 'Социальная бабочка',
      description: 'Наберите 100 подписчиков',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      rarity: 'legendary',
      earned: false,
      progress: {
        current: user.value.followers?.length || 0,
        required: 100
      }
    },
    {
      id: 5,
      title: 'Первый вклад',
      description: 'Создайте свой первый пост в блоге',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      rarity: 'common',
      earned: true,
      date: '2024-03-10'
    },
    {
      id: 6,
      title: 'Новичок',
      description: 'Достигните 5 уровня',
      icon: 'M9 6l6-3 6 3v4a10 10 0 01-6 9.19M9 6v4a10 10 0 006 9.19M9 6L3 9v4a10 10 0 006 9.19',
      rarity: 'common',
      earned: user.value.level >= 5,
      date: user.value.level >= 5 ? '2024-03-15' : undefined,
      progress: {
        current: Math.min(user.value.level, 5),
        required: 5
      }
    },
    {
      id: 7,
      title: 'Опытный',
      description: 'Достигните 15 уровня',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      rarity: 'rare',
      earned: user.value.level >= 15,
      date: user.value.level >= 15 ? '2024-03-20' : undefined,
      progress: {
        current: Math.min(user.value.level, 15),
        required: 15
      }
    },
    {
      id: 8,
      title: 'Мастер',
      description: 'Достигните 30 уровня',
      icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      rarity: 'epic',
      earned: user.value.level >= 30,
      date: user.value.level >= 30 ? '2024-03-25' : undefined,
      progress: {
        current: Math.min(user.value.level, 30),
        required: 30
      }
    },
    {
      id: 9,
      title: 'Легенда',
      description: 'Достигните 50 уровня',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      rarity: 'legendary',
      earned: user.value.level >= 50,
      date: user.value.level >= 50 ? '2024-03-30' : undefined,
      progress: {
        current: Math.min(user.value.level, 50),
        required: 50
      }
    }
  ]
})

// Фильтрованный список достижений
const filteredAchievements = computed(() => {
  if (selectedRarity.value === 'all') return achievements.value
  return achievements.value.filter(a => a.rarity === selectedRarity.value)
})

// Статистика достижений
const stats = computed(() => {
  const total = achievements.value.length
  const earned = achievements.value.filter(a => a.earned).length
  return {
    total,
    earned,
    progress: Math.round((earned / total) * 100)
  }
})

// Цвета для редкости достижений
const rarityColors: Record<Rarity, string> = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
}

// Названия редкости на русском
const rarityNames: Record<RarityFilter, string> = {
  all: 'Все',
  common: 'Обычные',
  rare: 'Редкие',
  epic: 'Эпические',
  legendary: 'Легендарные'
}

// Фильтры редкости
const rarityFilters: RarityFilter[] = ['all', 'common', 'rare', 'epic', 'legendary']
</script>

<template>
  <div class="space-y-8">
    <!-- Статистика -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Прогресс достижений
      </h3>
      <div class="flex items-center justify-between mb-2">
        <div class="text-gray-600">
          Получено {{ stats.earned }} из {{ stats.total }}
        </div>
        <div class="text-sm font-medium text-gray-500">
          {{ stats.progress }}%
        </div>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500"
          :style="{ width: `${stats.progress}%` }"
        />
      </div>
    </div>

    <!-- Фильтры -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="rarity in rarityFilters"
        :key="rarity"
        @click="selectedRarity = rarity"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
        :class="selectedRarity === rarity ? 
          'bg-primary text-white shadow-lg scale-105' : 
          'bg-white text-gray-600 hover:bg-gray-50'"
      >
        {{ rarityNames[rarity] }}
      </button>
    </div>

    <!-- Список достижений -->
    <div class="grid gap-4 sm:grid-cols-2">
      <div 
        v-for="achievement in filteredAchievements" 
        :key="achievement.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden"
        :class="{ 'opacity-50': !achievement.earned }"
      >
        <div class="p-4 flex items-start space-x-4">
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="rarityColors[achievement.rarity]"
          >
            <svg 
              class="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="achievement.icon"
              />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-800">
                {{ achievement.title }}
              </h4>
              <div 
                v-if="achievement.earned"
                class="text-xs text-gray-500"
              >
                {{ achievement.date }}
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-600">
              {{ achievement.description }}
            </p>
            <!-- Прогресс достижения -->
            <div 
              v-if="achievement.progress && !achievement.earned"
              class="mt-2"
            >
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Прогресс</span>
                <span>{{ achievement.progress.current }}/{{ achievement.progress.required }}</span>
              </div>
              <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary transition-all duration-500"
                  :style="{ width: `${(achievement.progress.current / achievement.progress.required) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 