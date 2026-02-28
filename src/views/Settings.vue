<template>
  <DashboardLayout>
    <div class="settings-wrapper">
      <div class="settings-inner">
        
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Configuración del Negocio</h1>
            <p class="page-subtitle">Administra la identidad de tu tienda y personaliza la experiencia de tus clientes en los recibos.</p>
          </div>
          <div class="header-actions">
            <!-- AppButton could be imported, but we can also use standard styling as previous pages -->
            <button class="btn-action primary" @click="saveSettings">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd" />
                <path d="M17.25 2.25h-10.5a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75v-18a.75.75 0 0 0-.75-.75Z" v-if="false" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" v-if="false"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" v-if="false" />
                <!-- Using a regular SAVE icon instead of link -->
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Guardar Cambios
            </button>
          </div>
        </div>

        <div class="settings-grid">
          
          <!-- LEFT COLUMN: FORMS -->
          <div class="settings-forms">
            
            <!-- SECTION 1: Información General -->
            <div class="settings-card">
              <div class="card-header">
                <div class="icon-box brand">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.809c0-.63-.25-1.233-.695-1.677a.5.5 0 00-.012-.012l-6.5-6.5a2.25 2.25 0 00-3.18 0l-6.5 6.5A.5.5 0 002.36 8.13V21h3.64m0 0v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21" />
                  </svg>
                </div>
                <h2>Información General</h2>
              </div>

              <div class="form-grid">
                <!-- Nombre del negocio -->
                <div class="input-group">
                  <label>Nombre del Negocio</label>
                  <div class="input-with-icon right">
                    <input type="text" v-model="settings.storeName" placeholder="Escribe el nombre de tu negocio" />
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Simbolo de moneda -->
                <div class="input-group">
                  <label>Símbolo de Moneda</label>
                  <div class="select-wrapper">
                    <select v-model="settings.currency">
                      <option value="MXN">$ MXN (Peso Mexicano)</option>
                      <option value="USD">$ USD (Dólar Estadounidense)</option>
                      <option value="EUR">€ EUR (Euro)</option>
                    </select>
                    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>

                <!-- Dirección Física -->
                <div class="input-group full-width">
                  <label>Dirección Física</label>
                  <div class="input-with-icon left">
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </span>
                    <input type="text" v-model="settings.address" placeholder="Ej. Av. Reforma 123, Col. Centro, CDMX" />
                  </div>
                </div>

                <!-- WhatsApp de Contacto -->
                <div class="input-group full-width">
                  <label>WhatsApp de Contacto</label>
                  <div class="phone-input-group">
                    <div class="select-wrapper country-code">
                      <select v-model="settings.countryCode">
                        <option value="+52">+52</option>
                        <option value="+1">+1</option>
                        <option value="+34">+34</option>
                      </select>
                      <svg class="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                    <div class="input-with-icon right phone-number">
                      <input type="text" v-model="settings.phone" placeholder="55 9876 5432" />
                      <span class="icon text-green-500">
                        <!-- Chat icon placeholder for WhatsApp -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Personalización del Ticket -->
            <div class="settings-card">
              <div class="card-header">
                <div class="icon-box brand">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25A3.375 3.375 0 0 0 4.875 5.625v12.75a3.375 3.375 0 0 0 3.375 3.375h9.75a3.375 3.375 0 0 0 3.375-3.375v-1.5zm0 0v1.5a2.25 2.25 0 0 1-2.25 2.25h-9.75a2.25 2.25 0 0 1-2.25-2.25V5.625a2.25 2.25 0 0 1 2.25-2.25h1.875v1.5c0 1.243 1.007 2.25 2.25 2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v2.625m0 0h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25H21v-2.625z" v-if="false" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
                <h2>Personalización del Ticket</h2>
              </div>

              <div class="form-grid">
                <!-- Dropzone de logo -->
                <div class="input-group">
                  <label>Logo para el Ticket</label>
                  <div class="dropzone">
                    <div class="dropzone-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                      </svg>
                    </div>
                    <p class="dropzone-text">Arrastra tu logo aquí</p>
                    <span class="dropzone-hint">PNG, JPG hasta 2MB</span>
                  </div>
                </div>

                <!-- Mensaje final -->
                <div class="input-group">
                  <label>Mensaje de Agradecimiento</label>
                  <textarea 
                    v-model="settings.thankYouMessage" 
                    placeholder="Ej. ¡Gracias por su preferencia!"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: PREVIEW -->
          <div class="settings-preview">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-title">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="text-green-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>Vista Previa</span>
                </div>
                <span class="preview-badge">TICKET</span>
              </div>

              <!-- Ticket Simulation -->
              <div class="ticket-simulation">
                <div class="ticket-header">
                  <div class="ticket-logo">
                    {{ settings.storeName ? settings.storeName.charAt(0).toUpperCase() : 'N' }}
                  </div>
                  <h3 class="ticket-store-name">{{ settings.storeName || 'Nombre de la Tienda' }}</h3>
                  <div class="ticket-address">
                    <p>{{ formattedAddressLines[0] || 'Dirección de la Tienda' }}</p>
                    <p v-if="formattedAddressLines[1]">{{ formattedAddressLines[1] }}</p>
                    <p>Tel: {{ settings.phone || '00 0000 0000' }}</p>
                  </div>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-table">
                  <div class="ticket-th">
                    <span class="left-col">CANT. ARTICULO</span>
                    <span class="right-col">TOTAL</span>
                  </div>
                  <div class="ticket-tr">
                    <span class="left-col">1x Cappuccino Grande</span>
                    <span class="right-col">$65.00</span>
                  </div>
                  <div class="ticket-tr">
                    <span class="left-col">2x Galleta Avena</span>
                    <span class="right-col">$40.00</span>
                  </div>
                  <div class="ticket-tr">
                    <span class="left-col">1x Sandwich Pavo</span>
                    <span class="right-col">$85.00</span>
                  </div>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-total-section">
                  <div class="ticket-total-row">
                    <span>TOTAL</span>
                    <span>$190.00</span>
                  </div>
                  <div class="ticket-subInfo">
                    <span>Efectivo</span>
                    <span>$200.00</span>
                  </div>
                  <div class="ticket-subInfo">
                    <span>Cambio</span>
                    <span>$10.00</span>
                  </div>
                </div>

                <div class="ticket-footer">
                  <p class="ticket-thank-you">
                    "{{ settings.thankYouMessage || '¡Gracias por su compra!' }}"
                  </p>
                  <p class="ticket-number">NO. TICKET #004592</p>
                  <!-- Mock Barcode -->
                  <div class="ticket-barcode">
                    <svg viewBox="0 0 200 40" preserveAspectRatio="none">
                      <rect x="10" y="0" width="10" height="40" fill="#333" />
                      <rect x="25" y="0" width="5" height="40" fill="#333" />
                      <rect x="35" y="0" width="15" height="40" fill="#333" />
                      <rect x="55" y="0" width="5" height="40" fill="#333" />
                      <rect x="65" y="0" width="20" height="40" fill="#333" />
                      <rect x="90" y="0" width="8" height="40" fill="#333" />
                      <rect x="102" y="0" width="4" height="40" fill="#333" />
                      <rect x="110" y="0" width="12" height="40" fill="#333" />
                      <rect x="126" y="0" width="5" height="40" fill="#333" />
                      <rect x="135" y="0" width="15" height="40" fill="#333" />
                      <rect x="155" y="0" width="8" height="40" fill="#333" />
                      <rect x="168" y="0" width="5" height="40" fill="#333" />
                      <rect x="178" y="0" width="12" height="40" fill="#333" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="preview-footer-note">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                La vista previa es aproximada.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useSnackbar } from '@/composables/useSnackbar';

const { enqueueSnackbar } = useSnackbar();

// Form Data - Defaulting to match mockup placeholder
const settings = ref({
  storeName: 'Nurax Café',
  currency: 'MXN',
  address: 'Av. Reforma 123, Col. Centro, CDMX, México',
  countryCode: '+52',
  phone: '55 9876 5432',
  thankYouMessage: '¡Gracias por su preferencia!\nVuelva pronto.\nSíguenos en IG: @nuraxcafe'
});

// Format address roughly by comma to simulate multi-line address
const formattedAddressLines = computed(() => {
  if (!settings.value.address) return [];
  const parts = settings.value.address.split(',');
  if (parts.length <= 2) return [settings.value.address];
  
  // Combine first 2 parts, then the rest
  const line1 = parts.slice(0, 2).join(',').trim();
  const line2 = parts.slice(2).join(',').trim();
  return [line1, line2];
});

const saveSettings = () => {
  // In a real app we'd dispatch to a store or apiClient 
  enqueueSnackbar({
    type: 'success',
    title: 'Configuración Guardada',
    message: 'Se han guardado correctamente los ajustes del negocio.',
    duration: 3500
  });
};
</script>

<style scoped>
.settings-wrapper {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}

.settings-inner {
  background: var(--color-card-stats-fill);
  max-width: 1400px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.75rem 2rem;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
  margin: 0;
}

.page-subtitle {
  color: #6B7280;
  margin-top: 0.25rem;
  font-size: 0.95rem;
  max-width: 600px;
}

/* Base button from Nurax styles */
.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-action svg {
  width: 20px;
  height: 20px;
}

.btn-action.primary {
  background: var(--color-status-success, #22c55e); 
  /* Alternatively brand color, but mockup is vivid green */
  color: white;
  box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);
}

.btn-action.primary:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -3px rgba(34, 197, 94, 0.3);
}

/* Main Grid Template */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

/* LEFT COLUMN - Forms */
.settings-forms {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.icon-box {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.brand {
  color: var(--color-brand-main);
  background: rgba(34, 125, 82, 0.1); /* light matching green */
}

.icon-box svg {
  width: 22px;
  height: 22px;
}

.card-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group.full-width {
  grid-column: span 2;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

/* Inputs / Selects styling */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 30px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.input-with-icon input:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.input-with-icon.right input {
  padding-right: 2.5rem;
}

.input-with-icon.left input {
  padding-left: 2.75rem;
}

.input-with-icon .icon {
  position: absolute;
  color: #9ca3af;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-with-icon.right .icon {
  right: 1rem;
}

.input-with-icon.left .icon {
  left: 1rem;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  appearance: none;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 30px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.select-wrapper select:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

.select-wrapper .chevron {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

/* Phone Layout */
.phone-input-group {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid transparent;
  border-radius: 16px;
  font-size: 0.95rem;
  color: #374151;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  outline: none;
  line-height: 1.5;
}

textarea:focus {
  background: white;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(34, 125, 82, 0.1);
}

/* Dropzone */
.dropzone {
  width: 100%;
  height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.dropzone:hover {
  border-color: var(--color-brand-main);
  background: #f8faf9;
}

.dropzone-icon {
  width: 36px;
  height: 36px;
  background: rgba(34, 125, 82, 0.1);
  color: var(--color-brand-main);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.dropzone-icon svg {
  width: 20px;
  height: 20px;
}

.dropzone-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.dropzone-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .input-group {
    grid-column: span 2;
  }
}

/* RIGHT COLUMN - Preview */
.preview-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: #111827;
}

.preview-title svg {
  width: 24px;
  height: 24px;
}

.preview-badge {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
}

/* Ticket Simulation Styles */
.ticket-simulation {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  font-family: inherit;
  margin-bottom: 1.5rem;
}

.ticket-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.ticket-logo {
  width: 50px;
  height: 50px;
  background: #111827;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.ticket-store-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.ticket-address {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.ticket-divider {
  border-top: 1px dashed #d1d5db;
  margin: 1rem 0;
}

.ticket-table {
  font-size: 0.75rem;
  color: #4b5563;
}

.ticket-th {
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.ticket-tr {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.left-col {
  flex: 1;
  padding-right: 1rem;
}

.right-col {
  font-weight: 500;
}

.ticket-total-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ticket-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.25rem;
}

.ticket-subInfo {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
}

.ticket-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.ticket-thank-you {
  font-size: 0.85rem;
  font-style: italic;
  color: #374151;
  margin-bottom: 0.5rem;
  white-space: pre-line;
}

.ticket-number {
  font-size: 0.7rem;
  color: #9ca3af;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.ticket-barcode {
  width: 140px;
  height: 35px;
  margin: 0 auto;
  opacity: 0.2;
}

.preview-footer-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.preview-footer-note svg {
  width: 14px;
  height: 14px;
}
</style>
