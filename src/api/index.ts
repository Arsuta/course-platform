// Экспортируем типы
export * from './types'

// Экспортируем сервисы
export * from './services'

// Экспортируем базовые классы
export * from './base'

// Экспортируем константы
export * from './constants'

// Экспортируем клиент
export * from './client'

// Импортируем все сервисы
import { AuthService } from './services/auth'
import { CoursesService } from './services/courses'
import { ProfileService } from './services/profile'
import { CategoriesService } from './services/categories'
import { ProgressService } from './services/progress'
import { GameService } from './services/game'
import { LessonsService } from './services/lessons'

// Создаем и экспортируем единый объект API
export const api = {
  auth: new AuthService(),
  courses: new CoursesService(),
  profile: new ProfileService(),
  categories: new CategoriesService(),
  progress: new ProgressService(),
  game: new GameService(),
  lessons: new LessonsService()
}

// Сервисы для API (будут созданы позже)
// export * from './services/auth';
// export * from './services/courses';
// export * from './services/profile';
// export * from './services/categories';
// export * from './services/progress'; 