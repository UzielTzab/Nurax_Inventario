<template>
  <DashboardLayout>
  <div class="expenses-container">
    <div class="header">
      <div class="texts">
        <h1 class="page-title">Control de Gastos</h1>
        <p class="subtitle">Registra egresos como servicios, nómina y pago a proveedores.</p>
      </div>
      <button @click="showAddModal = true" class="btn btn-primary">
         + Nuevo Gasto
      </button>
    </div>

    <!-- Lista de Gastos -->
    <div class="card">
       <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Comprobante</th>
              <th align="right">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expensesStore.expenses" :key="expense.id">
              <td>#{{ expense.id }}</td>
              <td>{{ formatDate(expense.created_at) }}</td>
              <td>
                <span class="badge" :class="categoryBadge(expense.category)">
                  {{ expense.category }}
                </span>
              </td>
              <td class="description-cell">{{ expense.description }}</td>
              <td>
                <a :href="expense.receipt_url" target="_blank" v-if="expense.receipt_url" class="btn-link">Ver Recibo</a>
                <span v-else class="text-muted">Ninguno</span>
              </td>
              <td align="right" class="font-bold text-danger">- ${{ expense.amount }}</td>
            </tr>
            <tr v-if="expensesStore.expenses.length === 0 && !expensesStore.isLoading">
              <td colspan="6" class="text-center text-muted py-4">No hay gastos registrados</td>
            </tr>
          </tbody>
       </table>
    </div>

    <!-- Modal Agregar Gasto -->
    <div class="modal-backdrop" v-if="showAddModal" @click.self="showAddModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Registrar Nuevo Gasto</h2>
          <button @click="showAddModal = false" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="submitExpense" class="modal-body">
          <div class="form-group">
            <label>Monto a descontar ($)</label>
            <input type="number" step="0.01" v-model.number="form.amount" required class="input" placeholder="0.00">
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="form.category" required class="input">
              <option value="servicios">Servicios (Luz, Agua, Internet)</option>
              <option value="nomina">Nómina / Sueldos</option>
              <option value="proveedores">Pago a Proveedores</option>
              <option value="varios">Varios / Otros</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción / Motivo</label>
            <textarea v-model="form.description" required class="input" rows="3" placeholder="Ej: Pago de recibo CFE bimestral"></textarea>
          </div>

          <div class="form-group">
            <label>Comprobante o Recibo (Opcional - Imagen)</label>
            <input type="file" @change="handleFileUpload" accept="image/*,.pdf" class="input file-input" />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="expensesStore.isLoading">
               {{ expensesStore.isLoading ? 'Guardando...' : 'Guardar Gasto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useExpensesStore } from '@/stores/expenses.store';
import { useSnackbar } from '@/composables/useSnackbar';

const expensesStore = useExpensesStore();
const { enqueueSnackbar } = useSnackbar();
const showAddModal = ref(false);

const form = ref({
  amount: null as number | null,
  category: 'servicios',
  description: '',
  receipt_file: null as File | null
});

onMounted(() => {
  expensesStore.fetchExpenses();
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if(target.files && target.files.length > 0) {
    form.value.receipt_file = target.files[0] || null;
  } else {
    form.value.receipt_file = null;
  }
};

const submitExpense = async () => {
  if (!form.value.amount || !form.value.category || !form.value.description) {
    enqueueSnackbar({ type: 'warning', title: 'Faltan datos', message: 'Llena todos los campos requeridos.' });
    return;
  }
  
  const result = await expensesStore.addExpense({
    amount: form.value.amount,
    category: form.value.category,
    description: form.value.description,
    receipt_file: form.value.receipt_file
  });

  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Gasto Registrado', message: 'El egreso fue guardado correctamente.' });
    showAddModal.value = false;
    form.value = { amount: null, category: 'servicios', description: '', receipt_file: null };
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error', message: result.error || 'Hubo un error al guardar el gasto.' });
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' });
};

const categoryBadge = (cat: string) => {
  const map: Record<string, string> = {
    'servicios': 'badge-blue',
    'nomina': 'badge-purple',
    'proveedores': 'badge-orange',
    'varios': 'badge-gray'
  };
  return map[cat] || 'badge-gray';
};
</script>

<style scoped>
.expenses-container {
  padding: 2rem;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.page-title { margin: 0 0 0.5rem 0; font-size: 1.875rem; font-weight: 700; color: #111827; }
.subtitle { margin: 0; color: #6b7280; font-size: 1rem; }
.card {
  background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e5e7eb;
}
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 1rem 1.5rem; text-align: left; border-bottom: 1px solid #f3f4f6; }
.data-table th { background: #f9fafb; font-weight: 600; color: #4b5563; text-transform: uppercase; font-size: 0.75rem; }
.data-table td { color: #111827; font-size: 0.875rem; vertical-align: middle; }
.description-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.badge-blue { background: #dbeafe; color: #1e40af; }
.badge-purple { background: #f3e8ff; color: #6b21a8; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-gray { background: #f3f4f6; color: #374151; }
.text-danger { color: #dc2626; }
.font-bold { font-weight: 700; }
.text-muted { color: #9ca3af; }
.btn-link { color: #2563eb; text-decoration: none; font-weight: 600; }
.btn-link:hover { text-decoration: underline; }

.btn { padding: 0.75rem 1.2rem; border-radius: 24px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: var(--color-brand-main, #047857); color: white; }
.btn-primary:hover:not(:disabled) { background: #065f46; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
.modal-card { background: white; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 600; }
.close-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
.input { padding: 0.6rem 0.8rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; font-family: inherit; }
.input:focus { outline: none; border-color: #047857; box-shadow: 0 0 0 2px rgba(4,120,87,0.2); }
.file-input { padding: 0.4rem; font-size: 0.875rem; }
.modal-footer { margin-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
</style>
