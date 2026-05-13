<template>
  <DashboardLayout>
    <div class="sales-history-container">
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1 class="page-title">Historial de Ventas</h1>
          <p class="page-subtitle">Visualiza tus ingresos y transacciones</p>
        </div>
        <div class="period-filter-section" style="display: flex; gap: 1rem; align-items: center;">
          <div class="period-pills">
            <button class="period-pill" :class="{ active: selectedPeriod === 'today' }" @click="selectedPeriod = 'today'">Hoy</button>
            <button class="period-pill" :class="{ active: selectedPeriod === 'yesterday' }" @click="selectedPeriod = 'yesterday'">Ayer</button>
            <button class="period-pill" :class="{ active: selectedPeriod === 'last7days' }" @click="selectedPeriod = 'last7days'">Últimos 7 días</button>
            <button class="period-pill" :class="{ active: selectedPeriod === 'custom' }" @click="selectedPeriod = 'custom'">
              Personalizado
              <svg xmlns="http://www.w3.org/2000/svg" class="calendar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div class="custom-dates" v-if="selectedPeriod === 'custom'" style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="date" v-model="customStartDate" class="date-input" style="padding: 0.4rem; border-radius: 6px; border: 1px solid #ccc;" />
            <span>-</span>
            <input type="date" v-model="customEndDate" class="date-input" style="padding: 0.4rem; border-radius: 6px; border: 1px solid #ccc;" />
          </div>
        </div>
      </div>


      <!-- Stats Cards (KPIs) -->
      <div class="stats-grid">
        <template v-if="salesStore.isLoading">
          <div v-for="i in 3" :key="'sk-s-'+i" class="skeleton-stat-card">
            <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
              <AppSkeleton width="110px" height="0.75rem" />
              <AppSkeleton width="70px" height="1.75rem" />
            </div>
          </div>
        </template>
        <template v-else>
          <StatsCard
            label="Ingresos Totales"
            :value="'$' + formatMoney(filteredIncome)"
            subtitle=""
            variant="brand"
          />
          <StatsCard
            label="Tickets Emitidos"
            :value="filteredSalesCount"
            subtitle=""
          />
          <StatsCard
            label="Ticket Promedio"
            :value="'$' + formatMoney(averageTicket)"
            subtitle=""
          />
        </template>
      </div>

      <!-- Sales Table -->
      <div class="transactions-section">
        <div class="transactions-header">
          <h3>Registro de ventas</h3>
          
          <div class="transactions-header-controls">
            <!-- Buscador y Monto -->
            <div class="search-amount-section">
              <div class="search-wrapper shadow-sm">
                <svg class="search-icon-bar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="search-input-bar compact"
                  placeholder="Buscar ID o producto..."
                />
                <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''" title="Limpiar búsqueda">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="amount-filter shadow-sm">
                <div class="amount-input-wrapper">
                  <span class="amount-currency">$</span>
                  <input
                    v-model.number="minAmount"
                    type="number"
                    min="0"
                    step="100"
                    class="amount-input compact"
                    placeholder="Mínimo"
                  />
                </div>
              </div>
            </div>

            <!-- Indicador de resultados globales -->
            <div class="results-info-compact" v-if="searchQuery || minAmount > 0 || selectedPeriod !== 'today'">
              <span class="results-count">{{ resultsCount }} resultados</span>
              <button class="clear-all-btn" @click="resetFilters">Restablecer</button>
            </div>
          </div>
        </div>
        <div class="table-container">
          <!-- Skeleton table rows -->
          <template v-if="salesStore.isLoading">
            <div v-for="i in 6" :key="'sk-sale-'+i" class="skeleton-table-row">
              <AppSkeleton width="50px" height="0.85rem" />
              <AppSkeleton width="100px" height="0.85rem" />
              <AppSkeleton width="130px" height="0.85rem" />
              <AppSkeleton width="70px" height="0.85rem" />
              <AppSkeleton width="70px" height="1.4rem" radius="20px" />
              <AppSkeleton width="32px" height="32px" radius="8px" />
            </div>
          </template>
          <table v-else class="transactions-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>ID Transacción</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="sale in paginatedSales" :key="sale.id">
                <!-- Fila principal -->
                <tr class="main-row" @click="openDrawer(sale)" style="cursor: pointer;" title="Ver detalle">
                  <td>{{ formatTime(sale.created_at) }}</td>
                  <td class="font-mono text-xs trx-id font-bold" style="color: var(--color-brand-main);">{{ formatSaleFolio(sale.id, sale.transaction_id) }}</td>

                  <!-- Columna de productos con cantidades -->
                  <td>
                    <div class="product-summary">
                      <span class="product-first">
                        <span class="qty-pill">{{ sale.items?.[0]?.quantity ?? 1 }}×</span>
                        {{ sale.items?.[0]?.product_name || 'Venta General' }}
                      </span>
                      <span v-if="sale.items && sale.items.length > 1" class="more-items">
                        +{{ sale.items.length - 1 }} producto{{ sale.items.length - 1 !== 1 ? 's' : '' }} más
                      </span>
                    </div>
                  </td>

                  <td class="total-cell">${{ formatMoney(sale.total_amount) }}</td>
                  <td>
                    <span v-if="sale.status === 'cancelled'" class="status-badge danger">Cancelado</span>
                    <span v-else class="status-badge success">Completado</span>
                  </td>
                  <td>
                    <button class="btn-icon" title="Ver detalle" @click.stop="openDrawer(sale)">
                      <!-- Ojo icono -->
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px; color: #6B7280;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </td>
                </tr>

                
              </template>
            </tbody>
          </table>
          <!-- Paginación usando el componente reutilizable -->
          <Pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="storeTotalSales"
          />
        </div>
      </div>
    </div>
    <ConfirmationModal
      :is-open="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirm-text="confirmModal.confirmText"
      @close="confirmModal.isOpen = false"
      @confirm="executeCancel"
    />
  
    <SaleDetailDrawer
      :is-open="drawerOpen"
      :sale="selectedSale"
      :settings="storeSettings"
      @close="drawerOpen = false"
      @print="printSaleTicket"
      @cancel="handleCancel"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Pagination from '@/components/ui/Pagination.vue';
import AppSkeleton from '@/components/ui/AppSkeleton.vue';
import { useSalesStore } from '@/stores/sales.store';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import SaleDetailDrawer from '@/components/SaleDetailDrawer.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useStoreSettings } from '@/composables/useStoreSettings';
import { buildTicketHtml, openTicketPrint, getStoredPaperWidth } from '@/utils/ticketBuilder';
import { formatSaleFolio } from '@/utils/saleFolio';

import type { Sale } from '@/stores/sales.store';
import { storeToRefs } from 'pinia';
const salesStore = useSalesStore();
const { settings: storeSettings, loadSettings } = useStoreSettings();
const selectedPeriod = ref('today');
const customStartDate = ref('');
const customEndDate = ref('');

// Watcher para refrescar cuando se completa una venta desde otra sección
let unsubscribeSaleCompleted: (() => void) | null = null;

onMounted(async () => {
  await salesStore.fetchSales(1, pageSize.value, searchQuery.value.trim());
  loadSettings(); // Pre-carga los datos del negocio para reimprimir tickets
  
  // Suscribirse a cambios de lastCompletedSaleTimestamp en el store
  // Cuando una venta se completa desde otra sección, este timestamp cambia
  unsubscribeSaleCompleted = watch(
    () => salesStore.lastCompletedSaleTimestamp,
    async (newTimestamp) => {
      if (newTimestamp > 0) {
        // Una venta fue completada, refrescar la página actual
        try {
          await fetchCurrentPage();
        } catch (err) {
          console.error('Error refreshing sales after sale-completed', err);
        }
      }
    }
  );
});

onUnmounted(() => {
  // Limpiar el watcher al desmontar para evitar memory leaks
  if (unsubscribeSaleCompleted) {
    unsubscribeSaleCompleted();
  }
});

// ── Búsqueda y filtros ──

const drawerOpen = ref(false);
const selectedSale = ref<Sale | null>(null);

const openDrawer = (sale: Sale) => {
  selectedSale.value = sale;
  drawerOpen.value = true;
};

// ── Búsqueda y filtros ──
const searchQuery = ref('');
const minAmount = ref(0);

// ── Paginación ──
const currentPage = ref(1);
const pageSize = ref(10);
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchCurrentPage = () => {
  return salesStore.fetchSales(currentPage.value, pageSize.value, searchQuery.value.trim());
};

// Watcher para cambios de página - refetchear desde el backend
watch(currentPage, (newPage) => {
  salesStore.fetchSales(newPage, pageSize.value, searchQuery.value.trim());
});

// Watcher para cambios de pageSize - refetchear desde el backend
watch(pageSize, (newSize) => {
  currentPage.value = 1; // Resetear a página 1
  salesStore.fetchSales(1, newSize, searchQuery.value.trim());
});

watch(searchQuery, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    salesStore.fetchSales(1, pageSize.value, searchQuery.value.trim());
  }, 350);
});

const resetFilters = () => {
  searchQuery.value = '';
  minAmount.value = 0;
  selectedPeriod.value = 'today';
  customStartDate.value = '';
  customEndDate.value = '';
  currentPage.value = 1;
  fetchCurrentPage();
};



// Access store state via getters or computed using storeToRefs for guaranteed reactivity
const { sales, weeklyData, totalSales: storeTotalSales } = storeToRefs(salesStore);

// Format Helpers
const formatMoney = (amount: number | string | undefined | null) => {
  if (amount === undefined || amount === null) return '0.00';
  const num = Number(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ── Reimprimir ticket desde historial ──
const printSaleTicket = (sale: Sale) => {
  const html = buildTicketHtml({
    store: storeSettings.value,
    items: (sale.items || []).map(item => ({
      name: item.product_name,
      quantity: item.quantity ?? 1,
      price: item.unit_price ?? (Number(sale.total_amount) / ((sale.items || []).length || 1)),
    })),
    total: Number(sale.total_amount),
    ticketId: sale.id,
    date: formatDateTime(sale.created_at),
    paperWidth: getStoredPaperWidth(),
    isReprint: true,
  });
  openTicketPrint(html);
};

// ── Revertir Venta ──
const { enqueueSnackbar } = useSnackbar();
const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'danger' | 'warning' | 'info' | 'success',
  confirmText: 'Confirmar',
  saleIdToCancel: null as string | number | null
});

const handleCancel = (saleId: string | number) => {
  confirmModal.value = {
    isOpen: true,
    title: 'Revertir Venta',
    message: '¿Estás seguro de que deseas revertir esta venta? Se actualizará el inventario sumando de vuelta el stock de los productos. Esta acción no se puede deshacer.',
    type: 'danger',
    confirmText: 'Sí, Revertir',
    saleIdToCancel: saleId
  };
};

const executeCancel = async () => {
  const saleId = confirmModal.value.saleIdToCancel;
  if (saleId !== null) {
    confirmModal.value.isOpen = false;
    
    const result = await salesStore.cancelSale(saleId);
    if (result.success) {
      enqueueSnackbar({
        type: 'success',
        title: 'Venta revertida',
        message: 'La venta ha sido cancelada y el stock restaurado exitosamente.',
        duration: 3000
      });
      // Refetchear la página actual
      await fetchCurrentPage();
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error al revertir',
        message: result.error || 'No se pudo cancelar la venta.',
        duration: 5000
      });
    }
  }
};

// ── Filtered Sales Logic ──
const filteredSales = computed(() => {
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfDay);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOf7Days = new Date(startOfDay);
  startOf7Days.setDate(startOf7Days.getDate() - 6);

  const q = searchQuery.value.toLowerCase().trim();

  return sales.value.filter(sale => {
    const saleDate = new Date(sale.created_at);

    // 1. Filtro de período
    let passesPeriod = true;
    if (selectedPeriod.value === 'today') passesPeriod = isSameDay(saleDate, now);
    else if (selectedPeriod.value === 'yesterday') passesPeriod = isSameDay(saleDate, startOfYesterday);
    else if (selectedPeriod.value === 'last7days') passesPeriod = saleDate >= startOf7Days;
    else if (selectedPeriod.value === 'custom') {
      if (customStartDate.value) {
        const start = new Date(customStartDate.value + 'T00:00:00');
        if (saleDate < start) passesPeriod = false;
      }
      if (customEndDate.value) {
        const end = new Date(customEndDate.value + 'T23:59:59');
        if (saleDate > end) passesPeriod = false;
      }
    }
    if (!passesPeriod) return false;

    // 2. Filtro de búsqueda por ID o nombre de producto
    if (q) {
      const matchesId = String(sale.id).toLowerCase().includes(q) || sale.transaction_id?.toLowerCase().includes(q);
      const matchesProduct = (sale.items || []).some(item => item.product_name?.toLowerCase().includes(q));
      if (!matchesId && !matchesProduct) return false;
    }

    // 3. Filtro de monto mínimo
    if (minAmount.value > 0) {
      const total = Number(sale.total_amount);
      if (isNaN(total) || total < minAmount.value) return false;
    }

    return true;
  });
});

// Ya no necesitamos paginación local porque el backend la maneja
// paginatedSales es lo que se muestra en la tabla
const paginatedSales = computed(() => filteredSales.value);

// Stats
const filteredIncome = computed(() => {
  return filteredSales.value
      .filter(s => s.status !== 'cancelled')
      .reduce((sum, s) => {
        const val = Number(s.total_amount);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
});

// salesCount es el número de ventas después de aplicar filtros locales
const filteredSalesCount = computed(() => filteredSales.value.length);
const resultsCount = computed(() => searchQuery.value.trim() ? storeTotalSales.value : filteredSales.value.length);
const averageTicket = computed(() => {
  if (filteredSalesCount.value === 0) return 0;
  return filteredIncome.value / filteredSalesCount.value;
});

</script>

<style scoped>
.sales-history-container {
  background: var(--color-card-stats-fill);
  padding: 1.75rem 2rem;
  max-width: 100%;
  min-height: 100vh;
  margin: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  color: #6B7280;
  margin-top: 0.25rem;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}



.charts-grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}



.chart-container {
  flex: 1;
  width: 100%;
  position: relative;
  min-height: 250px;
}

.transactions-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

.transactions-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.transactions-header-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.search-amount-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .transactions-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .transactions-header-controls {
    align-items: flex-end;
  }
  
  .search-amount-section {
    justify-content: flex-end;
  }
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.transactions-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  padding-top: 0.5rem;
}

/* ── Filtros de Píldoras (Pills) ── */
.period-filter-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.period-pills {
  display: inline-flex;
  background-color: #F8FAFC;
  border-radius: 9999px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.period-pill {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.period-pill:hover {
  color: #0F172A;
}

.period-pill.active {
  background-color: var(--color-brand-main);
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-icon {
  width: 16px;
  height: 16px;
}

/* ── Inputs Fechas Personalizadas ── */
.custom-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.date-input-group label {
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 500;
}

.date-input {
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  cursor: pointer;
}

.date-separator {
  color: #CBD5E1;
}

.transactions-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.transactions-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  border-bottom: 1px solid #E5E7EB;
}

.transactions-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #F3F4F6;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-icon-active {
  background: var(--color-brand-primary);
  color: white;
  border-color: var(--color-brand-primary);
}

.btn-revert {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-revert:hover {
  background: #fee2e2;
  border-color: #f87171;
  color: #dc2626;
}

.btn-revert svg {
  width: 16px;
  height: 16px;
}

/* ── Columna de productos ── */
.product-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-first {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #374151;
}

.qty-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #EFF6FF;
  color: #2563EB;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 99px;
  flex-shrink: 0;
}

.more-items {
  font-size: 0.72rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Total ── */
.total-cell {
  font-weight: 700;
  color: #111827;
}

/* ── TRX ID ── */
.trx-id {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: #6B7280;
  letter-spacing: 0.02em;
}

/* ── Fila principal ── */
.main-row {
  transition: background 0.15s ease;
}
.main-row.row-expanded {
  background: #F8FAFF;
}
.main-row.row-expanded td {
  border-bottom: none;
}

/* ── Botón ojo ── */
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.35rem;
  border-radius: 8px;
  transition: all 0.15s ease;
  display: flex;
}

.btn-icon:hover {
  background: #EFF6FF;
  color: #2563EB;
}

.btn-icon-active {
  background: #EFF6FF;
  color: #2563EB;
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

/* ── Fila de detalle ── */
.detail-row td {
  padding: 0;
  background: #F8FAFF;
  border-bottom: 2px solid #E0E8FF;
}

.detail-content {
  padding: 0.875rem 1.25rem 1rem 1.5rem;
  border-left: 3px solid #3B82F6;
  margin-left: 0.5rem;
}

.detail-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.5rem 0;
}

.detail-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #374151;
}

.detail-qty {
  font-weight: 700;
  color: #2563EB;
  font-size: 0.8rem;
}

.detail-name {
  color: #1F2937;
}

/* ── Animación fila detalle ── */
.detail-row-enter-active,
.detail-row-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.detail-row-enter-from,
.detail-row-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}


.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── Buscador y Monto Compacto ── */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.search-icon-bar {
  position: absolute;
  left: 0.75rem;
  width: 16px;
  height: 16px;
  color: #9CA3AF;
  pointer-events: none;
}

.search-input-bar.compact {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.25rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;
  background-color: white;
}

.search-input-bar.compact:focus {
  border-color: #004D40;
  box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.1);
}

.search-input-bar::placeholder {
  color: #94A3B8;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.clear-search:hover {
  color: #64748B;
}

.clear-search svg {
  width: 14px;
  height: 14px;
}

.amount-filter {
  display: flex;
  align-items: center;
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-currency {
  position: absolute;
  left: 0.75rem;
  color: #64748B;
  font-size: 0.875rem;
  pointer-events: none;
}

.amount-input.compact {
  width: 110px;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.amount-input.compact:focus {
  border-color: #004D40;
  box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.1);
}

.results-info-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.results-count {
  color: #64748B;
  font-weight: 500;
}

.clear-all-btn {
  color: #EF4444;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
}

.clear-all-btn:hover {
  text-decoration: underline;
  color: #DC2626;
}

/* ── Detalle Header y Botón Reimprimir ── */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.btn-reprint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: #ffffff;
  color: #374151;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.btn-reprint:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
  color: #111827;
}

.btn-reprint svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .sales-history-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .date-filter, .form-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid, .charts-grid-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-card {
    min-width: 100%;
    padding: 1rem;
  }
  
  .transactions-table {
    font-size: 0.75rem;
  }
  
  .transactions-table th, .transactions-table td {
    padding: 0.75rem 0.5rem;
    white-space: nowrap;
  }

  .period-filter-section {
    align-items: flex-start; /* Fixes left-overflow */
    width: 100%;
  }

  .period-pills {
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    border-radius: 12px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .period-pill {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }

  .custom-dates {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }

  .date-input-group {
    width: 100%;
  }

  .search-amount-section {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .search-wrapper {
    max-width: 100%;
    width: 100%;
  }

  .amount-filter, .amount-input-wrapper {
    width: 100%;
  }

  .amount-input.compact {
    width: 100%;
  }
}
</style>
