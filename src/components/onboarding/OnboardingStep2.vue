<template>
  <div>
    <WizardHeader
      title="¿Cuál es el giro de tu negocio?"
      description="Selecciona tu giro para pre-cargar categorías listas para vender."
    />

    <WizardBody>
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
          <span v-if="form.niche === option.value" class="niche-check">✓</span>
        </button>
      </div>
    </WizardBody>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import WizardHeader from './WizardHeader.vue';
import WizardBody from './WizardBody.vue';
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

// Sincronizar cambios con el padre EN TIEMPO REAL
watch(
  () => form.value,
  (newForm) => {
    emit('update', { ...newForm });
  },
  { deep: true }
);

const nicheOptions = [
  { value: 'ELECTRONICA', label: 'Electronica', icon: '📱', subtitle: 'Cables, cargadores, audio' },
  { value: 'ABARROTES', label: 'Abarrotes', icon: '🛒', subtitle: 'Snacks, bebidas, despensa' },
  { value: 'FARMACIA', label: 'Farmacia', icon: '💊', subtitle: 'Medicamentos y cuidado' },
  { value: 'FERRETERIA', label: 'Ferreteria', icon: '🔧', subtitle: 'Herramientas y repuestos' }
];

const selectNiche = (value: any) => {
  form.value.niche = value;
  errors.value = [];
};

const validateForm = () => {
  const validation = validateStep2(form.value);
  if (!validation.success) {
    errors.value = validation.errors || [];
    return false;
  }
  errors.value = [];
  emit('update', { ...form.value });
  return true;
};

defineExpose({
  validateForm,
  form
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
  border: 1.5px solid var(--color-wizard-border);
  border-radius: 12px;
  padding: 1.25rem;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.niche-card:hover {
  border-color: var(--color-brand-main);
  box-shadow: 0 8px 20px rgba(230, 171, 23, 0.12);
}

.niche-card.active {
  border: 2px solid var(--color-brand-main);
  background: rgba(230, 171, 23, 0.07);
  box-shadow: 0 8px 20px rgba(230, 171, 23, 0.15);
}

.niche-check {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-main);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
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
