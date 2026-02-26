<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">Punto de Venta</h2>
        <button class="modal-close-btn" @click="$emit('close')" title="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="sale-layout">
        
        <!-- Left Panel: Search + Grid -->
        <div class="left-panel">
          <!-- Premium Search Section -->
          <div class="search-section">
            <div class="search-input-wrapper">
              <MagnifyingGlassIcon class="search-icon" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Buscar producto por nombre o código/SKU..." 
                class="search-input"
                autofocus
              />
            </div>
            <button class="icon-btn" title="Escanear">
              <QrCodeIcon class="w-5 h-5" />
            </button>
            <button class="icon-btn" title="Filtros">
              <FunnelIcon class="w-5 h-5" />
            </button>
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
                   <img v-if="product.image_url" :src="product.image_url" :alt="product.name">
                   <div v-else class="empty-image">
                     <PhotoIcon class="empty-icon-lg" />
                   </div>
                   <span 
                     class="stock-badge"
                     :class="{ 'badge-low': getAvailableStock(product) <= 10, 'badge-out': getAvailableStock(product) === 0 }"
                   >
                     {{ getAvailableStock(product) }} EN STOCK
                   </span>
                 </div>

                 <div class="product-info">
                   <div class="product-header">
                     <h4 class="product-name">{{ product.name }}</h4>
                     <span class="product-sku">SKU-{{ product.sku }}</span>
                   </div>
                   <div class="product-footer">
                     <span class="product-price">${{ Number(product.price).toFixed(2) }}</span>
                     <button class="add-btn" @click.stop="addToCart(product)">
                       <PlusIcon class="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <!-- Right Panel: Current Sale / Cart -->
        <div class="right-panel">
          
          <div class="cart-header">
            <div class="cart-title">
              <ShoppingCartIcon class="cart-icon" />
              <h3>Resumen de Venta</h3>
            </div>
            <button class="clear-cart-btn" @click="clearCart" :disabled="cart.length === 0" title="Vaciar venta">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="cart.length === 0" class="sale-items-placeholder">
            <p class="text-muted">Agrega productos a la venta</p>
          </div>

          <div v-else class="cart-items-container">
            <div v-for="item in cart" :key="item.id" class="cart-item">
               <div class="cart-item-image">
                 <img v-if="item.image_url" :src="item.image_url" :alt="item.name">
                 <div v-else class="empty-image">
                   <PhotoIcon class="empty-icon-sm" />
                 </div>
              </div>
              
              <div class="cart-item-info">
                 <span class="cart-item-name">{{ item.name }}</span>
                 <span class="cart-item-unit-price">${{ Number(item.price).toFixed(2) }} c/u</span>
              </div>
              
              <div class="qty-controls">
                 <button class="qty-btn" @click="updateQuantity(item.id, -1)">-</button>
                 <span class="qty-value">{{ item.quantity }}</span>
                 <button class="qty-btn" @click="updateQuantity(item.id, 1)">+</button>
              </div>
              
              <span class="cart-item-total">${{ (Number(item.price) * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="sale-totals">
            <div class="totals-breakdown">
              <div class="total-row">
                <span>Subtotal</span>
                <span class="dark-text">${{ subtotal.toFixed(2) }}</span>
              </div>          
            </div>
            
            <div class="grand-total-section">
              <div class="grand-total-info">
                <span class="total-label">TOTAL A PAGAR</span>
                <span class="total-value">${{ total.toFixed(2) }}</span>
              </div>
              <button class="discount-btn" title="Aplicar descuento">
                <TagIcon class="w-5 h-5" />
              </button>
            </div>
            <AppButton
              class="btn-checkout"
              variant="fill"
              fullWidth
              :disabled="cart.length === 0"
              @click="handleCheckout"
            >
              FINALIZAR VENTA
              <ArrowRightIcon class="w-5 h-5" />
            </AppButton>
        </div>

      </div>
    </div>
  </div>
  </div>

  <SaleSuccessModal 
    :is-open="showSuccessModal"
    :cart="lastCartSnapshot"
    :total="lastTotal"
    :sale-id="lastSaleId"
    @close="handleCloseSuccess"
    @revert="handleRevert"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SaleSuccessModal from '@/components/SaleSuccessModal.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSalesStore } from '@/stores/sales.store';
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  FunnelIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  TagIcon,
  ArrowRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline';

const { enqueueSnackbar } = useSnackbar();
const salesStore = useSalesStore();
import type { Product } from '@/stores/product.store';

interface CartItem extends Product {
  quantity: number;
}

const props = defineProps<{
  isOpen: boolean;
  products?: Product[];
}>();

const emit = defineEmits(['close', 'sale-completed', 'sale-reverted']);

const searchQuery = ref('');
const cart = ref<CartItem[]>([]);
const showSuccessModal = ref(false);

// Snapshot de la última venta (para poder revertirla)
const lastSaleId = ref<string | number>('');
const lastCartSnapshot = ref<CartItem[]>([]);
const lastTotal = ref(0);

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

const removeFromCart = (id: string | number) => {
  cart.value = cart.value.filter(item => item.id !== id);
};

const clearCart = () => {
  cart.value = [];
};

const updateQuantity = (id: string | number, delta: number) => {
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
  return cart.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const tax = computed(() => {
  return subtotal.value * 0.0;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const handleCheckout = async () => {
  // Play sound
  const audio = new Audio('/Fx_Sucess.wav');
  audio.play().catch(e => console.error('Error playing sound:', e));

  // Guardar snapshot de la venta antes de registrarla
  lastCartSnapshot.value = [...cart.value];
  lastTotal.value = Number(total.value.toFixed(2));
  
  const trxId = `TRX-${Date.now()}`;

  // Register sale in store via API
  const result = await salesStore.addSale({
    transaction_id: trxId,
    user: 1, // Se debe cambiar más adelante según auth actual
    status: 'completed',
    total: lastTotal.value.toString(),
    items: cart.value.map(item => ({ 
        product: Number(item.id),
        quantity: item.quantity,
        unit_price: Number(item.price).toString()
    }))
  });
  
  if (result.success && result.transaction_id) {
    lastSaleId.value = result.transaction_id;
    // Emit sale completed event (descuenta stock visualmente)
    emit('sale-completed', [...cart.value]);
    
    // Show success modal
    showSuccessModal.value = true;
  } else {
    enqueueSnackbar({
      type: 'error',
      title: 'Venta Fallida',
      message: result.error || 'Ocurrió un error al procesar la venta.',
      duration: 5000
    });
  }
};

const handleCloseSuccess = () => {
  showSuccessModal.value = false;
  cart.value = []; // Clear cart
  emit('close'); // Close sales modal
};

const handleRevert = (saleId: string | number, cartItems: { id: string | number; name: string; price: string | number; quantity: number }[]) => {
  showSuccessModal.value = false;
  cart.value = [];
  emit('sale-reverted', saleId, cartItems);
  emit('close');
};
</script>

<style scoped>
/* =====================
   Overlay & Modal Shell
   ===================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* =====================
   Modal Header
   ===================== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  letter-spacing: -0.02em;
}

.modal-close-btn {
  background: #ffffff;
  color: #9ca3af;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: var(--color-card-stats-fill);
}

.modal-close-btn svg {
  width: 24px;
  height: 24px;
}

.modal-content {
  background: var(--color-background);
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  max-height: 850px;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  padding: 1.5rem 2rem;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* =====================
   Modal Body Layout
   ===================== */
.sale-layout {
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 2rem;
  height: 100%;
  min-height: 0;
}

/* =====================
   Left Panel
   ===================== */
.left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* =====================
   Search Section
   ===================== */
.search-section {
  background: var(--color-card-stats-fill);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  border-radius: 24px;
  flex-shrink: 0;
  padding: 1rem;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 99px;
  padding: 0.8rem 1.25rem;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.search-input-wrapper:focus-within {
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #1f2937;
  min-width: 0;
}

.search-input::placeholder {
  color: #9ca3af;
}

.icon-btn {
  width: 48px;
  height: 48px;
  background: #ffffff;
  color: #4b5563;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
}

/* =====================
   Product Grid
   ===================== */
.products-list {
  background:var(--color-card-stats-fill) ;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 0.5rem;
  margin-right: -0.5rem;
  border-radius: 24px;
  padding: 1rem;
}

.products-list::-webkit-scrollbar { width: 6px; }
.products-list::-webkit-scrollbar-track { background: transparent; }
.products-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
.products-list::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem;
  padding-bottom: 1rem;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  text-align: center;
  gap: 1rem;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  opacity: 0.5;
}

/* =====================
   Product Card
   ===================== */
.product-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
}

.product-card:hover {
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
}

.product-image {
  position: relative;
  height: 160px;
  background: #f8fafc;
  width: 100%;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.empty-image {
  width: 100%;
  height: 100%;
  background: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-lg {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  opacity: 0.5;
}

.empty-icon-sm {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  opacity: 0.7;
}


/* ── Floating stock badge ── */
.stock-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stock-badge.badge-low { background: #fef08a; color: #854d0e; }
.stock-badge.badge-out { background: #fee2e2; color: #b91c1c; }

/* Info area */
.product-info {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.product-header {
  margin-bottom: 0.75rem;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.2rem;
}

.product-sku {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Bottom row: price + add button */
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-weight: 800;
  font-size: 1.125rem;
  color: #06402B;
  letter-spacing: -0.01em;
}

.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--color-brand-main-gradient);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.product-card:hover .add-btn {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.add-btn svg { width: 16px; height: 16px; }

/* =====================
   Right Panel — Cart
   ===================== */
.right-panel {
  background: var(--color-card-stats-fill);
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  height: 100%;
}

.cart-header {
  padding: 1.5rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-card-stats-fill);
  flex-shrink: 0;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #1f2937;
}

.cart-icon {
  width: 22px;
  height: 22px;
  color: #06402B;
}

.cart-title h3 {
  font-size: 1.125rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
}

.clear-cart-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
}

.clear-cart-btn:hover:not(:disabled) {
  color: #ef4444;
  background: #fef2f2;
}

.clear-cart-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.clear-cart-btn svg {
  width: 20px;
  height: 20px;
}

.sale-items-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-muted {
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Cart items */
.cart-items-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.75rem;
}

.cart-items-container::-webkit-scrollbar { width: 4px; }
.cart-items-container::-webkit-scrollbar-track { background: transparent; }
.cart-items-container::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f8fafc;
  flex-shrink: 0;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1.5; /* slightly larger space for name relative to qty */
}

.cart-item-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-unit-price {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Qty controls */
.qty-controls {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 99px;
  padding: 0.25rem 0.6rem;
  gap: 0.75rem;
  border: 1px solid #f1f5f9;
}

.qty-btn {
  background: none;
  border: none;
  color: #4b5563;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.qty-btn:hover {
  color: #111827;
}

.qty-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  min-width: 1rem;
  text-align: center;
}

.cart-item-total {
  font-weight: 800;
  color: #1f2937;
  font-size: 1rem;
  margin-left: auto; /* Push to right */
  min-width: 60px;
  text-align: right;
}

/* =====================
   Totals & Checkout
   ===================== */
.sale-totals {
  padding: 1.5rem 1.75rem 1.75rem;
  background: var(--color-card-stats-fill);
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6b7280;
}

.dark-text {
  font-weight: 700;
  color: #374151;
}

.grand-total-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.grand-total-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.total-value {
  font-size: 2rem;
  font-weight: 900;
  color: #06402B;
  line-height: 1;
  letter-spacing: -0.02em;
}

.discount-btn {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  color: #0f172a;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.discount-btn:hover {
  background: #e2e8f0;
}

.discount-btn svg {
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
}

/* Checkout Button */
.btn-checkout {
  width: 100%;
  color: white;
  border: none;
  padding: 1.15rem;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-checkout:active:not(:disabled) {
  transform: translateY(0);
}

.btn-checkout svg {
  width: 22px;
  height: 22px;
}

.btn-checkout:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

/* =====================
   Responsive
   ===================== */
@media (max-width: 1024px) {
  .sale-layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    padding: 1rem;
  }
  
  .absolute-close-btn {
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
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