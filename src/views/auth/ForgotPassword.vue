<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoading } from '@/composables/useLoading'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, withLoading } = useLoading()

// Состояние восстановления пароля
enum ResetState {
  REQUEST = 'request',      // Начальное состояние (запрос сброса пароля)
  VERIFICATION = 'verification',  // Проверка кода подтверждения
  NEW_PASSWORD = 'new_password'   // Ввод нового пароля
}

// Состояние процесса
const currentState = ref<ResetState>(ResetState.REQUEST)

// Форма для восстановления пароля
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const serverError = ref<string | null>(null)
const validationErrors = ref<Record<string, string>>({})

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

// Проверка кода
const validateCode = () => {
  if (!code.value) {
    validationErrors.value.code = 'Код подтверждения обязателен'
    return false
  }
  
  if (code.value.length !== 6) {
    validationErrors.value.code = 'Код должен состоять из 6 цифр'
    return false
  }
  
  if (!/^\d+$/.test(code.value)) {
    validationErrors.value.code = 'Код должен содержать только цифры'
    return false
  }
  
  validationErrors.value.code = ''
  return true
}

// Проверка пароля
const validatePassword = () => {
  if (!newPassword.value) {
    validationErrors.value.newPassword = 'Пароль обязателен'
    return false
  }
  
  if (newPassword.value.length < 6) {
    validationErrors.value.newPassword = 'Пароль должен содержать минимум 6 символов'
    return false
  }
  
  validationErrors.value.newPassword = ''
  return true
}

// Проверка подтверждения пароля
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Подтвердите пароль'
    return false
  }
  
  if (confirmPassword.value !== newPassword.value) {
    validationErrors.value.confirmPassword = 'Пароли не совпадают'
    return false
  }
  
  validationErrors.value.confirmPassword = ''
  return true
}

// Обработка запроса на сброс пароля
const handleRequestReset = async () => {
  // Сбрасываем ошибки
  serverError.value = null
  validationErrors.value = {}
  
  // Валидация email
  if (!validateEmail()) {
    return
  }
  
  await withLoading(async () => {
    try {
      // Отправляем запрос на сброс пароля
      await authStore.requestPasswordReset(email.value)
      
      // Переходим к следующему шагу
      currentState.value = ResetState.VERIFICATION
    } catch (err) {
      console.error('Ошибка при запросе сброса пароля:', err)
      serverError.value = err instanceof Error ? err.message : 'Ошибка при запросе сброса пароля'
    }
  })
}

// Обработка подтверждения кода
const handleVerifyCode = async () => {
  // Сбрасываем ошибки
  serverError.value = null
  validationErrors.value = {}
  
  // Валидация кода
  if (!validateCode()) {
    return
  }
  
  // Переходим к следующему шагу (без запроса к API на этом этапе)
  currentState.value = ResetState.NEW_PASSWORD
}

// Обработка установки нового пароля
const handleSetNewPassword = async () => {
  // Сбрасываем ошибки
  serverError.value = null
  validationErrors.value = {}
  
  // Валидация паролей
  if (!validatePassword() || !validateConfirmPassword()) {
    return
  }
  
  await withLoading(async () => {
    try {
      // Отправляем запрос на сброс пароля с новым паролем
      await authStore.confirmPasswordReset(code.value, newPassword.value)
      
      // Перенаправляем на страницу входа после успешного сброса
      router.push('/auth/login')
    } catch (err) {
      console.error('Ошибка при сбросе пароля:', err)
      serverError.value = err instanceof Error ? err.message : 'Ошибка при сбросе пароля'
    }
  })
}

// Заголовок формы в зависимости от текущего шага
const formTitle = computed(() => {
  switch (currentState.value) {
    case ResetState.REQUEST:
      return 'Восстановление пароля'
    case ResetState.VERIFICATION:
      return 'Проверка кода'
    case ResetState.NEW_PASSWORD:
      return 'Создание нового пароля'
    default:
      return 'Восстановление пароля'
  }
})

// Отмена восстановления
const handleCancel = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ formTitle }}
      </h2>
      
      <p v-if="currentState === ResetState.VERIFICATION" class="mt-2 text-center text-sm text-gray-600">
        Мы отправили код подтверждения на вашу почту <strong>{{ email }}</strong>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white p-6 sm:p-8 shadow rounded-lg">
        <!-- Сообщение об ошибке -->
        <div v-if="serverError" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p class="text-sm text-red-700">{{ serverError }}</p>
        </div>

        <!-- Шаг 1: Запрос на сброс пароля -->
        <form v-if="currentState === ResetState.REQUEST" @submit.prevent="handleRequestReset" class="space-y-6">
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

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-block animate-spin mr-2">&#8635;</span>
              Отправить код
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="handleCancel"
              class="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Вернуться к входу
            </button>
          </div>
        </form>

        <!-- Шаг 2: Проверка кода -->
        <form v-else-if="currentState === ResetState.VERIFICATION" @submit.prevent="handleVerifyCode" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium leading-6 text-gray-900">
              Код подтверждения
            </label>
            <div class="mt-2">
              <input
                id="code"
                v-model="code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                required
                @blur="validateCode"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                :class="{ 'ring-red-500': validationErrors.code }"
                placeholder="Введите 6-значный код"
              />
              <p v-if="validationErrors.code" class="mt-2 text-sm text-red-600">
                {{ validationErrors.code }}
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-block animate-spin mr-2">&#8635;</span>
              Подтвердить
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="currentState = ResetState.REQUEST"
              class="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Назад
            </button>
            
            <button
              type="button"
              @click="handleRequestReset"
              :disabled="isLoading"
              class="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Отправить код повторно
            </button>
          </div>
        </form>

        <!-- Шаг 3: Новый пароль -->
        <form v-else-if="currentState === ResetState.NEW_PASSWORD" @submit.prevent="handleSetNewPassword" class="space-y-6">
          <!-- Новый пароль -->
          <div>
            <label for="new-password" class="block text-sm font-medium leading-6 text-gray-900">
              Новый пароль
            </label>
            <div class="mt-2 relative">
              <input
                id="new-password"
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                name="new-password"
                autocomplete="new-password"
                required
                @blur="validatePassword"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                :class="{ 'ring-red-500': validationErrors.newPassword }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <span v-if="showPassword">Скрыть</span>
                <span v-else>Показать</span>
              </button>
              <p v-if="validationErrors.newPassword" class="mt-2 text-sm text-red-600">
                {{ validationErrors.newPassword }}
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

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="inline-block animate-spin mr-2">&#8635;</span>
              Сбросить пароль
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="currentState = ResetState.VERIFICATION"
              class="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Назад
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 