<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Обзор платформы</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Статистика пользователей -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Пользователей</h2>
            <div class="flex items-center">
              <span class="text-2xl font-semibold">{{ userCount }}</span>
              <span class="text-green-500 ml-2 text-sm" v-if="userGrowth > 0">+{{ userGrowth }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Статистика курсов -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Курсов</h2>
            <div class="flex items-center">
              <span class="text-2xl font-semibold">{{ courseCount }}</span>
              <span class="text-green-500 ml-2 text-sm" v-if="courseGrowth > 0">+{{ courseGrowth }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Курсы на модерации -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">На модерации</h2>
            <div class="flex items-center">
              <span class="text-2xl font-semibold">{{ pendingCount }}</span>
              <router-link 
                :to="{ name: 'admin-courses-pending' }" 
                class="ml-2 text-sm text-primary hover:underline"
                v-if="pendingCount > 0"
              >
                Просмотреть
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Активность -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Активность</h2>
            <div class="flex items-center">
              <span class="text-2xl font-semibold">{{ activity }}</span>
              <span class="text-green-500 ml-2 text-sm" v-if="activityGrowth > 0">+{{ activityGrowth }}%</span>
              <span class="text-red-500 ml-2 text-sm" v-else-if="activityGrowth < 0">{{ activityGrowth }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Последние действия -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Последние действия</h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действие</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(action, index) in recentActions" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ action.name }}</div>
                <div class="text-sm text-gray-500">{{ action.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs font-medium">{{ action.user.substring(0, 2).toUpperCase() }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ action.user }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(action.date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(action.status)">
                  {{ action.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCourseStore } from '@/stores/courses'

// Имитация данных для демонстрации
const userCount = ref(1250)
const userGrowth = ref(5.2)
const courseCount = ref(48)
const courseGrowth = ref(12.7)
const pendingCount = ref(3)
const activity = ref(876)
const activityGrowth = ref(3.1)

const coursesStore = useCourseStore()

// Имитация последних действий
const recentActions = ref([
  {
    name: 'Новый курс добавлен',
    description: 'JavaScript для начинающих',
    user: 'Иван Петров',
    date: new Date(Date.now() - 3600000), // 1 час назад
    status: 'Завершено'
  },
  {
    name: 'Курс отправлен на модерацию',
    description: 'Python: продвинутый уровень',
    user: 'Анна Сидорова',
    date: new Date(Date.now() - 7200000), // 2 часа назад
    status: 'В процессе'
  },
  {
    name: 'Пользователь зарегистрирован',
    description: 'Новый преподаватель',
    user: 'Максим Иванов',
    date: new Date(Date.now() - 86400000), // 1 день назад
    status: 'Завершено'
  },
  {
    name: 'Курс одобрен',
    description: 'HTML и CSS: основы',
    user: 'Администратор',
    date: new Date(Date.now() - 172800000), // 2 дня назад
    status: 'Завершено'
  }
])

onMounted(async () => {
  try {
    // Загружаем курсы на модерации
    const pendingCoursesResponse = await coursesStore.getPendingCourses()
    if (pendingCoursesResponse) {
      // Если API вернул данные, обновляем счетчик
      pendingCount.value = Array.isArray(pendingCoursesResponse) ? pendingCoursesResponse.length : 0
    }
  } catch (error) {
    console.error('Ошибка при загрузке курсов на модерации:', error)
  }
})

// Форматирование даты
const formatDate = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)

  if (diffDay > 0) {
    return `${diffDay} ${getDeclension(diffDay, ['день', 'дня', 'дней'])} назад`
  } else if (diffHour > 0) {
    return `${diffHour} ${getDeclension(diffHour, ['час', 'часа', 'часов'])} назад`
  } else if (diffMin > 0) {
    return `${diffMin} ${getDeclension(diffMin, ['минуту', 'минуты', 'минут'])} назад`
  } else {
    return 'только что'
  }
}

// Функция для правильного склонения слов
const getDeclension = (number: number, titles: [string, string, string]): string => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[
    number % 100 > 4 && number % 100 < 20 
      ? 2 
      : cases[number % 10 < 5 ? number % 10 : 5]
  ]
}

// Получение класса для статуса
const getStatusClass = (status: string): string => {
  switch(status) {
    case 'Завершено':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
    case 'В процессе':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
    case 'Отменено':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    default:
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
}
</script> 