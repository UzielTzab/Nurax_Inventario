<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div v-if="isOpen" class="fixed right-4 top-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-2rem)] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center">
          <BellAlertIcon class="h-6 w-6 text-red-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-900">Alertas de Inventario</h3>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="notifications.length === 0" class="text-center py-8">
          <CheckCircleIcon class="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p class="text-gray-500">No hay alertas de inventario</p>
          <p class="text-sm text-gray-400">Todos los productos tienen stock suficiente</p>
        </div>

        <TransitionGroup
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
          mode="out-in"
        >
          <div
            v-for="notification in notifications"
            :key="notification.sku"
            :class="[
              'p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md',
              notification.severity === 'critical' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
            ]"
            @click="$emit('viewProduct', notification.product)"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon 
                  :class="[
                    'h-5 w-5',
                    notification.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  ]"
                />
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold text-gray-900">{{ notification.product.name }}</p>
                  <span 
                    :class="[
                      'text-xs font-medium px-2 py-1 rounded',
                      notification.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ notification.product.status }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">SKU: {{ notification.product.sku }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center">
                    <CubeIcon class="h-4 w-4 text-gray-400 mr-1" />
                    <span 
                      :class="[
                        'text-sm font-bold',
                        notification.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      ]"
                    >
                      {{ notification.product.quantity }} unidades
                    </span>
                  </div>
                  <button 
                    @click.stop="$emit('restock', notification.product)"
                    class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Reabastecer
                  </button>
                </div>
                <p class="text-xs text-gray-600 mt-2">{{ notification.message }}</p>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer Summary -->
      <div v-if="notifications.length > 0" class="p-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span class="text-gray-600">Agotados: <strong>{{ criticalCount }}</strong></span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span class="text-gray-600">Bajo Stock: <strong>{{ warningCount }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BellAlertIcon, XMarkIcon, ExclamationTriangleIcon, CubeIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

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

interface Notification {
  sku: string;
  product: Product;
  severity: 'critical' | 'warning';
  message: string;
}

const props = defineProps<{
  isOpen: boolean;
  products: Product[];
}>();

defineEmits<{
  close: [];
  viewProduct: [product: Product];
  restock: [product: Product];
}>();

const notifications = computed<Notification[]>(() => {
  return props.products
    .filter(product => product.quantity <= 10)
    .map(product => ({
      sku: product.sku,
      product,
      severity: product.quantity === 0 ? 'critical' : 'warning',
      message: product.quantity === 0 
        ? '⚠️ Producto agotado. Se requiere reabastecimiento inmediato.'
        : `⚠️ Stock bajo. Solo quedan ${product.quantity} unidades disponibles.`
    }))
    .sort((a, b) => a.product.quantity - b.product.quantity);
});

const criticalCount = computed(() => 
  notifications.value.filter(n => n.severity === 'critical').length
);

const warningCount = computed(() => 
  notifications.value.filter(n => n.severity === 'warning').length
);
</script>
