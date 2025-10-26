<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen" @click.stop class="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center">
                <PlusCircleIcon class="h-8 w-8 text-indigo-600 mr-3" />
                <h2 class="text-2xl font-bold text-gray-900">Agregar Nuevo Producto</h2>
              </div>
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  placeholder="Ej: Laptop Gamer X1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
              </div>

              <!-- Category and SKU -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select 
                    v-model="formData.category" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearable">Wearable</option>
                    <option value="Fotografía">Fotografía</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <div class="flex gap-2">
                    <input 
                      v-model="formData.sku" 
                      type="text" 
                      required
                      placeholder="SKU-00000"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                    <button 
                      type="button"
                      @click="generateSKU"
                      class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                    >
                      <ArrowPathIcon class="h-5 w-5" />
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Presiona el botón para generar un SKU automático</p>
                </div>
              </div>

              <!-- Tracking Mode -->
              <div class="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-900 mb-3">
                  Modo de Rastreo *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <!-- Bulk Option -->
                  <label 
                    :class="[
                      'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.trackingMode === 'bulk' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    ]"
                  >
                    <input 
                      v-model="formData.trackingMode" 
                      type="radio" 
                      value="bulk"
                      class="sr-only"
                    >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-2xl">📦</span>
                      <span 
                        v-if="formData.trackingMode === 'bulk'"
                        class="text-blue-600"
                      >
                        <CheckCircleIcon class="h-6 w-6" />
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Agrupado (Bulk)</h3>
                    <p class="text-xs text-gray-600">
                      Solo cuenta cantidad total. Ideal para productos de bajo valor.
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      Ej: Cables, fundas, auriculares genéricos
                    </p>
                  </label>

                  <!-- Serialized Option -->
                  <label 
                    :class="[
                      'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.trackingMode === 'serialized' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    ]"
                  >
                    <input 
                      v-model="formData.trackingMode" 
                      type="radio" 
                      value="serialized"
                      class="sr-only"
                    >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-2xl">🔢</span>
                      <span 
                        v-if="formData.trackingMode === 'serialized'"
                        class="text-purple-600"
                      >
                        <CheckCircleIcon class="h-6 w-6" />
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Serializado</h3>
                    <p class="text-xs text-gray-600">
                      Cada unidad tiene número único. Rastreo individual completo.
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      Ej: Laptops, smartphones, tablets
                    </p>
                  </label>
                </div>
                <p class="text-xs text-gray-600 mt-3">
                  💡 <strong>Tip:</strong> Usa "Serializado" para productos con garantía o de alto valor (&gt;$200)
                </p>
              </div>

              <!-- Barcode Type Section -->
              <div class="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-dashed border-green-300 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-900 mb-3">
                  Tipo de Código de Barras *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <!-- Generated Barcode Option -->
                  <label 
                    :class="[
                      'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.barcodeType === 'generated' 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-300 bg-white hover:border-teal-300'
                    ]"
                  >
                    <input 
                      v-model="formData.barcodeType" 
                      type="radio" 
                      value="generated"
                      class="sr-only"
                    >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-2xl">🏷️</span>
                      <span 
                        v-if="formData.barcodeType === 'generated'"
                        class="text-teal-600"
                      >
                        <CheckCircleIcon class="h-6 w-6" />
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Generar SKU Interno</h3>
                    <p class="text-xs text-gray-600">
                      La app genera un código único para rastreo interno.
                    </p>
                  </label>

                  <!-- Factory Barcode Option -->
                  <label 
                    :class="[
                      'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                      formData.barcodeType === 'factory' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-white hover:border-green-300'
                    ]"
                  >
                    <input 
                      v-model="formData.barcodeType" 
                      type="radio" 
                      value="factory"
                      class="sr-only"
                    >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-2xl">📦</span>
                      <span 
                        v-if="formData.barcodeType === 'factory'"
                        class="text-green-600"
                      >
                        <CheckCircleIcon class="h-6 w-6" />
                      </span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">Código de Fábrica</h3>
                    <p class="text-xs text-gray-600">
                      Usa el código de barras original del producto.
                    </p>
                  </label>
                </div>
              </div>

              <!-- Factory Barcode Input (only if factory type selected) -->
              <div v-if="formData.barcodeType === 'factory'" class="space-y-4">
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        <strong>Importante:</strong> Si un producto con el mismo código de barras, marca y modelo ya existe, se agregará al inventario existente.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Código de Barras de Fábrica *
                    </label>
                    <div class="flex gap-2">
                      <input 
                        v-model="formData.factoryBarcode" 
                        type="text" 
                        :required="formData.barcodeType === 'factory'"
                        placeholder="7501234567890"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                      <button 
                        type="button"
                        @click="scanFactoryBarcode"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
                        title="Escanear con cámara"
                      >
                        <QrCodeIcon class="h-5 w-5" />
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Ingresa manualmente o escanea con la cámara</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <input 
                      v-model="formData.brand" 
                      type="text" 
                      placeholder="Ej: Sony, Samsung, Apple"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input 
                    v-model="formData.model" 
                    type="text" 
                    placeholder="Ej: WH-1000XM5, Galaxy S23, iPhone 15"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                  <p class="text-xs text-gray-500 mt-1">Marca y modelo ayudan a agrupar productos idénticos de diferentes proveedores</p>
                </div>

                <!-- Duplicate Product Warning -->
                <div v-if="duplicateProduct" class="bg-amber-50 border-l-4 border-amber-400 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-amber-800">Producto Similar Encontrado</h3>
                      <div class="mt-2 text-sm text-amber-700">
                        <p>Ya existe un producto con este código de barras:</p>
                        <ul class="list-disc list-inside mt-1">
                          <li><strong>{{ duplicateProduct.name }}</strong></li>
                          <li>SKU: {{ duplicateProduct.sku }}</li>
                          <li>Stock actual: {{ duplicateProduct.quantity }} unidades</li>
                        </ul>
                        <p class="mt-2">¿Deseas agregar inventario al producto existente en lugar de crear uno nuevo?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quantity and Price -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad Inicial
                  </label>
                  <input 
                    v-model.number="formData.quantity" 
                    type="number" 
                    required
                    min="0"
                    placeholder="0"
                    :disabled="formData.trackingMode === 'serialized'"
                    :class="[
                      'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      formData.trackingMode === 'serialized' ? 'bg-gray-100 cursor-not-allowed' : ''
                    ]"
                  >
                  <p v-if="formData.trackingMode === 'serialized'" class="text-xs text-amber-600 mt-1">
                    ⚠️ Para productos serializados, agrega el inventario después usando "Recibir Inventario"
                  </p>
                  <p v-else class="text-xs text-gray-500 mt-1">
                    Puedes agregar más inventario después con "Recibir Inventario"
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input 
                      v-model="formData.price" 
                      type="text" 
                      required
                      placeholder="0.00"
                      class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                  </div>
                </div>
              </div>

              <!-- Supplier -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <input 
                  v-model="formData.supplier" 
                  type="text" 
                  required
                  placeholder="Ej: TechSupplier Inc."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
              </div>

              <!-- Image URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Producto
                </label>
                <div class="space-y-3">
                  <input 
                    @change="handleImageUpload"
                    type="file" 
                    accept="image/*"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  >
                  <p class="text-xs text-gray-500">Seleccione una imagen de su equipo</p>
                </div>
              </div>

              <!-- Preview -->
              <div v-if="imagePreview" class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                <img :src="imagePreview" alt="Preview" class="h-32 w-32 object-cover rounded-lg border border-gray-300">
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  @click="$emit('close')"
                  class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  <PlusIcon class="h-5 w-5 mr-2" />
                  Agregar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { XMarkIcon, PlusCircleIcon, PlusIcon, ArrowPathIcon, CheckCircleIcon, QrCodeIcon } from '@heroicons/vue/24/outline';

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
  barcodeType: 'generated' | 'factory';
  factoryBarcode?: string;
  brand?: string;
  model?: string;
}

const props = defineProps<{
  isOpen: boolean;
  existingProducts?: Product[]; // Para verificar duplicados
}>();

const emit = defineEmits(['close', 'productAdded']);

const formData = ref({
  name: '',
  category: '',
  sku: '',
  quantity: 0,
  price: '',
  supplier: '',
  image: 'https://via.placeholder.com/150',
  trackingMode: 'bulk' as 'bulk' | 'serialized',
  barcodeType: 'generated' as 'generated' | 'factory',
  factoryBarcode: '',
  brand: '',
  model: ''
});

const imagePreview = ref('');

// Check for duplicate products based on factory barcode
const duplicateProduct = computed(() => {
  if (formData.value.barcodeType === 'factory' && formData.value.factoryBarcode && props.existingProducts) {
    return props.existingProducts.find(p => 
      p.barcodeType === 'factory' && 
      p.factoryBarcode === formData.value.factoryBarcode &&
      p.brand === formData.value.brand &&
      p.model === formData.value.model
    );
  }
  return null;
});

// Reset form when modal closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    formData.value = {
      name: '',
      category: '',
      sku: '',
      quantity: 0,
      price: '',
      supplier: '',
      image: 'https://via.placeholder.com/150',
      trackingMode: 'bulk',
      barcodeType: 'generated',
      factoryBarcode: '',
      brand: '',
      model: ''
    };
    imagePreview.value = '';
  }
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imagePreview.value = result;
      formData.value.image = result;
    };
    reader.readAsDataURL(file);
  }
};

const generateSKU = () => {
  const randomNum = Math.floor(Math.random() * 90000) + 10000;
  formData.value.sku = `SKU-${randomNum}`;
};

const scanFactoryBarcode = () => {
  // Esta función puede integrar una librería de escaneo como html5-qrcode
  // Por ahora, mostramos un prompt simple
  const scannedCode = prompt('Ingresa o escanea el código de barras:');
  if (scannedCode) {
    formData.value.factoryBarcode = scannedCode;
    
    // Auto-check for duplicates
    if (duplicateProduct.value) {
      const addToExisting = confirm(
        `Ya existe un producto con este código:\n${duplicateProduct.value.name}\n\n¿Deseas agregar inventario al producto existente en lugar de crear uno nuevo?`
      );
      
      if (addToExisting) {
        // Close modal and emit event to add to existing
        emit('close');
        alert('Por favor, usa "Recibir Inventario" para agregar stock al producto existente.');
      }
    }
  }
};

const handleSubmit = () => {
  // Check for duplicates if using factory barcode
  if (duplicateProduct.value) {
    alert('Ya existe un producto con este código de barras. Usa "Recibir Inventario" para agregar stock.');
    return;
  }

  // Determine status based on quantity
  let status = 'En Stock';
  if (formData.value.quantity === 0) {
    status = 'Agotado';
  } else if (formData.value.quantity <= 10) {
    status = 'Bajo Stock';
  }

  // Format price to include $ if not present
  let formattedPrice = formData.value.price;
  if (!formattedPrice.startsWith('$')) {
    formattedPrice = `$${formattedPrice}`;
  }

  // Generate internal barcode (unique identifier)
  const internalBarcode = `BC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newProduct: Product = {
    name: formData.value.name,
    category: formData.value.category,
    sku: formData.value.sku.toUpperCase(),
    quantity: formData.value.quantity,
    price: formattedPrice,
    supplier: formData.value.supplier,
    status: status,
    image: formData.value.image || 'https://via.placeholder.com/150',
    barcode: formData.value.barcodeType === 'factory' && formData.value.factoryBarcode 
      ? formData.value.factoryBarcode 
      : internalBarcode,
    trackingMode: formData.value.trackingMode,
    barcodeType: formData.value.barcodeType,
    factoryBarcode: formData.value.barcodeType === 'factory' ? formData.value.factoryBarcode : undefined,
    brand: formData.value.brand || undefined,
    model: formData.value.model || undefined
  };

  emit('productAdded', newProduct);
  emit('close');
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
</style>
