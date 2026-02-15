<template>
  <div class="flex flex-col items-center justify-center py-8 text-center">
    <component 
      v-if="icon" 
      :is="icon" 
      class="h-12 w-12 text-gray-400 mb-4" 
    />
    <p class="text-lg font-medium text-gray-400 mb-1">{{ title }}</p>
    <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  icon?: Component;
  title: string;
  description?: string;
}

defineProps<Props>();
</script>
