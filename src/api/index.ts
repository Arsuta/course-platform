import { CoursesAPI } from './courses';
import { CategoriesAPI } from './categories';
import { ProfileAPI } from './profile';

export * from './types';

export const api = {
  courses: new CoursesAPI(),
  categories: new CategoriesAPI(),
  profile: new ProfileAPI(),
};

// Функция для установки токена авторизации для всех сервисов
export const setAuthToken = (token: string) => {
  api.courses.setToken(token);
  api.categories.setToken(token);
  api.profile.setToken(token);
};

// Функция для очистки токена авторизации
export const clearAuthToken = () => {
  api.courses.clearToken();
  api.categories.clearToken();
  api.profile.clearToken();
}; 