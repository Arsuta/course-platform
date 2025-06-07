<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { AuthApiResponse } from '@/types/auth'

const router = useRouter()

// Форма регистрации
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const serverError = ref<string | null>(null)
const validationErrors = ref<Record<string, string>>({})
const successMessage = ref<string | null>(null)

// Store аутентификации
const authStore = useAuthStore()

// Валидация email
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

// Валидация пароля
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

// Валидация подтверждения пароля
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Подтвердите пароль'
    return false
  }
  
  if (confirmPassword.value !== password.value) {
    validationErrors.value.confirmPassword = 'Пароли не совпадают'
    return false
  }
  
  validationErrors.value.confirmPassword = ''
  return true
}

// Валидация формы
const validateForm = () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  
  return isEmailValid && isPasswordValid && isConfirmPasswordValid
}

// Обработка регистрации
const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = null
  serverError.value = null
  successMessage.value = null
  
  try {
    console.log('Отправка запроса на регистрацию:', {
      email: email.value,
      password: password.value
    })
    
    const response = await authStore.register(
      email.value, 
      password.value,
      'User', // Дефолтное имя
      'User'  // Дефолтная фамилия
    )
    
    console.log('Ответ от сервера:', response)
    
    // Показываем сообщение об успешной регистрации перед редиректом
    successMessage.value = `Код подтверждения отправлен на ${email.value}. Проверьте вашу почту, включая папку "Спам".`
    
    // Получаем verification_id (реальный или сгенерированный)
    const verificationId = response?.verification_id || btoa(email.value)
    
    console.log('ID для верификации:', verificationId)
    
    // Добавляем небольшую задержку перед переходом
    setTimeout(() => {
      console.log('Перенаправление на страницу верификации...')
      router.push({
        name: 'verify',
        query: { 
          type: 'register',
          id: verificationId
        }
      })
    }, 2000) // Увеличиваем задержку до 2 секунд, чтобы пользователь успел прочитать сообщение
  } catch (err: any) {
    console.error('Ошибка при регистрации:', err)
    errorMessage.value = err.message || 'Произошла ошибка при регистрации'
    serverError.value = errorMessage.value
    successMessage.value = null
    
    // Если это ошибка существующего email
    if (err.message && err.message.includes('email already exists')) {
      serverError.value = 'Этот email уже зарегистрирован. Пожалуйста, воспользуйтесь формой входа или восстановления пароля.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Создание аккаунта
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-blue-50 p-6 sm:p-8 shadow rounded-lg">
        <!-- Сообщение об ошибке -->
        <div v-if="serverError" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p class="text-sm text-red-700">{{ serverError }}</p>
        </div>
        
        <!-- Сообщение об успехе -->
        <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p class="text-sm text-green-700">{{ successMessage }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
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
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
              Пароль
            </label>
            <div class="mt-2 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="new-password"
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

          <!-- Подтверждение пароля -->
          <div>
            <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">
              Подтверждение пароля
            </label>
            <div class="mt-2 relative">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                name="confirm-password"
                autocomplete="new-password"
                required
                @blur="validateConfirmPassword"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                :class="{ 'ring-red-500': validationErrors.confirmPassword }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <span v-if="showConfirmPassword">Скрыть</span>
                <span v-else>Показать</span>
              </button>
              <p v-if="validationErrors.confirmPassword" class="mt-2 text-sm text-red-600">
                {{ validationErrors.confirmPassword }}
              </p>
            </div>
          </div>

          <!-- Кнопка регистрации -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span v-if="isLoading" class="animate-spin mr-2">
                ◌
              </span>
              <span>Зарегистрироваться</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Уже есть аккаунт?</span>
            </div>
          </div>
          <div class="mt-6">
            <button
              type="button"
              @click="router.push('/auth/login')"
              class="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 