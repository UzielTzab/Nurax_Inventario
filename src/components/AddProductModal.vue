<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <!-- Header -->
        <header class="modal-header">
          <div class="header-title">
            <PlusCircleIcon class="icon" />
            <h2 class="modal-title">{{ productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h2>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <XMarkIcon class="icon" />
          </button>
        </header>

        <!-- Body -->
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="product-form">
            <div class="product-top-row">
              <!-- Zona de subida de imagen (Izquierda) -->
              <div class="image-upload-section">
                <!-- Dropzone de imagen principal -->
                <label 
                  class="image-dropzone" 
                  :class="{ 'has-image': imagePreview }"
                  for="image"
                >
                  <div v-if="!imagePreview" class="dropzone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span class="dropzone-text">Arrastrar imagen principal o tocar para buscar</span>
                  </div>
                  <img v-else :src="imagePreview" alt="Preview" class="preview-img" />
                  
                  <input
                    type="file"
                    id="image"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="file-input-hidden"
                  />
                  <!-- Botón quitar imagen (si hay imagen) -->
                  <button v-if="imagePreview" type="button" class="remove-img-btn" @click.prevent="removeImage" title="Quitar imagen">
                    <XMarkIcon style="width:16px;height:16px;" />
                  </button>
                </label>
                
                <!-- Botón de cámara (Debajo del dropzone) -->
                <label class="img-btn camera camera-standalone" for="camera">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Cámara</span>
                  <input
                    type="file"
                    id="camera"
                    @change="handleImageUpload"
                    accept="image/*"
                    capture="environment"
                    class="file-input-hidden"
                  />
                </label>
              </div>

              <!-- Formulario de datos (Derecha) -->
              <div class="product-data-section">
                <!-- Name -->
                <div class="form-group">
                  <label for="name">Nombre del Producto *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name" 
                    required 
                    placeholder="Ej: Laptop Gamer X1"
                    class="form-input"
                  />
                </div>

            <!-- Category & SKU -->
            <div class="form-row">
              <div class="form-group">
                <label for="category">Categoría *</label>
                <select id="category" v-model="formData.category" required class="form-input">
                  <option value="">Seleccione una categoría</option>
                  <option :value="1">Laptop</option>
                  <option :value="2">Smartphone</option>
                  <option :value="3">Audio</option>
                  <option :value="4">Wearable</option>
                  <option :value="5">Fotografía</option>
                  <option :value="6">Gaming</option>
                  <option :value="7">Accesorios</option>
                  <option :value="8">Otros</option>
                </select>
              </div>
              <div class="form-group">
                <div class="label-with-tooltip">
                  <label for="sku">SKU / Código</label>
                  <div class="tooltip-container">
                    <QuestionMarkCircleIcon class="tooltip-icon" />
                    <div class="tooltip-content">
                      El SKU (Stock Keeping Unit) es un código identificador único generado automáticamente por el sistema para rastrear este producto en el inventario.
                    </div>
                  </div>
                </div>
                <input 
                  type="text" 
                  id="sku" 
                  v-model="formData.sku" 
                  required 
                  readonly
                  placeholder="SKU-..."
                  class="form-input sku-readonly-input"
                  style="background-color: #f9fafb; cursor: not-allowed; color: #9ca3af;"
                />
              </div>
            </div>

            <!-- Price & Stock -->
            <div class="form-row">
              <div class="form-group">
                <label for="price">Precio ($) *</label>
                <input 
                  type="number" 
                  id="price" 
                  v-model.number="formData.price" 
                  step="0.01" 
                  min="0" 
                  required 
                  placeholder="0.00"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="stock">{{ productToEdit ? 'Stock Actual (Disponible)' : 'Stock Inicial *' }}</label>
                <div class="stock-input-wrapper">
                  <button type="button" class="btn-adjust" @click="adjustStock(-1)" :disabled="formData.stock <= 0">
                    -
                  </button>
                  <input 
                    type="number" 
                    id="stock" 
                    v-model.number="formData.stock" 
                    min="0" 
                    required 
                    placeholder="0"
                    class="form-input stock-input"
                  />
                  <button type="button" class="btn-adjust" @click="adjustStock(1)">
                    +
                  </button>
                </div>
                <!-- Quick add buttons for restocking -->
                <div v-if="productToEdit" class="quick-stock-actions">
                  <button type="button" class="btn-quick-add" @click="adjustStock(5)">+5</button>
                  <button type="button" class="btn-quick-add" @click="adjustStock(10)">+10</button>
                  <button type="button" class="btn-quick-add" @click="adjustStock(50)">+50</button>
                </div>
              </div>
            </div>
            
            <!-- ── PROVEEDOR ── -->
            <div class="form-group">
              <label for="supplier">Proveedor</label>
              <div class="supplier-row">
                <select id="supplier" v-model="formData.supplierId" class="form-input supplier-select">
                  <option value="">Ninguno</option>
                  <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <button
                  type="button"
                  class="btn-new-supplier"
                  @click="showAddSupplierModal = true"
                  title="Crear nuevo proveedor"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span>Nuevo</span>
                </button>
              </div>
              <p v-if="formData.supplierId" class="supplier-hint">
                📦 {{ supplierName }}
              </p>
            </div>
            
              </div> <!-- /product-data-section -->
            </div>     <!-- /product-top-row -->
            <!-- Actions -->
            <div class="form-actions">
              <AppButton variant="outline" type="button" @click="$emit('close')">Cancelar</AppButton>
              <AppButton variant="fill" type="submit">
                {{ productToEdit ? 'Guardar Cambios' : 'Agregar Producto' }}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Sub-modal: Crear Proveedor -->
  <AddSupplierModal
    :is-open="showAddSupplierModal"
    @close="showAddSupplierModal = false"
    @supplier-created="onSupplierCreated"
  />
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import { XMarkIcon, PlusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
import AppButton from '@/components/ui/AppButton.vue';
import AddSupplierModal from '@/components/AddSupplierModal.vue';
import { useSuppliers } from '@/composables/useSuppliers';

interface Product {
  id: string | number;
  name: string;
  category: string | number;
  sku: string;
  stock: number;
  price: string | number;
  image?: string | null;
  supplierId?: string;
}

const props = defineProps<{
  isOpen: boolean;
  productToEdit?: Product | null;
  existingSkus?: string[];
}>();

const emit = defineEmits(['close', 'productAdded', 'productUpdated']);

const { suppliers } = useSuppliers();
const showAddSupplierModal = ref(false);

const formData = reactive({
  name: '',
  category: '',
  sku: '',
  stock: 0,
  price: 0,
  image: '',
  supplierId: '',
});

const imagePreview = ref('');
const rawImageFile = ref<File | null>(null);

const supplierName = computed(() => {
  if (!formData.supplierId) return ''
  return suppliers.value.find(s => s.id === formData.supplierId)?.name ?? ''
});

// Reset or populate form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.productToEdit) {
      Object.assign(formData, {
        name: props.productToEdit.name,
        category: props.productToEdit.category,
        sku: props.productToEdit.sku,
        stock: props.productToEdit.stock,
        price: props.productToEdit.price,
        image: props.productToEdit.image,
        supplierId: props.productToEdit.supplierId ?? '',
      });
      imagePreview.value = props.productToEdit.image || '';
      rawImageFile.value = null; // No new file by default
    } else {
      Object.assign(formData, { name: '', category: '', sku: '', stock: 0, price: 0, image: '', supplierId: '' });
      imagePreview.value = '';
      rawImageFile.value = null;
      generateSKU(); // Auto-generar al crear uno nuevo
    }
  }
});

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      imagePreview.value = result;
      // Guardar el string solo de backup/preview local (depende cómo esté el tipado)
      formData.image = result;
    };
    reader.readAsDataURL(file);
    // Persist real file for FormData
    rawImageFile.value = file;
    // Reset input so the same file can be re-selected
    target.value = '';
  }
};

const removeImage = () => {
  imagePreview.value = '';
  formData.image = '';
  rawImageFile.value = null;
};

const generateSKU = () => {
  // Mejor práctica UX: Secuencial con prefijo inteligente.
  // 1. Buscamos el número más alto actual.
  let maxNumber = 0;
  
  if (props.existingSkus && props.existingSkus.length > 0) {
    props.existingSkus.forEach(sku => {
      // Extraer los últimos dígitos de textos como "SKU-0005"
      const match = sku.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });
  }
  
  // 2. Incrementamos en 1 y rellenamos con ceros (ej. 0001)
  const nextNumber = maxNumber + 1;
  const zeroPadded = nextNumber.toString().padStart(4, '0');
  
  // 3. Asignamos el nuevo SKU secuencial
  formData.sku = `SKU-${zeroPadded}`;
};

const adjustStock = (amount: number) => {
  const newValue = (formData.stock || 0) + amount;
  if (newValue >= 0) formData.stock = newValue;
};

/** Called when AddSupplierModal successfully creates a supplier */
const onSupplierCreated = (supplierId: string) => {
  formData.supplierId = supplierId;
};

const handleSubmit = () => {
  if (props.productToEdit) {
    const updatedProduct: any = {
      ...props.productToEdit,
      name: formData.name,
      category: formData.category, // Debe ser el ID numérico si viene mapeado, de momento se manda 'Laptop', se ajustará en store o backend fallback
      sku: formData.sku,
      stock: formData.stock,
      price: formData.price,
      // Pass real file so Store knows to use FormData
      imageFile: rawImageFile.value,
      supplierId: formData.supplierId,
    };
    emit('productUpdated', updatedProduct);
  } else {
    const newProduct: any = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      price: formData.price,
      imageFile: rawImageFile.value,
      supplierId: formData.supplierId,
    };
    emit('productAdded', newProduct);
  }
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
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

/* Header */
.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var( --color-background);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-brand-main, #06402B);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.icon {
  width: 24px;
  height: 24px;
}

.icon-small {
  width: 20px;
  height: 20px;
}

.close-btn {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #111827;
}

/* Body & Form */
.modal-body {
  padding: 1.5rem;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #F9FAFB;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-brand-main);
  background: white;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button .form-input {
  flex: 1;
}

.btn-icon {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 0.75rem;
  cursor: pointer;
  color: #4B5563;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #E5E7EB;
  color: #111827;
}

/* Supplier row */
.supplier-row {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.supplier-select {
  flex: 1;
}

.btn-new-supplier {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 0.875rem;
  background: rgba(6, 64, 43, 0.07);
  color: var(--color-brand-main, #06402B);
  border: 1.5px solid rgba(6, 64, 43, 0.2);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: inherit;
  flex-shrink: 0;
}

.btn-new-supplier svg {
  width: 16px;
  height: 16px;
}

.btn-new-supplier:hover {
  background: rgba(6, 64, 43, 0.13);
  border-color: rgba(6, 64, 43, 0.4);
}

.supplier-hint {
  font-size: 0.78rem;
  color: var(--color-brand-main, #06402B);
  margin: 0;
  font-weight: 500;
}

/* Grid layout para imagen + form */
.product-top-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .product-top-row {
    grid-template-columns: 160px 1fr;
  }
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-data-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Fix CSS de los selectores para la flecha */
select.form-input {
  /* Eliminar la apariencia nativa y añadir la flecha SVG garantiza padding correcto */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.2rem;
  padding-right: 2.5rem; /* Ajuste crítico: espacio para la flecha */
  background-color: #F9FAFB;
}

select.form-input:focus {
  background-color: white;
}

/* Image Dropzone Nuevo Estilo */
.image-dropzone {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 2px dashed #D1D5DB;
  background-color: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.image-dropzone:hover {
  border-color: var(--color-brand-main, #06402B);
  background-color: rgba(6, 64, 43, 0.03);
}

.image-dropzone.has-image {
  border-style: solid;
  border-color: transparent;
  background: black; /* fondo en caso de imagenes transparentes */
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  gap: 0.5rem;
  color: #6B7280;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #9CA3AF;
  margin-bottom: 0.25rem;
}

.image-dropzone:hover .upload-icon {
  color: var(--color-brand-main, #06402B);
}

.dropzone-text {
  font-size: 0.75rem;
  line-height: 1.2;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Botones de imagen */
.img-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #D1D5DB;
  background: #F9FAFB;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  user-select: none;
}

.img-btn svg {
  width: 18px;
  height: 18px;
  color: inherit;
}

.img-btn.camera-standalone {
  background: white;
  color: var(--color-brand-main, #06402B);
  border-color: var(--color-brand-main, #06402B);
}

.img-btn.camera-standalone:hover {
  background: rgba(6, 64, 43, 0.05);
}

/* visually hidden real input */
.file-input-hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  font-size: 0;
}



.remove-img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.55);
  border: none;
  border-radius: 50%;
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-img-btn:hover {
  background: rgba(0,0,0,0.75);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Stock Adjustments */
.stock-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stock-input {
  text-align: center;
  font-weight: 600;
}

.btn-adjust {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-adjust:hover:not(:disabled) {
  background: #F3F4F6;
  border-color: #9CA3AF;
  color: #111827;
}

.btn-adjust:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F9FAFB;
}

.quick-stock-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-quick-add {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid #BFDBFE;
  background: #EFF6FF;
  color: #1D4ED8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quick-add:hover {
  background: #DBEAFE;
  border-color: #2e8b57;
}

/* Tooltip styles */
.label-with-tooltip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.label-with-tooltip label {
  margin-bottom: 0;
}
.tooltip-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
}
.tooltip-icon {
  width: 18px;
  height: 18px;
  color: #9CA3AF;
  transition: color 0.2s;
}
.tooltip-container:hover .tooltip-icon {
  color: var(--color-brand-main, #06402B);
}
.tooltip-content {
  position: absolute;
  bottom: 125%;
  right: -10px;
  transform: translateY(10px);
  background: #1F2937;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  width: 250px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: none;
  z-index: 50;
}
.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 14px;
  border-width: 6px;
  border-style: solid;
  border-color: #1F2937 transparent transparent transparent;
}
.tooltip-container:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.sku-readonly-input::placeholder {
  color: #d1d5db;
}
</style>
