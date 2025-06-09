<template>
  <div class="admin-dashboard">
    <div class="flex h-screen bg-gray-100">
      <!-- Боковая панель -->
      <div class="w-64 bg-white shadow-md">
        <div class="p-4 bg-primary text-white">
          <h2 class="text-xl font-semibold">Панель администратора</h2>
        </div>
        <nav class="mt-4">
          <router-link 
            :to="{ name: 'admin-dashboard' }" 
            class="block px-4 py-2 hover:bg-gray-100"
            :class="{ 'bg-gray-100 text-primary': $route.name === 'admin-dashboard' }"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Обзор
            </div>
          </router-link>
          <router-link 
            :to="{ name: 'admin-courses' }" 
            class="block px-4 py-2 hover:bg-gray-100"
            :class="{ 'bg-gray-100 text-primary': $route.name === 'admin-courses' }"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Курсы
            </div>
          </router-link>
          <router-link 
            :to="{ name: 'admin-courses-pending' }" 
            class="block px-4 py-2 hover:bg-gray-100 pl-10"
            :class="{ 'bg-gray-100 text-primary': $route.name === 'admin-courses-pending' }"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              На модерации
            </div>
          </router-link>
          <router-link 
            :to="{ name: 'admin-users' }" 
            class="block px-4 py-2 hover:bg-gray-100"
            :class="{ 'bg-gray-100 text-primary': $route.name === 'admin-users' }"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Пользователи
            </div>
          </router-link>
          <div class="mt-4 border-t pt-4">
            <router-link 
              :to="{ name: 'home' }" 
              class="block px-4 py-2 hover:bg-gray-100 text-gray-600"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                Вернуться на сайт
              </div>
            </router-link>
          </div>
        </nav>
      </div>
      
      <!-- Основной контент -->
      <div class="flex-1 overflow-auto">
        <div class="p-6">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Проверяем, что пользователь администратор
  if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
    router.push({ name: 'home' })
  }
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
}
</style> 