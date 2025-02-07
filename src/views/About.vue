<script setup lang="ts">
import { 
  AcademicCapIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'

const features = [
  {
    title: 'Инновационный подход',
    description: 'Мы используем передовые технологии и методики обучения, чтобы сделать образование более эффективным и увлекательным.',
    icon: LightBulbIcon,
    gradient: 'from-blue-100 to-purple-100'
  },
  {
    title: 'Опытные преподаватели',
    description: 'Наши эксперты - практикующие специалисты с богатым опытом в своих областях.',
    icon: AcademicCapIcon,
    gradient: 'from-green-100 to-emerald-100'
  },
  {
    title: 'Сообщество',
    description: 'Присоединяйтесь к сообществу единомышленников, обменивайтесь опытом и растите вместе.',
    icon: UserGroupIcon,
    gradient: 'from-pink-100 to-rose-100'
  },
  {
    title: 'Карьерный рост',
    description: 'Мы помогаем нашим студентам построить успешную карьеру в выбранной области.',
    icon: RocketLaunchIcon,
    gradient: 'from-yellow-100 to-amber-100'
  }
]
</script>

<template>
  <div class="space-y-24">
    <!-- Заголовок -->
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">платформе</h1>
      <p class="text-lg text-gray-600">
        Мы создаем будущее образования, делая его доступным, эффективным и увлекательным для каждого.
      </p>
    </div>

    <!-- Зигзагообразные блоки -->
    <div class="space-y-32">
      <div 
        v-for="(feature, index) in features" 
        :key="feature.title"
        class="flex items-center gap-12"
        :class="{ 'flex-row-reverse': index % 2 !== 0 }"
      >
        <!-- Иконка с градиентом -->
        <div 
          class="w-1/3 aspect-square rounded-2xl flex items-center justify-center transform transition-transform hover:scale-105"
          :class="`bg-gradient-to-br ${feature.gradient}`"
        >
          <component 
            :is="feature.icon" 
            class="w-24 h-24 text-gray-800"
          />
        </div>

        <!-- Текстовый контент -->
        <div class="w-2/3 space-y-4">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ feature.title }}
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-8 bg-white rounded-xl shadow-lg p-8">
      <div class="text-center">
        <div class="text-4xl font-bold text-primary-light mb-2">1000+</div>
        <div class="text-gray-600">Студентов</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-primary-light mb-2">50+</div>
        <div class="text-gray-600">Курсов</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-primary-light mb-2">95%</div>
        <div class="text-gray-600">Довольных учеников</div>
      </div>
    </div>
  </div>
</template> 