<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthLogo from '@/components/auth/AuthLogo.vue'
import VerificationCode from '@/components/auth/VerificationCode.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()

interface LoginForm {
  email: string
  password: string
}

const form = ref<LoginForm>({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

const isVerifying = computed(() => authStore.isVerifying)
const verificationEmail = computed(() => authStore.verificationEmail)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.login(form.value.email, form.value.password)
  } catch (e) {
    error.value = 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}

const handleVerifyCode = async (code: string) => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.verifyLogin(code)
    
    // Проверяем, есть ли сохраненный путь для редиректа
    const redirectPath = route.query.redirect as string
    router.push(redirectPath || '/')
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

const handleGoogleLogin = () => {
  // Здесь будет логика входа через Google
  console.log('Google login')
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
    />
    
    <div v-else class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <AuthLogo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          С возвращением!
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Пожалуйста, введите свои данные
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Email"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Пароль"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link 
              to="/auth/forgot-password"
              class="font-medium text-primary hover:text-primary-dark"
            >
              Забыли пароль?
            </router-link>
          </div>
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
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
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
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Или войдите через
              </span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleLogin"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <img 
                class="h-5 w-5 mr-2" 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google logo"
              >
              Google
            </button>
          </div>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Нет аккаунта?
          <router-link 
            to="/auth/register" 
            class="font-medium text-primary hover:text-primary-dark"
          >
            Зарегистрироваться
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