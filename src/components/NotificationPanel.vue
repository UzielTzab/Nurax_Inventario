<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div v-if="isOpen" class="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 max-h-[calc(100vh-6rem)] flex flex-col font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b border-gray-50">
        <div>
          <h3 class="text-[1.35rem] font-bold text-[#0A2540] tracking-tight">Notificaciones</h3>
          <p class="text-[0.9rem] text-slate-500 mt-0.5">Tienes {{ notifications.length }} alertas nuevas</p>
        </div>
        <button class="bg-slate-50 hover:bg-slate-100 text-[#0A2540] text-[0.85rem] font-semibold px-4 py-2 rounded-full transition-colors">
          Marcar leídas
        </button>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto w-full">
        <div v-for="notification in notifications" :key="notification.id" class="px-5 py-6 border-b border-gray-50/80 hover:bg-slate-50/50 transition-colors flex gap-4">
          <!-- Unread Dot -->
          <div class="mt-1.5 flex-shrink-0">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div 
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="{
                'bg-orange-50': notification.type === 'warning',
                'bg-blue-50': notification.type === 'sync',
                'bg-emerald-50': notification.type === 'success'
              }"
            >
              <ExclamationTriangleIcon v-if="notification.type === 'warning'" class="w-6 h-6 text-orange-500" />
              <ArrowPathIcon v-else-if="notification.type === 'sync'" class="w-6 h-6 text-blue-500" />
              <CurrencyDollarIcon v-else-if="notification.type === 'success'" class="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 pt-0.5">
            <div class="flex items-start justify-between">
              <h4 class="text-[1.05rem] font-bold text-[#1a2f45] leading-snug">{{ notification.title }}</h4>
              <span class="text-[0.8rem] text-slate-400 font-medium whitespace-nowrap ml-2">{{ notification.time }}</span>
            </div>
            
            <p class="text-[0.92rem] text-slate-500 mt-1.5 leading-relaxed pr-2">
              {{ notification.description }}
            </p>

            <div v-if="notification.primaryAction || notification.secondaryAction" class="mt-4 flex items-center gap-3">
              <AppButton 
                v-if="notification.primaryAction"
                variant="outline"
                class="!px-4 !py-1.5 !text-[0.85rem] !font-semibold !rounded-lg"
              >
                {{ notification.primaryAction.label }}
              </AppButton>
              
              <button 
                v-if="notification.secondaryAction"
                class="text-[0.9rem] font-semibold text-slate-500 hover:text-slate-800 transition-colors px-2"
              >
                {{ notification.secondaryAction.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-5 flex items-center justify-between rounded-b-2xl">
        <button class="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-[0.9rem] font-semibold">
          <Cog6ToothIcon class="w-5 h-5" />
          Configuración de alertas
        </button>
        <button class="flex items-center gap-1.5 text-[#06402B] hover:text-[#0a5c3a] transition-colors text-[0.95rem] font-bold">
          Ver todo 
          <ArrowRightIcon class="w-4 h-4 stroke-2" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
import AppButton from '@/components/ui/AppButton.vue';
import type { Product } from '@/stores/product.store';

interface NotificationItem {
  id: string;
  type: 'warning' | 'sync' | 'success';
  title: string;
  time: string;
  description: string;
  primaryAction?: {
    label: string;
    action: string;
  };
  secondaryAction?: {
    label: string;
    action: string;
  };
}

defineProps<{
  isOpen: boolean;
  products?: Product[];
}>();

defineEmits<{
  close: [];
  viewProduct: [product: any];
  restock: [product: any];
}>();

const notifications = ref<NotificationItem[]>([
  {
    id: '1',
    type: 'warning',
    title: 'Stock Bajo: Smartwatch Fit 2',
    time: '2m',
    description: 'El inventario ha caído por debajo del nivel mínimo (5 unidades). Restan 0 unidades.',
    primaryAction: {
      label: 'Ver Producto',
      action: 'view_product'
    },
    secondaryAction: {
      label: 'Ignorar',
      action: 'ignore'
    }
  },
  {
    id: '2',
    type: 'sync',
    title: 'Sincronización Completada',
    time: '15m',
    description: 'Se han actualizado 124 productos desde el almacén central exitosamente.',
    primaryAction: {
      label: 'Ver Log',
      action: 'view_log'
    }
  },
  {
    id: '3',
    type: 'success',
    title: 'Venta Mayorista #4920',
    time: '1h',
    description: 'Nueva orden grande aprobada por $4,500.00 de Cliente VIP.',
  }
]);
</script>
