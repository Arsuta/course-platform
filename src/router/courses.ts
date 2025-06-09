import { RouteRecordRaw } from 'vue-router'
import CourseLayout from '@/layouts/CourseLayout.vue'
import CourseList from '@/components/course/CourseList.vue'
import CourseDetail from '@/views/CourseDetail.vue'
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
      name: 'course-detail',
      component: CourseDetail,
      meta: {
        title: 'Детали курса',
        requiresAuth: false
      }
    },
    {
      path: 'preview/:id',
      name: 'course-preview',
      component: () => import('@/views/CoursePreview.vue'),
      meta: {
        title: 'Описание курса',
        requiresAuth: false
      }
    },
    {
      path: ':courseId/learn',
      name: 'course-learn',
      component: () => import('@/views/CourseLearning.vue'),
      meta: {
        title: 'Обучение',
        requiresAuth: true
      }
    },
    {
      path: ':courseId/learn/:lessonId',
      name: 'lesson-view',
      component: LessonView,
      props: true,
      meta: {
        title: 'Просмотр урока',
        requiresAuth: true
      }
    }
  ]
}

// Отдельные маршруты для курсов, если потребуются
export const coursesRoutes: RouteRecordRaw[] = [] 