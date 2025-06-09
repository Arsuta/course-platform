// Базовые URL для разных API-сервисов
export const API_BASE_URL = '/api/v1';               // Общий базовый URL
export const AUTH_API_BASE_URL = '/api/v1/auth';     // Базовый URL для аутентификации
export const EDU_API_BASE_URL = '/api/v1/edu';       // Базовый URL для образовательной платформы
export const GAME_API_BASE_URL = '/api/v1/game';     // Базовый URL для игровой платформы

// Таймауты
export const DEFAULT_API_TIMEOUT = 30000; // 30 секунд

// Коды ошибок
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Настройки аутентификации
export const AUTH_STORAGE_KEY = 'auth_data';
export const TOKEN_REFRESH_INTERVAL = 60000 * 15; // 15 минут

// Названия роутов в зависимости от роли пользователя
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER: 'teacher',
  GUEST: 'guest'
};

// Статусы курсов
export const COURSE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected'
};

// Уровни сложности курсов
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Аутентификация (согласно документации API - /api/v1/auth)
// Все пути относительные (без /api/v1/auth)
export const API_AUTH = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_LOGIN: '/verify-login',
  RESET_PASSWORD_REQUEST: '/reset-password/request',
  RESET_PASSWORD_CONFIRM: '/reset-password/confirm',
  REFRESH: '/refresh',
  OAUTH_GOOGLE: '/oauth/google',
  CHANGE_PASSWORD: '/change-password'
};

// Образовательная платформа (/api/v1/edu)
// Курсы - относительные пути для EDU API
export const API_COURSES = {
  BASE: '/courses',
  SEARCH: '/courses/search',
  DETAILS: (id: string) => `/courses/${id}`,
  BY_CATEGORY: (categoryId: string) => `/courses/category/${categoryId}`,
  PURCHASE: '/student/courses/purchase',
  STRUCTURE: (courseId: string) => `/student/courses/${courseId}/structure`,
  LESSONS: (courseId: string) => `/student/courses/${courseId}/lessons`,
};

// Уроки - относительные пути для EDU API
export const API_LESSONS = {
  DETAILS: (lessonId: string) => `/student/lessons/${lessonId}`,
  TEST: (lessonId: string) => `/student/lessons/${lessonId}/test`,
  VIEW: (lessonId: string) => `/progress/lessons/${lessonId}/view`,
  SUBMIT_TEST: (lessonId: string) => `/progress/lessons/${lessonId}/test`
};

// Администратор - относительные пути для EDU API
export const API_ADMIN = {
  COURSES: '/admin/courses',
  COURSE_DETAILS: (id: string) => `/admin/courses/${id}`,
  PENDING_COURSES: '/admin/courses/pending',
  APPROVE_COURSE: (id: string) => `/admin/courses/${id}/approve`,
  REJECT_COURSE: (id: string) => `/admin/courses/${id}/reject`
};

// Категории - относительные пути для EDU API
export const API_CATEGORIES = {
  LIST: '/categories',
  DETAILS: (id: string) => `/categories/${id}`
};

// Профиль пользователя - относительные пути для EDU API
export const API_PROFILE = {
  DETAILS: '/profile',
  UPDATE: '/profile',
  COURSES: '/profile/courses',
  XP: '/profile/xp'
};

// Прогресс обучения - относительные пути для EDU API
export const API_PROGRESS = {
  COURSE: (courseId: string) => `/progress/courses/${courseId}`
};

// Игровая платформа (/api/v1/game)
// Кликер - относительные пути для GAME API
export const API_CLICKER = {
  CLICKS: '/clicker/clicks',
  LEADERBOARD: '/clicker/leaderboard',
  STATS: '/clicker/stats'
};

// Объединение всех эндпоинтов
export const ENDPOINTS = {
  AUTH: API_AUTH,
  PROFILE: API_PROFILE,
  COURSES: API_COURSES,
  CATEGORIES: API_CATEGORIES,
  PROGRESS: API_PROGRESS,
  LESSONS: API_LESSONS,
  ADMIN: API_ADMIN
}; 