import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import type { User } from '@/api/types'

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserCreate extends UserLogin {
  role: 'student' | 'author' | 'admin';
}

interface VerificationRequest {
  email: string;
  code: string;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetConfirm {
  email: string;
  code: string;
  new_password: string;
}

interface RefreshInput {
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isVerifying: boolean;
  verificationEmail: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isVerifying = ref(false)
  const verificationEmail = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  const setUser = (userData: User | null) => {
    user.value = userData
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      api.courses.setToken(newToken)
      api.categories.setToken(newToken)
      api.profile.setToken(newToken)
    } else {
      api.courses.clearToken()
      api.categories.clearToken()
      api.profile.clearToken()
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.auth.login(email, password)
      user.value = response.data.user
      api.setToken(response.data.access_token)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при входе'
      return false
    } finally {
      loading.value = false
    }
  }

  const verifyLogin = async (code: string): Promise<void> => {
    if (!verificationEmail.value) {
        throw new Error('Email не найден')
      }

      try {
        const data: VerificationRequest = {
        email: verificationEmail.value,
          code
        }
      // TODO: Заменить на использование нового API
      const response = { data: { access_token: 'test', refresh_token: 'test' } }

        const { access_token, refresh_token } = response.data
      setToken(access_token)
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        
      isVerifying.value = false
      verificationEmail.value = null
      } catch (error) {
        throw new Error('Неверный код подтверждения')
      }
  }

  const register = async (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
  }) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.auth.register(userData)
      user.value = response.data.user
      api.setToken(response.data.access_token)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при регистрации'
      return false
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async (code: string): Promise<void> => {
    if (!verificationEmail.value) {
        throw new Error('Email не найден')
      }

      try {
        const data: VerificationRequest = {
        email: verificationEmail.value,
          code
        }
      // TODO: Заменить на использование нового API
      const response = { data: { access_token: 'test', refresh_token: 'test' } }

        const { access_token, refresh_token } = response.data
      setToken(access_token)
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        
      isVerifying.value = false
      verificationEmail.value = null
      } catch (error) {
        throw new Error('Неверный код подтверждения')
      }
  }

  const resetPasswordRequest = async (email: string): Promise<void> => {
      try {
        const data: PasswordResetRequest = { email }
      // TODO: Заменить на использование нового API
      isVerifying.value = true
      verificationEmail.value = email
      } catch (error) {
        throw new Error('Ошибка при запросе сброса пароля')
      }
  }

  const resetPasswordConfirm = async (code: string, newPassword: string): Promise<void> => {
    if (!verificationEmail.value) {
        throw new Error('Email не найден')
      }

      try {
        const data: PasswordResetConfirm = {
        email: verificationEmail.value,
          code,
          new_password: newPassword
        }
      // TODO: Заменить на использование нового API
        
      isVerifying.value = false
      verificationEmail.value = null
      } catch (error) {
        throw new Error('Ошибка при сбросе пароля')
      }
  }

  const refreshToken = async (): Promise<void> => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('Refresh token не найден')
      }

      try {
        const data: RefreshInput = { refresh_token: refreshToken }
      // TODO: Заменить на использование нового API
      const response = { data: { access_token: 'test', refresh_token: 'test' } }

        const { access_token, refresh_token } = response.data
      setToken(access_token)
        localStorage.setItem('token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
      } catch (error) {
      logout()
        throw new Error('Ошибка при обновлении токена')
      }
  }

  const logout = () => {
    user.value = null
    api.clearToken()
  }

  const initAuth = (): void => {
      const token = localStorage.getItem('token')
      if (token) {
      setToken(token)
      }
    }

  const checkAuth = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.auth.me()
      user.value = response.data
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при проверке авторизации'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.profile.updateProfile(userData)
      user.value = response.data
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при обновлении профиля'
      return false
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (userId: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.profile.getUserById(userId)
      return response.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при получении пользователя'
      throw e
    } finally {
      loading.value = false
    }
  }

  const follow = async (userId: string) => {
    try {
      loading.value = true
      error.value = null
      await api.profile.followUser(userId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при подписке'
      return false
    } finally {
      loading.value = false
    }
  }

  const unfollow = async (userId: string) => {
    try {
      loading.value = true
      error.value = null
      await api.profile.unfollowUser(userId)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при отписке'
      return false
    } finally {
      loading.value = false
    }
  }

  const addXP = async (xp: number) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.profile.addXP(xp)
      user.value = response.data
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при начислении XP'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    isVerifying,
    verificationEmail,
    loading,
    error,
    isAuthenticated,
    currentUser,
    login,
    verifyLogin,
    register,
    verifyEmail,
    resetPasswordRequest,
    resetPasswordConfirm,
    refreshToken,
    logout,
    initAuth,
    checkAuth,
    updateProfile,
    getUserById,
    follow,
    unfollow,
    addXP
  }
})
