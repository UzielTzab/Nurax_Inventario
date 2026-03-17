<template>
  <div>
    <div class="wizard-header">
      <h2 v-if="isProcessing">Procesando...</h2>
      <h2 v-else-if="isSuccess">¡Listo! 🎉</h2>
      <h2 v-else>Detalles Opcionales Finales</h2>
      <p v-if="!isProcessing && !isSuccess">
        💡 Estos datos son opcionales. Puedes completarlos ahora o después en 
        <em>Configuración → Información General</em>
      </p>
    </div>

    <div class="wizard-body">
      <!-- Procesando -->
      <div v-if="isProcessing" style="text-align: center; padding: 2rem;">
        <div class="spinner"></div>
        <p style="margin-top: 1rem; color: var(--color-wizard-text-grey);">
          Finalizando tu configuración...
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

      <!-- Formulario de detalles opcionales -->
      <template v-else>
        <!-- Dirección -->
        <div class="form-group">
          <label class="form-label">📍 Dirección de tu Negocio</label>
          <input
            v-model="form.address"
            type="text"
            class="form-control"
            placeholder="Ej: Av. Reforma 123, Col. Centro, CDMX"
          />
          <p class="form-hint">(opcional)</p>
        </div>

        <!-- Teléfono/WhatsApp -->
        <div class="form-group">
          <label class="form-label">📞 Teléfono o WhatsApp</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-control"
            placeholder="Ej: +52 55 9876 5432"
          />
          <p class="form-hint">(opcional)</p>
        </div>

        <!-- Mensaje de agradecimiento -->
        <div class="form-group">
          <label class="form-label">💌 Mensaje de Agradecimiento (en el recibo)</label>
          <textarea
            v-model="form.ticket_message"
            class="form-textarea"
            placeholder="Ej: ¡Gracias por su compra! Vuelva pronto"
            rows="3"
          ></textarea>
          <p class="form-hint">(opcional - aparecerá en tus recibos)</p>
        </div>

        <!-- Info importante -->
        <div class="info-box">
          <div class="info-icon">ℹ️</div>
          <div>
            <strong>Pro tip:</strong> Cualquier dato que no completes ahora, puedes 
            agregarlo después en <em>Configuración → Información General</em>
          </div>
        </div>
      </template>
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
    store_name: string;
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
  (e: 'success', data: any): void;
}>();

const onboardingStore = useOnboardingStore();

const isProcessing = ref(false);
const isSuccess = ref(false);
const error = ref('');

const form = ref({
  address: '',
  phone: '',
  ticket_message: ''
});

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

    // 2. Completar onboarding con TODOS los datos
    const completeResponse = await onboardingService.completeOnboarding(
      props.step1Data.store_name,
      props.step1Data.ticket_name,
      form.value.address,
      form.value.phone,
      form.value.ticket_message
    );

    console.log('✅ Respuesta completeOnboarding:', completeResponse);

    if (!completeResponse.success) {
      error.value = completeResponse.message;
      isProcessing.value = false;
      return;
    }

    isSuccess.value = true;
    onboardingStore.reset();

    // Emitir evento con los datos del response para que el padre actualice el estado
    console.log('🔄 Emitiendo evento success con data:', completeResponse.data);
    emit('success', completeResponse.data);
  } catch (err: any) {
    error.value = err.message || 'Error al completar onboarding';
    isProcessing.value = false;
  }
};
</script>

<style scoped>
@import '@/styles/onboarding.css';

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-wizard-text-dark);
}

.form-control {
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.form-control:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  outline: none;
  line-height: 1.5;
}

.form-textarea:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.form-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.info-box {
  background: rgba(34, 125, 82, 0.08);
  border-left: 4px solid var(--color-brand-main);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-box strong {
  color: var(--color-wizard-text-dark);
}

.info-box em {
  color: var(--color-brand-main);
  font-style: italic;
}

.error-banner {
  background: #fee2e2;
  border-left: 4px solid #dc2626;
  padding: 1rem;
  border-radius: 8px;
  color: #7f1d1d;
  margin-bottom: 1.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(34, 125, 82, 0.1);
  border-top-color: var(--color-brand-main);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.wizard-footer {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.wizard-button {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.wizard-button.primary {
  background: var(--color-brand-main);
  color: white;
}

.wizard-button.primary:hover:not(:disabled) {
  background: #064a3a;
  transform: translateY(-1px);
}

.wizard-button.secondary {
  background: #e5e7eb;
  color: #374151;
}

.wizard-button.secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.wizard-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
