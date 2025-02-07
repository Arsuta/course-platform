import { courseApi } from '@/api/course.ts'
import type { Course } from '@/types/course.ts'

export class CourseModel {
  static mockCourses: Course[] = [
    {
      id: 1,
      title: 'Основы Vue.js 3',
      description: 'Изучите основы современного фреймворка Vue.js 3 с нуля',
      category: 'programming',
      image: 'https://picsum.photos/600/400?random=1',
      price: 0,
      isFree: true,
      rating: 4.8,
      studentsCount: 1234,
      author: {
        id: 1,
        name: 'Иван Петров',
        avatar: 'https://picsum.photos/100/100?random=1'
      }
    },
    {
      id: 2,
      title: 'UI/UX Дизайн',
      description: 'Создавайте современные интерфейсы',
      category: 'design',
      image: 'https://picsum.photos/600/400?random=2',
      price: 3900,
      isFree: false,
      rating: 4.9,
      studentsCount: 856,
      author: {
        id: 2,
        name: 'Анна Сидорова',
        avatar: 'https://picsum.photos/100/100?random=2'
      }
    },
    {
      id: 3,
      title: 'Tailwind CSS Мастер-класс',
      description: 'Создавайте современные адаптивные интерфейсы с Tailwind CSS',
      category: 'programming',
      image: 'https://picsum.photos/600/400?random=3',
      price: 2500,
      isFree: false,
      rating: 4.7,
      studentsCount: 543,
      author: {
        id: 1,
        name: 'Иван Петров',
        avatar: 'https://picsum.photos/100/100?random=3'
      }
    }
  ]

  static async getPopularCourses(): Promise<Course[]> {
    return Promise.resolve(this.mockCourses)
  }

  static async getCourseById(id: number): Promise<Course | null> {
    try {
      return await courseApi.getCourse(id)
    } catch (error) {
      console.error(`Failed to fetch course ${id}:`, error)
      return null
    }
  }

  static async getAllCourses(): Promise<Course[]> {
    return Promise.resolve(this.mockCourses)
  }
}
