<template>
  <div class="wizard-container">
    <div class="wizard-inner">
      <div class="wizard-card">
        <!-- Indicador de Progreso -->
        <StepIndicator
          :current-step="store.currentStep"
          :total-steps="store.totalSteps"
        />

        <!-- Step 1: Personalización -->
        <OnboardingStep1
          v-if="store.currentStep === 1"
          ref="step1Ref"
          :initial-data="store.formData.step1"
          @update="updateStep1"
          @validate="validateStep1"
        />

        <!-- Step 2: Excel Import -->
        <OnboardingStep2
          v-if="store.currentStep === 2"
          ref="step2Ref"
          :initial-data="store.formData.step2"
          @update="updateStep2"
        />

        <!-- Step 3: Confirmación -->
        <OnboardingStep3
          v-if="store.currentStep === 3"
          :step1-data="store.formData.step1"
          :step2-data="store.formData.step2"
          @back="goBack"
          @success="onSuccess"
        />

        <!-- Footer con Botones (no visible en step 3) -->
        <div v-if="store.currentStep !== 3" class="wizard-footer">
          <button
            class="wizard-button secondary"
            @click="goBack"
            :disabled="store.currentStep === 1 || store.isProcessing"
          >
            Atrás
          </button>
          <button
            class="wizard-button primary"
            @click="goNext"
            :disabled="store.isProcessing"
          >
            <span v-if="store.currentStep < store.totalSteps">Siguiente</span>
            <span v-else>Finalizar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding.store';
import StepIndicator from './StepIndicator.vue';
import OnboardingStep1 from './OnboardingStep1.vue';
import OnboardingStep2 from './OnboardingStep2.vue';
import OnboardingStep3 from './OnboardingStep3.vue';

const emit = defineEmits<{
  // Eventos removidos: el wizard navega directamente al dashboard
}>();

const store = useOnboardingStore();
const step1Ref = ref<any>(null);
const step2Ref = ref<any>(null);

const updateStep1 = (data: any) => {
  store.setStep1Data(data);
};

const updateStep2 = (data: any) => {
  store.setStep2Data(data);
};

const validateStep1 = () => {
  return step1Ref.value?.validateForm() || false;
};

const goNext = () => {
  if (store.currentStep === 1) {
    // Validar antes de avanzar
    if (!validateStep1()) {
      return;
    }
  }

  if (store.currentStep < store.totalSteps) {
    store.nextStep();
  }
};

const goBack = () => {
  if (store.currentStep > 1) {
    store.prevStep();
  }
};

const onSuccess = () => {
  store.reset();
  // Redirigir directamente al dashboard (usuario ya está autenticado)
  window.location.href = '/dashboard';
};
</script>

<style scoped>
@import '@/styles/onboarding.css';
</style>
