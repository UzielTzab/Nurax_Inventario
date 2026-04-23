<template>
  <div class="app-select-wrapper" :class="wrapperClass">
    <!-- Label -->
    <label v-if="label" :for="selectId" class="app-select-label">
      {{ label }}
      <span v-if="required" class="app-select-required">*</span>
    </label>

    <!-- Custom dropdown button -->
    <div class="app-select-container" :class="containerClass">
      <button
        :id="selectId"
        type="button"
        :disabled="disabled"
        class="app-select-button"
        @click="isOpen = !isOpen"
        @blur="handleBlur"
      >
        <span class="app-select-value">
          {{
            modelValue
              ? options.find(opt => (opt.id || opt.value) === modelValue)?.name ||
                options.find(opt => (opt.id || opt.value) === modelValue)?.label ||
                modelValue
              : placeholder || 'Seleccionar'
          }}
        </span>
        <svg class="app-select-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      <Transition name="dropdown">
        <div v-if="isOpen" class="app-select-menu">
          <div
            v-for="option in options"
            :key="option.id || option.value"
            class="app-select-option"
            :class="{ 'app-select-option-selected': (option.id || option.value) === modelValue }"
            @click="selectOption(option)"
          >
            <span class="app-select-option-text">
              {{ option.name || option.label }}
            </span>
            <svg v-if="(option.id || option.value) === modelValue" class="app-select-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </Transition>
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

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>();

// Unique id for label:for binding
const autoId = `app-select-${Math.random().toString(36).slice(2, 7)}`;
const selectId = computed(() => props.id ?? autoId);

const isOpen = ref(false);
const isFocused = ref(false);

const wrapperClass = computed(() => ({
  'app-select-disabled': props.disabled,
  'app-select-has-error': !!props.error,
}));

const containerClass = computed(() => ({
  'app-select-focused': isFocused.value || isOpen.value,
  'app-select-error-border': !!props.error,
  'app-select-disabled-border': props.disabled,
  'app-select-open': isOpen.value,
}));

const selectOption = (option: SelectOption) => {
  const value = (option.id || option.value) as string | number;
  emit('update:modelValue', value);
  isOpen.value = false;
};

const handleBlur = () => {
  isFocused.value = false;
  setTimeout(() => {
    if (!isOpen.value) {
      isOpen.value = false;
    }
  }, 150);
};
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
  display: inline-flex;
  align-items: center;
  width: auto;
}

/* Button */
.app-select-button {
  position: relative;
  width: fit-content;
  min-width: 200px;
  max-width: 500px;
  padding: 0.5rem 0.625rem 0.5rem 0.875rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.9375rem;
  color: #111827;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  outline: none;
  text-align: left;
}

.app-select-button:hover:not(:disabled) {
  border-color: #c4b5a0;
  background-color: #f9fafb;
}

.app-select-button:disabled {
  background-color: #f3f4f6;
  opacity: 0.65;
  cursor: not-allowed;
}

.app-select-focused .app-select-button,
.app-select-open .app-select-button {
  border-color: var(--color-brand-main, #06402B);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
  background: #ffffff;
}

.app-select-error-border .app-select-button {
  border-color: #fca5a5;
  background: #fff9f9;
}

/* Value text */
.app-select-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chevron icon */
.app-select-chevron {
  width: 20px;
  height: 20px;
  color: var(--color-text-main, #06402B);
  pointer-events: none;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.app-select-open .app-select-chevron {
  transform: rotate(180deg);
  color: var(--color-text-main, #06402B);
}

.app-select-error-border .app-select-chevron {
  color: #ef4444;
}

/* Dropdown menu */
.app-select-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: max-content;
  min-width: 100%;
  margin-top: 0.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  z-index: 50;
  max-height: 300px;
  overflow-y: auto;
}

/* Scroll styling */
.app-select-menu::-webkit-scrollbar {
  width: 6px;
}

.app-select-menu::-webkit-scrollbar-track {
  background: transparent;
}

.app-select-menu::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.app-select-menu::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Option */
.app-select-option {
  padding: 0.625rem 1rem;
  color: #111827;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  border-bottom: 1px solid #f3f4f6;
}

.app-select-option:last-child {
  border-bottom: none;
}

.app-select-option:hover {
  background: #f9fafb;
  color: var(--color-brand-main, #06402B);
}

.app-select-option-selected {
  background: #fef8f0;
  color: var(--color-brand-main, #06402B);
  font-weight: 600;
}

.app-select-option-text {
  flex: 1;
  font-size: 0.9375rem;
}

/* Checkmark icon */
.app-select-checkmark {
  width: 18px;
  height: 18px;
  color: var(--color-brand-main, #06402B);
  flex-shrink: 0;
  margin-left: 0.5rem;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Error and hint text */
.app-select-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
}

.app-select-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.app-select-disabled {
  opacity: 0.6;
}
</style>
