<template>
  <div class="relative" ref="dropdownRef">
    <button 
      @click="isOpen = !isOpen"
      :class="buttonClasses"
      type="button"
    >
      <component :is="icon" class="h-5 w-5 mr-2 text-gray-400" />
      <span :class="labelClasses">{{ displayLabel }}</span>
      <svg 
        class="ml-2 h-4 w-4 transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        :class="dropdownClasses"
      >
        <button 
          @click="selectOption('')"
          class="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors rounded-t-lg"
        >
          {{ allLabel }}
        </button>
        <button 
          v-for="option in options" 
          :key="option"
          @click="selectOption(option)"
          class="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
          :class="{ 'bg-brand-primary/20 text-brand-primary': modelValue === option }"
        >
          {{ option }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Component } from 'vue';

interface Props {
  modelValue: string;
  options: string[];
  label?: string;
  allLabel?: string;
  icon: Component;
  theme?: 'dark' | 'light';
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Filtrar',
  allLabel: 'Todos',
  theme: 'dark'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const displayLabel = computed(() => {
  return props.modelValue || props.label;
});

const buttonClasses = computed(() => {
  const base = 'flex items-center px-4 py-2 border rounded-lg transition-colors';
  
  if (props.theme === 'dark') {
    return `${base} bg-dark-input border-dark-border text-white hover:bg-white/5`;
  }
  return `${base} bg-white border-gray-300 text-gray-700 hover:bg-gray-50`;
});

const labelClasses = computed(() => {
  return props.theme === 'dark' ? 'text-white' : 'text-gray-700';
});

const dropdownClasses = computed(() => {
  const base = 'absolute z-10 mt-2 w-48 rounded-lg shadow-xl border overflow-hidden';
  
  if (props.theme === 'dark') {
    return `${base} bg-dark-card border-dark-border`;
  }
  return `${base} bg-white border-gray-200`;
});

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
