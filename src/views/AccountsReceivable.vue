<template>
  <DashboardLayout>
    <div class="receivables-container">
      <!-- Header -->
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">
            <WalletIcon class="w-8 h-8 text-brand-main inline-block mr-2" />
            Cuentas por Cobrar
          </h1>
          <p class="page-subtitle">Gestiona los apartados y crÃ©ditos pendientes de tus clientes</p>
        </div>
        <div style="display: flex; gap: 1rem;">
          <AppButton variant="outline" @click="showNewClientDrawer = true">
            + Nuevo Cliente
          </AppButton>
          <AppButton variant="fill" @click="showManualDebtModal = true">
            + Registrar Adeudo
          </AppButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <template v-if="activeView === 'receivables' && isLoading && sales.length === 0">
          <div v-for="i in 3" :key="'sk-stat-'+i" class="skeleton-stat-card">
            <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
              <AppSkeleton width="150px" height="0.75rem" />
              <AppSkeleton width="100px" height="1.75rem" />
            </div>
          </div>
        </template>
        <template v-else>
          <StatsCard
            label="Total a Cobrar (Pendiente)"
            :value="'$' + Number(totalPending).toFixed(2)"
            subtitle=""
          />
          <StatsCard
            label="Clientes con Deuda"
            :value="uniqueDebtorsCount + ' clientes'"
            subtitle=""
          />
          <StatsCard
            label="Abonos recibidos este mes"
            :value="'$' + Number(totalPaymentsThisMonth).toFixed(2)"
            subtitle=""
          />
        </template>
      </div>

      <div class="view-tabs" role="tablist" aria-label="Vista de cuentas por cobrar">
        <button
          type="button"
          class="view-tab"
          :class="{ active: activeView === 'receivables' }"
          @click="activeView = 'receivables'"
        >
          Adeudos
        </button>
        <button
          type="button"
          class="view-tab"
          :class="{ active: activeView === 'clients' }"
          @click="activeView = 'clients'"
        >
          Clientes
        </button>
      </div>

      <!-- Table Section -->
      <div class="table-card">
        <!-- Toolbar -->
        <div class="table-toolbar" style="padding: 1.25rem; border-bottom: 1px solid #e5e7eb; display: flex; gap: 1rem; align-items: center; justify-content: space-between; background: white; flex-wrap: wrap;">
          <div class="search-wrapper" style="flex: 1; min-width: 250px; max-width: 400px; margin: 0;">
            <MagnifyingGlassIcon class="search-icon" />
            <input 
              type="text" 
              v-model="searchQuery"
              :placeholder="activeView === 'clients' ? 'Buscar cliente registrado...' : 'Buscar por cliente, telÃ©fono o ticket...'" 
              class="search-input"
            />
          </div>
          <div v-if="activeView === 'receivables'" class="filter-wrapper" style="min-width: 240px;">
            <AppSelect
              v-model="statusFilter"
              :options="[
                { value: 'all', label: 'Estado: Todos' },
                { value: 'pending', label: 'Estado: Con saldo pendiente' },
                { value: 'paid', label: 'Estado: Liquidados' }
              ]"
            />
          </div>
        </div>

        <!-- Skeleton: Table -->
        <template v-if="isLoading && sales.length === 0">
          <div class="skeleton-table-wrap" style="box-shadow: none; padding: 0;">
            <div v-for="i in 5" :key="'sk-row-'+i" class="skeleton-table-row" style="padding: 1.5rem;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                <AppSkeleton width="60%" height="1rem" />
                <AppSkeleton width="40%" height="0.75rem" />
              </div>
              <div style="flex: 1;">
                <AppSkeleton width="100%" height="1rem" />
              </div>
              <div style="flex: 1;">
                <AppSkeleton width="100%" height="8px" radius="4px" />
              </div>
              <div style="flex: 1; display: flex; justify-content: flex-end;">
                <AppSkeleton width="80px" height="36px" radius="8px" />
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div v-else-if="activeView === 'receivables' && filteredAndSortedSales.length === 0" class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; background: #f9fafb;">
          <WalletIcon class="empty-icon" style="width: 4rem; height: 4rem; color: #d1d5db; margin-bottom: 1rem;" />
          <h3 class="empty-title" style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">Todo liquidado o sin resultados</h3>
          <p class="empty-subtitle" style="color: #6b7280; text-align: center; max-width: 450px; margin-bottom: 1.5rem; line-height: 1.5;">
            No hay apartados ni crÃ©ditos vigentes. Los fiados que registres en el Punto de Venta aparecerÃ¡n aquÃ­.
          </p>
          <AppButton variant="outline" @click="$router.push('/dashboard/sales')">
            Ir al Punto de Venta
          </AppButton>
        </div>

        <div v-else-if="activeView === 'clients' && filteredClients.length === 0" class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; background: #f9fafb;">
          <WalletIcon class="empty-icon" style="width: 4rem; height: 4rem; color: #d1d5db; margin-bottom: 1rem;" />
          <h3 class="empty-title" style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">Sin clientes registrados</h3>
          <p class="empty-subtitle" style="color: #6b7280; text-align: center; max-width: 450px; margin-bottom: 1.5rem; line-height: 1.5;">
            Los clientes que registres para fiados y apartados aparecerÃ¡n aquÃ­.
          </p>
          <AppButton variant="fill" @click="showNewClientDrawer = true">
            + Nuevo Cliente
          </AppButton>
        </div>

        <!-- Data Table -->
        <div v-else-if="activeView === 'receivables'" class="table-responsive">
          <table class="receivables-table">
            <thead>
              <tr>
                <th>Cliente / Contacto</th>
                <th>Ticket / Fecha</th>
                <th style="width: 25%;">Progreso de Pago</th>
                <th>Saldo Pendiente</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredAndSortedSales" :key="sale.id" :class="{ 'row-paid': isPaid(sale) }">
                <td>
                  <div class="customer-info">
                    <div class="customer-name">{{ sale.customer_name || 'Desconocido' }}</div>
                    <div v-if="sale.customer_phone" class="customer-phone">
                      {{ sale.customer_phone }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="ticket-id">{{ getTicketId(sale) }}</div>
                  <div class="ticket-date">{{ formatDate(sale.created_at) }}</div>
                </td>
                <td>
                  <div class="progress-info">
                    <span class="paid-amount">${{ Number(getTotalPaid(sale)).toFixed(2) }} ({{ getProgressPercentage(sale) }}%)</span>
                    <span class="total-amount">${{ Number(getSaleTotal(sale)).toFixed(2) }}</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" :style="{ width: getProgressPercentage(sale) + '%', backgroundColor: isPaid(sale) ? '#10b981' : '#f59e0b' }"></div>
                  </div>
                </td>
                <td>
                  <div class="balance-due" :class="{ 'paid': isPaid(sale) }">
                    <span v-if="!isPaid(sale)">${{ Number(getBalanceDue(sale)).toFixed(2) }}</span>
                    <span v-else class="paid-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="check-icon">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Pagado
                    </span>
                  </div>
                </td>
                <td style="text-align: right;">
                  <div class="actions">
                    <button v-if="!isPaid(sale)" @click="openPaymentModal(sale)" class="btn-pay">
                      <CurrencyDollarIcon class="w-4 h-4" />
                      Abonar
                    </button>
                    <a 
                      v-if="sale.customer_phone && !isPaid(sale)"
                      :href="getWhatsAppReminderUrl(sale)"
                      target="_blank"
                      class="btn-whatsapp"
                      title="Enviar recordatorio por WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="table-responsive">
          <table class="receivables-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>LÃ­mite de crÃ©dito</th>
                <th>Deuda actual</th>
                <th>Estado</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in filteredClients" :key="client.value">
                <td>
                  <div class="customer-info">
                    <div class="customer-name">{{ client.label }}</div>
                    <div class="customer-phone">Cliente abonador</div>
                  </div>
                </td>
                <td>${{ Number(client.credit_limit || 0).toFixed(2) }}</td>
                <td>
                  <span class="client-debt" :class="{ pending: Number(client.debt || 0) > 0 }">
                    ${{ Number(client.debt || 0).toFixed(2) }}
                  </span>
                </td>
                <td>
                  <span class="client-status" :class="{ inactive: client.active === false }">
                    {{ client.active === false ? 'Inactivo' : 'Activo' }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn-pay" @click="openManualDebtForClient(client.value)">
                    Registrar adeudo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <Pagination 
          v-if="activeView === 'receivables' && totalSales > pageSize"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalSales"
          class="pagination-bar"
        />
      </div>

      <!-- Payment Modal -->
      <Teleport to="body">
      <Transition name="fade">
        <div v-if="paymentModalOpen && selectedSale" class="modal-overlay" @click.self="closePaymentModal">
           <div class="modal-content">
             <div class="modal-header">
               <div>
                 <h3 class="modal-title">Registrar Abono</h3>
                 <p class="modal-subtitle">{{ selectedSale.customer_name }}</p>
               </div>
               <button @click="closePaymentModal" class="btn-close">
                 <XMarkIcon class="w-6 h-6" />
               </button>
             </div>
             
             <div class="balance-banner">
               <span class="banner-label">Saldo Restante:</span>
               <span class="banner-value">${{ Number(getBalanceDue(selectedSale)).toFixed(2) }}</span>
             </div>

             <div class="input-section">
               <label class="input-label">Monto a Abonar</label>
               <div class="input-wrapper">
                 <span class="input-prefix">$</span>
                 <input 
                   type="number" 
                   v-model.number="paymentAmount"
                   :max="Number(getBalanceDue(selectedSale))"
                   min="0.01"
                   step="0.01"
                   class="payment-input"
                 />
               </div>
             </div>

             <AppButton 
               variant="fill" 
               fullWidth 
               size="lg"
               :disabled="!paymentAmount || paymentAmount <= 0 || paymentAmount > Number(getBalanceDue(selectedSale))"
               :loading="isSubmittingPayment"
               @click="submitPayment"
             >
               Confirmar Abono
             </AppButton>
           </div>
        </div>
      </Transition>
      </Teleport>
      
      <!-- Modals and Drawers placeholder -->
      <Teleport to="body">
        <AddClientModal
          :is-open="showNewClientDrawer"
          :is-drawer="true"
          @close="showNewClientDrawer = false"
          @client-created="handleNewClientCreated"
        />
      </Teleport>
      
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showManualDebtModal" class="modal-overlay" style="z-index: 12020;" @click.self="showManualDebtModal = false">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title">Registrar Adeudo Manual</h3>
                <button @click="showManualDebtModal = false" class="btn-close"><XMarkIcon class="w-6 h-6" /></button>
              </div>
              <div style="padding: 1rem 0;">
                <div class="input-section">
                  <label class="input-label">Cliente *</label>
                  <AppSelect v-model="manualDebt.customer_id" :options="[{value: '', label: 'Selecciona un cliente...'}, ...allClients]" />
                </div>
                <div class="input-section">
                  <label class="input-label">Monto de la deuda *</label>
                  <div class="input-wrapper">
                    <span class="input-prefix">$</span>
                    <input type="number" v-model.number="manualDebt.total_amount" class="payment-input" placeholder="0.00" />
                  </div>
                </div>
                <div class="input-section">
                  <label class="input-label">Motivo o DescripciÃ³n *</label>
                  <input type="text" v-model="manualDebt.description" class="payment-input" style="padding-left: 1rem;" placeholder="Ej: PrÃ©stamo, Venta pasada" />
                </div>
                <div style="margin-top: 2rem;">
                  <AppButton variant="fill" fullWidth :loading="isCreatingDebt" :disabled="!manualDebt.customer_id || !manualDebt.total_amount" @click="submitManualDebt">Crear Adeudo</AppButton>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppSkeleton from '@/components/ui/AppSkeleton.vue';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import AddClientModal from '@/components/AddClientModal.vue';
import { useSalesStore } from '@/stores/sales.store';
import { useSnackbar } from '@/composables/useSnackbar';
import Pagination from '@/components/ui/Pagination.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import apiClient from '@/services/api';

import { 
  WalletIcon, 
  MagnifyingGlassIcon, 
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import { debounce } from 'lodash';

const salesStore = useSalesStore();
const { enqueueSnackbar } = useSnackbar();

const searchQuery = ref('');
const statusFilter = ref('pending');
const activeView = ref<'receivables' | 'clients'>('receivables');
const currentPage = ref(1);
const pageSize = ref(15);
const isSubmittingPayment = ref(false);
const showNewClientDrawer = ref(false);
const showManualDebtModal = ref(false);

const sales = computed(() => salesStore.sales as any[]);
const totalSales = computed(() => salesStore.totalSales);
const isLoading = computed(() => salesStore.isLoading);

// Calculate global totals from current page (ideally backend would send this)
const totalPending = computed(() => {
  return sales.value.reduce((acc, sale) => {
    return acc + Number(getBalanceDue(sale));
  }, 0);
});

const uniqueDebtorsCount = computed(() => {
  const customers = new Set();
  sales.value.forEach(sale => {
    if (!isPaid(sale)) {
      customers.add(sale.customer || sale.customer_name || sale.id);
    }
  });
  return customers.size;
});

const totalPaymentsThisMonth = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let total = 0;
  sales.value.forEach(sale => {
    if (sale.payments) {
      sale.payments.forEach((p: any) => {
        const pDate = new Date(p.created_at || p.date);
        if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
          total += Number(p.amount);
        }
      });
    }
  });
  return total;
});

// Load init
onMounted(() => {
  salesStore.fetchReceivables(1, pageSize.value);
  loadAllClients();
});

// Watcher para buscar con debounce
// Watcher para cambiar de vista
watch(activeView, async (view) => {
  currentPage.value = 1;
  
  if (view === 'clients') {
    searchQuery.value = ''; // Limpiar al cambiar a clientes
    loadAllClients();
    return;
  }
  
  // En 'receivables', hacer refetch PRIMERO antes de limpiar searchQuery
  await salesStore.fetchReceivables(1, pageSize.value, '');
  searchQuery.value = ''; // Limpiar despuÃ©s de refetch
});

// Watcher para bÃºsqueda con debounce - solo en receivables
watch(searchQuery, debounce((newQ: string) => {
  if (activeView.value === 'clients') return;
  currentPage.value = 1;
  salesStore.fetchReceivables(1, pageSize.value, newQ);
}, 400));

// Watcher: refetch when page or page size changes via Pagination v-model
watch(currentPage, (page) => {
  salesStore.fetchReceivables(page, pageSize.value, searchQuery.value);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(pageSize, () => {
  currentPage.value = 1;
  salesStore.fetchReceivables(1, pageSize.value, searchQuery.value);
});

// Help methods
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getTotalPaid = (sale: any) => {
  if (!sale.payments || sale.payments.length === 0) return 0;
  return sale.payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0);
};

const getSaleTotal = (sale: any) => {
  return Number(sale.total_amount ?? sale.total ?? 0);
};

const getBalanceDue = (sale: any) => {
  const balance = sale.balance_due ?? sale.balance;
  if (balance !== undefined && balance !== null && balance !== '') {
    return Number(balance);
  }

  return Math.max(0, getSaleTotal(sale) - getTotalPaid(sale));
};

const getTicketId = (sale: any) => {
  return sale.transaction_id || `#${String(sale.id || '').slice(0, 8).toUpperCase()}`;
};

const getWhatsAppReminderUrl = (sale: any) => {
  const message = `Hola ${sale.customer_name || ''}, te recordamos amablemente que tienes un saldo pendiente de $${Number(getBalanceDue(sale)).toFixed(2)} por tu apartado ${getTicketId(sale)}. Â¡Gracias por tu preferencia!`;
  return `https://wa.me/${cleanPhone(sale.customer_phone)}?text=${encodeURIComponent(message)}`;
};

const getProgressPercentage = (sale: any) => {
  const total = getSaleTotal(sale);
  if (total === 0) return 100;
  const paid = getTotalPaid(sale);
  return Math.min(100, Math.round((paid / total) * 100));
};

const cleanPhone = (phone: string) => {
  if(!phone) return '';
  return phone.replace(/\D/g, '');
};

// FunciÃ³n para determinar si un pago estÃ¡ completamente pagado
const isPaid = (sale: any): boolean => {
  return getBalanceDue(sale) <= 0;
};

// Ordenar y Filtrar ventas:
const filteredAndSortedSales = computed(() => {
  let result = [...sales.value];
  
  if (statusFilter.value === 'pending') {
    result = result.filter(sale => !isPaid(sale));
  } else if (statusFilter.value === 'paid') {
    result = result.filter(sale => isPaid(sale));
  }
  
  return result.sort((a, b) => {
    const aPaid = isPaid(a);
    const bPaid = isPaid(b);
    if (aPaid !== bPaid) {
      return (aPaid ? 1 : 0) - (bPaid ? 1 : 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

// Payment Modal State
const paymentModalOpen = ref(false);
const selectedSale = ref<any | null>(null);
const paymentAmount = ref<number | null>(null);

const openPaymentModal = (sale: any) => {
  selectedSale.value = sale;
  paymentAmount.value = Number(getBalanceDue(sale)); // Sugerir pagar todo
  paymentModalOpen.value = true;
};

const closePaymentModal = () => {
  paymentModalOpen.value = false;
  selectedSale.value = null;
  paymentAmount.value = null;
};

const submitPayment = async () => {
  if (!selectedSale.value || !paymentAmount.value) return;
  
  isSubmittingPayment.value = true;
  
  try {
    const result = await salesStore.addPayment(selectedSale.value.id, paymentAmount.value);
    
    if (result.success) {
      enqueueSnackbar({ type: 'success', title: 'Abono registrado', message: 'El abono se ha registrado correctamente.', duration: 3000 });
      
      // Reproducir sonido opcional
      const audio = new Audio('/sounds/Fx_Sucess.wav');
      audio.play().catch(e => console.error(e));
      
      // Refresh
      salesStore.fetchReceivables(currentPage.value, pageSize.value, searchQuery.value);
      closePaymentModal();
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: result.error || 'Hubo un error al registrar el abono.', duration: 4000 });
    }
  } catch (error) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo conectar al servidor.', duration: 4000 });
  } finally {
    isSubmittingPayment.value = false;
  }
};

// Modals State and Methods
const loadAllClients = async () => {
  try {
    const response = await apiClient.get<any>('/v1/accounts/clients/');
    if (response.success && response.data) {
      const list = Array.isArray(response.data) ? response.data : response.data.results || [];
      allClients.value = list.map((c: any) => ({
        value: String(c.id),
        label: c.name,
        credit_limit: c.credit_limit,
        debt: c.debt,
        active: c.active,
        created_at: c.created_at,
      }));
    }
  } catch (err) {
    console.error('Error loading clients:', err);
  }
};

const handleNewClientCreated = async (clientId: string | number) => {
  // Recargar la lista de clientes cuando se crea uno nuevo
  await loadAllClients();
};



const manualDebt = ref({ customer_id: '', total_amount: null as number | null, description: '' });
const isCreatingDebt = ref(false);
const allClients = ref<any[]>([]);

const filteredClients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const clients = [...allClients.value];

  if (!query) {
    return clients.sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }

  return clients
    .filter((client) => String(client.label || '').toLowerCase().includes(query))
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));
});

const openManualDebtForClient = (clientId: string | number) => {
  manualDebt.value.customer_id = String(clientId);
  showManualDebtModal.value = true;
};

const submitManualDebt = async () => {
  if (!manualDebt.value.customer_id || !manualDebt.value.total_amount) return;
  isCreatingDebt.value = true;
  try {
    const result = await salesStore.addSale({
      transaction_id: `DEBT-${Date.now()}`,
      items: [],
      total_amount: manualDebt.value.total_amount,
      amount_paid: 0,
      amount_tendered: 0,
      status: 'partial',
      sale_type: 'credit',
      customer: manualDebt.value.customer_id,
    });

    if (result.success) {
      enqueueSnackbar({ type: 'success', title: 'Adeudo registrado', message: 'Adeudo manual creado correctamente.' });
      showManualDebtModal.value = false;
      manualDebt.value = { customer_id: '', total_amount: null, description: '' };
      currentPage.value = 1;
      salesStore.fetchReceivables(1, pageSize.value, searchQuery.value);
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: result.error || 'No se pudo registrar el adeudo.' });
    }
  } catch (err) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Hubo un error de conexiÃ³n.' });
  } finally {
    isCreatingDebt.value = false;
  }
};
</script>

<style scoped>
.receivables-container {
  background: var(--color-background-secondary);
  padding: 1.75rem 2rem;
  max-width: 100%;
  min-height: 100vh;
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
  color: var(--color-text-main);
  margin: 0;
}

.page-subtitle {
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.view-tabs {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  margin-bottom: 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.view-tab {
  border: 0;
  background: transparent;
  color: #64748b;
  font-weight: 700;
  padding: 0.65rem 1rem;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.view-tab.active {
  background: var(--color-brand-main, #e6ab17);
  color: #111827;
  box-shadow: 0 8px 18px rgba(230, 171, 23, 0.22);
}

.search-section {
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.receivables-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.receivables-table th {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.receivables-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.customer-name {
  font-weight: 600;
  color: #111827;
}

.customer-phone {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.ticket-id {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4f46e5;
}

.ticket-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.paid-amount {
  color: #059669;
}

.total-amount {
  color: #6b7280;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  border-radius: 99px;
  transition: width 0.5s ease-out;
}

.balance-due {
  font-size: 1.125rem;
  font-weight: 700;
  color: #dc2626;
}

.balance-due.paid {
  color: #10b981;
}

.client-debt {
  color: #059669;
  font-weight: 800;
}

.client-debt.pending {
  color: #ea580c;
}

.client-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 0.8rem;
  font-weight: 700;
}

.client-status.inactive {
  background: #f1f5f9;
  color: #64748b;
}

.paid-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #10b981;
  font-weight: 600;
}

.check-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.row-paid {
  background-color: rgba(16, 185, 129, 0.05);
  opacity: 0.8;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-pay {
  padding: 0.5rem 0.75rem;
  background: var(--color-brand-main);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: background 0.2s;
}

.btn-whatsapp {
  padding: 0.5rem;
  background: #25d366;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.pagination-bar {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 3.5rem;
  height: 3.5rem;
  color: #d1d5db;
  margin: 0 auto 1.5rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
}

.modal-content {
  background: white;
  max-width: 400px;
  width: 100%;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.25rem;
}

.balance-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-label {
  font-weight: 600;
  color: #991b1b;
  font-size: 0.875rem;
}

.banner-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #dc2626;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-prefix {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 600;
  color: #6b7280;
}

.payment-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1060;
}

.drawer-content {
  background: white;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  padding: 2rem;
  box-shadow: -25px 0 50px -12px rgba(0,0,0,0.25);
  overflow-y: auto;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

