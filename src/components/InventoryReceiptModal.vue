<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center">
            <TruckIcon class="h-6 w-6 text-indigo-600 mr-3" />
            <h2 class="text-xl font-semibold text-gray-900">Recepción de Inventario</h2>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Step 1: Select Product -->
          <div v-if="currentStep === 1">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Paso 1: Selecciona el Producto</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Buscar producto existente
              </label>
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Product List -->
            <div v-if="searchQuery" class="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="product in filteredProducts"
                :key="product.sku"
                @click="selectProduct(product)"
                class="p-3 hover:bg-gray-50 cursor-pointer flex items-center border-b last:border-b-0"
              >
                <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded mr-3" />
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">SKU: {{ product.sku }} | Stock actual: {{ product.quantity }}</p>
                  <span 
                    :class="[
                      'inline-block text-xs px-2 py-1 rounded mt-1',
                      product.trackingMode === 'serialized' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ product.trackingMode === 'serialized' ? '🔢 Serializado' : '📦 Agrupado' }}
                  </span>
                </div>
              </div>
              <div v-if="filteredProducts.length === 0" class="p-4 text-center text-gray-500">
                No se encontraron productos
              </div>
            </div>

            <!-- Selected Product Preview -->
            <div v-if="selectedProduct" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div class="flex items-center mb-2">
                <CheckCircleIcon class="h-5 w-5 text-green-600 mr-2" />
                <p class="font-medium text-gray-900">Producto seleccionado</p>
              </div>
              <div class="flex items-center">
                <img :src="selectedProduct.image" :alt="selectedProduct.name" class="w-16 h-16 object-cover rounded mr-3" />
                <div>
                  <p class="font-semibold text-gray-900">{{ selectedProduct.name }}</p>
                  <p class="text-sm text-gray-600">SKU: {{ selectedProduct.sku }}</p>
                  <span 
                    :class="[
                      'inline-block text-xs px-2 py-1 rounded mt-1',
                      selectedProduct.trackingMode === 'serialized' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    Modo: {{ selectedProduct.trackingMode === 'serialized' ? 'Serializado' : 'Agrupado' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Add Inventory -->
          <div v-if="currentStep === 2">
            <button @click="currentStep = 1" class="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center text-sm">
              ← Volver a selección de producto
            </button>

            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Paso 2: Agregar Inventario - {{ selectedProduct?.name }}
            </h3>

            <!-- Bulk Mode -->
            <div v-if="selectedProduct?.trackingMode === 'bulk'" class="space-y-4">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800 mb-3">
                  📦 <strong>Modo Agrupado:</strong> Ingresa la cantidad total de unidades recibidas
                </p>
                
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuántas unidades recibes?
                </label>
                <input
                  v-model.number="bulkQuantity"
                  type="number"
                  min="1"
                  placeholder="Ej: 25"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Lote (Opcional)</label>
                <input
                  v-model="lotNumber"
                  type="text"
                  placeholder="Ej: LOTE-2025-045"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Serialized Mode -->
            <div v-if="selectedProduct?.trackingMode === 'serialized'" class="space-y-4">
              <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p class="text-sm text-purple-800 mb-3">
                  🔢 <strong>Modo Serializado:</strong> Escanea o ingresa cada número de serie individual
                </p>
                
                <div class="flex gap-2">
                  <input
                    v-model="currentSerialNumber"
                    @keyup.enter="addSerialNumber"
                    type="text"
                    placeholder="Escanea o escribe el número de serie..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    @click="addSerialNumber"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">Presiona Enter o clic en "Agregar" después de escanear</p>
              </div>

              <!-- Serial Numbers List -->
              <div v-if="serialNumbers.length > 0" class="border border-gray-200 rounded-lg p-4">
                <p class="font-medium text-gray-900 mb-3">
                  Unidades agregadas: <span class="text-indigo-600">{{ serialNumbers.length }}</span>
                </p>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div
                    v-for="(sn, index) in serialNumbers"
                    :key="index"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div class="flex items-center">
                      <CheckCircleIcon class="h-5 w-5 text-green-600 mr-2" />
                      <span class="text-sm font-mono text-gray-900">{{ sn.serialNumber }}</span>
                    </div>
                    <button
                      @click="removeSerialNumber(index)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Common Fields -->
            <div class="space-y-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                <input
                  v-model="supplierName"
                  type="text"
                  placeholder="Nombre del proveedor"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Factura (Opcional)</label>
                <input
                  v-model="invoiceNumber"
                  type="text"
                  placeholder="Ej: FAC-2025-001"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            v-if="currentStep === 1"
            @click="goToStep2"
            :disabled="!selectedProduct"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              selectedProduct
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Siguiente →
          </button>

          <button
            v-if="currentStep === 2"
            @click="saveReceipt"
            :disabled="!canSave"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors flex items-center',
              canSave
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <CheckCircleIcon class="h-5 w-5 mr-2" />
            Guardar Entrada
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { XMarkIcon, TruckIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

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

const emit = defineEmits<{
  close: [];
  inventoryAdded: [product: Product, quantity: number, serialNumbers?: SerializedItem[]];
}>();

// State
const currentStep = ref(1);
const searchQuery = ref('');
const selectedProduct = ref<Product | null>(null);

// Bulk mode
const bulkQuantity = ref<number>(1);
const lotNumber = ref('');

// Serialized mode
const currentSerialNumber = ref('');
const serialNumbers = ref<SerializedItem[]>([]);

// Common
const supplierName = ref('');
const invoiceNumber = ref('');

// Computed
const filteredProducts = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return props.products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.sku.toLowerCase().includes(query)
  );
});

const canSave = computed(() => {
  if (!selectedProduct.value) return false;
  
  if (selectedProduct.value.trackingMode === 'bulk') {
    return bulkQuantity.value > 0;
  } else {
    return serialNumbers.value.length > 0;
  }
});

// Methods
const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  supplierName.value = product.supplier;
  searchQuery.value = '';
};

const goToStep2 = () => {
  if (selectedProduct.value) {
    currentStep.value = 2;
  }
};

const addSerialNumber = () => {
  if (!currentSerialNumber.value.trim()) return;
  
  // Check for duplicates
  const exists = serialNumbers.value.some(sn => sn.serialNumber === currentSerialNumber.value);
  if (exists) {
    alert('⚠️ Este número de serie ya fue agregado');
    return;
  }
  
  serialNumbers.value.push({
    serialNumber: currentSerialNumber.value.trim(),
    barcode: `BC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique barcode
    status: 'available'
  });
  
  currentSerialNumber.value = '';
};

const removeSerialNumber = (index: number) => {
  serialNumbers.value.splice(index, 1);
};

const saveReceipt = () => {
  if (!selectedProduct.value || !canSave.value) return;
  
  if (selectedProduct.value.trackingMode === 'bulk') {
    emit('inventoryAdded', selectedProduct.value, bulkQuantity.value);
    alert(`✅ Inventario agregado!\n${selectedProduct.value.name}\n+${bulkQuantity.value} unidades`);
  } else {
    emit('inventoryAdded', selectedProduct.value, serialNumbers.value.length, serialNumbers.value);
    alert(`✅ Inventario agregado!\n${selectedProduct.value.name}\n+${serialNumbers.value.length} unidades con números de serie`);
  }
  
  closeModal();
};

const closeModal = () => {
  // Reset state
  currentStep.value = 1;
  searchQuery.value = '';
  selectedProduct.value = null;
  bulkQuantity.value = 1;
  lotNumber.value = '';
  currentSerialNumber.value = '';
  serialNumbers.value = [];
  supplierName.value = '';
  invoiceNumber.value = '';
  
  emit('close');
};
</script>
