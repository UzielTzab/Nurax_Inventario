<template>
  <span :class="badgeClasses">
    <slot />
    <button 
      @click="handleRemove"
      class="ml-2 hover:opacity-80 transition-opacity"
      type="button"
    >
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'accent';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
});

const emit = defineEmits<{
  remove: [];
}>();

const handleRemove = () => {
  emit('remove');
};

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
  
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-blue-100 text-blue-800',
    accent: 'bg-green-100 text-green-800'
  };
  
  return `${base} ${variants[props.variant]}`;
});
</script>
