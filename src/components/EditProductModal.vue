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
            <div class="product-top-row">
              <!-- Zona de subida de imagen (Izquierda) -->
              <div class="image-upload-section">
                <!-- Dropzone de imagen principal -->
                <label 
                  class="image-dropzone" 
                  :class="{ 'has-image': formData.image }"
                  for="edit-image"
                >
                  <div v-if="!formData.image" class="dropzone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span class="dropzone-text">Arrastrar imagen o buscar</span>
                  </div>
                  <img v-else :src="formData.image" alt="Preview" class="preview-img" />
                  
                  <input
                    type="file"
                    id="edit-image"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="file-input-hidden"
                  />
                  <!-- Botón quitar imagen (si hay imagen) -->
                  <button v-if="formData.image" type="button" class="remove-img-btn" @click.prevent="formData.image = ''" title="Quitar imagen">
                    <XMarkIcon style="width:16px;height:16px;" />
                  </button>
                </label>
                
                <!-- Botón de cámara (Debajo del dropzone) -->
                <label class="img-btn camera camera-standalone" for="edit-camera">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Cámara</span>
                  <input
                    type="file"
                    id="edit-camera"
                    @change="handleImageUpload"
                    accept="image/*"
                    capture="environment"
                    class="file-input-hidden"
                  />
                </label>
              </div>

              <!-- Formulario de datos (Derecha) -->
              <div class="product-data-section">
                <!-- Product Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
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
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input custom-select"
                  >
                    <option value="">Seleccione una categoría</option>
                    <option :value="1">Laptop</option>
                    <option :value="2">Smartphone</option>
                    <option :value="3">Audio</option>
                    <option :value="4">Wearable</option>
                    <option :value="5">Fotografía</option>
                    <option :value="6">Gaming</option>
                    <option :value="7">Accesorios</option>
                    <option :value="8">Otros</option>
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
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                >
              </div>
              
              </div> <!-- cierra product-data-section -->
            </div> <!-- cierra product-top-row -->

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
/* Grid layout para Edit */
.product-top-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .product-top-row {
    grid-template-columns: 160px 1fr;
  }
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-data-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Fix CSS Custom Select Arrow */
select.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.2rem;
  padding-right: 2.5rem;
  background-color: white;
}

/* Image Dropzone Nuevo Estilo */
.image-dropzone {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 2px dashed #D1D5DB;
  background-color: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.image-dropzone:hover {
  border-color: var(--color-brand-main, #06402B);
  background-color: rgba(6, 64, 43, 0.03);
}

.image-dropzone.has-image {
  border-style: solid;
  border-color: transparent;
  background: black;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  gap: 0.5rem;
  color: #6B7280;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #9CA3AF;
  margin-bottom: 0.25rem;
}

.image-dropzone:hover .upload-icon {
  color: var(--color-brand-main, #06402B);
}

.dropzone-text {
  font-size: 0.75rem;
  line-height: 1.2;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Botones de imagen */
.img-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #D1D5DB;
  background: #F9FAFB;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  user-select: none;
}

.img-btn svg {
  width: 18px;
  height: 18px;
  color: inherit;
}

.img-btn.camera-standalone {
  background: white;
  color: var(--color-brand-main, #06402B);
  border-color: var(--color-brand-main, #06402B);
}

.img-btn.camera-standalone:hover {
  background: rgba(6, 64, 43, 0.05);
}

/* visually hidden real input */
.file-input-hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  font-size: 0;
}

.remove-img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.55);
  border: none;
  border-radius: 50%;
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-img-btn:hover {
  background: rgba(0,0,0,0.75);
}


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
