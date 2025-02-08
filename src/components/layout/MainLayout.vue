<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from './Navbar.vue'
import ProfilePanel from './ProfilePanel.vue'
import Footer from './Footer.vue'
import TopPanel from './TopPanel.vue'
import ScrollToTop from './ScrollToTop.vue'
import Container from '@/components/ui/Container.vue'
import { RouterView } from 'vue-router'
import MobileNavPanel from './MobileNavPanel.vue'

const isNavCollapsed = ref(true)
const isProfileCollapsed = ref(true)
const isBlurred = ref(false)
const isLargeScreen = ref(false)

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024
  if (isLargeScreen.value) {
    isNavCollapsed.value = true
    isProfileCollapsed.value = true
  }
}

const handleZoom = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  updateScreenSize()
  handleZoom()
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener('resize', handleZoom)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener('resize', handleZoom)
})

const toggleNav = () => {
  if (isLargeScreen.value) {
    isNavCollapsed.value = !isNavCollapsed.value
  }
}

const toggleProfile = () => {
  if (isLargeScreen.value) {
    isProfileCollapsed.value = !isProfileCollapsed.value
  }
}

const contentClass = computed(() => ({
  'mb-20': !isLargeScreen.value,
  'blur-sm': isBlurred.value
}))
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <TopPanel @update:blur="isBlurred = $event" />
    
    <div 
      class="flex-1 transition-all duration-100 mt-16"
      :class="contentClass"
    >
      <Container>
        <div class="flex flex-col lg:flex-row gap-6 relative py-6">
          <!-- Навигация для десктопа -->
          <Navbar 
            v-if="isLargeScreen"
            :is-collapsed="isNavCollapsed" 
            @toggle="toggleNav"
            class="lg:sticky lg:top-6 overflow-y-auto rounded-xl order-2 lg:order-1 transition-all duration-1000 flex-shrink-0"
            :style="{ 
              maxHeight: 'calc(100vh - 6rem)',
              position: 'sticky'
            }"
          />

          <!-- Основной контент -->
          <div 
            class="flex-1 bg-white rounded-xl p-4 sm:p-6 order-1 lg:order-2 min-w-0"
          >
            <RouterView v-slot="{ Component }">
              <component :is="Component" />
            </RouterView>
          </div>

          <!-- Профиль для десктопа -->
          <ProfilePanel 
            v-if="isLargeScreen"
            :is-collapsed="isProfileCollapsed"
            @toggle="toggleProfile"
            class="lg:sticky lg:top-6 overflow-y-auto rounded-xl order-3 transition-all duration-300 flex-shrink-0"
            :style="{ 
              maxHeight: 'calc(100vh - 6rem)',
              position: 'sticky'
            }"
          />
        </div>
      </Container>
    </div>

    <!-- Мобильная навигационная панель -->
    <MobileNavPanel v-if="!isLargeScreen" />

    <Footer 
      class="transition-all duration-100" 
      :class="{ 'blur-sm': isBlurred, 'mb-16': !isLargeScreen }" 
    />
    <ScrollToTop />
  </div>
</template>
