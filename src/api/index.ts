import { CourseService } from './services/courses'
import { CategoryService } from './services/categories'
import { ProfileService } from './services/profile'
import { AuthService } from './services/auth'

class API {
  courses = new CourseService()
  categories = new CategoryService()
  profile = new ProfileService()
  auth = new AuthService()

  setToken(token: string) {
    this.courses.setToken(token)
    this.categories.setToken(token)
    this.profile.setToken(token)
    this.auth.setToken(token)
  }

  clearToken() {
    this.courses.clearToken()
    this.categories.clearToken()
    this.profile.clearToken()
    this.auth.clearToken()
  }
}

export const api = new API()

// Экспортируем типы
export * from './types'

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