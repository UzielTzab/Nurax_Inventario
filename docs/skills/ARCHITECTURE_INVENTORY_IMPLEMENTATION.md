# 🏗️ ARQUITECTURA DE COMPONENTES - Mejoras de Inventario

**Fecha**: Abril 8, 2026  
**Propósito**: Guía técnica para implementar las mejoras del inventario con estructura de componentes Vue 3  
**Audiencia**: Equipo de Desarrollo Frontend

---

## 📋 ÍNDICE

1. [Estructura de Carpetas](#1-estructura-de-carpetas)
2. [Componentes a Crear/Actualizar](#2-componentes-a-crearactualizar)
3. [Stores Pinia (Estado)](#3-stores-pinia-estado)
4. [Composables](#4-composables)
5. [Services (API)](#5-services-api)
6. [Flujo de Datos](#6-flujo-de-datos)

---

## 1. Estructura de Carpetas

```
src/
├── components/
│   ├── inventory/
│   │   ├── KpiCards.vue                    ← Tarjetas KPI updateadas
│   │   ├── ProductsTable.vue               ← Tabla enriquecida
│   │   ├── StockAdjustmentInput.vue        ← Inline stock edit
│   │   └── ProductsFilters.vue             ← Filtros (Categoría, Proveedor)
│   │
│   ├── modals/
│   │   ├── ExcelImportModal.vue            ← Importar Excel
│   │   ├── ScannerPairingModal.vue         ← QR para escáner
│   │   └── QuickStockAdjustmentModal.vue   ← Modal alternativo para ajuste
│   │
│   ├── sidebar/
│   │   └── Sidebar.vue                     ← Con RBAC actualizado
│   │
│   └── ui/
│       ├── Badge.vue                       ← Para categoría + proveedor
│       └── Button.vue                      ← Ya existe, mantener
│
├── stores/
│   ├── product.store.ts                    ← Actualizar con cálculos KPI
│   ├── inventory.store.ts                  ← NUEVO: Para ajustes de stock
│   └── auth.store.ts                       ← Para roles (RBAC)
│
├── services/
│   ├── products.service.ts                 ← Nuevos endpoints
│   ├── inventory.service.ts                ← NUEVO: Ajustes de stock
│   └── excel.service.ts                    ← NUEVO: Parseo de Excel
│
├── composables/
│   ├── useInventoryFilters.ts              ← Lógica de filtros
│   ├── useStockAdjustment.ts               ← Lógica edición inline
│   └── useScannerPairing.ts                ← Lógica QR
│
└── views/
    └── Inventory.vue                       ← Vista principal

```

---

## 2. Componentes a Crear/Actualizar

### 2.1 **KpiCards.vue** (Actualizar)

**Props:**
```typescript
interface KpiCardsProps {
  products: Product[];
  userRole: 'propietario' | 'gerente' | 'cajero';
}
```

**Computed Values:**
```typescript
// Valor del Inventario
const inventoryValue = computed(() => {
  return products.value.reduce((sum, p) => sum + (p.costo_base * p.stock_actual), 0);
});

// Alertas de Stock
const lowStockCount = computed(() => {
  return products.value.filter(p => p.stock_actual < 5).length;
});

// Productos Activos
const activeProductsCount = computed(() => {
  return products.value.filter(p => p.activo).length;
});

// Visibilidad
const showInventoryValue = computed(() => {
  return ['propietario', 'gerente'].includes(userRole);
});
```

**Template:**
```vue
<template>
  <div class="kpi-grid">
    <!-- Valor Inventario (Propietario/Gerente) -->
    <div v-if="showInventoryValue" class="kpi-card">
      <h3>Valor del Inventario</h3>
      <p class="kpi-value">${{ inventoryValue.toFixed(2) }}</p>
      <p class="kpi-hint">Costo total en stock</p>
    </div>

    <!-- Alertas de Stock -->
    <div class="kpi-card clickable" @click="emit('filter-low-stock')">
      <h3>Alertas de Stock</h3>
      <p class="kpi-value">{{ lowStockCount }}</p>
      <p class="kpi-hint">Menos de 5 unidades</p>
      <span v-if="lowStockCount > 0" class="kpi-badge">!</span>
    </div>

    <!-- Productos Activos -->
    <div class="kpi-card">
      <h3>Productos Activos</h3>
      <p class="kpi-value">{{ activeProductsCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/stores/product.store';

interface Props {
  products: Product[];
  userRole: 'propietario' | 'gerente' | 'cajero';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'filter-low-stock': [];
}>();

const inventoryValue = computed(() => {
  return props.products.reduce((sum, p) => sum + (p.costo_base * p.stock_actual), 0);
});

const lowStockCount = computed(() => {
  return props.products.filter(p => p.stock_actual < 5).length;
});

const activeProductsCount = computed(() => {
  return props.products.filter(p => p.activo).length;
});

const showInventoryValue = computed(() => {
  return ['propietario', 'gerente'].includes(props.userRole);
});
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.kpi-card.clickable {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.kpi-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.kpi-hint {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.kpi-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
```

---

### 2.2 **ProductsTable.vue** (Reescribir - Enriquecida)

**Props & Emits:**
```typescript
interface Props {
  products: Product[];
  isLoading?: boolean;
  userRole: 'propietario' | 'gerente' | 'cajero';
}

interface Emits {
  'new-product': [];
  'edit-product': [Product];
  'delete-product': [Product];
  'adjust-stock': [Product, number];
}
```

**Columnas Principales:**
```vue
<template>
  <table class="products-table">
    <thead>
      <tr>
        <th>PRODUCTO</th>
        <th>CÓDIGO</th>
        <th>PRECIO</th>
        <th>STOCK</th>
        <th>EMPAQUE</th>
        <th>ACCIONES</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <!-- PRODUCTO: Nombre + Badges -->
        <td class="product-cell">
          <div class="product-name">{{ product.nombre }}</div>
          <div class="product-badges">
            <span class="badge badge-category">{{ product.categoria?.nombre }}</span>
            <span class="badge badge-supplier">{{ product.proveedor?.nombre }}</span>
          </div>
        </td>

        <!-- CÓDIGO: Con ícono QR -->
        <td class="codigo-cell">
          <div class="codigo-display">
            <Icon name="qr-code" class="codigo-icon" />
            <span>{{ product.codigo_principal || 'N/A' }}</span>
          </div>
        </td>

        <!-- PRECIO: Venta + Costo (si aplica) -->
        <td class="price-cell">
          <div class="sale-price">${{ product.precio_venta.toFixed(2) }}</div>
          <div v-if="showCostBase" class="cost-price">
            Costo: ${{ product.costo_base.toFixed(2) }}
          </div>
        </td>

        <!-- STOCK: Editable inline + Botones -->
        <td class="stock-cell">
          <StockAdjustmentInput
            :product-id="product.id"
            :current-stock="product.stock_actual"
            @adjust="(newValue) => emit('adjust-stock', product, newValue)"
          />
        </td>

        <!-- EMPAQUE -->
        <td class="empaque-cell">
          {{ product.empaque_principal || 'Unidad' }}
        </td>

        <!-- ACCIONES -->
        <td class="actions-cell">
          <Button
            variant="ghost"
            size="sm"
            icon="pencil"
            @click="emit('edit-product', product)"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="trash"
            @click="emit('delete-product', product)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import StockAdjustmentInput from './StockAdjustmentInput.vue';

const props = defineProps<{
  products: Product[];
  userRole: 'propietario' | 'gerente' | 'cajero';
}>();

const emit = defineEmits<{
  'adjust-stock': [Product, number];
  'edit-product': [Product];
  'delete-product': [Product];
}>();

const showCostBase = computed(() => {
  return ['propietario', 'gerente'].includes(props.userRole);
});
</script>

<style scoped>
.products-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.products-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e5e7eb;
}

.products-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.product-cell {
  font-weight: 600;
  color: #111827;
}

.product-name {
  margin-bottom: 6px;
}

.product-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-category {
  background: #f0fdf4;
  color: #065f46;
}

.badge-supplier {
  background: #f0f9ff;
  color: #0369a1;
}

.codigo-cell {
  font-family: 'Monaco', 'Courier', monospace;
  font-size: 0.875rem;
  color: #374151;
}

.codigo-display {
  display: flex;
  align-items: center;
  gap: 6px;
}

.codigo-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.price-cell {
  text-align: right;
}

.sale-price {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.cost-price {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}

.stock-cell {
  text-align: center;
}

.empaque-cell {
  color: #6b7280;
  font-size: 0.875rem;
}

.actions-cell {
  text-align: right;
}
</style>
```

---

### 2.3 **StockAdjustmentInput.vue** (NUEVO - Editable Inline)

**Props & Emits:**
```typescript
interface Props {
  productId: number;
  currentStock: number;
}

interface Emits {
  adjust: [newValue: number];
}
```

**Componente:**
```vue
<template>
  <div class="stock-container">
    <div v-if="!isEditing" class="stock-display">
      <span class="stock-value" @dblclick="startEditing">
        {{ currentStock }}
      </span>
      <span v-if="!isEditing" class="edit-hint">(doble-clic)</span>
    </div>

    <input
      v-else
      v-model.number="tempValue"
      type="number"
      class="stock-input"
      @keyup.enter="saveAdjustment"
      @keyup.esc="cancelEditing"
      @blur="saveAdjustment"
      autofocus
    />

    <div class="stock-buttons">
      <button class="btn-ghost btn-sm" @click="decrementStock">−</button>
      <button class="btn-ghost btn-sm" @click="incrementStock">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  productId: number;
  currentStock: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  adjust: [value: number];
}>();

const isEditing = ref(false);
const tempValue = ref(props.currentStock);

const startEditing = () => {
  tempValue.value = props.currentStock;
  isEditing.value = true;
};

const saveAdjustment = () => {
  if (tempValue.value !== props.currentStock) {
    emit('adjust', tempValue.value);
  }
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const incrementStock = () => {
  emit('adjust', props.currentStock + 1);
};

const decrementStock = () => {
  emit('adjust', Math.max(0, props.currentStock - 1));
};
</script>

<style scoped>
.stock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.stock-display {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: text;
}

.stock-value {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #111827;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.stock-value:hover {
  background: #f3f4f6;
}

.edit-hint {
  font-size: 0.7rem;
  color: #d1d5db;
  white-space: nowrap;
}

.stock-input {
  width: 60px;
  padding: 6px 8px;
  border: 2px solid #06402b;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  color: #111827;
  font-family: inherit;
}

.stock-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.1);
}

.stock-buttons {
  display: flex;
  gap: 4px;
}

.btn-ghost {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-ghost:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.btn-ghost.btn-sm {
  font-size: 0.75rem;
}
</style>
```

---

### 2.4 **ExcelImportModal.vue** (NUEVO)

**Props & Emits:**
```typescript
interface Props {
  isOpen: boolean;
}

interface Emits {
  close: [];
  import: [products: Product[]];
}
```

**Funcionalidad:**
- Drag-and-drop para Excel/CSV
- Preview de primeros 5 productos
- Validación de columnas
- Envío a API

**Template:**
```vue
<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2>Importar Inventario desde Excel</h2>
        <button @click="emit('close')" class="btn-close">×</button>
      </div>

      <div class="modal-body">
        <!-- Drop Zone -->
        <div
          class="drop-zone"
          :class="{ 'dragging': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            style="display: none"
            @change="handleFileSelect"
          />
          <Icon v-if="preview.length === 0" name="cloud-arrow-up" class="drop-icon" />
          <p v-if="preview.length === 0">Arrastra tu archivo o haz clic</p>
          <span v-if="preview.length === 0">(.xlsx, .xls, .csv)</span>
          
          <div v-else class="drop-success">
            <Icon name="check-circle" class="check-icon" />
            <p><strong>{{ preview.length }}</strong> productos encontrados</p>
          </div>
        </div>

        <!-- Preview Table -->
        <div v-if="preview.length > 0" class="preview-table">
          <table>
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
              <tr v-for="(row, i) in preview.slice(0, 5)" :key="i">
                <td>{{ row.nombre }}</td>
                <td><code>{{ row.sku }}</code></td>
                <td>{{ row.categoria }}</td>
                <td>${{ Number(row.precio_venta || 0).toFixed(2) }}</td>
                <td>{{ row.stock_actual }}</td>
              </tr>
              <tr v-if="preview.length > 5">
                <td colspan="5" class="more-rows">
                  ... y {{ preview.length - 5 }} productos más
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('close')" class="btn btn-outline">Cancelar</button>
        <button
          @click="confirmImport"
          :disabled="preview.length === 0 || isLoading"
          class="btn btn-primary"
        >
          {{ isLoading ? 'Importando...' : `Importar ${preview.length} productos` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  import: [products: any[]];
}>();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const preview = ref<any[]>([]);
const error = ref('');
const isLoading = ref(false);

const expectedColumns = ['Nombre', 'SKU', 'Categoría', 'Precio', 'Stock'];

const handleFileDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) parseFile(file);
};

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) parseFile(file);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const parseFile = (file: File) => {
  error.value = '';
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Validar columnas
      const firstRow = rows[0] as Record<string, any>;
      const hasRequiredColumns = expectedColumns.every(col => col in firstRow);

      if (!hasRequiredColumns) {
        error.value = `El archivo debe tener las columnas: ${expectedColumns.join(', ')}`;
        return;
      }

      preview.value = rows.map((row: any) => ({
        nombre: row.Nombre,
        sku: row.SKU,
        categoria: row.Categoría,
        precio_venta: Number(row.Precio || 0),
        stock_actual: Number(row.Stock || 0),
      }));
    } catch (err) {
      error.value = 'Error al leer el archivo';
    }
  };
  reader.readAsArrayBuffer(file);
};

const confirmImport = async () => {
  isLoading.value = true;
  try {
    // Aquí iría el POST a la API
    emit('import', preview.value);
    preview.value = [];
    emit('close');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.drop-zone.dragging {
  border-color: #06402b;
  background: rgba(6, 64, 43, 0.05);
}

.drop-icon {
  width: 48px;
  height: 48px;
  color: #d1d5db;
  margin: 0 auto 12px;
}

.drop-success {
  text-align: center;
}

.check-icon {
  width: 48px;
  height: 48px;
  color: #10b981;
  margin: 0 auto 12px;
}

.preview-table {
  margin-top: 20px;
  overflow-x: auto;
}

.preview-table table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}

.preview-table th {
  background: #f9fafb;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.preview-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.preview-table code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', monospace;
}

.more-rows {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
}

.error-message {
  margin-top: 12px;
  padding: 12px;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-outline {
  background: #f3f4f6;
  color: #374151;
}

.btn-primary {
  background: #06402b;
  color: white;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

---

### 2.5 **ScannerPairingModal.vue** (NUEVO)

**Props & Emits:**
```typescript
interface Props {
  isOpen: boolean;
  sessionId: string;
}

interface Emits {
  close: [];
}
```

**Componente (Simplificado):**
```vue
<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h2>Vincular Escáner Móvil</h2>
        <button @click="emit('close')" class="btn-close">×</button>
      </div>

      <div class="modal-body">
        <p class="instruction">
          Escanea este código QR con tu app móvil para vincular el escáner
        </p>

        <div class="qr-container">
          <canvas ref="qrCanvas" class="qr-code" />
        </div>

        <div class="session-info">
          <p class="session-id">{{ sessionId }}</p>
          <p class="hint">Session ID (aparece si el QR no se escanea)</p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emit('close')" class="btn btn-primary">Listo</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import QRCode from 'qrcode';

interface Props {
  isOpen: boolean;
  sessionId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const qrCanvas = ref<HTMLCanvasElement>();

onMounted(async () => {
  if (qrCanvas.value && props.sessionId) {
    try {
      await QRCode.toCanvas(qrCanvas.value, props.sessionId, {
        width: 400,
        margin: 2,
      });
    } catch (err) {
      console.error('Error generando QR:', err);
    }
  }
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 40px 20px;
  text-align: center;
}

.instruction {
  color: #6b7280;
  margin-bottom: 30px;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.qr-code {
  max-width: 100%;
}

.session-info {
  margin-top: 20px;
}

.session-id {
  font-family: 'Monaco', monospace;
  font-size: 0.875rem;
  color: #374151;
  background: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  word-break: break-all;
}

.hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
}

.btn {
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #06402b;
  color: white;
}
</style>
```

---

## 3. Stores Pinia (Estado)

### 3.1 **product.store.ts** (Actualizar)

**Nuevas Computed Properties:**
```typescript
export const useProductStore = defineStore('products', () => {
  // ... estado existente ...

  // ✨ NEW: Cálculo de KPIs
  const inventoryValue = computed(() => {
    return products.value.reduce((sum, p) => sum + (p.costo_base * p.stock_actual), 0);
  });

  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock_actual < 5);
  });

  const activeProducts = computed(() => {
    return products.value.filter(p => p.activo);
  });

  return {
    products,
    inventoryValue,
    lowStockProducts,
    activeProducts,
    // ... otros métodos ...
  };
});
```

### 3.2 **inventory.store.ts** (NUEVO)

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api/client';

export const useInventoryStore = defineStore('inventory', () => {
  const adjustments = ref<StockAdjustment[]>([]);
  const isLoading = ref(false);

  const adjustStock = async (
    productId: number,
    newStock: number,
    oldStock: number
  ) => {
    const cantidad = newStock - oldStock;
    
    try {
      isLoading.value = true;
      const response = await apiClient.post('/api/v1/inventory/ajuste-stock/', {
        producto_id: productId,
        cantidad,
        tipo_ajuste: 'AJUSTE',
        motivo: 'Corrección de inventario',
      });

      adjustments.value.push(response.data);
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    adjustments,
    isLoading,
    adjustStock,
  };
});
```

---

## 4. Composables

### 4.1 **useStockAdjustment.ts** (NUEVO)

```typescript
import { ref } from 'vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useInventoryStore } from '@/stores/inventory.store';
import { useProductStore } from '@/stores/product.store';

export function useStockAdjustment() {
  const inventoryStore = useInventoryStore();
  const productStore = useProductStore();
  const { enqueueSnackbar } = useSnackbar();

  const saveStockAdjustment = async (
    productId: number,
    newStock: number
  ) => {
    const product = productStore.products.find(p => p.id === productId);
    if (!product) return;

    const oldStock = product.stock_actual;

    try {
      await inventoryStore.adjustStock(productId, newStock, oldStock);
      product.stock_actual = newStock;

      enqueueSnackbar({
        type: 'success',
        message: `✓ Stock ajustado a ${newStock}`,
        duration: 2000,
      });
    } catch (err) {
      enqueueSnackbar({
        type: 'error',
        message: 'Error al ajustar stock',
      });
      throw err;
    }
  };

  return {
    saveStockAdjustment,
  };
}
```

---

## 5. Services (API)

### 5.1 **inventory.service.ts** (NUEVO)

```typescript
import apiClient from '@/api/client';

export interface StockAdjustment {
  id: number;
  producto_id: number;
  cantidad: number;
  tipo_ajuste: 'AJUSTE' | 'VENTA' | 'COMPRA';
  motivo: string;
  usuario_id: number;
  fecha: string;
}

class InventoryService {
  async adjustStock(data: {
    producto_id: number;
    cantidad: number;
    tipo_ajuste: string;
    motivo: string;
  }): Promise<StockAdjustment> {
    const response = await apiClient.post('/api/v1/inventory/ajuste-stock/', data);
    return response.data;
  }

  async getAdjustments(filters?: any) {
    const response = await apiClient.get('/api/v1/inventory/ajustes/', { params: filters });
    return response.data;
  }

  async batchImportProducts(products: any[]) {
    const response = await apiClient.post('/api/v1/products/batch-import/', {
      products,
    });
    return response.data;
  }
}

export default new InventoryService();
```

---

## 6. Flujo de Datos

### 6.1 **Flujo Ajuste Rápido de Stock**

```
Usuario hace doble-clic en campo Stock
        ↓
StockAdjustmentInput entra en modo edición
        ↓
Usuario escribe nuevo valor y presiona ENTER
        ↓
emit('adjust', newValue) → ProductsTable
        ↓
ProductsTable emite: @adjust-stock="(product, value) => ..."
        ↓
Vista Inventory llama: useStockAdjustment().saveStockAdjustment(id, value)
        ↓
inventory.service.adjustStock(productId, cantidad) → POST /api/v1/inventory/ajuste-stock/
        ↓
Backend crea registro MOVIMIENTO_INVENTARIO
        ↓
Frontend actualiza product.stock_actual localmente
        ↓
Pusher notifica a otros usuarios en tiempo real
        ↓
Toast: "✓ Stock ajustado a X"
```

---

## ✅ Checklist de Implementación

- [ ] KpiCards.vue actualizado con nuevas computed properties
- [ ] ProductsTable.vue reescrito con columnas enriquecidas
- [ ] StockAdjustmentInput.vue creado y funcional
- [ ] ExcelImportModal.vue creado con drag-drop
- [ ] ScannerPairingModal.vue creado con QR
- [ ] ProductsFilters.vue creado con Categoría + Proveedor
- [ ] product.store.ts actualizado con KPI computed
- [ ] inventory.store.ts creado para ajustes
- [ ] auth.store.ts tiene información de rol
- [ ] inventory.service.ts implementado
- [ ] useStockAdjustment.ts composable creado
- [ ] RBAC en Sidebar.vue actualizado
- [ ] Topbar botones: Vender + Escáner
- [ ] Rutas API backend creadas/verificadas
- [ ] Testing en múltiples roles

---

**Documento creado**: Abril 8, 2026  
**Versión**: 1.0  
**Status**: 📋 Listo para implementación técnica
