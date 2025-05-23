import { defineStore } from 'pinia'
import apiClient from '@/api/client'
import type { User, TokenPair, UserLogin, UserCreate, VerificationRequest, PasswordResetRequest, PasswordResetConfirm, RefreshInput } from '@/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isVerifying: boolean
  verificationEmail: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isVerifying: false,
    verificationEmail: null
  }),

  getters: {
    isAuthenticated: (state: AuthState): boolean => !!state.token,
    currentUser: (state: AuthState): User | null => state.user
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const data: UserLogin = { email, password }
        await apiClient.post('/login', data)
        this.isVerifying = true
        this.verificationEmail = email
      } catch (error) {
        throw new Error('Неверный email или пароль')
      }
    },

    async verifyLogin(code: string): Promise<void> {
      if (!this.verificationEmail) {
        throw new Error('Email не найден')
      }

      try {
        const data: VerificationRequest = {
          email: this.verificationEmail,
          code
        }
        const response = await apiClient.post<TokenPair>('/verify-login', data)

        const { access_token, refresh_token } = response.data
        this.token = access_token
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        
        this.isVerifying = false
        this.verificationEmail = null
      } catch (error) {
        throw new Error('Неверный код подтверждения')
      }
    },

    async register(email: string, password: string, role: 'student' | 'author' | 'admin'): Promise<void> {
      try {
        const data: UserCreate = { email, password, role }
        await apiClient.post('/register', data)
        this.isVerifying = true
        this.verificationEmail = email
      } catch (error) {
        throw new Error('Ошибка при регистрации')
      }
    },

    async verifyEmail(code: string): Promise<void> {
      if (!this.verificationEmail) {
        throw new Error('Email не найден')
      }

      try {
        const data: VerificationRequest = {
          email: this.verificationEmail,
          code
        }
        const response = await apiClient.post<TokenPair>('/verify-email', data)

        const { access_token, refresh_token } = response.data
        this.token = access_token
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        
        this.isVerifying = false
        this.verificationEmail = null
      } catch (error) {
        throw new Error('Неверный код подтверждения')
      }
    },

    async resetPasswordRequest(email: string): Promise<void> {
      try {
        const data: PasswordResetRequest = { email }
        await apiClient.post('/reset-password/request', data)
        this.isVerifying = true
        this.verificationEmail = email
      } catch (error) {
        throw new Error('Ошибка при запросе сброса пароля')
      }
    },

    async resetPasswordConfirm(code: string, newPassword: string): Promise<void> {
      if (!this.verificationEmail) {
        throw new Error('Email не найден')
      }

      try {
        const data: PasswordResetConfirm = {
          email: this.verificationEmail,
          code,
          new_password: newPassword
        }
        await apiClient.post('/reset-password/confirm', data)
        
        this.isVerifying = false
        this.verificationEmail = null
      } catch (error) {
        throw new Error('Ошибка при сбросе пароля')
      }
    },

    async refreshToken(): Promise<void> {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('Refresh token не найден')
      }

      try {
        const data: RefreshInput = { refresh_token: refreshToken }
        const response = await apiClient.post<TokenPair>('/refresh', data)

        const { access_token, refresh_token } = response.data
        this.token = access_token
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
      } catch (error) {
        this.logout()
        throw new Error('Ошибка при обновлении токена')
      }
    },

    async logout(): Promise<void> {
      this.token = null
      this.user = null
      this.isVerifying = false
      this.verificationEmail = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
    },

    initAuth(): void {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
      }
    }
  }
})
