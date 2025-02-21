<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '@/types/course'
import { COURSE_CONSTANTS } from '@/constants/course'
import CourseCard from './CourseCard.vue'

const props = defineProps<{
  courses?: Course[]
}>()

const searchQuery = ref('')
const selectedCategory = ref<string>(COURSE_CONSTANTS.CATEGORIES.ALL)
const selectedLevel = ref<string>(COURSE_CONSTANTS.LEVELS.ALL)

const filteredCourses = computed(() => {
  return (props.courses || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === COURSE_CONSTANTS.CATEGORIES.ALL || 
                          course.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === COURSE_CONSTANTS.LEVELS.ALL || 
                        course.level === selectedLevel.value
    return matchesSearch && matchesCategory && matchesLevel
  })
})

const handleEnroll = (courseId: number) => {
  console.log('Enrolling in course:', courseId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Фильтры -->
    <div class="flex flex-wrap gap-4 p-4 bg-white rounded-xl shadow-sm">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск курсов..."
        class="flex-1 min-w-[100px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
    <ul class="space-y-4">
      <li
        v-for="course in filteredCourses"
        :key="course.id"
        class="bg-white rounded-lg shadow-md p-4 flex flex-col"
      >
        <CourseCard
          :course="course"
          @enroll="handleEnroll"
        />
      </li>
    </ul>

    <!-- Сообщение, если курсы не найдены -->
    <div
      v-if="filteredCourses.length === 0"
      class="text-center py-12 text-gray-500"
    >
      Курсы не найдены
    </div>
  </div>
</template> 