<template>
  <div>
    <WizardHeader
      title="Bienvenido a Nurax. Creemos tu tienda."
      description="Cuéntanos cómo se llama tu negocio. El identificador fiscal lo puedes agregar después."
    />

    <WizardBody>
      <div v-if="errors.length > 0" class="error-banner">
        <div v-for="(error, idx) in errors" :key="idx">
          {{ error.message }}
        </div>
      </div>

      <div class="form-group">
        <AppInput
          v-model="form.store_name"
          label="Nombre de la tienda"
          placeholder="Ej: Abajurax"
          :error="hasError('store_name') ? getError('store_name') : ''"
          required
          @update:modelValue="clearError('store_name')"
        />
      </div>

      <div class="form-group">
        <AppInput
          v-model="form.tax_id"
          label="Identificador fiscal (opcional)"
          placeholder="Ej: XAXX010101000"
          @update:modelValue="clearError('tax_id')"
        />
        <p class="form-hint">Lo puedes completar después si aún no lo tienes.</p>
      </div>
    </WizardBody>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import WizardHeader from './WizardHeader.vue';
import WizardBody from './WizardBody.vue';
import { useAuth } from '@/composables/useAuth';
import { validateStep1 } from '@/utils/onboarding.schemas';

interface Props {
  initialData?: {
    store_name: string;
    tax_id: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'validate'): boolean;
}>();

const { currentUser } = useAuth();

const form = ref({
  store_name: props.initialData?.store_name || '',
  tax_id: props.initialData?.tax_id || ''
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

const hasError = (field: string) => {
  return errors.value.some(err => err.field === field);
};

const getError = (field: string) => {
  const error = errors.value.find(err => err.field === field);
  return error?.message || '';
};

const clearError = (field: string) => {
  errors.value = errors.value.filter(err => err.field !== field);
};

const validateForm = () => {
  const validation = validateStep1(form.value);

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

.form-hint {
  font-size: 0.8125rem;
  color: var(--color-wizard-text-grey);
  margin-top: 0.25rem;
  line-height: 1.4;
}
</style>
