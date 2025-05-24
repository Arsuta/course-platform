// Базовые типы
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Категории
export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Курсы
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  rating: number;
  thumbnail: string;
  category_id: string;
  created_by: string;
  status: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

// Уроки
export interface Lesson {
  id: string;
  title: string;
  content: string;
  course_id: string;
  order_num: number;
  requires_test: boolean;
  has_test: boolean;
  completed: boolean;
  passed_test: boolean;
  test_score: number;
  viewed_at: string;
  created_at: string;
  updated_at: string;
}

// Тесты
export interface Test {
  id: string;
  lesson_id: string;
  passing_score: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export interface TestResponse {
  id: string;
  lesson_id: string;
  questions: Question[];
  passing_score: number;
  passed?: boolean;
  score?: number;
  submitted_at?: string;
}

// Профиль пользователя
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
  total_xp: number;
  settings: Record<string, any>;
}

// Прогресс
export interface CourseProgress {
  course_id: string;
  percentage: number;
  completed_lessons: number;
  total_lessons: number;
  xp_earned: number;
  completed_at?: string;
  last_activity_at: string;
}

// Запросы
export interface PurchaseCourseRequest {
  course_id: string;
}

// Ответы API
export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}

// Пагинация
export interface PaginationQuery {
  page?: number;
  per_page?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Авторизация
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

// Пользователь
export interface User {
  id: string;
  email: string;
  role: 'student' | 'author' | 'admin';
  first_name: string;
  last_name: string;
  avatar: string;
  name?: string; // Полное имя (first_name + last_name)
}

export interface CourseStructure {
  course: Course;
  lessons: Lesson[];
  completed_lessons: number;
  total_lessons: number;
  progress: number;
} 