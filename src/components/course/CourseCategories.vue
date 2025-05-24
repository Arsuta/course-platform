<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import { useCourseStore } from '@/stores/courses'
import type { Course } from '@/types/course'

const props = defineProps<{
  selectedCategory?: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void;
}>()

const categoryStore = useCategoryStore()
const courseStore = useCourseStore()

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleCategoryClick = async (categoryId: string) => {
  emit('update:selectedCategory', categoryId)
  await courseStore.fetchCoursesByCategory(categoryId)
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const fetchCoursesByCategory = async (categoryId: string) => {
  await courseStore.fetchCoursesByCategory(categoryId)
}

const categories = [
  { id: 'programming', name: 'Программирование', icon: 'code' },
  { id: 'design', name: 'Дизайн', icon: 'palette' },
  { id: 'marketing', name: 'Маркетинг', icon: 'trending-up' },
  { id: 'business', name: 'Бизнес', icon: 'briefcase' }
]
</script>

<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Категории курсов</h2>

      <!-- Загрузка -->
      <div v-if="categoryStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="categoryStore.error" class="text-center py-8 text-red-600">
        {{ categoryStore.error }}
      </div>

      <!-- Список категорий -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
          v-for="category in categoryStore.categories"
        :key="category.id"
          class="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
          :class="{ 'border-2 border-primary': selectedCategory === category.id }"
          @click="handleCategoryClick(category.id)"
        >
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
          <p class="text-gray-600">{{ category.description }}</p>
        </div>
      </div>

      <!-- Курсы выбранной категории -->
      <div v-if="selectedCategory && !courseStore.loading" class="mt-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Курсы в этой категории</h3>
        
        <div v-if="courseStore.error" class="text-center py-8 text-red-600">
          {{ courseStore.error }}
        </div>
        
        <div v-else-if="courseStore.courses.length === 0" class="text-center py-8 text-gray-600">
          В этой категории пока нет курсов
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="course in courseStore.courses"
            :key="course.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img
              :src="course.thumbnail"
              :alt="course.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ course.title }}</h4>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ course.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary font-semibold">
                  {{ formatPrice(course.price) }}
                </span>
                <span class="text-gray-500 text-sm">
                  {{ course.students_count }} студентов
                </span>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 