<template>
  <div class="app-input-wrapper" :class="wrapperClass">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="app-input-label">
      {{ label }}
      <span v-if="required" class="app-input-required">*</span>
    </label>

    <!-- Input container -->
    <div class="app-input-container" :class="containerClass">
      <!-- Left icon slot -->
      <span v-if="$slots.icon || iconLeft" class="app-input-icon app-input-icon-left">
        <slot name="icon">
          <!-- Icon passed as prop (SVG string) is not used; use slot -->
        </slot>
      </span>

      <!-- The actual input -->
      <input
        :id="inputId"
        v-bind="$attrs"
        :type="currentType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        class="app-input-field"
        :class="{ 'has-left-icon': $slots.icon || iconLeft, 'has-right-icon': type === 'password' || $slots.right }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Password toggle eye -->
      <button
        v-if="type === 'password'"
        type="button"
        class="app-input-icon app-input-icon-right app-input-eye"
        @click="togglePasswordVisibility"
        tabindex="-1"
        :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      >
        <!-- Eye open -->
        <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <!-- Eye closed -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </button>

      <!-- Right slot (custom icon/action) -->
      <span v-else-if="$slots.right" class="app-input-icon app-input-icon-right">
        <slot name="right" />
      </span>
    </div>

    <!-- Helper / Error text -->
    <p v-if="error" class="app-input-error">{{ error }}</p>
    <p v-else-if="hint" class="app-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  autocomplete?: string;
  iconLeft?: boolean; // flag to reserve left padding even without slot
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
});

defineEmits<{ (e: 'update:modelValue', value: string): void }>();

// Unique id so label:for works correctly even with multiple instances
const autoId = `app-input-${Math.random().toString(36).slice(2, 7)}`;
const inputId = computed(() => props.id ?? autoId);

const isFocused = ref(false);
const showPassword = ref(false);

const currentType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password';
  return props.type;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const wrapperClass = computed(() => ({
  'app-input-disabled': props.disabled,
  'app-input-has-error': !!props.error,
}));

const containerClass = computed(() => ({
  'app-input-focused': isFocused.value,
  'app-input-error-border': !!props.error,
  'app-input-disabled-border': props.disabled,
}));
</script>

<style scoped>
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

/* Label */
.app-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.app-input-required {
  color: #ef4444;
  margin-left: 0.125rem;
}

/* Container */
.app-input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.app-input-focused { 
  border-color: var(--color-brand-main, #227d52);
}

.app-input-error-border {
  border-color: #fca5a5;
  background: #fff9f9;
}

.app-input-disabled-border {
  background: #f3f4f6;
  opacity: 0.65;
  cursor: not-allowed;
}

/* Field */
.app-input-field {
  flex: 1;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: #111827;
  font-family: 'Inter', sans-serif;
  outline: none;
  border-radius: 12px;
}

.app-input-field::placeholder {
  color: #c4c9d4;
}

.app-input-field:disabled {
  cursor: not-allowed;
}

.app-input-field.has-left-icon {
  padding-left: 2.75rem;
}

.app-input-field.has-right-icon {
  padding-right: 2.75rem;
}

/* Icons */
.app-input-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #9ca3af;
  transition: color 0.2s;
}

.app-input-icon svg {
  width: 18px;
  height: 18px;
}

.app-input-icon-left {
  left: 0.875rem;
}

.app-input-icon-right {
  right: 0.875rem;
}

/* Eye button */
.app-input-eye {
  pointer-events: all;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 6px;
  transition: color 0.2s;
}

.app-input-eye:hover {
  color: #4b5563;
}

/* When focused, left icon turns brand color */
.app-input-focused .app-input-icon-left {
  color: var(--color-brand-main, #227d52);
}

/* Error state icons */
.app-input-error-border .app-input-icon-left {
  color: #ef4444;
}

/* Error / hint text */
.app-input-error {
  font-size: 0.8125rem;
  color: #dc2626;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.app-input-hint {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
