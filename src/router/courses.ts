import { RouteRecordRaw } from 'vue-router'
import CourseLayout from '@/layouts/CourseLayout.vue'
import CourseList from '@/components/course/CourseList.vue'
import CourseDetail from '@/components/course/CourseDetail.vue'
import LessonView from '@/components/course/LessonView.vue'

// Основной маршрут для вложенных путей /courses
export const courseRoutes: RouteRecordRaw = {
  path: '/courses',
  component: CourseLayout,
  children: [
    {
      path: '',
      name: 'courses-list',
      component: CourseList,
      meta: {
        title: 'Курсы',
        requiresAuth: false
      }
    },
    {
      path: ':id',
      name: 'course-detail-nested',
      component: CourseDetail,
      meta: {
        title: 'Детали курса',
        requiresAuth: false
      }
    }
  ]
}

// Маршруты для отдельных страниц курсов
export const coursesRoutes: RouteRecordRaw[] = [
  {
    path: 'courses/:courseId/learn/:lessonId',
    name: 'lesson-view',
    component: LessonView,
    props: true,
    meta: {
      title: 'Просмотр урока',
      requiresAuth: true
    }
  }
] 