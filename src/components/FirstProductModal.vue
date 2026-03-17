<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" @click.stop>
          <!-- Contenido del Modal -->
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <div class="modal-icon">📦</div>
              <h2 class="modal-title">Comienza con tu Primer Producto</h2>
              <p class="modal-subtitle">
                Para usar el sistema completamente, necesitas crear al menos un producto en tu inventario.
              </p>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <p class="info-text">
                ¿Cómo prefieres agregar tu primer producto?
              </p>

              <!-- Opciones -->
              <div class="options-container">
                <!-- Opción 1: Crear manualmente -->
                <button class="option-card" @click="handleCreateProduct">
                  <div class="option-icon">✏️</div>
                  <div class="option-content">
                    <h3 class="option-title">Crear Producto</h3>
                    <p class="option-description">
                      Crea tu primer producto llenando un sencillo formulario
                    </p>
                  </div>
                  <div class="option-arrow">→</div>
                </button>

                <!-- Opción 2: Cargar desde Excel -->
                <button class="option-card" @click="handleLoadExcel">
                  <div class="option-icon">📊</div>
                  <div class="option-content">
                    <h3 class="option-title">Cargar desde Excel</h3>
                    <p class="option-description">
                      Importa múltiples productos desde un archivo Excel
                    </p>
                  </div>
                  <div class="option-arrow">→</div>
                </button>
              </div>

              <!-- Divider -->
              <div class="modal-divider">
                <span>O</span>
              </div>

              <!-- Opción para configurar después -->
              <div class="configure-later-section">
                <p class="configure-text">
                  ¿Prefieres hacerlo después?
                </p>
                <AppButton
                  variant="ghost"
                  size="md"
                  @click="handleSkip"
                >
                  Configurar Después
                </AppButton>
              </div>
            </div>

            <!-- Footer Info -->
            <div class="modal-footer-info">
              <div class="info-badge">💡</div>
              <p class="info-message">
                Puedes agregar productos en cualquier momento desde la sección de Inventario
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'create-product'): void;
  (e: 'load-excel'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleCreateProduct = () => {
  emit('create-product');
};

const handleLoadExcel = () => {
  emit('load-excel');
};

const handleSkip = () => {
  emit('close');
};

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 540px;
  width: 100%;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
}

/* Header */
.modal-header {
  padding: 2.5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(34, 125, 82, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-bottom: 1px solid #e5e7eb;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.modal-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.modal-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #666666;
  line-height: 1.5;
  max-width: 450px;
  margin: 0 auto;
}

/* Body */
.modal-body {
  padding: 2rem;
}

.info-text {
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: #666666;
  font-weight: 500;
}

/* Options Container */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: inherit;
}

.option-card:hover {
  border-color: var(--color-brand-main, #227d52);
  background: rgba(34, 125, 82, 0.02);
  transform: translateX(4px);
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 12px;
}

.option-content {
  flex: 1;
}

.option-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

.option-description {
  margin: 0;
  font-size: 0.8rem;
  color: #666666;
}

.option-arrow {
  font-size: 1.5rem;
  color: #d1d5db;
  flex-shrink: 0;
  transition: all 0.2s;
}

.option-card:hover .option-arrow {
  color: var(--color-brand-main, #227d52);
  transform: translateX(3px);
}

/* Divider */
.modal-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.modal-divider::before,
.modal-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.modal-divider span {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Configure Later */
.configure-later-section {
  text-align: center;
  padding-top: 1rem;
}

.configure-text {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #666666;
}

/* Footer Info */
.modal-footer-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: rgba(34, 125, 82, 0.05);
  border-top: 1px solid #e5e7eb;
}

.info-badge {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-message {
  margin: 0;
  font-size: 0.8rem;
  color: #666666;
  line-height: 1.4;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Mobile */
@media (max-width: 640px) {
  .modal-header {
    padding: 2rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer-info {
    padding: 1rem 1.5rem;
  }

  .option-card {
    padding: 1rem;
  }

  .option-icon {
    width: 44px;
    height: 44px;
    font-size: 1.75rem;
  }
}
</style>
