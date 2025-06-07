<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <h1 class="text-9xl font-bold text-primary">404</h1>
    <h2 class="text-2xl font-bold text-gray-900 mt-6 mb-8">Страница не найдена</h2>
    <p class="text-gray-600 max-w-md mb-8">
      Страница, которую вы ищете, не существует или была перемещена.
    </p>
    <button 
      @click="goToHome"
      class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
    >
      Вернуться на главную
    </button>
  </div>
</template> 