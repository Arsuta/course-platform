<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import type { CategoryId, ExtendedCourse } from '@/types/course'
import CourseSlider from '@/components/course/CourseSlider.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import CourseCategories from '@/components/course/CourseCategories.vue'
import { api } from '@/api'
import type { Course } from '@/api/types'

const router = useRouter()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()
const selectedCategory = ref<CategoryId | 'all'>('all')
const error = ref<string | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    
    // Если курсы еще не загружены, загружаем их
    if (coursesStore.courses.length === 0) {
      await coursesStore.fetchCourses()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при загрузке курсов'
    console.error('Error loading courses:', e)
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
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
    
    // Используем метод из хранилища курсов
    const result = await coursesStore.enrollCourse(courseId)
    
    if (result.success) {
      router.push(`/courses/${courseId}/learn`)
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при записи на курс'
    console.error('Error enrolling in course:', e)
  } finally {
    loading.value = false
  }
}

// Расширяем курсы для слайдера
const extendCourse = (course: Course): ExtendedCourse => {
  return {
    ...course,
    author: 'Преподаватель',
    authorAvatar: 'https://i.pravatar.cc/150?img=1'
  } as ExtendedCourse;
}

// Получаем популярные курсы
const popularCourses = computed(() => {
  // Ограничиваем количество курсов до 4
  return coursesStore.popularCourses.map(extendCourse).slice(0, 4);
})

// Получаем новые курсы
const newCourses = computed(() => {
  return coursesStore.newCourses.map(course => {
    const extended = extendCourse(course);
    extended.authorAvatar = 'https://i.pravatar.cc/150?img=2';
    return extended;
  })
})

// Получаем избранные курсы
const featuredCourses = computed(() => {
  return coursesStore.featuredCourses.map(course => {
    const extended = extendCourse(course);
    extended.authorAvatar = 'https://i.pravatar.cc/150?img=3';
    return extended;
  })
})

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
  },
  {
    title: 'Сертификаты',
    description: 'Получите сертификат по завершении обучения',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
]

const stats = [
  { number: '1000+', label: 'Студентов' },
  { number: '50+', label: 'Курсов' },
  { number: '95%', label: 'Успешных выпускников' },
  { number: '24/7', label: 'Поддержка' }
]

const testimonials = [
  {
    id: '1',
    text: 'Эта платформа полностью изменила мой подход к обучению. Интерактивные курсы и поддержка преподавателей на высшем уровне!',
    author: 'Анна С.',
    role: 'Веб-разработчик',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
  },
  {
    id: '2',
    text: 'Благодаря этой платформе я смог освоить новые навыки и найти работу своей мечты. Рекомендую всем, кто хочет развиваться!',
    author: 'Иван П.',
    role: 'Data Scientist',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  {
    id: '3',
    text: 'Качество материалов и структура курсов на высоте. Особенно понравились практические задания и обратная связь от преподавателей.',
    author: 'Елена К.',
    role: 'UX/UI Дизайнер',
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg'
  }
]
</script>

<template>
  <div class="space-y-16 pb-16">
    <!-- Главный баннер -->
    <HomeHeader />
    
    <!-- Популярные курсы (слайдер) -->
    <section class="bg-gradient-to-b from-gray-50 to-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Популярные курсы</h2>
          <router-link 
            to="/courses" 
            class="text-primary hover:text-primary-dark transition-colors flex items-center"
          >
            Все курсы
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        
        <!-- Обработка ошибок -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ error }}</p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>

        <CourseSlider 
          v-else-if="popularCourses.length"
          :courses="popularCourses" 
          :formatPrice="formatPrice"
          @enroll="handleEnroll"
        />

        <div v-else class="text-center py-8 text-gray-600">
          Курсы не найдены
        </div>
      </div>
    </section>

    <!-- Описание платформы и преимущества -->
    <section class="bg-gradient-to-r from-primary to-primary-dark text-white py-24 mt-8">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <h2 class="text-4xl font-bold">Образовательная платформа нового поколения</h2>
          <p class="text-xl text-white leading-relaxed">
            Изучайте актуальные навыки у лучших преподавателей. Присоединяйтесь к нашему сообществу!
          </p>
          <div v-if="!authStore.isAuthenticated" class="flex flex-wrap justify-center gap-4 mt-8">
            <button
              @click="router.push({ name: 'register' })"
              class="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              Начать обучение
            </button>
            <button
              @click="router.push({ name: 'login' })"
              class="px-8 py-3 border border-white text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Войти
            </button>
          </div>
        </div>

        <!-- Преимущества -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors transform hover:-translate-y-1 duration-300"
          >
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg 
                class="w-6 h-6 text-white" 
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
            <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
            <p class="text-white">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Статистика -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl py-12 px-8 shadow-lg">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div 
              v-for="stat in stats" 
              :key="stat.label"
              class="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div class="text-4xl font-bold text-primary mb-2">{{ stat.number }}</div>
              <div class="text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Отзывы наших студентов</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
          >
            <div class="flex items-center mb-4">
              <img :src="testimonial.avatar" :alt="testimonial.author" class="w-12 h-12 rounded-full mr-4" />
              <div>
                <h3 class="font-bold text-gray-900">{{ testimonial.author }}</h3>
                <p class="text-gray-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-700 italic">{{ testimonial.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Категории курсов -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <CourseCategories 
          :selectedCategory="selectedCategory" 
          @update:selectedCategory="(category) => selectedCategory = category as CategoryId | 'all'" 
        />
      </div>
    </section>

    <!-- CTA блок -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Готовы начать обучение?</h2>
          <p class="text-xl text-white mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые уже улучшили свои навыки с нашей помощью
          </p>
          <button
            @click="router.push('/courses')"
            class="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            Начать сейчас
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
