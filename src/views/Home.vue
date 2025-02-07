<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CourseSlider from '@/components/course/CourseSlider.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import CourseCategories from '@/components/course/CourseCategories.vue'
import { CourseModel } from '@/models/course'
import type { Course } from '@/types/course'

const courses = ref<Course[]>([])

onMounted(async () => {
  courses.value = await CourseModel.getPopularCourses()
})
</script>

<template>
  <div class="space-y-16">
    <HomeHeader />
    
    <div class="container mx-auto px-4 space-y-16">
      <!-- Описание платформы -->
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <h2 class="text-3xl font-bold text-gray-900">Образовательная платформа нового поколения</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Мы создаем доступную и эффективную среду для обучения, где каждый может найти свой путь к профессиональному росту.
          Наша миссия - сделать качественное образование доступным для всех, кто стремится к развитию.
        </p>
      </div>

      <!-- Популярные курсы -->
      <div>
        <h2 class="text-3xl font-bold mb-8">Популярные курсы</h2>
        <CourseSlider :courses="courses" />
      </div>

      <!-- Категории -->
      <CourseCategories />
    </div>
  </div>
</template>
