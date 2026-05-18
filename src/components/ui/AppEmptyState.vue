<template>
  <div class="app-empty-state">
    <div v-if="$slots.icon" class="app-empty-state-icon">
      <slot name="icon" />
    </div>
    <h3 class="app-empty-state-title">{{ title }}</h3>
    <p v-if="description" class="app-empty-state-description">{{ description }}</p>
    <div v-if="$slots.actions" class="app-empty-state-actions">
      <slot name="actions" />
    </div>
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
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
}

.app-empty-state-icon {
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.app-empty-state-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.app-empty-state-description {
  margin: 0;
  color: #6b7280;
  max-width: 520px;
  line-height: 1.45;
}

.app-empty-state-actions {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
}
</style>
