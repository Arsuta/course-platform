<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Course } from '@/api/types';
import type { ExtendedCourse } from '@/types/course';

const props = defineProps<{
  courses: ExtendedCourse[];
  formatPrice?: (price: number) => string;
}>();

const emit = defineEmits(['enroll']);

const router = useRouter();
const currentSlide = ref(0);
const sliderInterval = ref<number | null>(null);
const isMobile = ref(false);

// Вычисляем общее количество слайдов
const totalSlides = computed(() => props.courses.length);

// Функция для обновления мобильного вида
const updateMobileState = () => {
  isMobile.value = window.innerWidth < 640;
};

// Переход к следующему слайду
const nextSlide = () => {
  console.log('Next slide clicked, current:', currentSlide.value, 'total:', totalSlides.value);
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value += 1; // Переходим строго на один слайд вперед
    console.log('Moving to slide:', currentSlide.value);
  } else {
    currentSlide.value = 0; // Возвращаемся к началу
    console.log('Returning to first slide');
  }
};

// Переход к предыдущему слайду
const prevSlide = () => {
  console.log('Previous slide clicked, current:', currentSlide.value, 'total:', totalSlides.value);
  if (currentSlide.value > 0) {
    currentSlide.value -= 1; // Переходим строго на один слайд назад
    console.log('Moving to slide:', currentSlide.value);
  } else {
    currentSlide.value = totalSlides.value - 1; // Переходим в конец
    console.log('Moving to last slide:', totalSlides.value - 1);
  }
};

// Переход к конкретному слайду
const goToSlide = (index: number) => {
  currentSlide.value = index;
};

// Запуск автоматического слайдера
const startAutoSlide = () => {
  sliderInterval.value = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

// Остановка автоматического слайдера
const stopAutoSlide = () => {
  if (sliderInterval.value !== null) {
    clearInterval(sliderInterval.value);
    sliderInterval.value = null;
  }
};

// Переход к детальной странице курса
const goToCourseDetail = (courseId: string) => {
  router.push(`/courses/preview/${courseId}`);
};

// Запись на курс
const handleEnroll = (courseId: string) => {
  emit('enroll', courseId);
};

// Форматирование цены
const formatCoursePrice = (price: number): string => {
  if (props.formatPrice) {
    return props.formatPrice(price);
  }
  return price.toString();
};

// Обработчик изменения размера окна
const handleResize = () => {
  updateMobileState();
};

// Форматирование продолжительности курса
const formatDuration = (minutes: number = 0): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} мин`;
  }
  
  return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`;
};

// Получение изображения для курса с гарантированным возвратом URL
const getCourseThumbnail = (course: ExtendedCourse): string => {
  // Если у курса есть thumbnail или image, используем его
  if (course.thumbnail) return course.thumbnail;
  if (course.image) return course.image;
  
  // В противном случае используем запасное изображение на основе ID
  return getCourseImage(course.id);
};

// Получение изображения для курса
const getCourseImage = (courseId: string): string => {
  // Массив с URL изображений для курсов
  const courseImages = [
    'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1000',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000',
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
    'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000'
  ];
  
  // Используем последнюю цифру ID курса для выбора изображения
  const lastChar = courseId.charAt(courseId.length - 1);
  const index = parseInt(lastChar, 10) % courseImages.length;
  
  return courseImages[index];
};

// Получение цвета для категории
const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    'programming': 'bg-blue-500',
    'design': 'bg-purple-500',
    'marketing': 'bg-green-500',
    'business': 'bg-amber-500',
    'personal-development': 'bg-pink-500',
    'language': 'bg-cyan-500',
    'data-science': 'bg-indigo-500',
    'health': 'bg-red-500',
    'other': 'bg-gray-500'
  };
  
  return colors[categoryId] || 'bg-gray-500';
};

// Получение иконки для категории
const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    'programming': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'design': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'marketing': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
    'business': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'personal-development': 'M13 10V3L4 14h7v7l9-11h-7z',
    'language': 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
    'data-science': 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'health': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    'other': 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
  };
  
  return icons[categoryId] || icons['other'];
};

// Получение названия категории
const getCategoryName = (categoryId: string): string => {
  const names: Record<string, string> = {
    'programming': 'Программирование',
    'design': 'Дизайн',
    'marketing': 'Маркетинг',
    'business': 'Бизнес',
    'personal-development': 'Саморазвитие',
    'language': 'Языки',
    'data-science': 'Анализ данных',
    'health': 'Здоровье',
    'other': 'Другое'
  };
  
  return names[categoryId] || 'Другое';
};

onMounted(() => {
  updateMobileState();
  startAutoSlide();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  stopAutoSlide();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="relative animate-fadeIn">
    <!-- Кнопки навигации -->
    <button 
      @click="prevSlide" 
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all duration-300 group"
      :class="{'opacity-50 cursor-not-allowed': currentSlide === 0}"
      :disabled="currentSlide === 0"
    >
      <svg class="w-5 h-5 text-gray-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button 
      @click="nextSlide" 
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-all duration-300 group"
      :class="{'opacity-50 cursor-not-allowed': currentSlide >= totalSlides - 1}"
      :disabled="currentSlide >= totalSlides - 1"
    >
      <svg class="w-5 h-5 text-gray-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    
    <!-- Контейнер слайдера -->
    <div class="overflow-hidden" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
      <!-- Только текущий слайд -->
      <transition name="slide" mode="out-in">
        <div :key="currentSlide" class="w-full px-3">
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 mx-auto max-w-md">
            <!-- Изображение курса -->
            <div 
              class="relative h-60 cursor-pointer group overflow-hidden"
              @click="goToCourseDetail(courses[currentSlide].id)"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span class="text-white font-medium px-4 py-2 rounded-lg border border-white/50 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Подробнее
                </span>
              </div>
              <img 
                :src="getCourseThumbnail(courses[currentSlide])" 
                :alt="courses[currentSlide].title" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 via-transparent to-black/70 z-0"></div>
              <div class="absolute bottom-3 left-3 z-10">
                <div class="px-2 py-1 bg-white/90 text-primary text-xs font-semibold rounded-md shadow-sm">
                  {{ courses[currentSlide].level || 'Начальный' }}
                </div>
              </div>
              <div v-if="courses[currentSlide].isNew" class="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-md shadow-sm z-10">
                Новинка
              </div>
              <div v-else-if="courses[currentSlide].isPopular" class="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md shadow-sm z-10">
                Популярный
              </div>
              <div v-else-if="courses[currentSlide].isFeatured" class="absolute top-3 right-3 px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-md shadow-sm z-10">
                Рекомендуемый
              </div>
            </div>
            
            <!-- Информация о курсе -->
            <div class="p-5 flex flex-col flex-grow">
              <h3 
                class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                @click="goToCourseDetail(courses[currentSlide].id)"
              >
                {{ courses[currentSlide].title }}
              </h3>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ courses[currentSlide].description }}</p>
              
              <!-- Метаданные курса -->
              <div class="flex items-center gap-3 mb-4 text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ courses[currentSlide].duration ? formatDuration(courses[currentSlide].duration) : '2 часа' }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ courses[currentSlide].lessons || '4' }} уроков
                </div>
              </div>
              
              <!-- Категория курса -->
              <div class="flex items-center mb-3">
                <div :class="`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${getCategoryColor(courses[currentSlide].category_id || 'other')}`">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getCategoryIcon(courses[currentSlide].category_id || 'other')" />
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-600">{{ getCategoryName(courses[currentSlide].category_id || 'other') }}</span>
              </div>
              
              <!-- Автор курса -->
              <div class="flex items-center mb-4 mt-auto">
                <img 
                  :src="courses[currentSlide].authorAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                  :alt="courses[currentSlide].author || 'Автор курса'" 
                  class="w-8 h-8 rounded-full mr-2 border border-primary/20" 
                />
                <span class="text-sm text-gray-700">{{ courses[currentSlide].author || 'Автор курса' }}</span>
              </div>
              
              <!-- Рейтинг и цена -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(courses[currentSlide].rating || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-1 text-sm text-gray-700">{{ courses[currentSlide].rating?.toFixed(1) || "4.5" }}</span>
                  <span class="ml-1 text-xs text-gray-500">({{ courses[currentSlide].reviewCount || '24' }})</span>
                </div>
                <div class="font-bold text-gray-900">{{ formatCoursePrice(courses[currentSlide].price) }}</div>
              </div>
              
              <!-- Кнопка записи -->
              <button 
                @click="handleEnroll(courses[currentSlide].id)" 
                class="mt-4 w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center group"
              >
                <span>Записаться</span>
                <svg class="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Индикаторы слайдов -->
    <div class="flex justify-center mt-8 space-x-3">
      <button 
        v-for="i in totalSlides" 
        :key="i"
        @click="goToSlide(i - 1)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="currentSlide === i - 1 ? 
          'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

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
