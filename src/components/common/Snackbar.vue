<template>
  <div 
    class="snackbar"
    :class="`snackbar-${type}`"
    role="alert"
  >
    <div class="snackbar-icon">
      <CheckCircleIcon v-if="type === 'success'" />
      <InformationCircleIcon v-else-if="type === 'info'" />
      <ExclamationTriangleIcon v-else-if="type === 'warning'" />
      <XCircleIcon v-else-if="type === 'error'" />
    </div>

    <div class="snackbar-content">
      <div class="snackbar-title">{{ title }}</div>
      <div v-if="message" class="snackbar-message">{{ message }}</div>
    </div>

    <button 
      v-if="actionLabel" 
      class="snackbar-action" 
      @click="handleAction"
    >
      {{ actionLabel }}
    </button>

    <button 
      v-if="closable" 
      class="snackbar-close" 
      @click="close"
      aria-label="Close notification"
    >
      <XMarkIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/solid';
import { XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  show?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  closable: true,
  show: false,
  actionLabel: undefined,
  onAction: undefined
});

const emit = defineEmits<{
  close: []
}>();

const close = () => {
  emit('close');
};

const handleAction = () => {
  if (props.onAction) {
    props.onAction();
    close();
  }
};
</script>

<style scoped>
.snackbar {
  position: relative;
  min-width: 320px;
  max-width: 600px;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

/* Success Style */
.snackbar-success {
  background: var(--color-brand-secondary);
  border-left: 4px solid #10b981;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-success .snackbar-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399; /* emerald-400 */
}

/* Info Style */
.snackbar-info {
  background: var(--color-brand-secondary);
  border-left: 4px solid #3b82f6;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-info .snackbar-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa; /* blue-400 */
}

/* Warning Style */
.snackbar-warning {
  background: var(--color-brand-secondary);
  border-left: 4px solid #f59e0b;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-warning .snackbar-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24; /* amber-400 */
}

/* Error Style */
.snackbar-error {
  background: var(--color-brand-secondary);
  border-left: 4px solid #ef4444;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-error .snackbar-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171; /* red-400 */
}

.snackbar-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.snackbar-icon svg {
  width: 20px;
  height: 20px;
}

.snackbar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.snackbar-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: white;
}

.snackbar-message {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.snackbar-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.snackbar-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.snackbar-close svg {
  width: 20px;
  height: 20px;
}

.snackbar-action {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 0.5rem;
  white-space: nowrap;
}

.snackbar-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Animations moved to SnackbarContainer.vue */

/* Responsive */
@media (max-width: 640px) {
  .snackbar {
    min-width: auto;
    max-width: none;
    width: 100%;
  }
}
</style>
