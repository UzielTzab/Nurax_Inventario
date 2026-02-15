<template>
  <div class="inventory-view">
    <TopBar
      title="Administración de Inventario"
      description="Control de existencias y almacén"
      @quick-sell="handleQuickSell"
      @add-product="handleAddProduct"
    />
    
    <main class="view-main">
      <div class="view-container">
        <!-- Aquí irá el contenido de inventario -->
        <div class="placeholder">
          <p>Sección de Inventario</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import { useSnackbar } from '@/composables/useSnackbar'

const { enqueueSnackbar } = useSnackbar()

const handleQuickSell = () => {
  enqueueSnackbar({ title: 'Venta rápida', type: 'info' })
}

const handleAddProduct = () => {
  enqueueSnackbar({ title: 'Abriendo formulario', type: 'info' })
}
</script>

<style scoped>
.inventory-view {
  width: 100%;
}

.view-main {
  padding: 2rem;
}

.view-container {
  max-width: 1400px;
  margin: 0 auto;
}

.placeholder {
  text-align: center;
  padding: 3rem;
  color: var(--color-brand-secondary);
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
