<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useRouter } from 'vue-router'
import { 
  UserIcon,
  LockClosedIcon,
  PaintBrushIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const settingsStore = useSettingsStore()
const activeTab = ref('appearance')
const isDarkMode = ref(settingsStore.theme === 'dark')
const accentColor = ref(settingsStore.accentColor)

const tabs = [
  { id: 'appearance', name: 'Внешний вид', icon: PaintBrushIcon },
  { id: 'profile', name: 'Профиль', icon: UserIcon },
  { id: 'security', name: 'Безопасность', icon: LockClosedIcon }
]

const userProfile = ref({
  name: settingsStore.user.name || 'Имя пользователя',
  email: settingsStore.user.email || 'user@example.com'
})

watch(isDarkMode, (newValue) => {
  settingsStore.setTheme(newValue ? 'dark' : 'light')
})

watch(accentColor, (newValue) => {
  settingsStore.setAccentColor(newValue)
})

const updateProfile = () => {
  settingsStore.user = {
    name: userProfile.value.name,
    email: userProfile.value.email
  }
}

const updatePassword = () => {
  // Логика обновления пароля
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Кнопка возврата -->
    <button 
      @click="goBack"
      class="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
    >
      <ArrowLeftIcon class="w-5 h-5 mr-2" />
      Вернуться назад
    </button>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div class="flex space-x-6">
        <!-- Боковая панель с вкладками -->
        <div class="w-64 space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors"
            :class="activeTab === tab.id ? 'bg-primary-light/10 text-primary dark:bg-primary-light/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            <component :is="tab.icon" class="w-5 h-5 mr-3" />
            {{ tab.name }}
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="flex-1 min-w-0">
          <!-- Внешний вид -->
          <div v-if="activeTab === 'appearance'" class="space-y-8">
            <h2 class="text-2xl font-semibold text-gray-900">Внешний вид</h2>
            
            <!-- Выбор цвета акцентов -->
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-2">Цвет акцентов</h3>
              <p class="text-sm text-gray-500 mb-4">Выберите основной цвет интерфейса</p>
              <input 
                v-model="accentColor"
                type="color"
                class="w-full h-10 rounded cursor-pointer bg-transparent"
              >
            </div>
          </div>

          <!-- Остальные вкладки остаются без изменений -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h2 class="text-xl font-semibold">Настройки профиля</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Имя пользователя</label>
                <input 
                  v-model="userProfile.name"
                  type="text" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  v-model="userProfile.email"
                  type="email" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                >
              </div>

              <button 
                @click="updateProfile"
                class="btn btn-primary"
              >
                Сохранить изменения
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'security'" class="space-y-6">
            <h2 class="text-xl font-semibold">Безопасность</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Текущий пароль</label>
                <input 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Новый пароль</label>
                <input 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:text-white"
                >
              </div>

              <button 
                @click="updatePassword"
                class="btn btn-primary"
              >
                Обновить пароль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 