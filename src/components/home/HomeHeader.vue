<script setup lang="ts">
const arseniyImage = '/images/Arseniy.jpg'
const ivanImage = '/images/Ivan.jpg'
const mathImage = '/images/Math.jpg'
</script>

<template>
  <div class="space-y-8">
    <!-- Приветствие -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Добро пожаловать в 
        <span class="text-primary">AIMProduction</span>
      </h1>
      <p class="text-xl text-gray-600">
        Начните свой путь к 
        <span class="text-primary font-medium">новым возможностям</span>
      </p>
    </div>

    <!-- Команда -->
    <div class="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-primary hover:border-primary/40 border-opacity-50 hover:border-opacity-100">
          <img 
            :src="arseniyImage" 
            alt="Арсений Канеп" 
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Арсений Канеп</h3>
        <h4 class="text-primary font-medium">Frontend разработчик</h4>
        <p class="text-gray-500">Отвечает за пользовательский интерфейс и клиентскую часть приложения</p>
      </div>

      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-primary hover:border-primary/40 border-opacity-50 hover:border-opacity-100">
          <img 
            :src="ivanImage" 
            alt="Иван Закомалдин" 
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Иван Закомалдин</h3>
        <h4 class="text-primary font-medium">Full-stack разработчик</h4>
        <p class="text-gray-500">Отвечает за архитектуру и техническую реализацию проекта</p>
      </div>

      <div class="text-center space-y-3">
        <div class="aspect-square overflow-hidden rounded-full mx-auto w-48 shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-primary hover:border-primary/40 border-opacity-50 hover:border-opacity-100">
          <img 
            :src="mathImage" 
            alt="Матвей Ручин" 
            class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          >
        </div>
        <h3 class="font-semibold text-lg text-gray-900">Матвей Ручин</h3>
        <h4 class="text-primary font-medium">Backend разработчик</h4>
        <p class="text-gray-500">Отвечает за серверную часть и безопасность приложения</p>
      </div>
    </div>
  </div>
</template> 