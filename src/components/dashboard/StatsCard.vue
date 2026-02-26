<template>
  <div class="stats-card" :class="`card-${variant}`">
    <div class="stats-header">
      <div class="stats-label">{{ label }}</div>
      <button class="arrow-btn" :class="{ 'arrow-btn--brand': variant === 'brand' }" title="Ver detalle">
        <ArrowUpRightIcon class="arrow-icon" />
      </button>
    </div>
    <div class="stats-value">{{ formattedValue }}</div>
    <div v-if="subtitle" class="stats-subtitle">{{ subtitle }}</div>
    <div v-else-if="trend" class="stats-trend" :class="trendClass">
      <ArrowTrendingUpIcon v-if="trend.direction === 'up'" class="trend-icon" />
      <ArrowTrendingDownIcon v-else class="trend-icon" />
      <span>{{ trend.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ArrowUpRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/vue/24/outline';

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
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
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
  border-radius: 32px;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-label {
  font-size: 0.7875rem;
  font-weight: 700;
  color: #b0b5c0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.stats-value {
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--color-brand-secondarys);
  line-height: 1;
}

.stats-subtitle {
  font-size: 0.75rem;
  color: var(--color-brand-main);
  font-weight: 500;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.trend-icon {
  width: 14px;
  height: 14px;
}

.trend-up {
  color: #22c55e;
}

.trend-down {
  color: #ef4444;
}

/* Circular arrow button — outline style (default) */
.arrow-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--color-brand-main);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-brand-main);
  transition: opacity 0.2s, transform 0.2s, background 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.arrow-btn:hover {
  background: rgba(34, 125, 82, 0.08);
  transform: scale(1.05);
}

/* Circular arrow button — brand card (white fill) */
.arrow-btn--brand {
  background: #ffffff;
  border-color: #ffffff;
  color: var(--color-brand-main);
}

.arrow-btn--brand:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: scale(1.05);
}

.arrow-icon {
  width: 16px;
  height: 16px;
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
  background: var(--color-brand-main-gradient);
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
  color: var(--color-brand-main);
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
