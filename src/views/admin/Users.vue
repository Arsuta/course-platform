<template>
  <div class="admin-users">
    <h2 class="text-2xl font-bold mb-4">Управление пользователями</h2>
    
    <div class="filters mb-4 flex gap-4 items-center">
      <div class="search flex-grow">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск пользователей..." 
          class="w-full p-2 border rounded"
          @input="filterUsers"
        />
      </div>
      <div class="filter">
        <select v-model="roleFilter" class="p-2 border rounded" @change="filterUsers">
          <option value="all">Все роли</option>
          <option value="student">Студенты</option>
          <option value="teacher">Преподаватели</option>
          <option value="admin">Администраторы</option>
        </select>
      </div>
      <div class="filter">
        <select v-model="statusFilter" class="p-2 border rounded" @change="filterUsers">
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="banned">Заблокированные</option>
        </select>
      </div>
    </div>
    
    <div class="users-table bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="p-3 text-left">ID</th>
            <th class="p-3 text-left">Имя</th>
            <th class="p-3 text-left">Email</th>
            <th class="p-3 text-left">Роль</th>
            <th class="p-3 text-left">Статус</th>
            <th class="p-3 text-left">Дата регистрации</th>
            <th class="p-3 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-t border-gray-200 dark:border-gray-600">
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3">
              <div class="flex items-center">
                <img :src="user.avatar" alt="Avatar" class="w-8 h-8 rounded-full mr-2" />
                {{ user.name }}
              </div>
            </td>
            <td class="p-3">{{ user.email }}</td>
            <td class="p-3">
              <span :class="getRoleBadgeClass(user.role)">
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td class="p-3">
              <span :class="getStatusBadgeClass(user.status)">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="p-3">{{ formatDate(user.registeredAt) }}</td>
            <td class="p-3">
              <div class="flex gap-2">
                <button @click="editUser(user)" class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="toggleUserStatus(user)" :class="user.status === 'banned' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'">
                  <i :class="user.status === 'banned' ? 'fas fa-user-check' : 'fas fa-user-slash'"></i>
                </button>
                <button @click="changeUserRole(user)" class="text-purple-500 hover:text-purple-700">
                  <i class="fas fa-user-tag"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Пагинация -->
    <div class="pagination mt-4 flex justify-center">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
      >
        &lt;
      </button>
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="currentPage = page"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === page ? 'bg-primary text-white' : ''"
      >
        {{ page }}
      </button>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 mx-1 rounded border"
        :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
      >
        &gt;
      </button>
    </div>
    
    <!-- Модальное окно редактирования пользователя -->
    <div v-if="showEditModal && editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Редактирование пользователя</h3>
        <form @submit.prevent="saveUserChanges">
          <div class="mb-4">
            <label class="block mb-2">Имя</label>
            <input type="text" v-model="editingUser.name" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Email</label>
            <input type="email" v-model="editingUser.email" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label class="block mb-2">Роль</label>
            <select v-model="editingUser.role" class="w-full p-2 border rounded">
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block mb-2">Статус</label>
            <select v-model="editingUser.status" class="w-full p-2 border rounded">
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
              <option value="banned">Заблокирован</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 border rounded">
              Отмена
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Интерфейс для пользователя
interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  status: 'active' | 'inactive' | 'banned'
  registeredAt: string
  avatar: string
}

// Моковые данные пользователей
const users = ref<User[]>([
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    role: 'student',
    status: 'active',
    registeredAt: '2023-01-15T10:30:00',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    role: 'student',
    status: 'active',
    registeredAt: '2023-02-20T14:45:00',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 3,
    name: 'Петр Петров',
    email: 'petr@example.com',
    role: 'teacher',
    status: 'active',
    registeredAt: '2022-11-05T09:15:00',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    name: 'Елена Сидорова',
    email: 'elena@example.com',
    role: 'teacher',
    status: 'active',
    registeredAt: '2022-12-10T11:20:00',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 5,
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    role: 'admin',
    status: 'active',
    registeredAt: '2022-10-01T08:00:00',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    id: 6,
    name: 'Мария Новикова',
    email: 'maria@example.com',
    role: 'student',
    status: 'inactive',
    registeredAt: '2023-03-05T16:30:00',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 7,
    name: 'Дмитрий Соколов',
    email: 'dmitry@example.com',
    role: 'student',
    status: 'banned',
    registeredAt: '2023-01-25T13:10:00',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 8,
    name: 'Ольга Морозова',
    email: 'olga@example.com',
    role: 'teacher',
    status: 'inactive',
    registeredAt: '2022-11-15T10:45:00',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: 9,
    name: 'Сергей Волков',
    email: 'sergey@example.com',
    role: 'student',
    status: 'active',
    registeredAt: '2023-04-10T09:20:00',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 10,
    name: 'Наталья Лебедева',
    email: 'natalia@example.com',
    role: 'student',
    status: 'active',
    registeredAt: '2023-03-20T15:15:00',
    avatar: 'https://i.pravatar.cc/150?img=15'
  }
])

// Состояние фильтров и поиска
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 5

// Состояние модального окна редактирования
const showEditModal = ref(false)
const editingUser = ref<User | null>(null)

// Фильтрация пользователей
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // Применение поиска
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }
  
  // Применение фильтра по роли
  if (roleFilter.value !== 'all') {
    result = result.filter(user => user.role === roleFilter.value)
  }
  
  // Применение фильтра по статусу
  if (statusFilter.value !== 'all') {
    result = result.filter(user => user.status === statusFilter.value)
  }
  
  // Пагинация
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Общее количество страниц для пагинации
const totalPages = computed(() => {
  let filteredCount = users.value.length
  
  // Применение поиска
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredCount = users.value.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    ).length
  }
  
  // Применение фильтра по роли
  if (roleFilter.value !== 'all') {
    filteredCount = users.value.filter(user => user.role === roleFilter.value).length
  }
  
  // Применение фильтра по статусу
  if (statusFilter.value !== 'all') {
    filteredCount = users.value.filter(user => user.status === statusFilter.value).length
  }
  
  return Math.ceil(filteredCount / itemsPerPage)
})

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

// Получение класса для бейджа роли
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'teacher':
      return 'px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'student':
      return 'px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Получение текста для роли
const getRoleText = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Администратор'
    case 'teacher':
      return 'Преподаватель'
    case 'student':
      return 'Студент'
    default:
      return 'Неизвестно'
  }
}

// Получение класса для бейджа статуса
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive':
      return 'px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'banned':
      return 'px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

// Получение текста для статуса
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активен'
    case 'inactive':
      return 'Неактивен'
    case 'banned':
      return 'Заблокирован'
    default:
      return 'Неизвестно'
  }
}

// Функция фильтрации пользователей
const filterUsers = () => {
  currentPage.value = 1 // Сбрасываем на первую страницу при изменении фильтров
}

// Редактирование пользователя
const editUser = (user: User) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

// Сохранение изменений пользователя
const saveUserChanges = () => {
  if (!editingUser.value) return
  
  const index = users.value.findIndex(u => u.id === editingUser.value!.id)
  if (index !== -1) {
    users.value[index] = { ...editingUser.value }
  }
  
  showEditModal.value = false
  editingUser.value = null
}

// Изменение статуса пользователя
const toggleUserStatus = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    if (users.value[index].status === 'banned') {
      users.value[index].status = 'active'
    } else {
      users.value[index].status = 'banned'
    }
  }
}

// Изменение роли пользователя
const changeUserRole = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    const roles: ('student' | 'teacher' | 'admin')[] = ['student', 'teacher', 'admin']
    const currentRoleIndex = roles.indexOf(users.value[index].role)
    const nextRoleIndex = (currentRoleIndex + 1) % roles.length
    users.value[index].role = roles[nextRoleIndex]
  }
}
</script>

<style scoped>
.admin-users {
  @apply p-6;
}

.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}
</style> 