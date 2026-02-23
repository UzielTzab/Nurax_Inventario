<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Venta Rápida</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSale" class="modal-body">
        <div class="form-group">
          <label>Producto</label>
          <input v-model="productName" type="text" required placeholder="Ej. iPhone 15 Pro" class="form-input" />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Cantidad</label>
            <input v-model.number="quantity" type="number" min="1" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Precio Total ($)</label>
            <input v-model.number="total" type="number" min="0" step="0.01" required class="form-input" />
          </div>
        </div>

        <div class="modal-footer">
          <AppButton variant="outline" type="button" @click="$emit('close')">Cancelar</AppButton>
          <AppButton variant="fill" type="submit">Registrar Venta</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSalesStore } from '@/stores/sales.store';

const emit = defineEmits(['close']);
const salesStore = useSalesStore();

const productName = ref('');
const quantity = ref(1);
const total = ref(0);

const handleSale = () => {
  salesStore.addSale({
    items: [{ name: productName.value, quantity: Number(quantity.value) }],
    total: Number(total.value)
  });
  emit('close');
};
</script>

<style scoped>
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
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 1.5rem;
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

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
}

.btn-confirm {
  padding: 0.625rem 1rem;
  background: var(--color-brand-primary, #22c55e);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm:hover {
  opacity: 0.9;
}
</style>
