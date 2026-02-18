<template>
  <div class="dashboard-layout">
    <Sidebar 
      :isOpen="isSidebarOpen" 
      @close="isSidebarOpen = false"
      @quick-sell="handleSidebarQuickSell" 
    />
    <div class="dashboard-content">
      <div class="mobile-header">
        <button @click="isSidebarOpen = true" class="btn-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span class="mobile-brand">Nurax Inventario</span>
      </div>
      <slot />
    </div>

    <!-- Floating Action Keyboard Shortcut Hint / Button -->
    <button class="fab-sell" @click="salesStore.openModal()" title="Nueva Venta">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 1.05.328 2.032.891 2.845a4.502 4.502 0 005.157 1.155A4.502 4.502 0 0013.5 19.5a4.502 4.502 0 00.99-9H6.18l-.51-1.912A1.984 1.984 0 003.886 6.75H2.25zM13.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M7.34 6.75L7.85 8.654h13.9a.75.75 0 00.58-1.218 5.755 5.755 0 00-4.08-1.921 7.252 7.252 0 00-4.755 0 5.755 5.755 0 00-4.08 1.921.75.75 0 00-.58 1.218z" />
      </svg>
    </button>
    
    <Teleport to="body">
        <SalesModal 
            v-if="salesStore.isModalOpen"
            :is-open="salesStore.isModalOpen" 
            :products="productStore.products"
            @close="salesStore.closeModal()" 
            @sale-completed="handleSaleCompleted"
        />
    </Teleport>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import SalesModal from '@/components/SalesModal.vue';
import { useSalesStore } from '@/stores/sales.store';
import { useProductStore } from '@/stores/product.store';

const salesStore = useSalesStore();
const productStore = useProductStore();
const isSidebarOpen = ref(false);

const handleSaleCompleted = (items: any[]) => {
  items.forEach(item => {
    productStore.decreaseStock(item.id, item.quantity);
  });
};

const handleSidebarQuickSell = () => {
    salesStore.openModal();
};

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
  padding: 2rem;
}

.mobile-header {
  display: none;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 40;
}

.btn-toggle {
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-brand {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
}

@media (max-width: 1024px) {
  .dashboard-content {
    margin-left: 0;
  }
  
  .mobile-header {
    display: flex;
  }
}

.fab-sell {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #F97316 !important;
  color: white;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  z-index: 90;
}

.fab-sell:hover {
  transform: scale(1.1);
  background: #EA580C !important;
}

.fab-sell svg {
  width: 28px;
  height: 28px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
