<template>
  <Transition name="snackbar">
    <div 
      v-if="isVisible" 
      class="snackbar"
      :class="`snackbar-${type}`"
      role="alert"
    >
      <div class="snackbar-icon">
        <!-- Success Icon -->
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
        
        <!-- Info Icon -->
        <svg v-else-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        
        <!-- Warning Icon -->
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
        </svg>
        
        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
        </svg>
      </div>

      <div class="snackbar-content">
        <div class="snackbar-title">{{ title }}</div>
        <div v-if="message" class="snackbar-message">{{ message }}</div>
      </div>

      <button 
        v-if="closable" 
        class="snackbar-close" 
        @click="close"
        aria-label="Close notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface Props {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  closable: true,
  show: false
});

const emit = defineEmits<{
  close: []
}>();

const isVisible = ref(false);
let timeoutId: number | null = null;

const close = () => {
  isVisible.value = false;
  emit('close');
};

const startTimer = () => {
  if (props.duration > 0) {
    timeoutId = window.setTimeout(() => {
      close();
    }, props.duration);
  }
};

const clearTimer = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    isVisible.value = true;
    clearTimer();
    startTimer();
  } else {
    isVisible.value = false;
  }
});

onMounted(() => {
  if (props.show) {
    isVisible.value = true;
    startTimer();
  }
});
</script>

<style scoped>
.snackbar {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  min-width: 320px;
  max-width: 600px;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease-out;
}

/* Success Style */
.snackbar-success {
  background: var(--color-brand-secondary);
  border-left: 4px solid var(--color-brand-primary);
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-success .snackbar-icon {
  color: var(--color-brand-primary);
}

/* Info Style */
.snackbar-info {
  background: var(--color-brand-secondary);
  border-left: 4px solid var(--color-brand-accent);
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-info .snackbar-icon {
  color: var(--color-brand-accent);
}

/* Warning Style */
.snackbar-warning {
  background: var(--color-brand-secondary);
  border-left: 4px solid #f97316;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-warning .snackbar-icon {
  color: #f97316;
}

/* Error Style */
.snackbar-error {
  background: var(--color-brand-secondary);
  border-left: 4px solid #ef4444;
  color: white;
  backdrop-filter: blur(10px);
}

.snackbar-error .snackbar-icon {
  color: #ef4444;
}

.snackbar-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.snackbar-icon svg {
  width: 100%;
  height: 100%;
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

/* Animations */
.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.3s ease;
}

.snackbar-enter-from {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

.snackbar-leave-to {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .snackbar {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>
