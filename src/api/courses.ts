import { BaseAPI, APIResponse } from './base';
import type { 
  Course, 
  Lesson, 
  CourseProgress, 
  TestResponse,
  PaginationQuery,
  PaginatedResponse,
  PurchaseCourseRequest 
} from './types';

export class CoursesAPI extends BaseAPI {
  // Публичные методы
  async getAllCourses(params?: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get('/courses', { params });
  }

  async getCourseById(id: string): Promise<APIResponse<Course>> {
    return this.get(`/courses/${id}`);
  }

  async getCoursesByCategory(categoryId: string, params?: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get(`/courses/category/${categoryId}`, { params });
  }

  // Методы для студентов
  async purchaseCourse(courseId: string): Promise<APIResponse<void>> {
    const data: PurchaseCourseRequest = { course_id: courseId };
    return this.post('/student/courses/purchase', data);
  }

  async getCourseLessons(courseId: string): Promise<APIResponse<Lesson[]>> {
    return this.get(`/student/courses/${courseId}/lessons`);
  }

  async getCourseStructure(courseId: string): Promise<APIResponse<{
    course: Course;
    lessons: Lesson[];
    progress: number;
    completed_lessons: number;
    total_lessons: number;
  }>> {
    return this.get(`/student/courses/${courseId}/structure`);
  }

  async getLesson(lessonId: string): Promise<APIResponse<Lesson>> {
    return this.get(`/student/lessons/${lessonId}`);
  }

  async getLessonTest(lessonId: string): Promise<APIResponse<TestResponse>> {
    return this.get(`/student/lessons/${lessonId}/test`);
  }

  // Методы для прогресса
  async getCourseProgress(courseId: string): Promise<APIResponse<CourseProgress>> {
    return this.get(`/progress/courses/${courseId}`);
  }

  async markLessonViewed(lessonId: string): Promise<APIResponse<void>> {
    return this.post(`/progress/lessons/${lessonId}/view`);
  }

  async submitTestAnswers(lessonId: string, answers: Record<string, number>): Promise<APIResponse<void>> {
    return this.post(`/progress/lessons/${lessonId}/test`, answers);
  }

  // Методы для администраторов
  async createCourse(course: Partial<Course>): Promise<APIResponse<Course>> {
    return this.post('/admin/courses', course);
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<APIResponse<Course>> {
    return this.put(`/admin/courses/${id}`, course);
  }

  async deleteCourse(id: string): Promise<APIResponse<void>> {
    return this.delete(`/admin/courses/${id}`);
  }

  async getPendingCourses(params?: PaginationQuery): Promise<APIResponse<PaginatedResponse<Course>>> {
    return this.get('/admin/courses/pending', { params });
  }

  async approveCourse(id: string): Promise<APIResponse<void>> {
    return this.post(`/admin/courses/${id}/approve`);
  }

  async rejectCourse(id: string, reason: string): Promise<APIResponse<void>> {
    return this.post(`/admin/courses/${id}/reject`, { reason });
  }
} 