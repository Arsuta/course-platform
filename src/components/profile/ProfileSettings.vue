<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useProfileStore } from '@/stores/profile'
import type { UserProfile } from '@/api/types'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const profileStore = useProfileStore()

const userProfile = ref<UserProfile | null>(null)

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  avatar: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const accentColor = ref(settingsStore.accentColor)
const shouldSaveColor = ref(settingsStore.shouldSaveColor)

const error = ref('')
const success = ref('')
const isLoading = ref(false)

// Загрузка профиля пользователя при монтировании компонента
onMounted(async () => {
  try {
    isLoading.value = true
    // Пробуем получить профиль из authStore, если он уже там есть
    if (authStore.currentUser) {
      userProfile.value = authStore.currentUser
    } else {
      // Если нет, загружаем с сервера
      userProfile.value = await profileStore.getProfile()
    }
    
    // Заполняем форму данными профиля
    if (userProfile.value) {
      form.value.first_name = userProfile.value.first_name || ''
      form.value.last_name = userProfile.value.last_name || ''
      form.value.email = userProfile.value.email || ''
      form.value.avatar = userProfile.value.avatar || ''
    }
  } catch (e) {
    error.value = 'Не удалось загрузить данные профиля'
    console.error('Ошибка загрузки профиля:', e)
  } finally {
    isLoading.value = false
  }
})

const updateProfile = async () => {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    // Формируем объект для обновления профиля
    const profileData: Partial<UserProfile> = {
      first_name: form.value.first_name,
      last_name: form.value.last_name
    }
    
    // Если URL аватара изменился, тоже отправляем его
    if (form.value.avatar !== userProfile.value?.avatar) {
      profileData.avatar = form.value.avatar
    }
    
    // Обновляем профиль через API
    const updatedProfile = await profileStore.updateProfile(profileData)
    
    if (updatedProfile) {
      userProfile.value = updatedProfile
      // Обновляем профиль и в authStore, чтобы данные были синхронизированы
      await authStore.loadUserProfile()
      success.value = 'Профиль успешно обновлен'
    } else {
      error.value = profileStore.error || 'Ошибка при обновлении профиля'
    }
  } catch (e) {
    error.value = 'Ошибка при обновлении профиля'
    console.error('Ошибка обновления профиля:', e)
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  try {
    if (form.value.newPassword !== form.value.confirmPassword) {
      error.value = 'Пароли не совпадают'
      return
    }

    isLoading.value = true
    error.value = ''
    success.value = ''
    
    // Здесь должен быть запрос на обновление пароля,
    // но в API EDU нет такого эндпоинта, этот функционал должен быть в AUTH API
    
    // Показываем сообщение об ошибке
    error.value = 'Функция смены пароля пока не реализована в API'
  } catch (e) {
    error.value = 'Ошибка при обновлении пароля'
    console.error('Ошибка обновления пароля:', e)
  } finally {
    isLoading.value = false
  }
}

const updateTheme = () => {
  settingsStore.setAccentColor(accentColor.value)
  settingsStore.setShouldSaveColor(shouldSaveColor.value)
  success.value = 'Настройки темы сохранены'
}
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-gray-900">Настройки профиля</h2>
    
    <!-- Основная информация -->
    <div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Основная информация</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Имя</label>
          <input
            v-model="form.first_name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Фамилия</label>
          <input
            v-model="form.last_name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
          >
          <p class="mt-1 text-xs text-gray-500">Email нельзя изменить</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">URL аватара</label>
          <input
            v-model="form.avatar"
            type="text"
            placeholder="https://example.com/avatar.jpg"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
          <p class="mt-1 text-xs text-gray-500">Введите URL изображения для вашего аватара</p>
        </div>

        <button
          @click="updateProfile"
          :disabled="isLoading"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
        </button>
      </div>
    </div>

    <!-- Смена пароля -->
    <div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Смена пароля</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Текущий пароль</label>
          <input
            v-model="form.currentPassword"
            type="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Новый пароль</label>
          <input
            v-model="form.newPassword"
            type="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <button
          @click="updatePassword"
          :disabled="isLoading"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {{ isLoading ? 'Обновление...' : 'Обновить пароль' }}
        </button>
      </div>
    </div>

    <!-- Настройки темы -->
    <div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h3 class="text-lg font-semibold text-gray-900">Настройки темы</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Цвет акцентов</label>
          <input
            v-model="accentColor"
            type="color"
            class="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">Сохранять цвет</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="shouldSaveColor" 
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <button
          @click="updateTheme"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Сохранить настройки темы
        </button>
      </div>
    </div>

    <!-- Сообщения об ошибках и успехе -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {{ error }}
    </div>
    
    <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
      {{ success }}
    </div>
  </div>
</template> 