<template>
  <div>
    <div class="wizard-header">
      <h2>Importar Productos (Opcional)</h2>
      <p>Sube tu archivo Excel con productos. Si no tienes, puedes agregar manualmente después.</p>
    </div>

    <div class="wizard-body">
      <div v-if="globalError" class="error-banner">
        {{ globalError }}
      </div>

      <!-- Área Drag-Drop -->
      <div
        class="drag-drop-area"
        :class="{ active: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleFileDrop"
      >
        <div class="drag-drop-icon">📊</div>
        <p class="drag-drop-text">Arrastra tu Excel aquí</p>
        <p class="drag-drop-hint">o haz clic para seleccionar</p>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          style="display: none"
          @change="handleFileSelect"
        />
      </div>

      <!-- Archivo Seleccionado -->
      <div v-if="selectedFile" class="file-selected">
        <span class="file-selected-icon">✓</span>
        <span class="file-selected-name">{{ selectedFile.name }}</span>
        <button class="file-remove-btn" @click="removeFile" title="Eliminar archivo">
          ✕
        </button>
      </div>

      <!-- Preview de Datos -->
      <div v-if="previewData.length > 0" class="form-group">
        <label class="form-label">Vista Previa de Datos</label>
        <ExcelPreview :data="previewData" :columns="previewColumns" />
      </div>

      <!-- Mapeo de Columnas -->
      <div v-if="previewData.length > 0" class="form-group">
        <label class="form-label">Mapeo de Columnas (arrastra para asociar)</label>
        <div class="mappings-container">
          <div v-for="excelCol in Object.keys(columnMappings)" :key="excelCol" class="mapping-item">
            <span class="mapping-label">{{ excelCol }}:</span>
            <select v-model="(columnMappings as any)[excelCol]" class="form-control">
              <option value="">—</option>
              <option v-for="col in previewColumns" :key="col" :value="col">
                {{ col }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ExcelPreview from './ExcelPreview.vue';
import { onboardingService } from '@/services/onboarding.service';

interface Props {
  initialData?: any;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const globalError = ref('');
const previewData = ref<any[]>([]);
const previewColumns = ref<string[]>([]);
const columnMappings = ref({
  name: 'name',
  sku: 'sku',
  category_name: 'category',
  stock: 'stock',
  price: 'price',
  supplier_name: 'supplier'
});

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.[0]) {
    processFile(files[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    processFile(input.files[0]);
  }
};

const processFile = async (file: File) => {
  globalError.value = '';
  selectedFile.value = file;

  const { products, columns, error } = await onboardingService.parseExcelFile(file);

  if (error) {
    globalError.value = error;
    previewData.value = [];
    previewColumns.value = [];
    return;
  }

  previewData.value = products;
  previewColumns.value = columns;

  // Auto-mapear columnas
  const autoMappings = {
    name: columns.find(c => c.toLowerCase().includes('nombre')) || 'name',
    sku: columns.find(c => c.toLowerCase().includes('sku')) || 'sku',
    category_name: columns.find(c => c.toLowerCase().includes('categoria')) || '',
    stock: columns.find(c => c.toLowerCase().includes('stock')) || '',
    price: columns.find(c => c.toLowerCase().includes('precio')) || '',
    supplier_name: columns.find(c => c.toLowerCase().includes('proveedor')) || ''
  };

  Object.assign(columnMappings.value, autoMappings);

  emit('update', {
    excelFile: file,
    products,
    columnMappings: columnMappings.value
  });
};

const removeFile = () => {
  selectedFile.value = null;
  previewData.value = [];
  previewColumns.value = [];
  globalError.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('update', {
    excelFile: null,
    products: [],
    columnMappings: columnMappings.value
  });
};

const clickInput = () => {
  fileInput.value?.click();
};

defineExpose({
  clickInput
});
</script>

<style scoped>
@import '@/styles/onboarding.css';

.mappings-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mapping-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mapping-label {
  min-width: 100px;
  font-weight: 500;
  color: var(--color-wizard-text-dark);
}

.mapping-item .form-control {
  flex: 1;
}
</style>
