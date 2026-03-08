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
          Ir a Inventario
        </AppButton>
      </div>

    <!-- Turno Abierto -->
    <div class="active-shift-card card">
      <div class="card-header">
        <h2 class="card-title">💵 Turno en progreso</h2>
        <span class="badge badge-success">Abierto</span>
      </div>
      <div class="card-body">
        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-label">Efectivo Inicial</span>
            <span class="stat-value">${{ currentShift?.starting_cash }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Apertura</span>
            <span class="stat-value date-value">{{ formatDate(currentShift?.opened_at) }}</span>
          </div>
        </div>
        
        <div class="close-shift-action mt-6">
          <h3>Realizar Corte (Cerrar Caja)</h3>
          <p class="help-text text-sm">
            <strong>⚠️ Alerta:</strong> Sólo realiza esta acción al finalizar tu día de trabajo o terminar tu turno. Necesitarás contar el dinero de tu caja.
          </p>
          <div v-if="!intendeClose" class="mt-4">
             <AppButton @click="intendeClose = true" variant="fill">
               Preparar cierre de turno
             </AppButton>
          </div>
          <form v-else @submit.prevent="handleCloseShift" class="form-grid border-t pt-4 mt-2">
            <h4 class="font-bold text-gray-700">Por favor confirma tus saldos:</h4>
            <div class="form-group">
              <label>Cantidad Esperada (Cálculo del Sistema Automático):</label>
              <input type="number" step="0.01" :value="computedExpectedCash" readonly class="input bg-gray-100 font-bold text-gray-700 cursor-not-allowed" />
            </div>
            <div class="form-group">
              <label>Cantidad Realmente en Caja (Conteo Físico):</label>
              <input type="number" step="0.01" v-model.number="closeForm.actual_cash" required class="input border-indigo-500 bg-indigo-50" placeholder="Cuenta tu cajón y escribe el monto" />
            </div>
            <div class="difference-alert" :class="differenceClass" v-if="calculatedDifference !== null">
              Diferencia: <strong>${{ calculatedDifference.toFixed(2) }}</strong> 
              <span v-if="calculatedDifference < 0">(Faltante)</span>
              <span v-else-if="calculatedDifference > 0">(Sobrante)</span>
              <span v-else>(Cuadre Exacto)</span>
            </div>
            <div class="flex gap-4 mt-6">
               <AppButton variant="outline" class="flex-1" type="button" @click="intendeClose = false">
                 Cancelar Transacción
               </AppButton>
               <AppButton variant="fill" style="background-color: #ef4444; border-color: #ef4444;" class="flex-1 flex justify-center w-full" type="submit" :loading="shiftsStore.isLoading">
                 <span v-if="!shiftsStore.isLoading">Terminar Jornada y Cerrar Caja</span>
                 <span v-else>Cerrando...</span>
               </AppButton>
            </div>
          </form>
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
              <tr v-for="shift in completedShifts" :key="shift.id">
                <td>#{{ shift.id }}</td>
                <td>{{ formatDate(shift.opened_at) }}</td>
                <td>{{ shift.closed_at ? formatDate(shift.closed_at) : 'N/A' }}</td>
                <td>${{ shift.starting_cash }}</td>
                <td>{{ shift.expected_cash ? '$'+shift.expected_cash : '-' }}</td>
                <td>{{ shift.actual_cash ? '$'+shift.actual_cash : '-' }}</td>
                <td>
                  <span v-if="shift.difference" :class="Number(shift.difference) < 0 ? 'text-danger' : (Number(shift.difference) > 0 ? 'text-success' : 'text-muted')">
                    ${{ shift.difference }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span class="badge" :class="shift.closed_at === null ? 'badge-success' : 'badge-neutral'">
                    {{ shift.closed_at === null ? 'Abierto' : 'Cerrado' }}
                  </span>
                </td>
              </tr>
              <tr v-if="completedShifts.length === 0">
                <td colspan="8" class="text-center text-muted py-4">No hay turnos registrados</td>
              </tr>
            </template>
          </tbody>
       </table>
    </div>
  </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppSkeleton from '@/components/ui/AppSkeleton.vue';
import AppButton from '@/components/ui/AppButton.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { useShiftsStore } from '@/stores/shifts.store';
import { useSalesStore } from '@/stores/sales.store';
import { useSnackbar } from '@/composables/useSnackbar';

const router = useRouter();

const shiftsStore = useShiftsStore();
const salesStore = useSalesStore();
const { enqueueSnackbar } = useSnackbar();

const currentShift = computed(() => shiftsStore.currentShift);
const completedShifts = computed(() => shiftsStore.shifts.filter(s => s.closed_at !== null));

const intendeClose = ref(false);

const openForm = ref({
  starting_cash: null as number | null
});

const closeForm = ref({
  expected_cash: null as number | null,
  actual_cash: null as number | null
});

onMounted(() => {
  shiftsStore.fetchShifts();
  salesStore.fetchSales();
});

const computedExpectedCash = computed(() => {
  if (!shiftsStore.currentShift) return 0;
  let total = Number(shiftsStore.currentShift.starting_cash);
  
  if (shiftsStore.currentShift.opened_at) {
    const openedAt = new Date(shiftsStore.currentShift.opened_at).getTime();
    salesStore.sales.forEach(sale => {
      const saleTime = new Date(sale.created_at).getTime();
      if (sale.status === 'completed' && saleTime >= openedAt) {
        total += Number(sale.total);
      }
    });
  }
  
  return total;
});

const handleOpenShift = async () => {
  if (openForm.value.starting_cash === null || openForm.value.starting_cash < 0) {
    enqueueSnackbar({ type: 'warning', title: 'Fondo de caja inválido', message: 'Por favor, ingresa al menos 0.00' });
    return;
  }
  
  const result = await shiftsStore.openShift(openForm.value.starting_cash);
  
  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Turno Abierto', message: '¡Que tengas una excelente jornada!' });
    openForm.value.starting_cash = null;
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
    computedExpectedCash.value, 
    closeForm.value.actual_cash
  );

  if (result.success) {
    enqueueSnackbar({ type: 'success', title: 'Turno Cerrado', message: 'El corte de caja finalizó exitosamente.' });
    closeForm.value.expected_cash = null;
    closeForm.value.actual_cash = null;
  } else {
    enqueueSnackbar({ type: 'error', title: 'Error', message: result.error });
  }
};

const calculatedDifference = computed(() => {
  if (closeForm.value.actual_cash !== null) {
    return closeForm.value.actual_cash - computedExpectedCash.value;
  }
  return null;
});

const differenceClass = computed(() => {
  if (calculatedDifference.value === null) return '';
  if (calculatedDifference.value < 0) return 'text-danger font-bold';
  if (calculatedDifference.value > 0) return 'text-success font-bold';
  return 'text-muted';
});

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
.stat-box {
  display: flex;
  flex-direction: column;
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
.text-danger { color: #dc2626; }
.text-success { color: #059669; }
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
</style>
