<script setup lang="ts">
import SnackbarContainer from '@/components/common/SnackbarContainer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app-container">
    <RouterView />
    <SnackbarContainer />
  </div>
</template>

<style>
#app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
