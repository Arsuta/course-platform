<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from '@/components/layout/MainHeader.vue'
import MainFooter from '@/components/layout/MainFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <MainHeader />
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouterView />
      </div>
    </main>
    <MainFooter />
  </div>
</template> 