<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="overlay" @click.self="$emit('close')">
      <div class="modal-card">

        <!-- Header -->
        <header class="modal-header">
          <div class="header-title">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Nuevo Proveedor</h2>
              <p class="modal-subtitle">El proveedor se guardará en este dispositivo</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <!-- Body -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="supplier-form">

            <!-- Nombre de la empresa -->
            <div class="form-group full-width">
              <label for="sup-name">Nombre de la Empresa *</label>
              <input
                type="text"
                id="sup-name"
                v-model="form.name"
                required
                placeholder="Ej: TechGlobal Inc."
                class="form-input"
              />
            </div>

            <!-- Persona de contacto + Teléfono -->
            <div class="form-row">
              <div class="form-group">
                <label for="sup-contact">Persona de Contacto *</label>
                <input
                  type="text"
                  id="sup-contact"
                  v-model="form.contactPerson"
                  required
                  placeholder="Ej: Juan Pérez"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="sup-phone">Teléfono</label>
                <input
                  type="tel"
                  id="sup-phone"
                  v-model="form.phone"
                  placeholder="Ej: +52 55 1234 5678"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Email + Sitio Web -->
            <div class="form-row">
              <div class="form-group">
                <label for="sup-email">Correo Electrónico</label>
                <input
                  type="email"
                  id="sup-email"
                  v-model="form.email"
                  placeholder="correo@empresa.com"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="sup-website">Sitio Web</label>
                <input
                  type="text"
                  id="sup-website"
                  v-model="form.website"
                  placeholder="www.empresa.com"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Dirección -->
            <div class="form-group full-width">
              <label for="sup-address">Dirección</label>
              <input
                type="text"
                id="sup-address"
                v-model="form.address"
                placeholder="Ej: Av. Reforma 123, Ciudad de México"
                class="form-input"
              />
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <AppButton variant="outline" type="button" @click="$emit('close')">Cancelar</AppButton>
              <AppButton variant="fill" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Guardar Proveedor
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useSuppliers } from '@/composables/useSuppliers'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'supplierCreated', supplierId: string, supplierName: string): void
}>()

const { addSupplier } = useSuppliers()

const form = reactive({
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  website: '',
  address: '',
})

function resetForm() {
  form.name = ''
  form.contactPerson = ''
  form.phone = ''
  form.email = ''
  form.website = ''
  form.address = ''
}

watch(() => props.isOpen, (val) => {
  if (!val) resetForm()
})

async function handleSubmit() {
  try {
    const created = await addSupplier({
      name: form.name,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email,
      website: form.website,
      address: form.address,
    });
    
    // We only proceed and emit if it was successfully created on the backend
    if (created && created.id) {
       emit('supplierCreated', String(created.id), created.name);
       emit('close');
    }
  } catch(e) {
    console.error("Error creating supplier from modal", e);
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 1rem;
  backdrop-filter: blur(6px);
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid #E5E7EB;
  background: var(--color-background, #F8FAF9);
  border-radius: 20px 20px 0 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 44px;
  height: 44px;
  background: rgba(6, 64, 43, 0.08);
  color: var(--color-brand-main, #06402B);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon svg {
  width: 22px;
  height: 22px;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.8rem;
  color: #9CA3AF;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #374151;
}

/* Body */
.modal-body {
  padding: 1.75rem;
}

.supplier-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-row {
  display: contents; /* rows are handled by the parent grid */
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
}

.form-input {
  padding: 0.7rem 1rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 10px;
  font-size: 0.9rem;
  background: #F9FAFB;
  transition: all 0.2s;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--color-brand-main, #06402B);
  background: #fff;
}

.form-input::placeholder {
  color: #C4C7CE;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #F3F4F6;
  margin-top: 0.25rem;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 520px) {
  .supplier-form {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: 1;
  }
}
</style>
