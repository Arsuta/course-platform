<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '@/stores/courses';
import { useAuthStore } from '@/stores/auth';
import type { Course } from '@/api/types';
import { COURSE_CONSTANTS } from '@/constants/course';
import type { CategoryId } from '@/types/course';

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();
const authStore = useAuthStore();

const courseId = computed(() => route.query.id as string);
const course = ref<Course | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const enrolling = ref(false);
const enrollmentSuccess = ref(false);

// Проверка, записан ли пользователь на курс
const isEnrolled = computed(() => {
  if (!course.value) return false;
  return coursesStore.isEnrolled(course.value.id);
});

// Получение данных курса
const fetchCourseData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    if (!courseId.value) {
      throw new Error('ID курса не указан');
    }
    
    course.value = await coursesStore.fetchCourse(courseId.value);
    loading.value = false;
  } catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке курса';
    loading.value = false;
  }
};

// Запись на курс
const handleEnroll = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }

  if (!course.value) return;
  
  try {
    enrolling.value = true;
    const result = await coursesStore.enrollCourse(course.value.id);
    
    if (result.success) {
      enrollmentSuccess.value = true;
    } else {
      error.value = result.message;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка при записи на курс';
  } finally {
    enrolling.value = false;
  }
};

// Переход к обучению
const startLearning = () => {
  if (!course.value) return;
  router.push(`/courses/${course.value.id}/learn`);
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

// Форматирование цены
const formatPrice = (price: number = 0): string => {
  return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
};

// Получение метки категории
const getCategoryLabel = (categoryId: string) => {
  return COURSE_CONSTANTS?.CATEGORY_LABELS?.[categoryId as CategoryId] || categoryId;
};

// Получение метки уровня
const getLevelLabel = (level: string) => {
  return COURSE_CONSTANTS?.LEVEL_LABELS?.[level as keyof typeof COURSE_CONSTANTS.LEVEL_LABELS] || level;
};

// Моковые данные для преимуществ курса
const courseFeatures = [
  { 
    icon: 'M12 14l9-5-9-5-9 5 9 5z', 
    title: 'Доступ к материалам', 
    description: 'Полный доступ ко всем материалам курса без ограничений' 
  },
  { 
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
    title: 'Сертификат', 
    description: 'Получите сертификат о прохождении курса после успешной сдачи итогового теста' 
  },
  { 
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', 
    title: 'Обратная связь', 
    description: 'Задавайте вопросы и получайте ответы от преподавателя' 
  },
  { 
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
    title: 'Обучение в своем темпе', 
    description: 'Проходите материалы в удобном для вас темпе без ограничений по времени' 
  }
];

// Моковые данные для отзывов о курсе
const courseReviews = [
  {
    id: '1',
    user: {
      name: 'Анна С.',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    rating: 5,
    text: 'Отличный курс! Материал изложен понятно и структурировано. Много практических заданий, которые помогают закрепить теорию.',
    date: '15.04.2023'
  },
  {
    id: '2',
    user: {
      name: 'Иван П.',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    rating: 4,
    text: 'Хороший курс для начинающих. Некоторые темы можно было бы раскрыть глубже, но в целом я доволен результатом.',
    date: '03.05.2023'
  },
  {
    id: '3',
    user: {
      name: 'Елена К.',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    rating: 5,
    text: 'Очень понравился формат подачи материала. Преподаватель объясняет сложные концепции простым языком. Рекомендую!',
    date: '22.05.2023'
  }
];

onMounted(async () => {
  await fetchCourseData();
  
  // Загружаем курсы, если они еще не загружены
  if (coursesStore.courses.length === 0) {
    await coursesStore.fetchCourses();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center text-red-600">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-lg">{{ error }}</p>
        <button @click="router.go(-1)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Вернуться назад
        </button>
      </div>
    </div>

    <!-- Содержимое страницы -->
    <div v-else-if="course" class="container mx-auto px-4 py-8">
      <!-- Верхний блок с основной информацией -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div class="relative h-64 bg-gradient-to-r from-primary to-primary-dark">
          <img 
            :src="course.thumbnail || 'https://via.placeholder.com/1200x400?text=Курс'" 
            :alt="course.title" 
            class="w-full h-full object-cover opacity-30"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white p-6">
              <h1 class="text-4xl font-bold mb-2">{{ course.title }}</h1>
              <p class="text-xl">{{ course.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {{ getCategoryLabel(course.category_id || '') }}
            </div>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatDuration(course.duration) }}
            </span>
            <span>•</span>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ getLevelLabel(course.level || '') }}
            </span>
            <span>•</span>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {{ course.rating?.toFixed(1) || "Нет оценок" }}
            </span>
            <span>•</span>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ course.students_count || 0 }} студентов
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Информация о курсе -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">О курсе</h2>
              <p class="text-gray-600 mb-6">{{ course.description }}</p>
              
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Чему вы научитесь</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div v-for="(feature, index) in courseFeatures" :key="index" class="flex items-start">
                  <div class="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ feature.title }}</h3>
                    <p class="text-gray-600 text-sm">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
              
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Отзывы студентов</h2>
              <div class="space-y-6">
                <div v-for="review in courseReviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-0">
                  <div class="flex items-start">
                    <img :src="review.user.avatar" :alt="review.user.name" class="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div class="flex items-center mb-1">
                        <h3 class="font-semibold text-gray-900 mr-2">{{ review.user.name }}</h3>
                        <span class="text-sm text-gray-500">{{ review.date }}</span>
                      </div>
                      <div class="flex text-yellow-400 mb-2">
                        <svg v-for="i in 5" :key="i" class="w-4 h-4" :fill="i <= review.rating ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <p class="text-gray-600">{{ review.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Боковая панель -->
            <div class="md:col-span-1">
              <div class="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
                <div class="text-3xl font-bold text-gray-900 mb-4">
                  {{ formatPrice(course.price) }}
                </div>
                
                <!-- Кнопка записи или начала обучения -->
                <div v-if="!isEnrolled" class="mb-4">
                  <button 
                    @click="handleEnroll"
                    :disabled="enrolling"
                    class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span v-if="!enrolling">Записаться на курс</span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Обработка...
                    </span>
                  </button>
                </div>
                
                <div v-else class="mb-4">
                  <button
                    @click="startLearning"
                    class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    Начать обучение
                  </button>
                </div>
                
                <!-- Информация о курсе -->
                <div class="space-y-4 text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Продолжительность: {{ formatDuration(course.duration) }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>4 урока</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Итоговый тест</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Сертификат по окончании</span>
                  </div>
                </div>
                
                <!-- Автор курса -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h3 class="font-semibold text-gray-900 mb-2">Автор курса</h3>
                  <div class="flex items-center">
                    <img 
                      :src="course.authorAvatar || 'https://i.pravatar.cc/150?img=1'" 
                      alt="Автор курса" 
                      class="w-10 h-10 rounded-full mr-3" 
                    />
                    <div>
                      <p class="font-medium text-gray-900">{{ course.author || 'Преподаватель' }}</p>
                      <p class="text-sm text-gray-500">Эксперт в области</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Кнопка назад к списку курсов -->
      <div class="flex justify-center">
        <button 
          @click="router.push('/courses')" 
          class="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку курсов
        </button>
      </div>
    </div>
  </div>
</template> 