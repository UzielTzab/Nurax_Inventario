<template>
  <div class="stats-card" :class="`card-${variant}`">
    <div class="stats-header">
      <div class="stats-label">{{ label }}</div>
      <div v-if="icon" class="stats-icon" :class="`icon-${iconType}`">
        <component :is="icon" />
      </div>
    </div>
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
  variant?: 'default' | 'danger' | 'success' | 'brand';
  icon?: any;
  iconType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'brand';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  iconType: 'primary'
});

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
  border: 1px solid var(--color-card-border);
  border-radius: 32px;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stats-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-label {
  font-size: 0.7875rem;
  font-weight: 1000;
  color: #b0b5c0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.stats-value {
  font-size: 2.1rem;
  font-weight: 1000;
  color: var(--color-brand-secondarys);
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

.card-danger {
  background-color: #FEF2F2;
  border-color: #FECACA;
}

.card-danger .stats-value {
  color: #DC2626;
}

.card-danger .stats-label {
  color: #991B1B;
}

.card-danger .stats-subtitle {
  color: #7F1D1D;
  opacity: 0.8;
}

.card-success {
  background-color: #F0FDF4;
  border-color: #BBF7D0;
}

.card-success .stats-value {
  color: #16A34A;
}

.card-success .stats-label {
  color: #166534;
}

.card-success .stats-subtitle {
  color: #14532d;
  opacity: 0.8;
}

.card-brand {
  background-color: var(--color-brand-main);
  border-color: var(--color-brand-main);
  color: white;
}

.card-brand .stats-label {
  color: rgba(255, 255, 255, 0.8);
}

.card-brand .stats-value {
  color: white;
}

.card-brand .stats-subtitle {
  color: rgba(255, 255, 255, 0.7);
}

.card-brand .stats-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-brand .stats-trend {
  color: white;
}

.card-brand .trend-up, .card-brand .trend-down {
  color: white;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stats-icon svg {
  width: 24px;
  height: 24px;
}

.icon-primary {
  background: #E0E7FF;
  color: #4F46E5;
}

.icon-purple {
  background: #F3E8FF;
  color: #9333EA;
}

.icon-success {
  background: #DCFCE7;
  color: #16A34A;
}

.icon-warning {
  background: #FEF3C7;
  color: #D97706;
}

.icon-danger {
  background: #FEE2E2;
  color: #DC2626;
}

.icon-info {
  background: #DBEAFE;
  color: #2563EB;
}
</style>
