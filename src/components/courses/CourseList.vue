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

const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'programming', label: 'Программирование' },
  { value: 'design', label: 'Дизайн' },
  { value: 'marketing', label: 'Маркетинг' },
  { value: 'business', label: 'Бизнес' }
]

const levels = [
  { value: 'all', label: 'Все уровни' },
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

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
        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
        >
          {{ category.label }}
        </option>
      </select>

      <select
        v-model="selectedLevel"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option
          v-for="level in levels"
          :key="level.value"
          :value="level.value"
        >
          {{ level.label }}
        </option>
      </select>
    </div>

    <!-- Список курсов -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="course in filteredCourses"
        :key="course.id"
        class="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        :class="course.gradient"
      >
        <img
          :src="course.image"
          :alt="course.title"
          class="w-full h-48 object-cover"
        />
        
        <div class="p-6 space-y-4 bg-white/80 backdrop-blur-sm">
          <div class="flex items-center justify-between">
            <span 
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-green-100 text-green-800': course.level === 'beginner',
                'bg-yellow-100 text-yellow-800': course.level === 'intermediate',
                'bg-red-100 text-red-800': course.level === 'advanced'
              }"
            >
              {{ levels.find(l => l.value === course.level)?.label }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDuration(course.duration) }}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
            {{ course.title }}
          </h3>

          <p class="text-sm text-gray-600 line-clamp-2">
            {{ course.description }}
          </p>

          <div class="flex items-center space-x-3">
            <img
              :src="course.author.avatar"
              :alt="course.author.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <span class="text-sm text-gray-700">{{ course.author.name }}</span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-sm font-medium text-gray-900">{{ course.rating }}</span>
              <span class="text-sm text-gray-500">({{ course.studentsCount }})</span>
            </div>
            <div class="text-right">
              <span class="block text-lg font-semibold text-gray-900">
                {{ course.isFree ? 'Бесплатно' : formatPrice(course.price) }}
              </span>
              <span 
                v-if="course.progress !== undefined"
                class="text-xs text-gray-500"
              >
                Пройдено: {{ course.progress }}%
              </span>
            </div>
          </div>

          <router-link
            :to="'/courses/' + course.id"
            class="block w-full px-4 py-2 text-center text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            {{ course.isEnrolled ? 'Продолжить обучение' : 'Подробнее о курсе' }}
          </router-link>
        </div>
      </article>
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