<template>
  <div>
    <div class="wizard-header">
      <h2>El Acelerador (Nicho de Negocio)</h2>
      <p>Elige tu giro para crear categorias listas para vender.</p>
    </div>

    <div class="wizard-body">
      <div v-if="errors.length > 0" class="error-banner">
        <div v-for="(error, idx) in errors" :key="idx">
          {{ error.message }}
        </div>
      </div>

      <div class="niche-grid">
        <button
          v-for="option in nicheOptions"
          :key="option.value"
          type="button"
          class="niche-card"
          :class="{ active: form.niche === option.value }"
          @click="selectNiche(option.value)"
        >
          <span class="niche-icon">{{ option.icon }}</span>
          <span class="niche-title">{{ option.label }}</span>
          <span class="niche-subtitle">{{ option.subtitle }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { validateStep2 } from '@/utils/onboarding.schemas';

interface Props {
  initialData?: {
    niche: 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA' | '';
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'validate'): boolean;
}>();

const form = ref({
  niche: props.initialData?.niche || ''
});

const errors = ref<any[]>([]);

const nicheOptions = [
  { value: 'ELECTRONICA', label: 'Electronica', icon: '📱', subtitle: 'Cables, cargadores, audio' },
  { value: 'ABARROTES', label: 'Abarrotes', icon: '🛒', subtitle: 'Snacks, bebidas, despensa' },
  { value: 'FARMACIA', label: 'Farmacia', icon: '💊', subtitle: 'Medicamentos y cuidado' },
  { value: 'FERRETERIA', label: 'Ferreteria', icon: '🔧', subtitle: 'Herramientas y repuestos' }
];

const selectNiche = (value: any) => {
  form.value.niche = value;
  errors.value = [];
  emit('update', { niche: value });
};

const validateForm = () => {
  const validation = validateStep2(form.value);
  if (!validation.success) {
    errors.value = validation.errors || [];
    return false;
  }
  errors.value = [];
  emit('update', validation.data);
  return true;
};

defineExpose({
  validateForm
});
</script>

<style scoped>
@import '@/styles/onboarding.css';

.niche-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.niche-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.25rem;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.niche-card:hover {
  border-color: var(--color-brand-main);
  box-shadow: 0 8px 20px rgba(34, 125, 82, 0.12);
}

.niche-card.active {
  border-color: var(--color-brand-main);
  background: rgba(34, 125, 82, 0.07);
}

.niche-icon {
  font-size: 1.8rem;
}

.niche-title {
  font-weight: 700;
  color: var(--color-wizard-text-dark);
}

.niche-subtitle {
  color: var(--color-wizard-text-grey);
  font-size: 0.85rem;
}
</style>
