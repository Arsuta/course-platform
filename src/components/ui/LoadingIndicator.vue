<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
}>()
</script>

<template>
  <div 
    :class="[
      'flex items-center justify-center',
      { 'fixed inset-0 bg-black/50 z-50': overlay }
    ]"
  >
    <div 
      class="animate-spin rounded-full border-t-2 border-primary"
      :class="{
        'w-4 h-4 border': size === 'sm',
        'w-8 h-8 border-2': size === 'md',
        'w-12 h-12 border-4': size === 'lg'
      }"
    />
  </div>
</template> 