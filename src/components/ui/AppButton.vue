<template>
  <button 
    :type="type"
    :disabled="disabled || loading"
    class="app-button"
    :class="[
      `app-button--${variant}`,
      `app-button--${size}`,
      { 'app-button--full-width': fullWidth },
      { 'app-button--loading': loading },
      { 'app-button--icon-only': iconOnly },
      { 'app-button--active': active && variant === 'pill' }
    ]"
    @click="handleClick"
    @mousedown="createRipple"
    @touchstart.passive="createRipple"
    @mouseup="endRipple"
    @mouseleave="endRipple"
    @touchend="endRipple"
    @touchcancel="endRipple"
  >
    <!-- Contenedor del Efecto Ripple (Ondas) -->
    <span class="app-btn-ripple-container">
      <span 
        v-for="ripple in ripples" 
        :key="ripple.id"
        class="app-btn-ripple"
        :class="{ 'app-btn-ripple--ending': ripple.ending }"
        :style="{
          left: ripple.x + 'px',
          top: ripple.y + 'px',
          width: ripple.size + 'px',
          height: ripple.size + 'px'
        }"
      ></span>
    </span>

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
      <span class="app-btn-text-slot">
        <slot />
      </span>
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
import { ref } from 'vue';
import type { Component } from 'vue';

interface Props {
  type?:          'button' | 'submit' | 'reset';
  variant?:       'fill' | 'outline' | 'pill' | 'ghost';
  size?:          'sm' | 'md' | 'lg';
  disabled?:      boolean;
  fullWidth?:     boolean;
  loading?:       boolean;
  icon?:          Component;
  iconPosition?:  'left' | 'right';
  iconOnly?:      boolean;
  active?:        boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type:           'button',
  variant:        'fill',
  size:           'md',
  disabled:       false,
  fullWidth:      false,
  loading:        false,
  icon:           undefined,
  iconPosition:   'left',
  iconOnly:       false,
  active:         false,
});


const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

// --- Lógica del Efecto Ripple (Estilo Material UI) ---
interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
  ending: boolean;
}

const ripples = ref<Ripple[]>([]);
let rippleIdCounter = 0;

const createRipple = (event: MouseEvent | TouchEvent) => {
  if (props.disabled || props.loading) return;

  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  
  let clientX = 0, clientY = 0;
  if (window.TouchEvent && event instanceof TouchEvent) {
    clientX = event.touches?.[0]?.clientX ?? 0;
    clientY = event.touches?.[0]?.clientY ?? 0;
  } else {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
  }

  // Coordenadas relativas al botón
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  // El tamaño se calcula basado en la diagonal más grande para que cubra todo el botón
  const size = Math.max(rect.width, rect.height) * 2.5;
  const id = rippleIdCounter++;
  
  // Se agrega el ripple con estado "ending: false" (creciendo y mantenido)
  ripples.value.push({ x, y, size, id, ending: false });
};

const endRipple = () => {
  if (ripples.value.length === 0) return;
  
  // Al soltar el click o salir del botón, marcamos el ripple para que inicie su fade-out (ending: true)
  ripples.value.forEach(r => {
    if (!r.ending) r.ending = true;
  });

  // Limpiamos la memoria después de que la animación CSS (500ms) se haya completado
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => !r.ending);
  }, 500);
};

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
/* Botón Base - Especificaciones Material Design + Estilo Nurax */
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  gap: 0.5rem;
  
  /* Tipografía Original */
  font-weight: 500;
  font-size: 0.9375rem; 
  
  /* Dimensiones & Forma */
  padding: 0.5rem 1.375rem;
  min-width: 64px;
  border-radius: 30px; /* Mantenemos tu redondez actual de diseño */
  border: 0;
  outline: 0;
  margin: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-family: inherit;
  overflow: hidden; /* Muy importante: esto esconde la honda para que no sobresalga del botón */
  
  /* Transiciones Material (Elevaciones y pseudo-estados) */
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
              color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.app-button:disabled {
  cursor: default;
  pointer-events: none;
}

.app-button--full-width {
  width: 100%;
}

.app-button--sm {
  padding: 0.375rem 1rem;
  font-size: 0.8125rem;
  min-height: 32px;
}

.app-button--md {
  padding: 0.5rem 1.375rem;
  font-size: 0.9375rem;
  min-height: 40px;
}

.app-button--lg {
  padding: 0.75rem 2rem;
  font-size: 1.0625rem;
  min-height: 48px;
}

.app-button--icon-only {
  padding: 0.5rem;
  border-radius: 50%; /* Los icon-buttons en material son redondos */
  min-width: unset;
  min-height: unset;
}

/* Variante: Fill (MUI Contained Button adaptado) */
.app-button--fill {
  color: #fff;
  background: var(--color-brand-main);
  border-radius: 6px;
  box-shadow: none;
}

/* Pseudo-overlay para estado Hover (porque no se transiciona bien un degradado css) */
.app-button--fill::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: transparent;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
}

.app-button--fill:hover::before {
  /* Al hacer hover oscurecemos ligeramente todo simulando el brillo MUI */
  background-color: rgba(0, 0, 0, 0.08); 
}

.app-button--fill:hover {
  /* Sin sombra */
}

.app-button--fill:active {
  /* Sin sombra */
}

.app-button--fill:disabled {
  color: rgba(0, 0, 0, 0.26);
  background: rgba(0, 0, 0, 0.12);
  box-shadow: none;
}

/* Variante: Outline (MUI Outlined Button) */
.app-button--outline {
  color: #000000;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.app-button--outline:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.app-button--outline:disabled {
  color: rgba(0, 0, 0, 0.26);
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: transparent;
}

/* Variante: Pill (Chip/Toggle Buttons) */
.app-button--pill {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 20px;
  color: var(--color-pill-inactive-text);
  background: var(--color-pill-inactive-bg);
  border: 1px solid var(--color-pill-inactive-border);
  box-shadow: none;
  font-weight: 500;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.app-button--pill:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.app-button--pill:active:not(:disabled) {
  background: #d1d5db;
}

.app-button--pill.app-button--active {
  color: var(--color-pill-active-text);
  background: var(--color-pill-active-bg);
  border-color: var(--color-pill-active-border);
  font-weight: 600;
}

.app-button--pill.app-button--active:hover:not(:disabled) {
  background: #1f5d47;
  border-color: #1f5d47;
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.15);
}

.app-button--pill:disabled {
  color: rgba(0, 0, 0, 0.26);
  background: rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}

/* Variante: Ghost (Text-only Buttons) */
.app-button--ghost {
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0.5rem 0.75rem;
  font-weight: 400;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.app-button--ghost:hover:not(:disabled) {
  color: var(--color-brand-main);
  background: rgba(34, 125, 82, 0.05);
  border-radius: 8px;
}

.app-button--ghost:active:not(:disabled) {
  color: var(--color-brand-main);
  background: rgba(34, 125, 82, 0.1);
}

.app-button--ghost:disabled {
  color: rgba(0, 0, 0, 0.26);
}


/* ── Ondas (Ripple Effect) Animaciones ── */
.app-btn-ripple-container {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 0; /* Por debajo de textos e ínonos */
}

.app-btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: currentColor; /* Adopta blanco en Fill, verde en Outline */
  opacity: 0.18; 
  transform: translate(-50%, -50%) scale(0);
  /* Animación inicial mientras dejas presionado */
  animation: ripple-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.app-btn-ripple--ending {
  /* Animación final cuando sueltas el click (se desvanece suave) */
  animation: ripple-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards, 
             ripple-exit 0.5s ease-out forwards;
}

@keyframes ripple-enter {
  to { transform: translate(-50%, -50%) scale(1); }
}

@keyframes ripple-exit {
  to { opacity: 0; }
}

/* ── Content Elements (Sit above ripples and overlays) ── */
.app-btn-content, .app-btn-spinner {
  position: relative;
  z-index: 2;
}

.app-btn-content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.app-btn-content--hidden {
  visibility: hidden;
}

.app-btn-text-slot {
  display: inherit;
  align-items: inherit;
  justify-content: inherit;
}

.app-btn-icon, .app-button :deep(svg) {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ── Loading Spinner (MUI Circular Indeterminate adaptado) ── */
.app-btn-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-btn-spinner::after {
  content: '';
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.75s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
</style>
