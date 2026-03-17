<template>
  <div>
    <div class="wizard-header">
      <h2>Información de tu Negocio</h2>
      <p>Estos datos son fundamentales y aparecerán en todos tus recibos.</p>
    </div>

    <div class="wizard-body">
      <div v-if="errors.length > 0" class="error-banner">
        <div v-for="(error, idx) in errors" :key="idx">
          {{ error.message }}
        </div>
      </div>

      <!-- Nombre del Negocio -->
      <div class="form-group">
        <label class="form-label required">¿Cuál es el nombre de tu negocio o tienda?</label>
        <input
          v-model="form.store_name"
          type="text"
          class="form-control"
          :class="{ error: hasError('store_name') }"
          placeholder="Ej: La Tienda de María"
          @input="clearError('store_name')"
        />
        <div v-if="hasError('store_name')" class="form-error">
          {{ getError('store_name') }}
        </div>
        <p class="form-hint">
          Este nombre aparecerá en todos tus recibos 📋
        </p>
      </div>

      <!-- Nombre del Comprobante (Pills Selection) -->
      <div class="form-group">
        <label class="form-label required">¿Cómo se llama tu comprobante de venta?</label>
        <p class="form-hint">
          Elige una opción o crea una personalizada 🧾
        </p>
        
        <!-- Pills Container -->
        <div class="pills-container">
          <AppButton
            v-for="option in ticketOptions"
            :key="option"
            variant="pill"
            size="sm"
            :active="form.ticket_name === option"
            @click="form.ticket_name = option"
          >
            {{ option }}
          </AppButton>
        </div>

        <!-- Input para personalizar (opcional) -->
        <div class="custom-input-section">
          <input
            v-model="form.ticket_name"
            type="text"
            class="form-control custom-input"
            :class="{ error: hasError('ticket_name') }"
            placeholder="O escribe uno personalizado..."
            @input="clearError('ticket_name')"
          />
          <p class="form-hint custom-hint">
            Si prefieres otro nombre, escríbelo aquí y aparecerá en tus recibos
          </p>
        </div>

        <div v-if="hasError('ticket_name')" class="form-error">
          {{ getError('ticket_name') }}
        </div>
      </div>

      <!-- Preview -->
      <div class="preview-box">
        <div class="preview-box-title">📄 Vista Previa del Recibo</div>
        <div class="preview-content">
          <div class="preview-item">
            <span class="preview-label">Negocio:</span>
            <span class="preview-value">
              {{ form.store_name || 'Mi Negocio' }}
            </span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Comprobante:</span>
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
import AppButton from '@/components/ui/AppButton.vue';
import { validateStep1 } from '@/utils/onboarding.schemas';

interface Props {
  initialData?: {
    store_name: string;
    ticket_name: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'validate'): boolean;
}>();

const ticketOptions = [
  'Recibo',
  'Factura',
  'Comprobante',
  'Boleta',
  'Ticket',
  'Tiquete'
];

const form = ref({
  store_name: props.initialData?.store_name || '',
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

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fafbfc;
  border-radius: 12px;
}

.custom-input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.custom-input {
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.custom-input:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.custom-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}
</style>
