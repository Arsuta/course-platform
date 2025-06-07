import { AuthService } from './auth';
import { ProfileService } from './profile';
import { CoursesService } from './courses';
import { CategoriesService } from './categories';
import { ProgressService } from './progress';
import { LessonsService } from './lessons';

// Создаем экземпляры сервисов
export const authService = new AuthService();
export const profileService = new ProfileService();
export const coursesService = new CoursesService();
export const categoriesService = new CategoriesService();
export const progressService = new ProgressService();
export const lessonsService = new LessonsService();

// Экспортируем классы сервисов для возможности создания новых экземпляров
export { 
  AuthService, 
  ProfileService, 
  CoursesService, 
  CategoriesService, 
  ProgressService,
  LessonsService
}; 