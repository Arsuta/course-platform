export type CourseGradient = 
  | 'from-green-400 to-green-600'
  | 'from-blue-400 to-blue-600'
  | 'from-red-400 to-red-600'
  | 'from-yellow-400 to-yellow-600'
  | 'from-purple-400 to-purple-600'
  | 'from-pink-400 to-pink-600'
  | 'from-indigo-400 to-indigo-600'
  | 'from-emerald-400 to-emerald-600'
  | 'from-cyan-400 to-cyan-600'
  | 'from-orange-400 to-orange-600'
  | 'from-amber-400 to-amber-600'
  | 'from-violet-400 to-violet-600'
  | 'from-rose-400 to-rose-600'
  | 'from-gray-400 to-gray-600'
  | 'from-slate-400 to-slate-600'

export const COURSE_GRADIENTS: CourseGradient[] = [
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-red-400 to-red-600',
  'from-yellow-400 to-yellow-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-emerald-400 to-emerald-600',
  'from-cyan-400 to-cyan-600',
  'from-orange-400 to-orange-600',
  'from-amber-400 to-amber-600',
  'from-violet-400 to-violet-600',
  'from-rose-400 to-rose-600',
  'from-gray-400 to-gray-600',
  'from-slate-400 to-slate-600'
]

// Маппинг категорий на градиенты
export const CATEGORY_GRADIENTS: Record<string, CourseGradient> = {
  'programming': 'from-green-400 to-green-600',
  'design': 'from-purple-400 to-purple-600',
  'marketing': 'from-yellow-400 to-yellow-600',
  'devops': 'from-cyan-400 to-cyan-600',
  'default': 'from-gray-400 to-gray-600'
} 