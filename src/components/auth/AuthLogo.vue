<script setup lang="ts">
import { ref } from 'vue'
import LogoMain from '../layout/LogoMain.vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const isHovered = ref(false)
</script>

<template>
  <div 
    class="w-48 h-16 mx-auto mb-8 transition-transform duration-300 cursor-pointer"
    :class="{ 'scale-110': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <LogoMain :color="settingsStore.accentColor" />
  </div>
</template> 