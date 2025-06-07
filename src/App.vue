<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

console.log('App компонент загружен')

const authStore = useAuthStore()

onMounted(() => {
  console.log('App: onMounted - Инициализация аутентификации')
  authStore.initAuth()
})
</script>

<template>
  <RouterView />
</template>

<style>
.debug-container {
  padding: 20px;
  margin: 20px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  text-align: center;
}
</style>
