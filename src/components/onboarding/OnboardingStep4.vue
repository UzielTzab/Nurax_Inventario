<template>
  <div>
    <div class="wizard-header">
      <h2>Configuracion de la Caja</h2>
      <p>Define el fondo inicial sugerido para abrir la caja.</p>
    </div>

    <div class="wizard-body">
      <div v-if="error" class="error-banner">
        {{ error }}
      </div>

      <div class="form-group">
        <AppInput
          v-model.number="form.default_cash"
          type="number"
          label="Fondo inicial sugerido"
          placeholder="Ej: 500"
        />
        <div class="quick-buttons">
          <AppButton variant="outline" size="sm" @click="setAmount(500)">$500</AppButton>
          <AppButton variant="outline" size="sm" @click="setAmount(1000)">$1000</AppButton>
          <AppButton variant="outline" size="sm" @click="setAmount(2000)">$2000</AppButton>
        </div>
      </div>

      <div v-if="isProcessing" class="processing-box">
        <div class="spinner"></div>
        <p>Configurando tu tienda...</p>
      </div>
    </div>

    <div class="wizard-footer">
      <div class="footer-actions">
        <AppButton variant="outline" size="md" @click="goBack" :disabled="isProcessing">
          Atras
        </AppButton>
        <AppButton variant="fill" size="md" @click="finalize" :disabled="isProcessing">
          <span v-if="!isProcessing">¡Comenzar a vender!</span>
          <span v-else>Procesando...</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
import { onboardingService } from '@/services/onboarding.service';
import { validateStep4 } from '@/utils/onboarding.schemas';

interface Props {
  step1Data: {
    store_name: string;
    tax_id: string;
  };
  step2Data: {
    niche: 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA' | '';
  };
  step3Data: {
    include_supplier: boolean;
    supplier_name: string;
    supplier_phone: string;
  };
  step4Data: {
    default_cash: number;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'success', data: any): void;
  (e: 'update', data: any): void;
}>();

const form = ref({
  default_cash: props.step4Data?.default_cash ?? 0
});

const isProcessing = ref(false);
const error = ref('');

const setAmount = (amount: number) => {
  form.value.default_cash = amount;
  emit('update', { default_cash: form.value.default_cash });
};

watch(
  () => form.value.default_cash,
  (value) => {
    emit('update', { default_cash: value });
  }
);

const goBack = () => {
  emit('back');
};

const finalize = async () => {
  error.value = '';
  const validation = validateStep4(form.value);
  if (!validation.success) {
    error.value = validation.errors?.[0]?.message || 'Valida el fondo inicial';
    return;
  }

  if (!props.step2Data.niche) {
    error.value = 'Selecciona un nicho de negocio antes de continuar.';
    return;
  }

  emit('update', { default_cash: form.value.default_cash });

  isProcessing.value = true;
  try {
    const payload = {
      tienda: {
        nombre: props.step1Data.store_name,
        identificador_fiscal: props.step1Data.tax_id || '',
        nicho: props.step2Data.niche as 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA'
      },
      configuracion: {
        fondo_inicial_defecto: form.value.default_cash
      },
      proveedor_inicial: {
        incluir: props.step3Data.include_supplier,
        nombre: props.step3Data.supplier_name,
        telefono: props.step3Data.supplier_phone
      }
    };

    const response = await onboardingService.submitWizard(payload);
    if (!response.success) {
      error.value = response.message;
      isProcessing.value = false;
      return;
    }

    emit('success', response.data);
  } catch (err: any) {
    error.value = err.message || 'Error al completar el wizard';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
@import '@/styles/onboarding.css';

.quick-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.processing-box {
  text-align: center;
  padding: 2rem 0;
  color: var(--color-wizard-text-grey);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(34, 125, 82, 0.1);
  border-top-color: var(--color-brand-main);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
