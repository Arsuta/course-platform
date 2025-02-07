<script setup lang="ts">
const arseniyImage = '/images/Arseniy.jpg'
const ivanImage = '/images/Ivan.jpg'
const mathImage = '/images/Math.jpg'
</script>

<template>
  <div class="space-y-8">
    <!-- Приветствие -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Добро пожаловать в AIMProduction</h1>
      <p class="text-xl text-gray-600">Начните свой путь к новым попкам</p>
    </div>

    <!-- Команда -->
    <div class="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300">
          <img 
            :src="arseniyImage" 
            alt="Арсений Канеп" 
            class="w-full h-full object-cover"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Арсений Канеп</h3>
        <h4 class="text-gray-600">Фронтик чисто</h4>
        <p class="text-gray-400">Планирует быть репером</p>
      </div>

      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300">
          <img 
            :src="ivanImage" 
            alt="Иван Закомалдин" 
            class="w-full h-full object-cover"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Иван Закомалдин</h3>
        <h4 class="text-gray-600">Золотые ручки</h4>
        <p class="text-gray-400">По плану будет решать все, что мы не так сделаем</p>
      </div>

      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300">
          <img 
            :src="mathImage" 
            alt="Матвей Ручин" 
            class="w-full h-full object-cover"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Матвей Ручин</h3>
        <h4 class="text-gray-600">Бэкендик чисто</h4>
        <p class="text-gray-400">Делает свое дело</p>
      </div>
    </div>
  </div>
</template> 