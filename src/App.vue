<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import SnackbarContainer from '@/components/common/SnackbarContainer.vue'
import { useAuth } from '@/composables/useAuth'
import { useLoadingScreen } from '@/composables/useLoadingScreen'
import { useRouter } from 'vue-router'

const { completeLogin } = useAuth()
const router = useRouter()
const { isLoadingScreen, loadingUserEmail, completeLoadingScreen } = useLoadingScreen()

const handleLoadingComplete = async () => {
  console.log('✅ Carga completada! Completando login...')
  completeLogin(loadingUserEmail.value)
  
  // Navegar primero (mientras LoadingScreen está visible)
  await router.push('/dashboard')
  
  // Completar el loading después de navegar
  completeLoadingScreen()
}
</script>

<template>
  <div id="app-container">
    <LoadingScreen v-if="isLoadingScreen" @complete="handleLoadingComplete" />
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
