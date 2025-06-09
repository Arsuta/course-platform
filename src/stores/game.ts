import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import type { ClickerStats, ClickerSession, LeaderboardEntry } from '@/api/types'

// Моковые данные для кликера
const mockClickerStats: ClickerStats = {
  id: 'mock-id',
  user_id: 'mock-user',
  total_clicks: 0,
  clicks_per_second: 0,
  last_click_time: new Date().toISOString(),
  last_save_time: new Date().toISOString(),
  last_save_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const mockLeaderboard: LeaderboardEntry[] = [
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
  },
  { 
    id: '4', 
    user_id: 'user-4', 
    username: 'Игрок 4', 
    score: 3500, 
    rank: 4,
    updated_at: new Date().toISOString()
  },
  { 
    id: '5', 
    user_id: 'user-5', 
    username: 'Игрок 5', 
    score: 2000, 
    rank: 5,
    updated_at: new Date().toISOString()
  }
]

const mockUserRank: LeaderboardEntry = {
  id: 'mock-user-id',
  user_id: 'current-user',
  username: 'Вы',
  score: 100,
  rank: 10,
  updated_at: new Date().toISOString()
}

const mockRecentSessions: ClickerSession[] = [
  {
    id: 'session-1',
    user_id: 'current-user',
    click_count: 500,
    start_time: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
    end_time: new Date(Date.now() - 86340000).toISOString(), // 1 день назад + 1 минута
    average_cps: 8.3,
    max_cps: 12.5,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'session-2',
    user_id: 'current-user',
    click_count: 350,
    start_time: new Date(Date.now() - 43200000).toISOString(), // 12 часов назад
    end_time: new Date(Date.now() - 43140000).toISOString(), // 12 часов назад + 1 минута
    average_cps: 5.8,
    max_cps: 9.2,
    created_at: new Date(Date.now() - 43200000).toISOString()
  }
]

export const useGameStore = defineStore('game', () => {
  const profileStore = useProfileStore()
  
  // Состояния
  const clickerStats = ref<ClickerStats | null>(null)
  const recentSessions = ref<ClickerSession[]>([])
  const leaderboard = ref<LeaderboardEntry[]>([])
  const userRank = ref<LeaderboardEntry | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Локальное состояние для кликера
  const sessionClicks = ref(0)
  const sessionStartTime = ref(Date.now())
  const clickMultiplier = ref(1)
  const lastSaveTimestamp = ref(Date.now())
  
  // Вычисляемые свойства
  const sessionTime = computed(() => {
    return (Date.now() - sessionStartTime.value) / 1000
  })
  
  const clicksPerSecond = computed(() => {
    if (!sessionTime.value) return 0
    return sessionClicks.value / sessionTime.value
  })
  
  const totalClicks = computed(() => {
    return (clickerStats.value?.total_clicks || 0) + sessionClicks.value
  })
  
  /**
   * Загрузить статистику пользователя (моковые данные)
   */
  const loadStats = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Используем моковые данные
      clickerStats.value = {...mockClickerStats}
      recentSessions.value = [...mockRecentSessions]
      
      return {
        success: true,
        data: {
          stats: clickerStats.value,
          recent_sessions: recentSessions.value
        }
      }
    } catch (e) {
      console.error('Ошибка при загрузке статистики:', e)
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке статистики'
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Загрузить таблицу лидеров (моковые данные)
   */
  const loadLeaderboard = async (limit = 10, offset = 0) => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Используем моковые данные
      leaderboard.value = [...mockLeaderboard].slice(offset, offset + limit)
      userRank.value = {...mockUserRank}
      
      return {
        success: true,
        data: {
          entries: leaderboard.value,
          user_rank: userRank.value
        }
      }
    } catch (e) {
      console.error('Ошибка при загрузке таблицы лидеров:', e)
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке таблицы лидеров'
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Сохранить клики и обновить XP пользователя (моковые данные)
   */
  const saveClicks = async () => {
    try {
      if (sessionClicks.value <= 0) return null
      
      error.value = null
      
      // Копируем текущие значения для сохранения
      const clicksToSave = sessionClicks.value
      
      // Сразу сбрасываем счетчик сессии, чтобы пользователь мог продолжать игру
      sessionClicks.value = 0
      sessionStartTime.value = Date.now()
      lastSaveTimestamp.value = Date.now()
      
      // Сохраняем множитель для расчета XP
      const clickMultiplierValue = clickMultiplier.value
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Обновляем моковые данные
      if (clickerStats.value) {
        clickerStats.value.total_clicks += clicksToSave
        clickerStats.value.last_save_time = new Date().toISOString()
        clickerStats.value.last_save_count = clicksToSave
        clickerStats.value.updated_at = new Date().toISOString()
      } else {
        clickerStats.value = {
          ...mockClickerStats,
          total_clicks: clicksToSave,
          last_save_time: new Date().toISOString(),
          last_save_count: clicksToSave,
          updated_at: new Date().toISOString()
        }
      }
      
      // Добавляем XP в профиль пользователя
      const xpToAdd = Math.floor(clicksToSave * clickMultiplierValue)
      
      try {
        if (xpToAdd > 0) {
          const updatedXp = await profileStore.addXp(xpToAdd)
          console.log(`Добавлено ${xpToAdd} XP в профиль пользователя, новый total_xp: ${updatedXp}`)
        }
      } catch (xpError) {
        console.error('Ошибка при добавлении XP в профиль:', xpError)
      }
      
      // Обновляем позицию в таблице лидеров
      if (userRank.value) {
        userRank.value.score += clicksToSave
        // Пересчитываем ранг (упрощенно)
        if (userRank.value.score > mockLeaderboard[mockLeaderboard.length - 1].score) {
          userRank.value.rank = mockLeaderboard.length
        }
      }
      
      return {
        success: true,
        data: {
          status: 'success',
          total_clicks: clickerStats.value.total_clicks
        }
      }
    } catch (e) {
      console.error('Ошибка при сохранении кликов:', e)
      error.value = e instanceof Error ? e.message : 'Ошибка при сохранении кликов'
      return null
    }
  }
  
  /**
   * Добавить клик
   */
  const addClick = (count = 1) => {
    sessionClicks.value += count
    
    // Автоматически сохраняем клики каждые 30 секунд
    const timeSinceLastSave = Date.now() - lastSaveTimestamp.value
    if (timeSinceLastSave > 30000 && sessionClicks.value > 0) {
      saveClicks()
    }
  }
  
  /**
   * Установить множитель кликов
   */
  const setMultiplier = (value: number) => {
    clickMultiplier.value = value
  }
  
  /**
   * Сбросить сессию
   */
  const resetSession = () => {
    sessionClicks.value = 0
    sessionStartTime.value = Date.now()
  }
  
  /**
   * Инициализация при создании хранилища
   */
  const initialize = async () => {
    await loadStats()
    await loadLeaderboard()
  }
  
  // Экспорт интерфейса хранилища
  return {
    // Состояния
    clickerStats,
    recentSessions,
    leaderboard,
    userRank,
    loading,
    error,
    sessionClicks,
    sessionTime,
    clicksPerSecond,
    totalClicks,
    clickMultiplier,
    
    // Методы
    loadStats,
    loadLeaderboard,
    saveClicks,
    addClick,
    setMultiplier,
    resetSession,
    initialize
  }
}) 