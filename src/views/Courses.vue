<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import { COURSE_CONSTANTS } from '@/constants/course'
import type { Course } from '@/api/types'
import type { CategoryId } from '@/types/course'

const router = useRouter()
const courseStore = useCoursesStore()
const authStore = useAuthStore()

const courses = ref<Course[]>([])
const filteredCourses = ref<Course[]>([])
const selectedCategory = ref<string | null>(null)
const selectedLevel = ref<string | null>(null)
const searchQuery = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

// Загрузка курсов
onMounted(async () => {
  try {
    loading.value = true
    courses.value = await courseStore.fetchCourses()
    filteredCourses.value = [...courses.value]
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
  } finally {
    loading.value = false
  }
})

// Форматирование цены
const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

// Форматирование длительности
const formatDuration = (minutes: number = 0): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}

// Получение метки категории
const getCategoryLabel = (categoryId: string) => {
  return COURSE_CONSTANTS.CATEGORY_LABELS?.[categoryId as CategoryId] || categoryId
}

// Получение метки уровня
const getLevelLabel = (level: string) => {
  return COURSE_CONSTANTS.LEVEL_LABELS?.[level as keyof typeof COURSE_CONSTANTS.LEVEL_LABELS] || level
}

// Переход на страницу курса
const goToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

// Фильтрация курсов
const applyFilters = () => {
  filteredCourses.value = courses.value.filter(course => {
    // Фильтр по категории
    if (selectedCategory.value && course.category_id !== selectedCategory.value) {
      return false
    }
    
    // Фильтр по уровню
    if (selectedLevel.value && course.level !== selectedLevel.value) {
      return false
    }
    
    // Фильтр по поисковому запросу
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        course.title.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query))
      )
    }
    
    return true
  })
}

// Сброс фильтров
const resetFilters = () => {
  selectedCategory.value = null
  selectedLevel.value = null
  searchQuery.value = ''
  filteredCourses.value = [...courses.value]
}

// Наблюдатели за изменениями фильтров
const watchFilters = () => {
  applyFilters()
}

// Вычисляемые свойства для категорий и уровней
const categories = computed(() => {
  const uniqueCategories = new Set(courses.value.map(course => course.category_id))
  return Array.from(uniqueCategories).filter(Boolean) as string[]
})

const levels = computed(() => {
  const uniqueLevels = new Set(courses.value.map(course => course.level))
  return Array.from(uniqueLevels).filter(Boolean) as string[]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Заголовок -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Каталог курсов</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Выберите курс из нашего каталога и начните обучение прямо сейчас!
        </p>
      </div>
      
      <!-- Фильтры и поиск -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Поиск -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              @input="watchFilters"
              placeholder="Поиск по названию или описанию"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          
          <!-- Фильтр по категории -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Категория</label>
            <select
              id="category"
              v-model="selectedCategory"
              @change="watchFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option :value="null">Все категории</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ getCategoryLabel(category) }}
              </option>
            </select>
          </div>
          
          <!-- Фильтр по уровню -->
          <div>
            <label for="level" class="block text-sm font-medium text-gray-700 mb-2">Уровень</label>
            <select
              id="level"
              v-model="selectedLevel"
              @change="watchFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option :value="null">Все уровни</option>
              <option v-for="level in levels" :key="level" :value="level">
                {{ getLevelLabel(level) }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Кнопка сброса фильтров -->
        <div class="mt-4 flex justify-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-primary hover:text-primary-dark hover:underline"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
      
      <!-- Загрузка -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      
      <!-- Ошибка -->
      <div v-else-if="error" class="text-center text-red-600 py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-lg">{{ error }}</p>
        </div>
      </div>
      
      <!-- Список курсов -->
      <div v-else>
        <!-- Нет результатов -->
        <div v-if="filteredCourses.length === 0" class="text-center py-12">
          <p class="text-gray-600 text-lg">
            Курсы не найдены. Попробуйте изменить параметры поиска.
          </p>
        </div>
        
        <!-- Сетка курсов -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
            @click="goToCourse(course.id)"
          >
            <!-- Превью изображение -->
            <div class="relative aspect-video overflow-hidden">
              <img 
                :src="course.thumbnail || '/images/default-course.jpg'" 
                :alt="course.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <!-- Информация о курсе -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {{ getCategoryLabel(course.category_id || '') }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ getLevelLabel(course.level || '') }}
                </span>
              </div>

              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>

              <!-- Рейтинг и количество студентов -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-1 text-yellow-400">
                  <span>★</span>
                  <span class="text-gray-700">{{ course.rating?.toFixed(1) || "N/A" }}</span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ course.students_count || 0 }} студентов
                </div>
              </div>

              <!-- Цена и длительность -->
              <div class="mt-6 flex items-center justify-between">
                <span class="text-2xl font-bold text-gray-900">
                  {{ formatPrice(course.price) }}
                </span>
                <span class="text-sm text-gray-600">
                  {{ formatDuration(course.duration) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 