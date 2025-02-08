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
          component: HomeView
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('@/views/Courses.vue'),
          meta: { requiresAuth: true }
        },
        ...coursesRoutes,
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/About.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/Settings.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile/:id',
          name: 'profile',
          component: () => import('@/views/Profile.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      redirect: '/auth/login',
      component: () => import('@/views/auth/AuthLayout.vue'),
      meta: { requiresGuest: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue')
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPassword.vue')
        }
      ]
    },
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  document.title = `${to.meta.title} | Course Platform`

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
