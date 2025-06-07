import type { CategoryId } from '@/types/course'

export const COURSE_CONSTANTS = {
  AUTOPLAY_DELAY: 8000,
  LEVELS: {
    ALL: 'all',
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  },
  CATEGORIES: {
    ALL: 'all',
    PROGRAMMING: 'programming',
    DESIGN: 'design',
    MARKETING: 'marketing',
    BUSINESS: 'business'
  } as const,
  LEVEL_LABELS: {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  },
  CATEGORY_LABELS: {
    programming: 'Программирование',
    design: 'Дизайн',
    marketing: 'Маркетинг',
    business: 'Бизнес'
  } as const
} as const

export type CourseLevel = keyof typeof COURSE_CONSTANTS.LEVEL_LABELS
export type CourseCategory = CategoryId 