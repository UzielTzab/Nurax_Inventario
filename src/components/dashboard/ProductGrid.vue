<template>
  <div class="product-grid-container">
    <div v-if="products.length > 0" class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card" :class="{ 'card-out-of-stock': product.stock === 0 }">
        <div class="card-header">
           <div class="product-image">
             <img :src="product.image" :alt="product.name" />
           </div>
           <div class="product-badges">
             <span class="badge-category">{{ product.category }}</span>
           </div>
        </div>
        
        <div class="card-body">
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-sku">SKU: {{ product.sku }}</div>
          
           <div class="product-meta">
              <div class="price-block">
                <span class="price-label">Precio</span>
                <span class="price-value">${{ formatPrice(product.price) }}</span>
              </div>
              <div class="status-block">
                <span class="stock-count">{{ product.stock }} disponibles</span>
                <Badge :variant="getStatusVariant(product.stock)" class="badge-status">
                  {{ getStatusText(product.stock) }}
                </Badge>
              </div>
            </div>
        </div>
        
        <div class="card-footer" :class="{ 'footer-out-of-stock': product.stock === 0 }">
          <button v-if="product.stock === 0" class="action-btn btn-restock" @click="$emit('restock', product)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312H11.75a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
            </svg>
            Reabastecer
          </button>
          <div class="footer-actions">
            <button class="action-btn" title="Edit" @click="$emit('edit', product)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
              Editar
            </button>
            <button class="action-btn action-btn-danger" title="Delete" @click="$emit('delete', product)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
      <h3>No products found</h3>
      <p>Try adjusting your filters or add a new product</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '../ui/Badge.vue';
import type { Product } from './ProductTable.vue';

interface Props {
  products: Product[];
}

defineProps<Props>();

defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
  restock: [product: Product];
}>();

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
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: var(--color-card-fill);
  border: 1px solid #e5e7eb; /* Slightly lighter border */
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* Subtle shadow by default */
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: var(--color-brand-primary);
}

.card-out-of-stock {
  border-color: #FECACA;
  background-color: #FEF2F2 !important;
}

.card-out-of-stock:hover {
  border-color: #EF4444;
}

.card-out-of-stock .product-name {
  color: #991B1B;
}

.card-header {
  position: relative;
  height: 180px;
}

.product-image {
  width: 100%;
  height: 100%;
  background: var(--color-background);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.badge-category {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sku {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #6b7280;
  background: var(--color-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px dashed #e5e7eb;
}

.price-block {
  display: flex;
  flex-direction: column;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.stock-count {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.card-footer {
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.footer-out-of-stock {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-restock {
  width: 100%;
  background: #F0FDF4;
  color: #16A34A;
  border-color: #BBF7D0;
  font-weight: 600;
}

.btn-restock:hover {
  background: #DCFCE7;
  border-color: #16A34A;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-background);
  border-color: #d1d5db;
  color: #111827;
}

.action-btn-danger {
  color: #ef4444;
  border-color: #fee2e2;
  background: #fef2f2;
}

.action-btn-danger:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;
  background: var(--color-card-fill);
  border: 1px solid var(--color-card-border);
  border-radius: 12px;
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
</style>
