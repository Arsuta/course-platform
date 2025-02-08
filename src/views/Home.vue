<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CourseSlider from '@/components/course/CourseSlider.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import CourseCategories from '@/components/course/CourseCategories.vue'
import { CourseModel } from '@/models/course'
import type { Course } from '@/types/course'

const popularCourses = ref<Course[]>([])
const selectedCategory = ref('')

onMounted(async () => {
  popularCourses.value = await CourseModel.getPopularCourses()
})

const handleEnroll = async (courseId: number) => {
  try {
    await CourseModel.enrollCourse(courseId)
    // TODO: Показать уведомление об успешной записи
  } catch (error) {
    console.error('Failed to enroll:', error)
    // TODO: Показать уведомление об ошибке
  }
}
</script>

<template>
  <div class="space-y-16">
    <HomeHeader />
    
    <!-- Популярные курсы (слайдер) -->
    <section class="bg-gray-50">
      <div class="container mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Популярные курсы</h2>
        <CourseSlider 
          :courses="popularCourses" 
          @enroll="handleEnroll"
        />
      </div>
    </section>

    <div class="container mx-auto px-4 space-y-16">
      <!-- Описание платформы -->
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold text-gray-900">Образовательная платформа нового поколения</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Изучайте актуальные навыки у лучших преподавателей
        </p>
      </div>

      <!-- Категории -->
      <CourseCategories :selectedCategory="selectedCategory" />
    </div>
  </div>
</template>
