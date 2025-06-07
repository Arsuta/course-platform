import { BaseApiService } from '../base';
import type { ApiResponse, Lesson, TestResponse } from '../types';

/**
 * Сервис для работы с уроками
 */
export class LessonsService extends BaseApiService {
  /**
   * Получить урок по ID
   */
  async getLesson(lessonId: string): Promise<ApiResponse<Lesson>> {
    return this.get<Lesson>(`/student/lessons/${lessonId}`);
  }

  /**
   * Получить тест для урока
   */
  async getLessonTest(lessonId: string): Promise<ApiResponse<TestResponse>> {
    return this.get<TestResponse>(`/student/lessons/${lessonId}/test`);
  }
} 