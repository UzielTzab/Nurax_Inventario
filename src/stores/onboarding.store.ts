import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface OnboardingStep1Data {
  store_name: string;
  tax_id: string;
}

export interface OnboardingStep2Data {
  niche: 'ELECTRONICA' | 'ABARROTES' | 'FARMACIA' | 'FERRETERIA' | '';
}

export interface OnboardingStep3Data {
  include_supplier: boolean;
  supplier_name: string;
  supplier_phone: string;
}

export interface OnboardingStep4Data {
  default_cash: number;
}

export interface OnboardingFormData {
  step1: OnboardingStep1Data;
  step2: OnboardingStep2Data;
  step3: OnboardingStep3Data;
  step4: OnboardingStep4Data;
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentStep = ref(1);
  const isProcessing = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  const formData = ref<OnboardingFormData>({
    step1: {
      store_name: '',
      tax_id: ''
    },
    step2: {
      niche: ''
    },
    step3: {
      include_supplier: true,
      supplier_name: '',
      supplier_phone: ''
    },
    step4: {
      default_cash: 0
    }
  });

  const totalSteps = computed(() => 4);

  const progressPercentage = computed(() => {
    return (currentStep.value / totalSteps.value) * 100;
  });

  const nextStep = () => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
      error.value = null;
    }
  };

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
      error.value = null;
    }
  };

  const setStep1Data = (data: OnboardingStep1Data) => {
    formData.value.step1 = { ...formData.value.step1, ...data };
  };

  const setStep2Data = (data: Partial<OnboardingStep2Data>) => {
    formData.value.step2 = { ...formData.value.step2, ...data };
  };

  const setStep3Data = (data: Partial<OnboardingStep3Data>) => {
    formData.value.step3 = { ...formData.value.step3, ...data };
  };

  const setStep4Data = (data: Partial<OnboardingStep4Data>) => {
    formData.value.step4 = { ...formData.value.step4, ...data };
  };

  const setError = (message: string) => {
    error.value = message;
  };

  const setSuccess = (message: string) => {
    successMessage.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearSuccess = () => {
    successMessage.value = null;
  };

  const reset = () => {
    currentStep.value = 1;
    isProcessing.value = false;
    error.value = null;
    successMessage.value = null;
    formData.value = {
      step1: {
        store_name: '',
        tax_id: ''
      },
      step2: {
        niche: ''
      },
      step3: {
        include_supplier: true,
        supplier_name: '',
        supplier_phone: ''
      },
      step4: {
        default_cash: 0
      }
    };
  };

  return {
    currentStep,
    isProcessing,
    error,
    successMessage,
    formData,
    totalSteps,
    progressPercentage,
    nextStep,
    prevStep,
    setStep1Data,
    setStep2Data,
    setStep3Data,
    setStep4Data,
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    reset
  };
});
