<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface Props {
  email: string
  onSubmit: (code: string) => void
  onCancel: () => void
  isLoading?: boolean
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', code: string): void
  (e: 'cancel'): void
}>()

const code = ref('')

const handleSubmit = () => {
  if (code.value.length === 6) {
    emit('submit', code.value)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Подтверждение
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Введите код, отправленный на {{ email }}
      </p>
    </div>
    
    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="code" class="sr-only">Код подтверждения</label>
        <input
          id="code"
          v-model="code"
          name="code"
          type="text"
          required
          maxlength="6"
          pattern="\d{6}"
          class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary text-center text-2xl tracking-widest"
          placeholder="000000"
        >
      </div>

      <div class="flex gap-4">
        <button
          type="button"
          @click="handleCancel"
          class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          :disabled="isLoading"
        >
          Отмена
        </button>
        
        <button
          type="submit"
          :disabled="code.length !== 6 || isLoading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">
            <svg 
              class="animate-spin h-5 w-5" 
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
              ></circle>
              <path 
                class="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span v-else>Подтвердить</span>
        </button>
      </div>
    </form>

    <div 
      v-if="error"
      class="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
    >
      {{ error }}
    </div>

    <slot></slot>
  </div>
</template> 