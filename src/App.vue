<script setup lang="ts">
import SnackbarContainer from '@/components/common/SnackbarContainer.vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import { useLoadingScreen } from '@/composables/useLoadingScreen'
import { useAuth } from '@/composables/useAuth'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const { isLoadingScreen, completeLoadingScreen } = useLoadingScreen()
const { currentUser } = useAuth()
const router = useRouter()

const handleLoadingComplete = async () => {
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
