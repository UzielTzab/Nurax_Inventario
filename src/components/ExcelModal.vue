<script setup lang="ts">
import type { Product } from '@/stores/product.store';
import { useProductStore } from '@/stores/product.store';
import { ref } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline';

const productStore = useProductStore();
const excelTab = ref<'Import' | 'Export'>('Import');
const importPreview = ref<Partial<Product>[]>([]);
const importError = ref('');
const importFileName = ref('');
const isDragging = ref(false);
const excelFileInput = ref<HTMLInputElement | null>(null);
const expectedColumns = ['Nombre', 'SKU', 'Categoría', 'Precio', 'Stock', 'Imagen URL'];

const emit = defineEmits(['close', 'confirm']);
const props = defineProps<{
  isOpen: boolean;
}>();

const triggerFileInput = () => {
  excelFileInput.value?.click();
};

const closeExcelModal = () => {
  emit('confirm');
  emit('close');
  resetImport();
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

const resetImport = () => {
  importPreview.value = [];
  importError.value = '';
  importFileName.value = '';
  isDragging.value = false;
  if (excelFileInput.value) excelFileInput.value.value = '';
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

const exportToExcel = async () => {
  const XLSX = await import('xlsx');
  const data = productStore.products.map(p => ({
    Nombre: p.name,
    SKU: p.sku,
    Categoría: p.category,
    Precio: p.price,
    Stock: p.stock,
    'Imagen URL': p.image ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 30 }, { wch: 14 }, { wch: 16 },
    { wch: 10 }, { wch: 8 }, { wch: 60 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `inventario_nurax_${date}.xlsx`);
};

const parseExcelFile = (file: File) => {
  importError.value = '';
  importFileName.value = file.name;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const XLSX = await import('xlsx');
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
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" @click="$emit('close')" class="profile-modal-backdrop">
        <div class="excel-modal" @click.stop>
          <!-- Header -->
          <div class="pm-header">
            <div class="excel-modal-title-wrap">
              <div class="excel-icon-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="white" />
                  <path d="M14 2v6h6" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  <text x="5.5" y="19.5" font-size="7.5" font-weight="800" font-family="Arial" fill="white" style="letter-spacing: -0.3px;">XLS</text>
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
              :class="{ 'excel-tab-active': excelTab === 'Import' }"
              @click="excelTab = 'Import'; resetImport()"
            >
              <ArrowDownTrayIcon class="w-4 h-4" />
              Importar
            </button>
            <button
              class="excel-tab"
              :class="{ 'excel-tab-active': excelTab === 'Export' }"
              @click="excelTab = 'Export'"
            >
              <ArrowUpTrayIcon class="w-4 h-4" />
              Exportar
            </button>
          </div>

          <!-- Import Tab -->
          <div v-if="excelTab === 'Import'" class="excel-body">
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
                style="display: none"
                @change="handleFileSelect"
              />
              <div v-if="importPreview.length === 0" class="drop-zone-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                    <th>Nombre</th>
                    <th>SKU</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
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
              v-if="excelTab === 'Import'"
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
</template>

<style scoped>
/* ===== MODAL BACKDROP ===== */
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

/* ===== MODAL HEADER ===== */
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

/* ===== MODAL FOOTER ===== */
.pm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
}

/* ===== TITLE WRAPPER ===== */
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
  color: white;
}

/* ===== TABS ===== */
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
  font-family: inherit;
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

/* ===== BODY ===== */
.excel-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
}

/* ===== INFO BANNER ===== */
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

/* ===== DROP ZONE ===== */
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

/* ===== PREVIEW TABLE ===== */
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

/* ===== ERROR MESSAGE ===== */
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

/* ===== EXPORT TAB ===== */
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

/* ===== MODAL ANIMATIONS ===== */
.modal-fade-enter-active { transition: opacity 0.2s; }
.modal-fade-leave-active { transition: opacity 0.15s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active {
  animation: modalSlideIn 0.2s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
