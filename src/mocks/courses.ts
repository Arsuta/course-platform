import { Author, Course, Module, Lesson } from '@/types/course'

export const authors: Author[] = [
  {
    id: 1,
    name: 'Иван Петров',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan&backgroundColor=65c9ff',
    description: 'Senior Frontend Developer с 8-летним опытом разработки. Специализируется на Vue.js и TypeScript.'
  },
  {
    id: 2,
    name: 'Мария Сидорова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=ffafcc',
    description: 'UI/UX дизайнер и Frontend разработчик. Эксперт по CSS анимациям и современному дизайну.'
  },
  {
    id: 3,
    name: 'Алексей Кузнецов',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=9bf6ff',
    description: 'DevOps инженер и специалист по контейнеризации. Опыт работы с Docker и Kubernetes.'
  }
]

const createLesson = (id: number, order: number): Lesson => ({
  id,
  title: `Урок ${order}`,
  content: 'Содержание урока...',
  duration: 30,
  type: 'video',
  videoUrl: `https://example.com/video${id}`,
  order,
  isCompleted: false
})

const createModule = (id: number, title: string, lessonsCount: number): Module => ({
  id,
  title,
  description: `Описание модуля "${title}"`,
  order: id,
  lessons: Array.from({ length: lessonsCount }, (_, i) => 
    createLesson(i + 1, i + 1)
  ),
  isCompleted: false
})

// Создадим константы для градиентов
const COURSE_GRADIENTS = {
  VUE: 'from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500',
  REACT: 'from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500',
  DESIGN: 'from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500',
  MARKETING: 'from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500',
  DOCKER: 'from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500',
  DEFAULT: 'from-gray-400 to-slate-400 hover:from-gray-500 hover:to-slate-500',
  JAVASCRIPT: 'from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
  PYTHON: 'from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500',
  TYPESCRIPT: 'from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500',
  CSS: 'from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500',
  GIT: 'from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500',
  NODE: 'from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500'
} as const

export const courses: Course[] = [
  {
    id: 1,
    title: 'Vue.js 3 с нуля до профессионала',
    description: 'Полное руководство по Vue.js 3 с Composition API и TypeScript',
    fullDescription: `# Vue.js 3 с нуля до профессионала

Этот курс проведет вас через все аспекты разработки на Vue.js 3:

- Основы Vue.js и реактивность
- Composition API
- TypeScript интеграция
- Маршрутизация и управление состоянием
- Тестирование и оптимизация
    `,
    category: 'programming',
    level: 'beginner',
    image: '/images/courses/vue-course.jpg',
    price: 12900,
    isFree: false,
    gradient: COURSE_GRADIENTS.VUE,
    rating: 4.8,
    studentsCount: 1250,
    duration: 2400, // 40 часов
    modules: [
      createModule(1, 'Введение в Vue.js 3', 5),
      createModule(2, 'Основы Vue.js', 8),
      createModule(3, 'Composition API', 6),
      createModule(4, 'TypeScript в Vue.js', 7),
      createModule(5, 'Продвинутые концепции', 6)
    ],
    author: authors[0],
    skills: [
      'Разработка на Vue.js 3',
      'Использование Composition API',
      'TypeScript в Vue.js',
      'Тестирование приложений',
      'Оптимизация производительности'
    ],
    requirements: [
      'Базовые знания JavaScript',
      'Понимание HTML и CSS',
      'Основы работы с Git'
    ],
    updatedAt: '2024-03-15T12:00:00Z',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'Продвинутые CSS анимации',
    description: 'Создавайте впечатляющие анимации с помощью современного CSS',
    fullDescription: `# Продвинутые CSS анимации

Научитесь создавать современные и эффективные анимации:

- CSS transforms и transitions
- Keyframe анимации
- SVG анимации
- CSS Custom Properties
- Performance оптимизация
    `,
    category: 'programming',
    level: 'intermediate',
    image: '/images/courses/css-animations.jpg',
    price: 9900,
    isFree: false,
    gradient: COURSE_GRADIENTS.CSS,
    rating: 4.9,
    studentsCount: 850,
    duration: 1800, // 30 часов
    modules: [
      createModule(1, 'Основы CSS анимаций', 4),
      createModule(2, 'Transforms и Transitions', 6),
      createModule(3, 'Keyframe анимации', 5),
      createModule(4, 'SVG анимации', 4),
      createModule(5, 'Оптимизация производительности', 3)
    ],
    author: authors[1],
    skills: [
      'Создание сложных CSS анимаций',
      'Работа с SVG анимациями',
      'Оптимизация производительности',
      'Современные техники анимации'
    ],
    requirements: [
      'Уверенное знание CSS',
      'Базовые знания JavaScript',
      'Понимание SVG'
    ],
    updatedAt: '2024-03-10T15:00:00Z',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 3,
    title: 'JavaScript для начинающих',
    description: 'Базовый курс по JavaScript для новичков',
    fullDescription: `# JavaScript для начинающих\n\nИзучите основы JavaScript с нуля`,
    category: 'programming',
    level: 'beginner',
    image: '/images/courses/js-basics.jpg',
    price: 0,
    isFree: true,
    gradient: COURSE_GRADIENTS.JAVASCRIPT,
    rating: 4.7,
    studentsCount: 2100,
    duration: 1500,
    modules: [
      createModule(1, 'Введение в JavaScript', 4),
      createModule(2, 'Основы синтаксиса', 5),
      createModule(3, 'Функции и объекты', 6)
    ],
    author: authors[0],
    skills: ['Основы JavaScript', 'Работа с DOM', 'Обработка событий'],
    requirements: ['Базовые знания HTML и CSS'],
    updatedAt: '2024-03-01T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 4,
    title: 'React для профессионалов',
    description: 'Продвинутый курс по React и Redux',
    fullDescription: `# React для профессионалов\n\nПродвинутые техники React разработки`,
    category: 'programming',
    level: 'advanced',
    image: '/images/courses/react-advanced.jpg',
    price: 15900,
    isFree: false,
    gradient: COURSE_GRADIENTS.REACT,
    rating: 4.9,
    studentsCount: 800,
    duration: 2100,
    modules: [
      createModule(1, 'Архитектура React приложений', 6),
      createModule(2, 'Redux и управление состоянием', 7),
      createModule(3, 'Оптимизация производительности', 5)
    ],
    author: authors[1],
    skills: ['React', 'Redux', 'Performance Optimization'],
    requirements: ['Опыт работы с React', 'JavaScript ES6+'],
    updatedAt: '2024-03-10T15:00:00Z',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 5,
    title: 'HTML и CSS основы',
    description: 'Базовый курс по веб-верстке',
    fullDescription: `# HTML и CSS основы\n\nНаучитесь создавать современные веб-страницы`,
    category: 'programming',
    level: 'beginner',
    image: '/images/courses/html-css.jpg',
    price: 0,
    isFree: true,
    gradient: COURSE_GRADIENTS.DEFAULT,
    rating: 4.6,
    studentsCount: 3000,
    duration: 1200,
    modules: [
      createModule(1, 'Основы HTML', 5),
      createModule(2, 'CSS стилизация', 6),
      createModule(3, 'Верстка макетов', 4)
    ],
    author: authors[1],
    skills: ['HTML5', 'CSS3', 'Responsive Design'],
    requirements: ['Нет предварительных требований'],
    updatedAt: '2024-02-20T10:00:00Z',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 6,
    title: 'TypeScript в действии',
    description: 'Практический курс по TypeScript',
    fullDescription: `# TypeScript в действии\n\nИзучите TypeScript на реальных проектах`,
    category: 'programming',
    level: 'intermediate',
    image: '/images/courses/typescript.jpg',
    price: 11900,
    isFree: false,
    gradient: COURSE_GRADIENTS.TYPESCRIPT,
    rating: 4.8,
    studentsCount: 950,
    duration: 1800,
    modules: [
      createModule(1, 'Основы TypeScript', 5),
      createModule(2, 'Продвинутые типы', 6),
      createModule(3, 'Практические примеры', 5)
    ],
    author: authors[0],
    skills: ['TypeScript', 'ООП', 'Типизация'],
    requirements: ['JavaScript ES6+'],
    updatedAt: '2024-03-05T14:00:00Z',
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 7,
    title: 'Git для разработчиков',
    description: 'Основы системы контроля версий',
    fullDescription: `# Git для разработчиков\n\nИзучите Git с нуля`,
    category: 'programming',
    level: 'beginner',
    image: '/images/courses/git.jpg',
    price: 0,
    isFree: true,
    gradient: COURSE_GRADIENTS.GIT,
    rating: 4.7,
    studentsCount: 1500,
    duration: 900,
    modules: [
      createModule(1, 'Основы Git', 4),
      createModule(2, 'Ветвление', 3),
      createModule(3, 'Командная работа', 3)
    ],
    author: authors[0],
    skills: ['Git', 'GitHub', 'Командная работа'],
    requirements: ['Базовые навыки работы с компьютером'],
    updatedAt: '2024-02-15T11:00:00Z',
    createdAt: '2024-01-20T09:00:00Z'
  },
  {
    id: 8,
    title: 'Node.js разработка',
    description: 'Серверная разработка на Node.js',
    fullDescription: `# Node.js разработка\n\nСоздавайте современные веб-приложения`,
    category: 'programming',
    level: 'intermediate',
    image: '/images/courses/nodejs.jpg',
    price: 13900,
    isFree: false,
    gradient: COURSE_GRADIENTS.NODE,
    rating: 4.8,
    studentsCount: 750,
    duration: 2400,
    modules: [
      createModule(1, 'Основы Node.js', 6),
      createModule(2, 'Express.js', 5),
      createModule(3, 'База данных', 5)
    ],
    author: authors[1],
    skills: ['Node.js', 'Express.js', 'MongoDB'],
    requirements: ['JavaScript', 'Основы бэкенда'],
    updatedAt: '2024-03-08T13:00:00Z',
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 9,
    title: 'Python для начинающих',
    description: 'Введение в программирование на Python',
    fullDescription: `# Python для начинающих\n\nНачните программировать на Python`,
    category: 'programming',
    level: 'beginner',
    image: '/images/courses/python.jpg',
    price: 0,
    isFree: true,
    gradient: COURSE_GRADIENTS.PYTHON,
    rating: 4.6,
    studentsCount: 2200,
    duration: 1500,
    modules: [
      createModule(1, 'Основы Python', 5),
      createModule(2, 'Структуры данных', 4),
      createModule(3, 'Функции', 4)
    ],
    author: authors[0],
    skills: ['Python', 'Алгоритмы', 'ООП'],
    requirements: ['Нет предварительных требований'],
    updatedAt: '2024-02-25T12:00:00Z',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 10,
    title: 'Docker для разработчиков',
    description: 'Контейнеризация приложений с Docker',
    fullDescription: `# Docker для разработчиков\n\nИзучите основы контейнеризации`,
    category: 'programming',
    level: 'intermediate',
    image: '/images/courses/docker.jpg',
    price: 0,
    isFree: true,
    gradient: COURSE_GRADIENTS.DOCKER,
    rating: 4.7,
    studentsCount: 600,
    duration: 1200,
    modules: [
      createModule(1, 'Основы Docker', 4),
      createModule(2, 'Docker Compose', 3),
      createModule(3, 'Оркестрация', 3)
    ],
    author: authors[1],
    skills: ['Docker', 'Контейнеризация', 'DevOps'],
    requirements: ['Основы командной строки'],
    updatedAt: '2024-03-01T14:00:00Z',
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 11,
    title: 'React Native разработка',
    description: 'Создание мобильных приложений с React Native',
    fullDescription: `# React Native разработка

Научитесь создавать кроссплатформенные мобильные приложения:

- Основы React Native
- Навигация и управление состоянием
- Работа с нативными модулями
- Публикация в App Store и Google Play`,
    category: 'programming',
    level: 'intermediate',
    image: '/images/courses/react-native.jpg',
    price: 14900,
    isFree: false,
    gradient: COURSE_GRADIENTS.REACT,
    rating: 4.8,
    studentsCount: 850,
    duration: 2100,
    modules: [
      createModule(1, 'Введение в React Native', 5),
      createModule(2, 'Компоненты и стили', 6),
      createModule(3, 'Навигация', 4),
      createModule(4, 'Работа с API', 5)
    ],
    author: authors[0],
    skills: ['React Native', 'JavaScript', 'Mobile Development'],
    requirements: ['React.js', 'JavaScript ES6+'],
    updatedAt: '2024-03-10T15:00:00Z',
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 12,
    title: 'Figma для дизайнеров',
    description: 'Профессиональный UI/UX дизайн в Figma',
    fullDescription: `# Figma для дизайнеров

Освойте современный инструмент дизайна:

- Интерфейс и основные инструменты
- Компоненты и автолейаут
- Прототипирование
- Совместная работа и библиотеки`,
    category: 'design',
    level: 'beginner',
    image: '/images/courses/figma.jpg',
    price: 9900,
    isFree: false,
    gradient: COURSE_GRADIENTS.DESIGN,
    rating: 4.9,
    studentsCount: 1200,
    duration: 1800,
    modules: [
      createModule(1, 'Основы Figma', 6),
      createModule(2, 'Компоненты', 5),
      createModule(3, 'Прототипирование', 4)
    ],
    author: authors[1],
    skills: ['Figma', 'UI Design', 'Прототипирование'],
    requirements: ['Базовые знания дизайна'],
    updatedAt: '2024-03-12T10:00:00Z',
    createdAt: '2024-02-15T09:00:00Z'
  },
  {
    id: 13,
    title: 'Основы маркетинга',
    description: 'Базовый курс по digital-маркетингу',
    fullDescription: `# Основы маркетинга

Изучите ключевые аспекты современного маркетинга:

- Стратегия и планирование
- Анализ рынка
- Digital-каналы
- Метрики и аналитика`,
    category: 'marketing',
    level: 'beginner',
    image: '/images/courses/marketing.jpg',
    price: 11900,
    isFree: false,
    gradient: COURSE_GRADIENTS.MARKETING,
    rating: 4.7,
    studentsCount: 950,
    duration: 1500,
    modules: [
      createModule(1, 'Введение в маркетинг', 4),
      createModule(2, 'Digital-каналы', 5),
      createModule(3, 'Аналитика', 4)
    ],
    author: authors[2],
    skills: ['Маркетинг', 'Аналитика', 'SMM'],
    requirements: ['Нет требований'],
    updatedAt: '2024-03-05T11:00:00Z',
    createdAt: '2024-02-20T09:00:00Z'
  }
]

export const courseProgress = {
  1: {
    courseId: 1,
    userId: 1,
    progress: 35,
    completedLessons: [1, 2, 3, 4, 5],
    lastViewedLesson: 6,
    startedAt: '2024-02-15T10:00:00Z',
    lastAccessAt: '2024-03-15T14:30:00Z'
  }
} 