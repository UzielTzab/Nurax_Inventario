<template>
  <div class="app-select-wrapper" :class="wrapperClass">
    <!-- Label -->
    <label v-if="label" :for="selectId" class="app-select-label">
      {{ label }}
      <span v-if="required" class="app-select-required">*</span>
    </label>

    <!-- Select container -->
    <div class="app-select-container" :class="containerClass">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="app-select-field"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
        <option v-if="placeholder" value="">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.id || option.value"
          :value="option.id || option.value"
        >
          {{ option.name || option.label }}
        </option>
      </select>

      <!-- Chevron icon -->
      <span class="app-select-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <!-- Helper / Error text -->
    <p v-if="error" class="app-select-error">{{ error }}</p>
    <p v-else-if="hint" class="app-select-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SelectOption {
  id?: string | number;
  value?: string | number;
  name?: string;
  label?: string;
}

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  options: () => [],
});

defineEmits<{ (e: 'update:modelValue', value: string | number): void }>();

// Unique id for label:for binding
const autoId = `app-select-${Math.random().toString(36).slice(2, 7)}`;
const selectId = computed(() => props.id ?? autoId);

const isFocused = ref(false);

const wrapperClass = computed(() => ({
  'app-select-disabled': props.disabled,
  'app-select-has-error': !!props.error,
}));

const containerClass = computed(() => ({
  'app-select-focused': isFocused.value,
  'app-select-error-border': !!props.error,
  'app-select-disabled-border': props.disabled,
}));
</script>

<style scoped>
.app-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

/* Label */
.app-select-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  font-family: inherit;
}

.app-select-required {
  color: #ef4444;
  margin-left: 0.125rem;
}

/* Container */
.app-select-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.app-select-focused {
  border-color: var(--color-brand-main, #227d52);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.app-select-error-border {
  border-color: #fca5a5;
  background: #fff9f9;
}

.app-select-disabled-border {
  background: #f3f4f6;
  opacity: 0.65;
  cursor: not-allowed;
}

/* Field */
.app-select-field {
  flex: 1;
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.75rem;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: #111827;
  font-family: inherit;
  outline: none;
  border-radius: 6px;
  cursor: pointer;
  appearance: none;
}

.app-select-field:disabled {
  cursor: not-allowed;
}

.app-select-field::placeholder {
  color: #c4c9d4;
}

/* Chevron icon */
.app-select-icon {
  position: absolute;
  right: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: #9ca3af;
  transition: color 0.2s;
}

.app-select-icon svg {
  width: 16px;
  height: 16px;
}

.app-select-focused .app-select-icon {
  color: var(--color-brand-main, #227d52);
}

.app-select-error-border .app-select-icon {
  color: #ef4444;
}

/* Error / hint text */
.app-select-error {
  font-size: 0.8125rem;
  color: #dc2626;
  margin: 0;
  font-family: inherit;
}

.app-select-hint {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  font-family: inherit;
}
</style>
