<template>
  <div class="dashboard-overview">
    <div class="overview-header">
      <h2 class="overview-title">Resumen del Panel</h2>
      <p class="overview-description">
        SISTEMA EN LÍNEA.
      </p>
    </div>
    <div class="overview-badges">
      <div class="badge badge-warning">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        <span>{{ lowStockCount }} STOCK BAJO</span>
      </div>
      <div class="badge badge-danger">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
        <span>{{ outOfStockCount }} SIN STOCK</span>
      </div>
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
.dashboard-overview {
  background: white;
  border: 1px solid #bec0c5;
  border-radius: 0px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.overview-header {
  margin-bottom: 1rem;
}

.overview-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.overview-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.overview-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.badge svg {
  width: 16px;
  height: 16px;
}

.badge-warning {
  background: rgba(249, 115, 22, 0.1);
  color: #ea580c;
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

@media (max-width: 640px) {
  .dashboard-overview {
    padding: 1rem;
  }
  
  .overview-title {
    font-size: 1.125rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.75rem;
  }
}
</style>
