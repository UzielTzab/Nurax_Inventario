<template>
  <Transition name="fade">
    <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Transition name="modal">
        <div v-if="isOpen" @click.stop class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <!-- Header con animación de éxito -->
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce-once">
              <CheckCircleIcon class="h-12 w-12 text-green-600" />
            </div>
            <h2 class="text-2xl font-bold text-white">¡Venta Exitosa!</h2>
            <p class="text-green-100 mt-2">La transacción se completó correctamente</p>
          </div>

          <!-- Detalles de la venta -->
          <div class="p-6 space-y-4">
            <!-- Producto -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <ShoppingBagIcon class="h-6 w-6 text-indigo-600" />
                </div>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Producto</p>
                  <p class="text-lg font-semibold text-gray-900">{{ productName }}</p>
                </div>
              </div>
            </div>

            <!-- Grid de información -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Precio unitario -->
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <CurrencyDollarIcon class="h-4 w-4 text-blue-600" />
                  <p class="text-xs text-blue-600 font-medium">Precio Unitario</p>
                </div>
                <p class="text-lg font-bold text-blue-900">{{ unitPrice }}</p>
              </div>

              <!-- Cantidad (solo si es más de 1) -->
              <div v-if="quantity > 1" class="bg-purple-50 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <CalculatorIcon class="h-4 w-4 text-purple-600" />
                  <p class="text-xs text-purple-600 font-medium">Cantidad</p>
                </div>
                <p class="text-lg font-bold text-purple-900">{{ quantity }} unidades</p>
              </div>

              <!-- Stock restante -->
              <div :class="quantity > 1 ? 'col-span-2' : ''" class="bg-amber-50 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <ArchiveBoxIcon class="h-4 w-4 text-amber-600" />
                  <p class="text-xs text-amber-600 font-medium">Stock Restante</p>
                </div>
                <p class="text-lg font-bold text-amber-900">{{ remainingStock }} unidades</p>
              </div>
            </div>

            <!-- Total (solo si cantidad > 1) -->
            <div v-if="quantity > 1" class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-white font-medium">Total a Cobrar:</span>
                <span class="text-2xl font-bold text-white">{{ totalPrice }}</span>
              </div>
            </div>

            <!-- Número de serie (solo para serializados) -->
            <div v-if="serialNumber" class="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
              <div class="flex items-center gap-2 mb-2">
                <HashtagIcon class="h-5 w-5 text-indigo-600" />
                <p class="text-sm text-indigo-600 font-medium">Número de Serie</p>
              </div>
              <p class="font-mono text-base font-bold text-indigo-900">{{ serialNumber }}</p>
            </div>

            <!-- Ticket info -->
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ClockIcon class="h-4 w-4" />
              <span>{{ currentDate }}</span>
            </div>
          </div>

          <!-- Footer con botón -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              @click="$emit('close')"
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center gap-2"
            >
              <CheckIcon class="h-5 w-5" />
              Aceptar
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  CheckCircleIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  ArchiveBoxIcon, 
  ClockIcon,
  CheckIcon,
  HashtagIcon,
  CalculatorIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  isOpen: boolean;
  productName: string;
  unitPrice: string;
  quantity: number;
  remainingStock: number;
  serialNumber?: string;
}>();

defineEmits(['close']);

// Calculate total price
const totalPrice = computed(() => {
  if (props.quantity <= 1) return props.unitPrice;
  const price = parseFloat(props.unitPrice.replace('$', '').replace(',', ''));
  return `$${(price * props.quantity).toFixed(2)}`;
});

// Current date and time
const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});
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
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-30px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-20px) scale(1.1);
  }
  50% {
    transform: translateY(0) scale(1);
  }
  75% {
    transform: translateY(-10px) scale(1.05);
  }
}

.animate-bounce-once {
  animation: bounce-once 0.8s ease-out;
}
</style>
