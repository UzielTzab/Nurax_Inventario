<template>
  <div>
    <div class="wizard-header">
      <h2>Proveedor Principal</h2>
      <p>Opcional, pero recomendado para acelerar tus compras.</p>
    </div>

    <div class="wizard-body">
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

      <div class="wizard-actions-row">
        <AppButton variant="outline" size="sm" @click="skipStep">
          Saltar este paso
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
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
}>();

const form = ref({
  include_supplier: props.initialData?.include_supplier ?? true,
  supplier_name: props.initialData?.supplier_name || '',
  supplier_phone: props.initialData?.supplier_phone || ''
});

const errors = ref<any[]>([]);

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
};

const validateForm = () => {
  const validation = validateStep3(form.value);
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

.wizard-actions-row {
  display: flex;
  justify-content: flex-end;
}
</style>
