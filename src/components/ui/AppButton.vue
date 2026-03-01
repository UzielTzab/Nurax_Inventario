<template>
  <button 
    :type="type"
    :disabled="disabled || loading"
    class="app-button"
    :class="[
      `app-button--${variant}`,
      { 'app-button--full-width': fullWidth },
      { 'app-button--loading': loading },
      { 'app-button--icon-only': iconOnly }
    ]"
    @click="handleClick"
  >
    <!-- Spinner (visible only when loading) -->
    <span v-if="loading" class="app-btn-spinner" aria-hidden="true"></span>

    <!-- Content: ícono + texto (siempre en layout, invisible cuando carga) -->
    <span :class="{ 'app-btn-content--hidden': loading }" class="app-btn-content">
      <!-- Ícono izquierdo (antes del texto) -->
      <component
        v-if="icon && iconPosition === 'left'"
        :is="icon"
        class="app-btn-icon"
        aria-hidden="true"
      />
      <!-- Slot: texto o contenido personalizado -->
      <slot />
      <!-- Ícono derecho (después del texto) -->
      <component
        v-if="icon && iconPosition === 'right'"
        :is="icon"
        class="app-btn-icon"
        aria-hidden="true"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  type?:          'button' | 'submit' | 'reset';
  variant?:       'fill' | 'outline';
  disabled?:      boolean;
  fullWidth?:     boolean;
  loading?:       boolean;
  /** Componente Heroicon a renderizar dentro del botón */
  icon?:          Component;
  /** Posición del ícono respecto al texto. Default: 'left' */
  iconPosition?:  'left' | 'right';
  /** true cuando el botón sólo tiene ícono (sin texto) — ajusta el padding */
  iconOnly?:      boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type:           'button',
  variant:        'fill',
  disabled:       false,
  fullWidth:      false,
  loading:        false,
  icon:           undefined,
  iconPosition:   'left',
  iconOnly:       false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
/* 
  Botón Base - Configura aquí los valores compartidos
*/
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.625rem 1.25rem;
  border-radius: 30px;
  outline: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
}

/* Modificador: sólo ícono — padding cuadrado */
.app-button--icon-only {
  padding: 0.625rem;
}

.app-button:disabled {
  cursor: not-allowed;
}

/* Modificador: Ancho completo */
.app-button--full-width {
  width: 100%;
}

/* 
  Variante: Fill (Relleno sólido)
*/
.app-button--fill {
  background: var(--color-brand-main-gradient, #06402B);
  color: #ffffff;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.app-button--fill:hover:not(:disabled) {
  background-color: #0a5c3a;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.app-button--fill:disabled {
  background-color: #d1d5db;
  color: #6b7280;
  box-shadow: none;
}

/* 
  Variante: Outline (Solo contorno)
*/
.app-button--outline {
  background-color: transparent;
  color: var(--color-brand-main, #06402B);
  border: 1px solid var(--color-brand-main);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.app-button--outline:hover:not(:disabled) {
  border-color: var(--color-brand-main, #06402B);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.app-button--outline:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  border-color: #e5e7eb;
}

/* ── Content span ── */
.app-btn-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.app-btn-content--hidden {
  visibility: hidden;
  pointer-events: none;
}

/* ── Heroicon vía prop `icon` ── */
.app-btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* SVGs pasados por slot (compatibilidad retroactiva con uso existente) */
.app-button :deep(svg) {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ── Loading state ── */
.app-btn-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-btn-spinner::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
}

/* Outline variant spinner uses brand color */
.app-button--outline .app-btn-spinner::after {
  border-color: rgba(6, 64, 43, 0.25);
  border-top-color: var(--color-brand-main, #06402B);
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
</style>
