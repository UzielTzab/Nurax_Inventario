<template>
  <div class="app-shell">
    <!-- Sidebar flotante -->
    <aside class="sidebar-card" :class="{ 'mobile-open': isSidebarOpen }">
      <Sidebar
        :isOpen="isSidebarOpen"
        @close="isSidebarOpen = false"
        @quick-sell="handleSidebarQuickSell"
      />
    </aside>

    <!-- Overlay para mÃ³vil -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    />

    <!-- Columna derecha -->
    <div class="main-column">
      <!-- TopBar flotante -->
      <div class="topbar-card">
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="isSidebarOpen = true">
          <Bars3Icon class="w-6 h-6" />
        </button>


        <!-- Ãrea derecha topbar -->
        <div class="topbar-right">
          <!-- BotÃ³n Vender (Acceso Global) -->
          <AppButton v-if="showPosActions" variant="fill" :icon="ShoppingCartIcon" @click="salesStore.openModal()" style="margin-right: 0.5rem;">
            Vender
          </AppButton>

          <!-- Notificaciones -->
          <div class="topbar-notification-wrapper" ref="notificationWrapperRef">
            <!-- <button class="icon-btn" title="Notificaciones" @click="toggleNotifications">
              <BellIcon class="w-5 h-5" /> -->
              <!-- Un pequeÃ±o badge si hay notificaciones, opcional -->
              <!-- <span v-if="productStore.lowStockProducts.length > 0 || productStore.outOfStockProducts.length > 0" class="notification-badge"></span>
            </button> -->

            <!-- Panel de Notificaciones Flotante -->
            <transition name="dropdown">
              <div v-show="showNotifications" class="notifications-dropdown-container">
                <NotificationPanel 
                  :is-open="showNotifications"
                  :products="productStore.products"
                  @close="showNotifications = false"
                />
              </div>
            </transition>
          </div>

          <!-- Vincular escaner movil -->
          <!-- <button v-if="showPosActions" class="icon-btn scan-btn-premium" title="Vincular escaner movil" @click="openScannerPairingModal" style="color: var(--color-brand-secondary); box-shadow: none;">
            <QrCodeIcon class="w-5 h-5" :style="{color: 'var(--color-brand-secondary)'}" />
          </button> -->

          <!-- Divisor -->
          <div class="topbar-divider"></div>

          <div class="topbar-profile-wrapper" ref="profileWrapperRef">
            <button
              class="topbar-profile"
              @click="toggleProfileMenu"
              :class="{ 'profile-active': showProfileMenu }"
            >
            <div class="topbar-avatar">
              <img
                v-if="currentUser?.avatar_url || profilePhotoPreview"
                :src="profilePhotoPreview || currentUser?.avatar_url"
                :alt="displayName"
              />
              <img
                v-else
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e6ab17&color=1f2937`"
                :alt="displayName"
              />
            </div>
              <div class="topbar-profile-text">
                <span class="topbar-name">{{ displayName }}</span>
                <span class="topbar-email">{{ currentUser?.email || '' }}</span>
              </div>
              <ChevronDownIcon
                class="profile-chevron"
                :class="{ 'chevron-up': showProfileMenu }"
              />
            </button>

            <!-- Dropdown menu -->
            <transition name="dropdown">
              <div v-if="showProfileMenu" class="profile-dropdown">
                <!-- Header del dropdown -->
                <div class="dropdown-header">
                  <div class="dropdown-avatar">
                    <img
                      v-if="currentUser?.avatar_url || profilePhotoPreview"
                      :src="profilePhotoPreview || currentUser?.avatar_url"
                      :alt="displayName"
                    />
                    <img
                      v-else
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e6ab17&color=1f2937&size=80`"
                      :alt="displayName"
                    />
                  </div>
                  <div>
                    <p class="dropdown-name">{{ displayName }}</p>
                    <p class="dropdown-email">{{ currentUser?.email || '' }}</p>
                    <span class="dropdown-role-badge">
                      {{ currentUser?.role === 'admin' ? 'Administrador' : 'Cliente' }}
                    </span>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <!-- Opciones -->
                <div class="dropdown-buttons-container">
                  <AppButton variant="outline" :icon="UserCircleIcon" @click="openProfileEdit" size="sm">
                    Editar perfil
                  </AppButton>
                  <AppButton variant="danger" :icon="ArrowRightOnRectangleIcon" @click="handleLogout" size="sm" full-width>
                    Cerrar sesiÃ³n
                  </AppButton>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Contenido principal (card blanca redondeada) -->
      <div class="content-card">
        <slot />
      </div>
    </div>

    <!-- Sales Modal -->
    <Teleport to="body">
    <SalesModal
        v-if="salesStore.isModalOpen"
        :is-open="salesStore.isModalOpen"
        @close="salesStore.closeModal()"
        @sale-completed="handleSaleCompleted"
        @sale-reverted="handleSaleReverted"
      />
    </Teleport>

    <!-- Profile Edit Modal -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showProfileEdit" class="profile-modal-backdrop" @click.self="requestCloseProfileEdit">
          <div class="profile-modal">
            <div class="pm-header">
              <h3 class="pm-title">Editar perfil</h3>
              <button class="pm-close" @click="requestCloseProfileEdit" :disabled="isSavingProfile || isChangingPassword">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="pm-avatar-section">
              <!-- Avatar with upload overlay -->
              <div class="pm-avatar pm-avatar-clickable" @click="profilePhotoInputRef?.click()" title="Cambiar foto">
                <img
                  v-if="profilePhotoPreview"
                  :src="profilePhotoPreview"
                  :alt="profileForm.name"
                />
                <img
                  v-else
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'U')}&background=e6ab17&color=1f2937&size=80`"
                  :alt="profileForm.name"
                />
                <!-- Camera overlay -->
                <div class="pm-avatar-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <!-- Hidden file input -->
              <input
                ref="profilePhotoInputRef"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style="display:none"
                @change="onProfilePhotoFile"
              />
              <div>
                <p class="pm-avatar-label">{{ profileForm.name }}</p>
                <span class="dropdown-role-badge">{{ currentUser?.role === 'admin' ? 'Administrador' : 'Cliente' }}</span>
                <div class="pm-photo-actions">
                  <AppButton variant="outline" size="sm" :icon="ArrowUpTrayIcon" @click="profilePhotoInputRef?.click()">
                    Cambiar foto
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    :icon="XMarkIcon"
                    v-if="profilePhotoPreview"
                    @click="removeProfilePhoto"
                  >
                    Quitar
                  </AppButton>
                </div>
              </div>
            </div>
            <div class="pm-body">
              <div class="pm-profile-section">
                <div class="pm-section-header">
                  <UserCircleIcon class="pm-section-icon" />
                  <h4 class="pm-section-title">Datos del perfil</h4>
                </div>
              </div>
              <div class="pm-field">
                <AppInput
                  v-model="profileForm.name"
                  label="Nombre"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div class="pm-field">
                <AppInput
                  v-model="profileForm.email"
                  type="email"
                  label="Correo electrÃ³nico"
                  placeholder="correo@empresa.com"
                />
              </div>

              <!-- Divider for password section -->
              <div style="margin: 1.5rem 0; border-top: 1px solid #e5e7eb;"></div>
              
              <!-- Change Password Section -->
              <div class="pm-password-section">
                <div
                  class="pm-password-header"
                >
                  <div class="pm-password-header-content">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="pm-password-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span class="pm-password-label">Seguridad</span>
                  </div>
                </div>

                <div class="pm-password-fields">
                  <div class="pm-field">
                    <AppInput
                      v-model="passwordForm.current"
                      type="password"
                      label="ContraseÃ±a actual"
                      placeholder="Ingresa tu contraseÃ±a actual"
                      @input="passwordErrors.current = ''"
                    />
                    <p v-if="passwordErrors.current" class="pm-field-error">{{ passwordErrors.current }}</p>
                  </div>
                  <div class="pm-field">
                    <AppInput
                      v-model="passwordForm.new"
                      type="password"
                      label="Nueva contraseÃ±a"
                      placeholder="MÃ­n. 8 caracteres Â· 1 mayÃºscula Â· 1 nÃºmero"
                      @input="passwordErrors.new = ''"
                    />
                    <p v-if="passwordErrors.new" class="pm-field-error">{{ passwordErrors.new }}</p>
                  </div>
                  <div class="pm-field">
                    <AppInput
                      v-model="passwordForm.confirm"
                      type="password"
                      label="Confirmar nueva contraseÃ±a"
                      placeholder="Repite tu nueva contraseÃ±a"
                      @input="passwordErrors.confirm = ''"
                    />
                    <p v-if="passwordErrors.confirm" class="pm-field-error">{{ passwordErrors.confirm }}</p>
                  </div>
                </div>
                <div class="pm-password-actions">
                  <AppButton
                    variant="outline"
                    size="sm"
                    @click="submitChangePassword"
                    :loading="isChangingPassword"
                    :disabled="!isPasswordReady"
                  >
                    Actualizar contraseÃ±a
                  </AppButton>
                </div>
              </div>
            </div>
            <div class="pm-footer">
              <AppButton variant="outline" @click="requestCloseProfileEdit" :disabled="isSavingProfile || isChangingPassword">Cancelar</AppButton>
              <AppButton 
                variant="fill" 
                @click="saveProfile" 
                :loading="isSavingProfile"
                :disabled="isChangingPassword"
              >
                Guardar cambios
              </AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <ConfirmationModal
        :is-open="showUnsavedProfileChangesModal"
        type="warning"
        title="Tienes cambios sin guardar"
        message="Modificaste datos del perfil, contraseÃ±a o imagen. Â¿Quieres guardar estos cambios antes de salir?"
        confirm-text="Guardar cambios"
        cancel-text="Descartar"
        :is-loading="isSavingProfile"
        @close="discardProfileChanges"
        @confirm="saveAndCloseProfileChanges"
      />
    </Teleport>

    <!-- Excel Modal -->
    <ExelModal
      v-if="isOpenExcelModal"
      :is-open="isOpenExcelModal"
      @close="isOpenExcelModal = false"
    />

    <!-- Open Shift Auto-Prompt -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showScannerPairingModal" class="profile-modal-backdrop" @click.self="showScannerPairingModal = false">
          <div class="scanner-modal">
            <div class="pm-header">
              <div class="excel-modal-title-wrap">
                <div class="excel-icon-badge">
                  <QrCodeIcon class="w-5 h-5" />
                </div>
                <h3 class="pm-title">Vincular escaner movil</h3>
              </div>
              <button class="pm-close" @click="showScannerPairingModal = false">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <div class="scanner-body">
              <p class="scanner-instructions">
                Escanea este codigo con tu celular para vincular el escaner a esta sesion.
              </p>

              <div class="scanner-qr-box">
                <qrcode-vue
                  :value="scannerSessionId"
                  :size="260"
                  level="M"
                  render-as="svg"
                />
              </div>

              <p class="scanner-session-id">{{ scannerSessionId }}</p>
            </div>

            <div class="pm-footer">
              <AppButton variant="outline" @click="showScannerPairingModal = false">Cerrar</AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue';
import Sidebar from './Sidebar.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import { useSalesStore } from '@/stores/sales.store';
import { useProductStore } from '@/stores/product.store';
import { useShiftsStore } from '@/stores/shifts.store';
import type { Product } from '@/stores/product.store';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import { useSnackbar } from '@/composables/useSnackbar';
import { useChangePassword } from '@/composables/useChangePassword';
import apiClient from '@/services/api';
import type { UserProfileResponse } from '@/services/auth.service';
import type Pusher from 'pusher-js';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';

const SalesModal = defineAsyncComponent(() => import('@/components/SalesModal.vue'));
const ExelModal = defineAsyncComponent(() => import('@/components/ExcelModal.vue'));
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'));

const salesStore = useSalesStore();
const productStore = useProductStore();
const shiftsStore = useShiftsStore();
const isSidebarOpen = ref(false);
const showProfileMenu = ref(false);
const showProfileEdit = ref(false);
const profileWrapperRef = ref<HTMLElement | null>(null);

const showNotifications = ref(false);
const notificationWrapperRef = ref<HTMLElement | null>(null);
const showScannerPairingModal = ref(false);
const scannerSessionId = ref('');
const isOpenExcelModal = ref(false);

const { currentUser, logout, updateAvatarUrl } = useAuth();
const router = useRouter();

const showPosActions = computed(() => {
  const role = (currentUser.value?.role || '').toLowerCase();
  return !!currentUser.value && role !== 'admin';
});

const showUnsavedProfileChangesModal = ref(false);

// Formulario de ediciÃ³n de perfil
const profileForm = reactive({
  name: currentUser.value?.name ?? '',
  email: currentUser.value?.email ?? '',
});
const initialProfileSnapshot = reactive({
  name: '',
  email: '',
  avatarUrl: '',
});

/**
 * Sanea el nombre a mostrar: descarta valores que claramente son
 * placeholders de TypeScript/DRF ('string', '', null, undefined)
 * y usa username como fallback.
 */
const INVALID_NAMES = new Set(['string', 'str', 'nombre', 'name', 'null', 'undefined']);
const displayName = computed(() => {
  const raw = currentUser.value?.name ?? '';
  if (raw && !INVALID_NAMES.has(raw.toLowerCase().trim())) return raw;
  return currentUser.value?.username || 'Usuario';
});

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  if(showProfileMenu.value) showNotifications.value = false;
};

const openProfileEdit = () => {
  // Use the sanitized displayName so 'string' placeholder never appears in the modal
  const initialName = displayName.value !== 'Usuario' ? displayName.value : '';
  const initialEmail = currentUser.value?.email || '';
  const initialAvatarUrl = currentUser.value?.avatar_url || '';

  initialProfileSnapshot.name = initialName;
  initialProfileSnapshot.email = initialEmail;
  initialProfileSnapshot.avatarUrl = initialAvatarUrl;

  profileForm.name = initialName;
  profileForm.email = initialEmail;
  // Reset pending state
  profilePhotoPreview.value = initialAvatarUrl;
  profilePendingFile.value  = null;
  pendingRemovePhoto.value  = false;
  showUnsavedProfileChangesModal.value = false;
  showProfileMenu.value = false;
  showProfileEdit.value = true;
};

/** Cierra el modal y resetea el formulario + errores de contraseÃ±a */
const closeProfileEdit = () => {
  profileForm.name = initialProfileSnapshot.name;
  profileForm.email = initialProfileSnapshot.email;
  profilePhotoPreview.value = initialProfileSnapshot.avatarUrl;
  profilePendingFile.value = null;
  pendingRemovePhoto.value = false;
  showUnsavedProfileChangesModal.value = false;
  showProfileEdit.value = false;
  passwordForm.current = '';
  passwordForm.new     = '';
  passwordForm.confirm = '';
  passwordErrors.current = '';
  passwordErrors.new     = '';
  passwordErrors.confirm = '';
};

/** Toggle de la secciÃ³n de contraseÃ±a limpiando errores al plegar */
// â”€â”€ Profile photo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const profilePhotoInputRef    = ref<HTMLInputElement | null>(null);
const profilePhotoPreview     = ref('');   // data-URL for local preview
const profilePendingFile      = ref<File | null>(null); // file waiting to be uploaded on save
const pendingRemovePhoto      = ref(false);              // user pressed "Quitar"

/**
 * Comprime una imagen usando Canvas API.
 * Redimensiona a mÃ¡x maxDimÃ—maxDim y ajusta calidad JPEG hasta quedar â‰¤ maxBytes.
 * Devuelve un File con el resultado comprimido.
 */
const compressImage = (file: File, maxDim = 800, maxBytes = 1 * 1024 * 1024): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen'));
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height / width) * maxDim);
            width  = maxDim;
          } else {
            width  = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Intentar calidades decrecientes hasta quedar bajo maxBytes
        const qualities = [0.85, 0.75, 0.65, 0.50, 0.35];
        let dataUrl = '';
        for (const q of qualities) {
          dataUrl = canvas.toDataURL('image/jpeg', q);
          // dataUrl base64 â‰ˆ 4/3 del tamaÃ±o binario
          const approxBytes = Math.round((dataUrl.length - 22) * 0.75);
          if (approxBytes <= maxBytes) break;
        }

        // Convertir dataURL a File
        const arr    = dataUrl.split(',');
        const mime   = arr[0]!.match(/:(.*?);/)![1]!;
        const bstr   = atob(arr[1]!);
        let n        = bstr.length;
        const u8arr  = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);

        const compressed = new File(
          [u8arr],
          file.name.replace(/\.[^.]+$/, '.jpg'),
          { type: mime, lastModified: Date.now() }
        );
        resolve(compressed);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Called when the user picks a new file.
 * Compresses automatically if > 500 KB, then shows local preview.
 * Does NOT upload to the backend (that happens on "Guardar cambios").
 */
const onProfilePhotoFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    enqueueSnackbar({ type: 'error', title: 'Formato invÃ¡lido', message: 'Por favor selecciona una imagen (JPG, PNG, WEBP).', duration: 3000 });
    if (e.target) (e.target as HTMLInputElement).value = '';
    return;
  }

  // LÃ­mite absoluto: 15 MB
  if (file.size > 15 * 1024 * 1024) {
    enqueueSnackbar({ type: 'error', title: 'Archivo demasiado grande', message: 'El archivo supera 15 MB. Por favor elige una imagen mÃ¡s pequeÃ±a.', duration: 4000 });
    if (e.target) (e.target as HTMLInputElement).value = '';
    return;
  }

  let finalFile = file;

  // Comprimir si pesa mÃ¡s de 500 KB para garantizar que el upload sea fluido
  if (file.size > 500 * 1024) {
    try {
      finalFile = await compressImage(file);
      const ratio = Math.round((1 - finalFile.size / file.size) * 100);
      if (ratio > 10) {
        enqueueSnackbar({
          type: 'info',
          title: 'Imagen optimizada',
          message: `Se optimizÃ³ automÃ¡ticamente (${ratio}% mÃ¡s ligera) sin perder calidad visible.`,
          duration: 3500
        });
      }
    } catch {
      if (file.size > 2 * 1024 * 1024) {
        enqueueSnackbar({ type: 'warning', title: 'No se pudo optimizar', message: 'La imagen es muy pesada. Intenta con otra imagen.', duration: 4000 });
        if (e.target) (e.target as HTMLInputElement).value = '';
        return;
      }
    }
  }

  // Mostrar preview local
  const previewReader = new FileReader();
  previewReader.onload = () => { profilePhotoPreview.value = previewReader.result as string; };
  previewReader.readAsDataURL(finalFile);

  // Guardar archivo para el upload en "Guardar cambios"
  profilePendingFile.value = finalFile;
  pendingRemovePhoto.value = false;

  if (e.target) (e.target as HTMLInputElement).value = '';
};


/**
 * "Quitar" button: clears the preview locally.
 * The actual deletion from the profile is done on save.
 */
const removeProfilePhoto = () => {
  profilePhotoPreview.value   = '';
  profilePendingFile.value    = null;
  pendingRemovePhoto.value    = true;
};
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const isSavingProfile = ref(false);

const hasPendingPasswordChanges = computed(() => (
  !!passwordForm.current || !!passwordForm.new || !!passwordForm.confirm
));

const hasPendingProfileChanges = computed(() => (
  profileForm.name.trim() !== initialProfileSnapshot.name.trim() ||
  profileForm.email.trim() !== initialProfileSnapshot.email.trim()
));

const hasPendingPhotoChanges = computed(() => (
  !!profilePendingFile.value ||
  (pendingRemovePhoto.value && !!initialProfileSnapshot.avatarUrl)
));

const hasUnsavedProfileChanges = computed(() => (
  hasPendingProfileChanges.value ||
  hasPendingPasswordChanges.value ||
  hasPendingPhotoChanges.value
));

const requestCloseProfileEdit = () => {
  if (isSavingProfile.value || isChangingPassword.value) return;

  if (!hasUnsavedProfileChanges.value) {
    closeProfileEdit();
    return;
  }

  showUnsavedProfileChangesModal.value = true;
};

const discardProfileChanges = () => {
  showUnsavedProfileChangesModal.value = false;
  closeProfileEdit();
};

const saveAndCloseProfileChanges = async () => {
  showUnsavedProfileChangesModal.value = false;
  await saveProfile();
};

const saveProfile = async () => {
  isSavingProfile.value = true;

  try {
    // 1. Upload new photo if user picked one
    if (profilePendingFile.value) {
      const result = await updateAvatarUrl(profilePendingFile.value);
      if (result.success && result.url) {
        if (currentUser.value) currentUser.value.avatar_url = result.url;
        enqueueSnackbar({ type: 'success', title: 'Foto actualizada', message: 'Tu foto de perfil se guardÃ³ correctamente.', duration: 3000 });
      } else {
        enqueueSnackbar({ type: 'error', title: 'Error al subir foto', message: result.error || 'No se pudo subir la imagen.', duration: 3500 });
      }
      profilePendingFile.value = null;
    }

    // 2. If user pressed "Quitar", clear avatar on backend
    if (pendingRemovePhoto.value) {
      // Pass null to signal removal (updateAvatarUrl with null or a dedicated composable call)
      // For now, clear locally â€” backend removal can be added when the endpoint is available
      if (currentUser.value) currentUser.value.avatar_url = '';
      pendingRemovePhoto.value = false;
    }

    // 3. Save name & email to backend
    if (currentUser.value && (profileForm.name !== currentUser.value.name || profileForm.email !== currentUser.value.email)) {
      try {
        const response = await apiClient.patch<UserProfileResponse>(
          '/v1/accounts/users/me/',
          {
            name: profileForm.name,
            email: profileForm.email
          }
        );
        
        if (response.success && response.data) {
          // Backend retorna el UserSerializer directamente: {id, username, email, name, role, avatar_url, ...}
          if (currentUser.value) {
            currentUser.value.name = response.data.name;
            currentUser.value.email = response.data.email;
          }
          enqueueSnackbar({
            type: 'success',
            title: 'Perfil actualizado',
            message: 'Tu nombre y email se guardaron correctamente.',
            duration: 3000
          });
        } else {
          enqueueSnackbar({
            type: 'error',
            title: 'Error al actualizar perfil',
            message: response.error || 'No se pudo guardar los cambios.',
            duration: 3500
          });
          return;
        }
      } catch (error: any) {
        console.error('Error updating profile:', error);
        enqueueSnackbar({
          type: 'error',
          title: 'Error de conexiÃ³n',
          message: 'No se pudo conectar al servidor para actualizar el perfil.',
          duration: 3500
        });
        return;
      }
    }

    showProfileEdit.value = false;
  } finally {
    isSavingProfile.value = false;
  }
};

const handleLogout = async () => {
  showProfileMenu.value = false;
  await logout();
  await router.push('/auth/login');
};

const buildScannerSessionId = () => {
  const userId = currentUser.value?.id || 'anon';
  const socketId = globalPusher?.connection?.socket_id || 'pending-socket';
  const ts = Date.now();
  return `nurax-scan:${userId}:${socketId}:${ts}`;
};

const openScannerPairingModal = () => {
  scannerSessionId.value = buildScannerSessionId();
  showScannerPairingModal.value = true;
};

const handleOpenExcelImportEvent = () => {
  isOpenExcelModal.value = true;
};

// Cierra el dropdown al hacer click fuera
const handleClickOutside = (e: MouseEvent) => {
  if (profileWrapperRef.value && !profileWrapperRef.value.contains(e.target as Node)) {
    showProfileMenu.value = false;
  }
  if (notificationWrapperRef.value && !notificationWrapperRef.value.contains(e.target as Node)) {
    showNotifications.value = false;
  }
};

let globalPusher: Pusher | null = null;
let globalChannel: any = null;
let globalChannelName = '';

const initPusher = async () => {
  // Limpiar si ya existe
  if (globalPusher) {
    if (globalChannelName) globalPusher.unsubscribe(globalChannelName);
    globalPusher.disconnect();
    globalPusher = null;
    globalChannel = null;
    globalChannelName = '';
  }

  const userId = currentUser.value?.id;
  if (!userId) {
    console.warn("[Pusher] No se puede iniciar: Usuario no autenticado todavÃ­a.");
    return;
  }

  console.log(`[Pusher] Iniciando conexiÃ³n para usuario: ${userId}`);
  
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
  const { default: PusherClient } = await import('pusher-js');

  globalPusher = new PusherClient(pusherKey, {
    cluster: pusherCluster,
    forceTLS: true
  });

  globalPusher.connection.bind('state_change', (states: any) => {
    console.log(`[Pusher] Estado de conexiÃ³n: ${states.current}`);
  });

  globalPusher.connection.bind('error', (err: any) => {
    console.error('[Pusher] Error de conexiÃ³n:', err);
  });

  globalChannelName = `pos-user-${userId}`;
  globalChannel = globalPusher.subscribe(globalChannelName);

  globalChannel.bind('pusher:subscription_succeeded', () => {
    console.log(`[Pusher] Suscrito con Ã©xito al canal: ${globalChannelName}`);
  });

  globalChannel.bind('INVENTORY_UPDATED', (data: any) => {
    console.log("[Pusher] Â¡Evento INVENTORY_UPDATED recibido!", data);
    productStore.fetchProducts();
  });
  
  // Respaldos
  globalChannel.bind('update', (data: any) => {
    console.log("[Pusher] Fallback 'update' recibido", data);
    productStore.fetchProducts();
  });

  globalChannel.bind('message', (data: any) => {
    if (data?.message === 'update') {
      console.log("[Pusher] Fallback 'message' con update recibido", data);
      productStore.fetchProducts();
    }
  });
};

onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutside);
  window.addEventListener('open-excel-import', handleOpenExcelImportEvent as EventListener);
});

// Vigilar al usuario por si la sesiÃ³n tarda en cargar
watch(currentUser, (newUser, oldUser) => {
  if (newUser && newUser.id !== oldUser?.id) {
    void initPusher();
    
    // Cargas segÃºn el rol del usuario
    if (newUser.role === 'admin') {
      // Admin: cargar solo datos de administraciÃ³n
      // (clientes se cargan en AdminClients.vue cuando navega allÃ¡)
    } else if (newUser.role === 'cliente') {
      // Cliente: cargar datos necesarios para vender y gestionar inventario
      // NOTA: productos se cargan en cada vista (Inventory.vue, etc) con paginaciÃ³n
      // para evitar duplicar peticiones GET
      shiftsStore.fetchShifts();
    }
  }
}, { immediate: true });

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  window.removeEventListener('open-excel-import', handleOpenExcelImportEvent as EventListener);

  if (globalPusher) {
    console.log("[Pusher] Desconectando...");
    if (globalChannelName) globalPusher.unsubscribe(globalChannelName);
    globalPusher.disconnect();
    globalPusher = null;
  }
});

const handleSaleCompleted = async (items: any[]) => {
  items.forEach(item => {
    productStore.decreaseStock(item.id, item.quantity);
  });
  // Emitir evento en el store para que cualquier vista escuchando se actualice
  // Esto evita memory leaks de event listeners globales
  await salesStore.notifySaleCompleted(items);
};

const { enqueueSnackbar } = useSnackbar();

const handleSaleReverted = async (saleId: string | number, items: { id: string | number; quantity: number }[]) => {
  // Call backend to cancel the sale
  const result = await salesStore.cancelSale(saleId);
  
  if (result.success) {
    enqueueSnackbar({
      type: 'success',
      title: 'Venta revertida',
      message: 'La venta ha sido cancelada y el stock restaurado exitosamente.',
      duration: 3000
    });
    // Restore stock locally
    items.forEach(item => {
      const product = productStore.products.find(p => p.id === item.id);
      if (product) {
        product.stock += item.quantity;
      }
    });
    // We should probably explicitly fetch sales so the store gets the new "cancelled" status
    await salesStore.fetchSales();
  } else {
    enqueueSnackbar({
      type: 'error',
      title: 'Error al revertir',
      message: result.error || 'OcurriÃ³ un error inesperado al intentar cancelar la venta.',
      duration: 5000
    });
  }
};

const handleSidebarQuickSell = () => {
  salesStore.openModal();
};

const deleteExcelModal = () =>{
  isOpenExcelModal.value = false;
}

// ===== PASSWORD CHANGE - Usando Composable =====
const { 
  passwordForm, 
  passwordErrors, 
  isChangingPassword, 
  changePassword: submitChangePassword
} = useChangePassword();

const isPasswordReady = computed(() => (
  !!passwordForm.current &&
  !!passwordForm.new &&
  passwordForm.new === passwordForm.confirm
));

defineEmits(['quickSell']);
</script>

<style scoped>
/* === SHELL PRINCIPAL === */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-background-secondary);
  padding: 0 12px 0 0;
  gap: 16px;
  box-sizing: border-box;
}

/* === SIDEBAR FLOTANTE === */
.sidebar-card {
  width: 250px;
  flex-shrink: 0;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: 100vh;
  position: sticky;
  top: 0;
  transition: transform 0.3s ease;
}

/* === COLUMNA DERECHA === */
.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* === TOPBAR CARD === */
.topbar-card {
  background: var(--color-card-fill);
  border-radius: 0;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: calc(100% + 1.25rem);
  margin: 0 -1.25rem 0 -1rem;
  box-sizing: border-box;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 8px;
  flex-shrink: 0;
}

.mobile-menu-btn svg { width: 22px; height: 22px; }
.mobile-menu-btn:hover { background: #f3f4f6; color: #374151; }

/* Search */
.scan-btn-premium {
  background: var(--color-brand-main, #06402b);
  color: white;
  box-shadow: 0 4px 10px rgba(6, 64, 43, 0.2);
}

.scan-btn-premium:hover {
  background: #043020;
  color: white;
  transform: scale(1.05);
}

/* Topbar right */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f9fafb;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  flex-shrink: 0;
}
.icon-btn:hover { background: #f3f4f6; color: #374151; }
.icon-btn svg { width: 18px; height: 18px; }

.topbar-divider {
  width: 1px;
  height: 28px;
  background: #e5e7eb;
}

/* ===== NOTIFICATIONS WRAPPER ===== */
.topbar-notification-wrapper {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444; /* Red */
  border-radius: 50%;
  border: 2px solid #f9fafb; /* Matches button background */
}

/* Redefine NotificationPanel container rules to fit inside topbar */
.notifications-dropdown-container {
  position: absolute;
  top: calc(100% + 12px);
  right: -50px; /* Offset roughly to align properly */
  width: 380px;
  z-index: 200;
  transform-origin: top right;
}

/* Reuse dropdown animation for notifications */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ===== PROFILE WRAPPER ===== */
.topbar-profile-wrapper {
  position: relative;
}

.topbar-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem 0.25rem 0.375rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  transition: background 0.2s;
  font-family: inherit;
}

.topbar-profile:hover,
.topbar-profile.profile-active {
  background: #f3f4f6;
}

.topbar-profile-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.05rem;
}

.topbar-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.topbar-email {
  font-size: 0.7rem;
  color: #6b7280;
  line-height: 1.2;
}

.topbar-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(230, 171, 23, 0.35);
}
.topbar-avatar img { width: 100%; height: 100%; object-fit: cover; }

.profile-chevron {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.chevron-up { transform: rotate(180deg); }

/* ===== PROFILE DROPDOWN ===== */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 250px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 200;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1rem 0.875rem;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(230, 171, 23, 0.35);
}
.dropdown-avatar img { width: 100%; height: 100%; object-fit: cover; }

.dropdown-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.125rem;
  line-height: 1.2;
}

.dropdown-email {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.375rem;
  line-height: 1.2;
}

.dropdown-role-badge {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  background: var(--color-text-main);
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  letter-spacing: 0.2px;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 0;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.375rem 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
  text-align: left;
}
.dropdown-item svg { width: 16px; height: 16px; flex-shrink: 0; color: #6b7280; }
.dropdown-item:hover { background: #f9fafb; }
.dropdown-item:hover svg { color: var(--color-brand-main); }

.dropdown-item-danger { color: #fef2f2; border-color: #dc2626;background: #dc2626; border-width: 1px; }
.dropdown-item-danger svg { color: #fef2f2; }
.dropdown-item-danger:hover { background: #be2020; }
.dropdown-item-danger:hover svg { color: #fef2f2; }

.dropdown-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
}

.dropdown-buttons-container .app-button {
  width: 100%;
}

/* Dropdown animation */
.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

/* === CONTENT CARD === */
.content-card {
  flex: 1;
  background: var(--color-background-secondary);
  border-radius: 0;
  overflow-y: auto;
  box-shadow: none;
  min-height: 0;
  margin-top: 12px;
}

/* === OVERLAY MÃ“VIL === */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 950;
}

/* ===== PROFILE EDIT MODAL ===== */
.profile-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.profile-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.pm-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.pm-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.15s;
}
.pm-close:hover { background: #e5e7eb; }
.pm-close svg { width: 16px; height: 16px; }

.pm-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(230, 171, 23, 0.08) 0%, rgba(31, 41, 55, 0.04) 100%);
  border-bottom: 1px solid #f3f4f6;
}

.pm-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid rgba(230, 171, 23, 0.4);
  flex-shrink: 0;
  position: relative;
}
.pm-avatar img { width: 100%; height: 100%; object-fit: cover; }

/* Clickable avatar with camera overlay */
.pm-avatar-clickable {
  cursor: pointer;
}

.pm-avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(31, 41, 55, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}

.pm-avatar-clickable:hover .pm-avatar-overlay {
  opacity: 1;
}

.pm-avatar-overlay svg {
  width: 20px;
  height: 20px;
  color: white;
}

/* Photo action buttons */
.pm-photo-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.pm-photo-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 0.75rem;
  background: var(--color-brand-main, #06402B);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.pm-photo-btn:hover { background: #0a5c3a; }
.pm-photo-btn svg { width: 14px; height: 14px; }

.pm-photo-btn-remove {
  background: transparent;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.pm-photo-btn-remove:hover { background: #fef2f2; }

.pm-avatar-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.375rem;
}

.pm-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.pm-body > .pm-field {
  max-width: 100%;
}

.pm-profile-section {
  margin-bottom: -0.375rem;
}

.pm-section-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pm-section-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #111827;
}

.pm-section-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
}

.pm-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.pm-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}

.pm-input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  outline: none;
}
.pm-input:focus {
  border-color: var(--color-brand-main, #06402B);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.pm-footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  background: #ffffff;
}

/* ===== PASSWORD CHANGE SECTION ===== */
.pm-password-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fafbfc;
}

.pm-password-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  cursor: default;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  text-align: left;
}

.pm-password-header:hover {
  background: transparent;
}

.pm-password-header:focus {
  outline: none;
}

.pm-password-header-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
}

.pm-password-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #111827;
  stroke-width: 2;
}

.pm-password-label {
  font-weight: 700;
  color: #1f2937;
}

.pm-password-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0;
  padding-top: 0;
}

.pm-password-actions {
  display: flex;
  justify-content: flex-end;
}

/* Error message shown below each password field */
.pm-field-error {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  font-weight: 500;
  color: #dc2626;
  line-height: 1.35;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.pm-field-error::before {
  content: 'âš ';
  font-size: 0.7rem;
}

.pm-btn-cancel {
  padding: 0.5rem 1.125rem;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.pm-btn-cancel:hover { background: #e5e7eb; }

.pm-btn-save {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  border: none;
  background: var(--color-brand-main, #06402B);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.pm-btn-save:hover {
  background: #0a5c3a;
  box-shadow: 0 4px 12px rgba(6, 64, 43, 0.25);
}

/* Modal fade */
.modal-fade-enter-active { transition: opacity 0.2s; }
.modal-fade-leave-active { transition: opacity 0.15s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .profile-modal {
  animation: modalSlideIn 0.2s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .app-shell { padding: 0; gap: 0; }

  .sidebar-card {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    border-radius: 0;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar-card.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .sidebar-overlay { display: block; }
  .main-column { gap: 0; }

  .topbar-card {
    top: 0;
    border-radius: 0;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    padding: 0.75rem 1rem;
    z-index: 100;
    width: calc(100% + 1rem);
    margin: 0 -1rem 0 0;
  }

  .content-card { border-radius: 0; box-shadow: none; overflow-x: hidden; margin-top: 0; }
  .mobile-menu-btn { display: flex; }
  .search-bar { max-width: none; }
  .topbar-profile-text { display: none; }
  .notifications-dropdown-container { right: -10px; max-width: 90vw; }
}

/* ===== EXCEL DROPDOWN BUTTON ===== */
.dropdown-item-excel {
  color: white !important;
  background: var(--color-brand-main, #06402B);
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.15s;
}
.dropdown-item-excel svg {
  color: white !important;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.excel-col-tag {
  font-size: 0.6875rem;
  font-weight: 600;
  background: white;
  border: 1px solid rgba(6, 64, 43, 0.2);
  color: var(--color-brand-main, #06402B);
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-family: 'Courier New', monospace;
}

/* Drop zone */
.excel-drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}
.excel-drop-zone:hover,
.drop-zone-active {
  border-color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.03);
}
.drop-zone-success {
  border-color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.04);
}

.drop-zone-placeholder svg {
  width: 36px;
  height: 36px;
  color: #9ca3af;
  margin: 0 auto 0.625rem;
}
.drop-zone-placeholder p {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.25rem;
}
.drop-zone-placeholder span {
  font-size: 0.75rem;
  color: #9ca3af;
}

.drop-zone-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}
.drop-zone-preview svg {
  width: 28px;
  height: 28px;
  color: var(--color-brand-main, #06402B);
}
.drop-zone-preview p {
  font-size: 0.9375rem;
  color: #111827;
  margin: 0;
}
.drop-zone-preview span {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Preview table */
.excel-preview-table-wrap {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.excel-preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.excel-preview-table th {
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  font-weight: 700;
  color: #374151;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}
.excel-preview-table td {
  padding: 0.5rem 0.75rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}
.excel-preview-table tr:last-child td { border-bottom: none; }
.excel-preview-table code {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  color: var(--color-brand-main, #06402B);
}
.preview-more {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  font-size: 0.75rem;
}

/* Error */
.excel-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #dc2626;
}
.excel-error svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Export tab */
.export-info {
  display: flex;
  gap: 1rem;
}
.export-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(6, 64, 43, 0.05);
  border: 1px solid rgba(6, 64, 43, 0.1);
  border-radius: 12px;
  gap: 0.25rem;
}
.export-stat-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-brand-main, #06402B);
  line-height: 1;
}
.export-stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.export-desc {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}
.export-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

/* Disabled button */
.pm-btn-save:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

</style>

