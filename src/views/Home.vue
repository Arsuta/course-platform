<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCourseStore } from '@/stores/courses'
import type { CategoryId } from '@/types/course'
import CourseSlider from '@/components/course/CourseSlider.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import CourseCategories from '@/components/course/CourseCategories.vue'

const router = useRouter()
const authStore = useAuthStore()
const courseStore = useCourseStore()
const selectedCategory = ref<CategoryId | 'all'>('all')
const error = ref<string | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    await courseStore.fetchPopularCourses()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
    console.error('Error loading courses:', e)
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const handleEnroll = async (courseId: string) => {
  if (!authStore.isAuthenticated) {
    router.push({ 
      name: 'login',
      query: { redirect: `/courses/${courseId}` },
      params: { message: 'Для записи на курс необходима авторизация' }
    })
    return
  }

  try {
    loading.value = true
    error.value = null
    const success = await courseStore.enrollCourse(courseId)
    if (success) {
      router.push(`/courses/${courseId}`)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при записи на курс'
    console.error('Error enrolling in course:', e)
  } finally {
    loading.value = false
  }
}

const features = [
  {
    title: 'Качественное обучение',
    description: 'Курсы от ведущих экспертов и практикующих специалистов',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
  },
  {
    title: 'Практический подход',
    description: 'Реальные проекты и задачи из индустрии',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  {
    title: 'Гибкий график',
    description: 'Учитесь в удобном для вас темпе и в любое время',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const stats = [
  { number: '1000+', label: 'Студентов' },
  { number: '50+', label: 'Курсов' },
  { number: '95%', label: 'Успешных выпускников' },
  { number: '24/7', label: 'Поддержка' }
]
</script>

<template>
  <div class="space-y-16">
    <HomeHeader />
    
    <!-- Популярные курсы (слайдер) -->
    <section class="bg-gray-50">
      <div class="container mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Популярные курсы</h2>
        
        <!-- Обработка ошибок -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ error }}</p>
          <button 
            @click="courseStore.fetchPopularCourses()"
            class="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Попробовать снова
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>

        <CourseSlider 
          v-else-if="courseStore.popularCourses.length"
          :courses="courseStore.popularCourses" 
          :formatPrice="formatPrice"
          @enroll="handleEnroll"
        />

        <div v-else class="text-center py-8 text-gray-600">
          Курсы не найдены
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 space-y-16">
      <!-- Описание платформы -->
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold text-gray-900">Образовательная платформа нового поколения</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Изучайте актуальные навыки у лучших преподавателей. Присоединяйтесь к нашему сообществу!
        </p>
        <div v-if="!authStore.isAuthenticated" class="flex justify-center space-x-4 mt-8">
          <button
            @click="router.push({ name: 'register' })"
            class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Начать обучение
          </button>
          <button
            @click="router.push({ name: 'login' })"
            class="px-8 py-3 bg-white text-primary border border-primary rounded-lg hover:bg-gray-50 transition-colors"
          >
            Войти
          </button>
        </div>
      </div>

      <!-- Преимущества -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Статистика -->
      <div class="bg-primary rounded-xl py-12 px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="text-center"
          >
            <div class="text-4xl font-bold text-white mb-2">{{ stat.number }}</div>
            <div class="text-primary-light">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Категории -->
      <CourseCategories :selectedCategory="selectedCategory" />
    </div>
  </div>
</template>
