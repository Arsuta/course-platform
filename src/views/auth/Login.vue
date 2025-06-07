<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { AuthApiResponse } from '@/types/auth'

const router = useRouter()
const route = useRoute()

// Форма логина
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const serverError = ref<string | null>(null)
const validationErrors = ref<Record<string, string>>({})

// Store аутентификации
const authStore = useAuthStore()

// Проверка email
const validateEmail = () => {
  if (!email.value) {
    validationErrors.value.email = 'Email обязателен'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    validationErrors.value.email = 'Некорректный формат email'
    return false
  }
  validationErrors.value.email = ''
  return true
}

// Проверка пароля
const validatePassword = () => {
  if (!password.value) {
    validationErrors.value.password = 'Пароль обязателен'
    return false
  }
  if (password.value.length < 6) {
    validationErrors.value.password = 'Пароль должен содержать минимум 6 символов'
    return false
  }
  validationErrors.value.password = ''
  return true
}

// Проверка формы
const validateForm = () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  return isEmailValid && isPasswordValid
}

// Переход к верификации
const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = null
  serverError.value = null
  
  try {
    console.log('Отправка запроса на вход:', {
      email: email.value,
      password: password.value
    })
    
    const response = await authStore.login(email.value, password.value)
    
    console.log('Ответ от сервера:', response)
    
    // Проверяем, авторизован ли пользователь без верификации
    if (authStore.isAuthenticated) {
      console.log('Пользователь авторизован, перенаправление на главную')
      router.push('/')
      return
    }
    
    // Проверяем наличие verification_id для двухфакторной аутентификации
    if (response && response.verification_id) {
      console.log('Перенаправление на страницу верификации кода')
      // Сохраняем verification_id в localStorage
      localStorage.setItem('verification_id', response.verification_id.toString());
      router.push({
        name: 'verify',
        query: { 
          type: 'login',
          id: response.verification_id
        }
      })
    } else {
      // Если есть сообщение о необходимости верификации, но нет ID
      console.log('Верификация требуется, но ID не предоставлен, используем время как ID')
      const tempId = Date.now().toString();
      localStorage.setItem('verification_id', tempId);
      router.push({
        name: 'verify',
        query: { 
          type: 'login',
          id: tempId // Используем временную метку как идентификатор
        }
      })
    }
  } catch (err: any) {
    console.error('Ошибка при входе:', err)
    errorMessage.value = err.message || 'Произошла ошибка при входе'
    serverError.value = errorMessage.value
    
    // Если это ошибка неподтвержденного email
    if (err.message && err.message.includes('не подтвержден')) {
      serverError.value = 'Email не подтвержден. Пожалуйста, завершите регистрацию или зарегистрируйтесь повторно.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/oauth/google`
}

// Проверяем, был ли редирект
onMounted(() => {
  const message = route.params.message as string
  
  if (message) {
    serverError.value = message
  }
})
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Войти в аккаунт
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-blue-50 p-6 sm:p-8 shadow rounded-lg">
        <!-- Сообщение об ошибке -->
        <div v-if="serverError" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p class="text-sm text-red-700">{{ serverError }}</p>
          <div v-if="serverError.includes('не подтвержден')" class="mt-2">
            <router-link to="/auth/register" class="text-sm font-medium text-primary hover:text-primary-dark">
              Перейти к регистрации →
            </router-link>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                @blur="validateEmail"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                :class="{ 'ring-red-500': validationErrors.email }"
              />
              <p v-if="validationErrors.email" class="mt-2 text-sm text-red-600">
                {{ validationErrors.email }}
              </p>
            </div>
          </div>

          <!-- Пароль -->
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
                Пароль
              </label>
              <div class="text-sm">
                <router-link to="/auth/forgot-password" class="font-semibold text-primary hover:text-primary-dark">
                  Забыли пароль?
                </router-link>
              </div>
            </div>
            <div class="mt-2 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                required
                @blur="validatePassword"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                :class="{ 'ring-red-500': validationErrors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <span v-if="showPassword">Скрыть</span>
                <span v-else>Показать</span>
              </button>
              <p v-if="validationErrors.password" class="mt-2 text-sm text-red-600">
                {{ validationErrors.password }}
              </p>
            </div>
          </div>

          <!-- Запомнить меня -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Запомнить меня</label>
            </div>
          </div>

          <!-- Кнопка входа -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span v-if="isLoading" class="animate-spin mr-2">
                ◌
              </span>
              <span>Войти</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Нет аккаунта?</span>
            </div>
          </div>
          <div class="mt-6">
            <button
              type="button"
              @click="router.push('/auth/register')"
              class="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 