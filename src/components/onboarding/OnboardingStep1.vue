<template>
  <div>
    <div class="wizard-header">
      <h2>Personalización Inicial</h2>
      <p>Configuremos tu empresa y ticket. Estos datos son obligatorios.</p>
    </div>

    <div class="wizard-body">
      <div v-if="errors.length > 0" class="error-banner">
        <div v-for="(error, idx) in errors" :key="idx">
          {{ error.message }}
        </div>
      </div>

      <!-- Nombre de Empresa -->
      <div class="form-group">
        <label class="form-label required">Nombre de tu Empresa</label>
        <input
          v-model="form.company_name"
          type="text"
          class="form-control"
          :class="{ error: hasError('company_name') }"
          placeholder="Ej: Mi Tienda de Ropa"
          @input="clearError('company_name')"
        />
        <div v-if="hasError('company_name')" class="form-error">
          {{ getError('company_name') }}
        </div>
        <p class="form-hint">
          Este nombre aparecerá en tus recibos y reportes
        </p>
      </div>

      <!-- Nombre del Ticket -->
      <div class="form-group">
        <label class="form-label required">Nombre para tus Recibos</label>
        <input
          v-model="form.ticket_name"
          type="text"
          class="form-control"
          :class="{ error: hasError('ticket_name') }"
          placeholder="Ej: Recibo de Venta"
          @input="clearError('ticket_name')"
        />
        <div v-if="hasError('ticket_name')" class="form-error">
          {{ getError('ticket_name') }}
        </div>
        <p class="form-hint">
          Personaliza el nombre que verá el cliente en el ticket
        </p>
      </div>

      <!-- Preview -->
      <div class="preview-box">
        <div class="preview-box-title">Vista Previa</div>
        <div class="preview-content">
          <div class="preview-item">
            <span class="preview-label">Empresa:</span>
            <span class="preview-value">
              {{ form.company_name || 'Mi Tienda' }}
            </span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Tipo de Documento:</span>
            <span class="preview-value">
              {{ form.ticket_name || 'Recibo' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { validateStep1 } from '@/utils/onboarding.schemas';

interface Props {
  initialData?: {
    company_name: string;
    ticket_name: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'validate'): boolean;
}>();

const form = ref({
  company_name: props.initialData?.company_name || '',
  ticket_name: props.initialData?.ticket_name || ''
});

const errors = ref<any[]>([]);

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
  emit('update', validation.data);
  return true;
};

defineExpose({
  validateForm
});
</script>

<style scoped>
@import '@/styles/onboarding.css';
</style>
