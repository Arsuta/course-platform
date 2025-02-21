<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Lesson } from '@/types/course'

const route = useRoute()
const lesson = ref<Lesson | null>(null)

onMounted(async () => {
  // TODO: Загрузка урока по ID
  console.log('Loading lesson:', route.params.lessonId)
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="lesson" class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ lesson.title }}</h1>
      <div class="aspect-video bg-gray-100 rounded-lg">
        <!-- TODO: Видеоплеер или другой контент урока -->
      </div>
      <div class="prose max-w-none">
        {{ lesson.content }}
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <p class="text-gray-500">Загрузка урока...</p>
    </div>
  </div>
</template> 