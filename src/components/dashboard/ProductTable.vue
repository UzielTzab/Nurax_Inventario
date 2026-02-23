<template>
  <div class="product-table-wrapper">
    <!-- Table Header -->
    <div class="table-section-header">
      <span class="table-section-title">Listado de Productos</span>
      <div class="table-header-right">
        <button class="btn-filter" @click="toggleFilterPanel" :class="{ active: filterPanelOpen }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.2 7.49 1 10 1s4.973.2 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
          </svg>
          Filtrar
        </button>
      </div>
    </div>

    <!-- Filter Panel (dropdown) -->
    <Transition name="filter-slide">
      <div v-if="filterPanelOpen" class="filter-panel">
        <div class="filter-panel-inner">
          <!-- Stock status filter -->
          <div class="filter-group">
            <label class="filter-label">Estado de stock</label>
            <select
              class="filter-select"
              :value="localFilters.stockFilter"
              @change="onFilterChange('stockFilter', ($event.target as HTMLSelectElement).value)"
            >
              <option value="all">Todos los productos ({{ totalCount }})</option>
              <option value="low-stock">Bajo inventario ({{ lowStockCount }})</option>
              <option value="out-of-stock">Sin inventario ({{ outOfStockCount }})</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Categoría</label>
            <select
              class="filter-select"
              :value="localFilters.category"
              @change="onFilterChange('category', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Rango de precio</label>
            <select
              class="filter-select"
              :value="localFilters.priceRange"
              @change="onFilterChange('priceRange', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Cualquier precio</option>
              <option value="0-500">$0 – $500</option>
              <option value="500-1000">$500 – $1,000</option>
              <option value="1000-5000">$1,000 – $5,000</option>
              <option value="5000+">Más de $5,000</option>
            </select>
          </div>
          <button class="btn-clear-filters" @click="clearFilters">
            Limpiar filtros
          </button>
        </div>
      </div>
    </Transition>

    <!-- Table -->
    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th class="th-product">PRODUCTO</th>
            <th class="th-sku">SKU</th>
            <th class="th-stock">STOCK</th>
            <th class="th-price">PRECIO</th>
            <th class="th-status">STATUS</th>
            <th class="th-actions">
              <div v-if="selectedIds.length > 0" class="bulk-actions">
                <button class="btn-bulk-delete" @click="$emit('delete-multiple', selectedIds)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                  </svg>
                  <span>({{ selectedIds.length }})</span>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="product-row"
            :class="{ 'row-out-of-stock': product.stock === 0 }"
          >
            <td class="td-product">
              <div class="product-info">
                <div class="product-image">
                  <img v-if="product.image" :src="product.image" :alt="product.name" />
                  <div v-else class="empty-image">
                    <PhotoIcon class="empty-icon" />
                  </div>
                </div>
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-category">{{ product.category }}</div>
                </div>
              </div>
            </td>
            <td class="td-sku">
              <span class="sku-code">{{ product.sku }}</span>
            </td>
            <td class="td-stock">
              <div class="stock-info">
                <div class="stock-value">{{ product.stock }}</div>
                <button
                  v-if="product.stock === 0"
                  class="btn-restock-sm"
                  @click="$emit('restock', product)"
                  title="Reabastecer inventario"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312H11.75a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
                  </svg>
                  Reabastecer
                </button>
              </div>
            </td>
            <td class="td-price">
              <span class="price">${{ formatPrice(product.price) }} MXN</span>
            </td>
            <td class="td-status">
              <Badge :variant="getStatusVariant(product.stock)">
                {{ getStatusText(product.stock) }}
              </Badge>
            </td>
            <td class="td-actions">
              <div class="action-menu-wrapper" :ref="el => setMenuRef(el as HTMLElement, product.id)">
                <button
                  class="btn-dots"
                  @click.stop="toggleMenu(product.id)"
                  :class="{ active: openMenuId === product.id }"
                  title="Acciones"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                <Transition name="menu-pop">
                  <div v-if="openMenuId === product.id" class="action-dropdown">
                    <button class="dropdown-item" @click="handleEdit(product)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                      Editar
                    </button>
                    <button class="dropdown-item item-danger" @click="handleDelete(product)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </Transition>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="products.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <h3>No se encontraron productos</h3>
        <p>Ajusta los filtros o agrega un nuevo producto</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { PhotoIcon } from '@heroicons/vue/24/outline';
import Badge from '../ui/Badge.vue';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}

export interface Filters {
  category: string;
  supplier: string;
  priceRange: string;
  stockFilter: string;
}

interface Props {
  products: Product[];
  filters?: Filters;
  lowStockCount?: number;
  outOfStockCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({ category: '', supplier: '', priceRange: '', stockFilter: 'all' }),
  lowStockCount: 0,
  outOfStockCount: 0
});

const totalCount = computed(() => props.products.length);

const emit = defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
  'delete-multiple': [ids: string[]];
  restock: [product: Product];
  'update:filters': [filters: Filters];
}>();

// --- Selection ---
const selectedIds = ref<string[]>([]);

// --- Filter panel ---
const filterPanelOpen = ref(false);
const localFilters = ref<Filters>({ ...props.filters });

const categories = computed(() => {
  const cats = new Set(props.products.map(p => p.category));
  return Array.from(cats).sort();
});

const toggleFilterPanel = () => {
  filterPanelOpen.value = !filterPanelOpen.value;
};

const onFilterChange = (key: keyof Filters, value: string) => {
  localFilters.value = { ...localFilters.value, [key]: value };
  emit('update:filters', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = { category: '', supplier: '', priceRange: '', stockFilter: 'all' };
  emit('update:filters', { ...localFilters.value });
};

// --- Dots menu ---
const openMenuId = ref<string | null>(null);
const menuRefs = new Map<string, HTMLElement>();

const setMenuRef = (el: HTMLElement | null, id: string) => {
  if (el) menuRefs.set(id, el);
  else menuRefs.delete(id);
};

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleClickOutside = (e: MouseEvent) => {
  if (openMenuId.value) {
    const el = menuRefs.get(openMenuId.value);
    if (el && !el.contains(e.target as Node)) {
      openMenuId.value = null;
    }
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

const handleEdit = (product: Product) => {
  openMenuId.value = null;
  emit('edit', product);
};

const handleDelete = (product: Product) => {
  openMenuId.value = null;
  emit('delete', product);
};

// --- Helpers ---
const formatPrice = (price: number) => price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getStatusVariant = (stock: number): 'success' | 'warning' | 'danger' => {
  if (stock === 0) return 'danger';
  if (stock <= 10) return 'warning';
  return 'success';
};

const getStatusText = (stock: number) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 10) return 'Low Stock';
  return 'In Stock';
};
</script>

<style scoped>
/* =====================
   Wrapper (no outer border/shadow)
   ===================== */
.product-table-wrapper {
  background: var(--color-card-fill);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

/* =====================
   Section Header
   ===================== */
.table-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-card-border);
}

.table-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.table-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* =====================
   Filter Button
   ===================== */
.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-filter svg {
  width: 15px;
  height: 15px;
  color: #6b7280;
  flex-shrink: 0;
}

.btn-filter:hover,
.btn-filter.active {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}

.btn-filter.active svg {
  color: var(--color-brand-secondary);
}

/* =====================
   Filter Panel
   ===================== */
.filter-panel {
  border-bottom: 1px solid var(--color-card-border);
  background: #fbfcfb;
}

.filter-panel-inner {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 180px;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.filter-select {
  appearance: none;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E") no-repeat right 0.625rem center / 16px;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #111827;
  cursor: pointer;
  transition: border-color 0.15s;
  width: 100%;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-brand-secondary);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

.btn-clear-filters {
  height: 38px;
  padding: 0 1rem;
  background: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  align-self: flex-end;
}

.btn-clear-filters:hover {
  border-color: var(--color-status-danger);
  color: var(--color-status-danger);
  background: #fef2f2;
}

/* =====================
   Filter Transition
   ===================== */
.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
  max-height: 200px;
}
.filter-slide-enter-from,
.filter-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* =====================
   Table Container (no outer border)
   ===================== */
.product-table-container {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

/* =====================
   Header Row
   ===================== */
thead {
  background: var(--color-card-fill);
}

th {
  padding: 0.875rem 1.5rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid #f3f4f6;
}

.th-product {
  min-width: 240px;
}

.th-sku {
  width: 130px;
}

.th-stock {
  width: 100px;
}

.th-price {
  width: 130px;
}

.th-status {
  width: 130px;
}

.th-actions {
  width: 56px;
  text-align: center;
}

/* =====================
   Product Rows
   ===================== */
.product-row {
  transition: background 0.15s;
}

.product-row + .product-row td {
  border-top: 1px solid #f3f4f6;
}

.product-row:hover {
  background: #fafafa;
}

td {
  padding: 1.125rem 1.5rem;
  vertical-align: middle;
}

.row-out-of-stock {
  background-color: #FEF2F2;
}

.row-out-of-stock:hover {
  background-color: #fee2e2;
}

/* =====================
   Product Info
   ===================== */
.product-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.product-image {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-image {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 24px;
  height: 24px;
  color: #9ca3af;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.product-category {
  font-size: 0.8125rem;
  color: #9ca3af;
}

/* =====================
   SKU
   ===================== */
.sku-code {
  font-size: 0.8125rem;
  color: #6b7280;
  font-variant-numeric: tabular-nums;
}

/* =====================
   Stock
   ===================== */
.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stock-value {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.btn-restock-sm {
  background: white;
  border: 1px solid #BBF7D0;
  color: #16A34A;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.18s;
}

.btn-restock-sm:hover {
  background: #F0FDF4;
  border-color: #16A34A;
}

.btn-restock-sm svg {
  width: 11px;
  height: 11px;
}

/* =====================
   Price
   ===================== */
.price {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  color: #111827;
}

/* =====================
   Three-dots action menu
   ===================== */
.action-menu-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.btn-dots {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0;
}

.btn-dots span {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #9ca3af;
  transition: background 0.15s;
}

.btn-dots:hover,
.btn-dots.active {
  background: #f3f4f6;
}

.btn-dots:hover span,
.btn-dots.active span {
  background: #374151;
}

/* =====================
   Action Dropdown
   ===================== */
.action-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  min-width: 150px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.dropdown-item svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: #6b7280;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.item-danger {
  color: #ef4444;
}

.item-danger svg {
  color: #ef4444;
}

.item-danger:hover {
  background: #fef2f2;
}

/* =====================
   Dropdown Transition
   ===================== */
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: all 0.15s ease;
  transform-origin: top right;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-4px);
}

/* =====================
   Empty State
   ===================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;
}

.empty-state svg {
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

/* =====================
   Bulk delete
   ===================== */
.bulk-actions {
  display: flex;
  justify-content: center;
}

.btn-bulk-delete {
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid #FECACA;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-bulk-delete:hover {
  background: #FEE2E2;
  border-color: #EF4444;
}

.btn-bulk-delete svg {
  width: 13px;
  height: 13px;
}

/* =====================
   Responsive
   ===================== */
@media (max-width: 768px) {
  .product-table {
    min-width: 720px;
  }

  .filter-panel-inner {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-group {
    width: 100%;
  }
}
</style>
