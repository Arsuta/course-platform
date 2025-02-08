<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLogo from '@/components/auth/AuthLogo.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Пароли не совпадают'
      return
    }

    isLoading.value = true
    error.value = ''
    
    // Имитация задержки запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await authStore.register(form.value.name, form.value.email, form.value.password)
    router.push('/')
  } catch (e) {
    error.value = 'Ошибка при регистрации. Возможно, email уже занят.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleRegister = () => {
  // Здесь будет логика регистрации через Google
  console.log('Google register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <AuthLogo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Создайте аккаунт
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Присоединяйтесь к нашему сообществу
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Имя</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Имя"
            >
          </div>
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Пароль"
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

        <div class="flex items-center">
          <input
            id="accept-terms"
            v-model="form.acceptTerms"
            name="accept-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          >
          <label for="accept-terms" class="ml-2 block text-sm text-gray-900">
            Я принимаю <a href="#" class="font-medium text-primary hover:text-primary-dark">условия использования</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !form.acceptTerms"
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
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
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
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Или зарегистрируйтесь через
              </span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleRegister"
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
          Уже есть аккаунт?
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