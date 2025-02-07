<script setup lang="ts">
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import ProfilePanel from './ProfilePanel.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { RouterView } from 'vue-router'

const isNavCollapsed = ref(true)
const isProfileCollapsed = ref(true)

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value
}

const toggleProfile = () => {
  isProfileCollapsed.value = !isProfileCollapsed.value
}
</script>

<template>
    <div class="flex-1 bg-white rounded-xl p-6">
          <HomeHeader 
          />
        </div>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-1">
      <div class="flex gap-6 mx-auto max-w-screen-2xl relative p-6">
        <Navbar 
          :is-collapsed="isNavCollapsed" 
          @toggle="toggleNav"
          class="sticky top-6 h-[calc(100vh-3rem)] rounded-xl"
        />

        <div class="flex-1 bg-white rounded-xl p-6">
          <Header 
            @toggle-nav="toggleNav" 
            @toggle-profile="toggleProfile" 
          />
          <main class="mt-6">
            <RouterView />
          </main>
        </div>

        <ProfilePanel 
          :is-collapsed="isProfileCollapsed" 
          @toggle="toggleProfile"
          class="sticky top-6 h-[calc(100vh-3rem)] rounded-xl"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>
