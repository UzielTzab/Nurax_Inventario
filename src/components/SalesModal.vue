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
                          :class="{ 'stock-low': getAvailableStock(product) <= 10, 'stock-out': getAvailableStock(product) === 0 }"
                       >
                          {{ getAvailableStock(product) }} en stock
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

// Helper to calculate available stock visually
const getAvailableStock = (product: Product) => {
  const item = cart.value.find(i => i.id === product.id);
  const reserved = item ? item.quantity : 0;
  return product.stock - reserved;
};

// Cart Logic
const addToCart = (product: Product) => {
  const available = getAvailableStock(product);
  
  if (available <= 0) {
      enqueueSnackbar({
        type: 'warning',
        title: 'Stock Insuficiente',
        message: `No hay más stock disponible de ${product.name}`,
        duration: 2000
      });
      return; 
  }
  
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
      existingItem.quantity++;
      enqueueSnackbar({
        type: 'success',
        title: 'Cantidad Actualizada',
        message: `Se agregó una unidad más de ${product.name}`,
        duration: 1500
      });
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
  return subtotal.value * 0.0;
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
/* =====================
   Overlay & Modal Shell
   ===================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 20, 14, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: fadeIn 0.18s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal-content {
  background: #ffffff;
  width: 92%;
  max-width: 1020px;
  height: 88vh;
  max-height: 780px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 32px 64px -12px rgba(6, 64, 43, 0.22),
    0 8px 24px -4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* =====================
   Header
   ===================== */
.modal-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #eef0f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #06402B 0%, #0a5538 100%);
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.modal-title::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
}

.close-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.35);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* =====================
   Modal Body Layout
   ===================== */
.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.25rem;
  overflow: hidden;
  background: #f4f6f5;
}

.sale-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
}

/* =====================
   Left Panel
   ===================== */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
}

/* =====================
   Search
   ===================== */
.search-section {
  background: white;
  padding: 0.875rem 1rem;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  flex-shrink: 0;
  border: 1px solid #eef0f2;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f4f6f5;
  border-radius: 10px;
  padding: 0.5rem 0.875rem;
  gap: 0.625rem;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.input-group:focus-within {
  background: #ffffff;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: color 0.2s;
}

.input-group:focus-within .search-icon {
  color: #22c55e;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  outline: none;
  color: #111827;
  min-width: 0;
}

.search-input::placeholder {
  color: #b0b8c1;
}

.scan-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.18s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.scan-btn:hover {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #16a34a;
}

.scan-btn svg {
  width: 18px;
  height: 18px;
}

/* =====================
   Product Grid & Cards
   ===================== */
.products-list {
  background: transparent;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
  padding-right: 4px;
}

/* Custom scrollbar */
.products-list::-webkit-scrollbar { width: 5px; }
.products-list::-webkit-scrollbar-track { background: transparent; }
.products-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
.products-list::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1rem;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b0b8c1;
  text-align: center;
  gap: 0.875rem;
}

.empty-state svg {
  width: 52px;
  height: 52px;
  opacity: 0.5;
}

/* Product Card */
.product-card {
  background: white;
  border: 1.5px solid #eef0f2;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -4px rgba(6, 64, 43, 0.14), 0 4px 8px -2px rgba(0, 0, 0, 0.06);
  border-color: #22c55e;
}

.product-image {
  height: 130px;
  background: #f4f6f5;
  width: 100%;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.04);
}

/* "Agregar" overlay */
.product-card::after {
  content: '+ Agregar a venta';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.625rem;
  background: linear-gradient(135deg, #06402B 0%, #16a34a 100%);
  color: white;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover::after {
  opacity: 1;
  transform: translateY(0);
}

.product-info {
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.4rem;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sku {
  font-size: 0.7rem;
  color: #b0b8c1;
  letter-spacing: 0.01em;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.product-price {
  font-weight: 700;
  font-size: 0.9375rem;
  color: #06402B;
}

.product-stock {
  font-size: 0.7rem;
  color: #16a34a;
  font-weight: 600;
  background: #f0fdf4;
  padding: 0.15rem 0.45rem;
  border-radius: 99px;
}

.product-stock.stock-low {
  color: #ea580c;
  background: #fff7ed;
}

.product-stock.stock-out {
  color: #dc2626;
  background: #fef2f2;
}

/* Add button (floating) */
.add-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: 1.5px solid #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.85);
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.product-card:hover .add-btn {
  opacity: 1;
  transform: scale(1);
}

.add-btn:hover {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.add-btn svg {
  width: 16px;
  height: 16px;
}

/* =====================
   Right Panel — Cart
   ===================== */
.current-sale {
  background: white;
  border-radius: 14px;
  border: 1.5px solid #eef0f2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.sale-summary {
  flex: 1;
  padding: 1.25rem 1.25rem 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.sale-summary h3 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
  flex-shrink: 0;
  letter-spacing: -0.01em;
}

.sale-items-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  margin-bottom: 1rem;
}

.text-muted {
  color: #b0b8c1;
  font-size: 0.8125rem;
}

/* Cart items */
.cart-items-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 0.75rem;
}

.cart-items-container::-webkit-scrollbar { width: 4px; }
.cart-items-container::-webkit-scrollbar-track { background: transparent; }
.cart-items-container::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

.cart-item {
  display: flex;
  gap: 0.625rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #f3f4f6;
  flex-shrink: 0;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.cart-item-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}

.cart-item-price {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #06402B;
  white-space: nowrap;
}

.cart-item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.375rem;
}

/* Qty controls */
.qty-controls {
  display: flex;
  align-items: center;
  gap: 0;
  background: #f4f6f5;
  border-radius: 8px;
  padding: 2px;
  border: 1px solid #eef0f2;
}

.qty-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.qty-btn:hover {
  background: #06402B;
  color: white;
}

.qty-value {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  min-width: 1.75rem;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

.remove-btn svg {
  width: 15px;
  height: 15px;
}

/* =====================
   Totals & Checkout
   ===================== */
.sale-totals {
  padding: 1rem 1.25rem 1.25rem;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #6b7280;
}

.total-row.grand-total {
  font-size: 1.125rem;
  font-weight: 800;
  color: #06402B;
  margin-top: 0.375rem;
  border-top: 1.5px solid #e5e7eb;
  padding-top: 0.75rem;
}

/* Checkout Button */
.btn-checkout {
  width: 100%;
  margin-top: 0.875rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #06402B 0%, #0d5c3a 60%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.01em;
  transition: all 0.22s;
  box-shadow: 0 4px 14px rgba(6, 64, 43, 0.28);
  position: relative;
  overflow: hidden;
}

.btn-checkout::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(6, 64, 43, 0.38);
  background: linear-gradient(135deg, #054e35 0%, #0e6b43 60%, #15803d 100%);
}

.btn-checkout:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(6, 64, 43, 0.2);
}

.btn-checkout svg {
  width: 18px;
  height: 18px;
}

.btn-checkout:disabled {
  background: linear-gradient(135deg, #9ca3af, #b0b8c1);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* =====================
   Responsive
   ===================== */
@media (max-width: 768px) {
  .modal-content {
    width: 98%;
    height: 95vh;
    border-radius: 16px;
  }

  .sale-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>