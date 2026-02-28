<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import SnackbarContainer from '@/components/common/SnackbarContainer.vue'
import { useLoadingScreen } from '@/composables/useLoadingScreen'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isLoadingScreen, completeLoadingScreen } = useLoadingScreen()

const handleLoadingComplete = async () => {
  console.log('✅ Carga completada! Redirigiendo...')
  
  // Como ahora usamos la API, el currentUser ya fue seteado directo en el useAuth.
  const { currentUser } = useAuth()
  if (currentUser.value?.role === 'admin') {
    await router.push('/dashboard/clients')
  } else {
    await router.push('/dashboard/inventory')
  }
  
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
