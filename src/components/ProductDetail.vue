<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="product" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="product" @click.stop class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ product.sku }}</p>
              </div>
              <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Image -->
            <img :src="product.image" alt="" class="w-full h-64 object-cover rounded-lg shadow-md mb-6">

            <!-- Product Info Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-xs text-gray-500 uppercase font-medium">Cantidad</p>
                <p class="text-xl font-bold text-gray-900 mt-1">{{ product.quantity }} Unidades</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-xs text-gray-500 uppercase font-medium">Precio</p>
                <p class="text-xl font-bold text-gray-900 mt-1">{{ product.price }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-xs text-gray-500 uppercase font-medium">Proveedor</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ product.supplier }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-xs text-gray-500 uppercase font-medium">Categoría</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ product.category }}</p>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex justify-center mb-6">
              <span 
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  product.status === 'En Stock' ? 'bg-green-100 text-green-800' :
                  product.status === 'Bajo Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ product.status }}
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';

defineProps({
  product: Object
});
defineEmits(['close']);
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
