<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SnackbarContainer from '@/components/common/SnackbarContainer.vue'
// import LoadingScreen from '@/components/common/LoadingScreen.vue' // Comentado: no se usa en el flujo actual
import OnboardingWizard from '@/components/onboarding/OnboardingWizard.vue'
import { useAuth } from '@/composables/useAuth'
import { RouterView } from 'vue-router'

const { currentUser, initSession } = useAuth()
const showOnboarding = ref(false)

onMounted(async () => {
  // Esperar a que initSession() cargue el usuario antes de evaluar wizard
  await initSession()
  
  const user = currentUser.value as any
  // Solo clientes deben ver el wizard de onboarding
  if (!user || user.role !== 'cliente') {
    return
  }

  // Verificar si es primera vez y no está en onboarding
  const storeProfile = user.store_profile
  if (storeProfile && !storeProfile.is_first_setup_completed) {
    // Es primera vez: mostrar wizard
    showOnboarding.value = true
  }
})
</script>

<template>
  <div id="app-container">
    <OnboardingWizard v-if="showOnboarding" />
    <!-- LoadingScreen comentado por ahora: el flujo de login ya no lo activa
         Se puede descomentar si se necesita en el futuro para otras situaciones -->
    <!-- <LoadingScreen v-else-if="isLoadingScreen" @complete="handleLoadingComplete" /> -->
    <RouterView v-else />
    <SnackbarContainer />
  </div>
</template>

<style>
#app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
