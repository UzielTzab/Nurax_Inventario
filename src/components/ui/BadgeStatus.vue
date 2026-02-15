<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  size: 'md',
  rounded: true
});

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-semibold';
  
  const variants = {
    success: 'bg-status-success/10 text-status-success',
    warning: 'bg-status-warning/10 text-status-warning',
    danger: 'bg-status-danger/10 text-status-danger',
    info: 'bg-brand-accent/10 text-brand-accent',
    primary: 'bg-brand-primary/10 text-brand-primary',
    secondary: 'bg-brand-secondary/10 text-brand-secondary',
    purple: 'bg-purple-500/10 text-purple-400'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };
  
  const shape = props.rounded ? 'rounded-full' : 'rounded';
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${shape}`;
});
</script>
