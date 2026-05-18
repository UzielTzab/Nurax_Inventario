<template>
  <Teleport to="body">
    <div class="sale-detail-drawer-root">
    <!-- Overlay principal oscuro -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="drawer-overlay" 
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="slide">
      <div v-if="isOpen" class="drawer-panel">
        <div class="drawer-header">
          <div class="drawer-title-container">
            <h2 class="drawer-title">Detalle de Venta</h2>
            <p class="drawer-subtitle">{{ formatSaleFolio(sale?.id, sale?.transaction_id) }}</p>
          </div>
          <button class="btn-close" @click="$emit('close')" title="Cerrar (Esc)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="drawer-body" v-if="sale">
          <!-- Ticket preview view -->
          <div class="ticket-preview">
            <div v-if="settings?.logo_url" class="ticket-logo">
              <img :src="settings.logo_url" alt="Logo" />
            </div>
            <div class="company-name">{{ settings?.store_name || 'NOMBRE DE LA EMPRESA' }}</div>
            <div v-if="settings?.address" class="ticket-store-detail">{{ settings.address }}</div>
            <div v-if="settings?.phone" class="ticket-store-detail">Tel: {{ settings.phone }}</div>
            <div class="ticket-info">
              <p>{{ formatDateTime(sale.created_at) }}</p>
              <p>Ticket {{ formatSaleFolio(sale.id, sale.transaction_id) }}</p>
            </div>
            <div class="ticket-divider"></div>
            
            <div class="ticket-items">
              <div v-for="(item, idx) in sale.items" :key="idx" class="ticket-item">
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.product_name }}</span>
                <span class="item-price">{{ settings?.currency_symbol || '$' }} {{ formatMoney((Number(item.unit_price) || 0) * item.quantity) }}</span>
              </div>
            </div>
            
            <div class="ticket-divider"></div>
            <div class="ticket-total">
              <span>TOTAL</span>
              <span>{{ settings?.currency_symbol || '$' }} {{ formatMoney(sale.total_amount) }}</span>
            </div>
            
            <div class="ticket-payment-info" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Pagó con (Efectivo):</span>
                <span>{{ settings?.currency_symbol || '$' }} {{ formatMoney(sale.amount_tendered || sale.amount_paid) }}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Cambio:</span>
                <span>{{ settings?.currency_symbol || '$' }} {{ formatMoney(sale.change || 0) }}</span>
              </div>
            </div>
            
            <div class="ticket-footer">
              <p>{{ settings?.ticket_message || '¡Gracias por su compra!' }}</p>
            </div>
          </div>
          
          <div class="drawer-info-group">
            <div class="info-row">
              <span class="info-label">Cajero</span>
              <span class="info-value">{{ sale.cashier?.name || sale.cashier?.username || 'Desconocido' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado</span>
              <span class="status-badge" :class="sale.status === 'cancelled' ? 'danger' : 'success'">
                {{ sale.status === 'cancelled' ? 'Cancelado' : 'Completado' }}
              </span>
            </div>
          </div>
        </div>

        <div class="drawer-footer" v-if="sale">
          <button 
            class="btn-ghost-reprint" 
            @click="$emit('print', sale)" 
            title="Reimprimir recibo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Imprimir Recibo
          </button>
          
          <button 
            v-if="sale.status !== 'cancelled' && !isCashier"
            class="btn-ghost-cancel" 
            @click="confirmCancel" 
            title="Cancelar venta">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Cancelar Venta
          </button>
        </div>
      </div>
    </Transition>
    </div>

    <!-- Modal de Confirmación de Cancelación -->
    <Transition name="modal-fade">
      <div v-if="showCancelConfirm" class="drawer-overlay" style="z-index: 10002; display: flex; align-items: center; justify-content: center;">
        <div class="cancel-modal">
          <div class="cancel-modal-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3>Confirmar Cancelación</h3>
          </div>
          <div class="cancel-modal-body">
            <p>¿Estás seguro de cancelar el Ticket <strong>{{ formatSaleFolio(sale?.id, sale?.transaction_id) }}</strong>?</p>
            <p class="text-danger mt-2 text-sm">Los productos regresarán al inventario y el dinero se restará del corte de caja actual.</p>
          </div>
          <div class="cancel-modal-actions">
            <button class="btn-cancel-outline" @click="showCancelConfirm = false">No, mantener venta</button>
            <button class="btn-cancel-danger" @click="executeCancel">Sí, cancelar venta</button>
          </div>
        </div>
      </div>
    </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Sale } from '@/stores/sales.store';
import { useAuth } from '@/composables/useAuth';
import { formatSaleFolio } from '@/utils/saleFolio';

const props = defineProps<{
  isOpen: boolean;
  sale: Sale | null;
  settings?: any;
}>();

const emit = defineEmits<{
  close: [];
  print: [sale: Sale];
  cancel: [saleId: string | number];
}>();

const { currentUser } = useAuth();
const isCashier = computed(() => {
  const role = String(currentUser.value?.role || '').toLowerCase();
  return role === 'cashier' || role === 'cajero';
});

const showCancelConfirm = ref(false);

const confirmCancel = () => {
  showCancelConfirm.value = true;
};

const executeCancel = () => {
  if (props.sale) {
    emit('cancel', props.sale.id);
  }
  showCancelConfirm.value = false;
};

const formatDateTime = (date: Date | string) => {
  if (!date) return '';
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatMoney = (amount: number | string | undefined | null) => {
  if (amount === undefined || amount === null) return '0.00';
  const num = Number(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Layout */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 10000;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 440px;
  height: 100vh;
  background: #F9FAFB;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 10001;
}

/* Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-bottom: 1px solid #E5E7EB;
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.drawer-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0.2rem 0 0 0;
  font-family: monospace;
}

.btn-close {
  background: transparent;
  border: none;
  color: #9CA3AF;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #F3F4F6;
  color: #374151;
}

.btn-close svg {
  width: 24px;
  height: 24px;
}

/* Body */
.drawer-body {
  background: var(--color-background-secondary);
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.ticket-preview {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.company-name {
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  margin-bottom: 0.25rem;
}

.ticket-logo {
  text-align: center;
  margin-bottom: 0.5rem;
}

.ticket-logo img {
  max-width: 90px;
  max-height: 50px;
  object-fit: contain;
}

.ticket-store-detail {
  text-align: center;
  font-size: 0.72rem;
  color: #6B7280;
  margin-bottom: 0.15rem;
}

.ticket-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.ticket-divider {
  height: 1px;
  border-top: 2px dashed #E5E7EB;
  margin: 1rem 0;
}

.ticket-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ticket-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.item-qty {
  font-weight: 600;
  color: #111827;
  width: 30px;
}

.item-name {
  flex: 1;
  color: #4B5563;
  margin-right: 10px;
}

.item-price {
  font-weight: 500;
  color: #111827;
}

.ticket-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
  font-size: 1.125rem;
  color: #111827;
}

.ticket-payment-info {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.ticket-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9CA3AF;
}

.drawer-info-group {
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.875rem;
  color: #6B7280;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.status-badge.success {
  background: #DCFCE7;
  color: #166534;
}

.status-badge.danger {
  background: #FEE2E2;
  color: #991B1B;
}

/* Footer */
.drawer-footer {
  padding: 1.25rem 1.5rem;
  background: white;
  border-top: 1px solid #E5E7EB;
  display: flex;
  gap: 1rem;
}

.btn-ghost-reprint {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: #4B5563;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost-reprint:hover {
  background: #F3F4F6;
  color: #111827;
}

.btn-ghost-cancel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: #EF4444;
  border: 1px solid #FECACA;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost-cancel:hover {
  background: #FEF2F2;
  border-color: #EF4444;
}

.btn-ghost-reprint svg, .btn-ghost-cancel svg {
  width: 18px;
  height: 18px;
}

/* Cancel Modal */
.cancel-modal {
  background: white;
  width: min(400px, 90vw);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #FECACA;
}

.cancel-modal-header {
  padding: 1.25rem 1.5rem;
  background: #FEF2F2;
  border-bottom: 1px solid #FECACA;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cancel-modal-header h3 {
  margin: 0;
  color: #991B1B;
  font-size: 1.125rem;
  font-weight: 700;
}

.alert-icon {
  width: 24px;
  height: 24px;
  color: #DC2626;
}

.cancel-modal-body {
  padding: 1.5rem;
  color: #374151;
  font-size: 0.95rem;
}

.cancel-modal-body p {
  margin: 0;
}

.text-danger {
  color: #DC2626;
}

.text-sm {
  font-size: 0.85rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.cancel-modal-actions {
  padding: 1rem 1.5rem;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel-outline {
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-outline:hover {
  background: #F3F4F6;
}

.btn-cancel-danger {
  padding: 0.6rem 1rem;
  background: #DC2626;
  border: 1px solid #DC2626;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-danger:hover {
  background: #B91C1C;
}

/* Transiciones para modal interior */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
