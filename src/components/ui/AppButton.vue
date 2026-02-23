<template>
  <button 
    :type="type"
    :disabled="disabled"
    class="app-button"
    :class="[
      `app-button--${variant}`,
      { 'app-button--full-width': fullWidth }
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'fill' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'fill',
  disabled: false,
  fullWidth: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
/* 
  Botón Base - Configura aquí los valores compartidos (espaciado, border-radius, tipografía) 
*/
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem; /* 10px */
  font-weight: 400;
  font-size: 0.9375rem; /* 15px */
  padding: 0.625rem 1.5rem; /* 10px 24px */
  border-radius: 30px;
  outline: none;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
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
  background-color: #d1d5db; /* gray-300 */
  color: #6b7280; /* gray-500 */
  box-shadow: none;
}

/* 
  Variante: Outline (Solo contorno)
*/
.app-button--outline {
  background-color: #ffffff;
  color: var(--color-brand-main, #06402B);
  border: 1px solid var(--color-brand-main);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.app-button--outline:hover:not(:disabled) {
  border-color: var(--color-brand-main, #06402B);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06) ;
}

.app-button--outline:disabled {
  background-color: #f9fafb; /* gray-50 */
  color: #9ca3af; /* gray-400 */
  border-color: #e5e7eb; /* gray-200 */
}

/* Estilos para los iconos (SVG) dentro del botón */
.app-button > :deep(svg) {
  width: 20px;
  height: 30px;
  flex-shrink: 0;
}
</style>
