import { BaseAPI, APIResponse } from '../base'
import { PROGRESS } from '../endpoints'
import type { TestResponse } from '../types'

export class TestService extends BaseAPI {
  // Получить тест для урока
  async getLessonTest(lessonId: string): Promise<APIResponse<TestResponse>> {
    return this.get(`/student/lessons/${lessonId}/test`)
  }

  // Отправить ответы на тест
  async submitTestAnswers(lessonId: string, answers: Record<string, number>): Promise<APIResponse<TestResponse>> {
    return this.post(PROGRESS.LESSON_TEST(lessonId), { answers })
  }
} 