<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
      <div class="modal-container" :class="`modal-${type}`">
        <!-- Icon Header -->
        <div class="modal-icon-wrapper">
          <div class="modal-icon">
            <!-- Danger / Delete -->
            <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <!-- Warning -->
            <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <!-- Success -->
            <svg v-else-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Info / Default -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>

        <!-- Actions -->
        <div class="modal-actions">
          <AppButton variant="outline" v-if="showCancel" @click="handleCancel">
            {{ cancelText }}
          </AppButton>
          <AppButton variant="fill" @click="handleConfirm">
            {{ confirmText }}
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">


type ModalType = 'danger' | 'warning' | 'success' | 'info';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true
});

const emit = defineEmits(['close', 'confirm']);

const handleCancel = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background: white;
  width: 90%;
  max-width: 400px;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transform: scale(1);
  transition: all 0.3s ease;
}

/* Icon Styles */
.modal-icon-wrapper {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
}

/* Typography */
.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.modal-message {
  color: #6B7280;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Button Styles */
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.btn-cancel {
  background: transparent;
  border: 1.5px solid #D1D5DB;
  color: #374151;
}

.btn-cancel:hover {
  border-color: var(--color-brand-main, #06402B);
  color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.04);
}

.btn-confirm {
  border: none;
  color: white;
}

/* Theme Variants */
/* Danger */
.modal-danger .modal-icon {
  background: #FEF2F2;
  color: #EF4444;
}
.modal-danger .btn-confirm {
  background: #EF4444;
}
.modal-danger .btn-confirm:hover {
  background: #DC2626;
}

/* Warning */
.modal-warning .modal-icon {
  background: #FFF7ED;
  color: #F97316;
}
.modal-warning .btn-confirm {
  background: #F97316;
}
.modal-warning .btn-confirm:hover {
  background: #EA580C;
}

/* Success */
.modal-success .modal-icon {
  background: rgba(6, 64, 43, 0.08);
  color: var(--color-brand-main, #06402B);
}
.modal-success .btn-confirm {
  background: var(--color-brand-main, #06402B);
}
.modal-success .btn-confirm:hover {
  background: #0a5c3a;
}

/* Info */
.modal-info .modal-icon {
  background: #EFF6FF;
  color: #3B82F6;
}
.modal-info .btn-confirm {
  background: #3B82F6;
}
.modal-info .btn-confirm:hover {
  background: #2563EB;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95);
}
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
