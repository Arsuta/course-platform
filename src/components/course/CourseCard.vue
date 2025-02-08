<script setup lang="ts">
import type { Course } from '@/types/course'

defineProps<{
  course: Course
}>()

defineEmits<{
  enroll: [id: number]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
    <div class="relative h-1/2">
      <div 
        class="w-full h-full bg-gradient-to-br"
        :class="[
          course.id % 3 === 0 ? 'from-blue-100 to-purple-100' :
          course.id % 3 === 1 ? 'from-green-100 to-blue-100' :
          'from-pink-100 to-orange-100'
        ]"
      />
      <div 
        class="absolute top-2 md:top-4 right-2 md:right-4 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
        :class="course.isFree ? 'bg-primary-light text-white' : 'bg-white text-gray-900'"
      >
        {{ course.isFree ? 'Бесплатно' : `${course.price} ₽` }}
      </div>
    </div>
    
    <div class="p-3 md:p-4 mb-[50px]">
      <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2">{{ course.title }}</h3>
      <p class="text-xs md:text-sm text-gray-600 line-clamp-2 mb-[10px]">{{ course.description }}</p>
      
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        <div class="flex items-center space-x-1">
          <div 
            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium"
            :style="{
              backgroundColor: `hsl(${(course.author.id * 40) % 360}, 70%, 65%)`
            }"
          >
            {{ course.author.name.charAt(0).toUpperCase() }}
          </div>
          <span class="text-xs md:text-sm text-gray-700">{{ course.author.name }}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-xs md:text-sm text-gray-600">{{ course.studentsCount }} студентов</span>
          <div class="flex items-center text-primary">
            <span class="text-xs md:text-sm font-medium">{{ course.rating }}</span>
            <svg class="w-3 h-3 md:w-4 md:h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path class="cls-2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-100">
      <button 
        class="btn btn-primary w-full"
        @click="$emit('enroll', course.id)"
      >
        {{ course.isFree ? 'Записаться бесплатно' : `Купить за ${course.price} ₽` }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.cls-2 {
  fill: currentColor;
}
</style>
