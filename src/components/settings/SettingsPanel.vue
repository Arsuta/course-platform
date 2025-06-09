<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { 
  UserIcon,
  LockClosedIcon,
  PaintBrushIcon,
  BellIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const settingsStore = useSettingsStore()
const profileStore = useProfileStore()
const authStore = useAuthStore()

const activeTab = ref('appearance')
const accentColor = ref(settingsStore.accentColor)
const shouldSaveColor = ref(settingsStore.shouldSaveColor)
const isDarkMode = ref(settingsStore.darkMode)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Вкладки настроек
const tabs = [
  { id: 'appearance', name: 'Внешний вид', icon: PaintBrushIcon },
  { id: 'profile', name: 'Профиль', icon: UserIcon },
  { id: 'notifications', name: 'Уведомления', icon: BellIcon },
  { id: 'security', name: 'Безопасность', icon: LockClosedIcon }
]

// Настройки профиля
const userProfile = ref({
  first_name: '',
  last_name: '',
  email: '',
  avatar: ''
})

// Настройки уведомлений
const notifications = ref({
  emailNotifications: true,
  courseUpdates: true,
  newMessages: true,
  promotions: false
})

// Настройки безопасности
const securitySettings = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Валидация пароля
const passwordErrors = computed(() => {
  const errors = []
  if (securitySettings.value.newPassword) {
    if (securitySettings.value.newPassword.length < 8) {
      errors.push('Пароль должен содержать не менее 8 символов')
    }
    if (!/[A-Z]/.test(securitySettings.value.newPassword)) {
      errors.push('Пароль должен содержать хотя бы одну заглавную букву')
    }
    if (!/[0-9]/.test(securitySettings.value.newPassword)) {
      errors.push('Пароль должен содержать хотя бы одну цифру')
    }
    if (securitySettings.value.newPassword !== securitySettings.value.confirmPassword) {
      errors.push('Пароли не совпадают')
    }
  }
  return errors
})

// Загрузка данных пользователя
onMounted(async () => {
  isLoading.value = true
  try {
    await profileStore.getProfile()
    if (profileStore.user) {
      userProfile.value = {
        first_name: profileStore.user.first_name || '',
        last_name: profileStore.user.last_name || '',
        email: profileStore.user.email || '',
        avatar: profileStore.user.avatar || ''
      }
    }
    
    // Загружаем настройки из локального хранилища
    notifications.value = settingsStore.getNotificationSettings()
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
    errorMessage.value = 'Не удалось загрузить данные профиля'
  } finally {
    isLoading.value = false
  }
})

// Наблюдатели за изменениями настроек
watch(accentColor, (newValue) => {
  document.documentElement.style.setProperty('--accent-color', newValue)
  settingsStore.setAccentColor(newValue)
})

watch(shouldSaveColor, (newValue) => {
  settingsStore.setShouldSaveColor(newValue)
})

watch(isDarkMode, (newValue) => {
  settingsStore.setDarkMode(newValue)
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// Сброс цвета акцентов
const resetToDefaultColor = () => {
  settingsStore.resetToDefaultColor()
  accentColor.value = settingsStore.accentColor
}

// Обновление профиля
const updateProfile = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const profileData = {
      first_name: userProfile.value.first_name,
      last_name: userProfile.value.last_name
    }
    
    const result = await profileStore.updateProfile(profileData)
    if (result) {
      successMessage.value = 'Профиль успешно обновлен'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error)
    errorMessage.value = 'Не удалось обновить профиль'
  } finally {
    isLoading.value = false
  }
}

// Обновление настроек уведомлений
const updateNotifications = () => {
  settingsStore.saveNotificationSettings(notifications.value)
  successMessage.value = 'Настройки уведомлений сохранены'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

// Обновление пароля
const updatePassword = async () => {
  if (passwordErrors.value.length > 0) return
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const result = await authStore.changePassword(
      securitySettings.value.currentPassword,
      securitySettings.value.newPassword
    )
    
    if (result) {
      successMessage.value = 'Пароль успешно обновлен'
      securitySettings.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Ошибка при обновлении пароля:', error)
    errorMessage.value = 'Не удалось обновить пароль. Проверьте правильность текущего пароля.'
  } finally {
    isLoading.value = false
  }
}

// Загрузка аватара
const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Пожалуйста, выберите изображение'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Имитация загрузки файла (в реальном приложении здесь был бы запрос к API)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Создаем URL для предпросмотра аватара
    userProfile.value.avatar = URL.createObjectURL(file)
    
    successMessage.value = 'Аватар успешно обновлен'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error)
    errorMessage.value = 'Не удалось загрузить аватар'
  } finally {
    isLoading.value = false
  }
}

// Возврат назад
const goBack = () => {
  router.back()
}

// Очистка сообщений
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
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

    <!-- Сообщения об успехе/ошибке -->
    <div v-if="successMessage" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
      <div class="flex items-center">
        <CheckCircleIcon class="w-5 h-5 mr-2" />
        <span>{{ successMessage }}</span>
      </div>
      <button @click="clearMessages" class="absolute top-0 right-0 mt-3 mr-4">
        <XCircleIcon class="w-5 h-5" />
      </button>
    </div>

    <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <div class="flex items-center">
        <XCircleIcon class="w-5 h-5 mr-2" />
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="clearMessages" class="absolute top-0 right-0 mt-3 mr-4">
        <XCircleIcon class="w-5 h-5" />
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex flex-col md:flex-row md:space-x-6">
        <!-- Боковая панель с вкладками -->
        <div class="w-full md:w-64 mb-6 md:mb-0">
          <div class="flex md:block overflow-x-auto md:overflow-visible space-x-4 md:space-x-0 md:space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex items-center px-4 py-2 rounded-lg text-left transition-colors whitespace-nowrap"
              :class="activeTab === tab.id ? 'bg-primary-light/10 text-primary' : 'text-gray-600 hover:bg-gray-50'"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Содержимое вкладок -->
        <div class="flex-1 min-w-0">
          <!-- Индикатор загрузки -->
          <div v-if="isLoading" class="flex justify-center items-center h-40">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <div v-else>
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
                
                <!-- Переключатель темного режима -->
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Темный режим</h3>
                    <p class="text-sm text-gray-500">Включить темную тему интерфейса</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="isDarkMode" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Профиль -->
            <div v-if="activeTab === 'profile'" class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-900">Настройки профиля</h2>
              
              <!-- Аватар -->
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img 
                    :src="userProfile.avatar || '/img/avatar-placeholder.jpg'" 
                    alt="Аватар пользователя"
                    class="w-24 h-24 rounded-full object-cover"
                    @error="($event.target && (($event.target as HTMLImageElement).src = '/img/avatar-placeholder.jpg'))"
                  >
                  <label class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="file" 
                      accept="image/*" 
                      class="hidden"
                      @change="handleAvatarUpload"
                    >
                  </label>
                </div>
                <div>
                  <h3 class="text-lg font-medium">Фотография профиля</h3>
                  <p class="text-sm text-gray-500">Загрузите изображение в формате JPG или PNG</p>
                </div>
              </div>
              
              <!-- Форма профиля -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Имя</label>
                  <input 
                    v-model="userProfile.first_name"
                    type="text" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Фамилия</label>
                  <input 
                    v-model="userProfile.last_name"
                    type="text" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    v-model="userProfile.email"
                    type="email" 
                    disabled
                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                  >
                  <p class="mt-1 text-xs text-gray-500">Email не может быть изменен</p>
                </div>
              </div>

              <button 
                @click="updateProfile"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Сохранение...</span>
                <span v-else>Сохранить изменения</span>
              </button>
            </div>

            <!-- Уведомления -->
            <div v-if="activeTab === 'notifications'" class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-900">Настройки уведомлений</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 class="font-medium text-gray-900">Email-уведомления</h3>
                    <p class="text-sm text-gray-500">Получать уведомления на email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="notifications.emailNotifications" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 class="font-medium text-gray-900">Обновления курсов</h3>
                    <p class="text-sm text-gray-500">Уведомления об обновлениях в курсах</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="notifications.courseUpdates" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 class="font-medium text-gray-900">Новые сообщения</h3>
                    <p class="text-sm text-gray-500">Уведомления о новых сообщениях</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="notifications.newMessages" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 class="font-medium text-gray-900">Акции и предложения</h3>
                    <p class="text-sm text-gray-500">Маркетинговые и рекламные уведомления</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="notifications.promotions" 
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <button 
                @click="updateNotifications"
                class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Сохранить настройки
              </button>
            </div>

            <!-- Безопасность -->
            <div v-if="activeTab === 'security'" class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-900">Безопасность</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Текущий пароль</label>
                  <input 
                    v-model="securitySettings.currentPassword"
                    type="password" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Введите текущий пароль"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Новый пароль</label>
                  <input 
                    v-model="securitySettings.newPassword"
                    type="password" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Введите новый пароль"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
                  <input 
                    v-model="securitySettings.confirmPassword"
                    type="password" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Повторите новый пароль"
                  >
                </div>

                <!-- Ошибки валидации пароля -->
                <div v-if="passwordErrors.length > 0" class="bg-red-50 p-4 rounded-md">
                  <p class="text-sm font-medium text-red-800 mb-2">Требования к паролю:</p>
                  <ul class="text-sm text-red-700 list-disc pl-5">
                    <li v-for="(error, index) in passwordErrors" :key="index">{{ error }}</li>
                  </ul>
                </div>

                <button 
                  @click="updatePassword"
                  class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  :disabled="isLoading || passwordErrors.length > 0 || !securitySettings.currentPassword || !securitySettings.newPassword"
                >
                  <span v-if="isLoading">Обновление...</span>
                  <span v-else>Обновить пароль</span>
                </button>
              </div>
              
              <!-- Двухфакторная аутентификация (заглушка) -->
              <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">Двухфакторная аутентификация</h3>
                    <p class="text-sm text-gray-500">Повысьте безопасность вашего аккаунта</p>
                  </div>
                  <button class="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
                    Настроить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 