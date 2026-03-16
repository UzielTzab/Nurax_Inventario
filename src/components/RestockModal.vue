<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-content restock-modal">
          <!-- Header -->
          <div class="modal-header">
            <h2>Reabastecer Inventario</h2>
            <button class="close-btn" @click="handleCancel">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Formulario -->
          <div class="modal-body">
            <!-- Producto: Selector O Display -->
            <div class="form-group">
              <label for="product">Producto *</label>
              <!-- Si se pasa productId específico, mostrar nombre del producto (no selector) -->
              <template v-if="props.productId">
                <div class="product-display">
                  <strong>{{ selectedProductName }}</strong>
                  <span class="product-stock">(Stock actual: {{ currentProductStock }})</span>
                </div>
              </template>
              <!-- Si no, mostrar selector -->
              <select v-else id="product" v-model="form.product_id" class="form-select">
                <option value="">Selecciona un producto...</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }} (Stock: {{ p.stock }})
                </option>
              </select>
            </div>

            <!-- Cantidad -->
            <div class="form-group">
              <label for="qty">Cantidad a Comprar *</label>
              <AppInput 
                id="qty"
                v-model.number="form.quantity" 
                type="number" 
                min="1"
                placeholder="Ej: 5"
              />
            </div>

            <!-- Costo Unitario -->
            <div class="form-group">
              <label for="unitcost">Costo Unitario ($) *</label>
              <AppInput 
                id="unitcost"
                v-model.number="form.unit_cost" 
                type="number" 
                step="0.01"
                min="0.01"
                placeholder="Ej: 50.00"
              />
            </div>

            <!-- Costo Total (Display) -->
            <div class="form-group">
              <label>Costo Total (Automático)</label>
              <div class="cost-display">
                <strong class="cost-value">${{ totalCost.toFixed(2) }}</strong>
              </div>
            </div>

            <!-- Proveedor -->
            <div class="form-group">
              <label for="supplier">Proveedor (Opcional)</label>
              <select id="supplier" v-model="form.supplier_id" class="form-select">
                <option value="">Sin proveedor</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <!-- Notas -->
            <div class="form-group">
              <label for="notes">Notas (Opcional)</label>
              <textarea 
                id="notes"
                v-model="form.notes" 
                class="form-textarea"
                rows="2"
                placeholder="Ej: Compra mayorista, primer envío..."
              ></textarea>
            </div>

            <!-- Resumen -->
            <div class="restock-summary">
              <div class="summary-item">
                <span>✓ Units a agregar:</span>
                <strong>{{ form.quantity }}</strong>
              </div>
              <div class="summary-item">
                <span>✓ Gasto registrado:</span>
                <strong>${{ totalCost.toFixed(2) }}</strong>
              </div>
              <div class="summary-item">
                <span>✓ Se descontará del cierre de caja</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <AppButton variant="outline" @click="handleCancel">
              Cancelar
            </AppButton>
            <AppButton @click="handleSubmit" :loading="isLoading">
              Confirmar Restock
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useProducts } from '@/composables/useProducts';
import { useSuppliers } from '@/composables/useSuppliers';
import apiClient from '@/services/api';

interface Props {
  isOpen: boolean;
  productId?: number | string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

const { enqueueSnackbar } = useSnackbar();
const { products, fetchProducts } = useProducts();
const { suppliers, fetchSuppliers } = useSuppliers();

const isLoading = ref(false);

const form = ref({
  product_id: props.productId ? String(props.productId) : '',
  quantity: 1,
  unit_cost: 0,
  supplier_id: '',
  notes: ''
});

const totalCost = computed(() => form.value.quantity * form.value.unit_cost);

// Si se pasa productId, obtener el nombre y stock actual del producto
const selectedProductName = computed(() => {
  if (!props.productId) return '';
  const product = products.value.find(p => String(p.id) === String(props.productId));
  return product?.name || 'Producto no encontrado';
});

const currentProductStock = computed(() => {
  if (!props.productId) return 0;
  const product = products.value.find(p => String(p.id) === String(props.productId));
  return product?.stock || 0;
});

// Cargar productos y proveedores cuando el modal se abre
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await Promise.all([fetchProducts(), fetchSuppliers()]);
    }
  }
);

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchSuppliers()]);
});

const handleCancel = () => {
  resetForm();
  emit('cancel');
};

const handleSubmit = async () => {
  // Si productId está presente, usar ese. Si no, validar que se haya seleccionado uno
  const productIdToUse = props.productId ? String(props.productId) : form.value.product_id;
  
  if (!productIdToUse || !form.value.quantity || !form.value.unit_cost) {
    enqueueSnackbar({
      type: 'error',
      title: 'Campos Requeridos',
      message: 'Por favor completa: Producto, Cantidad y Costo Unitario.'
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await apiClient.post<{ quantity: number; expense_amount: number }>('/products/register-restock/', {
      product_id: parseInt(productIdToUse),
      quantity: form.value.quantity,
      unit_cost: form.value.unit_cost,
      supplier_id: form.value.supplier_id ? parseInt(String(form.value.supplier_id)) : null,
      expense_category: 'inventario',
      notes: form.value.notes
    });

    enqueueSnackbar({
      type: 'success',
      title: '✓ Restock Registrado',
      message: `+${response.data?.quantity || 0} unidades. Gasto: $${response.data?.expense_amount || 0}`
    });

    resetForm();
    emit('confirm');
  } catch (error: any) {
    enqueueSnackbar({
      type: 'error',
      title: 'Error al Reabastecer',
      message: error.response?.data?.error || error.message
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    product_id: props.productId ? String(props.productId) : '',
    quantity: 1,
    unit_cost: 0,
    supplier_id: '',
    notes: ''
  };
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: var(--color-text-main);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.product-display {
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #22a84a;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9375rem;
}

.product-display strong {
  color: var(--color-brand-main);
  font-weight: 600;
}

.product-stock {
  font-size: 0.8125rem;
  color: #666;
}

.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-text-main);
  background: white;
  transition: all 0.2s;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.cost-display {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 6px;
  text-align: center;
}

.cost-value {
  font-size: 1.5rem;
  color: var(--color-brand-main);
}

.restock-summary {
  padding: 1rem;
  background: #f0fdf4;
  border-left: 4px solid var(--color-brand-main);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #047857;
}

.summary-item strong {
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
  background: #fafafa;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}
</style>
