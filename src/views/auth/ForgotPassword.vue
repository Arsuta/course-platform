<script setup lang="ts">
import { ref } from 'vue'
import AuthLogo from '@/components/auth/AuthLogo.vue'

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    // Имитация задержки запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Здесь будет логика восстановления пароля
    success.value = true
  } catch (e) {
    error.value = 'Ошибка при отправке письма для восстановления пароля'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
      <div>
        <AuthLogo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Восстановление пароля
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Введите email для получения инструкций
        </p>
      </div>

      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email-address" class="sr-only">Email</label>
          <input
            id="email-address"
            v-model="email"
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

      <div 
        v-else
        class="mt-8 text-center"
      >
        <div class="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
          <svg 
            class="w-8 h-8 text-green-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Проверьте почту</h3>
        <p class="mt-2 text-sm text-gray-600">
          Мы отправили инструкции по восстановлению пароля на ваш email
        </p>
      </div>

      <div class="text-center mt-4">
        <router-link 
          to="/auth/login" 
          class="font-medium text-primary hover:text-primary-dark"
        >
          Вернуться к входу
        </router-link>
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