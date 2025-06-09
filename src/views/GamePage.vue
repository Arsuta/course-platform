<script setup lang="ts">
import { onMounted } from 'vue'
import ProfileGames from '@/components/profile/ProfileGames.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // Убедимся, что пользователь авторизован
  if (!authStore.isAuthenticated) {
    await authStore.loadUserProfile()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold text-primary mb-8 text-center">Мини-игры</h1>
      <ProfileGames />
    </div>
  </div>
</template> 