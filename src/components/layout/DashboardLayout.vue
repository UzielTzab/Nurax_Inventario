<template>
  <div class="app-shell">
    <!-- Sidebar flotante -->
    <aside class="sidebar-card" :class="{ 'mobile-open': isSidebarOpen }">
      <Sidebar
        :isOpen="isSidebarOpen"
        @close="isSidebarOpen = false"
        @quick-sell="handleSidebarQuickSell"
      />
    </aside>

    <!-- Overlay para móvil -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    />

    <!-- Columna derecha -->
    <div class="main-column">
      <!-- TopBar flotante -->
      <div class="topbar-card">
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="isSidebarOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Búsqueda -->
        <div class="search-bar">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
          <input type="text" placeholder="Buscar producto..." class="search-input" />
          <span class="search-kbd">⌘ K</span>
        </div>

        <!-- Área derecha topbar -->
        <div class="topbar-right">
          <!-- Notificaciones -->
          <button class="icon-btn" title="Notificaciones">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>

          <!-- Divisor -->
          <div class="topbar-divider"></div>

          <!-- Perfil -->
          <div class="topbar-profile">
            <div class="topbar-profile-text">
              <span class="topbar-name">Alex D.</span>
              <span class="topbar-email">alex@nurax.com</span>
            </div>
            <div class="topbar-avatar">
              <img src="https://ui-avatars.com/api/?name=Alex+D&background=06402b&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal (card blanca redondeada) -->
      <div class="content-card">
        <slot />
      </div>
    </div>

    <!-- Sales Modal -->
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
/* === SHELL PRINCIPAL === */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
  padding: 12px;
  gap: 12px;
  box-sizing: border-box;
}

/* === SIDEBAR FLOTANTE === */
.sidebar-card {
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: calc(100vh - 24px);
  position: sticky;
  top: 12px;
  transition: transform 0.3s ease;
}

/* === COLUMNA DERECHA === */
.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

/* === TOPBAR CARD === */
.topbar-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 8px;
  flex-shrink: 0;
}

.mobile-menu-btn svg {
  width: 22px;
  height: 22px;
}

.mobile-menu-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Search */
.search-bar {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 3.5rem 0.5rem 2.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: var(--color-brand-main);
  background: white;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.search-kbd {
  position: absolute;
  right: 0.75rem;
  font-size: 0.7rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
}

/* Topbar right */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f9fafb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: #e5e7eb;
}

.topbar-profile {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 12px;
  transition: background 0.2s;
}

.topbar-profile:hover {
  background: #f9fafb;
}

.topbar-profile-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.05rem;
}

.topbar-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.topbar-email {
  font-size: 0.7rem;
  color: #6b7280;
  line-height: 1.2;
}

.topbar-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #e5e7eb;
}

.topbar-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* === CONTENT CARD === */
.content-card {
  flex: 1;
  background: #ffffff;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 0;
}

/* === OVERLAY MÓVIL === */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .app-shell {
    padding: 0;
    gap: 0;
  }

  .sidebar-card {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    border-radius: 0 20px 20px 0;
    transform: translateX(-100%);
    z-index: 100;
  }

  .sidebar-card.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .sidebar-overlay {
    display: block;
  }

  .main-column {
    gap: 0;
  }

  .topbar-card {
    border-radius: 0;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: none;
  }

  .content-card {
    border-radius: 0;
    box-shadow: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .search-bar {
    max-width: none;
  }

  .topbar-profile-text {
    display: none;
  }
}
</style>
