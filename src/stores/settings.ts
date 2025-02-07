import { defineStore } from 'pinia'


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    accentColor: localStorage.getItem('accentColor') || '#FF5722',
    user: {
      name: '',
      email: ''
    }
  }),
  
  actions: {

    setAccentColor(color: string) {
      this.accentColor = color
      localStorage.setItem('accentColor', color)
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
    }
  }
}) 