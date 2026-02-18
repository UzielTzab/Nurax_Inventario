<template>
  <div class="snackbar-container">
    <Snackbar
      v-for="snackbar in snackbars"
      :key="snackbar.id"
      :type="snackbar.type"
      :title="snackbar.title"
      :message="snackbar.message"
      :duration="0"
      :closable="snackbar.closable"
      :show="snackbar.show"
      :action-label="snackbar.actionLabel"
      :on-action="snackbar.onAction"
      @close="closeSnackbar(snackbar.id)"
    />
  </div>
</template>

<script setup lang="ts">
import Snackbar from './Snackbar.vue';
import { useSnackbar } from '../../composables/useSnackbar';

const { snackbars, closeSnackbar } = useSnackbar();
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

.snackbar-container > * {
  pointer-events: auto;
}
</style>
