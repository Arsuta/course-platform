import { BaseApiService } from '../base';
import type { ApiResponse, CourseProgress } from '../types';

/**
 * Сервис для работы с прогрессом обучения
 */
export class ProgressService extends BaseApiService {
  /**
   * Получить прогресс по курсу
   */
  async getCourseProgress(courseId: string): Promise<ApiResponse<CourseProgress>> {
    return this.get<CourseProgress>(`/progress/courses/${courseId}`);
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
} 