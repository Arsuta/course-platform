<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import type { Course } from '@/api/types'
import type { CategoryId } from '@/types/course'
import { COURSE_CONSTANTS } from '@/constants/course'

const router = useRouter()
const courseStore = useCourseStore()
const courses = ref<Course[]>([])

onMounted(async () => {
  await courseStore.fetchPopularCourses()
  courses.value = courseStore.popularCourses
})

const handleEnrollClick = () => {
  router.push({ 
    name: 'login',
    query: { redirect: '/courses' },
    params: { message: 'Для записи на курс необходима регистрация' }
  })
}

const getCategoryLabel = (categoryId: string) => {
  return COURSE_CONSTANTS?.CATEGORY_LABELS?.[categoryId as CategoryId] || categoryId
}

const getLevelLabel = (level: string) => {
  return COURSE_CONSTANTS?.LEVEL_LABELS?.[level as keyof typeof COURSE_CONSTANTS.LEVEL_LABELS] || level
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Наши курсы
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Изучайте современные технологии с нашими экспертами.
        <span class="text-primary">Зарегистрируйтесь</span>, чтобы получить полный доступ ко всем курсам!
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="relative bg-white rounded-xl shadow-lg overflow-hidden group"
      >
        <!-- Превью изображение -->
        <div class="relative aspect-video overflow-hidden">
          <img 
            :src="course.cover_image || '/images/default-course.jpg'" 
            :alt="course.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div 
            class="absolute inset-0 bg-gradient-to-br opacity-60"
          ></div>
        </div>

        <!-- Информация о курсе -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {{ getCategoryLabel(course.category_id) }}
            </span>
            <span class="text-sm text-gray-500">
              {{ getLevelLabel(course.status) }}
            </span>
          </div>

          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ course.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>

          <div class="flex items-center justify-between mt-4">
            <div v-if="course.author" class="flex items-center space-x-2">
              <img 
                :src="course.author.avatar" 
                :alt="`${course.author.first_name} ${course.author.last_name}`"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-sm text-gray-600">{{ course.author.first_name }} {{ course.author.last_name }}</span>
            </div>
            <div class="flex items-center space-x-1 text-yellow-400">
              <span>★</span>
              <span class="text-gray-700">{{ course.rating }}</span>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">
              {{ formatPrice(course.price) }}
            </span>
            <button
              @click="handleEnrollClick"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Записаться
            </button>
          </div>
        </div>

        <!-- Оверлей для неавторизованных пользователей -->
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="text-center text-white p-4">
            <p class="text-lg font-medium mb-4">
              Зарегистрируйтесь, чтобы получить доступ к этому курсу
            </p>
            <button
              @click="handleEnrollClick"
              class="px-6 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Призыв к действию -->
    <div class="mt-16 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        Готовы начать обучение?
      </h2>
      <p class="text-xl text-gray-600 mb-8">
        Присоединяйтесь к нашему сообществу и начните свой путь к успеху!
      </p>
      <div class="flex justify-center space-x-4">
        <button
          @click="router.push({ name: 'register' })"
          class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Зарегистрироваться
        </button>
        <button
          @click="router.push({ name: 'login' })"
          class="px-8 py-3 bg-white text-primary border border-primary rounded-lg hover:bg-gray-50 transition-colors"
        >
          Войти
        </button>
      </div>
    </div>
  </div>
</template> 