<template>
  <div class="wizard-header">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

<style scoped>
.wizard-header {
  padding: 2rem;
  border-bottom: 1px solid var(--color-wizard-border);
  background: linear-gradient(135deg, rgba(230, 171, 23, 0.03) 0%, rgba(31, 41, 55, 0.03) 100%);
}

.wizard-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-wizard-accent);
  letter-spacing: -0.5px;
}

.wizard-header p {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-wizard-text-grey);
  line-height: 1.5;
}
</style>
