import { RouteRecordRaw } from 'vue-router'
import CourseLayout from '@/layouts/CourseLayout.vue'
import CourseList from '@/components/course/CourseList.vue'
import CourseDetail from '@/components/course/CourseDetail.vue'
import LessonView from '@/components/course/LessonView.vue'

export const courseRoutes = {
  path: '/courses',
  component: CourseLayout,
  children: [
    {
      path: '',
      name: 'courses',
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
    }
  ]
}

export const coursesRoutes: RouteRecordRaw[] = [
  {
    path: '/courses/:id',
    name: 'course-detail',
    component: CourseDetail,
    props: true,
    meta: {
      title: 'Детали курса',
      requiresAuth: false
    }
  },
  {
    path: '/courses/:courseId/learn/:lessonId',
    name: 'lesson-view',
    component: LessonView,
    props: true,
    meta: {
      title: 'Просмотр урока',
      requiresAuth: true
    }
  }
] 