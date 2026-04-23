<template>
  <Transition name="fade">
    <div v-if="isOpen && product" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <!-- Modal -->
      <Transition name="modal">
        <div v-if="isOpen && product" @click.stop class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Kárdex y Ajuste de Inventario</h2>
              <p class="text-sm text-gray-500">Producto: <strong>{{ product.name }}</strong> (SKU: {{ product.sku }})</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Body -->
          <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            
            <!-- Resumen actual y Ajuste manual -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Resumen -->
              <div class="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-center items-center">
                 <p class="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Stock Actual</p>
                 <p class="text-5xl font-black text-indigo-700">{{ product.stock }}</p>
                 <span class="mt-2 text-xs text-gray-400">Las ventas reducen esto automáticamente.</span>
              </div>
              
              <!-- Formulario de Ajuste -->
              <form @submit.prevent="submitAdjustment" class="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm relative">
                <div v-if="adjusting" class="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
                   <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
                
                <h3 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <WrenchScrewdriverIcon class="w-5 h-5 text-gray-500" />
                  Ajuste Manual
                </h3>
                
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Tipo de Ajuste</label>
                      <!-- Usando AppSelect sin la clase component directamente por Tailwind -->
                      <select v-model="form.tx_type" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="in">Entrada (+)</option>
                        <option value="out">Salida (-)</option>
                        <option value="adjustment">Ajuste Directo</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Cantidad</label>
                      <input type="number" step="1" min="1" v-model.number="form.quantity" required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Motivo / Notas</label>
                    <input type="text" v-model="form.notes" placeholder="Ej: Mercancía dañada, Conteo físico..." required class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  </div>
                  
                  <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 transition">
                    Guardar Ajuste
                  </button>
                </div>
              </form>
            </div>

            <!-- Historial (Kárdex) -->
            <div class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex-1 flex flex-col">
              <div class="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                <h3 class="font-bold text-gray-800 text-sm">Historial de Movimientos</h3>
                <button @click="loadKardex" class="text-xs text-indigo-600 font-semibold hover:underline">Actualizar</button>
              </div>
              
              <div class="p-0 overflow-auto max-h-64">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-gray-50 text-gray-500 sticky top-0">
                    <tr>
                      <th class="px-4 py-2 font-semibold">Fecha</th>
                      <th class="px-4 py-2 font-semibold">Tipo</th>
                      <th class="px-4 py-2 font-semibold text-right">Cantidad</th>
                      <th class="px-4 py-2 font-semibold">Motivo</th>
                      <th class="px-4 py-2 font-semibold">Usuario</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                     <tr v-if="loadingHistory">
                       <td colspan="5" class="px-4 py-8 text-center text-gray-400">Cargando historial...</td>
                     </tr>
                     <tr v-else-if="history.length === 0">
                       <td colspan="5" class="px-4 py-8 text-center text-gray-400">No hay movimientos registrados para este producto.</td>
                     </tr>
                     <tr v-for="tx in history" :key="tx.id" class="hover:bg-gray-50 transition-colors">
                       <td class="px-4 py-2 text-gray-600">{{ formatDate(tx.created_at) }}</td>
                       <td class="px-4 py-2">
                         <span class="px-2 py-1 rounded text-xs font-bold" :class="getTypeClass(tx.transaction_type)">
                           {{ formatType(tx.transaction_type) }}
                         </span>
                       </td>
                       <td class="px-4 py-2 text-right font-mono" :class="tx.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                         {{ tx.quantity > 0 ? '+' : '' }}{{ tx.quantity }}
                       </td>
                       <td class="px-4 py-2 text-gray-500 truncate max-w-[200px]" :title="tx.reason">{{ tx.reason }}</td>
                       <td class="px-4 py-2 text-gray-500">{{ tx.user }}</td>
                     </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XMarkIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/outline';
import { useProductStore, type InventoryTx } from '@/stores/product.store';
import { useSnackbar } from '@/composables/useSnackbar';

const props = defineProps<{
  isOpen: boolean;
  product: any; // El producto actual completo desde la tabla
}>();

const emit = defineEmits(['close', 'product-updated']);

const productStore = useProductStore();
const { enqueueSnackbar } = useSnackbar();

const history = ref<InventoryTx[]>([]);
const loadingHistory = ref(false);
const adjusting = ref(false);

const form = ref({
  tx_type: 'in',
  quantity: null as number | null,
  notes: ''
});

// Cargar kárdex cuando se abre el modal
watch(() => props.isOpen, async (newVal) => {
  if (newVal && props.product) {
    loadKardex();
    // Reset form
    form.value = { tx_type: 'in', quantity: null, notes: '' };
  }
});

const loadKardex = async () => {
  loadingHistory.value = true;
  try {
     const response = await productStore.fetchKardex(props.product.id);
     history.value = response.success && response.data ? response.data : [];
  } catch (err) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo cargar el historial' });
  } finally {
    loadingHistory.value = false;
  }
};

const submitAdjustment = async () => {
  if (!form.value.quantity || !form.value.notes) return;

  adjusting.value = true;
  
  // Transform to required backend format
  let finalQty = form.value.quantity;
  if(form.value.tx_type === 'out') finalQty = -Math.abs(finalQty);

  const result = await productStore.manualAdjustment(
    Number(props.product.id),
    Math.abs(form.value.quantity),
    form.value.tx_type as 'in' | 'out' | 'adjustment' | 'waste',
    form.value.notes
  );

  adjusting.value = false;

  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Ajuste Guardado', message: 'El inventario ha sido actualizado.' });
    // Refetch kardex
    loadKardex();
    // Reset current stock visually (the store updates the list, we notify parent)
    emit('product-updated');
    form.value.quantity = null;
    form.value.notes = '';
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error de ajuste', message: result.error || 'Ocurrió un problema.' });
  }
};

// Utils UI
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'
  });
};

const formatType = (val: string) => {
  const map: Record<string, string> = { 'in': 'ENTRADA', 'out': 'SALIDA', 'adjustment': 'AJUSTE', 'sale': 'VENTA', 'return': 'DEVOLUCIÓN' };
  return map[val] || val.toUpperCase();
};

const getTypeClass = (val: string) => {
  if(val === 'in') return 'bg-green-100 text-green-700';
  if(val === 'out' || val === 'sale') return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
