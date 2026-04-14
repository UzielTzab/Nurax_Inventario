<template>
  <div>
    <WizardHeader
      title="Identidad de tu Tienda"
      description="Define tu nombre comercial y, si quieres, tu identificador fiscal."
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
        <div v-if="suggestedName" class="suggestion-row">
          <span>¿Quieres usar: <strong>{{ suggestedName }}</strong>?</span>
          <AppButton variant="outline" size="sm" @click="applySuggestion">
            Usar sugerencia
          </AppButton>
        </div>
      </div>

      <div class="form-group">
        <AppInput
          v-model="form.tax_id"
          label="Identificador fiscal (opcional)"
          placeholder="Ej: XAXX010101000"
          @update:modelValue="clearError('tax_id')"
        />
        <p class="form-hint">Lo puedes completar despues si aun no lo tienes.</p>
      </div>
    </WizardBody>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
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

const suggestedName = computed(() => {
  if (form.value.store_name.trim()) return '';
  const email = currentUser.value?.email || '';
  const domain = email.split('@')[1] || '';
  const base = domain.split('.')[0] || '';
  if (!base) return '';
  return base.charAt(0).toUpperCase() + base.slice(1);
});

const applySuggestion = () => {
  if (suggestedName.value) {
    form.value.store_name = suggestedName.value;
  }
};

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

.suggestion-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px dashed #cbd5f5;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #475569;
}

.form-hint {
  font-size: 0.8125rem;
  color: var(--color-wizard-text-grey);
  margin-top: 0.25rem;
  line-height: 1.4;
}
</style>
