import { BaseApiService } from '../base';
import type { ApiResponse } from '../types';
import type { Course, CourseStructure, Lesson, TestResponse } from '../types';

/**
 * Сервис для работы с курсами
 */
export class CoursesService extends BaseApiService {
  /**
   * Получить список всех курсов
   */
  async getCourses(params?: { page?: number; limit?: number }): Promise<ApiResponse<Course[]>> {
    return this.get<Course[]>('/courses', { params });
  }

  /**
   * Получить список курсов по категории
   */
  async getCoursesByCategory(categoryId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<Course[]>> {
    return this.get<Course[]>(`/courses/category/${categoryId}`, { params });
  }

  /**
   * Получить информацию о курсе по ID
   */
  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.get<Course>(`/courses/${id}`);
  }

  /**
   * Получить уроки курса
   */
  async getCourseLessons(courseId: string): Promise<ApiResponse<Lesson[]>> {
    return this.get<Lesson[]>(`/student/courses/${courseId}/lessons`);
  }

  /**
   * Получить структуру курса с уроками и прогрессом
   */
  async getCourseStructure(courseId: string): Promise<ApiResponse<CourseStructure>> {
    return this.get<CourseStructure>(`/student/courses/${courseId}/structure`);
  }

  /**
   * Получить урок
   */
  async getLesson(lessonId: string): Promise<ApiResponse<Lesson>> {
    return this.get<Lesson>(`/student/lessons/${lessonId}`);
  }

  /**
   * Получить тест урока
   */
  async getLessonTest(lessonId: string): Promise<ApiResponse<TestResponse>> {
    return this.get<TestResponse>(`/student/lessons/${lessonId}/test`);
  }

  /**
   * Купить курс
   */
  async purchaseCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.post<any>('/student/courses/purchase', { course_id: courseId });
  }

  /**
   * Отметить урок как просмотренный
   */
  async markLessonViewed(lessonId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/progress/lessons/${lessonId}/view`, {});
  }

  /**
   * Отправить ответы на тест
   */
  async submitTestAnswers(lessonId: string, answers: Record<string, number>): Promise<ApiResponse<any>> {
    return this.post<any>(`/progress/lessons/${lessonId}/test`, answers);
  }

  // Методы для администраторов
  
  /**
   * Создать новый курс
   */
  async createCourse(course: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.post<Course>('/admin/courses', course);
  }

  /**
   * Обновить существующий курс
   */
  async updateCourse(id: string, course: Partial<Course>): Promise<ApiResponse<Course>> {
    return this.put<Course>(`/admin/courses/${id}`, course);
  }

  /**
   * Удалить курс
   */
  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/courses/${id}`);
  }

  /**
   * Получить список курсов, ожидающих модерации
   */
  async getPendingCourses(params?: { page?: number; limit?: number }): Promise<ApiResponse<Course[]>> {
    return this.get<Course[]>('/admin/courses/pending', { params });
  }

  /**
   * Одобрить курс
   */
  async approveCourse(id: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/admin/courses/${id}/approve`, {});
  }

  /**
   * Отклонить курс
   */
  async rejectCourse(id: string, reason: string): Promise<ApiResponse<any>> {
    return this.post<any>(`/admin/courses/${id}/reject`, { reason });
  }
} 