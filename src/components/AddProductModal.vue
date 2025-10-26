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
import { ref, watch } from 'vue';
import { XMarkIcon, PlusCircleIcon, PlusIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

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
}

const props = defineProps<{
  isOpen: boolean;
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
  trackingMode: 'bulk' as 'bulk' | 'serialized'
});

const imagePreview = ref('');

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
      trackingMode: 'bulk'
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

const handleSubmit = () => {
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

  // Generate barcode (unique identifier)
  const barcode = `BC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newProduct: Product = {
    name: formData.value.name,
    category: formData.value.category,
    sku: formData.value.sku.toUpperCase(),
    quantity: formData.value.quantity,
    price: formattedPrice,
    supplier: formData.value.supplier,
    status: status,
    image: formData.value.image || 'https://via.placeholder.com/150',
    barcode: barcode,
    trackingMode: formData.value.trackingMode
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
