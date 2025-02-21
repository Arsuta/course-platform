<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '@/types/course'

const props = defineProps<{
  courses?: Course[]
}>()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedLevel = ref<string>('all')

const filteredCourses = computed(() => {
  return (props.courses || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || course.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'all' || course.level === selectedLevel.value
    return matchesSearch && matchesCategory && matchesLevel
  })
})



const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ч ${minutes % 60} мин`
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Фильтры -->
    <div class="flex flex-wrap gap-4 p-4 bg-white rounded-xl shadow-sm">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск курсов..."
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      
      <select
        v-model="selectedCategory"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">Все категории</option>
        <option value="programming">Программирование</option>
        <option value="design">Дизайн</option>
        <option value="marketing">Маркетинг</option>
        <option value="business">Бизнес</option>
      </select>

      <select
        v-model="selectedLevel"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="all">Все уровни</option>
        <option value="beginner">Начинающий</option>
        <option value="intermediate">Средний</option>
        <option value="advanced">Продвинутый</option>
      </select>
    </div>

    <!-- Список курсов -->
    <div class="space-y-4">
      <div 
        v-for="course in filteredCourses"
        :key="course.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      >
        <div class="relative flex">
          <!-- Превью курса -->
          <div class="w-full lg:w-1/2 flex-shrink-0">
            <div class="relative aspect-video">
              <img 
                :src="course.image" 
                :alt="course.title"
                class="w-full h-full object-cover"
              />
              <div 
                class="absolute inset-0 bg-gradient-to-br opacity-60"
                :class="course.gradient"
              />
            </div>
          </div>

          <!-- Информация о курсе -->
          <div class="flex-1 p-4 lg:p-6 flex flex-col">
            <div class="flex flex-wrap gap-2 mb-2">
              <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {{ course.category }}
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {{ course.level }}
              </span>
            </div>

            <h3 class="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              {{ course.title }}
            </h3>

            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ course.description }}
            </p>

            <div class="mt-auto">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ formatDuration(course.duration) }}</span>
                  <span>{{ course.modules.length }} модулей</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400">★</span>
                  <span class="text-sm text-gray-600">{{ course.rating }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900">
                  {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
                </span>
                <button 
                  class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  @click="$emit('enroll', course.id)"
                >
                  {{ course.isEnrolled ? 'Продолжить' : 'Записаться' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Сообщение, если курсы не найдены -->
    <div
      v-if="filteredCourses.length === 0"
      class="text-center py-12 text-gray-500"
    >
      Курсы не найдены
    </div>
  </div>
</template> 