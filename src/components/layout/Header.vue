<script setup lang="ts">

defineEmits<{
  'toggle-nav': []
  'toggle-profile': []
}>()
</script>

<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center">
      <img src="/images/logo-main.svg" alt="AIMProduction" class="w-10 h-10">
    </div>
  </header>
</template>
