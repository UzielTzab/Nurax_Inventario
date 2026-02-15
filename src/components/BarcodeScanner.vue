<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen" @click.stop class="bg-dark-card rounded-2xl shadow-2xl max-w-md w-full border border-dark-border overflow-hidden">
          <div class="p-8">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center">
                <QrCodeIcon class="h-8 w-8 text-brand-primary mr-3" />
                <h2 class="text-2xl font-bold text-white tracking-tight">Escanear Producto</h2>
              </div>
              <button @click="$emit('close')" class="p-2 text-gray-500 hover:bg-white/10 rounded-full transition-all">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Scanner Animation -->
            <div class="bg-white/5 rounded-xl p-8 mb-6 text-center border border-white/5">
              <div class="relative inline-block">
                <QrCodeIcon class="h-32 w-32 text-brand-primary mx-auto opacity-80" :class="{ 'animate-pulse': isScanning }" />
                <div v-if="isScanning" class="absolute inset-0 flex items-center justify-center">
                  <div class="h-1 w-full bg-brand-primary shadow-lg shadow-brand-primary/50 animate-scan"></div>
                </div>
              </div>
              <p class="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">
                {{ isScanning ? 'Escaneando...' : 'Apunta al código de barras' }}
              </p>
            </div>

            <!-- Manual Input -->
            <div class="mb-6">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                O ingrese el SKU manualmente
              </label>
              <input 
                v-model="barcode" 
                @keyup.enter="scanProduct"
                type="text" 
                placeholder="Ingresa el SKU completo (ej: SKU-34789)"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border text-white rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder-gray-600"
                :disabled="isScanning"
              >
              <p class="text-xs text-gray-600 mt-2 italic">
                💡 Tip: Copia y pega el SKU exactamente como aparece en la tabla
              </p>
            </div>

            <!-- Available Products Hint -->
            <div v-if="!scannedProduct && !errorMessage" class="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sugerencias:</p>
              <div class="space-y-2">
                <p 
                  v-for="product in props.products.filter(p => p.quantity > 0).slice(0, 3)" 
                  :key="product.sku"
                  class="text-xs text-gray-400 flex justify-between"
                >
                  <span>• {{ product.name }}</span>
                  <span class="font-mono text-brand-primary">{{ product.sku }}</span>
                </p>
              </div>
            </div>

            <!-- Product Found -->
            <div v-if="scannedProduct" class="mb-6 p-5 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl">
              <div class="flex items-start">
                <CheckCircleIcon class="h-6 w-6 text-brand-secondary mr-3 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <h3 class="font-bold text-white">{{ scannedProduct.name }}</h3>
                  <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest font-mono">SKU: {{ scannedProduct.sku }}</p>
                  <p class="text-sm text-brand-secondary font-bold mt-1">Stock: {{ scannedProduct.quantity }} unidades</p>
                  <p class="text-2xl font-black text-white mt-3">{{ scannedProduct.price }}</p>
                  
                  <!-- Serialized Product Selection -->
                  <div v-if="scannedProduct.trackingMode === 'serialized' && scannedProduct.serializedItems" class="mt-4 pt-4 border-t border-brand-secondary/20">
                    <p class="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">🔢 Selecciona unidad:</p>
                    <select 
                      v-model="selectedSerialItem" 
                      class="w-full px-3 py-2 text-sm border border-brand-secondary/30 rounded-lg bg-dark-input text-white focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none"
                    >
                      <option 
                        v-for="item in scannedProduct.serializedItems.filter(i => i.status === 'available')" 
                        :key="item.serialNumber"
                        :value="item"
                      >
                        {{ item.serialNumber }}
                      </option>
                    </select>
                  </div>

                  <!-- Bulk Product Quantity Selection -->
                  <div v-if="scannedProduct.trackingMode === 'bulk'" class="mt-4 pt-4 border-t border-brand-secondary/20">
                    <p class="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-3">📦 Cantidad a vender:</p>
                    <div class="flex items-center gap-4">
                      <button
                        @click="decreaseQuantity"
                        :disabled="quantityToSell <= 1"
                        class="w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all"
                        :class="[
                          quantityToSell <= 1
                            ? 'border-white/10 text-gray-600 cursor-not-allowed'
                            : 'border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/10'
                        ]"
                      >
                        <span class="text-2xl font-bold">−</span>
                      </button>
 
                      <input
                        v-model.number="quantityToSell"
                        type="number"
                        min="1"
                        :max="scannedProduct.quantity"
                        class="w-20 text-center text-xl font-black bg-dark-input text-white py-2 border-2 border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none shadow-inner"
                      />
 
                      <button
                        @click="increaseQuantity"
                        :disabled="quantityToSell >= scannedProduct.quantity"
                        class="w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all"
                        :class="[
                          quantityToSell >= scannedProduct.quantity
                            ? 'border-white/10 text-gray-600 cursor-not-allowed'
                            : 'border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/10'
                        ]"
                      >
                        <span class="text-2xl font-bold">+</span>
                      </button>
                    </div>
                    
                    <!-- Total Price Display -->
                    <div class="mt-5 bg-white/5 rounded-xl p-4 border border-white/5 shadow-inner">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total a cobrar:</span>
                        <span class="text-2xl font-black text-white">
                          ${{ (parseFloat(scannedProduct.price.replace('$', '').replace(',', '')) * quantityToSell).toFixed(2) }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 font-medium">
                        {{ quantityToSell }} × {{ scannedProduct.price }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start">
                <XCircleIcon class="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 class="font-semibold text-red-900">Producto no encontrado</h3>
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <button 
                @click="scanProduct" 
                :disabled="!barcode || isScanning"
                class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white py-4 px-4 rounded-xl font-bold transition-all flex items-center justify-center uppercase tracking-widest text-xs"
              >
                <MagnifyingGlassIcon class="h-5 w-5 mr-2 text-brand-primary" />
                {{ isScanning ? 'Buscando...' : 'Buscar' }}
              </button>
              <button 
                v-if="scannedProduct"
                @click="processTransaction" 
                class="flex-1 bg-brand-secondary hover:bg-brand-secondary/90 text-white py-4 px-4 rounded-xl font-black transition-all flex items-center justify-center shadow-lg shadow-brand-secondary/20 uppercase tracking-widest text-xs"
              >
                <ShoppingCartIcon class="h-5 w-5 mr-2" />
                Vender
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QrCodeIcon, XMarkIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline';

interface SerializedItem {
  serialNumber: string;
  barcode: string;
  status: 'available' | 'sold' | 'reserved';
  soldTo?: string;
  soldDate?: string;
  saleTicket?: string;
}

interface Product {
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: string;
  supplier: string;
  status: string;
  image: string;
  barcode: string;
  trackingMode: 'bulk' | 'serialized';
  serializedItems?: SerializedItem[];
}

const props = defineProps<{
  isOpen: boolean;
  products: Product[];
}>();

const emit = defineEmits(['close', 'productSold']);

const barcode = ref('');
const isScanning = ref(false);
const scannedProduct = ref<Product | null>(null);
const selectedSerialItem = ref<SerializedItem | null>(null);
const quantityToSell = ref(1);
const errorMessage = ref('');

// Reset when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    barcode.value = '';
    scannedProduct.value = null;
    selectedSerialItem.value = null;
    quantityToSell.value = 1;
    errorMessage.value = '';
    isScanning.value = false;
  }
});

// Increase/decrease quantity for bulk products
const increaseQuantity = () => {
  if (scannedProduct.value && quantityToSell.value < scannedProduct.value.quantity) {
    quantityToSell.value++;
  }
};

const decreaseQuantity = () => {
  if (quantityToSell.value > 1) {
    quantityToSell.value--;
  }
};

const scanProduct = () => {
  if (!barcode.value) return;
  
  isScanning.value = true;
  errorMessage.value = '';
  scannedProduct.value = null;
  selectedSerialItem.value = null;

  // Simulate scanning delay
  setTimeout(() => {
    const searchTerm = barcode.value.trim().toUpperCase();
    
    // Search by SKU or barcode
    const product = props.products.find(p => 
      p.sku.toUpperCase() === searchTerm || 
      p.barcode === barcode.value.trim()
    );
    
    if (product) {
      if (product.quantity > 0) {
        scannedProduct.value = product;
        errorMessage.value = '';
        
        // If serialized, auto-select first available item
        if (product.trackingMode === 'serialized' && product.serializedItems) {
          const available = product.serializedItems.find(item => item.status === 'available');
          if (available) {
            selectedSerialItem.value = available;
          }
        }
      } else {
        errorMessage.value = 'Este producto está agotado. No hay unidades disponibles para vender.';
      }
    } else {
      errorMessage.value = `No se encontró ningún producto con el código "${barcode.value}". Verifica que el SKU o código de barras sea correcto.`;
    }
    
    isScanning.value = false;
  }, 1000);
};

const processTransaction = () => {
  if (scannedProduct.value) {
    // Play success sound FIRST (before emitting event)
    const audio = new Audio('/Fx_Sucess.wav');
    audio.play();
    
    // Emit with serial number if serialized
    if (scannedProduct.value.trackingMode === 'serialized' && selectedSerialItem.value) {
      emit('productSold', scannedProduct.value, selectedSerialItem.value, 1);
    } else {
      // Bulk product - emit with quantity
      emit('productSold', scannedProduct.value, null, quantityToSell.value);
    }
    
    // Reset
    barcode.value = '';
    scannedProduct.value = null;
    selectedSerialItem.value = null;
    quantityToSell.value = 1;
    errorMessage.value = '';
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

@keyframes scan {
  0%, 100% {
    transform: translateY(-50px);
  }
  50% {
    transform: translateY(50px);
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
