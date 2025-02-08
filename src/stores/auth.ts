import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  level?: number
  xp?: number
  followers?: number[]
  following?: number[]
}

interface AuthState {
  user: User | null
  token: string | null
}

// Моковые данные пользователей
const mockUsers = [
  {
    id: 1,
    name: 'Арсений Канеп',
    email: 'kanep.arseniy@gmail.com',
    password: 'Zaebal2001',
    avatar: '/images/Arseniy.jpg',
    level: 15,
    xp: 750,
    followers: [2, 3],
    following: [2]
  },
  {
    id: 2,
    name: 'Иван Закомалдин',
    email: 'zakomaldin.ivan@gmail.com',
    password: 'Zaebal2001',
    avatar: '/images/Ivan.jpg',
    level: 12,
    xp: 450,
    followers: [1, 3],
    following: [1, 3]
  },
  {
    id: 3,
    name: 'Матвей Ручин',
    email: 'ruchin.mathway@gmail.com',
    password: 'Zaebal2001',
    avatar: '/images/Math.jpg',
    level: 18,
    xp: 920,
    followers: [1, 2],
    following: [2]
  }
]

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    getUserById(id: number) {
      const user = mockUsers.find(u => u.id === id)
      if (!user) return null
      
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    },

    addXP(amount: number) {
      if (!this.user) return
      
      // Находим пользователя в моковых данных
      const mockUser = mockUsers.find(u => u.id === this.user!.id)
      if (!mockUser) return

      // Обновляем XP
      mockUser.xp = (mockUser.xp || 0) + amount
      this.user.xp = mockUser.xp

      // Проверяем, нужно ли повысить уровень
      const nextLevelXP = Math.pow((mockUser.level || 1), 2) * 100
      if (mockUser.xp >= nextLevelXP) {
        mockUser.level = (mockUser.level || 1) + 1
        this.user.level = mockUser.level
      }
    },

    async login(email: string, password: string) {
      // Имитация проверки учетных данных
      const user = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Неверный email или пароль')
      }

      // Генерация простого токена (в реальном приложении будет другая логика)
      const token = btoa(user.email + Date.now())
      
      this.token = token
      this.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        followers: user.followers,
        following: user.following
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async register(name: string, email: string, password: string) {
      // Проверка, не занят ли email
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Этот email уже зарегистрирован')
      }

      // В реальном приложении здесь будет запрос к API
      const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        password,
        avatar: 'https://via.placeholder.com/128',
        level: 1,
        xp: 0,
        followers: [],
        following: []
      }

      mockUsers.push(newUser)

      // Автоматический вход после регистрации
      await this.login(email, password)
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // Восстановление сессии при перезагрузке страницы
    initAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        this.token = token
        this.user = JSON.parse(userStr)
      }
    },

    // Функции подписки/отписки
    follow(userId: number) {
      if (!this.user) return
      if (!this.user.following) {
        this.user.following = []
      }
      this.user.following.push(userId)
    },

    unfollow(userId: number) {
      if (!this.user || !this.user.following) return
      this.user.following = this.user.following.filter(id => id !== userId)
    }
  }
})
