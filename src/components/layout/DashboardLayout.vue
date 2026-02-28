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

    <!-- Overlay para móvil -->
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

        <!-- Búsqueda -->
        <div class="search-bar">
          <MagnifyingGlassIcon class="search-icon" />
          <input type="text" placeholder="Buscar producto..." class="search-input" />
          <span class="search-kbd">⌘ K</span>
        </div>

        <!-- Área derecha topbar -->
        <div class="topbar-right">
          <!-- Botón Vender (Acceso Global) -->
          <AppButton variant="fill" @click="salesStore.openModal()" style="margin-right: 0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-7 2.5a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            Vender
          </AppButton>

          <!-- Notificaciones -->
          <div class="topbar-notification-wrapper" ref="notificationWrapperRef">
            <button class="icon-btn" title="Notificaciones" @click="toggleNotifications">
              <BellIcon class="w-5 h-5" />
              <!-- Un pequeño badge si hay notificaciones, opcional -->
              <span v-if="productStore.lowStockProducts.length > 0 || productStore.outOfStockProducts.length > 0" class="notification-badge"></span>
            </button>

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
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || currentUser?.username || 'U')}&background=06402b&color=fff`"
                :alt="currentUser?.name || currentUser?.username"
              />
            </div>
              <div class="topbar-profile-text">
                <span class="topbar-name">{{ currentUser?.name || currentUser?.username || 'Usuario' }}</span>
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
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || currentUser?.username || 'U')}&background=06402b&color=fff&size=80`"
                      :alt="currentUser?.name || currentUser?.username"
                    />
                  </div>
                  <div>
                    <p class="dropdown-name">{{ currentUser?.name || currentUser?.username || 'Usuario' }}</p>
                    <p class="dropdown-email">{{ currentUser?.email || '' }}</p>
                    <span class="dropdown-role-badge">
                      {{ currentUser?.role === 'admin' ? 'Administrador' : 'Cliente' }}
                    </span>
                  </div>
                </div>

                <div class="dropdown-divider"></div>

                <!-- Opciones -->
                <div class="dropdown-menu">
                  <button class="dropdown-item" @click="openProfileEdit">
                    <UserCircleIcon class="w-5 h-5" />
                    <span>Editar perfil</span>
                  </button>                  
                </div>

                <div class="dropdown-divider"></div>

                <!-- Excel Import/Export -->
                <div class="dropdown-menu">
                  <!-- usar el botón appButton que es un componente, usar el varian fill -->
                  <AppButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    @click="openExcelModal"
                  >
                    <TableCellsIcon class="w-5 h-5" />
                    <span>Importar / Exportar Excel</span>
                  </AppButton>
                </div>

                <div class="dropdown-divider"></div>

                <!-- Cerrar sesión -->
                <div class="dropdown-menu">
                  <button class="dropdown-item dropdown-item-danger" @click="handleLogout">
                    <ArrowRightOnRectangleIcon class="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
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
        :products="productStore.products"
        @close="salesStore.closeModal()"
        @sale-completed="handleSaleCompleted"
        @sale-reverted="handleSaleReverted"
      />
    </Teleport>

    <!-- Profile Edit Modal -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showProfileEdit" class="profile-modal-backdrop" @click.self="showProfileEdit = false">
          <div class="profile-modal">
            <div class="pm-header">
              <h3 class="pm-title">Editar perfil</h3>
              <button class="pm-close" @click="showProfileEdit = false">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="pm-avatar-section">
              <div class="pm-avatar">
                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name || 'U')}&background=06402b&color=fff&size=80`" :alt="profileForm.name" />
              </div>
              <div>
                <p class="pm-avatar-label">{{ profileForm.name }}</p>
                <span class="dropdown-role-badge">{{ currentUser?.role === 'admin' ? 'Administrador' : 'Cliente' }}</span>
              </div>
            </div>
            <div class="pm-body">
              <div class="pm-field">
                <label class="pm-label">Nombre</label>
                <input v-model="profileForm.name" type="text" class="pm-input" placeholder="Tu nombre completo" />
              </div>
              <div class="pm-field">
                <label class="pm-label">Correo electrónico</label>
                <input v-model="profileForm.email" type="email" class="pm-input" placeholder="correo@empresa.com" />
              </div>
            </div>
            <div class="pm-footer">
              <AppButton variant="outline" @click="showProfileEdit = false">Cancelar</AppButton>
              <AppButton variant="fill" @click="saveProfile">Guardar cambios</AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Excel Modal -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showExcelModal" class="profile-modal-backdrop" @click.self="closeExcelModal">
          <div class="excel-modal">
            <!-- Header -->
            <div class="pm-header">
              <div class="excel-modal-title-wrap">
                <div class="excel-icon-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    <text x="5.5" y="19.5" font-size="7.5" font-weight="800" font-family="Arial" fill="white" letter-spacing="-0.3">XLS</text>
                  </svg>
                </div>
                <h3 class="pm-title">Inventario Excel</h3>
              </div>
              <button class="pm-close" @click="closeExcelModal">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Tabs -->
            <div class="excel-tabs">
              <button
                class="excel-tab"
                :class="{ 'excel-tab-active': excelTab === 'import' }"
                @click="excelTab = 'import'; resetImport()"
              >
                <ArrowDownTrayIcon class="w-4 h-4" />
                Importar
              </button>
              <button
                class="excel-tab"
                :class="{ 'excel-tab-active': excelTab === 'export' }"
                @click="excelTab = 'export'"
              >
                <ArrowUpTrayIcon class="w-4 h-4" />
                Exportar
              </button>
            </div>

            <!-- Import Tab -->
            <div v-if="excelTab === 'import'" class="excel-body">
              <!-- Columnas esperadas -->
              <div class="excel-info-banner">
                <InformationCircleIcon class="w-5 h-5 flex-shrink-0" />
                <div>
                  <p class="excel-info-title">Formato esperado del Excel</p>
                  <p class="excel-info-desc">Las columnas deben llamarse exactamente:</p>
                  <div class="excel-cols-preview">
                    <span v-for="col in expectedColumns" :key="col" class="excel-col-tag">{{ col }}</span>
                  </div>
                </div>
              </div>

              <!-- Upload zone -->
              <div
                class="excel-drop-zone"
                :class="{ 'drop-zone-active': isDragging, 'drop-zone-success': importPreview.length > 0 }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleFileDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="excelFileInput"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style="display:none"
                  @change="handleFileSelect"
                />
                <div v-if="importPreview.length === 0" class="drop-zone-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p>Arrastra tu Excel aquí o <strong>haz clic</strong> para seleccionar</p>
                  <span>.xlsx, .xls, .csv</span>
                </div>
                <div v-else class="drop-zone-preview">
                  <CheckCircleIcon class="w-8 h-8 text-green-500" />
                  <p><strong>{{ importPreview.length }}</strong> productos encontrados</p>
                  <span>{{ importFileName }}</span>
                </div>
              </div>

              <!-- Preview table -->
              <div v-if="importPreview.length > 0" class="excel-preview-table-wrap">
                <table class="excel-preview-table">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in importPreview.slice(0, 5)" :key="i">
                      <td>{{ row.name }}</td>
                      <td><code>{{ row.sku }}</code></td>
                      <td>{{ row.category }}</td>
                      <td>${{ Number(row.price || 0).toFixed(2) }}</td>
                      <td>{{ row.stock }}</td>
                    </tr>
                    <tr v-if="importPreview.length > 5">
                      <td colspan="5" class="preview-more">... y {{ importPreview.length - 5 }} productos más</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="importError" class="excel-error">
                <ExclamationCircleIcon class="w-4 h-4" />
                {{ importError }}
              </div>
            </div>

            <!-- Export Tab -->
            <div v-else class="excel-body">
              <div class="export-info">
                <div class="export-stat">
                  <span class="export-stat-num">{{ productStore.products.length }}</span>
                  <span class="export-stat-label">Productos</span>
                </div>
                <div class="export-stat">
                  <span class="export-stat-num">{{ productStore.products.filter(p => p.image).length }}</span>
                  <span class="export-stat-label">Con imagen URL</span>
                </div>
              </div>
              <p class="export-desc">
                Descarga el inventario completo como <strong>.xlsx</strong>. Incluye nombre, SKU, categoría, precio, stock y URL de imagen (lista para usar con tu servicio de alojamiento).
              </p>
              <div class="export-columns">
                <span v-for="col in expectedColumns" :key="col" class="excel-col-tag">{{ col }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="pm-footer">
              <AppButton variant="outline" @click="closeExcelModal">Cancelar</AppButton>
              <AppButton
                v-if="excelTab === 'import'"
                variant="fill"
                :disabled="importPreview.length === 0"
                @click="confirmImport"
              >
                <ArrowDownTrayIcon class="w-4 h-4" />
                Importar {{ importPreview.length }} productos
              </AppButton>
              <AppButton v-else variant="fill" @click="exportToExcel">
                <ArrowUpTrayIcon class="w-4 h-4" />
                Descargar Excel
              </AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import Sidebar from './Sidebar.vue';
import SalesModal from '@/components/SalesModal.vue';
import NotificationPanel from '@/components/NotificationPanel.vue';
import { useSalesStore } from '@/stores/sales.store';
import { useProductStore } from '@/stores/product.store';
import type { Product } from '@/stores/product.store';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import { useSnackbar } from '@/composables/useSnackbar';
import * as XLSX from 'xlsx';
import AppButton from '@/components/ui/AppButton.vue';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  TableCellsIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';

const salesStore = useSalesStore();
const productStore = useProductStore();
const isSidebarOpen = ref(false);
const showProfileMenu = ref(false);
const showProfileEdit = ref(false);
const profileWrapperRef = ref<HTMLElement | null>(null);

const showNotifications = ref(false);
const notificationWrapperRef = ref<HTMLElement | null>(null);

const { currentUser, logout } = useAuth();
const router = useRouter();

// Formulario de edición de perfil
const profileForm = reactive({
  name: currentUser.value?.name ?? '',
  email: currentUser.value?.email ?? '',
});

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  if(showProfileMenu.value) showNotifications.value = false;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if(showNotifications.value) showProfileMenu.value = false;
};

const openProfileEdit = () => {
  profileForm.name = currentUser.value?.name || currentUser.value?.username || '';
  profileForm.email = currentUser.value?.email || '';
  showProfileMenu.value = false;
  showProfileEdit.value = true;
};

const saveProfile = () => {
  if (currentUser.value) {
    currentUser.value.name = profileForm.name;
    currentUser.value.email = profileForm.email;
  }
  showProfileEdit.value = false;
};

// ===== EXCEL =====
const showExcelModal = ref(false);
const excelTab = ref<'import' | 'export'>('import');
const importPreview = ref<Partial<Product>[]>([]);
const importError = ref('');
const importFileName = ref('');
const isDragging = ref(false);
const excelFileInput = ref<HTMLInputElement | null>(null);

const expectedColumns = ['Nombre', 'SKU', 'Categoría', 'Precio', 'Stock', 'Imagen URL'];

const openExcelModal = () => {
  showProfileMenu.value = false;
  excelTab.value = 'import';
  resetImport();
  showExcelModal.value = true;
};

const closeExcelModal = () => {
  showExcelModal.value = false;
  resetImport();
};

const resetImport = () => {
  importPreview.value = [];
  importError.value = '';
  importFileName.value = '';
  isDragging.value = false;
  if (excelFileInput.value) excelFileInput.value.value = '';
};

const triggerFileInput = () => {
  excelFileInput.value?.click();
};

const parseExcelFile = (file: File) => {
  importError.value = '';
  importFileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        importError.value = 'El archivo no contiene hojas de cálculo.';
        return;
      }
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        importError.value = 'No se pudo leer la hoja de cálculo seleccionada.';
        return;
      }
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (rows.length === 0) {
        importError.value = 'El archivo está vacío o no tiene datos.';
        return;
      }

      // Mapeo flexible de columnas
      const colMap: Record<string, string> = {};
      const firstRow = rows[0];
      Object.keys(firstRow).forEach(k => {
        const kl = k.toLowerCase().trim();
        if (kl.includes('nombre') || kl === 'name') colMap['name'] = k;
        else if (kl.includes('sku') || kl === 'código' || kl === 'codigo') colMap['sku'] = k;
        else if (kl.includes('categ')) colMap['category'] = k;
        else if (kl.includes('precio') || kl === 'price') colMap['price'] = k;
        else if (kl.includes('stock')) colMap['stock'] = k;
        else if (kl.includes('imagen') || kl.includes('image') || kl.includes('url') || kl.includes('foto')) colMap['image'] = k;
      });

      if (!colMap['name'] || !colMap['sku']) {
        importError.value = 'No se encontraron las columnas requeridas (Nombre, SKU).';
        return;
      }

      importPreview.value = rows.map(row => ({
        name: String(row[colMap['name'] as string] ?? '').trim(),
        sku: String(row[colMap['sku'] as string] ?? '').trim(),
        category: colMap['category'] ? String(row[colMap['category'] as string] ?? '').trim() : 'General',
        price: parseFloat(String(row[colMap['price'] as string] ?? 0)) || 0,
        stock: parseInt(String(row[colMap['stock'] as string] ?? 0)) || 0,
        image: colMap['image'] ? String(row[colMap['image'] as string] ?? '').trim() : '',
      })).filter(p => p.name && p.sku);

      if (importPreview.value.length === 0) {
        importError.value = 'No se encontraron productos válidos (requieren Nombre y SKU).';
      }
    } catch (err) {
      importError.value = 'Error al leer el archivo. Asegúrate de que sea un Excel válido.';
    }
  };
  reader.readAsArrayBuffer(file);
};

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) parseExcelFile(file);
};

const handleFileDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) parseExcelFile(file);
};

const confirmImport = () => {
  importPreview.value.forEach(row => {
    const product: Product = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      name: row.name ?? '',
      sku: row.sku ?? '',
      category: row.category ?? 'General',
      price: row.price ?? 0,
      stock: row.stock ?? 0,
      image: row.image ?? '',
    };
    productStore.addProduct(product);
  });
  closeExcelModal();
};

const exportToExcel = () => {
  const data = productStore.products.map(p => ({
    Nombre: p.name,
    SKU: p.sku,
    Categoría: p.category,
    Precio: p.price,
    Stock: p.stock,
    'Imagen URL': p.image ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Ancho de columnas
  ws['!cols'] = [
    { wch: 30 }, { wch: 14 }, { wch: 16 },
    { wch: 10 }, { wch: 8 }, { wch: 60 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `inventario_nurax_${date}.xlsx`);
};

const handleLogout = () => {
  showProfileMenu.value = false;
  logout();
  router.push('/auth/login');
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

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

const handleSaleCompleted = (items: any[]) => {
  items.forEach(item => {
    productStore.decreaseStock(item.id, item.quantity);
  });
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
        productStore.updateStock(item.id, product.stock + item.quantity);
      }
    });
    // We should probably explicitly fetch sales so the store gets the new "cancelled" status
    await salesStore.fetchSales();
  } else {
    enqueueSnackbar({
      type: 'error',
      title: 'Error al revertir',
      message: result.error || 'Ocurrió un error inesperado al intentar cancelar la venta.',
      duration: 5000
    });
  }
};

const handleSidebarQuickSell = () => {
  salesStore.openModal();
};

defineEmits(['quickSell']);
</script>

<style scoped>
/* === SHELL PRINCIPAL === */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
  padding: 12px;
  gap: 16px;
  box-sizing: border-box;
}

/* === SIDEBAR FLOTANTE === */
.sidebar-card {
  width: 250px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: calc(100vh - 24px);
  position: sticky;
  top: 12px;
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
  background: var(--color-card-stats-fill);
  border-radius: 16px;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  position: sticky;
  top: 12px;
  z-index: 100;
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
.search-bar {
  border-radius: 24px;
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 24px;
  height: 24px;
  color: var(--color-brand-main);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 50px;
  padding: 0.5rem 3.5rem 0.5rem 2.25rem;
  border-radius: 24px;
  font-size: 0.875rem;
  color: #374151;
  background: var(--color-background);
  outline: none;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.search-input::placeholder { color: #9ca3af; padding-left: 1rem; }
.search-input:focus {
  border-color: var(--color-brand-main);
  background: white;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.search-kbd {
  position: absolute;
  right: 0.75rem;
  font-size: 0.7rem;
  color: var(--color-brand-main);
  background: var(--color-c);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
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
  border: 2px solid #e5e7eb;
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
  width: 350px;
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
  border: 2px solid rgba(6, 64, 43, 0.15);
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
  color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.08);
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
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Inter', sans-serif;
  text-align: left;
}
.dropdown-item svg { width: 16px; height: 16px; flex-shrink: 0; color: #6b7280; }
.dropdown-item:hover { background: #f9fafb; }
.dropdown-item:hover svg { color: var(--color-brand-main); }

.dropdown-item-danger { color: #dc2626; }
.dropdown-item-danger svg { color: #dc2626; }
.dropdown-item-danger:hover { background: #fef2f2; }
.dropdown-item-danger:hover svg { color: #b91c1c; }

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
  background: #ffffff;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 0;
}

/* === OVERLAY MÓVIL === */
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
  z-index: 1000;
  padding: 1rem;
}

.profile-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
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
  background: linear-gradient(135deg, rgba(6,64,43,0.03) 0%, rgba(6,64,43,0.07) 100%);
  border-bottom: 1px solid #f3f4f6;
}

.pm-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid rgba(6, 64, 43, 0.2);
  flex-shrink: 0;
}
.pm-avatar img { width: 100%; height: 100%; object-fit: cover; }

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
  gap: 1rem;
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
  font-family: 'Inter', sans-serif;
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
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
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
    border-radius: 0 20px 20px 0;
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
  }

  .content-card { border-radius: 0; box-shadow: none; }
  .mobile-menu-btn { display: flex; }
  .search-bar { max-width: none; }
  .topbar-profile-text { display: none; }
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
.dropdown-item-excel:hover {
  background: #0a5c3a;
  box-shadow: 0 3px 10px rgba(6, 64, 43, 0.25);
}

/* ===== EXCEL MODAL ===== */
.excel-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.excel-modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.excel-icon-badge {
  width: 32px;
  height: 32px;
  background: var(--color-brand-main, #06402B);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.excel-icon-badge svg {
  width: 18px;
  height: 18px;
}

/* Tabs */
.excel-tabs {
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
}

.excel-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.excel-tab svg { width: 16px; height: 16px; }
.excel-tab:hover { color: var(--color-brand-main, #06402B); background: white; }
.excel-tab-active {
  color: var(--color-brand-main, #06402B);
  background: white;
  border-bottom-color: var(--color-brand-main, #06402B);
}

/* Body */
.excel-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
}

/* Info banner */
.excel-info-banner {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(6, 64, 43, 0.05);
  border: 1px solid rgba(6, 64, 43, 0.12);
  border-radius: 10px;
}
.excel-info-banner > svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--color-brand-main, #06402B);
  margin-top: 1px;
}
.excel-info-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-brand-main, #06402B);
  margin: 0 0 0.25rem;
}
.excel-info-desc {
  font-size: 0.75rem;
  color: #4b5563;
  margin: 0 0 0.5rem;
}
.excel-cols-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
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
