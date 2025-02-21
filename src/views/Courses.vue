<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CourseList from '@/components/course/CourseList.vue'
import { CourseModel } from '@/models/course'
import type { Course } from '@/types/course'

const courses = ref<Course[]>([])

onMounted(async () => {
  courses.value = await CourseModel.getAllCourses()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Все курсы</h1>
    <CourseList :courses="courses" />
  </div>
</template> 