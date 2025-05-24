<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Test, Question } from '@/types/test'

const props = defineProps<{
  test: Test
  onComplete?: (score: number) => void
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref<Record<number, number>>({})
const isSubmitted = ref(false)
const score = ref(0)

const currentQuestion = computed(() => props.test.questions[currentQuestionIndex.value])

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === props.test.questions.length - 1
})

const isAnswerSelected = computed(() => {
  return selectedAnswers.value[currentQuestionIndex.value] !== undefined
})

const isPassed = computed(() => {
  return score.value >= (props.test.passingScore || 70)
})

const handleAnswerSelect = (answerIndex: number) => {
  if (!isSubmitted.value) {
    selectedAnswers.value[currentQuestionIndex.value] = answerIndex
  }
}

const handleNext = () => {
  if (currentQuestionIndex.value < props.test.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const handleSubmit = () => {
  isSubmitted.value = true
  let correctAnswers = 0

  props.test.questions.forEach((question: Question, index: number) => {
    if (selectedAnswers.value[index] === question.correctAnswer) {
      correctAnswers++
    }
  })

  score.value = Math.round((correctAnswers / props.test.questions.length) * 100)

  if (props.onComplete) {
    props.onComplete(score.value)
  }
}

const loadTest = async () => {
  try {
    loading.value = true
    error.value = null
    // Здесь должна быть логика загрузки теста
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке теста'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <template v-else-if="test">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div v-if="currentQuestion" class="space-y-6">
          <!-- Заголовок теста -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">{{ test.title }}</h2>
            <p class="text-gray-600 mt-2">{{ test.description }}</p>
          </div>

          <!-- Текущий вопрос -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Вопрос {{ currentQuestionIndex + 1 }} из {{ test.questions.length }}
            </h3>
            <p class="text-gray-700">{{ currentQuestion.text }}</p>

            <!-- Варианты ответов -->
            <div class="space-y-2">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="w-full text-left px-4 py-3 rounded-lg border transition-colors"
                :class="[
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-primary-light border-primary text-primary'
                    : 'border-gray-200 hover:border-primary'
                ]"
                :disabled="isSubmitted"
                @click="handleAnswerSelect(index)"
              >
                {{ option }}
              </button>
            </div>
          </div>

          <!-- Результаты -->
          <div v-if="isSubmitted" class="mt-8 p-4 rounded-lg" :class="isPassed ? 'bg-green-50' : 'bg-red-50'">
            <h3 class="text-lg font-semibold" :class="isPassed ? 'text-green-700' : 'text-red-700'">
              {{ isPassed ? 'Тест пройден!' : 'Тест не пройден' }}
            </h3>
            <p class="mt-2" :class="isPassed ? 'text-green-600' : 'text-red-600'">
              Ваш результат: {{ score }}%. Проходной балл: {{ props.test.passingScore || 70 }}%
            </p>
          </div>

          <!-- Кнопки навигации -->
          <div class="flex justify-between mt-8">
            <button
              v-if="!isLastQuestion"
              class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              :disabled="!isAnswerSelected || isSubmitted"
              @click="handleNext"
            >
              Следующий вопрос
            </button>
            <button
              v-if="isLastQuestion && !isSubmitted"
              class="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isAnswerSelected"
              @click="handleSubmit"
            >
              Завершить тест
            </button>
          </div>
        </div>
      </div>
    </template>

    <button
      v-else
      class="w-full py-3 bg-primary text-white rounded-lg"
      @click="loadTest"
    >
      Начать тест
    </button>
  </div>
</template> 