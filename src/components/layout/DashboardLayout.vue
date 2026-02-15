<template>
  <div class="dashboard-layout">
    <Sidebar @quick-sell="$emit('quickSell')" />
    <div class="dashboard-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';

defineEmits(['quickSell']);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
}

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin-left: 220px; /* Width of sidebar */
}

@media (max-width: 1024px) {
  .dashboard-content {
    margin-left: 0;
  }
}
</style>
