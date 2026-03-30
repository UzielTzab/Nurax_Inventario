<template>
  <div class="wizard-container">
    <div class="wizard-layout">
      <!-- Sidebar izquierdo con pasos -->
      <aside class="wizard-sidebar">
        <div class="sidebar-logo">
          <img src="/images/nurax_logo_app.png" alt="Nurax Logo" class="logo-icon" />
          <span>Nurax</span>
        </div>

        <nav class="steps-nav">
          <div
            v-for="step in 3"
            :key="step"
            :class="[
              'step-item',
              { 'step-item--active': store.currentStep === step },
              { 'step-item--completed': store.currentStep > step }
            ]"
          >
            <div class="step-number">
              <span v-if="store.currentStep > step" class="step-checkmark">✓</span>
              <span v-else>{{ step }}</span>
            </div>
            <div class="step-content">
              <div class="step-title">{{ stepTitles[step - 1]?.title ?? 'Paso ' + step }}</div>
              <div class="step-subtitle">{{ stepTitles[step - 1]?.subtitle ?? 'Completa este paso' }}</div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Panel derecho con contenido -->
      <div class="wizard-content-wrapper">
        <div class="wizard-card">
          <!-- Step 1: Información -->
          <OnboardingStep1
            v-if="store.currentStep === 1"
            ref="step1Ref"
            :initial-data="store.formData.step1"
            @update="updateStep1"
            @validate="validateStep1"
          />

          <!-- Step 2: Personalización -->
          <OnboardingStep2
            v-if="store.currentStep === 2"
            ref="step2Ref"
            :initial-data="store.formData.step2"
            @update="updateStep2"
          />

          <!-- Step 3: Finalizar -->
          <OnboardingStep3
            v-if="store.currentStep === 3"
            :step1-data="store.formData.step1"
            :step2-data="store.formData.step2"
            @back="goBack"
            @success="onSuccess"
          />

          <!-- Footer con Botones (no visible en step 3) -->
          <div v-if="store.currentStep !== 3" class="wizard-footer">
            <div class="footer-actions">
              <AppButton
                variant="outline"
                size="md"
                @click="goBack"
                :disabled="store.currentStep === 1 || isProcessing"
              >
                Atrás
              </AppButton>
              <AppButton
                variant="fill"
                size="md"
                @click="goNext"
                :disabled="isProcessing"
              >
                <span v-if="!isProcessing">Siguiente</span>
                <span v-else><div class="spinner"></div></span>
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useOnboardingStore } from '@/stores/onboarding.store';
import AppButton from '@/components/ui/AppButton.vue';
import OnboardingStep1 from './OnboardingStep1.vue';
import OnboardingStep2 from './OnboardingStep2.vue';
import OnboardingStep3 from './OnboardingStep3.vue';

const router = useRouter();
const { currentUser } = useAuth();
const store = useOnboardingStore();
const step1Ref = ref<any>(null);
const step2Ref = ref<any>(null);
const isProcessing = ref(false);

const stepTitles: Array<{ title: string; subtitle: string }> = [
  { title: 'Información', subtitle: 'Datos básicos' },
  { title: 'Personalización', subtitle: 'Diseño y marca' },
  { title: 'Finalizar', subtitle: 'Lanzamiento' }
];

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

/* Comentado: No se usa actualmente, pero podría ser útil en el futuro
const skipWizard = () => {
  console.log('⏭️ Saltando el wizard...');
  // Para ahora solo lo dejamos ir a inventory
  // En el futuro podrías marcar un flag de "skipped_wizard"
  router.push('/dashboard/inventory');
};
*/

const onSuccess = (storeProfileData: any) => {
  console.log('🎉 OnboardingWizard: onSuccess llamado con data:', storeProfileData);
  
  if (currentUser.value && currentUser.value.store_profile) {
    console.log('✅ Antes de actualizar:', currentUser.value.store_profile.is_first_setup_completed);
    currentUser.value.store_profile = {
      ...currentUser.value.store_profile,
      ...storeProfileData,
      is_first_setup_completed: true
    };
    console.log('✅ Después de actualizar:', currentUser.value.store_profile?.is_first_setup_completed);
  }
  
  store.reset();
  console.log('🚀 Redirigiendo a /dashboard/inventory');
  router.push('/dashboard/inventory');
};
</script>

<style scoped>
.wizard-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.wizard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 1000px;
  min-height: 600px;
}

/* ──────────────────────────────────── */
/* Sidebar Izquierdo */
/* ──────────────────────────────────── */

.wizard-sidebar {
  background: linear-gradient(to bottom, #227d52, #13452d);
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  padding: 6px;
  object-fit: contain;
}

.steps-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step-item {
  display: flex;
  gap: 1rem;
  opacity: 0.6;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.step-item--active {
  opacity: 1;
}

.step-item--completed {
  opacity: 0.8;
}

.step-number {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.step-item--active .step-number {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.step-item--completed .step-number {
  background: rgba(255, 255, 255, 0.2);
}

.step-checkmark {
  font-size: 1.25rem;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.step-subtitle {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* ──────────────────────────────────── */
/* Panel de Contenido Derecho */
/* ──────────────────────────────────── */

.wizard-content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 3rem 2.5rem;
  overflow-y: auto;
  background: white;
}

.wizard-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.wizard-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.footer-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .wizard-layout {
    grid-template-columns: 1fr;
  }

  .wizard-sidebar {
    padding: 1.5rem;
    gap: 2rem;
  }

  .wizard-content-wrapper {
    padding: 2rem 1.5rem;
  }

  .footer-actions {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
