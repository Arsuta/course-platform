import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
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
    password: 'Zaebal2001'
  },
  {
    id: 2,
    name: 'Иван Закомалдин',
    email: 'zakomaldin.ivan@gmail.com',
    password: 'Zaebal2001'
  },
  {
    id: 3,
    name: 'Матвей Ручин',
    email: 'ruchin.mathway@gmail.com',
    password: 'Zaebal2001'
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
        email: user.email
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
        password
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
    }
  }
})
