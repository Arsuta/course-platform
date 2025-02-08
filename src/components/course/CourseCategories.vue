<script setup lang="ts">
import { defineProps } from 'vue'

const categories = [
  { 
    id: 1, 
    title: 'Дизайн', 
    description: 'UI/UX, графический дизайн, веб-дизайн',
    gradient: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30',
    icon: '🎨'
  },
  { 
    id: 2, 
    title: 'Программирование', 
    description: 'Frontend, Backend, Mobile разработка',
    gradient: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30',
    icon: '💻'
  },
  { 
    id: 3, 
    title: 'Маркетинг', 
    description: 'SMM, контекстная реклама, SEO',
    gradient: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30',
    icon: '📈'
  },
  { 
    id: 4, 
    title: 'Аналитика', 
    description: 'Data Science, BI, Data Engineering',
    gradient: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30',
    icon: '📊'
  },
  { 
    id: 5, 
    title: 'PR', 
    description: 'Связи с общественностью, медиа',
    gradient: 'from-purple-400/20 to-indigo-400/20 hover:from-purple-400/30 hover:to-indigo-400/30',
    icon: '🎯'
  },
  { 
    id: 6, 
    title: 'Full-stack', 
    description: 'Комплексная веб-разработка',
    gradient: 'from-red-400/20 to-orange-400/20 hover:from-red-400/30 hover:to-orange-400/30',
    icon: '⚡'
  }
]

const props = defineProps<{
  selectedCategory: string
}>()
</script>

<template>
  <div class="space-y-6 md:space-y-8">
    <h2 class="text-xl md:text-2xl font-bold text-gray-900 text-center">Популярные категории</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="bg-gradient-to-br rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 md:p-6 cursor-pointer transform hover:scale-[1.02]"
        :class="category.gradient"
      >
        <div class="flex items-start space-x-3 md:space-x-4">
          <div 
            class="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl bg-white/50 backdrop-blur-sm"
          >
            {{ category.icon }}
          </div>
          <div class="flex-1">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-1">{{ category.title }}</h3>
            <p class="text-xs md:text-sm text-gray-600">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 md:mt-12 bg-gray-100 rounded-xl p-4 md:p-8">
      <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">О нашей платформе</h3>
      <p class="text-sm md:text-base text-gray-600 leading-relaxed">
        Мы тут такое мутим, странное, но мы это делаем.
      </p>
    </div>
  </div>
</template> 