import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface OnboardingStep1Data {
  store_name: string;
  ticket_name: string;
}

export interface OnboardingStep2Data {
  excelFile: File | null;
  products: any[];
  columnMappings: {
    name: string;
    sku: string;
    category?: string;
    stock?: string;
    price?: string;
    supplier?: string;
  };
}

export interface OnboardingStep3Data {
  address: string;
  phone: string;
  ticket_message: string;
}

export interface OnboardingFormData {
  step1: OnboardingStep1Data;
  step2: OnboardingStep2Data;
  step3: OnboardingStep3Data;
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentStep = ref(1);
  const isProcessing = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  const formData = ref<OnboardingFormData>({
    step1: {
      store_name: '',
      ticket_name: ''
    },
    step2: {
      excelFile: null,
      products: [],
      columnMappings: {
        name: 'name',
        sku: 'sku',
        category: 'category',
        stock: 'stock',
        price: 'price',
        supplier: 'supplier'
      }
    },
    step3: {
      address: '',
      phone: '',
      ticket_message: ''
    }
  });

  const totalSteps = computed(() => 3);

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
        ticket_name: ''
      },
      step2: {
        excelFile: null,
        products: [],
        columnMappings: {
          name: 'name',
          sku: 'sku',
          category: 'category',
          stock: 'stock',
          price: 'price',
          supplier: 'supplier'
        }
      },
      step3: {
        address: '',
        phone: '',
        ticket_message: ''
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
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    reset
  };
});
