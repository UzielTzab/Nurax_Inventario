<template>
  <div class="product-table-container">
    <table class="product-table">
      <thead>
        <tr>
          <th class="th-checkbox">
            <input 
              type="checkbox" 
              class="checkbox" 
              :checked="allSelected"
              :indeterminate="isIndeterminate"
              @change="toggleAll"
            />
          </th>
          <th class="th-product">PRODUCTO</th>
          <th class="th-sku">SKU</th>
          <th class="th-stock">STOCK</th>
          <th class="th-price">PRECIO</th>
          <th class="th-status">ESTADO</th>
          <th class="th-actions">
            <div v-if="selectedIds.length > 0" class="bulk-actions">
              <button class="btn-bulk-delete" @click="$emit('delete-multiple', selectedIds)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                </svg>
                <span>({{ selectedIds.length }})</span>
              </button>
            </div>
            <span v-else>ACCIONES</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="product-row" :class="{ 'row-out-of-stock': product.stock === 0 }">
          <td class="td-checkbox">
            <input 
              type="checkbox" 
              class="checkbox" 
              :checked="selectedIds.includes(product.id)"
              @change="toggleSelection(product.id)"
            />
          </td>
          <td class="td-product">
            <div class="product-info">
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
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
            <div class="action-buttons">
              <button class="action-btn action-btn-edit" title="Edit" @click="$emit('edit', product)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </button>
              <button class="action-btn action-btn-danger" title="Delete" @click="$emit('delete', product)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="products.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <h3>No products found</h3>
      <p>Try adjusting your filters or add a new product</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

interface Props {
  products: Product[];
}

const props = defineProps<Props>();

defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
  'delete-multiple': [ids: string[]];
  restock: [product: Product];
}>();

const selectedIds = ref<string[]>([]);

const allSelected = computed(() => {
  return props.products.length > 0 && selectedIds.value.length === props.products.length;
});

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < props.products.length;
});

const toggleAll = (e: Event) => {
  const isChecked = (e.target as HTMLInputElement).checked;
  if (isChecked) {
    selectedIds.value = props.products.map(p => p.id);
  } else {
    selectedIds.value = [];
  }
};

const toggleSelection = (id: string) => {
  const index = selectedIds.value.indexOf(id);
  if (index === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(index, 1);
  }
};

const formatPrice = (price: number) => {
  return price.toFixed(2);
};

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
.product-table-container {
  background: var(--color-card-fill);
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-table {
  width: 100%;
  border-collapse: separate; /* Changed from collapse to Fix radius clipping */
  border-spacing: 0;
}

thead {
  background: var(--color-card-fill);
  /* border-bottom removed, handled by th */
}

th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-card-border); /* Added */
}

.th-checkbox {
  width: 48px;
}

.th-product {
  min-width: 250px;
}

.th-sku {
  width: 140px;
}

.th-stock {
  width: 140px;
}

.th-price {
  width: 120px;
}

.th-status {
  width: 140px;
}

.th-actions {
  width: 100px;
  text-align: center;
}

.product-row {
  /* border-bottom removed */
  transition: background 0.2s;
}

.product-row:hover {
  background: var(--color-background);
}

.product-row td {
  border-bottom: 1px solid var(--color-card-border); /* Added */
}

.product-row:last-child td {
  border-bottom: none; /* Last row has no border */
}

.row-out-of-stock {
  background-color: #FEF2F2 !important; /* Light red background */
}

.row-out-of-stock td:first-child {
  box-shadow: inset 4px 0 0 #EF4444; /* Red border effect on left */
}

.row-out-of-stock td {
  color: #7F1D1D; /* Dark red text */
}

.row-out-of-stock .product-name {
  color: #991B1B; /* Dark red for product name */
}

.row-out-of-stock .sku-code {
  background: white;
  color: #991B1B;
  border: 1px solid #FECACA;
}

td {
  padding: 1rem;
  vertical-align: middle;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-brand-secondary);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-background);
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.product-category {
  font-size: 0.8125rem;
  color: #6b7280;
}

.sku-code {
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  color: #6b7280;
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stock-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.btn-restock-sm {
  background: white;
  border: 1px solid #BBF7D0;
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
  margin-top: 0.25rem;
}

.btn-restock-sm:hover {
  background: #F0FDF4;
  border-color: #16A34A;
}

.btn-restock-sm svg {
  width: 12px;
  height: 12px;
}

.price {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  color: #111827;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-card-border);
  border-radius: 6px;
  background: var(--color-card-fill);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: var(--color-background);
}

.action-btn-edit {
  color: #3B82F6; /* Blue-500 */
  border-color: #BFDBFE; /* Blue-200 */
  background: #EFF6FF; /* Blue-50 */
}

.action-btn-edit:hover {
  background: #DBEAFE; /* Blue-100 */
  border-color: #3B82F6;
}

.action-btn-danger {
  color: #EF4444; /* Red-500 */
  border-color: #FECACA; /* Red-200 */
  background: #FEF2F2; /* Red-50 */
}

.action-btn-danger:hover {
  background: #FEE2E2; /* Red-100 */
  border-color: #EF4444;
}

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
  width: 64px;
  height: 64px;
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

@media (max-width: 1024px) {
  .product-table-container {
    overflow-x: auto;
  }

  .product-table {
    min-width: 900px;
  }
}

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
  transition: all 0.2s;
}

.btn-bulk-delete:hover {
  background: #FEE2E2;
  border-color: #EF4444;
}

.btn-bulk-delete svg {
  width: 14px;
  height: 14px;
}
/* Corner radius fixes */
thead tr:first-child th:first-child {
  border-top-left-radius: 8px;
}

thead tr:first-child th:last-child {
  border-top-right-radius: 8px;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
</style>
