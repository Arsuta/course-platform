<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import LoadingIndicator from '@/components/ui/LoadingIndicator.vue'

const props = defineProps<{
  email: string
  isLoading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', code: string): void
  (e: 'cancel'): void
}>()

const code = ref('')
const inputs = ref<HTMLInputElement[]>([])
const codeLength = 6
const isSubmitting = ref(false)

// Сброс состояния при изменении email
watch(() => props.email, () => {
  code.value = ''
  inputs.value.forEach(input => {
    if (input) input.value = ''
  })
  inputs.value[0]?.focus()
})

const focusNext = (index: number) => {
  if (index < codeLength - 1) {
    inputs.value[index + 1]?.focus()
  }
}

const focusPrev = (index: number) => {
  if (index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

const handleInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Обновляем значение в текущем инпуте
  if (value.length > 1) {
    input.value = value[value.length - 1]
  }

  // Обновляем общий код
  const newCode = code.value.split('')
  newCode[index] = input.value
  code.value = newCode.join('')

  // Если введен символ, переходим к следующему полю
  if (value && index < codeLength - 1) {
    focusNext(index)
  }

  // Если код полностью введен, отправляем его
  if (code.value.length === codeLength && !isSubmitting.value) {
    handleSubmit()
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const input = event.target as HTMLInputElement

  if (event.key === 'Backspace') {
    if (!input.value) {
      focusPrev(index)
    }
    const newCode = code.value.split('')
    newCode[index] = ''
    code.value = newCode.join('')
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData) return

  const numbers = pastedData.replace(/\D/g, '').slice(0, codeLength)
  numbers.split('').forEach((num, index) => {
    if (inputs.value[index]) {
      inputs.value[index].value = num
      const newCode = code.value.split('')
      newCode[index] = num
      code.value = newCode.join('')
    }
  })

  if (code.value.length === codeLength && !isSubmitting.value) {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value || props.isLoading) return
  
  isSubmitting.value = true
  try {
    emit('submit', code.value)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  inputs.value[0]?.focus()
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full relative">
      <LoadingIndicator 
        v-if="isLoading"
        size="lg"
        overlay
      />
      
      <h2 class="text-2xl font-bold text-center mb-4">
        Подтверждение
      </h2>
      
      <p class="text-gray-600 text-center mb-6">
        Мы отправили код подтверждения на {{ email }}
      </p>
      
      <div class="flex justify-center gap-2 mb-6">
        <template v-for="i in codeLength" :key="i">
          <input
            :ref="el => { if (el) inputs[i - 1] = el as HTMLInputElement }"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            class="w-12 h-12 border-2 rounded-lg text-center text-2xl focus:border-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || isSubmitting"
            @input="handleInput($event, i - 1)"
            @keydown="handleKeydown($event, i - 1)"
            @paste="handlePaste"
          >
        </template>
      </div>
      
      <div 
        v-if="error"
        class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>
      
      <div class="flex justify-between gap-4">
        <button
          type="button"
          class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || isSubmitting"
          @click="emit('cancel')"
        >
          Отмена
        </button>
        
        <button
          type="button"
          class="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="code.length !== codeLength || isLoading || isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Подтверждение...' : 'Подтвердить' }}
        </button>
      </div>
    </div>
  </div>
</template> 