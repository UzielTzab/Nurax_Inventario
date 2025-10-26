<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen" @click.stop class="bg-white rounded-lg shadow-2xl max-w-md w-full">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center">
                <QrCodeIcon class="h-8 w-8 text-indigo-600 mr-3" />
                <h2 class="text-2xl font-bold text-gray-900">Escanear Producto</h2>
              </div>
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Scanner Animation -->
            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-8 mb-6 text-center">
              <div class="relative inline-block">
                <QrCodeIcon class="h-32 w-32 text-indigo-600 mx-auto" :class="{ 'animate-pulse': isScanning }" />
                <div v-if="isScanning" class="absolute inset-0 flex items-center justify-center">
                  <div class="h-1 w-full bg-red-500 animate-scan"></div>
                </div>
              </div>
              <p class="mt-4 text-gray-600 font-medium">
                {{ isScanning ? 'Escaneando...' : 'Escanee el código de barras del producto' }}
              </p>
            </div>

            <!-- Manual Input -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                O ingrese el SKU manualmente
              </label>
              <input 
                v-model="barcode" 
                @keyup.enter="scanProduct"
                type="text" 
                placeholder="Ingresa el SKU completo (ej: SKU-34789)"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                :disabled="isScanning"
              >
              <p class="text-xs text-gray-500 mt-1">
                💡 Tip: Copia y pega el SKU exactamente como aparece en la tabla
              </p>
            </div>

            <!-- Available Products Hint -->
            <div v-if="!scannedProduct && !errorMessage" class="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-medium text-gray-700 mb-2">Productos disponibles para venta:</p>
              <div class="space-y-1">
                <p 
                  v-for="product in props.products.filter(p => p.quantity > 0).slice(0, 3)" 
                  :key="product.sku"
                  class="text-xs text-gray-600"
                >
                  • <span class="font-mono font-semibold">{{ product.sku }}</span> - {{ product.name }}
                </p>
              </div>
            </div>

            <!-- Product Found -->
            <div v-if="scannedProduct" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start">
                <CheckCircleIcon class="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <h3 class="font-semibold text-green-900">{{ scannedProduct.name }}</h3>
                  <p class="text-sm text-green-700">SKU: {{ scannedProduct.sku }}</p>
                  <p class="text-sm text-green-700">Stock actual: {{ scannedProduct.quantity }} unidades</p>
                  <p class="text-lg font-bold text-green-900 mt-2">{{ scannedProduct.price }}</p>
                  
                  <!-- Serialized Product Selection -->
                  <div v-if="scannedProduct.trackingMode === 'serialized' && scannedProduct.serializedItems" class="mt-3 pt-3 border-t border-green-300">
                    <p class="text-xs font-medium text-green-800 mb-2">🔢 Producto Serializado - Selecciona unidad:</p>
                    <select 
                      v-model="selectedSerialItem" 
                      class="w-full px-3 py-2 text-sm border border-green-300 rounded-md bg-white focus:ring-2 focus:ring-green-500"
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
                  <div v-if="scannedProduct.trackingMode === 'bulk'" class="mt-3 pt-3 border-t border-green-300">
                    <p class="text-xs font-medium text-green-800 mb-2">📦 Producto Bulk - Cantidad a vender:</p>
                    <div class="flex items-center gap-3">
                      <button
                        @click="decreaseQuantity"
                        :disabled="quantityToSell <= 1"
                        class="w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors"
                        :class="[
                          quantityToSell <= 1
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-green-400 text-green-700 hover:bg-green-100'
                        ]"
                      >
                        <span class="text-xl font-bold">−</span>
                      </button>

                      <input
                        v-model.number="quantityToSell"
                        type="number"
                        min="1"
                        :max="scannedProduct.quantity"
                        class="w-20 text-center text-lg font-bold px-3 py-2 border-2 border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />

                      <button
                        @click="increaseQuantity"
                        :disabled="quantityToSell >= scannedProduct.quantity"
                        class="w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors"
                        :class="[
                          quantityToSell >= scannedProduct.quantity
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-green-400 text-green-700 hover:bg-green-100'
                        ]"
                      >
                        <span class="text-xl font-bold">+</span>
                      </button>
                    </div>
                    
                    <!-- Total Price Display -->
                    <div class="mt-3 bg-green-100 rounded-md p-2">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-green-800">Total a cobrar:</span>
                        <span class="text-lg font-bold text-green-900">
                          ${{ (parseFloat(scannedProduct.price.replace('$', '').replace(',', '')) * quantityToSell).toFixed(2) }}
                        </span>
                      </div>
                      <p class="text-xs text-green-700 mt-1">
                        {{ quantityToSell }} {{ quantityToSell === 1 ? 'unidad' : 'unidades' }} × {{ scannedProduct.price }}
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
            <div class="flex gap-3">
              <button 
                @click="scanProduct" 
                :disabled="!barcode || isScanning"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <MagnifyingGlassIcon class="h-5 w-5 mr-2" />
                {{ isScanning ? 'Escaneando...' : 'Buscar' }}
              </button>
              <button 
                v-if="scannedProduct"
                @click="processTransaction" 
                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
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
