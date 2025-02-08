export const COURSE_GRADIENTS = {
  VUE: 'from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500',
  REACT: 'from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500',
  DESIGN: 'from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500',
  MARKETING: 'from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500',
  DOCKER: 'from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500',
  DEFAULT: 'from-gray-400 to-slate-400 hover:from-gray-500 hover:to-slate-500',
  JAVASCRIPT: 'from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500',
  PYTHON: 'from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500',
  TYPESCRIPT: 'from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500',
  CSS: 'from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500',
  GIT: 'from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500',
  NODE: 'from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500'
} as const

export type CourseGradient = typeof COURSE_GRADIENTS[keyof typeof COURSE_GRADIENTS] 