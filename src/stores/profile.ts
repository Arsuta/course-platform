import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { UserProfile } from '@/api/types'
import { UserRole } from '@/api/types'

// Константы для расчета уровня (перенесены из ProfileLevel.vue)
export const BASE_XP_PER_LEVEL = 500
export const XP_MULTIPLIER = 1.5

// Вычисление уровня на основе XP
export function calculateLevel(xp: number): number {
  if (xp === undefined || xp === null) return 1
  
  let level = 1
  let xpForNextLevel = BASE_XP_PER_LEVEL

  // Пока у пользователя больше XP, чем нужно для текущего уровня
  while (xp >= xpForNextLevel) {
    level++
    xpForNextLevel += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1))
  }

  return level
}

// Моковые данные для профиля
const mockProfile: UserProfile = {
  id: 'user-123',
  email: 'user@example.com',
  first_name: 'Иван',
  last_name: 'Иванов',
  avatar: 'https://i.pravatar.cc/150?img=3',
  role: UserRole.STUDENT,
  created_at: '2023-01-15T10:30:00',
  updated_at: '2023-05-01T15:45:00',
  total_xp: 1250,
  settings: {
    notifications: {
      email: true,
      push: true
    },
    theme: 'light'
  }
}

// Моковые данные для курсов пользователя
const mockEnrolledCourses = [
  {
    id: '1',
    title: 'Введение в JavaScript',
    description: 'Базовый курс по JavaScript для начинающих разработчиков.',
    thumbnail: 'https://via.placeholder.com/300x200/4F6F52/FFFFFF?text=JavaScript',
    progress: 75,
    last_accessed: '2023-04-28T14:30:00'
  },
  {
    id: '5',
    title: 'Дизайн интерфейсов',
    description: 'Принципы проектирования удобных и красивых интерфейсов.',
    thumbnail: 'https://via.placeholder.com/300x200/9DB2BF/FFFFFF?text=UI',
    progress: 30,
    last_accessed: '2023-04-30T09:15:00'
  },
  {
    id: '8',
    title: 'Веб-разработка для начинающих',
    description: 'Полный курс по основам веб-разработки.',
    thumbnail: 'https://via.placeholder.com/300x200/4F6F52/FFFFFF?text=Web',
    progress: 15,
    last_accessed: '2023-05-01T11:20:00'
  }
]

// Подписчики на изменения XP
interface XpSubscriber {
  id: string;
  callback: (newXp: number, oldXp: number) => void;
}

export const useProfileStore = defineStore('profile', () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const xpSubscribers = reactive<XpSubscriber[]>([])
  const lastSyncTime = ref<number>(Date.now())

  // Подписка на изменения XP
  const subscribeToXpChanges = (id: string, callback: (newXp: number, oldXp: number) => void) => {
    // Удаляем существующую подписку с таким же ID, если есть
    const existingIndex = xpSubscribers.findIndex(sub => sub.id === id)
    if (existingIndex !== -1) {
      xpSubscribers.splice(existingIndex, 1)
    }
    
    // Добавляем новую подписку
    xpSubscribers.push({ id, callback })
    
    // Возвращаем функцию для отписки
    return () => {
      const index = xpSubscribers.findIndex(sub => sub.id === id)
      if (index !== -1) {
        xpSubscribers.splice(index, 1)
      }
    }
  }

  // Уведомление всех подписчиков об изменении XP
  const notifyXpSubscribers = (newXp: number, oldXp: number) => {
    xpSubscribers.forEach(subscriber => {
      try {
        subscriber.callback(newXp, oldXp)
      } catch (error) {
        console.error(`Ошибка в подписчике XP [${subscriber.id}]:`, error)
      }
    })
  }

  const getProfile = async (): Promise<UserProfile | null> => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Сохраняем предыдущее значение XP для сравнения
      const oldXp = user.value?.total_xp || 0
      
      // Используем моковые данные
      user.value = Object.assign({}, mockProfile)
      
      // Если XP изменился, уведомляем подписчиков
      if (user.value.total_xp !== undefined && user.value.total_xp !== oldXp) {
        notifyXpSubscribers(user.value.total_xp, oldXp)
      }
      
      // Обновляем время последней синхронизации
      lastSyncTime.value = Date.now()
      
      return user.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке профиля'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Обновляем моковые данные
      if (user.value) {
        user.value = {
          ...user.value,
          ...profileData,
          updated_at: new Date().toISOString()
        }
      } else {
        // Если профиль еще не загружен, загружаем его и применяем изменения
        await getProfile()
        if (user.value) {
          user.value = {
            ...user.value,
            ...profileData,
            updated_at: new Date().toISOString()
          }
        }
      }
      
      return user.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при обновлении профиля'
      return null
    } finally {
      loading.value = false
    }
  }

  const getEnrolledCourses = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Используем моковые данные
      return mockEnrolledCourses
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
      return []
    } finally {
      loading.value = false
    }
  }

  const getXp = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Возвращаем XP из моковых данных или 0
      return user.value?.total_xp || mockProfile.total_xp || 0
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке XP'
      return 0
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Добавить опыт в профиль пользователя
   * @param xpToAdd - количество XP для добавления
   */
  const addXp = async (xpToAdd: number): Promise<number | null> => {
    try {
      if (xpToAdd <= 0) return user.value?.total_xp || null;
      
      error.value = null
      console.log(`Добавляем ${xpToAdd} XP в профиль пользователя`)
      
      // Сохраняем предыдущее значение XP
      const oldXp = user.value?.total_xp || 0
      
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Обновляем XP в моковых данных
      if (user.value && user.value.total_xp !== undefined) {
        user.value.total_xp += xpToAdd
        
        console.log(`Успешно обновлен XP пользователя: ${oldXp} → ${user.value.total_xp} (+${xpToAdd})`)
        
        // Уведомляем подписчиков об изменении XP
        notifyXpSubscribers(user.value.total_xp, oldXp)
      } else {
        console.log(`Получен новый XP: ${xpToAdd}, но профиль пользователя не загружен`)
        // Если профиль не загружен, пробуем загрузить его
        await getProfile()
        
        // После загрузки профиля добавляем XP
        if (user.value && user.value.total_xp !== undefined) {
          const currentXp = user.value.total_xp
          user.value.total_xp += xpToAdd
          
          // Уведомляем подписчиков об изменении XP
          notifyXpSubscribers(user.value.total_xp, currentXp)
        }
      }
      
      // Обновляем время последней синхронизации
      lastSyncTime.value = Date.now()
      
      return user.value?.total_xp || null
    } catch (e) {
      console.error('Ошибка при добавлении XP:', e)
      error.value = e instanceof Error ? e.message : 'Ошибка при добавлении XP'
      return user.value?.total_xp || null
    }
  }
  
  // Получить текущий уровень пользователя
  const getCurrentLevel = () => {
    if (!user.value || user.value.total_xp === undefined) return 1
    return calculateLevel(user.value.total_xp)
  }
  
  // Получить XP для следующего уровня
  const getXpForNextLevel = () => {
    const level = getCurrentLevel()
    return Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1))
  }
  
  // Получить текущий прогресс уровня в процентах
  const getLevelProgress = () => {
    if (!user.value || user.value.total_xp === undefined) return 0
    
    const xp = user.value.total_xp
    const level = getCurrentLevel()
    let totalXpForPreviousLevels = 0
    
    // Суммируем XP для всех предыдущих уровней
    for (let i = 1; i < level; i++) {
      totalXpForPreviousLevels += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, i - 1))
    }
    
    const currentLevelXp = xp - totalXpForPreviousLevels
    const xpForNextLevel = getXpForNextLevel()
    
    return (currentLevelXp / xpForNextLevel) * 100
  }

  return {
    user,
    loading,
    error,
    lastSyncTime,
    getProfile,
    updateProfile,
    getEnrolledCourses,
    getXp,
    addXp,
    getCurrentLevel,
    getXpForNextLevel,
    getLevelProgress,
    subscribeToXpChanges
  }
}) 