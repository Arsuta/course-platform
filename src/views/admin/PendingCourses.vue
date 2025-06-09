<template>
  <div class="pending-courses">
    <h2 class="text-2xl font-bold mb-4">Курсы на модерации</h2>
    
    <div class="stats-cards mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Ожидают проверки</h3>
        <p class="text-3xl font-bold">{{ pendingCount }}</p>
      </div>
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Одобрено сегодня</h3>
        <p class="text-3xl font-bold text-green-600">{{ approvedTodayCount }}</p>
      </div>
      <div class="stat-card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Отклонено сегодня</h3>
        <p class="text-3xl font-bold text-red-600">{{ rejectedTodayCount }}</p>
      </div>
    </div>
    
    <div class="filters mb-4 flex gap-4 items-center">
      <div class="search flex-grow">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск курсов..." 
          class="w-full p-2 border rounded"
          @input="filterCourses"
        />
      </div>
      <div class="filter">
        <select v-model="categoryFilter" class="p-2 border rounded" @change="filterCourses">
          <option value="all">Все категории</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <div class="filter">
        <select v-model="levelFilter" class="p-2 border rounded" @change="filterCourses">
          <option value="all">Все уровни</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
      </div>
    </div>
    
    <div v-if="filteredCourses.length === 0" class="empty-state text-center py-10">
      <div class="text-5xl text-gray-300 dark:text-gray-600 mb-4">
        <i class="fas fa-clipboard-check"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">Нет курсов на модерации</h3>
      <p class="text-gray-400 dark:text-gray-500">Все курсы были проверены. Отличная работа!</p>
    </div>
    
    <div v-else class="courses-list grid grid-cols-1 gap-4">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id" 
        class="course-card bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <div class="p-4 flex flex-col md:flex-row gap-4">
          <div class="course-image w-full md:w-48 h-32 flex-shrink-0">
            <img :src="course.image" alt="Course" class="w-full h-full object-cover rounded" />
          </div>
          <div class="course-info flex-grow">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold">{{ course.title }}</h3>
              <span :class="getLevelBadgeClass(course.level)">
                {{ getLevelText(course.level) }}
              </span>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Автор: {{ course.author }} | Категория: {{ course.category }} | Дата подачи: {{ formatDate(course.submittedAt) }}
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ course.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in course.tags" :key="tag" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="course-actions flex flex-col justify-center gap-2">
            <button @click="viewCourse(course)" class="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center">
              <i class="fas fa-eye mr-2"></i> Просмотр
            </button>
            <button @click="approveCourse(course)" class="px-4 py-2 bg-green-500 text-white rounded flex items-center justify-center">
              <i class="fas fa-check mr-2"></i> Одобрить
            </button>
            <button @click="rejectCourse(course)" class="px-4 py-2 bg-red-500 text-white rounded flex items-center justify-center">
              <i class="fas fa-times mr-2"></i> Отклонить
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно отклонения курса -->
    <div v-if="showRejectModal && courseToReject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Отклонение курса</h3>
        <p class="mb-4">Укажите причину отклонения курса "{{ courseToReject.title }}":</p>
        <div class="mb-4">
          <textarea 
            v-model="rejectReason" 
            class="w-full p-2 border rounded h-32" 
            placeholder="Опишите причину отклонения..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="cancelReject" class="px-4 py-2 border rounded">
            Отмена
          </button>
          <button @click="confirmReject" class="px-4 py-2 bg-red-500 text-white rounded">
            Отклонить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Интерфейс для курса на модерации
interface PendingCourse {
  id: number
  title: string
  author: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  submittedAt: string
  image: string
  description: string
  tags: string[]
}

const router = useRouter()

// Моковые данные курсов на модерации
const pendingCourses = ref<PendingCourse[]>([
  {
    id: 1,
    title: 'Основы SQL',
    author: 'Сергей Волков',
    category: 'Базы данных',
    level: 'beginner',
    submittedAt: '2023-04-05T10:00:00',
    image: 'https://via.placeholder.com/150/526D82/FFFFFF?text=SQL',
    description: 'Введение в работу с реляционными базами данных и SQL. Курс охватывает основные запросы SELECT, INSERT, UPDATE, DELETE, а также базовые принципы проектирования баз данных.',
    tags: ['SQL', 'Базы данных', 'PostgreSQL', 'MySQL']
  },
  {
    id: 2,
    title: 'DevOps практики',
    author: 'Дмитрий Соколов',
    category: 'DevOps',
    level: 'intermediate',
    submittedAt: '2023-03-25T09:30:00',
    image: 'https://via.placeholder.com/150/61677A/FFFFFF?text=DevOps',
    description: 'Практический курс по внедрению DevOps практик в разработку. Изучение CI/CD, контейнеризации с Docker, оркестрации с Kubernetes и мониторинга.',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins']
  },
  {
    id: 3,
    title: 'Глубокое обучение',
    author: 'Елена Сидорова',
    category: 'Data Science',
    level: 'advanced',
    submittedAt: '2023-04-12T14:45:00',
    image: 'https://via.placeholder.com/150/27374D/FFFFFF?text=DL',
    description: 'Продвинутый курс по глубокому обучению с использованием TensorFlow и PyTorch. Нейронные сети, CNN, RNN, трансформеры и практические проекты.',
    tags: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Neural Networks']
  },
  {
    id: 4,
    title: 'Разработка микросервисов',
    author: 'Алексей Козлов',
    category: 'Архитектура',
    level: 'intermediate',
    submittedAt: '2023-04-08T11:20:00',
    image: 'https://via.placeholder.com/150/526D82/FFFFFF?text=Micro',
    description: 'Курс по проектированию и разработке микросервисной архитектуры. Паттерны, коммуникация между сервисами, масштабирование и отказоустойчивость.',
    tags: ['Микросервисы', 'API', 'Spring Boot', 'Docker']
  },
  {
    id: 5,
    title: 'Тестирование веб-приложений',
    author: 'Мария Новикова',
    category: 'QA',
    level: 'intermediate',
    submittedAt: '2023-04-10T16:15:00',
    image: 'https://via.placeholder.com/150/9DB2BF/FFFFFF?text=Test',
    description: 'Полный курс по тестированию веб-приложений. Ручное и автоматизированное тестирование, инструменты, методологии и лучшие практики.',
    tags: ['QA', 'Selenium', 'Jest', 'Cypress', 'Тестирование']
  }
])

// Статистика
const pendingCount = computed(() => pendingCourses.value.length)
const approvedTodayCount = ref(3)
const rejectedTodayCount = ref(1)

// Список уникальных категорий
const categories = computed(() => {
  const uniqueCategories = new Set<string>()
  pendingCourses.value.forEach(course => uniqueCategories.add(course.category))
  return Array.from(uniqueCategories)
})

// Состояние фильтров и поиска
const searchQuery = ref('')
const categoryFilter = ref('all')
const levelFilter = ref('all')

// Состояние модального окна отклонения
const showRejectModal = ref(false)
const courseToReject = ref<PendingCourse | null>(null)
const rejectReason = ref('')

// Фильтрация курсов
const filteredCourses = computed(() => {
  let result = [...pendingCourses.value]
  
  // Применение поиска
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.author.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Применение фильтра по категории
  if (categoryFilter.value !== 'all') {
    result = result.filter(course => course.category === categoryFilter.value)
  }
  
  // Применение фильтра по уровню
  if (levelFilter.value !== 'all') {
    result = result.filter(course => course.level === levelFilter.value)
  }
  
  return result
})

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

// Получение класса для бейджа уровня
const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'intermediate':
      return 'px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'advanced':
      return 'px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Получение текста для уровня
const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'Начинающий'
    case 'intermediate':
      return 'Средний'
    case 'advanced':
      return 'Продвинутый'
    default:
      return 'Неизвестно'
  }
}

// Функция фильтрации курсов
const filterCourses = () => {
  // Применение фильтров происходит автоматически через computed свойство
}

// Просмотр курса
const viewCourse = (course: PendingCourse) => {
  // В реальном приложении здесь был бы переход на страницу предпросмотра курса
  console.log('Просмотр курса:', course.id)
}

// Одобрение курса
const approveCourse = (course: PendingCourse) => {
  const index = pendingCourses.value.findIndex(c => c.id === course.id)
  if (index !== -1) {
    pendingCourses.value.splice(index, 1)
    approvedTodayCount.value++
    
    // В реальном приложении здесь был бы API-запрос для одобрения курса
    console.log('Курс одобрен:', course.id)
  }
}

// Отклонение курса (открытие модального окна)
const rejectCourse = (course: PendingCourse) => {
  courseToReject.value = course
  rejectReason.value = ''
  showRejectModal.value = true
}

// Отмена отклонения
const cancelReject = () => {
  showRejectModal.value = false
  courseToReject.value = null
  rejectReason.value = ''
}

// Подтверждение отклонения
const confirmReject = () => {
  if (courseToReject.value && rejectReason.value.trim()) {
    const index = pendingCourses.value.findIndex(c => c.id === courseToReject.value!.id)
    if (index !== -1) {
      pendingCourses.value.splice(index, 1)
      rejectedTodayCount.value++
      
      // В реальном приложении здесь был бы API-запрос для отклонения курса
      console.log('Курс отклонен:', courseToReject.value.id, 'Причина:', rejectReason.value)
    }
    
    showRejectModal.value = false
    courseToReject.value = null
    rejectReason.value = ''
  }
}
</script>

<style scoped>
.pending-courses {
  @apply p-6;
}

.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}
</style> 