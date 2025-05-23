<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthLogo from '@/components/auth/AuthLogo.vue'
import VerificationCode from '@/components/auth/VerificationCode.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

interface ResetPasswordForm {
  email: string
  newPassword: string
  confirmPassword: string
}

const form = ref<ResetPasswordForm>({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')
const showNewPasswordForm = ref(false)

const isVerifying = computed(() => authStore.isVerifying)
const verificationEmail = computed(() => authStore.verificationEmail)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    await authStore.resetPasswordRequest(form.value.email)
  } catch (e) {
    error.value = 'Ошибка при отправке запроса на сброс пароля'
  } finally {
    isLoading.value = false
  }
}

const handleVerifyCode = async (code: string) => {
  try {
    if (form.value.newPassword !== form.value.confirmPassword) {
      error.value = 'Пароли не совпадают'
      return
    }

    if (form.value.newPassword.length < 8) {
      error.value = 'Пароль должен содержать минимум 8 символов'
      return
    }

    isLoading.value = true
    error.value = ''
    
    await authStore.resetPasswordConfirm(code, form.value.newPassword)
    router.push('/auth/login')
  } catch (e) {
    error.value = 'Неверный код подтверждения'
  } finally {
    isLoading.value = false
  }
}

const handleCancelVerification = () => {
  authStore.$patch({
    isVerifying: false,
    verificationEmail: null
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <VerificationCode
      v-if="isVerifying"
      :email="verificationEmail!"
      :is-loading="isLoading"
      :error="error"
      @submit="handleVerifyCode"
      @cancel="handleCancelVerification"
    >
      <div class="mt-4 space-y-4">
        <div>
          <label for="new-password" class="sr-only">Новый пароль</label>
          <input
            id="new-password"
            v-model="form.newPassword"
            name="new-password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Новый пароль"
          >
        </div>
        <div>
          <label for="confirm-password" class="sr-only">Подтвердите пароль</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            name="confirm-password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Подтвердите пароль"
          >
        </div>
      </div>
    </VerificationCode>
    
    <div v-else class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <AuthLogo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Восстановление пароля
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Введите email для получения инструкций
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email-address" class="sr-only">Email</label>
          <input
            id="email-address"
            v-model="form.email"
            name="email"
            type="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Email"
          >
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg 
                v-if="!isLoading"
                class="h-5 w-5 text-primary-dark group-hover:text-primary-light" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path 
                  fill-rule="evenodd" 
                  d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" 
                  clip-rule="evenodd" 
                />
              </svg>
              <svg 
                v-else
                class="animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  class="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  stroke-width="4"
                />
                <path 
                  class="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            {{ isLoading ? 'Отправка...' : 'Отправить инструкции' }}
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Вспомнили пароль?
          <router-link 
            to="/auth/login" 
            class="font-medium text-primary hover:text-primary-dark"
          >
            Войти
          </router-link>
        </p>
      </div>

      <div 
        v-if="error"
        class="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template> 