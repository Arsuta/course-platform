import { defineStore } from 'pinia'

const DEFAULT_COLOR = '#5E761E'

// Интерфейс для настроек уведомлений
interface NotificationSettings {
  emailNotifications: boolean;
  courseUpdates: boolean;
  newMessages: boolean;
  promotions: boolean;
}

// Значения настроек уведомлений по умолчанию
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  courseUpdates: true,
  newMessages: true,
  promotions: false
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const shouldSaveColor = localStorage.getItem('shouldSaveColor') === 'true'
    const savedColor = shouldSaveColor ? (localStorage.getItem('accentColor') || DEFAULT_COLOR) : DEFAULT_COLOR
    const darkMode = localStorage.getItem('darkMode') === 'true'
    
    // Применяем сохраненный цвет при инициализации
    document.documentElement.style.setProperty('--color-primary', savedColor)
    
    // Применяем темный режим, если включен
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
    
    // Генерация оттенков
    const lighten = (color: string, amount: number) => {
      const rgb = parseInt(color.slice(1), 16)
      const r = Math.min(255, ((rgb >> 16) & 0xff) + amount)
      const g = Math.min(255, ((rgb >> 8) & 0xff) + amount)
      const b = Math.min(255, (rgb & 0xff) + amount)
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
    }
    
    const darken = (color: string, amount: number) => {
      const rgb = parseInt(color.slice(1), 16)
      const r = Math.max(0, ((rgb >> 16) & 0xff) - amount)
      const g = Math.max(0, ((rgb >> 8) & 0xff) - amount)
      const b = Math.max(0, (rgb & 0xff) - amount)
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
    }
    
    document.documentElement.style.setProperty('--color-primary-light', lighten(savedColor, 40))
    document.documentElement.style.setProperty('--color-primary-dark', darken(savedColor, 20))
    
    return {
      accentColor: savedColor,
      shouldSaveColor,
      darkMode,
      user: {
        name: '',
        email: ''
      }
    }
  },
  
  actions: {
    setAccentColor(color: string) {
      this.accentColor = color
      if (this.shouldSaveColor) {
        localStorage.setItem('accentColor', color)
      }
      document.documentElement.style.setProperty('--color-primary', color)
      
      // Генерация оттенков
      const lighten = (color: string, amount: number) => {
        const rgb = parseInt(color.slice(1), 16)
        const r = Math.min(255, ((rgb >> 16) & 0xff) + amount)
        const g = Math.min(255, ((rgb >> 8) & 0xff) + amount)
        const b = Math.min(255, (rgb & 0xff) + amount)
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
      }
      
      const darken = (color: string, amount: number) => {
        const rgb = parseInt(color.slice(1), 16)
        const r = Math.max(0, ((rgb >> 16) & 0xff) - amount)
        const g = Math.max(0, ((rgb >> 8) & 0xff) - amount)
        const b = Math.max(0, (rgb & 0xff) - amount)
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
      }
      
      document.documentElement.style.setProperty('--color-primary-light', lighten(color, 40))
      document.documentElement.style.setProperty('--color-primary-dark', darken(color, 20))
    },

    setShouldSaveColor(value: boolean) {
      this.shouldSaveColor = value
      localStorage.setItem('shouldSaveColor', value.toString())
      if (!value) {
        localStorage.removeItem('accentColor')
      } else {
        localStorage.setItem('accentColor', this.accentColor)
      }
    },

    setDarkMode(value: boolean) {
      this.darkMode = value
      localStorage.setItem('darkMode', value.toString())
      
      if (value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    resetToDefaultColor() {
      this.setAccentColor(DEFAULT_COLOR)
    },
    
    // Получить настройки уведомлений
    getNotificationSettings(): NotificationSettings {
      try {
        const savedSettings = localStorage.getItem('notificationSettings')
        if (savedSettings) {
          return JSON.parse(savedSettings)
        }
      } catch (error) {
        console.error('Ошибка при чтении настроек уведомлений:', error)
      }
      
      return DEFAULT_NOTIFICATION_SETTINGS
    },
    
    // Сохранить настройки уведомлений
    saveNotificationSettings(settings: NotificationSettings) {
      try {
        localStorage.setItem('notificationSettings', JSON.stringify(settings))
      } catch (error) {
        console.error('Ошибка при сохранении настроек уведомлений:', error)
      }
    }
  }
}) 