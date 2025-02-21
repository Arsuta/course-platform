import type { CourseGradient } from '@/constants/gradients'

export interface Author {
  id: number
  name: string
  avatar: string
  description?: string
}

export interface Lesson {
  id: number
  title: string
  content: string
  duration: number
  type: 'video' | 'text' | 'quiz'
  videoUrl?: string
  order: number
  isCompleted?: boolean
}

export interface Module {
  id: number
  title: string
  description: string
  order: number
  lessons: Lesson[]
  isCompleted?: boolean
}

export interface Course {
  id: number
  title: string
  description: string
  fullDescription?: string
  category: 'programming' | 'design' | 'marketing' | 'business'
  level: 'beginner' | 'intermediate' | 'advanced'
  image: string
  price: number
  isFree: boolean
  rating: number
  studentsCount: number
  duration: number // общая продолжительность в минутах
  modules: Module[]
  author: Author
  skills: string[] // навыки, которые получит студент
  requirements: string[] // требования к студенту
  isEnrolled?: boolean
  progress?: number // процент прохождения курса
  updatedAt: string
  createdAt: string
  gradient: CourseGradient
}

export interface CourseResponse {
  data: Course[]
  total: number
  page: number
  pageSize: number
}

export interface CourseProgress {
  courseId: number
  userId: number
  progress: number
  completedLessons: number[]
  lastViewedLesson?: number
  startedAt: string
  lastAccessAt: string
}
