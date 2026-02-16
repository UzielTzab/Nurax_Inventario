<template>
  <div class="tab-group">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ 'tab-active': modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      <component 
        v-if="tab.icon" 
        :is="tab.icon" 
        class="tab-icon"
      />
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="tab-count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: any;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.tab-group {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  color: #111827;
}

.tab-active {
  color: var(--color-brand-secondary);
  border-bottom-color: var(--color-brand-secondary);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: var(--color-background);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.tab-icon {
  width: 20px;
  height: 20px;
}

.tab-active .tab-count {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-brand-secondary);
}

@media (max-width: 640px) {
  .tab-group {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
}
</style>
