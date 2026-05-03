<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="product" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="product" @click.stop class="bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-border">
          <div class="p-8">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-3xl font-bold text-white tracking-tight">{{ product.name }}</h2>
                <p class="text-sm font-mono text-gray-500 mt-1 uppercase tracking-widest">{{ product.sku }}</p>
              </div>
              <button @click="$emit('close')" class="p-2 text-gray-500 hover:bg-white/10 rounded-full transition-all">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            
            <!-- Image -->
            <img :src="product.image" alt="" class="w-full h-64 object-cover rounded-lg shadow-md mb-6">

            <!-- Product Info Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <AppInput
                label="Nombre"
                :model-value="product.name"
                readonly
              />
              <AppInput
                label="SKU"
                :model-value="product.sku"
                readonly
              />
              <AppInput
                label="Cantidad"
                :model-value="`${product.quantity} u`"
                readonly
              />
              <AppInput
                label="Precio"
                :model-value="String(product.price)"
                readonly
              />
              <AppInput
                label="Proveedor"
                :model-value="product.supplier"
                readonly
              />
              <AppInput
                label="Categoría"
                :model-value="product.category"
                readonly
              />
            </div>

            <!-- Status Badge -->
            <div class="flex justify-center mb-8">
              <span 
                :class="[
                  'px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase',
                  product.status === 'En Stock' ? 'bg-brand-secondary/10 text-brand-secondary ring-1 ring-brand-secondary/20' :
                  product.status === 'Bajo Stock' ? 'bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/20' :
                  'bg-status-danger/10 text-status-danger ring-1 ring-status-danger/20'
                ]"
              >
                {{ product.status }}
              </span>
            </div>

            <!-- Action Button: Reabastecer -->
            <div class="flex justify-center">
              <button 
                @click="$emit('restock', product)"
                class="w-full bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/20"
              >
                <TruckIcon class="h-5 w-5" />
                REABASTECER PRODUCTO
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XMarkIcon, TruckIcon } from '@heroicons/vue/24/outline';
import AppInput from '@/components/ui/AppInput.vue';

defineProps({
  product: Object
});
defineEmits(['close', 'restock']);
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
