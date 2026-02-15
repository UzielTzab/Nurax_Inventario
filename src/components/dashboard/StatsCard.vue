<template>
  <div class="stats-card">
    <div class="stats-label">{{ label }}</div>
    <div class="stats-value">{{ formattedValue }}</div>
    <div v-if="subtitle" class="stats-subtitle">{{ subtitle }}</div>
    <div v-else-if="trend" class="stats-trend" :class="trendClass">
      <svg v-if="trend.direction === 'up'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clip-rule="evenodd" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z" clip-rule="evenodd" />
      </svg>
      <span>{{ trend.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Trend {
  direction: 'up' | 'down';
  value: string;
}

interface Props {
  label: string;
  value: number | string;
  subtitle?: string;
  trend?: Trend;
}

const props = defineProps<Props>();

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});

const trendClass = computed(() => {
  if (!props.trend) return '';
  return props.trend.direction === 'up' ? 'trend-up' : 'trend-down';
});
</script>

<style scoped>
.stats-card {
  background: var(--color-card-fill);
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-width: 200px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-brand-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: #474bc3;
  line-height: 1;
}

.stats-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stats-trend svg {
  width: 14px;
  height: 14px;
}

.trend-up {
  color: #22c55e;
}

.trend-down {
  color: #ef4444;
}

@media (max-width: 768px) {
  .stats-card {
    padding: 1rem;
    min-width: 150px;
  }

  .stats-value {
    font-size: 1.5rem;
  }
}
</style>
