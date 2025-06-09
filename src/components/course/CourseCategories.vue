<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useCoursesStore } from '@/stores/courses'
import { useRouter } from 'vue-router'
import type { Course } from '@/api/types'

// Определяем тип для CategoryId
type CategoryId = string;

// Определяем пропсы
const props = defineProps<{
  selectedCategory?: CategoryId | 'all'
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: CategoryId | 'all'): void;
}>()

const router = useRouter()
const categoryStore = useCategoriesStore()
const courseStore = useCoursesStore()
const activeCategory = ref<CategoryId | 'all'>(props.selectedCategory || 'all')
const showAllCourses = ref(false)

// Расширенный тип для курса с дополнительными полями
interface ExtendedCourse extends Course {
  cover_image?: string;
  lessons_count?: number;
}

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleCategoryClick = async (categoryId: CategoryId | 'all') => {
  activeCategory.value = categoryId
  emit('update:selectedCategory', categoryId)
  if (categoryId !== 'all') {
    await courseStore.fetchCourses()
  }
}

const filteredCourses = computed(() => {
  if (activeCategory.value === 'all') {
    return courseStore.courses.slice(0, 3)
  } else {
    return courseStore.getCoursesByCategory(activeCategory.value).slice(0, 3)
  }
})

const viewAllCourses = () => {
  showAllCourses.value = true
}

const navigateToCourse = (courseId: string) => {
  router.push(`/courses/${courseId}`)
}

const navigateToCategoryPage = (categoryId: CategoryId) => {
  router.push({
    name: 'courses',
    query: { category: categoryId }
  })
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

// Категории с иконками, цветами и описанием
const categories = [
  { 
    id: 'programming', 
    name: 'Программирование', 
    icon: 'code',
    color: 'bg-blue-500',
    iconBg: 'bg-blue-100',
    description: 'Изучите современные языки программирования и технологии разработки'
  },
  { 
    id: 'design', 
    name: 'Дизайн', 
    icon: 'palette',
    color: 'bg-purple-500',
    iconBg: 'bg-purple-100',
    description: 'Освойте принципы UX/UI дизайна и графические редакторы'
  },
  { 
    id: 'marketing', 
    name: 'Маркетинг', 
    icon: 'trending_up',
    color: 'bg-green-500',
    iconBg: 'bg-green-100',
    description: 'Стратегии продвижения и аналитика в цифровом маркетинге'
  },
  { 
    id: 'business', 
    name: 'Бизнес', 
    icon: 'work',
    color: 'bg-amber-500',
    iconBg: 'bg-amber-100',
    description: 'Основы предпринимательства и управления проектами'
  },
  { 
    id: 'data_science', 
    name: 'Наука о данных', 
    icon: 'insights',
    color: 'bg-teal-500',
    iconBg: 'bg-teal-100',
    description: 'Анализ данных, машинное обучение и искусственный интеллект'
  },
  { 
    id: 'languages', 
    name: 'Иностранные языки', 
    icon: 'translate',
    color: 'bg-indigo-500',
    iconBg: 'bg-indigo-100',
    description: 'Изучение популярных иностранных языков с нуля'
  }
]
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Исследуйте категории курсов</h2>
        <p class="text-gray-600 max-w-3xl mx-auto">Выберите интересующую вас категорию и начните обучение уже сегодня. Мы предлагаем широкий выбор курсов различной сложности для всех уровней подготовки.</p>
      </div>

      <!-- Загрузка -->
      <div v-if="categoryStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="categoryStore.error" class="bg-red-50 text-center py-8 rounded-xl border border-red-100">
        <div class="text-red-600">
          <i class="material-icons text-3xl mb-2">error</i>
          <p>{{ categoryStore.error }}</p>
        </div>
      </div>

      <!-- Список категорий -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in categories"
          :key="category.id"
          class="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
          :class="activeCategory === category.id ? 'ring-2 ring-primary' : ''"
          @click="handleCategoryClick(category.id)"
        >
          <!-- Градиентный фон -->
          <div class="absolute inset-0 opacity-80" :class="category.color"></div>
          
          <!-- Контент -->
          <div class="relative p-6 flex flex-col h-full min-h-[200px] justify-between z-10 text-white">
            <div>
              <div class="flex items-center mb-4">
                <div :class="`rounded-full ${category.iconBg} p-3 text-${category.color.split('-')[1]}-600`">
                  <i class="material-icons text-2xl">{{ category.icon }}</i>
                </div>
                <h3 class="text-xl md:text-2xl font-bold ml-3">{{ category.name }}</h3>
              </div>
              <p class="text-white/80">{{ category.description }}</p>
            </div>
            
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm font-medium bg-white/30 py-1 px-3 rounded-full">
                {{ courseStore.getCoursesByCategory(category.id).length }} курсов
              </span>
              <button 
                class="flex items-center text-white group-hover:underline"
                @click.stop="navigateToCategoryPage(category.id)"
              >
                Подробнее
                <i class="material-icons text-sm ml-1">arrow_forward</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Курсы выбранной категории -->
      <div v-if="activeCategory && !courseStore.loading" class="mt-16">
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ activeCategory === 'all' ? 'Рекомендуемые курсы' : `Курсы в категории "${categories.find(c => c.id === activeCategory)?.name}"` }}
          </h3>
          <router-link 
            :to="activeCategory === 'all' ? '/courses' : `/courses?category=${activeCategory}`"
            class="text-primary hover:text-primary-dark transition-colors flex items-center"
          >
            Все курсы
            <i class="material-icons text-sm ml-1">arrow_forward</i>
          </router-link>
        </div>
        
        <div v-if="courseStore.error" class="bg-red-50 text-center py-8 rounded-xl border border-red-100">
          <p class="text-red-600">{{ courseStore.error }}</p>
        </div>
        
        <div v-else-if="filteredCourses.length === 0" class="text-center py-16 bg-gray-50 rounded-xl">
          <i class="material-icons text-5xl text-gray-400 mb-4">school</i>
          <p class="text-gray-600 text-lg">В этой категории пока нет курсов</p>
          <button 
            @click="handleCategoryClick('all')" 
            class="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Смотреть все курсы
          </button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            @click="navigateToCourse(course.id)"
          >
            <!-- Обложка курса -->
            <div class="relative overflow-hidden h-48">
              <img
                :src="course.thumbnail || '/images/default-course.jpg'"
                :alt="course.title"
                class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              />
              
              <!-- Уровень курса -->
              <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-semibold py-1 px-2 rounded-full">
                {{ course.level === 'beginner' ? 'Начальный' : 
                   course.level === 'intermediate' ? 'Средний' : 
                   course.level === 'advanced' ? 'Продвинутый' : 'Все уровни' }}
              </div>
            </div>
            
            <!-- Информация о курсе -->
            <div class="p-6">
              <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ course.title }}</h4>
              <p class="text-gray-600 mb-4 line-clamp-2 text-sm">{{ course.description }}</p>
              
              <div class="flex items-center justify-between mt-4">
                <span class="font-semibold" :class="course.price === 0 ? 'text-green-600' : 'text-primary'">
                  {{ formatPrice(course.price) }}
                </span>
                
                <div class="flex items-center text-gray-500 text-sm">
                  <i class="material-icons text-sm mr-1">people</i>
                  {{ course.students_count || 0 }} студентов
                </div>
              </div>
              
              <!-- Рейтинг -->
              <div v-if="course.rating" class="flex items-center mt-2">
                <div class="flex items-center text-amber-500">
                  <i class="material-icons text-sm">star</i>
                  <span class="ml-1 text-sm font-medium">{{ course.rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Кнопка "Показать больше" если количество курсов больше 3 -->
        <div 
          v-if="filteredCourses.length === 3 && !showAllCourses" 
          class="text-center mt-8"
        >
          <button 
            @click="navigateToCategoryPage(activeCategory)"
            class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Показать больше курсов
            <i class="material-icons ml-2">expand_more</i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template> 