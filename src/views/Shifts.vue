<template>
  <DashboardLayout>
  <div class="shifts-wrapper">
    <!-- Skeleton Loading Inicial -->
    <template v-if="shiftsStore.isLoading && shiftsStore.shifts.length === 0">
       <div class="shifts-container">
         <div class="header">
            <AppSkeleton width="250px" height="2rem" style="margin-bottom:0.5rem" />
            <AppSkeleton width="400px" height="1rem" />
         </div>
         <div class="active-shift-card card">
           <div class="card-header">
             <AppSkeleton width="150px" height="1.5rem" />
           </div>
           <div class="card-body">
             <div class="stats-grid">
               <AppSkeleton width="100%" height="80px" radius="8px" />
               <AppSkeleton width="100%" height="80px" radius="8px" />
             </div>
             <AppSkeleton width="100%" height="150px" radius="8px" style="margin-top:1.5rem"/>
           </div>
         </div>
       </div>
    </template>

    <template v-else>
      <!-- Contenedor Principal (Con Turno Abierto) -->
      <div class="shifts-container" v-if="shiftsStore.hasOpenShift">
      <div class="header flex justify-between items-start">
        <div>
          <h1 class="page-title">Corte de Caja (Turno Actual)</h1>
          <p class="subtitle">Gestiona tu turno. Aquí registrarás tu corte sólo cuando termines tu jornada.</p>
        </div>
        <AppButton variant="fill" @click="router.push('/dashboard/inventory')">
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          Ir al Inventario
        </AppButton>
      </div>

    <!-- Turno Abierto -->
    <div class="active-shift-card card">
      <div class="card-header">
        <h2 class="card-title">💵 Turno en progreso</h2>
        <span class="badge badge-success">Abierto</span>
      </div>
      <div class="card-body">
        <div class="stats-grid turn-kpi-grid">
          <div class="stat-box">
            <span class="stat-label">Fondo Inicial</span>
            <span class="stat-value">${{ formatMoney(turnKpis.startingCash) }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Entradas (+)</span>
            <span class="stat-value text-success">${{ formatMoney(turnKpis.entries) }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Salidas (-)</span>
            <span class="stat-value text-warning">${{ formatMoney(turnKpis.exits) }}</span>
          </div>
          <div class="stat-box expected-box">
            <div class="expected-label-row">
              <span class="stat-label">Efectivo Esperado (=)</span>
              <button
                v-if="isBlindCutRole"
                class="blind-toggle"
                type="button"
                @click="showExpectedForBlindCut = !showExpectedForBlindCut"
                :title="showExpectedForBlindCut ? 'Ocultar esperado' : 'Revelar esperado'"
              >
                <EyeSlashIcon v-if="!showExpectedForBlindCut" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
            <span v-if="!isBlindCutRole || showExpectedForBlindCut" class="stat-value stat-value-emphasis">
              ${{ formatMoney(turnKpis.expectedCash) }}
            </span>
            <span v-else class="stat-value stat-value-hidden">••••••</span>
          </div>
        </div>
        <p class="help-text open-time-text">Apertura: {{ formatDate(currentShift?.opened_at) }}</p>
        
        <div class="close-shift-action mt-6">
          <h3>Realizar Corte (Cerrar Caja)</h3>
          <p class="help-text text-sm">
            <strong>⚠️ Alerta:</strong> Sólo realiza esta acción al finalizar tu día de trabajo o terminar tu turno. Necesitarás contar el dinero de tu caja.
          </p>
          <div class="mt-4">
             <AppButton @click="showCloseShiftModal = true" variant="fill">
               Terminar turno y cerrar caja
             </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Ningún Turno Abierto -->
  <div class="shifts-container" v-else>
    <div class="header flex justify-between items-start">
      <div>
        <h1 class="page-title">Bienvenido a tu Jornada</h1>
        <p class="subtitle">Antes de empezar a vender, debes aperturar la caja indicando tu efectivo base o fondo inicial.</p>
      </div>
      <AppButton variant="outline" @click="router.push('/dashboard/inventory')">
        <ArrowLeftIcon class="w-5 h-5 mr-1" />
        Ir a Inventario
      </AppButton>
    </div>

    <div class="open-shift-card card">
      <div class="card-header">
        <h2 class="card-title">Apertura de Caja</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleOpenShift" class="form-grid">
          <div class="form-group">
            <label>Fondo de Caja (Efectivo inicial disponible para dar cambios):</label>
            <input type="number" step="0.01" v-model.number="openForm.starting_cash" required class="input input-lg text-center" placeholder="$ 0.00" />
          </div>
          <AppButton type="submit" variant="fill" class="w-full flex justify-center py-3" style="font-size: 1.125rem;" :loading="shiftsStore.isLoading">
            <span v-if="shiftsStore.isLoading">Abriendo turno...</span>
            <span v-else>Abrir Turno</span>
          </AppButton>
        </form>
      </div>
    </div>
  </div>
  </template>

  <!-- Historial de Turnos -->
  <div class="shifts-container pt-8">
    <div class="header">
      <h2 class="page-title">Historial de Cortes de Caja</h2>
    </div>
    <div class="card">
       <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Inicial</th>
              <th>Esperado</th>
              <th>Real Contado</th>
              <th>Diferencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="shiftsStore.isLoading">
              <tr v-for="i in 5" :key="'sk-shft-'+i">
                <td><AppSkeleton width="40px" height="1rem" /></td>
                <td><AppSkeleton width="100px" height="1rem" /></td>
                <td><AppSkeleton width="100px" height="1rem" /></td>
                <td><AppSkeleton width="70px" height="1rem" /></td>
                <td><AppSkeleton width="70px" height="1rem" /></td>
                <td><AppSkeleton width="70px" height="1rem" /></td>
                <td><AppSkeleton width="70px" height="1rem" /></td>
                <td><AppSkeleton width="60px" height="1.5rem" radius="99px" /></td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="shift in paginatedShifts" :key="shift.id" class="clickable-row" @click="openShiftDetail(shift)">
                <td>#{{ shift.id }}</td>
                <td>{{ formatDate(shift.opened_at) }}</td>
                <td>{{ shift.closed_at ? formatDate(shift.closed_at) : 'N/A' }}</td>
                <td>${{ shift.starting_cash }}</td>
                <td>{{ shift.expected_cash ? '$'+shift.expected_cash : '-' }}</td>
                <td>{{ shift.actual_cash ? '$'+shift.actual_cash : '-' }}</td>
                <td>
                  <span v-if="shift.difference !== null && shift.difference !== undefined" :class="differenceToneClass(shift)">
                    <span v-if="Number(shift.difference) < 0">▼</span>
                    <span v-else-if="Number(shift.difference) > 0">▲</span>
                    ${{ shift.difference }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span class="badge" :class="statusBadgeClass(shift)">
                    {{ statusBadgeText(shift) }}
                  </span>
                </td>
              </tr>
              <tr v-if="completedShifts.length === 0">
                <td colspan="8" class="text-center text-muted py-4">No hay turnos registrados</td>
              </tr>
            </template>
          </tbody>
       </table>
       <!-- Paginación usando el componente reutilizable -->
       <div class="px-6 pb-6">
         <Pagination
           v-model:current-page="currentPage"
           v-model:page-size="pageSize"
           :total="completedShifts.length"
         />
       </div>
    </div>
  </div>
  </div>

  <!-- Modal Arqueo de Caja -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="showCloseShiftModal" class="modal-overlay" @click.self="closeArqueoModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Arqueo de Caja</h3>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Dinero contado</label>
              <input
                type="number"
                step="0.01"
                v-model.number="closeForm.actual_cash"
                class="input input-lg"
                placeholder="$ 0.00"
              />
            </div>

            <div v-if="closeForm.actual_cash !== null" class="difference-alert" :class="differenceClass">
              <template v-if="(calculatedDifference ?? 0) > 0">
                Tienes un sobrante de ${{ Math.abs(calculatedDifference || 0).toFixed(2) }}
              </template>
              <template v-else-if="(calculatedDifference ?? 0) < 0">
                Tienes un faltante de -${{ Math.abs(calculatedDifference || 0).toFixed(2) }}. ¿Estás seguro de continuar?
              </template>
              <template v-else>
                Caja cuadrada perfectamente
              </template>
            </div>

            <div class="modal-actions">
              <AppButton variant="outline" type="button" @click="closeArqueoModal">Cancelar</AppButton>
              <AppButton
                variant="fill"
                type="button"
                style="background-color: #991b1b; border-color: #991b1b;"
                :loading="shiftsStore.isLoading"
                @click="handleCloseShift"
              >
                Confirmar Cierre de Turno
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- Drawer detalle de corte -->
  <teleport to="body">
    <transition name="drawer-slide">
      <div v-if="showShiftDetailDrawer" class="drawer-backdrop" @click.self="showShiftDetailDrawer = false">
        <aside class="drawer-panel">
          <header class="drawer-header">
            <h3>Detalle de Corte</h3>
            <button class="drawer-close" @click="showShiftDetailDrawer = false">✕</button>
          </header>

          <div class="drawer-body" v-if="selectedShiftDetail">
            <div class="drawer-kpis">
              <div><strong>Ventas:</strong> {{ selectedShiftSales.length }}</div>
              <div><strong>Gastos:</strong> {{ selectedShiftExpenses.length }}</div>
              <div><strong>Entradas:</strong> ${{ formatMoney(selectedShiftEntries) }}</div>
              <div><strong>Salidas:</strong> ${{ formatMoney(selectedShiftExits) }}</div>
            </div>

            <section class="drawer-section">
              <h4>Gastos del turno</h4>
              <ul v-if="selectedShiftExpenses.length > 0" class="drawer-list">
                <li v-for="expense in selectedShiftExpenses" :key="expense.id">
                  <span>{{ expense.description || 'Gasto operativo' }}</span>
                  <strong>${{ formatMoney(Number(expense.amount || 0)) }}</strong>
                </li>
              </ul>
              <p v-else class="text-muted">No hay gastos registrados para este turno.</p>
            </section>

            <section class="drawer-section">
              <h4>Ventas del turno</h4>
              <ul v-if="selectedShiftSales.length > 0" class="drawer-list">
                <li v-for="sale in selectedShiftSales" :key="sale.id">
                  <span>#{{ sale.id }} · {{ formatDate(sale.created_at) }}</span>
                  <strong>${{ formatMoney(Number(sale.total_amount ?? sale.total ?? 0)) }}</strong>
                </li>
              </ul>
              <p v-else class="text-muted">No hay ventas registradas para este turno.</p>
            </section>
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppSkeleton from '@/components/ui/AppSkeleton.vue';
import AppButton from '@/components/ui/AppButton.vue';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { useShiftsStore } from '@/stores/shifts.store';
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuth } from '@/composables/useAuth';
import apiClient from '@/services/api';
import Pagination from '@/components/ui/Pagination.vue';

const router = useRouter();

const shiftsStore = useShiftsStore();
const { currentUser, initSession } = useAuth();
const { enqueueSnackbar } = useSnackbar();

const currentShift = computed(() => shiftsStore.currentShift);
const completedShifts = computed(() => shiftsStore.shifts.filter(s => s.closed_at !== null));

const currentPage = ref(1);
const pageSize = ref(10);

const paginatedShifts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return completedShifts.value.slice(start, end);
});

const showCloseShiftModal = ref(false);
const showShiftDetailDrawer = ref(false);
const selectedShiftDetail = ref<any | null>(null);
const selectedShiftSales = ref<any[]>([]);
const selectedShiftExpenses = ref<any[]>([]);
const selectedShiftEntries = ref(0);
const selectedShiftExits = ref(0);

const turnKpis = ref({
  startingCash: 0,
  entries: 0,
  exits: 0,
  expectedCash: 0,
});

const showExpectedForBlindCut = ref(false);
const isBlindCutRole = computed(() => {
  const role = String(currentUser.value?.role || '').toLowerCase();
  return role === 'cajero' || role === 'cashier';
});

const openForm = ref({
  starting_cash: null as number | null
});

const closeForm = ref({
  expected_cash: null as number | null,
  actual_cash: null as number | null
});

onMounted(async () => {
  await initSession();
  await shiftsStore.fetchShifts();
  await loadCurrentShiftKpis();
});

watch(
  () => currentShift.value?.id,
  async () => {
    await loadCurrentShiftKpis();
  }
);

const normalizeList = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const toNumber = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value: unknown): string => toNumber(value).toFixed(2);

const loadShiftFinancialData = async (shiftId: string | number) => {
  const [movementsRes, salesRes, expensesRes] = await Promise.all([
    apiClient.get<any>('/v1/expenses/cash-movements/', { params: { cash_shift: String(shiftId) } }),
    apiClient.get<any>('/v1/sales/sales/', { params: { cash_shift: String(shiftId), page_size: 200 } }),
    apiClient.get<any>('/v1/expenses/expenses/', { params: { cash_shift: String(shiftId), page_size: 200 } }),
  ]);

  const movements = normalizeList(movementsRes.data);
  const sales = normalizeList(salesRes.data);
  const expenses = normalizeList(expensesRes.data);

  const movementIn = movements
    .filter((m) => m.movement_type === 'in')
    .reduce((acc, m) => acc + toNumber(m.amount), 0);

  const movementOut = movements
    .filter((m) => m.movement_type === 'out')
    .reduce((acc, m) => acc + toNumber(m.amount), 0);

  const salesCashIn = sales
    .filter((sale) => ['paid', 'partial', 'completed'].includes(String(sale.status || '').toLowerCase()))
    .reduce((acc, sale) => {
      const paid = sale.amount_paid ?? sale.total_amount ?? sale.total ?? 0;
      return acc + toNumber(paid);
    }, 0);

  const expensesCashOut = expenses
    .filter((expense) => !expense.payment_method || String(expense.payment_method).toLowerCase() === 'cash')
    .reduce((acc, expense) => acc + toNumber(expense.amount), 0);

  return {
    sales,
    expenses,
    entries: movementIn + salesCashIn,
    exits: movementOut + expensesCashOut,
  };
};

const loadCurrentShiftKpis = async () => {
  if (!currentShift.value) {
    turnKpis.value = {
      startingCash: 0,
      entries: 0,
      exits: 0,
      expectedCash: 0,
    };
    return;
  }

  try {
    const financialData = await loadShiftFinancialData(currentShift.value.id);
    const startingCash = toNumber(currentShift.value.starting_cash);
    const expectedCash = startingCash + financialData.entries - financialData.exits;

    turnKpis.value = {
      startingCash,
      entries: financialData.entries,
      exits: financialData.exits,
      expectedCash,
    };
  } catch (error) {
    console.error('Error loading shift KPI data:', error);
  }
};

const handleOpenShift = async () => {
  if (openForm.value.starting_cash === null || openForm.value.starting_cash < 0) {
    enqueueSnackbar({ type: 'warning', title: 'Fondo de caja inválido', message: 'Por favor, ingresa al menos 0.00' });
    return;
  }
  
  const result = await shiftsStore.openShift(openForm.value.starting_cash);
  
  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Turno Abierto', message: '¡Que tengas una excelente jornada!' });
    openForm.value.starting_cash = null;
    await loadCurrentShiftKpis();
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error al abrir turno', message: result.error });
  }
};

const handleCloseShift = async () => {
  if (closeForm.value.actual_cash === null) {
      enqueueSnackbar({ type: 'warning', title: 'Información incompleta', message: 'Por favor ingresa la cantidad real.' });
      return;
  }
  if(!shiftsStore.currentShift) return;

  const result = await shiftsStore.closeShift(
    shiftsStore.currentShift.id, 
    turnKpis.value.expectedCash,
    closeForm.value.actual_cash
  );

  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Turno Cerrado', message: 'El corte de caja finalizó exitosamente.' });
    closeForm.value.expected_cash = null;
    closeForm.value.actual_cash = null;
    showCloseShiftModal.value = false;
    await shiftsStore.fetchShifts();
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error', message: result.error });
  }
};

const closeArqueoModal = () => {
  showCloseShiftModal.value = false;
  closeForm.value.actual_cash = null;
};

const calculatedDifference = computed(() => {
  if (closeForm.value.actual_cash !== null) {
    return closeForm.value.actual_cash - turnKpis.value.expectedCash;
  }
  return null;
});

const differenceClass = computed(() => {
  if (calculatedDifference.value === null) return '';
  if (calculatedDifference.value < 0) return 'text-danger font-bold';
  if (calculatedDifference.value > 0) return 'text-success font-bold';
  return 'text-muted';
});

const differenceToneClass = (shift: any) => {
  const diff = toNumber(shift.difference);
  if (diff < 0) return 'text-danger font-bold';
  if (diff > 0) return 'text-success font-bold';
  return 'text-muted';
};

const statusBadgeText = (shift: any) => {
  if (!shift.closed_at) return 'Abierto';
  const diff = Math.abs(toNumber(shift.difference));
  return diff < 0.01 ? 'Cuadrada' : 'Con Diferencia';
};

const statusBadgeClass = (shift: any) => {
  if (!shift.closed_at) return 'badge-success';
  const diff = Math.abs(toNumber(shift.difference));
  return diff < 0.01 ? 'badge-success' : 'badge-warning';
};

const openShiftDetail = async (shift: any) => {
  selectedShiftDetail.value = shift;
  showShiftDetailDrawer.value = true;
  selectedShiftSales.value = [];
  selectedShiftExpenses.value = [];
  selectedShiftEntries.value = 0;
  selectedShiftExits.value = 0;

  try {
    const financialData = await loadShiftFinancialData(shift.id);
    selectedShiftSales.value = financialData.sales;
    selectedShiftExpenses.value = financialData.expenses;
    selectedShiftEntries.value = financialData.entries;
    selectedShiftExits.value = financialData.exits;
  } catch (error) {
    console.error('Error loading shift detail:', error);
    enqueueSnackbar({
      type: 'warning',
      title: 'Detalle incompleto',
      message: 'No se pudieron cargar todos los datos del turno seleccionado.',
    });
  }
};

const formatDate = (dateStr: string | undefined | null) => {
  if(!dateStr) return '';
  const opts: Intl.DateTimeFormatOptions = { 
    year: 'numeric', month: 'short', day: '2-digit', 
    hour: '2-digit', minute:'2-digit' 
  };
  return new Date(dateStr).toLocaleDateString('es-MX', opts);
};
</script>

<style scoped>
.shifts-wrapper{
  background-color: var(--color-card-stats-fill);
}

.shifts-container {
  padding: 2rem;
  margin: 0 auto;
  background-color: var(--color-card-stats-fill);
}
.header {
  margin-bottom: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-main, #111827);
  margin-bottom: 0.5rem;
}
.subtitle {
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
.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}
.card-body {
  padding: 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.turn-kpi-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.stat-box {
  display: flex;
  flex-direction: column;
}
.expected-box {
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 10px;
  padding: 0.75rem;
}
.expected-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.blind-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 8px;
  padding: 0.2rem;
  color: #334155;
}
.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.stat-value-emphasis {
  color: #166534;
}
.stat-value-hidden {
  letter-spacing: 0.2rem;
  color: #64748b;
}
.open-time-text {
  margin-top: -0.75rem;
}
.date-value {
  font-size: 1rem;
  margin-top: 0.5rem;
}
.close-shift-action {
  background: #fff;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.close-shift-action h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}
.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
.input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}
.input:focus {
  outline: none;
  border-color: var(--color-brand-main, #047857);
  box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.1);
}
.input-lg {
  font-size: 1.5rem;
  padding: 1rem;
  font-weight: 700;
}
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  color: white;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary { background: var(--color-brand-main, #047857); }
.btn-primary:hover:not(:disabled) { background: #065f46; }
.btn-danger { background: #ef4444; }
.btn-danger:hover:not(:disabled) { background: #dc2626; }
.btn-lg { font-size: 1.125rem; padding: 1rem; width: 100%; }
.difference-alert {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 1.125rem;
}
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}
.badge-success { background: #d1fae5; color: #065f46; }
.badge-neutral { background: #e5e7eb; color: #374151; }
.badge-warning { background: #fef3c7; color: #92400e; }
.text-danger { color: #dc2626; }
.text-success { color: #059669; }
.text-warning { color: #d97706; }
.text-muted { color: #9ca3af; }
.text-center { text-align: center; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td {
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
}
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover {
  background: #f8fafc;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-card {
  width: min(560px, 95vw);
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 30px -15px rgba(0, 0, 0, 0.28);
}
.modal-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}
.modal-body {
  padding: 1.25rem;
}
.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.2);
  z-index: 990;
}
.drawer-panel {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: min(460px, 96vw);
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  box-shadow: -8px 0 25px -14px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.drawer-close {
  border: none;
  background: transparent;
  font-size: 1.25rem;
  color: #475569;
}
.drawer-body {
  padding: 1rem 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.drawer-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem;
}
.drawer-section h4 {
  margin: 0 0 0.5rem;
}
.drawer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.drawer-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: all 0.22s ease;
}
.drawer-slide-enter-from .drawer-panel,
.drawer-slide-leave-to .drawer-panel {
  transform: translateX(100%);
}

@media (max-width: 1024px) {
  .turn-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .shifts-container {
    padding: 1rem;
  }
  .stats-grid {
    padding: 1rem;
    gap: 1rem;
  }
  .turn-kpi-grid {
    grid-template-columns: 1fr;
  }
  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }
}
</style>
