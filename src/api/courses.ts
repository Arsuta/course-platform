import { BaseAPI } from './base';
import type { Course, Lesson, CourseProgress, TestResponse } from './types';

export class CoursesAPI extends BaseAPI {
  // Публичные методы
  async getAllCourses(page?: number, limit?: number): Promise<Course[]> {
    const params = { page, limit };
    const { data } = await this.api.get('/courses', { params });
    return data;
  }

  async getCourseById(id: string): Promise<Course> {
    const { data } = await this.api.get(`/courses/${id}`);
    return data;
  }

  async getCoursesByCategory(categoryId: string, page?: number, limit?: number): Promise<Course[]> {
    const params = { page, limit };
    const { data } = await this.api.get(`/courses/category/${categoryId}`, { params });
    return data;
  }

  // Методы для студентов
  async purchaseCourse(courseId: string): Promise<any> {
    const { data } = await this.api.post('/student/courses/purchase', { course_id: courseId });
    return data;
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    const { data } = await this.api.get(`/student/courses/${courseId}/lessons`);
    return data;
  }

  async getCourseStructure(courseId: string): Promise<{
    course: Course;
    lessons: Lesson[];
    progress: number;
    completed_lessons: number;
    total_lessons: number;
  }> {
    const { data } = await this.api.get(`/student/courses/${courseId}/structure`);
    return data;
  }

  async getLesson(lessonId: string): Promise<Lesson> {
    const { data } = await this.api.get(`/student/lessons/${lessonId}`);
    return data;
  }

  async getLessonTest(lessonId: string): Promise<TestResponse> {
    const { data } = await this.api.get(`/student/lessons/${lessonId}/test`);
    return data;
  }

  // Методы для прогресса
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    const { data } = await this.api.get(`/progress/courses/${courseId}`);
    return data;
  }

  async markLessonViewed(lessonId: string): Promise<any> {
    const { data } = await this.api.post(`/progress/lessons/${lessonId}/view`);
    return data;
  }

  async submitTestAnswers(lessonId: string, answers: Record<string, number>): Promise<any> {
    const { data } = await this.api.post(`/progress/lessons/${lessonId}/test`, answers);
    return data;
  }

  // Методы для администраторов
  async createCourse(course: Partial<Course>): Promise<Course> {
    const { data } = await this.api.post('/admin/courses', course);
    return data;
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const { data } = await this.api.put(`/admin/courses/${id}`, course);
    return data;
  }

  async deleteCourse(id: string): Promise<void> {
    await this.api.delete(`/admin/courses/${id}`);
  }

  async getPendingCourses(page?: number, limit?: number): Promise<Course[]> {
    const params = { page, limit };
    const { data } = await this.api.get('/admin/courses/pending', { params });
    return data;
  }

  async approveCourse(id: string): Promise<any> {
    const { data } = await this.api.post(`/admin/courses/${id}/approve`);
    return data;
  }

  async rejectCourse(id: string, reason: string): Promise<any> {
    const { data } = await this.api.post(`/admin/courses/${id}/reject`, { reason });
    return data;
  }
} 