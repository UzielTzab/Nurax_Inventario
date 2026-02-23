<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen" @click.stop class="bg-white rounded-lg shadow-2xl max-w-md w-full">
          <div class="p-6">
            <!-- Icon -->
            <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
            </div>
            
            <!-- Content -->
            <div class="text-center">
              <h3 class="text-lg font-bold text-gray-900 mb-2">¿Eliminar Producto?</h3>
              <p class="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
              </p>
              
              <div v-if="product" class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                  <img :src="product.image" alt="" class="h-16 w-16 rounded-lg object-cover">
                  <div class="ml-4 text-left">
                    <p class="font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">SKU: {{ product.sku }}</p>
                    <p class="text-sm text-gray-500">Stock: {{ product.quantity }} unidades</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <AppButton variant="outline" class="flex-1" @click="$emit('close')">
                Cancelar
              </AppButton>
              <AppButton variant="fill" class="flex-1" @click="handleDelete">
                Eliminar
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

interface Product {
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: string;
  supplier: string;
  status: string;
  image: string;
}

defineProps<{
  isOpen: boolean;
  product: Product | null;
}>();

const emit = defineEmits(['close', 'confirm']);

const handleDelete = () => {
  emit('confirm');
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
