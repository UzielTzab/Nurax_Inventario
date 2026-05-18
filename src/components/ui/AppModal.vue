<template>
  <Teleport to="body">
    <Transition name="app-modal-fade">
      <div
        v-if="isOpen"
        class="app-modal-backdrop"
        :style="{ zIndex: String(zIndex) }"
        @click.self="handleBackdropClick"
      >
        <div class="app-modal-panel" :class="`app-modal-panel--${size}`" role="dialog" aria-modal="true">
          <header v-if="title || subtitle || $slots.header || showCloseButton" class="app-modal-header">
            <slot name="header">
              <div>
                <h2 v-if="title" class="app-modal-title">{{ title }}</h2>
                <p v-if="subtitle" class="app-modal-subtitle">{{ subtitle }}</p>
              </div>
            </slot>
            <button
              v-if="showCloseButton"
              type="button"
              class="app-modal-close"
              aria-label="Cerrar"
              @click="$emit('close')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </header>

          <section class="app-modal-body">
            <slot />
          </section>

          <footer v-if="$slots.footer" class="app-modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
  showCloseButton: true,
  zIndex: 1060,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close');
  }
};
</script>

<style scoped>
.app-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.app-modal-panel {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.app-modal-panel--sm {
  max-width: 420px;
}

.app-modal-panel--md {
  max-width: 560px;
}

.app-modal-panel--lg {
  max-width: 860px;
}

.app-modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.app-modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.app-modal-subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.app-modal-close {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-modal-close svg {
  width: 16px;
  height: 16px;
}

.app-modal-body {
  padding: 1.5rem;
}

.app-modal-footer {
  padding: 1rem 1.5rem 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.app-modal-fade-enter-active,
.app-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.app-modal-fade-enter-from,
.app-modal-fade-leave-to {
  opacity: 0;
}
</style>
