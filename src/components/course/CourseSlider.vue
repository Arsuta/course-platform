<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Course {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  price: number;
  author: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  rating: number;
}

defineProps<{
  courses: Course[]
  title?: string
}>()

defineEmits<{
  (e: 'enroll', courseId: string): void
}>()

const formatPrice = (price: number): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`
}
</script>

<template>
  <div class="course-slider-container">
    <h2 v-if="title" class="text-2xl font-bold mb-4">{{ title }}</h2>
    
    <div class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <img :src="course.cover_image || '/images/default-course.jpg'" alt="Обложка курса" class="course-image">
        <div class="card-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-description">{{ course.description.substring(0, 100) }}...</p>
          
          <div class="course-meta">
            <div class="course-author">
              {{ course.author.first_name }} {{ course.author.last_name }}
            </div>
            <div class="course-rating">
              <span class="star">★</span> {{ course.rating }}
            </div>
          </div>
          
          <div class="course-actions">
            <button @click="$emit('enroll', course.id)" class="btn-enroll">
              Записаться
            </button>
            <RouterLink :to="`/courses/${course.id}`" class="btn-details">
              Подробнее
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-slider-container {
  margin-bottom: 2rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.course-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.course-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.course-author {
  color: #555;
}

.course-rating {
  display: flex;
  align-items: center;
}

.star {
  color: #f9ca24;
  margin-right: 0.25rem;
}

.course-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.btn-enroll, .btn-details {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.3s ease;
}

.btn-enroll {
  background-color: #4f46e5;
  color: white;
  flex-grow: 1;
}

.btn-enroll:hover {
  background-color: #4338ca;
}

.btn-details {
  background-color: #f3f4f6;
  color: #4b5563;
  flex-grow: 1;
}

.btn-details:hover {
  background-color: #e5e7eb;
}
</style>
