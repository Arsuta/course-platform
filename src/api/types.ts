// Общие типы для API

// Общий формат ответа API
export interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  errors?: string[];
}

// Тип для ошибок API
export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

// Пагинация
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

// Запрос с пагинацией
export interface PaginationQuery {
  page?: number;
  per_page?: number;
}

// Типы для аутентификации по обновленной документации
export interface UserLogin {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  password: string;
}

export interface VerificationRequest {
  code: string;
  email: string;
  verification_id?: string;
}

export interface LoginVerificationRequest {
  code: string;
  email: string;
  verification_id?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  code: string;
  email: string;
  new_password: string;
}

export interface RefreshInput {
  refresh_token: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

// Профиль пользователя
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  settings?: Record<string, any>;
  total_xp?: number;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

// Курсы
export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  duration?: number;
  level?: CourseLevel;
  rating?: number;
  students_count?: number;
  status?: CourseStatus;
  category_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  course_id: string;
  order_num: number;
  has_test?: boolean;
  requires_test?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Поля для отображения прогресса
  completed?: boolean;
  viewed_at?: string;
  passed_test?: boolean;
  test_score?: number;
}

export interface Test {
  id: string;
  lesson_id: string;
  passing_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface TestResponse {
  test: Test;
  questions: Question[];
  passing_score: number;
  passed?: boolean;
  last_score?: number;
  attempts_count?: number;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  created_at?: string;
  updated_at?: string;
}

// Прогресс
export interface CourseProgress {
  course_id: string;
  percentage: number;
  completed_lessons: number;
  total_lessons: number;
  xp_earned: number;
  completed_at?: string;
}

export interface CourseStructure {
  course: Course;
  lessons: Lesson[];
  progress: number;
  completed_lessons: number;
  total_lessons: number;
}

// Запрос на покупку курса
export interface PurchaseCourseRequest {
  course_id: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

// Игровой API
export interface ClickRequest {
  click_count: number;
  client_timestamp: number;
  session_time: number;
}

export interface ClickResponse {
  status: string;
  total_clicks: number;
}

export interface ClickerStats {
  id: string;
  user_id: string;
  total_clicks: number;
  clicks_per_second: number;
  last_click_time: string;
  last_save_time: string;
  last_save_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClickerSession {
  id: string;
  user_id: string;
  click_count: number;
  start_time: string;
  end_time: string;
  average_cps: number;
  max_cps: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  score: number;
  rank: number;
  updated_at: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  user_rank: LeaderboardEntry | null;
}

export interface StatsResponse {
  stats: ClickerStats;
  recent_sessions: ClickerSession[];
} 