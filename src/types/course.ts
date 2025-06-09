import type { CourseGradient as GradientType } from '@/constants/gradients'
import type { CourseCategory as _CourseCategory, CourseLevel } from '@/constants/course'
import type { Course as ApiCourse } from '@/api/types'

export type CourseGradient = GradientType
export type CourseCategory = _CourseCategory

export interface Author {
  id: number
  name: string
  avatar: string
  description?: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  course_id: string
  order_num: number
  has_test: boolean
  requires_test: boolean
  completed: boolean
  passed_test: boolean
  test_score: number
  viewed_at: string | null
  created_at: string
  updated_at: string
  isCompleted?: boolean
  videoUrl?: string
  duration?: number
  order?: number
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
  isCompleted?: boolean
}

export type CategoryId = 
  | 'programming' 
  | 'design' 
  | 'marketing' 
  | 'business' 
  | 'personal-development'
  | 'language'
  | 'data-science'
  | 'health'
  | 'other'

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: string
}

export interface Course {
  id: string
  title: string
  description?: string
  category_id: string
  level?: CourseLevel
  price: number
  thumbnail?: string
  duration?: number
  status?: string
  rating?: number
  author_id?: string
  created_at?: string
  updated_at?: string
}

export interface CourseFilters {
  category_id?: string
  level?: CourseLevel
  price_min?: number
  price_max?: number
  rating_min?: number
  search?: string
  page?: number
  limit?: number
}

export interface CoursesResponse {
  courses: Course[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CourseResponse {
  data: Course[]
  total: number
  page: number
  pageSize: number
}

export interface CourseStructure {
  course: Course
  lessons: Lesson[]
  completed_lessons: number
  total_lessons: number
  progress: number
}

export interface Test {
  id: string
  lesson_id: string
  passing_score: number
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  test_id: string
  question_text: string
  options: string[]
  correct_answer: number
  created_at: string
  updated_at: string
}

export interface TestResponse {
  test: Test
  questions: Question[]
  passing_score: number
  attempts_count: number
  last_score: number
  passed: boolean
}

export interface CourseProgress {
  course_id: string
  completed_lessons: number
  total_lessons: number
  percentage: number
  xp_earned: number
  completed_at: string | null
  progress?: number
  lastAccessAt?: string
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

export interface ExtendedCourse extends ApiCourse {
  image?: string;
  authorAvatar?: string;
  author?: string;
  lessons?: number;
  students?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  reviewCount?: number;
  category?: string;
  tags?: string[];
}
