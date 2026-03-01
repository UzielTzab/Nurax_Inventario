<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.badge--success {
  background: var(--color-badge-stock-bg, #D1FAE5);
  color: var(--color-badge-stock-text, #059669);
}
.badge--warning {
  background: var(--color-badge-low-bg, #FFEDD5);
  color: var(--color-badge-low-text, #EA580C);
}
.badge--danger {
  background: var(--color-badge-out-bg, #FEE2E2);
  color: var(--color-badge-out-text, #DC2626);
}
.badge--info {
  background: #EFF6FF;
  color: #2563EB;
}
.badge--default {
  background: #F3F4F6;
  color: #374151;
}
</style>
