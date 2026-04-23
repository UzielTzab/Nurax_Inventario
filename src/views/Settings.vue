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
            <AppButton variant="fill" @click="saveSettings" :loading="isSaving">
              Guardar Cambios
            </AppButton>
          </div>
        </div>

        <div class="settings-grid">
          
          <!-- LEFT COLUMN: FORMS -->
          <div class="settings-forms">
            <template v-if="isLoading">
              <!-- Skeleton S1 -->
              <div class="settings-card">
                <div class="card-header">
                  <AppSkeleton width="38px" height="38px" radius="8px" />
                  <AppSkeleton width="180px" height="1.2rem" />
                </div>
                <div class="form-grid">
                  <div class="input-group"><AppSkeleton width="100%" height="48px" radius="30px" /></div>
                  <div class="input-group"><AppSkeleton width="100%" height="48px" radius="30px" /></div>
                  <div class="input-group full-width"><AppSkeleton width="100%" height="48px" radius="30px" /></div>
                  <div class="input-group full-width"><AppSkeleton width="100%" height="48px" radius="30px" /></div>
                </div>
              </div>
              <!-- Skeleton S2 -->
              <div class="settings-card">
                <div class="card-header">
                  <AppSkeleton width="38px" height="38px" radius="8px" />
                  <AppSkeleton width="220px" height="1.2rem" />
                </div>
                <div class="form-grid">
                  <div class="input-group"><AppSkeleton width="100%" height="120px" radius="16px" /></div>
                  <div class="input-group"><AppSkeleton width="100%" height="120px" radius="16px" /></div>
                  <div class="input-group full-width"><AppSkeleton width="100%" height="80px" radius="12px" /></div>
                </div>
              </div>
            </template>

            <template v-else>
            <!-- SECTION 1: Información General -->
            <div class="settings-card">
              <div class="card-header">
                <HomeModernIcon class="home-icon-style"/>
                <h2>Información General</h2>
              </div>

              <div class="form-grid">
                <!-- Nombre del negocio -->
                <div class="input-group">
                  <AppInput
                    v-model="settings.storeName"
                    label="Nombre del Negocio"
                    placeholder="Escribe el nombre de tu negocio"
                    :disabled="isReadOnly"
                  />
                </div>

                <!-- RFC/NIT -->
                <div class="input-group">
                  <AppInput
                    v-model="settings.taxId"
                    label="Identificador Fiscal (RFC/NIT)"
                    placeholder="Ej. ABC123456XYZ"
                    :disabled="isReadOnly"
                  />
                </div>

                <!-- Simbolo de moneda -->
                <div class="input-group">
                  <AppSelect
                    v-model="settings.currency"
                    label="Símbolo de Moneda"
                    placeholder="Selecciona moneda"
                    :options="[
                      { value: '$ MXN', label: '$ MXN (Peso Mexicano)' },
                      { value: '$ USD', label: '$ USD (Dólar Estadounidense)' },
                      { value: '€ EUR', label: '€ EUR (Euro)' }
                    ]"
                  />
                </div>

                <!-- Dirección Física -->
                <div class="input-group full-width">
                  <AppInput
                    v-model="settings.address"
                    label="Dirección Física"
                    placeholder="Ej. Av. Reforma 123, Col. Centro, CDMX"
                  />
                </div>

                <!-- WhatsApp de Contacto -->
                <div class="input-group full-width">
                  <label>WhatsApp de Contacto</label>
                  <div class="phone-input-group">
                    <div class="country-code-select">
                      <AppSelect
                        v-model="settings.countryCode"
                        placeholder="Selecciona país"
                        :options="[
                          { value: '+52', label: '🇲🇽 México (+52)' },
                          { value: '+1', label: '🇺🇸 USA (+1)' },
                          { value: '+34', label: '🇪🇸 España (+34)' }
                        ]"
                      />
                    </div>
                    <div class="phone-number-field">
                      <AppInput
                        v-model="settings.phone"
                        type="tel"
                        placeholder="55 9876 5432"
                      />
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
                  <!-- Hidden real file input -->
                  <input
                    ref="logoInputRef"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style="display:none"
                    @change="onLogoFile"
                  />
                  <!-- Dropzone visual -->
                  <div
                    class="dropzone"
                    :class="{ 'dropzone-has-image': settings.logoUrl }"
                    @click="logoInputRef?.click()"
                    @dragover.prevent
                    @drop.prevent="onLogoDrop"
                  >
                    <!-- Preview if image selected -->
                    <template v-if="settings.logoUrl">
                      <img :src="settings.logoUrl" class="dropzone-preview" alt="Logo preview" />
                      <button class="dropzone-remove" @click.stop="settings.logoUrl = ''" title="Quitar logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/></svg>
                      </button>
                    </template>
                    <!-- Empty state -->
                    <template v-else>
                      <div class="dropzone-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                      </div>
                      <p class="dropzone-text">Haz clic o arrastra tu logo</p>
                      <span class="dropzone-hint">PNG, JPG, WebP · Máx. 2 MB</span>
                    </template>
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

                <!-- Tamaño de papel para impresión -->
                <div class="input-group full-width">
                  <label>Formato de Papel para Impresión</label>
                  <div class="paper-size-options">
                    <label
                      v-for="opt in paperSizeOptions"
                      :key="opt.value"
                      class="paper-size-btn"
                      :class="{ 'selected': paperWidth === opt.value }"
                    >
                      <input
                        type="radio"
                        name="paperSize"
                        :value="opt.value"
                        v-model="paperWidth"
                        style="display:none"
                        @change="onPaperWidthChange"
                      />
                      <span class="paper-icon">🖨️</span>
                      <span class="paper-label"> {{ opt.label }}</span>
                      <span class="paper-desc"> {{ opt.desc }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            </template>

          </div>

          <!-- RIGHT COLUMN: PREVIEW -->
          <div class="settings-preview">
            <template v-if="isLoading">
              <!-- Skeleton for preview -->
              <div class="preview-card">
                <div style="display: flex; gap: 0.5rem; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                  <AppSkeleton width="24px" height="24px" radius="4px" />
                  <AppSkeleton width="100px" height="1rem" />
                </div>
                <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                  <AppSkeleton width="80px" height="80px" radius="50%" />
                  <AppSkeleton width="100%" height="1rem" />
                  <AppSkeleton width="100%" height="1rem" />
                  <AppSkeleton width="100%" height="1rem" />
                  <div style="margin-top: 1rem;">
                    <AppSkeleton width="100%" height="0.5px" />
                  </div>
                  <AppSkeleton width="100%" height="6rem" />
                  <div style="margin-top: 1rem;">
                    <AppSkeleton width="100%" height="0.5px" />
                  </div>
                  <AppSkeleton width="100%" height="2rem" />
                </div>
              </div>
            </template>

            <template v-else>
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
              <div class="ticket-simulation" :class="`ticket-width-${paperWidth}`">
                <div class="ticket-header">
                  <!-- Show uploaded logo or fallback letter -->
                  <div class="ticket-logo" :class="{ 'ticket-logo-img': settings.logoUrl }">
                    <img v-if="settings.logoUrl" :src="settings.logoUrl" alt="Logo" />
                    <span v-else>{{ settings.storeName ? settings.storeName.charAt(0).toUpperCase() : 'N' }}</span>
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
                  <div v-for="(product, idx) in ticketProducts" :key="idx" class="ticket-tr">
                    <span class="left-col">{{ product.quantity }}x {{ product.name }}</span>
                    <span class="right-col">{{ product.price }}</span>
                  </div>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-total-section">
                  <div class="ticket-total-row">
                    <span>TOTAL</span>
                    <span>{{ '$' + ticketSubtotal.toFixed(2) }}</span>
                  </div>
                  <div class="ticket-subInfo">
                    <span>Efectivo</span>
                    <span>$300.00</span>
                  </div>
                  <div class="ticket-subInfo">
                    <span>Cambio</span>
                    <span>{{ '$' + ticketChange.toFixed(2) }}</span>
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

            </div> <!-- .preview-card -->
            </template>

            <!-- Button Under Preview -->
            <div class="preview-actions">
              <AppButton variant="fill" @click="saveSettings" :loading="isSaving" class="full-width-btn">
                Guardar Cambios
              </AppButton>
            </div>
          </div> <!-- .settings-preview -->
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { AppButton, AppInput, AppSkeleton, AppSelect } from '@/components/ui';
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuth } from '@/composables/useAuth';
import { HomeModernIcon } from '@heroicons/vue/24/outline';
import apiClient from '@/services/api';
import { getStoredPaperWidth, savePaperWidth, type PaperWidth } from '@/utils/ticketBuilder';

const { enqueueSnackbar } = useSnackbar();
const { currentUser } = useAuth();

// ── RBAC: Solo Propietario/Gerente/Admin pueden acceder ────────────────────
const canAccessSettings = computed(() => {
  const role = (currentUser.value?.role || '').toLowerCase();
  const normalizedRole = 
    role === 'owner' ? 'propietario' :
    role === 'manager' ? 'gerente' :
    role === 'cashier' ? 'cajero' : role;
  
  return ['propietario', 'gerente', 'admin', 'cliente'].includes(normalizedRole);
});

const isReadOnly = computed(() => {
  const role = (currentUser.value?.role || '').toLowerCase();
  const normalizedRole = 
    role === 'owner' ? 'propietario' :
    role === 'manager' ? 'gerente' :
    role === 'cashier' ? 'cajero' : role;
  
  // Solo Propietario puede editar (full write)
  // Gerente/Admin solo lectura en ciertos campos críticos
  return !['propietario', 'owner'].includes(normalizedRole);
});

// ── Mock Products por Nicho ────────────────────────────────────────────────
const mockProductsByNiche: Record<string, {name: string; price: string}[]> = {
  'Electrónica': [
    { name: 'Cable USB-C 2m', price: '$150.00' },
    { name: 'Audífonos Bluetooth V5', price: '$450.00' },
    { name: 'Cargador Rápido 65W', price: '$280.00' },
  ],
  'Abarrotes': [
    { name: 'Leche Entera 1L', price: '$28.50' },
    { name: 'Pan de Caja', price: '$32.00' },
    { name: 'Café Molido Premium', price: '$85.00' },
  ],
  'Farmacia': [
    { name: 'Vitamina C Tabletas x30', price: '$95.00' },
    { name: 'Analgésico Ibuprofeno 400mg', price: '$45.00' },
    { name: 'Protector Solar FPS 50', price: '$120.00' },
  ],
  'Ferretería': [
    { name: 'Taladro Percutor 800W', price: '$1,200.00' },
    { name: 'Juego de Brocas x21', price: '$89.00' },
    { name: 'Nivel Digital 60cm', price: '$350.00' },
  ],
  'default': [
    { name: 'Producto de Ejemplo 1', price: '$99.99' },
    { name: 'Producto de Ejemplo 2', price: '$149.99' },
    { name: 'Producto de Ejemplo 3', price: '$199.99' },
  ]
};

const currentMockProducts = computed(() => {
  const niche = settings.value.niche || '';
  return (mockProductsByNiche[niche] || mockProductsByNiche['default']) || [];
});

const ticketProducts = computed(() => {
  const products = currentMockProducts.value || [];
  return products.map((p, i) => ({
    quantity: i + 1,
    ...p
  }));
});

const ticketSubtotal = computed(() => {
  return ticketProducts.value.reduce((sum, p) => {
    const price = parseFloat(p.price.replace(/[^\d.]/g, ''));
    return sum + (isNaN(price) ? 0 : price * p.quantity);
  }, 0);
});

const ticketChange = computed(() => {
  const cash = 300; // Mock efectivo
  return Math.max(0, cash - ticketSubtotal.value);
});

// Ref for the hidden file input and selected logo file
const logoInputRef = ref<HTMLInputElement | null>(null);
const logoFile = ref<File | null>(null);

// Form Data — populated from backend on mount
const settings = ref({
  storeName: '',
  taxId: '', // RFC / NIT (from Wizard Step 1)
  niche: '', // Nicho/Giro (from Wizard Step 2)
  currency: '$ MXN',
  address: '',
  countryCode: '+52',
  phone: '',
  thankYouMessage: '',
  logoUrl: '' as string,
});

// ── Paper width preference (local storage) ────────────────────────────────────
const paperWidth = ref<PaperWidth>(getStoredPaperWidth());

const paperSizeOptions: { value: PaperWidth; label: string; desc: string }[] = [
  { value: '58mm', label: '58 mm', desc: ' Impresoras pequeñas' },
  { value: '80mm', label: '80 mm', desc: ' Estándar (recomendado)' },
  { value: 'A4',   label: 'A4',    desc: ' Impresora de escritorio' },
];

const onPaperWidthChange = () => {
  savePaperWidth(paperWidth.value);
};

// ── Load store settings from backend ─────────────────────────────────────────
const isLoading = ref(true);

onMounted(async () => {
  // Verificar RBAC
  if (!canAccessSettings.value) {
    enqueueSnackbar({
      type: 'error',
      title: 'Acceso Denegado',
      message: 'Solo propietarios y gerentes pueden acceder a esta sección.',
      duration: 4000,
    });
    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
    return;
  }

  isLoading.value = true;
  try {
    const res = await apiClient.get<any>('/v1/accounts/store-profiles/');
    if (res.success && res.data) {
      const d = res.data;
      settings.value.storeName      = d.store_name      ?? '';
      settings.value.taxId          = d.identificador_fiscal ?? d.tax_id ?? ''; // From Wizard Step 1
      settings.value.niche          = d.nicho ?? d.niche ?? ''; // From Wizard Step 2
      settings.value.currency       = d.currency_symbol ?? '$ MXN';
      settings.value.address        = d.address         ?? '';
      settings.value.phone          = d.phone           ?? '';
      settings.value.countryCode    = d.country_code    ?? '+52';
      settings.value.thankYouMessage = d.ticket_message ?? '';
      settings.value.logoUrl        = d.logo_url        ?? '';
    }
  } catch (err) {
    console.error('Error loading settings', err);
  } finally {
    isLoading.value = false;
  }
});

// ── Watch for real-time preview updates ────────────────────────────────────
watch(
  () => ({
    address: settings.value.address,
    thankYouMessage: settings.value.thankYouMessage,
    niche: settings.value.niche,
    phone: settings.value.phone,
    storeName: settings.value.storeName,
    logoUrl: settings.value.logoUrl,
  }),
  () => {
    // Trigger a re-render of the preview (computed properties update)
  },
  { deep: true }
);

// ── Logo file handling ────────────────────────────────────────────────────────
const onLogoFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    enqueueSnackbar({ type: 'error', title: 'Archivo muy grande', message: 'El logo no debe superar 2 MB.', duration: 3000 });
    return;
  }
  logoFile.value = file;
  // Immediate local preview
  settings.value.logoUrl = URL.createObjectURL(file);
};

const onLogoDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  if (file.size > 2 * 1024 * 1024) {
    enqueueSnackbar({ type: 'error', title: 'Archivo muy grande', message: 'El logo no debe superar 2 MB.', duration: 3000 });
    return;
  }
  logoFile.value = file;
  settings.value.logoUrl = URL.createObjectURL(file);
};

// ── Format address for ticket preview ────────────────────────────────────────
const formattedAddressLines = computed(() => {
  if (!settings.value.address) return [];
  const parts = settings.value.address.split(',');
  if (parts.length <= 2) return [settings.value.address];
  const line1 = parts.slice(0, 2).join(',').trim();
  const line2 = parts.slice(2).join(',').trim();
  return [line1, line2];
});

// ── Save to backend ───────────────────────────────────────────────────────────
const isSaving = ref(false);

const saveSettings = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();
    formData.append('store_name',      settings.value.storeName);
    formData.append('identificador_fiscal', settings.value.taxId);
    formData.append('nicho',           settings.value.niche);
    formData.append('currency_symbol', settings.value.currency);
    formData.append('address',         settings.value.address);
    formData.append('phone',           settings.value.phone);
    formData.append('country_code',    settings.value.countryCode);
    formData.append('ticket_message',  settings.value.thankYouMessage);

    if (logoFile.value) {
      formData.append('logo_file', logoFile.value);
    }

    const res = await apiClient.patch<any>('/v1/accounts/store-profiles/', formData);

    if (res.success && res.data) {
      // Update logo URL with Cloudinary's final URL
      if (res.data.logo_url) {
        settings.value.logoUrl = res.data.logo_url;
        logoFile.value = null; // already uploaded
      }
      enqueueSnackbar({
        type: 'success',
        title: 'Configuración Guardada',
        message: 'Los ajustes del negocio se guardaron correctamente.',
        duration: 3500,
      });
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error al guardar',
        message: res.error || 'No se pudo guardar la configuración.',
        duration: 4000,
      });
    }
  } catch (err) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.settings-wrapper {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}

.settings-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.settings-inner {
  background: var(--color-card-stats-fill);
  max-width: 100%;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  border-radius: 6px;
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
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.dropzone:hover {
  border-color: var(--color-brand-main);
  background: #f8faf9;
}

.dropzone-has-image {
  border-style: solid;
  border-color: var(--color-brand-main);
  background: #f0faf5;
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

.dropzone-preview {
  max-height: 90px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.dropzone-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0;
}

.dropzone-remove:hover {
  background: rgba(220, 38, 38, 0.8);
}

.dropzone-remove svg {
  width: 14px;
  height: 14px;
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
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  margin-bottom: 6rem;
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
  border-radius: 6px;
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
  width: 56px;
  height: 56px;
  background: #111827;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.ticket-logo-img {
  background: transparent;
}

.ticket-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.home-icon-style{
  width: 24px;
  height: 24px;
}

.pencil-icon-style{
  width: 24px;
  height: 24px;
}

.tion-icon-style{
  width: 24px;
  height: 24px;
}

/* ── Paper size selector ── */
.paper-size-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.paper-size-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 1.25rem;
  border: 1.5px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  background: #F9FAFB;
  transition: all 0.2s;
  min-width: 90px;
  text-align: center;
  user-select: none;
}

.paper-size-btn:hover {
  border-color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.04);
}

.paper-size-btn.selected {
  border-color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.08);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.1);
}

.paper-icon {
  font-size: 1.4rem;
}

.paper-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
}

.paper-desc {
  font-size: 0.7rem;
  color: #6B7280;
  line-height: 1.2;
}

.preview-actions {
  margin-top: 1rem;
}

.full-width-btn {
  width: 100%;
}

/* ── Dynamic Paper Width for Ticket Preview ─────────────────────────────────── */
.ticket-simulation {
  margin-left: auto;
  margin-right: auto;
  transition: width 0.3s ease;
}

.ticket-width-58mm {
  width: 230px;
}

.ticket-width-80mm {
  width: 320px;
}

.ticket-width-A4 {
  width: 100%;
  max-width: 800px;
}
</style>
