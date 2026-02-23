<template>
  <TransitionGroup name="snackbar-list" tag="div" class="snackbar-container">
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
  </TransitionGroup>
</template>

<script setup lang="ts">
import Snackbar from './Snackbar.vue';
import { useSnackbar } from '../../composables/useSnackbar';

const { snackbars, closeSnackbar } = useSnackbar();
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

/* Transitions for dynamic list stacking */
.snackbar-list-move,
.snackbar-list-enter-active,
.snackbar-list-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.snackbar-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.snackbar-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.snackbar-list-leave-active {
  position: absolute; /* Ensures smooth moving of remaining items */
  right: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .snackbar-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    align-items: stretch;
  }
}
</style>
