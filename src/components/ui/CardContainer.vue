<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: true,
  border: true
});

const cardClasses = computed(() => {
  const base = 'bg-dark-card rounded-xl';
  
  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const shadow = props.shadow ? 'shadow-2xl' : '';
  const border = props.border ? 'border border-dark-border' : '';
  
  return `${base} ${paddings[props.padding]} ${shadow} ${border}`;
});
</script>
