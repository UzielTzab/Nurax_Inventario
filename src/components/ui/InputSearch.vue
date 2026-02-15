<template>
  <div :class="containerClasses">
    <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
      <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
    </span>
    <input 
      :value="modelValue"
      @input="handleInput"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
    >
    <button
      v-if="modelValue && clearable"
      @click="handleClear"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
      type="button"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

interface Props {
  modelValue: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: 'Buscar...',
  disabled: false,
  clearable: true,
  fullWidth: true
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
};

const containerClasses = computed(() => {
  const base = 'relative flex-1';
  const width = props.fullWidth ? 'w-full' : 'max-w-lg';
  return `${base} ${width}`;
});

const inputClasses = computed(() => {
  return 'w-full pl-10 pr-10 py-2 bg-dark-input border border-dark-border text-white rounded-lg focus:border-transparent placeholder-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
});
</script>
