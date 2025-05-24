// Auth endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  VERIFY: '/auth/verify',
  RESET_PASSWORD: '/auth/reset-password',
  RESET_PASSWORD_CONFIRM: '/auth/reset-password-confirm'
}

// Course endpoints
export const COURSES = {
  LIST: '/courses',
  DETAIL: (id: string) => `/courses/${id}`,
  PURCHASE: '/courses/purchase',
  CATEGORY: (id: string) => `/courses/category/${id}`,
  STRUCTURE: (courseId: string) => `/student/courses/${courseId}/structure`,
  LESSONS: (id: string) => `/courses/${id}/lessons`
}

// Category endpoints
export const CATEGORIES = {
  LIST: '/categories',
  DETAIL: (id: string) => `/categories/${id}`
}

// Profile endpoints
export const PROFILE = {
  ME: '/profile/me',
  UPDATE: '/profile/update',
  USER: (id: string) => `/users/${id}`,
  FOLLOW: (id: string) => `/users/${id}/follow`,
  UNFOLLOW: (id: string) => `/users/${id}/unfollow`,
  ADD_XP: '/profile/xp/add',
  GET: '/profile',
  COURSES: '/profile/courses',
  XP: '/profile/xp'
}

// Progress endpoints
export const PROGRESS = {
  COURSE: (courseId: string) => `/progress/courses/${courseId}`,
  LESSON_TEST: (lessonId: string) => `/progress/lessons/${lessonId}/test`
}

// Admin endpoints
export const ADMIN = {
  PENDING_COURSES: '/admin/courses/pending',
  COURSE: {
    CREATE: '/admin/courses',
    UPDATE: (id: string) => `/admin/courses/${id}`,
    DELETE: (id: string) => `/admin/courses/${id}`
  }
} 