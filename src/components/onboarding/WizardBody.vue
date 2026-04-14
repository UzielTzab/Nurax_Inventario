<template>
  <div class="wizard-body">
    <slot />
  </div>
</template>

<style scoped>
.wizard-body {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 500px);
}

:deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

:deep(.form-group:last-child) {
  margin-bottom: 0;
}

:deep(.error-banner) {
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-wizard-error);
  border-radius: 12px;
  color: var(--color-wizard-error);
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
}

:deep(.wizard-actions-row) {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
