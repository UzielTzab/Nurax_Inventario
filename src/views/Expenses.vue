<template>
  <DashboardLayout>
    <div class="expenses-container">
      <div class="header">
        <div class="texts">
          <h1 class="page-title">Control de Gastos</h1>
          <p class="subtitle">Registra egresos como servicios, nomina y pago a proveedores.</p>
        </div>
        <AppButton variant="fill" @click="showAddModal = true">
          + Nuevo Gasto
        </AppButton>
      </div>

      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Categoria</th>
              <th>Descripcion</th>
              <th>Comprobante</th>
              <th align="right">Monto</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="expensesStore.isLoading">
              <tr v-for="i in 5" :key="'sk-exp-' + i">
                <td><AppSkeleton width="40px" height="1rem" /></td>
                <td><AppSkeleton width="80px" height="1rem" /></td>
                <td><AppSkeleton width="90px" height="1.5rem" radius="99px" /></td>
                <td><AppSkeleton width="150px" height="1rem" /></td>
                <td><AppSkeleton width="80px" height="1rem" /></td>
                <td align="right"><AppSkeleton width="60px" height="1rem" /></td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="expense in expensesStore.expenses" :key="expense.id">
                <td>#{{ expense.id }}</td>
                <td>{{ formatDate(expense.created_at) }}</td>
                <td>
                  <Badge :variant="categoryBadgeVariant(expense.category)">
                    {{ expense.category }}
                  </Badge>
                </td>
                <td class="description-cell">{{ expense.description }}</td>
                <td>
                  <a v-if="expense.receipt_url" :href="expense.receipt_url" target="_blank" class="btn-link">Ver Recibo</a>
                  <span v-else class="text-muted">Ninguno</span>
                </td>
                <td align="right" class="font-bold text-danger">- ${{ expense.amount }}</td>
              </tr>
              <tr v-if="expensesStore.expenses.length === 0">
                <td colspan="6" class="text-center text-muted py-4">No hay gastos registrados</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <AppModal
        :is-open="showAddModal"
        title="Registrar Nuevo Gasto"
        size="md"
        @close="showAddModal = false"
      >
        <form @submit.prevent="submitExpense" class="modal-body">
          <div class="form-group">
            <AppInput
              v-model="form.amount"
              type="number"
              step="0.01"
              label="Monto a descontar ($)"
              placeholder="0.00"
              required
            />
          </div>

          <div class="form-group">
            <AppSelect
              v-model="form.category"
              label="Categoria"
              placeholder="Selecciona una categoria"
              :options="[
                { value: 'servicios', label: 'Servicios (Luz, Agua, Internet)' },
                { value: 'nomina', label: 'Nomina / Sueldos' },
                { value: 'proveedores', label: 'Pago a Proveedores' },
                { value: 'varios', label: 'Varios / Otros' }
              ]"
            />
          </div>

          <div class="form-group">
            <label>Descripcion / Motivo</label>
            <textarea
              v-model="form.description"
              required
              class="input textarea-input"
              rows="3"
              placeholder="Ej: Pago de recibo CFE bimestral"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Comprobante o Recibo (Opcional - Imagen)</label>
            <input type="file" @change="handleFileUpload" accept="image/*,.pdf" class="input file-input" />
          </div>

          <div class="modal-footer">
            <AppButton variant="outline" size="md" type="button" @click="showAddModal = false">
              Cancelar
            </AppButton>
            <AppButton variant="fill" size="md" type="submit" :loading="expensesStore.isLoading">
              {{ expensesStore.isLoading ? 'Guardando...' : 'Guardar Gasto' }}
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { AppButton, AppSkeleton, AppSelect, AppModal, AppInput, Badge } from '@/components/ui';
import { useExpensesStore } from '@/stores/expenses.store';
import { useSnackbar } from '@/composables/useSnackbar';

const expensesStore = useExpensesStore();
const { enqueueSnackbar } = useSnackbar();
const showAddModal = ref(false);

const form = ref({
  amount: '' as '' | number,
  category: 'servicios',
  description: '',
  receipt_file: null as File | null
});

onMounted(() => {
  expensesStore.fetchExpenses();
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
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
    amount: Number(form.value.amount),
    category: form.value.category,
    description: form.value.description,
    receipt_file: form.value.receipt_file
  });

  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Gasto Registrado', message: 'El egreso fue guardado correctamente.' });
    showAddModal.value = false;
    form.value = { amount: '', category: 'servicios', description: '', receipt_file: null };
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error', message: result.error || 'Hubo un error al guardar el gasto.' });
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' });
};

const categoryBadgeVariant = (cat: string) => {
  const map: Record<string, 'info' | 'warning' | 'danger' | 'default'> = {
    servicios: 'info',
    nomina: 'warning',
    proveedores: 'danger',
    varios: 'default'
  };
  return map[cat] || 'default';
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

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.data-table td {
  color: #111827;
  font-size: 0.875rem;
  vertical-align: middle;
}

.description-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-danger {
  color: #dc2626;
}

.font-bold {
  font-weight: 700;
}

.text-muted {
  color: #9ca3af;
}

.btn-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.btn-link:hover {
  text-decoration: underline;
}

.modal-body {
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
  color: #374151;
}

.input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #047857;
  box-shadow: 0 0 0 2px rgba(4, 120, 87, 0.2);
}

.file-input {
  padding: 0.4rem;
  font-size: 0.875rem;
}

.textarea-input {
  resize: vertical;
  min-height: 88px;
}

.modal-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
