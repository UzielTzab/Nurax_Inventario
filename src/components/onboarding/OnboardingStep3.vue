<template>
  <div>
    <WizardHeader
      title="¿Quién es tu proveedor principal?"
      description="Opcional, pero recomendado para acelerar tus compras."
    />

    <WizardBody>
      <div v-if="errors.length > 0" class="error-banner">
        <div v-for="(error, idx) in errors" :key="idx">
          {{ error.message }}
        </div>
      </div>

      <div class="form-group">
        <AppInput
          v-model="form.supplier_name"
          label="Nombre del proveedor"
          placeholder="Ej: TechWholesale"
          :error="hasError('supplier_name') ? getError('supplier_name') : ''"
          @update:modelValue="clearError('supplier_name')"
          :disabled="!form.include_supplier"
        />
      </div>

      <div class="form-group">
        <AppInput
          v-model="form.supplier_phone"
          label="Telefono del proveedor"
          placeholder="Ej: 555-123-4567"
          :disabled="!form.include_supplier"
        />
      </div>
    </WizardBody>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import WizardHeader from './WizardHeader.vue';
import WizardBody from './WizardBody.vue';
import { validateStep3 } from '@/utils/onboarding.schemas';

interface Props {
  initialData?: {
    include_supplier: boolean;
    supplier_name: string;
    supplier_phone: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'validate'): boolean;
  (e: 'skip'): void;
}>();

const form = ref({
  include_supplier: props.initialData?.include_supplier ?? true,
  supplier_name: props.initialData?.supplier_name || '',
  supplier_phone: props.initialData?.supplier_phone || ''
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

const hasError = (field: string) => errors.value.some(err => err.field === field);
const getError = (field: string) => errors.value.find(err => err.field === field)?.message || '';
const clearError = (field: string) => {
  errors.value = errors.value.filter(err => err.field !== field);
};

const skipStep = () => {
  form.value.include_supplier = false;
  form.value.supplier_name = '';
  form.value.supplier_phone = '';
  errors.value = [];
  emit('update', { ...form.value });
  emit('skip');
};

const validateForm = () => {
  const validation = validateStep3(form.value);
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
  skipStep,
  form
});
</script>

<style scoped>
@import '@/styles/onboarding.css';
</style>
