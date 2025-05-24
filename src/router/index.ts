import { createRouter, createWebHistory } from 'vue-router'
import { coursesRoutes } from './courses'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/components/layout/MainLayout.vue'
import HomeView from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { 
            title: 'Главная',
            public: true 
          }
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('@/views/Courses.vue'),
          meta: { 
            title: 'Курсы',
            requiresAuth: true 
          }
        },
        {
          path: 'courses/preview',
          name: 'courses-preview',
          component: () => import('@/views/CoursesPreview.vue'),
          meta: { 
            title: 'Каталог курсов',
            public: true 
          }
        },
        ...coursesRoutes,
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/About.vue'),
          meta: { 
            title: 'О нас',
            public: true 
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings.vue'),
          meta: { 
            title: 'Настройки',
            requiresAuth: true 
          }
        },
        {
          path: 'profile/:id',
          name: 'profile',
          component: () => import('@/views/Profile.vue'),
          meta: { 
            title: 'Профиль',
            requiresAuth: true 
          }
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      redirect: '/auth/login',
      component: () => import('@/views/auth/AuthLayout.vue'),
      meta: { 
        requiresGuest: true,
        public: true 
      },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { 
            title: 'Вход',
            public: true 
          }
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue'),
          meta: { 
            title: 'Регистрация',
            public: true 
          }
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPassword.vue'),
          meta: { 
            title: 'Восстановление пароля',
            public: true 
          }
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)

  // Установка заголовка страницы
  document.title = to.meta.title ? `${to.meta.title} | Course Platform` : 'Course Platform'

  // Если страница требует авторизации и пользователь не авторизован
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath },
      params: { message: 'Для доступа к этой странице необходима авторизация' }
    })
  } 
  // Если страница требует гостя и пользователь авторизован
  else if (to.matched.some(record => record.meta.requiresGuest) && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  // В остальных случаях разрешаем доступ
  else {
    next()
  }
})

export default router
