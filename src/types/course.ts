import type { CourseGradient as GradientType } from '@/constants/gradients'
import type { CourseCategory, CourseLevel } from '@/constants/course'

export type CourseGradient = GradientType

export interface Author {
  id: number
  name: string
  avatar: string
  description?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'text' | 'quiz'
  content: string
  order: number
  isCompleted?: boolean
  videoUrl?: string
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
  isCompleted?: boolean
}

export interface Course {
  id: string
  title: string
  description: string
  price: number
  duration: number
  level: CourseLevel
  rating: number
  thumbnail: string
  category_id: string
  category: CourseCategory
  created_by: string
  status: string
  students_count: number
  created_at: string
  updated_at: string
  image?: string
  gradient?: CourseGradient
  modules?: Module[]
  isEnrolled?: boolean
  author?: Author
  isFree?: boolean
  requirements?: string[]
  skills?: string[]
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

export interface PaginationQuery {
  page: number
  per_page: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface APIResponse<T> {
  data: T
  status: number
  message?: string
}
