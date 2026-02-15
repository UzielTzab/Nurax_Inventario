<template>
  <header class="top-bar">
    <div class="top-bar-content">
      <!-- Título y descripción -->
      <div class="header-info">
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-description">{{ description }}</p>
      </div>

      <!-- Acciones de la derecha -->
      <div class="header-actions">
        <!-- Búsqueda -->
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleSearch"
          />
        </div>

        <!-- Botón Quick Sell -->
        <button class="btn-quick-sell" @click="$emit('quickSell')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-7 2.5a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          Vender
        </button>

        <!-- Botón Add Product -->
        <button class="btn-add-product" @click="$emit('addProduct')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Añadir producto
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  showAlerts?: boolean;
  lowStockCount?: number;
  outOfStockCount?: number;
}

withDefaults(defineProps<Props>(), {
  title: 'Gestión de Inventario',
  description: 'Sistema en Línea',
  searchPlaceholder: 'Buscar productos, SKU o marcas...',
  showAlerts: false,
  lowStockCount: 0,
  outOfStockCount: 0
});

defineEmits<{
  quickSell: [];
  addProduct: [];
  search: [query: string];
}>();

const searchQuery = ref('');

const handleSearch = () => {
  // Emitir evento de búsqueda con debounce si es necesario
};
</script>

<style scoped>
.top-bar {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-card-border);
  padding: 1.5rem 2rem;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.alert-badges-wrapper {
  margin-top: 0.75rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 320px;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--color-card-fill);
  transition: all 0.2s;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-brand-secondary);
  background: white;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.btn-quick-sell,
.btn-add-product {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 20%;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-quick-sell svg,
.btn-add-product svg {
  width: 18px;
  height: 18px;
}

.btn-quick-sell {
  background: linear-gradient(180deg, #F97316 0%, #EA580C 100%);
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.1), 0 2px 4px -1px rgba(234, 88, 12, 0.06);
}

.btn-quick-sell:hover {
  background: linear-gradient(180deg, #EA580C 0%, #C2410C 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3), 0 4px 6px -2px rgba(234, 88, 12, 0.1);
}

.btn-add-product {
  background: var(--color-brand-accent);
  color: white;
  border-radius: 12px;
}

.btn-add-product:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (max-width: 1024px) {
  .top-bar-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }
}
</style>
