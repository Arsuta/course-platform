<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Course } from '@/api/types'
import { COURSE_CONSTANTS } from '@/constants/course'
import CourseCard from './CourseCard.vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/api'

// Определяем тип для CategoryId
type CategoryId = string;

const props = defineProps<{
  courses?: Course[]
}>()

const searchQuery = ref('')
const selectedCategory = ref<CategoryId | 'all'>('all')
const selectedLevel = ref<string>(COURSE_CONSTANTS.LEVELS.ALL)

const courseStore = useCoursesStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  if (!props.courses || props.courses.length === 0) {
    await courseStore.fetchCourses()
  }
})

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} мин`
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`
}

const filteredCourses = computed(() => {
  const coursesToFilter = props.courses?.length ? props.courses : courseStore.courses
  
  return coursesToFilter.filter(course => {
    const matchesSearch = !searchQuery.value || 
                        (course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchQuery.value.toLowerCase())))
    
    const matchesCategory = selectedCategory.value === 'all' || 
                          course.category_id === selectedCategory.value
    
    const matchesLevel = selectedLevel.value === COURSE_CONSTANTS.LEVELS.ALL || 
                        course.level === selectedLevel.value
    
    return matchesSearch && matchesCategory && matchesLevel
  })
})

const handleEnroll = async (courseId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ 
      name: 'login',
      query: { redirect: route.fullPath },
      params: { message: 'Для записи на курс необходима авторизация' }
    })
    return
  }

  try {
    // Используем API напрямую вместо метода хранилища
    await api.courses.purchaseCourse(courseId)
    router.push(`/courses/${courseId}/learn`)
  } catch (e) {
    console.error('Ошибка при записи на курс:', e)
  }
}

const handleCourseClick = (course: Course) => {
  router.push(`/courses/${course.id}`);
};
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        :onEnroll="handleEnroll"
        @click="handleCourseClick(course)"
      />
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