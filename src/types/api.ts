export interface User {
  id: string
  email: string
  role: 'student' | 'author' | 'admin'
}

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserCreate {
  email: string
  password: string
  role: 'student' | 'author' | 'admin'
}

export interface VerificationRequest {
  email: string
  code: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  email: string
  code: string
  new_password: string
}

export interface RefreshInput {
  refresh_token: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  duration: number
  level: string
  rating: number
  students_count: number
  category_id: string
  created_by: string
  status: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  course_id: string
  order_num: number
  requires_test: boolean
  completed: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar: string
  role: string
  total_xp: number
  settings: Record<string, any>
}

export interface CourseProgress {
  course_id: string
  completed_lessons: number
  total_lessons: number
  percentage: number
  xp_earned: number
  completed_at: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface PaginationQuery {
  page?: number
  limit?: number
} 