<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  {
    title: 'Современные технологии',
    description: 'Мы используем передовые технологии и фреймворки для создания качественных продуктов',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    title: 'Качественное обучение',
    description: 'Наши курсы разработаны профессионалами с реальным опытом в индустрии',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
  },
  {
    title: 'Поддержка 24/7',
    description: 'Наша команда всегда готова помочь вам в решении любых вопросов',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
  }
])

const stats = ref([
  { number: '500+', label: 'Студентов' },
  { number: '50+', label: 'Курсов' },
  { number: '95%', label: 'Успешных выпускников' }
])
</script>

<template>
  <div class="space-y-16">
    <!-- Заголовок -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-gray-900">
        О компании 
        <span class="text-primary">AIMProduction</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Мы создаем инновационные решения для 
        <span class="text-primary font-medium">онлайн-образования</span>, 
        делая обучение доступным и эффективным для каждого
      </p>
    </div>

    <!-- Статистика -->
    <div class="bg-primary/5 py-12 px-6 rounded-3xl">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-3 gap-8">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="text-center"
          >
            <div class="text-4xl font-bold text-primary mb-2">{{ stat.number }}</div>
            <div class="text-gray-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Особенности -->
    <div class="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div 
        v-for="feature in features" 
        :key="feature.title"
        class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <svg 
            class="w-6 h-6 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="feature.icon"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
        <p class="text-gray-600">{{ feature.description }}</p>
      </div>
    </div>

    <!-- Миссия -->
    <div class="bg-gray-50 rounded-3xl p-12">
      <div class="max-w-4xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold text-gray-900">Наша миссия</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Мы стремимся создать 
          <span class="text-primary font-medium">инновационную платформу</span> 
          для онлайн-обучения, которая объединит лучших преподавателей и мотивированных студентов. 
          Наша цель - сделать качественное образование 
          <span class="text-primary font-medium">доступным для каждого</span>, 
          независимо от местоположения и времени.
        </p>
        <div class="pt-6">
          <button class="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl">
            Присоединиться к нам
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 