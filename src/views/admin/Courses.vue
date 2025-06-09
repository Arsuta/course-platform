<template>
  <div class="admin-courses">
    <h2 class="text-2xl font-bold mb-4">Управление курсами</h2>
    
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
        <select v-model="statusFilter" class="p-2 border rounded" @change="filterCourses">
          <option value="all">Все статусы</option>
          <option value="published">Опубликованные</option>
          <option value="draft">Черновики</option>
          <option value="pending">На модерации</option>
        </select>
      </div>
    </div>
    
    <div class="courses-table bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Название</th>
            <th class="p-3 text-left">Автор</th>
            <th class="p-3 text-left">Категория</th>
            <th class="p-3 text-left">Уровень</th>
            <th class="p-3 text-left">Статус</th>
            <th class="p-3 text-left">Дата создания</th>
            <th class="p-3 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in filteredCourses" :key="course.id" class="border-t border-gray-200 dark:border-gray-600">
            <td class="p-3">{{ course.id }}</td>
            <td class="p-3">
              <div class="flex items-center">
                <img :src="course.image" alt="Course" class="w-10 h-10 object-cover rounded mr-2" />
                <span class="font-medium">{{ course.title }}</span>
              </div>
            </td>
            <td class="p-3">{{ course.author }}</td>
            <td class="p-3">{{ course.category }}</td>
            <td class="p-3">
              <span :class="getLevelBadgeClass(course.level)">
                {{ getLevelText(course.level) }}
              </span>
            </td>
            <td class="p-3">
              <span :class="getStatusBadgeClass(course.status)">
                {{ getStatusText(course.status) }}
              </span>
            </td>
            <td class="p-3">{{ formatDate(course.createdAt) }}</td>
            <td class="p-3">
              <div class="flex gap-2">
                <button @click="viewCourse(course)" class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editCourse(course)" class="text-green-500 hover:text-green-700">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="toggleCourseStatus(course)" :class="course.status === 'published' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'">
                  <i :class="course.status === 'published' ? 'fas fa-times-circle' : 'fas fa-check-circle'"></i>
                </button>
                <button @click="deleteCourse(course)" class="text-red-500 hover:text-red-700">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Пагинация -->
    <div class="pagination mt-4 flex justify-center">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
      >
        &lt;
      </button>
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="currentPage = page"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === page ? 'bg-primary text-white' : ''"
      >
        {{ page }}
      </button>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
      >
        &gt;
      </button>
    </div>
    
    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Подтверждение удаления</h3>
        <p class="mb-4">Вы действительно хотите удалить курс "{{ courseToDelete?.title }}"?</p>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteModal = false" class="px-4 py-2 border rounded">
            Отмена
          </button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded">
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Интерфейс для курса
interface Course {
  id: number
  title: string
  author: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'published' | 'draft' | 'pending'
  createdAt: string
  image: string
  description: string
}

const router = useRouter()

// Моковые данные курсов
const courses = ref<Course[]>([
  {
    id: 1,
    title: 'Введение в JavaScript',
    author: 'Петр Петров',
    category: 'Программирование',
    level: 'beginner',
    status: 'published',
    createdAt: '2023-01-10T09:00:00',
    image: 'https://via.placeholder.com/150/4F6F52/FFFFFF?text=JS',
    description: 'Базовый курс по JavaScript для начинающих разработчиков.'
  },
  {
    id: 2,
    title: 'Продвинутый React',
    author: 'Анна Смирнова',
    category: 'Программирование',
    level: 'advanced',
    status: 'published',
    createdAt: '2023-02-15T10:30:00',
    image: 'https://via.placeholder.com/150/61677A/FFFFFF?text=React',
    description: 'Углубленное изучение React для опытных фронтенд-разработчиков.'
  },
  {
    id: 3,
    title: 'Основы Python',
    author: 'Иван Иванов',
    category: 'Программирование',
    level: 'beginner',
    status: 'published',
    createdAt: '2023-01-20T14:00:00',
    image: 'https://via.placeholder.com/150/27374D/FFFFFF?text=Python',
    description: 'Введение в программирование на Python для начинающих.'
  },
  {
    id: 4,
    title: 'Машинное обучение',
    author: 'Елена Сидорова',
    category: 'Data Science',
    level: 'intermediate',
    status: 'published',
    createdAt: '2023-03-05T11:15:00',
    image: 'https://via.placeholder.com/150/526D82/FFFFFF?text=ML',
    description: 'Основы машинного обучения и работы с данными.'
  },
  {
    id: 5,
    title: 'Дизайн интерфейсов',
    author: 'Мария Новикова',
    category: 'Дизайн',
    level: 'intermediate',
    status: 'published',
    createdAt: '2023-02-28T09:45:00',
    image: 'https://via.placeholder.com/150/9DB2BF/FFFFFF?text=UI',
    description: 'Принципы проектирования удобных и красивых интерфейсов.'
  },
  {
    id: 6,
    title: 'Алгоритмы и структуры данных',
    author: 'Алексей Козлов',
    category: 'Программирование',
    level: 'advanced',
    status: 'draft',
    createdAt: '2023-04-10T13:20:00',
    image: 'https://via.placeholder.com/150/27374D/FFFFFF?text=Algo',
    description: 'Продвинутый курс по алгоритмам и структурам данных.'
  },
  {
    id: 7,
    title: 'Основы SQL',
    author: 'Сергей Волков',
    category: 'Базы данных',
    level: 'beginner',
    status: 'pending',
    createdAt: '2023-04-05T10:00:00',
    image: 'https://via.placeholder.com/150/526D82/FFFFFF?text=SQL',
    description: 'Введение в работу с реляционными базами данных и SQL.'
  },
  {
    id: 8,
    title: 'DevOps практики',
    author: 'Дмитрий Соколов',
    category: 'DevOps',
    level: 'intermediate',
    status: 'pending',
    createdAt: '2023-03-25T09:30:00',
    image: 'https://via.placeholder.com/150/61677A/FFFFFF?text=DevOps',
    description: 'Практический курс по внедрению DevOps практик в разработку.'
  },
  {
    id: 9,
    title: 'Кибербезопасность',
    author: 'Ольга Морозова',
    category: 'Безопасность',
    level: 'advanced',
    status: 'draft',
    createdAt: '2023-04-15T11:45:00',
    image: 'https://via.placeholder.com/150/27374D/FFFFFF?text=Security',
    description: 'Продвинутый курс по кибербезопасности и защите информации.'
  },
  {
    id: 10,
    title: 'Мобильная разработка на Flutter',
    author: 'Наталья Лебедева',
    category: 'Мобильная разработка',
    level: 'intermediate',
    status: 'published',
    createdAt: '2023-03-15T14:30:00',
    image: 'https://via.placeholder.com/150/9DB2BF/FFFFFF?text=Flutter',
    description: 'Создание кроссплатформенных мобильных приложений на Flutter.'
  }
])

// Список уникальных категорий
const categories = computed(() => {
  const uniqueCategories = new Set<string>()
  courses.value.forEach(course => uniqueCategories.add(course.category))
  return Array.from(uniqueCategories)
})

// Состояние фильтров и поиска
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 5

// Состояние модального окна удаления
const showDeleteModal = ref(false)
const courseToDelete = ref<Course | null>(null)

// Фильтрация курсов
const filteredCourses = computed(() => {
  let result = [...courses.value]
  
  // Применение поиска
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.author.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    )
  }
  
  // Применение фильтра по категории
  if (categoryFilter.value !== 'all') {
    result = result.filter(course => course.category === categoryFilter.value)
  }
  
  // Применение фильтра по статусу
  if (statusFilter.value !== 'all') {
    result = result.filter(course => course.status === statusFilter.value)
  }
  
  // Пагинация
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Общее количество страниц для пагинации
const totalPages = computed(() => {
  let filteredCount = courses.value.length
  
  // Применение поиска
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredCount = courses.value.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.author.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    ).length
  }
  
  // Применение фильтра по категории
  if (categoryFilter.value !== 'all') {
    filteredCount = courses.value.filter(course => course.category === categoryFilter.value).length
  }
  
  // Применение фильтра по статусу
  if (statusFilter.value !== 'all') {
    filteredCount = courses.value.filter(course => course.status === statusFilter.value).length
  }
  
  return Math.ceil(filteredCount / itemsPerPage)
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

// Получение класса для бейджа статуса
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'draft':
      return 'px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    case 'pending':
      return 'px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Получение текста для статуса
const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return 'Опубликован'
    case 'draft':
      return 'Черновик'
    case 'pending':
      return 'На модерации'
    default:
      return 'Неизвестно'
  }
}

// Функция фильтрации курсов
const filterCourses = () => {
  currentPage.value = 1 // Сбрасываем на первую страницу при изменении фильтров
}

// Просмотр курса
const viewCourse = (course: Course) => {
  router.push({ name: 'course-detail', params: { id: course.id } })
}

// Редактирование курса
const editCourse = (course: Course) => {
  // В реальном приложении здесь был бы переход на страницу редактирования
  console.log('Редактирование курса:', course.id)
}

// Изменение статуса курса
const toggleCourseStatus = (course: Course) => {
  const index = courses.value.findIndex(c => c.id === course.id)
  if (index !== -1) {
    if (courses.value[index].status === 'published') {
      courses.value[index].status = 'draft'
    } else {
      courses.value[index].status = 'published'
    }
  }
}

// Удаление курса
const deleteCourse = (course: Course) => {
  courseToDelete.value = course
  showDeleteModal.value = true
}

// Подтверждение удаления курса
const confirmDelete = () => {
  if (courseToDelete.value) {
    const index = courses.value.findIndex(c => c.id === courseToDelete.value!.id)
    if (index !== -1) {
      courses.value.splice(index, 1)
    }
    showDeleteModal.value = false
    courseToDelete.value = null
  }
}
</script>

<style scoped>
.admin-courses {
  @apply p-6;
}

.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}
</style> 