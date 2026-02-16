<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header -->
      <header class="modal-header">
        <h2 class="modal-title">Nueva Venta</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <!-- Body -->
      <div class="modal-body">
        <div class="sale-layout">
          <!-- Left Panel: Search + Grid -->
          <div class="left-panel">
            <!-- Search Section -->
            <div class="search-section">
              <div class="input-group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Buscar producto por nombre o código/SKU..." 
                  class="search-input"
                  autofocus
                />
                <button class="scan-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Products List -->
            <div class="products-list">
               <div v-if="filteredProducts.length === 0" class="empty-state">
                 <svg v-if="!searchQuery" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
                 <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                 </svg>
                 <p v-if="!searchQuery">Empieza a escribir para buscar productos</p>
                 <p v-else>No se encontraron productos con "{{ searchQuery }}"</p>
               </div>

               <div v-else class="products-grid">
                 <div 
                   v-for="product in filteredProducts" 
                   :key="product.id" 
                   class="product-card"
                   @click="addToCart(product)"
                 >
                   <div class="product-image">
                     <img :src="product.image" :alt="product.name">
                   </div>
                   <div class="product-info">
                     <div class="product-header">
                       <h4 class="product-name">{{ product.name }}</h4>
                       <span class="product-sku">{{ product.sku }}</span>
                     </div>
                     <div class="product-footer">
                       <span class="product-price">${{ product.price.toFixed(2) }}</span>
                       <span 
                          class="product-stock"
                          :class="{ 'stock-low': product.stock <= 10, 'stock-out': product.stock === 0 }"
                       >
                          {{ product.stock }} en stock
                       </span>
                     </div>
                   </div>
                   <button class="add-btn" @click.stop="addToCart(product)">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                     </svg>
                   </button>
                 </div>
               </div>
            </div>
          </div>

          <!-- Current Sale / Cart -->
          <div class="current-sale">
            <div class="sale-summary">
              <h3>Resumen de Venta</h3>
              
              <div v-if="cart.length === 0" class="sale-items-placeholder">
                <p class="text-muted">No hay items en la venta actual</p>
              </div>

              <div v-else class="cart-items-container">
                <div v-for="item in cart" :key="item.id" class="cart-item">
                  <div class="cart-item-image">
                     <img :src="item.image" :alt="item.name">
                  </div>
                  <div class="cart-item-details">
                    <div class="cart-item-header">
                       <span class="cart-item-name">{{ item.name }}</span>
                       <span class="cart-item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                    <div class="cart-item-controls">
                       <div class="qty-controls">
                          <button class="qty-btn" @click="updateQuantity(item.id, -1)">-</button>
                          <span class="qty-value">{{ item.quantity }}</span>
                          <button class="qty-btn" @click="updateQuantity(item.id, 1)">+</button>
                       </div>
                       <button class="remove-btn" @click="removeFromCart(item.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="sale-totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Impuestos (16%)</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
              <button class="btn-checkout" :disabled="cart.length === 0" @click="handleCheckout">
                Cobrar Venta
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <SaleSuccessModal 
    :is-open="showSuccessModal"
    :cart="cart"
    :total="total"
    @close="handleCloseSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SaleSuccessModal from '@/components/SaleSuccessModal.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSalesStore } from '@/stores/sales.store';

const { enqueueSnackbar } = useSnackbar();
const salesStore = useSalesStore();
interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const props = defineProps<{
  isOpen: boolean;
  products?: Product[];
}>();

const emit = defineEmits(['close', 'sale-completed']);

const searchQuery = ref('');
const cart = ref<CartItem[]>([]);
const showSuccessModal = ref(false);

const filteredProducts = computed(() => {
  if (!props.products) return [];
  
  const query = searchQuery.value.toLowerCase().trim();
  
  if (!query) return props.products;
  
  return props.products.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.sku.toLowerCase().includes(query)
  );
});

// Cart Logic
const addToCart = (product: Product) => {
  if (product.stock === 0) return; // Prevent adding out of stock items
  
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
        enqueueSnackbar({
          type: 'success',
          title: 'Cantidad Actualizada',
          message: `Se agregó una unidad más de ${product.name}`,
          duration: 1500
        });
    } else {
        enqueueSnackbar({
          type: 'warning',
          title: 'Stock Insuficiente',
          message: `No hay más stock disponible de ${product.name}`,
          duration: 2000
        });
    }
  } else {
    cart.value.push({ ...product, quantity: 1 });
    enqueueSnackbar({
      type: 'success',
      title: 'Producto Agregado',
      message: `${product.name} agregado a la venta`,
      duration: 1500
    });
  }
};

const removeFromCart = (id: string) => {
  cart.value = cart.value.filter(item => item.id !== id);
};

const updateQuantity = (id: string, delta: number) => {
  const item = cart.value.find(item => item.id === id);
  if (!item) return;
  
  const newQuantity = item.quantity + delta;
  
  if (newQuantity <= 0) {
    removeFromCart(id);
  } else if (newQuantity <= item.stock) {
    item.quantity = newQuantity;
  }
};

// Computed Totals
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const tax = computed(() => {
  return subtotal.value * 0.16;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const handleCheckout = () => {
  // Play sound
  const audio = new Audio('/Fx_Sucess.wav');
  audio.play().catch(e => console.error('Error playing sound:', e));
  
  // Register sale in store
  salesStore.addSale({
    items: cart.value.map(item => ({ 
        name: item.name, 
        quantity: item.quantity 
    })),
    total: Number(total.value.toFixed(2))
  });
  
  // Emit sale completed event
  emit('sale-completed', [...cart.value]);
  
  // Show success modal
  showSuccessModal.value = true;
};

const handleCloseSuccess = () => {
  showSuccessModal.value = false;
  cart.value = []; // Clear cart
  emit('close'); // Close sales modal
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 1000px;
  height: 85vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-card-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfdfd;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #111827;
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;
  overflow: hidden;
  background: #f9fafb;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
  overflow: hidden;
}

.search-section {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.input-group {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  gap: 0.75rem;
  transition: box-shadow 0.2s;
}

.input-group:focus-within {
  box-shadow: 0 0 0 2px var(--color-brand-primary);
  background: white;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
  color: #111827;
  min-width: 0;
}

.scan-btn {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s;
  flex-shrink: 0;
}

.scan-btn:hover {
  background: #F9FAFB;
  color: #111827;
}

.scan-btn svg {
  width: 20px;
  height: 20px;
}

.sale-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
  max-width: 100%;
}

.products-list {
  background: transparent;
  padding: 0 0.5rem 0 0;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  text-align: center;
  gap: 1rem;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.5;
}

.current-sale {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-card-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.sale-summary {
  flex: 1;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.sale-summary h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.sale-items-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #E5E7EB;
  border-radius: 8px;
  background: #F9FAFB;
}

.text-muted {
  color: #9CA3AF;
  font-size: 0.875rem;
}

.sale-totals {
  padding: 1.5rem;
  background: #F9FAFB;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6B7280;
}

.total-row.grand-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-top: 0.5rem;
  border-top: 1px solid #E5E7EB;
  padding-top: 1rem;
}

.btn-checkout {
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem;
  background: var(--color-brand-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-checkout:hover {
  background: #15803d;
}

.btn-checkout svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .sale-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.product-card {
  background: white;
  border: 1px solid #e2e8f0; /* Distinct light border */
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Stronger shadow */
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: var(--color-brand-primary);
}

.product-image {
  height: 140px;
  background: #f3f4f6;
  width: 100%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sku {
  font-size: 0.75rem;
  color: #9CA3AF;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-weight: 700;
  color: #111827;
}

.product-stock {
  font-size: 0.75rem;
  color: #10B981;
  font-weight: 500;
}

.product-stock.stock-low {
  color: #F97316;
}

.product-stock.stock-out {
  color: #EF4444;
}

.add-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid #E5E7EB;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s;
}

.product-card:hover .add-btn {
  opacity: 1;
  transform: scale(1);
}

.product-card:hover::after {
  content: 'Agregar a la venta';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.add-btn:hover {
  background: var(--color-brand-primary);
  color: white;
  border-color: var(--color-brand-primary);
}

.add-btn svg {
  width: 18px;
  height: 18px;
}

/* Cart Styles */
.cart-items-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
}

.cart-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: #F3F4F6;
  flex-shrink: 0;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.cart-item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.cart-item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #F3F4F6;
  border-radius: 6px;
  padding: 0.125rem;
}

.qty-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #4B5563;
  font-size: 1rem;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.qty-btn:hover {
  background: #F9FAFB;
  color: #111827;
}

.qty-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111827;
  min-width: 1.5rem;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #EF4444;
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.btn-checkout:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
