<template>
  <button 
    :type="type"
    :disabled="disabled"
    :title="title"
    :class="buttonClasses"
    @click="handleClick"
  >
    <component :is="icon" :class="iconClasses" />
    <span 
      v-if="badge !== undefined && badge > 0" 
      class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
    >
      {{ badge }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  icon: Component;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  title?: string;
  badge?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'default',
  size: 'md',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};

const buttonClasses = computed(() => {
  const base = 'relative inline-flex items-center justify-center transition-colors rounded-full focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'text-gray-400 hover:bg-white/10 hover:text-white',
    primary: 'text-brand-primary hover:bg-brand-primary/10',
    danger: 'text-status-danger hover:bg-status-danger/10',
    success: 'text-status-success hover:bg-status-success/10'
  };
  
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`;
});

const iconClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return sizes[props.size];
});
</script>
