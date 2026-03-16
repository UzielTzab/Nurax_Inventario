<template>
  <div>
    <div class="wizard-header">
      <h2 v-if="isProcessing">Procesando...</h2>
      <h2 v-else-if="isSuccess">¡Listo! 🎉</h2>
      <h2 v-else>Confirmar Datos</h2>
      <p v-if="!isProcessing && !isSuccess">Revisa los datos antes de finalizar</p>
    </div>

    <div class="wizard-body">
      <!-- Procesando -->
      <div v-if="isProcessing" style="text-align: center; padding: 2rem;">
        <div class="spinner"></div>
        <p style="margin-top: 1rem; color: var(--color-wizard-text-grey);">
          Importando tus datos...
        </p>
      </div>

      <!-- Success -->
      <div v-else-if="isSuccess" style="text-align: center; padding: 2rem;">
        <div class="success-icon">✅</div>
        <h3 style="color: var(--color-wizard-text-dark); margin-bottom: 0.5rem;">
          ¡Onboarding Completado!
        </h3>
        <p style="color: var(--color-wizard-text-grey);">
          Tu cuenta está lista. Redirigiendo en breve...
        </p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-banner">
        {{ error }}
      </div>

      <!-- Resumen -->
      <div v-else>
        <div class="preview-box">
          <div class="preview-box-title">Información de Empresa</div>
          <div class="preview-content">
            <div class="preview-item">
              <span class="preview-label">Nombre:</span>
              <span class="preview-value">{{ step1Data.company_name }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">Tipo de Recibo:</span>
              <span class="preview-value">{{ step1Data.ticket_name }}</span>
            </div>
          </div>
        </div>

        <div v-if="step2Data.products && step2Data.products.length > 0" class="preview-box">
          <div class="preview-box-title">Productos a Importar</div>
          <div class="preview-content">
            <div class="preview-item">
              <span class="preview-label">Total de Productos:</span>
              <span class="preview-value">{{ step2Data.products.length }}</span>
            </div>
            <div v-if="step2Data.products.length > 0" class="preview-item">
              <span class="preview-label">Primero:</span>
              <span class="preview-value">{{ step2Data.products[0].name }}</span>
            </div>
          </div>
        </div>

        <div v-else class="preview-box">
          <div class="preview-box-title">Productos</div>
          <div class="preview-content">
            <div class="preview-item">
              <span class="preview-label">Estado:</span>
              <span class="preview-value">Sin productos importados (agregarás después)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con Botones -->
    <div v-if="!isProcessing && !isSuccess" class="wizard-footer">
      <button class="wizard-button secondary" @click="goBack" :disabled="isProcessing">
        Atrás
      </button>
      <button class="wizard-button primary" @click="finalize" :disabled="isProcessing">
        <span v-if="!isProcessing">Finalizar</span>
        <span v-else><div class="spinner"></div></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { onboardingService } from '@/services/onboarding.service';

interface Props {
  step1Data: {
    company_name: string;
    ticket_name: string;
  };
  step2Data: {
    excelFile: File | null;
    products: any[];
    columnMappings: Record<string, string>;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'success'): void;
}>();

const onboardingStore = useOnboardingStore();

const isProcessing = ref(false);
const isSuccess = ref(false);
const error = ref('');

const goBack = () => {
  emit('back');
};

const finalize = async () => {
  isProcessing.value = true;
  error.value = '';

  try {
    // 1. Importar productos si hay
    if (props.step2Data.products.length > 0) {
      const productsToImport = onboardingService.mapExcelToProducts(
        props.step2Data.products,
        props.step2Data.columnMappings
      );

      // Validar que los datos sean correctos
      const validation = onboardingService.validateProductColumns(
        props.step2Data.products,
        props.step2Data.columnMappings
      );

      if (!validation.valid) {
        error.value = validation.error || 'Error en validación de productos';
        isProcessing.value = false;
        return;
      }

      const importResponse = await onboardingService.uploadProducts(productsToImport);

      if (!importResponse.success) {
        error.value = importResponse.message;
        isProcessing.value = false;
        return;
      }
    }

    // 2. Completar onboarding
    const completeResponse = await onboardingService.completeOnboarding(
      props.step1Data.company_name,
      props.step1Data.ticket_name
    );

    if (!completeResponse.success) {
      error.value = completeResponse.message;
      isProcessing.value = false;
      return;
    }

    isSuccess.value = true;
    onboardingStore.reset();

    // Redirigir después de 2 segundos
    setTimeout(() => {
      emit('success');
    }, 2000);
  } catch (err: any) {
    error.value = err.message || 'Error al completar onboarding';
    isProcessing.value = false;
  }
};
</script>

<style scoped>
@import '@/styles/onboarding.css';
</style>
