<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import ProfileBlog from '@/components/profile/ProfileBlog.vue'
import ProfileLevel from '@/components/profile/ProfileLevel.vue'
import ProfileSettings from '@/components/profile/ProfileSettings.vue'
import ProfileGames from '@/components/profile/ProfileGames.vue'
import ProfileAchievements from '@/components/profile/ProfileAchievements.vue'
import ProfileFollowers from '@/components/profile/ProfileFollowers.vue'
import ProfileFollowing from '@/components/profile/ProfileFollowing.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref('blog')

// Получаем данные пользователя
const user = computed(() => {
  const profileId = Number(route.params.id)
  return authStore.getUserById(profileId)
})

// Проверяем, является ли текущий пользователь владельцем профиля
const isOwner = computed(() => {
  return authStore.currentUser?.id === Number(route.params.id)
})

// Базовые вкладки, доступные всем
const tabs = computed(() => {
  const baseTabs = [
    { 
      id: 'blog', 
      name: 'Блог', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      component: ProfileBlog
    },
    { 
      id: 'level', 
      name: 'Уровень', 
      icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      component: ProfileLevel
    },
    { 
      id: 'achievements', 
      name: 'Достижения', 
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      component: ProfileAchievements
    },
    { 
      id: 'followers', 
      name: 'Подписчики', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      component: ProfileFollowers
    },
    { 
      id: 'following', 
      name: 'Подписки', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      component: ProfileFollowing
    }
  ]

  // Добавляем вкладки только для владельца профиля
  if (isOwner.value) {
    baseTabs.push(
      { 
        id: 'settings', 
        name: 'Настройки', 
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        component: ProfileSettings
      },
      { 
        id: 'games', 
        name: 'Мини-игры', 
        icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
        component: ProfileGames
      }
    )
  }

  return baseTabs
})

// Анимированный переход между вкладками
const handleTabChange = (tabId: string) => {
  if (tabId === activeTab.value) return
  activeTab.value = tabId
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Боковая панель -->
    <div class="w-80 bg-white shadow-xl">
      <ProfileSidebar />
      
      <!-- Навигация -->
      <nav class="p-4 space-y-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          class="w-full flex items-center px-4 py-2 rounded-lg text-left transition-all duration-300"
          :class="activeTab === tab.id ? 
            'bg-primary text-white shadow-lg scale-105' : 
            'text-gray-600 hover:bg-gray-50'"
        >
          <svg 
            class="w-5 h-5 mr-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="tab.icon"
            />
          </svg>
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Основной контент -->
    <div class="flex-1 bg-gray-50">
      <div class="max-w-4xl mx-auto p-8">
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          mode="out-in"
        >
          <div 
            :key="activeTab"
            class="w-full"
          >
            <component 
              :is="tabs.find(t => t.id === activeTab)?.component"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}
</style> 