<template>
  <section class="app-form-section" :class="{ 'compact-mode': compact }">
    <!-- Section header with title -->
    <div v-if="title" class="section-header">
      <h3 class="section-title">{{ title }}</h3>
      <p v-if="description" class="section-description">{{ description }}</p>
    </div>

    <!-- Content slot -->
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  compact: false,
});
</script>

<style scoped>
.app-form-section {
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.app-form-section.compact-mode {
  gap: 0.5rem;
  padding: 0.75rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  margin: 0;
  font-size: 0.95rem;
  color: #111827;
  font-weight: 700;
  font-family: inherit;
}

.section-description {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: inherit;
  line-height: 1.3;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-form-section.compact-mode .section-content {
  gap: 0.5rem;
}
</style>
