<template>
  <div class="alert-badges">
    <div class="alert-badge alert-low-stock">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      <span>{{ lowStockCount }} BAJO INVENTARIO</span>
    </div>
    <div class="alert-badge alert-out-of-stock">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
      </svg>
      <span>{{ outOfStockCount }} SIN INVENTARIO</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  lowStockCount: number;
  outOfStockCount: number;
}

defineProps<Props>();
</script>

<style scoped>
.alert-badges {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.alert-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.alert-badge svg {
  width: 16px;
  height: 16px;
}

.alert-low-stock {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.alert-out-of-stock {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@media (max-width: 640px) {
  .alert-badges {
    flex-wrap: wrap;
  }
  
  .alert-badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.75rem;
  }
}
</style>
