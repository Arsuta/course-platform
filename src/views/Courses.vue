<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Switch } from '@headlessui/vue'

import type { Course } from '@/types/course'
import { CourseModel } from '@/models/course'


const courses = ref<Course[]>([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const showFreeOnly = ref(false)


const categories = [
  { id: 'all', name: 'Все курсы' },
  { id: 'design', name: 'Дизайн' },
  { id: 'programming', name: 'Программирование' },
  { id: 'marketing', name: 'Маркетинг' }
]

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || course.category === selectedCategory.value
    const matchesFree = !showFreeOnly.value || course.isFree
    return matchesSearch && matchesCategory && matchesFree
  })
})

onMounted(async () => {
  courses.value = await CourseModel.getAllCourses()
})
</script>

<template>
  <div class="space-y-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="space-y-6">
        <!-- Заголовок и поиск -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Все курсы</h1>
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Поиск курсов..."
              class="w-64 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>
        </div>

        <!-- Категории -->
        <div class="flex gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="px-4 py-2 rounded-lg text-sm"
            :class="selectedCategory === category.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Переключатель бесплатных курсов -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Только бесплатные курсы</span>
          <Switch
            v-model="showFreeOnly"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2"
            :class="[showFreeOnly ? 'bg-primary-light' : 'bg-gray-200']"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="[showFreeOnly ? 'translate-x-6' : 'translate-x-1']"
            />
          </Switch>
        </div>
      </div>
    </div>

    <!-- Результаты в виде списка -->
    <div v-if="filteredCourses.length > 0" class="space-y-4">
      <div 
        v-for="course in filteredCourses"
        :key="course.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
      >
        <div class="flex gap-6">
          <div class="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <div 
              class="w-full h-full bg-gradient-to-br"
              :class="[
                course.id % 3 === 0 ? 'from-blue-100 to-purple-100' :
                course.id % 3 === 1 ? 'from-green-100 to-blue-100' :
                'from-pink-100 to-orange-100'
              ]"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-semibold text-gray-900">{{ course.title }}</h3>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="course.isFree ? 'bg-primary-light text-white' : 'bg-gray-100 text-gray-900'"
              >
                {{ course.isFree ? 'Бесплатно' : `${course.price} ₽` }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ course.description }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                    :style="{
                      backgroundColor: `hsl(${(course.author.id * 40) % 360}, 70%, 65%)`
                    }"
                  >
                    {{ course.author.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm text-gray-700">{{ course.author.name }}</span>
                </div>
                <span class="text-sm text-gray-500">{{ course.studentsCount }} студентов</span>
              </div>
              
              <button 
                class="btn btn-primary"
                @click="$emit('enroll', course.id)"
              >
                {{ course.isFree ? 'Записаться' : 'Купить курс' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Курсы не найдены</p>
    </div>
  </div>
</template> 