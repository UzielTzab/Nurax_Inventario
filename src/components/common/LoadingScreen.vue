<template>
  <div class="loading-screen">
    <div class="loading-content">
      <!-- Spinner -->
      <div class="spinner"></div>

      <!-- Brand Name -->
      <h1 class="brand-name">NURAX</h1>

      <!-- Loading Text -->
      <div class="loading-text">
        <p class="main-text">Preparando tu éxito...</p>
        <p class="sub-text">Optimizando tu negocio en un instante</p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-info">
          <span class="progress-label">CARGANDO MÓDULOS</span>
          <span class="progress-percentage">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const progress = ref(0);

const emit = defineEmits<{
  complete: []
}>();

onMounted(() => {
  // ⏱️ CONFIGURACIÓN DEL TIEMPO DE CARGA
  // ========================================
  // Para ajustar el tiempo total de carga, modifica estos valores:
  
  const UPDATE_INTERVAL = 150;      // Frecuencia de actualización en ms (más bajo = más rápido)
  const MIN_INCREMENT = 10;          // Incremento mínimo por actualización (%)
  const MAX_INCREMENT = 10;         // Incremento máximo por actualización (%)
  const FINAL_DELAY = 500;          // Espera después de llegar al 100% (ms)
  
  // Tiempo aproximado total: (100 / incremento_promedio) × intervalo + delay_final
  // Con valores actuales: ~1.7 segundos
  // 
  // Ejemplos de configuración:
  // - Más rápido (1s):   UPDATE_INTERVAL=100, MIN_INCREMENT=15, MAX_INCREMENT=25
  // - Normal (2.5s):     UPDATE_INTERVAL=150, MIN_INCREMENT=5,  MAX_INCREMENT=15
  // - Más lento (4s):    UPDATE_INTERVAL=200, MIN_INCREMENT=3,  MAX_INCREMENT=8
  // ========================================

  // Simular progreso de carga
  const interval = setInterval(() => {
    if (progress.value < 100) {
      // Incremento variable para efecto más realista
      const increment = Math.random() * (MAX_INCREMENT - MIN_INCREMENT) + MIN_INCREMENT;
      progress.value = Math.min(progress.value + increment, 100);
    } else {
      clearInterval(interval);
      // Esperar un poco después de llegar al 100%
      setTimeout(() => {
        emit('complete');
      }, FINAL_DELAY);
    }
  }, UPDATE_INTERVAL);
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  padding: 2rem;
}

/* Spinner */
.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(34, 162, 197, 0.1);
  border-top: 4px solid var(--color-brand-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: pulse 2s ease-in-out infinite;
  display: none;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
  }
}

.brand-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand-secondary);
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Agregar animación de scaling prgresivo */
  animation: scaleUp 1.5s ease-out forwards;

}

.loading-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-brand-secondary);
  margin: 0;
}

.sub-text {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(28, 37, 46, 0.6);
  margin: 0;
}

.progress-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-accent));
  border-radius: 3px;
  transition: width 0.3s ease-out;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
  filter: blur(0.5px);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(28, 37, 46, 0.6);
  font-weight: 600;
  letter-spacing: 1px;
}

.progress-label {
  text-transform: uppercase;
}

.progress-percentage {
  font-family: 'Courier New', monospace;
  color: var(--color-brand-secondary);
}

/* Responsive */
@media (max-width: 640px) {
  .spinner {
    width: 50px;
    height: 50px;
    border-width: 3px;
  }

  .brand-name {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .main-text {
    font-size: 1.25rem;
  }

  .sub-text {
    font-size: 0.875rem;
  }

  .progress-container {
    max-width: 300px;
  }
}
</style>
