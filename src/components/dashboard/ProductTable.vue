<template>
  <div class="product-table-wrapper">
    <div class="table-section-header">
      <span class="table-section-title">Listado de Productos</span>
      <div class="table-header-right">
        <div class="search-container-header">
          <input
            type="text"
            class="search-input-header"
            placeholder="Buscar por nombre o codigo..."
            :value="localFilters.search"
            @input="onFilterChange('search', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button class="btn-filter" @click="toggleFilterPanel" :class="{ active: filterPanelOpen }">
          <FunnelIcon class="filter-icon" />
          Ver filtros
        </button>
      </div>
    </div>

    <Transition name="filter-slide">
      <div v-if="filterPanelOpen" class="filter-panel">
        <div class="filter-panel-inner">
          <div class="filter-group">
            <label class="filter-label">Estado de stock</label>
            <select
              class="filter-select"
              :value="localFilters.stockFilter"
              @change="onFilterChange('stockFilter', ($event.target as HTMLSelectElement).value)"
            >
              <option value="all">Todos</option>
              <option value="low-stock">Alertas de stock (&lt;5)</option>
              <option value="out-of-stock">Sin stock</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Categoria</label>
            <select
              class="filter-select"
              :value="localFilters.category"
              @change="onFilterChange('category', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Proveedor</label>
            <select
              class="filter-select"
              :value="localFilters.supplier"
              @change="onFilterChange('supplier', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Todos</option>
              <option v-for="supplier in suppliers" :key="String(supplier.id)" :value="String(supplier.id)">
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <button class="btn-clear-filters" @click="clearFilters">Limpiar filtros</button>
        </div>
      </div>
    </Transition>

    <!-- Barra de Acciones para Seleccionados -->
    <Transition name="slide-down">
      <div v-if="selectedProducts.size > 0" class="selection-actions-bar">
        <div class="selection-info">
          <span class="selection-count">{{ selectedProducts.size }} producto(s) seleccionado(s)</span>
        </div>
        <div class="selection-buttons">
          <button class="btn-action btn-delete-selected" @click="deleteSelectedProducts">
            <TrashIcon class="action-icon" />
            Eliminar seleccionados
          </button>
          <button class="btn-action btn-clear-selection" @click="clearSelection">
            Limpiar selección
          </button>
        </div>
      </div>
    </Transition>

    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th class="th-checkbox">
              <input 
                type="checkbox" 
                class="checkbox-select-all"
                :checked="allProductsSelected"
                :indeterminate="someProductsSelected && !allProductsSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th class="th-product">PRODUCTO</th>
            <th class="th-category">CATEGORÍA</th>
            <th class="th-stock">STOCK</th>
            <th class="th-price">PRECIO</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="product-row" :class="{ 'row-selected': selectedProducts.has(String(product.id)) }">
            <td class="td-checkbox">
              <input 
                type="checkbox" 
                class="checkbox-product"
                :checked="selectedProducts.has(String(product.id))"
                @change="toggleProductSelection(product.id)"
              />
            </td>
            <td class="td-product">
              <div class="product-with-image">
                <img v-if="product.image" :src="product.image" :alt="product.name" class="product-image-small" />
                <div v-else class="product-image-placeholder">
                  <PhotoIcon class="placeholder-icon" />
                </div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                </div>
              </div>
            </td>

            <td class="td-category">
              <span class="category-badge">{{ getCategoryName(product) }}</span>
            </td>

            <td class="td-stock">
              <span class="stock-badge">
                {{ getProductStock(product) }} {{ getProductStock(product) === 1 ? 'unidad' : 'unidades' }}
              </span>
            </td>

            <td class="td-price">
              <div class="sale-price">${{ formatPrice(getSalePrice(product)) }}</div>
              <div v-if="canViewCost" class="cost-price">Costo: ${{ formatPrice(getBaseCost(product)) }}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="products.length === 0" class="empty-state">
        <h3>No se encontraron productos</h3>
        <p>Ajusta los filtros o agrega un nuevo producto</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  FunnelIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';

export interface Product {
  id: string | number;
  name: string;
  category: string | number;
  category_name?: string;
  supplier?: string | number | null;
  supplier_name?: string;
  sku: string;
  stock: number;
  current_stock?: number;
  price?: string | number;
  sale_price?: string | number;
  base_cost?: string | number;
  image?: string | null;
  primary_code?: string;
  product_codes?: Array<{ code: string; is_primary?: boolean }>;
  product_packagings?: Array<{ name?: string; quantity_per_unit?: number }>;
  packagings?: Array<{ name?: string; quantity_per_unit?: number }>;
}

export interface SupplierOption {
  id: string | number;
  name: string;
}

export interface Filters {
  search?: string;
  category?: string | number;
  supplier?: string | number;
  stockFilter?: string;
  sku?: string;
  stock_status?: string;
  min_price?: string | number;
  max_price?: string | number;
  ordering?: string;
}

interface Props {
  products: Product[];
  filters?: Filters;
  suppliers?: SupplierOption[];
  userRole?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({ search: '', category: '', supplier: '', stockFilter: 'all' } as Filters),
  suppliers: () => [] as SupplierOption[],
  userRole: '',
});

const emit = defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
  'delete-multiple': [ids: string[]];
  restock: [product: Product];
  'adjust-stock': [product: Product, newStock: number];
  'update:filters': [filters: Filters];
}>();

const filterPanelOpen = ref(false);
const localFilters = ref<Filters>({ ...props.filters });
const editingProductId = ref<string | null>(null);
const draftStock = ref<number>(0);
const selectedProducts = ref<Set<string>>(new Set());

watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...localFilters.value, ...newFilters };
  },
  { deep: true }
);

const canViewCost = computed(() => {
  return ['propietario', 'gerente', 'admin'].includes((props.userRole || '').toLowerCase());
});

const categories = computed(() => {
  const cats = new Set(
    props.products.map((p) => p.category_name || String(p.category || 'Sin categoria'))
  );
  return Array.from(cats).sort((a, b) => a.localeCompare(b));
});

const toggleFilterPanel = () => {
  filterPanelOpen.value = !filterPanelOpen.value;
};

const onFilterChange = (key: keyof Filters, value: string) => {
  localFilters.value = { ...localFilters.value, [key]: value };
  emit('update:filters', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = { search: '', category: '', supplier: '', stockFilter: 'all' };
  emit('update:filters', { ...localFilters.value });
};

const getProductStock = (product: Product) => Number(product.current_stock ?? product.stock ?? 0);

const getSalePrice = (product: Product) => Number(product.sale_price ?? product.price ?? 0);

const getBaseCost = (product: Product) => Number(product.base_cost ?? 0);

const getCategoryName = (product: Product) => product.category_name || String(product.category || 'Sin categoria');

const getSupplierName = (product: Product) => {
  if (product.supplier_name) return product.supplier_name;
  if (typeof product.supplier === 'string' && product.supplier.trim()) return product.supplier;
  if (typeof product.supplier === 'number' || (typeof product.supplier === 'string' && product.supplier)) {
    return `Proveedor #${product.supplier}`;
  }
  return 'Sin proveedor';
};

const getPrimaryCode = (product: Product) => {
  if (product.primary_code) return product.primary_code;
  if (product.product_codes?.length) {
    const primary = product.product_codes.find((code) => code.is_primary);
    const firstCode = product.product_codes[0];
    return primary?.code || (firstCode ? firstCode.code : product.sku);
  }
  return product.sku;
};

const getPackagingLabel = (product: Product) => {
  const pack = product.product_packagings?.[0] || product.packagings?.[0];
  if (!pack) return 'Unidad';
  if (pack.quantity_per_unit && pack.quantity_per_unit > 1) {
    return `${pack.name || 'Caja'} x ${pack.quantity_per_unit}`;
  }
  return pack.name || 'Unidad';
};

const formatPrice = (value: number) => {
  return value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const startInlineEdit = (product: Product) => {
  editingProductId.value = String(product.id);
  draftStock.value = getProductStock(product);
};

const cancelInlineEdit = () => {
  editingProductId.value = null;
};

const commitInlineAdjustment = (product: Product) => {
  const current = getProductStock(product);
  const nextValue = Math.max(0, Number(draftStock.value));

  editingProductId.value = null;

  if (Number.isNaN(nextValue) || nextValue === current) return;
  emit('adjust-stock', product, nextValue);
};

const adjustWithButtons = (product: Product, delta: number) => {
  const current = getProductStock(product);
  const nextValue = Math.max(0, current + delta);
  if (nextValue === current) return;
  emit('adjust-stock', product, nextValue);
};

// Selection methods
const toggleProductSelection = (productId: string | number) => {
  const id = String(productId);
  if (selectedProducts.value.has(id)) {
    selectedProducts.value.delete(id);
  } else {
    selectedProducts.value.add(id);
  }
};

const toggleSelectAll = () => {
  if (allProductsSelected.value) {
    selectedProducts.value.clear();
  } else {
    selectedProducts.value.clear();
    props.products.forEach((product) => {
      selectedProducts.value.add(String(product.id));
    });
  }
};

const clearSelection = () => {
  selectedProducts.value.clear();
};

const deleteSelectedProducts = async () => {
  if (selectedProducts.value.size === 0) return;
  const ids = Array.from(selectedProducts.value);
  selectedProducts.value.clear();
  emit('delete-multiple', ids);
};

const allProductsSelected = computed(() => {
  return props.products.length > 0 && selectedProducts.value.size === props.products.length;
});

const someProductsSelected = computed(() => {
  return selectedProducts.value.size > 0 && !allProductsSelected.value;
});
</script>

<style scoped>
.product-table-wrapper {
  background: var(--color-card-fill);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.table-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-card-border);
  gap: 0.75rem;
  flex-wrap: wrap;
}

.table-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.table-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input-header {
  appearance: none;
  background: white;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 220px;
}

.search-input-header:focus {
  outline: none;
  border-color: var(--color-brand-secondary);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

.btn-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.btn-filter.active {
  border-color: var(--color-brand-main);
  color: var(--color-brand-main);
}

.filter-icon {
  width: 16px;
  height: 16px;
}

.filter-panel {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.filter-panel-inner {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0.9rem 1.5rem 1.1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.filter-select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  background: white;
  color: #111827;
  font-size: 0.82rem;
}

.btn-clear-filters {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #4b5563;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.45rem 0.7rem;
  align-self: end;
  cursor: pointer;
}

.product-table-container {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
}

.product-table th {
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
  background: #fcfcfd;
}

.product-row td {
  padding: 0.9rem 1rem;
  vertical-align: middle;
  background: white;
}

.product-row td:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.product-row td:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.product-row {
  border-radius: 6px;
}

.product-main-line {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}

.product-tags-line {
  margin-top: 0.35rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.mini-badge {
  display: inline-flex;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
}

.mini-badge-category {
  background: #ecfdf3;
  color: #166534;
}

.mini-badge-supplier {
  background: #eff6ff;
  color: #1d4ed8;
}

.code-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  font-size: 0.76rem;
  font-weight: 600;
  color: #374151;
}

.code-icon {
  width: 14px;
  height: 14px;
  color: #6b7280;
}

.sale-price {
  font-size: 0.92rem;
  font-weight: 700;
  color: #111827;
}

.cost-price {
  margin-top: 0.15rem;
  font-size: 0.72rem;
  color: #9ca3af;
}

.stock-control-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.stock-action-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.stock-value-btn {
  min-width: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.35rem;
  cursor: pointer;
}

.stock-value-btn.stock-alert {
  color: #b45309;
  border-color: #f59e0b;
  background: #fffbeb;
}

.stock-inline-input {
  width: 52px;
  border: 1px solid var(--color-brand-main, #06402b);
  border-radius: 8px;
  padding: 0.25rem 0.35rem;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.stock-inline-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(6, 64, 43, 0.18);
}

.td-packaging {
  font-size: 0.8rem;
  color: #374151;
}

.action-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.btn-delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.product-with-image {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-image-small {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.product-image-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.placeholder-icon {
  width: 24px;
  height: 24px;
  color: #9ca3af;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-product-name);
}

.category-badge {
  display: inline-block;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.stock-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background: #ecfdf3;
  color: #166534;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
}

.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: all 0.2s ease;
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Selection Styles */
.selection-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selection-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.selection-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-selected {
  color: #dc2626;
  border-color: #fca5a5;
}

.btn-delete-selected:hover {
  background: #fee2e2;
  border-color: #dc2626;
}

.btn-clear-selection {
  color: #6b7280;
}

.btn-clear-selection:hover {
  background: #f3f4f6;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.checkbox-select-all,
.checkbox-product {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-brand-main);
}

.th-checkbox {
  width: 50px;
  padding: 0.85rem 1rem;
  text-align: center;
}

.td-checkbox {
  width: 50px;
  padding: 0.9rem 1rem;
  text-align: center;
}

.product-row.row-selected td {
  background: #f9fafb;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .filter-panel-inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .table-header-right {
    width: 100%;
  }

  .search-container-header {
    flex: 1;
  }

  .search-input-header {
    min-width: 0;
    width: 100%;
  }

  .filter-panel-inner {
    grid-template-columns: 1fr;
  }
  
  .selection-actions-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .selection-buttons {
    width: 100%;
    flex-wrap: wrap;
  }

  .btn-action {
    flex: 1;
    min-width: 140px;
  }
}
</style>
