<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isOpen && product" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen && product" @click.stop class="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center">
                <PencilSquareIcon class="h-8 w-8 text-indigo-600 mr-3" />
                <h2 class="text-2xl font-bold text-gray-900">Editar Producto</h2>
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
                  <input 
                    v-model="formData.sku" 
                    type="text" 
                    required
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  >
                  <p class="text-xs text-gray-500 mt-1">El SKU no se puede modificar</p>
                </div>
              </div>

              <!-- Tracking Mode Info (Read-only) -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">{{ formData.trackingMode === 'serialized' ? '🔢' : '📦' }}</span>
                    <div>
                      <p class="text-sm font-semibold text-gray-900">
                        Modo de Rastreo: {{ formData.trackingMode === 'serialized' ? 'Serializado' : 'Agrupado (Bulk)' }}
                      </p>
                      <p class="text-xs text-gray-600">
                        {{ formData.trackingMode === 'serialized' 
                          ? 'Cada unidad tiene número de serie único' 
                          : 'Se cuenta solo la cantidad total' }}
                      </p>
                    </div>
                  </div>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      formData.trackingMode === 'serialized' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    No modificable
                  </span>
                </div>
              </div>

              <!-- Quantity (Read-only) and Price -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad Actual
                  </label>
                  <div class="relative">
                    <input 
                      v-model.number="formData.quantity" 
                      type="number" 
                      disabled
                      class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    📦 Para agregar inventario usa "Recibir Inventario"<br>
                    🛒 Las ventas reducen automáticamente el stock
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
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
              </div>

              <!-- Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cambiar Imagen
                </label>
                <input 
                  @change="handleImageUpload"
                  type="file" 
                  accept="image/*"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                >
              </div>

              <!-- Preview -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                <img :src="formData.image" alt="Preview" class="h-32 w-32 object-cover rounded-lg border border-gray-300">
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4 border-t border-gray-200">
                <AppButton variant="outline" type="button" class="flex-1" @click="$emit('close')">
                  Cancelar
                </AppButton>
                <AppButton variant="fill" type="submit" class="flex-1">
                  <CheckIcon />
                  Guardar Cambios
                </AppButton>
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
import { XMarkIcon, PencilSquareIcon, CheckIcon } from '@heroicons/vue/24/outline';

interface Product {
  name: string;
  category: string;
  sku: string;
  quantity?: number;
  stock?: number;
  price: string | number;
  supplier: string;
  status: string;
  image: string;
  barcode?: string;
  trackingMode: 'bulk' | 'serialized';
}

const props = defineProps<{
  isOpen: boolean;
  product: Product | null;
}>();

const emit = defineEmits(['close', 'productUpdated']);

const formData = ref({
  name: '',
  category: '',
  sku: '',
  quantity: 0,
  price: '',
  supplier: '',
  image: '',
  trackingMode: 'bulk' as 'bulk' | 'serialized'
});

// Load product data when modal opens
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name,
      category: newProduct.category,
      sku: newProduct.sku,
      quantity: newProduct.quantity ?? newProduct.stock ?? 0,
      price: typeof newProduct.price === 'number' ? newProduct.price.toString() : newProduct.price.replace('$', ''),
      supplier: newProduct.supplier,
      image: newProduct.image,
      trackingMode: newProduct.trackingMode
    };
  }
}, { immediate: true });

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      formData.value.image = result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = () => {
  // Determine status based on quantity
  let status = 'En Stock';
  if (formData.value.quantity === 0) {
    status = 'Agotado';
  } else if (formData.value.quantity <= 10) {
    status = 'Bajo Stock';
  }

  // Format price
  let formattedPrice = formData.value.price;
  if (!formattedPrice.startsWith('$')) {
    formattedPrice = `$${formattedPrice}`;
  }

  const updatedProduct = {
    ...props.product, // Keep original fields
    name: formData.value.name,
    category: formData.value.category,
    sku: formData.value.sku,
    quantity: formData.value.quantity,
    stock: formData.value.quantity, // Populate both
    price: formattedPrice,
    priceVal: parseFloat(formData.value.price) || 0, // Helpful for store
    supplier: formData.value.supplier,
    status: status,
    image: formData.value.image,
    trackingMode: formData.value.trackingMode
  };

  emit('productUpdated', updatedProduct);
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
