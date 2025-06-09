<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import { useProfileStore } from '@/stores/profile'
import { calculateLevel as calculateLevelFromXp } from '@/stores/profile'

const authStore = useAuthStore()
const gameStore = useGameStore()
const profileStore = useProfileStore()

// Константы для расчета уровня (должны совпадать с ProfileLevel.vue)
const BASE_XP_PER_LEVEL = 500
const XP_MULTIPLIER = 1.5

// Расчет уровня пользователя
const calculateLevel = computed(() => {
  if (!profileStore.user || profileStore.user.total_xp === undefined) return 1
  
  const xp = profileStore.user.total_xp
  let level = 1
  let xpForNextLevel = BASE_XP_PER_LEVEL

  // Пока у пользователя больше XP, чем нужно для текущего уровня
  while (xp >= xpForNextLevel) {
    level++
    xpForNextLevel += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1))
  }

  return level
})

// Расчет XP для следующего уровня
const calculateXpForNextLevel = computed(() => {
  const level = calculateLevel.value
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1))
})

// Расчет текущего XP на этом уровне
const calculateCurrentLevelXp = computed(() => {
  if (!profileStore.user || profileStore.user.total_xp === undefined) return 0
  
  const xp = profileStore.user.total_xp
  let totalXpForPreviousLevels = 0
  
  // Суммируем XP для всех предыдущих уровней
  for (let i = 1; i < calculateLevel.value; i++) {
    totalXpForPreviousLevels += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, i - 1))
  }
  
  return xp - totalXpForPreviousLevels
})

// Процент прогресса для текущего уровня
const calculateXpProgress = computed(() => {
  return Math.min(100, (calculateCurrentLevelXp.value / calculateXpForNextLevel.value) * 100)
})

// Локальные состояния для кликера
const isAnimating = ref(false)
const lastClickTime = ref(Date.now())
const lastSaveTimestamp = ref(Date.now()) // Время последнего сохранения
const popups = ref<{ id: number, value: number, x: number, y: number }[]>([])
const isInitialized = ref(false)
const savingInProgress = ref(false)

// Локальные апгрейды для кликера
interface Upgrade {
  id: number
  name: string
  description: string
  baseCost: number
  count: number
  xpPerSecond?: number
  multiplier?: number
  icon: string
}

const upgrades = ref<Upgrade[]>([
  {
    id: 1,
    name: 'Двойной клик',
    description: 'Удваивает количество XP за клик',
    baseCost: 100,
    count: 0,
    multiplier: 2,
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
  },
  {
    id: 2,
    name: 'Автокликер',
    description: 'Автоматически кликает каждую секунду',
    baseCost: 500,
    count: 0,
    xpPerSecond: 1,
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 3,
    name: 'Бустер XP',
    description: 'Увеличивает множитель XP на 50%',
    baseCost: 1000,
    count: 0,
    multiplier: 1.5,
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  }
])

// Вычисляемые свойства из gameStore
const clickCount = computed(() => gameStore.sessionClicks)
const totalClicks = computed(() => gameStore.totalClicks)
const clicksPerSecond = computed(() => gameStore.clicksPerSecond)

// Вычисляемое свойство для прогнозируемого XP
const projectedXp = computed(() => {
  if (!profileStore.user || profileStore.user.total_xp === undefined) return 0
  
  const currentXp = profileStore.user.total_xp
  const estimatedXp = Math.floor(gameStore.sessionClicks * gameStore.clickMultiplier)
  
  return currentXp + estimatedXp
})

// Обработчик клика с более надежной обработкой данных
const handleClick = () => {
  isAnimating.value = true
  
  // Ограничиваем частоту кликов для предотвращения ошибок от сервера
  const now = Date.now()
  const timeSinceLastClick = now - lastClickTime.value
  
  // Если клики происходят слишком часто (меньше 50 мс между кликами),
  // добавляем небольшую задержку для ограничения скорости
  if (timeSinceLastClick < 50) {
    console.warn('Слишком быстрые клики, возможно ограничение')
  }
  
  // Обновляем время последнего клика
  lastClickTime.value = now
  
  // Добавляем клик в gameStore
  const xpGained = Math.floor(gameStore.clickMultiplier)
  gameStore.addClick(1)
  
  // Создаем новый всплывающий элемент
  const id = Date.now()
  const angle = Math.random() * Math.PI * 2 // Случайный угол
  const distance = 40 + Math.random() * 20 // Случайное расстояние
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  popups.value.push({ id, value: xpGained, x, y })
  
  // Удаляем всплывающий элемент через 1 секунду
  setTimeout(() => {
    popups.value = popups.value.filter(popup => popup.id !== id)
  }, 1000)

  // Автоматическое сохранение через определенное количество кликов
  // Не используем слишком большие пороговые значения
  const MAX_CLICKS_BEFORE_SAVE = 50 // максимальное количество кликов перед сохранением
  const timeSinceLastSave = Date.now() - lastSaveTimestamp.value
  
  if (gameStore.sessionClicks >= MAX_CLICKS_BEFORE_SAVE || timeSinceLastSave > 15000) {
    // Сохраняем без блокировки интерфейса
    savingInProgress.value = true
    
    gameStore.saveClicks()
      .catch(e => {
        console.error('Ошибка при автосохранении кликов:', e)
      })
      .finally(() => {
        setTimeout(() => {
          savingInProgress.value = false
        }, 1000)
      })
  }

  setTimeout(() => {
    isAnimating.value = false
  }, 150)
}

// Ручное сохранение кликов
const saveClicksManually = () => {
  if (gameStore.sessionClicks > 0) {
    savingInProgress.value = true
    
    // Проверяем время с последнего сохранения, чтобы избежать слишком частых запросов
    const timeSinceLastSave = Date.now() - lastSaveTimestamp.value
    if (timeSinceLastSave < 2000) {
      console.warn('Слишком частые запросы на сохранение. Подождите немного.')
      setTimeout(() => {
        savingInProgress.value = false
      }, 1000)
      return
    }
    
    gameStore.saveClicks()
      .then(() => {
        console.log('Клики успешно сохранены вручную')
      })
      .catch(error => {
        console.error('Ошибка при ручном сохранении кликов:', error)
      })
      .finally(() => {
        setTimeout(() => {
          savingInProgress.value = false
        }, 1000)
      })
  }
}

// Используем моковые данные, если нет реальных
const initializeWithMockData = () => {
  if (!gameStore.clickerStats) {
    console.log('Инициализация с тестовыми данными')
    
    // Тестовая статистика
    gameStore.clickerStats = {
      id: 'mock-id',
      user_id: authStore.currentUser?.id || 'mock-user',
      total_clicks: 0,
      clicks_per_second: 0,
      last_click_time: new Date().toISOString(),
      last_save_time: new Date().toISOString(),
      last_save_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Тестовая таблица лидеров
    if (gameStore.leaderboard.length === 0) {
      gameStore.leaderboard = [
        { 
          id: '1', 
          user_id: 'user-1', 
          username: 'Игрок 1', 
          score: 10000, 
          rank: 1,
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          user_id: 'user-2', 
          username: 'Игрок 2', 
          score: 7500, 
          rank: 2,
          updated_at: new Date().toISOString()
        },
        { 
          id: '3', 
          user_id: 'user-3', 
          username: 'Игрок 3', 
          score: 5000, 
          rank: 3,
          updated_at: new Date().toISOString()
        }
      ]
      
      gameStore.userRank = {
        id: 'mock-id',
        user_id: authStore.currentUser?.id || 'mock-user',
        username: authStore.currentUser?.first_name || 'Вы',
        score: 100,
        rank: 10,
        updated_at: new Date().toISOString()
      }
    }
  }
  
  isInitialized.value = true
}

// Наблюдение за завершением загрузки данных
watch(() => gameStore.loading, (loading) => {
  if (!loading && !isInitialized.value) {
    initializeWithMockData()
  }
  savingInProgress.value = loading
})

// Рассчитываем стоимость апгрейда
const calculateUpgradeCost = (upgrade: Upgrade) => {
  return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.count))
}

// Периодически синхронизируем XP с профилем, даже без сохранения
const syncWithProfile = async () => {
  if (gameStore.sessionClicks > 0) {
    // Только отображаем примерный XP в UI, без сохранения на сервере
    if (profileStore.user && profileStore.user.total_xp !== undefined) {
      // Весь XP теперь считается через вычисляемое свойство projectedXp
      console.log(`Отображаем прогнозируемый XP: ${projectedXp.value}`)
    }
  }
}

// Покупка апгрейда
const buyUpgrade = (upgrade: Upgrade) => {
  const cost = calculateUpgradeCost(upgrade)
  if (clickCount.value >= cost) {
    // Уменьшаем количество кликов
    gameStore.sessionClicks -= cost
    upgrade.count++
    
    // Применение эффектов апгрейда
    if (upgrade.multiplier) {
      gameStore.setMultiplier(gameStore.clickMultiplier * upgrade.multiplier)
    }
  }
}

// Функция автоклика
const autoClick = () => {
  const autoClickerUpgrade = upgrades.value[1]
  if (autoClickerUpgrade.count > 0 && autoClickerUpgrade.xpPerSecond) {
    const clicksToAdd = autoClickerUpgrade.count * autoClickerUpgrade.xpPerSecond
    gameStore.addClick(clicksToAdd)
  }
}

// Интервалы для автоматических действий
let autoClickInterval: number | null = null
let autoSaveInterval: number | null = null
let syncProfileInterval: number | null = null

// Вычисляемое свойство для уровня из profileStore
const userLevel = computed(() => {
  return profileStore.getCurrentLevel()
})

// Вычисляемое свойство для прогресса уровня
const levelProgress = computed(() => {
  return profileStore.getLevelProgress()
})

// Подписываемся на изменения XP
onMounted(() => {
  // Добавляем подписку на изменения XP
  const unsubscribe = profileStore.subscribeToXpChanges('profile-games', (newXp, oldXp) => {
    console.log(`XP изменился в ProfileGames: ${oldXp} → ${newXp} (+${newXp - oldXp})`)
    
    // Здесь можно добавить анимацию или уведомление об изменении уровня
    const newLevel = profileStore.getCurrentLevel()
    const oldLevel = calculateLevelFromXp(oldXp)
    
    if (newLevel > oldLevel) {
      console.log(`Уровень повышен! ${oldLevel} → ${newLevel}`)
      // Добавить анимацию повышения уровня
      showLevelUpAnimation(newLevel)
    }
  })
  
  // Отписываемся при уничтожении компонента
  onUnmounted(() => {
    unsubscribe()
  })
})

// Функция для показа анимации повышения уровня
const showLevelUpAnimation = (newLevel: number) => {
  // Здесь можно добавить визуальную анимацию повышения уровня
  // Например, всплывающее сообщение, анимацию или звуковой эффект
  const levelUpElement = document.createElement('div')
  levelUpElement.className = 'level-up-animation'
  levelUpElement.innerHTML = `
    <div class="text-2xl font-bold text-yellow-500">Уровень повышен!</div>
    <div class="text-4xl font-bold text-primary">Уровень ${newLevel}</div>
  `
  
  document.body.appendChild(levelUpElement)
  
  // Удаляем элемент через 3 секунды
  setTimeout(() => {
    document.body.removeChild(levelUpElement)
  }, 3000)
}

// Инициализация
onMounted(async () => {
  try {
    // Загружаем профиль пользователя
    await profileStore.getProfile()
    
    // Загружаем данные из gameStore
    await gameStore.initialize()
    
    // Проверяем данные и инициализируем моковыми при необходимости
    setTimeout(() => {
      if (!isInitialized.value) {
        initializeWithMockData()
      }
    }, 1000)
  } catch (error) {
    console.error('Ошибка при инициализации кликера:', error)
    initializeWithMockData()
  }
  
  // Устанавливаем интервалы
  autoClickInterval = window.setInterval(autoClick, 1000)
  autoSaveInterval = window.setInterval(() => {
    if (gameStore.sessionClicks > 5) {
      // Проверяем время с последнего сохранения
      const timeSinceLastSave = Date.now() - lastSaveTimestamp.value
      if (timeSinceLastSave > 10000) { // Минимум 10 секунд между сохранениями
        savingInProgress.value = true
        console.log(`Автосохранение ${gameStore.sessionClicks} кликов, прошло ${Math.round(timeSinceLastSave/1000)} сек`)
        gameStore.saveClicks()
          .finally(() => {
            setTimeout(() => {
              savingInProgress.value = false
            }, 1000)
          })
      }
    }
  }, 15000) // Проверяем каждые 15 секунд
  
  // Синхронизация с профилем каждые 5 секунд
  syncProfileInterval = window.setInterval(syncWithProfile, 5000)
})

// Очистка при уничтожении компонента
onUnmounted(() => {
  // Сохраняем последние клики перед уходом
  if (gameStore.sessionClicks > 0) {
    gameStore.saveClicks().catch(e => {
      console.error('Ошибка при сохранении кликов перед выходом:', e)
    })
  }
  
  // Очищаем интервалы
  if (autoClickInterval) clearInterval(autoClickInterval)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  if (syncProfileInterval) clearInterval(syncProfileInterval)
})
</script>

<template>
  <div class="space-y-8">
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-bold text-gray-900">Кликер XP</h2>
      <p class="text-gray-600">Кликайте, чтобы заработать XP и улучшить своего персонажа!</p>
    </div>

    <!-- Информация о пользователе и уровне -->
    <div v-if="profileStore.user" class="bg-white rounded-xl p-4 flex justify-between items-center">
      <div>
        <div class="font-medium text-lg">
          {{ profileStore.user.first_name || 'Игрок' }} {{ profileStore.user.last_name || '' }}
        </div>
        <div class="text-sm text-gray-600">
          Уровень {{ userLevel }} ({{ profileStore.user.total_xp || 0 }} XP)
        </div>
        <div class="text-sm text-green-600 mt-1">
          Прогнозируемый XP: <span id="projected-xp" class="font-medium">{{ projectedXp }}</span>
          <span v-if="savingInProgress" class="ml-2 inline-block animate-pulse text-xs text-blue-500">
            Сохранение...
          </span>
        </div>
        
        <!-- Полоска прогресса уровня -->
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-primary h-2.5 rounded-full" :style="{ width: `${levelProgress}%` }"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>{{ Math.round(levelProgress) }}%</span>
          <span>Уровень {{ userLevel + 1 }}</span>
        </div>
      </div>
      <div class="bg-primary text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
        {{ userLevel }}
      </div>
    </div>

    <!-- Основная область клика -->
    <div class="flex justify-center">
      <div class="relative">
        <button
          @click="handleClick"
          class="relative w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
          :class="{ 'animate-click': isAnimating }"
        >
          <!-- Волны при клике -->
          <div class="absolute inset-0 bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-500 rounded-full"></div>
          <div class="absolute inset-0 bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-700 rounded-full"></div>
          
          <!-- Основной контент -->
          <div class="relative flex flex-col items-center justify-center space-y-1">
            <div class="text-2xl font-bold">{{ Math.floor(clickCount) }}</div>
            <div class="text-sm font-medium">XP</div>
          </div>

          <!-- Всплывающие числа -->
          <transition-group 
            name="popup" 
            tag="div" 
            class="absolute inset-0 pointer-events-none overflow-visible"
          >
            <div
              v-for="popup in popups"
              :key="popup.id"
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl whitespace-nowrap"
              :style="{
                '--x': `${popup.x}px`,
                '--y': `${popup.y}px`
              }"
            >
              +{{ popup.value }}
            </div>
          </transition-group>
        </button>

        <!-- Индикатор кликов в секунду -->
        <div 
          class="absolute -top-2 -right-2 bg-white text-primary text-sm font-medium px-2 py-1 rounded-full shadow-md transform transition-transform"
          :class="{ 'scale-110': clicksPerSecond > 5 }"
        >
          {{ clicksPerSecond ? clicksPerSecond.toFixed(1) : '0.0' }} /сек
        </div>

        <!-- Индикатор накопленных кликов -->
        <div v-if="gameStore.sessionClicks > 10" 
          class="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md animate-pulse"
          @click="saveClicksManually"
        >
          {{ gameStore.sessionClicks }} клик(ов)
        </div>
      </div>
    </div>

    <!-- Прогресс до следующего уровня -->
    <div v-if="profileStore.user" class="bg-white rounded-xl p-4">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Уровень {{ calculateLevel }}</span>
        <span>{{ calculateCurrentLevelXp }} / {{ calculateXpForNextLevel }} XP</span>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary transition-all duration-500 rounded-full"
          :style="{ width: `${calculateXpProgress}%` }"
        />
      </div>
      <div class="text-xs text-gray-500 mt-2">
        До следующего уровня: {{ calculateXpForNextLevel - calculateCurrentLevelXp }} XP
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-primary">{{ Math.floor((gameStore.clickMultiplier || 1) * 100) / 100 }}x</div>
        <div class="text-sm text-gray-500">Множитель</div>
      </div>
      <div class="bg-white rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-primary">{{ Math.floor(totalClicks || 0) }}</div>
        <div class="text-sm text-gray-500">Всего кликов</div>
      </div>
    </div>

    <!-- Текущий прогресс -->
    <div v-if="gameStore.clickerStats" class="bg-white rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Ваша статистика</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Всего кликов:</span>
          <span class="font-medium">{{ gameStore.clickerStats.total_clicks || 0 }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Скорость кликов:</span>
          <span class="font-medium">{{ gameStore.clickerStats.clicks_per_second ? gameStore.clickerStats.clicks_per_second.toFixed(2) : '0.00' }} /сек</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Последний клик:</span>
          <span class="font-medium">{{ gameStore.clickerStats.last_click_time ? new Date(gameStore.clickerStats.last_click_time).toLocaleString() : 'Никогда' }}</span>
        </div>
      </div>
    </div>

    <!-- Таблица лидеров -->
    <div v-if="gameStore.leaderboard.length > 0" class="bg-white rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Таблица лидеров</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ранг</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Игрок</th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Очки</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="entry in gameStore.leaderboard" :key="entry.id" :class="{ 'bg-primary/10': entry.user_id === gameStore.userRank?.user_id }">
              <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ entry.rank }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ entry.username }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{{ entry.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Ваш ранг -->
      <div v-if="gameStore.userRank" class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-center">
          <div class="font-medium">Ваш ранг:</div>
          <div class="text-primary font-bold">#{{ gameStore.userRank.rank }}</div>
        </div>
      </div>
    </div>

    <!-- Улучшения -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Улучшения</h3>
      
      <div class="grid gap-4">
        <button
          v-for="upgrade in upgrades"
          :key="upgrade.id"
          @click="buyUpgrade(upgrade)"
          class="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow relative overflow-hidden group"
          :class="{ 'opacity-75 cursor-not-allowed': clickCount < calculateUpgradeCost(upgrade) }"
          :disabled="clickCount < calculateUpgradeCost(upgrade)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-900">{{ upgrade.name }}</h4>
              <p class="text-sm text-gray-500">{{ upgrade.description }}</p>
              <div class="text-xs text-gray-400 mt-1">
                Куплено: {{ upgrade.count }}
              </div>
            </div>
            <div class="text-primary font-medium">
              {{ Math.floor(calculateUpgradeCost(upgrade)) }} XP
            </div>
          </div>

          <!-- Индикатор возможности покупки -->
          <div 
            class="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300"
            :style="{ 
              width: `${Math.min(100, (clickCount / calculateUpgradeCost(upgrade)) * 100)}%` 
            }"
          />
        </button>
      </div>
    </div>
    
    <!-- Сообщение о загрузке -->
    <div v-if="gameStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="text-center mt-2">Сохранение прогресса...</p>
      </div>
    </div>
    
    <!-- Сообщение об ошибке -->
    <div v-if="gameStore.error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {{ gameStore.error }}
    </div>
  </div>
</template>

<style scoped>
@keyframes click {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.animate-click {
  animation: click 150ms ease-out;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.popup-enter-from {
  opacity: 0;
  transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(0.5);
}

.popup-enter-to {
  opacity: 1;
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
}

.popup-leave-to {
  opacity: 0;
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y) - 30px)) scale(0.8);
}

.level-up-animation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: fade-in-out 3s ease-in-out forwards;
}

@keyframes fade-in-out {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  30% { transform: translate(-50%, -50%) scale(1); }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style> 