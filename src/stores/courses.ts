import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CourseLevel, CourseStatus } from '@/api/types'
import type { Course, Lesson } from '@/api/types'
import { api } from '@/api'
import { useAuthStore } from '@/stores/auth'

interface CoursesState {
  courses: Course[]
  featuredCourses: Course[]
  popularCourses: Course[]
  newCourses: Course[]
  enrolledCourseIds: string[]
  loading: boolean
  error: string | null
}

// Расширенный интерфейс для моковых курсов
export interface MockCourse extends Course {
  author?: string;
  authorAvatar?: string;
  image?: string;
  reviewCount?: number;
  category?: string;
  tags?: string[];
  lessons?: number;
  students?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Моковые данные для курсов
const mockCourses: MockCourse[] = [
  {
    id: '1',
    title: 'Основы веб-разработки',
    description: 'Изучите основы HTML, CSS и JavaScript для создания современных веб-сайтов',
    category_id: 'programming',
    level: CourseLevel.BEGINNER,
    price: 0,
    duration: 120,
    status: CourseStatus.PUBLISHED,
    rating: 4.7,
    author: 'Александр Иванов',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
    reviewCount: 124,
    students: 1250,
    isPopular: true,
    lessons: 12,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'JavaScript для начинающих',
    description: 'Полный курс по JavaScript с нуля до создания интерактивных веб-приложений',
    category_id: 'programming',
    level: CourseLevel.BEGINNER,
    price: 2500,
    duration: 180,
    status: CourseStatus.PUBLISHED,
    rating: 4.5,
    author: 'Мария Петрова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
    reviewCount: 98,
    students: 876,
    isNew: true,
    lessons: 15,
    created_at: '2023-02-20T10:00:00Z',
    updated_at: '2023-02-20T10:00:00Z'
  },
  {
    id: '3',
    title: 'React для профессионалов',
    description: 'Продвинутый курс по React.js с использованием современных подходов и библиотек',
    category_id: 'programming',
    level: CourseLevel.ADVANCED,
    price: 4500,
    duration: 240,
    status: CourseStatus.PUBLISHED,
    rating: 4.9,
    author: 'Дмитрий Сидоров',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000',
    reviewCount: 156,
    students: 1430,
    isFeatured: true,
    lessons: 20,
    created_at: '2023-03-10T10:00:00Z',
    updated_at: '2023-03-10T10:00:00Z'
  },
  {
    id: '4',
    title: 'Python: с нуля до профи',
    description: 'Полный курс по Python от основ до создания реальных проектов',
    category_id: 'programming',
    level: CourseLevel.INTERMEDIATE,
    price: 3500,
    duration: 210,
    status: CourseStatus.PUBLISHED,
    rating: 4.8,
    author: 'Елена Смирнова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000',
    reviewCount: 142,
    students: 1120,
    isPopular: true,
    lessons: 18,
    created_at: '2023-04-05T10:00:00Z',
    updated_at: '2023-04-05T10:00:00Z'
  },
  {
    id: '5',
    title: 'UI/UX дизайн: основы',
    description: 'Научитесь создавать привлекательные и удобные интерфейсы для веб и мобильных приложений',
    category_id: 'design',
    level: CourseLevel.BEGINNER,
    price: 3000,
    duration: 150,
    status: CourseStatus.PUBLISHED,
    rating: 4.6,
    author: 'Анна Козлова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000',
    reviewCount: 87,
    students: 750,
    isNew: true,
    lessons: 14,
    created_at: '2023-05-12T10:00:00Z',
    updated_at: '2023-05-12T10:00:00Z'
  },
  {
    id: '6',
    title: 'Машинное обучение для начинающих',
    description: 'Введение в мир машинного обучения с практическими примерами на Python',
    category_id: 'data-science',
    level: CourseLevel.INTERMEDIATE,
    price: 5000,
    duration: 270,
    status: CourseStatus.PUBLISHED,
    rating: 4.7,
    author: 'Игорь Васильев',
    authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    reviewCount: 112,
    students: 980,
    isFeatured: true,
    lessons: 22,
    created_at: '2023-06-20T10:00:00Z',
    updated_at: '2023-06-20T10:00:00Z'
  },
  {
    id: '7',
    title: 'Машинное обучение',
    description: 'Основы машинного обучения и работы с данными. Алгоритмы классификации, регрессии, кластеризации и нейронные сети.',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    author: 'Елена Сидорова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/76.jpg',
    rating: 4.6,
    reviewCount: 64,
    price: 4500,
    level: CourseLevel.INTERMEDIATE,
    category: 'Data Science',
    category_id: 'data-science',
    tags: ['Machine Learning', 'Python', 'Data Science'],
    duration: 56, // 8 недель в днях
    lessons: 32,
    students_count: 620,
    isFeatured: true,
    isPopular: false,
    isNew: true,
    createdAt: '2023-03-05T11:15:00',
    updatedAt: '2023-04-18T16:20:00',
    created_at: '2023-03-05T11:15:00',
    updated_at: '2023-04-18T16:20:00',
    status: CourseStatus.PUBLISHED
  },
  {
    id: '8',
    title: 'Дизайн интерфейсов',
    description: 'Принципы проектирования удобных и красивых интерфейсов. UX/UI дизайн, прототипирование, тестирование и лучшие практики.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000',
    author: 'Мария Новикова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    rating: 4.5,
    reviewCount: 92,
    price: 3200,
    level: CourseLevel.INTERMEDIATE,
    category: 'Дизайн',
    category_id: 'design',
    tags: ['UI/UX', 'Design', 'Figma'],
    duration: 35, // 5 недель в днях
    lessons: 25,
    students_count: 940,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    createdAt: '2023-02-28T09:45:00',
    updatedAt: '2023-04-10T13:30:00',
    created_at: '2023-02-28T09:45:00',
    updated_at: '2023-04-10T13:30:00',
    status: CourseStatus.PUBLISHED
  },
  {
    id: '9',
    title: 'Алгоритмы и структуры данных',
    description: 'Продвинутый курс по алгоритмам и структурам данных. Сложность алгоритмов, деревья, графы, динамическое программирование и многое другое.',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1000',
    author: 'Алексей Козлов',
    authorAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    rating: 4.8,
    reviewCount: 48,
    price: 3900,
    level: CourseLevel.ADVANCED,
    category: 'Программирование',
    category_id: 'programming',
    tags: ['Algorithms', 'Data Structures', 'Computer Science'],
    duration: 56, // 7 недель в днях
    lessons: 28,
    students: 410,
    isFeatured: false,
    isPopular: false,
    isNew: true,
    createdAt: '2023-04-10T13:20:00',
    updatedAt: '2023-04-25T15:10:00',
    status: CourseStatus.PUBLISHED
  },
  {
    id: '10',
    title: 'Мобильная разработка на Flutter',
    description: 'Создание кроссплатформенных мобильных приложений на Flutter. Виджеты, состояния, навигация, работа с API и публикация приложений.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000',
    author: 'Наталья Лебедева',
    authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 4.7,
    reviewCount: 76,
    price: 4200,
    level: CourseLevel.INTERMEDIATE,
    category: 'Мобильная разработка',
    category_id: 'programming',
    tags: ['Flutter', 'Dart', 'Mobile'],
    duration: 42, // 6 недель в днях
    lessons: 30,
    students: 580,
    isFeatured: true,
    isPopular: false,
    isNew: true,
    createdAt: '2023-03-15T14:30:00',
    updatedAt: '2023-04-22T10:45:00',
    status: CourseStatus.PUBLISHED
  },
  {
    id: '11',
    title: 'Веб-разработка для начинающих',
    description: 'Полный курс по основам веб-разработки. HTML, CSS, JavaScript, адаптивный дизайн и основы бэкенда.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000',
    author: 'Дмитрий Соколов',
    authorAvatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 4.9,
    reviewCount: 215,
    price: 2800,
    level: CourseLevel.BEGINNER,
    category: 'Программирование',
    category_id: 'programming',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    duration: 56, // 8 недель в днях
    lessons: 40,
    students: 2150,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    createdAt: '2022-12-05T09:30:00',
    updatedAt: '2023-03-10T11:20:00',
    status: CourseStatus.PUBLISHED
  },
  {
    id: '12',
    title: 'Анализ данных с Python',
    description: 'Курс по анализу данных с использованием Python. Pandas, NumPy, Matplotlib, Seaborn и практические кейсы анализа реальных данных.',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1000',
    author: 'Екатерина Белова',
    authorAvatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    rating: 4.9,
    reviewCount: 89,
    price: 3600,
    level: CourseLevel.INTERMEDIATE,
    category: 'Data Science',
    category_id: 'data-science',
    tags: ['Python', 'Data Analysis', 'Pandas'],
    duration: 42, // 6 недель в днях
    lessons: 24,
    students: 740,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    createdAt: '2023-01-25T09:40:00',
    updatedAt: '2023-03-30T14:20:00',
    status: CourseStatus.PUBLISHED
  }
]

// Определение хранилища
export const useCoursesStore = defineStore('courses', {
  state: (): CoursesState => ({
    courses: [],
    featuredCourses: [],
    popularCourses: [],
    newCourses: [],
    enrolledCourseIds: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getCourseById: (state) => (id: string) => {
      return state.courses.find(course => course.id === id)
    },
    
    getCoursesByCategory: (state) => (categoryId: string) => {
      return state.courses.filter(course => course.category_id === categoryId)
    },
    
    getCoursesByLevel: (state) => (level: CourseLevel) => {
      return state.courses.filter(course => course.level === level)
    },
    
    getCourseLevels: (state) => {
      const levels = new Set<CourseLevel>()
      state.courses.forEach(course => {
        if (course.level) {
          levels.add(course.level)
        }
      })
      return Array.from(levels)
    },
    
    getCourseCategories: (state) => {
      const categories = new Set<string>()
      state.courses.forEach(course => {
        if (course.category_id) {
          categories.add(course.category_id)
        }
      })
      return Array.from(categories)
    },
    
    // Проверка, записан ли пользователь на курс
    isEnrolled: (state) => (courseId: string) => {
      return state.enrolledCourseIds.includes(courseId)
    },
    
    // Получение всех курсов, на которые записан пользователь
    getEnrolledCourses: (state) => {
      return state.courses.filter(course => state.enrolledCourseIds.includes(course.id))
    }
  },
  
  actions: {
    // Загрузка всех курсов
    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        // В реальном приложении здесь был бы API-запрос
        // const response = await api.courses.getCourses()
        // this.courses = response.data
        
        // Используем моковые данные
        this.courses = [...mockCourses]
        
        // Фильтрация курсов по категориям
        this.featuredCourses = mockCourses.filter(course => course.isFeatured) as Course[]
        this.popularCourses = mockCourses.filter(course => course.isPopular) as Course[]
        this.newCourses = mockCourses.filter(course => course.isNew) as Course[]
        
        return this.courses
      } catch (error: any) {
        this.error = error.message || 'Ошибка при загрузке курсов'
        throw error
    } finally {
        this.loading = false
      }
    },
    
    // Загрузка одного курса по ID
    async fetchCourse(id: string) {
      this.loading = true
      this.error = null
      
      try {
        // В реальном приложении здесь был бы API-запрос
        // const response = await api.courses.getCourse(id)
        // return response.data
        
        // Используем моковые данные
        const course = mockCourses.find(c => c.id === id)
        
        if (!course) {
          throw new Error('Курс не найден')
        }
        
        return course
      } catch (error: any) {
        this.error = error.message || 'Ошибка при загрузке курса'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Запись на курс
    async enrollCourse(courseId: string) {
      this.loading = true
      this.error = null
      
      try {
        // Проверяем, существует ли курс
        const course = this.courses.find(c => c.id === courseId)
        if (!course) {
          throw new Error('Курс не найден')
        }
        
        // Проверяем, не записан ли пользователь уже на этот курс
        if (this.enrolledCourseIds.includes(courseId)) {
          return { success: true, message: 'Вы уже записаны на этот курс' }
        }
        
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Добавляем курс в список записанных
        this.enrolledCourseIds.push(courseId)
        
        // Увеличиваем количество студентов на курсе
        if (course.students_count !== undefined) {
          course.students_count += 1
        }
        
        console.log(`Пользователь записан на курс: ${course.title}`)
        
        return { success: true, message: 'Вы успешно записались на курс' }
      } catch (error: any) {
        this.error = error.message || 'Ошибка при записи на курс'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Отмена записи на курс
    async unenrollCourse(courseId: string) {
      this.loading = true
      this.error = null
      
      try {
        // Проверяем, существует ли курс
        const course = this.courses.find(c => c.id === courseId)
        if (!course) {
          throw new Error('Курс не найден')
        }
        
        // Проверяем, записан ли пользователь на этот курс
        if (!this.enrolledCourseIds.includes(courseId)) {
          return { success: false, message: 'Вы не записаны на этот курс' }
        }
        
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Удаляем курс из списка записанных
        this.enrolledCourseIds = this.enrolledCourseIds.filter(id => id !== courseId)
        
        // Уменьшаем количество студентов на курсе
        if (course.students_count !== undefined && course.students_count > 0) {
          course.students_count -= 1
        }
        
        console.log(`Пользователь отписался от курса: ${course.title}`)
        
        return { success: true, message: 'Вы успешно отписались от курса' }
      } catch (error: any) {
        this.error = error.message || 'Ошибка при отмене записи на курс'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Загрузка курсов на модерации
    async getPendingCourses() {
      this.loading = true
      this.error = null
      
      try {
        // В реальном приложении здесь был бы API-запрос
        // const response = await api.courses.getPendingCourses()
        // return response.data
        
        // Используем моковые данные для курсов на модерации
        const pendingCourses = [
          {
            id: '101',
            title: 'Основы SQL',
            description: 'Введение в работу с реляционными базами данных и SQL. Курс охватывает основные запросы SELECT, INSERT, UPDATE, DELETE, а также базовые принципы проектирования баз данных.',
            thumbnail: 'https://via.placeholder.com/300x200/526D82/FFFFFF?text=SQL',
            price: 2800,
            level: CourseLevel.BEGINNER,
            duration: 28,
            status: CourseStatus.PENDING,
            created_at: '2023-04-05T10:00:00',
            category_id: '3'
          },
          {
            id: '102',
            title: 'DevOps практики',
            description: 'Практический курс по внедрению DevOps практик в разработку. Изучение CI/CD, контейнеризации с Docker, оркестрации с Kubernetes и мониторинга.',
            thumbnail: 'https://via.placeholder.com/300x200/61677A/FFFFFF?text=DevOps',
            price: 4500,
            level: CourseLevel.INTERMEDIATE,
            duration: 42,
            status: CourseStatus.PENDING,
            created_at: '2023-03-25T09:30:00',
            category_id: '4'
          },
          {
            id: '103',
            title: 'Глубокое обучение',
            description: 'Продвинутый курс по глубокому обучению с использованием TensorFlow и PyTorch. Нейронные сети, CNN, RNN, трансформеры и практические проекты.',
            thumbnail: 'https://via.placeholder.com/300x200/27374D/FFFFFF?text=DL',
            price: 5200,
            level: CourseLevel.ADVANCED,
            duration: 56,
            status: CourseStatus.PENDING,
            created_at: '2023-04-12T14:45:00',
            category_id: '2'
          }
        ]
        
        return pendingCourses
      } catch (error: any) {
        this.error = error.message || 'Ошибка при загрузке курсов на модерации'
        throw error
    } finally {
        this.loading = false
      }
    },
    
    // Метод для покупки курса (обертка вокруг enrollCourse для совместимости с API)
    async purchaseCourse(courseId: string) {
      return this.enrollCourse(courseId)
    }
  }
}) 