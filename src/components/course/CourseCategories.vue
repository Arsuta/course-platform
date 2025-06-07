<script setup lang="ts">
import { onMounted, defineProps } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useCourseStore } from '@/stores/courses'
import type { CategoryId } from '@/types/course'

const props = defineProps<{
  selectedCategory?: CategoryId | 'all'
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: CategoryId | 'all'): void;
}>()

const categoryStore = useCategoriesStore()
const courseStore = useCourseStore()

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleCategoryClick = async (categoryId: CategoryId | 'all') => {
  emit('update:selectedCategory', categoryId)
  if (categoryId !== 'all') {
    await courseStore.fetchCourses({ category_id: categoryId })
  }
}

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}

const categories: Array<{ id: CategoryId; name: string; icon: string }> = [
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
      <div v-if="categoryStore.isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="categoryStore.error" class="text-center py-8 text-red-600">
        {{ categoryStore.error }}
      </div>

      <!-- Список категорий -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in categories"
          :key="category.id"
          class="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left cursor-pointer"
          :class="{ 'border-2 border-primary': selectedCategory === category.id }"
          @click="handleCategoryClick(category.id)"
        >
          <div class="flex items-center">
            <i class="material-icons text-2xl mr-3">{{ category.icon }}</i>
            <h3 class="text-xl font-semibold text-gray-900">{{ category.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Курсы выбранной категории -->
      <div v-if="selectedCategory && selectedCategory !== 'all' && !courseStore.isLoading" class="mt-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Курсы в категории</h3>
        
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
              :src="course.cover_image || '/images/default-course.jpg'"
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
                  {{ course.lessons_count }} уроков
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 