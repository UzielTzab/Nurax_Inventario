<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
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
            <div class="company-name">NOMBRE DE LA EMPRESA.</div>
            <div class="ticket-info">
              <p>{{ currentDate }}</p>
              <p>Ticket #{{ ticketNumber }}</p>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-items">
              <div v-for="item in cart" :key="item.id" class="ticket-item">
                <span class="item-qty">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="ticket-divider"></div>
            <div class="ticket-total">
              <span>TOTAL</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
            <div class="ticket-footer">
              <p>¡Gracias por su compra!</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-print" @click="printTicket">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Imprimir Ticket
          </button>
          <button class="btn-close" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const props = defineProps<{
  isOpen: boolean;
  cart: CartItem[];
  total: number;
}>();

defineEmits(['close']);

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

const printTicket = () => {
  const printWindow = window.open('', '', 'height=600,width=400');
  if (!printWindow) return;

  const ticketHtml = `
    <html>
      <head>
        <title>Ticket de Compra</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            padding: 20px;
            font-size: 14px;
            max-width: 300px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .company {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
          }
          .info {
            font-size: 12px;
          }
          .items {
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .item-name {
            flex: 1;
            margin-right: 10px;
          }
          .total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">TEKNOGADGET S.A. DE C.V.</div>
          <div class="info">
            <p>${currentDate.value}</p>
            <p>Ticket #${ticketNumber}</p>
          </div>
        </div>
        
        <div class="items">
          ${props.cart.map(item => `
            <div class="item-row">
              <span class="item-name">${item.quantity}x ${item.name}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="total">
          <span>TOTAL</span>
          <span>$${props.total.toFixed(2)}</span>
        </div>
        
        <div class="footer">
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(ticketHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
</script>

<style scoped>
/* CSS for SaleSuccessModal */
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
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 2rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
  color: #10B981;
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

/* Serrated edge effect for ticket */
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
  margin-bottom: 1rem;
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

.modal-footer {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid #F3F4F6;
  background: white;
}

.btn-print {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-print:hover {
  background: #374151;
}

.btn-print svg {
  width: 20px;
  height: 20px;
}

.btn-close {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #D1D5DB;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
}
</style>
