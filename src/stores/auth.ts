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
      // Здесь будет логика авторизации
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
    },

    async register(name: string, email: string, password: string) {
      // Здесь будет логика регистрации с бэкендом
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
