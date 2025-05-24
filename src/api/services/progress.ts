import { BaseAPI, APIResponse } from '../base'
import { PROGRESS } from '../endpoints'
import type { CourseProgress } from '../types'

export class ProgressService extends BaseAPI {
  // Получить прогресс по курсу
  async getCourseProgress(courseId: string): Promise<APIResponse<CourseProgress>> {
    return this.get(PROGRESS.COURSE(courseId))
  }

  // Отметить урок как просмотренный
  async markLessonViewed(lessonId: string): Promise<APIResponse<void>> {
    return this.post(`/progress/lessons/${lessonId}/view`)
  }

  // Отметить урок как завершенный
  async markLessonCompleted(lessonId: string): Promise<APIResponse<void>> {
    return this.post(`/progress/lessons/${lessonId}/complete`)
  }
} 