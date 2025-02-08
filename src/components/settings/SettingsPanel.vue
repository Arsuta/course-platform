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
const accentColor = ref(settingsStore.accentColor)
const shouldSaveColor = ref(settingsStore.shouldSaveColor)

const tabs = [
  { id: 'appearance', name: 'Внешний вид', icon: PaintBrushIcon },
  { id: 'profile', name: 'Профиль', icon: UserIcon },
  { id: 'security', name: 'Безопасность', icon: LockClosedIcon }
]

const userProfile = ref({
  name: settingsStore.user.name || 'Имя пользователя',
  email: settingsStore.user.email || 'user@example.com'
})

watch(accentColor, (newValue) => {
  document.documentElement.style.setProperty('--accent-color', newValue);
  settingsStore.setAccentColor(newValue);
})

watch(shouldSaveColor, (newValue) => {
  settingsStore.setShouldSaveColor(newValue)
})

const resetToDefaultColor = () => {
  settingsStore.resetToDefaultColor()
  accentColor.value = settingsStore.accentColor
}

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
      class="mb-6 flex items-center text-gray-600 hover:text-primary transition-colors"
    >
      <ArrowLeftIcon class="w-5 h-5 mr-2" />
      Вернуться назад
    </button>

    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex space-x-6">
        <!-- Боковая панель с вкладками -->
        <div class="w-64 space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors"
            :class="activeTab === tab.id ? 'bg-primary-light/10 text-primary' : 'text-gray-600 hover:bg-gray-50'"
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
            <div class="p-4 bg-gray-50 rounded-lg space-y-6">
              <div>
                <h3 class="font-medium text-gray-900 mb-2">Цвет акцентов</h3>
                <p class="text-sm text-gray-500 mb-4">Выберите основной цвет интерфейса</p>
                <div class="flex items-center gap-4">
                  <input 
                    v-model="accentColor"
                    type="color"
                    class="w-full h-10 rounded cursor-pointer bg-transparent"
                  >
                  <button 
                    @click="resetToDefaultColor"
                    class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Сбросить
                  </button>
                </div>
              </div>

              <!-- Переключатель сохранения цвета -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">Сохранять цвет</h3>
                  <p class="text-sm text-gray-500">Сохранять выбранный цвет между сессиями</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="shouldSaveColor" 
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
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
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  v-model="userProfile.email"
                  type="email" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
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
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Новый пароль</label>
                <input 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
                <input 
                  type="password" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
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