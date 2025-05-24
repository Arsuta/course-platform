<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import { useCourseStore } from '@/stores/courses'

const props = defineProps<{
  selectedCategory: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void
}>()

const categoryStore = useCategoryStore()
const courseStore = useCourseStore()

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleCategorySelect = async (categoryId: string) => {
  emit('update:selectedCategory', categoryId)
  await courseStore.getCoursesByCategory(categoryId)
}
</script>

<template>
  <section>
    <h2 class="text-3xl font-bold text-gray-900 mb-8">Категории курсов</h2>
    
    <div v-if="categoryStore.loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    </div>
    
    <div v-else-if="categoryStore.error" class="text-center py-8 text-red-600">
      {{ categoryStore.error }}
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        v-for="category in categoryStore.categories"
        :key="category.id"
        class="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
        :class="{ 'border-2 border-primary': selectedCategory === category.id }"
        @click="handleCategorySelect(category.id)"
      >
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
        <p class="text-gray-600">{{ category.description }}</p>
      </button>
    </div>

    <!-- Список курсов выбранной категории -->
    <div v-if="selectedCategory" class="mt-12">
      <div v-if="courseStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
      
      <div v-else-if="courseStore.error" class="text-center py-8 text-red-600">
        {{ courseStore.error }}
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
                {{ course.isFree ? 'Бесплатно' : course.price.toLocaleString('ru-RU') + ' ₽' }}
              </span>
              <span class="text-gray-500 text-sm">
                {{ course.duration }} часов
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template> 