<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">

        <!-- ── Diálogo de confirmación (capa superior) ── -->
        <Transition name="confirm-slide">
          <div v-if="confirmingRevert" class="confirm-overlay">
            <div class="confirm-box">
              <div class="confirm-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 class="confirm-title">¿Revertir esta venta?</h3>
              <p class="confirm-desc">
                Se eliminará del historial y se restaurará el stock de
                <strong>{{ cart.length }} producto{{ cart.length !== 1 ? 's' : '' }}</strong>.
                Esta acción no se puede deshacer.
              </p>
              <div class="confirm-actions">
                <AppButton variant="outline" class="flex-1" @click="confirmingRevert = false">
                  Cancelar
                </AppButton>
                <AppButton variant="fill" color="danger" class="flex-1 btn-danger" @click="confirmRevert">
                  Sí, revertir venta
                </AppButton>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Header -->
        <div class="modal-header">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 class="modal-title">¡Venta Exitosa!</h2>
          <p class="modal-subtitle">La transacción se completó correctamente</p>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="ticket-preview">
            <!-- Logo del negocio -->
            <div v-if="settings.logo_url" class="ticket-logo">
              <img :src="settings.logo_url" alt="Logo" />
            </div>
            <div class="company-name">{{ settings.store_name || 'NOMBRE DE LA EMPRESA' }}</div>
            <div v-if="settings.address" class="ticket-store-detail">{{ settings.address }}</div>
            <div v-if="settings.phone" class="ticket-store-detail">Tel: {{ settings.phone }}</div>
            <div class="ticket-info">
              <p>{{ currentDate }}</p>
              <p>Ticket #{{ ticketNumber }}</p>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-items">
              <div v-for="item in cart" :key="item.id" class="ticket-item">
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">{{ settings.currency_symbol }} {{ (Number(item.price) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-total">
              <span>TOTAL</span>
              <span>{{ settings.currency_symbol }} {{ total.toFixed(2) }}</span>
            </div>
            <div class="ticket-footer">
              <p>{{ settings.ticket_message || '¡Gracias por su compra!' }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <!-- Revertir -->
          <button class="btn-revert" @click="confirmingRevert = true" title="Revertir venta">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Revertir
          </button>

          <AppButton variant="outline" class="flex-1" @click="$emit('close')">
            Hecho
          </AppButton>
          <AppButton variant="fill" class="flex-1" @click="printTicket">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Imprimir Ticket
          </AppButton>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import { useStoreSettings } from '@/composables/useStoreSettings';
import { buildTicketHtml, openTicketPrint, getStoredPaperWidth } from '@/utils/ticketBuilder';

interface CartItem {
  id: string | number;
  name: string;
  price: number | string;
  quantity: number;
}

const props = defineProps<{
  isOpen: boolean;
  cart: CartItem[];
  total: number;
  saleId: string | number;
}>();

const emit = defineEmits<{
  close: [];
  revert: [saleId: string | number, cart: CartItem[]];
}>();

const { settings, loadSettings } = useStoreSettings();

onMounted(() => {
  loadSettings();
});

const confirmingRevert = ref(false);
const ticketNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

const currentDate = computed(() => {
  return new Date().toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const confirmRevert = () => {
  confirmingRevert.value = false;
  emit('revert', props.saleId, props.cart);
};

const printTicket = () => {
  const html = buildTicketHtml({
    store: settings.value,
    items: props.cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: props.total,
    ticketId: props.saleId,
    date: currentDate.value,
    paperWidth: getStoredPaperWidth(),
    isReprint: false,
  });
  openTicketPrint(html);
};
</script>

<style scoped>
/* ── Overlay principal ── */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 480px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Diálogo de confirmación ── */
.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 16px;
  padding: 1.5rem;
}

.confirm-box {
  text-align: center;
  max-width: 340px;
}

.confirm-icon {
  width: 60px;
  height: 60px;
  background: #FEF3C7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D97706;
  margin: 0 auto 1.25rem;
}

.confirm-icon svg {
  width: 28px;
  height: 28px;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.75rem;
}

.confirm-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
}

/* Botón peligro (revertir) */
.btn-danger {
  background: #EF4444 !important;
  border-color: #EF4444 !important;
}
.btn-danger:hover {
  background: #DC2626 !important;
  border-color: #DC2626 !important;
}

/* Transición del confirm overlay */
.confirm-slide-enter-active,
.confirm-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.confirm-slide-enter-from,
.confirm-slide-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ── Header del modal ── */
.modal-header {
  padding: 2rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, var(--color-brand-main, #06402B) 0%, #0a5c3a 100%);
  color: white;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-main, #06402B);
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.success-icon svg {
  width: 32px;
  height: 32px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.modal-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

/* ── Body ── */
.modal-body {
  padding: 1.5rem;
  background: #F9FAFB;
}

.ticket-preview {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: relative;
}

.ticket-preview::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 10px;
  right: 10px;
  height: 10px;
  background: radial-gradient(circle, transparent 5px, white 5px);
  background-size: 15px 15px;
  background-position: bottom;
}

.ticket-preview::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 10px;
  right: 10px;
  height: 10px;
  background: radial-gradient(circle, transparent 5px, white 5px);
  background-size: 15px 15px;
  background-position: top;
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
  max-height: 200px;
  overflow-y: auto;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.ticket-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9CA3AF;
}

/* ── Footer ── */
.modal-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  border-top: 1px solid #F3F4F6;
  background: white;
}

/* Botón Revertir */
.btn-revert {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.875rem;
  background: #FEF2F2;
  color: #EF4444;
  border: 1.5px solid #FECACA;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-revert:hover {
  background: #FEE2E2;
  border-color: #EF4444;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.btn-revert svg {
  width: 15px;
  height: 15px;
}

/* Transición del overlay principal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
