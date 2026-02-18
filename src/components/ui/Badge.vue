<template>
  <span class="badge" :class="variantClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral'
});

const variantClass = computed(() => `badge-${props.variant}`);
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background: rgba(34, 197, 94, 0.1);
  color: #099178;
}

.badge-warning {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.badge-info {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.badge-neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}
</style>
