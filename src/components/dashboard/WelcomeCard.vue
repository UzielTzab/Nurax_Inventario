<template>
  <div class="welcome-card">
    <div class="welcome-content">
      <!-- Icono decorativo -->
      <div class="welcome-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Texto de bienvenida -->
      <div class="welcome-text">
        <h2 class="welcome-title">
          Welcome back, {{ userName }}! 
          <span class="wave-emoji">👋</span>
        </h2>
        <p class="welcome-message">
          <span class="status-indicator" :class="statusClass"></span>
          {{ statusMessage }}
        </p>
      </div>
    </div>

    <!-- Alertas -->
    <!-- <div v-if="alerts.length > 0" class="alerts-container">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-item"
        :class="`alert-${alert.type}`"
      >
        <div class="alert-icon">
          <svg v-if="alert.type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="alert.type === 'danger'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="alert-text">{{ alert.message }}</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
}

interface Props {
  userName?: string;
  status?: 'healthy' | 'warning' | 'critical';
  alerts?: Alert[];
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Alex',
  status: 'healthy',
  alerts: () => []
});

const statusClass = computed(() => {
  return props.status === 'healthy' ? 'status-healthy' : 
         props.status === 'warning' ? 'status-warning' : 
         'status-critical';
});

const statusMessage = computed(() => {
  if (props.status === 'healthy') {
    return 'System status is Healthy. You have pending inventory actions that require your attention to maintain optimal stock levels.';
  } else if (props.status === 'warning') {
    return 'System has warnings. Please review inventory alerts.';
  } else {
    return 'System requires immediate attention. Critical stock levels detected.';
  }
});
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.welcome-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.welcome-icon {
  width: 48px;
  height: 48px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-brand-secondary);
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wave-emoji {
  display: inline-block;
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

.welcome-message {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.status-healthy {
  background: var(--color-brand-secondary);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

.status-warning {
  background: var(--color-brand-primary);
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
}

.status-critical {
  background: var(--color-status-danger);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

.alerts-container {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  flex: 1;
  border: 2px solid;
}

.alert-warning {
  background: rgba(59, 50, 40, 0.6);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
  backdrop-filter: blur(10px);
}

.alert-danger {
  background: rgba(60, 40, 45, 0.6);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  backdrop-filter: blur(10px);
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
}

.alert-warning .alert-icon {
  background: #fbbf24;
}

.alert-danger .alert-icon {
  background: #ef4444;
}

.alert-icon svg {
  width: 100%;
  height: 100%;
  color: #1a1f2e;
}

.alert-text {
  flex: 1;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-content {
    flex-direction: column;
    gap: 1rem;
  }

  .alerts-container {
    flex-direction: column;
  }

  .welcome-title {
    font-size: 1.25rem;
  }
}
</style>
