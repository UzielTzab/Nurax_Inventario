<template>
  <button 
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <component 
      v-if="icon && iconPosition === 'left'" 
      :is="icon" 
      :class="iconClasses" 
    />
    <slot />
    <component 
      v-if="icon && iconPosition === 'right'" 
      :is="icon" 
      :class="iconClasses" 
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: Component;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  iconPosition: 'left',
  fullWidth: false
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
  const base = 'inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20 focus:ring-brand-primary',
    secondary: 'bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-lg shadow-brand-secondary/20 focus:ring-brand-secondary',
    accent: 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/20 focus:ring-brand-accent',
    danger: 'bg-status-danger hover:bg-status-danger/90 text-white shadow-lg shadow-status-danger/20 focus:ring-status-danger',
    success: 'bg-status-success hover:bg-status-success/90 text-white shadow-lg shadow-status-success/20 focus:ring-status-success'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  
  const width = props.fullWidth ? 'w-full' : '';
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${width}`;
});

const iconClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const margin = props.iconPosition === 'left' ? 'mr-2' : 'ml-2';
  
  return `${sizes[props.size]} ${margin}`;
});
</script>
