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
                  <option value="Laptop">Laptop</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearable">Wearable</option>
                  <option value="Fotografía">Fotografía</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="form-group">
                <label for="sku">SKU / Código *</label>
                <div class="input-with-button">
                  <input 
                    type="text" 
                    id="sku" 
                    v-model="formData.sku" 
                    required 
                    placeholder="SKU-00000"
                    class="form-input"
                  />
                  <button type="button" @click="generateSKU" class="btn-icon" title="Generar SKU">
                    <ArrowPathIcon class="icon" />
                  </button>
                </div>
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

            <!-- Image -->
            <div class="form-group">
              <label for="image">Imagen del Producto</label>
              <input 
                type="file" 
                id="image" 
                @change="handleImageUpload" 
                accept="image/*"
                class="file-input"
              />
              <p class="help-text">Selecciona una imagen de tu dispositivo</p>
            </div>
            
            <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
            </div>

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
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { XMarkIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}

const props = defineProps<{
  isOpen: boolean;
  productToEdit?: Product | null;
  existingSkus?: string[];
}>();

const emit = defineEmits(['close', 'productAdded', 'productUpdated']);

const formData = reactive({
  name: '',
  category: '',
  sku: '',
  stock: 0,
  price: 0,
  image: ''
});

const imagePreview = ref('');

// Reset or populate form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.productToEdit) {
      // Edit Mode
      Object.assign(formData, {
        name: props.productToEdit.name,
        category: props.productToEdit.category,
        sku: props.productToEdit.sku,
        stock: props.productToEdit.stock,
        price: props.productToEdit.price,
        image: props.productToEdit.image
      });
      imagePreview.value = props.productToEdit.image;
    } else {
      // Add Mode
      Object.assign(formData, {
        name: '',
        category: '',
        sku: '',
        stock: 0,
        price: 0,
        image: ''
      });
      imagePreview.value = '';
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
      formData.image = result;
    };
    reader.readAsDataURL(file);
  }
};

const generateSKU = () => {
  let unique = false;
  let attempts = 0;
  let candidate = '';

  while (!unique && attempts < 10) {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    candidate = `SKU-${randomNum}`;
    
    // Check if it exists in the provided list
    // If editing, the current product's SKU is allowed (though we are generating a NEW one, so we should probably ensure it's different from OTHERS)
    // But usually generating a new SKU means we want a brand new one.
    if (props.existingSkus && props.existingSkus.includes(candidate)) {
      attempts++;
    } else {
      unique = true;
    }
  }

  if (unique) {
    formData.sku = candidate;
  } else {
    // Fallback or error if we couldn't find one (highly unlikely space is 90k)
    console.warn('Could not generate unique SKU after 10 attempts');
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // Try larger range
    formData.sku = `SKU-${randomNum}`;
  }
};

const adjustStock = (amount: number) => {
  const newValue = (formData.stock || 0) + amount;
  if (newValue >= 0) {
    formData.stock = newValue;
  }
};

const handleSubmit = () => {
  if (props.productToEdit) {
    // Update existing product
    const updatedProduct: Product = {
      ...props.productToEdit,
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      price: formData.price,
      image: formData.image || props.productToEdit.image
    };
    emit('productUpdated', updatedProduct);
  } else {
    // Add new product
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      price: formData.price,
      image: formData.image || ''
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
}

.form-input:focus {
  outline: none;
  border-color: var(--color-brand-main, #06402B);
  background: white;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
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

.file-input {
  font-size: 0.875rem;
  color: #6B7280;
}

.file-input::-webkit-file-upload-button {
  background: rgba(6, 64, 43, 0.06);
  color: var(--color-brand-main, #06402B);
  border: 1px solid rgba(6, 64, 43, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.file-input::-webkit-file-upload-button:hover {
  background: rgba(6, 64, 43, 0.1);
}

.help-text {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin: 0;
}

.image-preview {
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #D1D5DB;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1.5px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.btn-cancel:hover {
  border-color: var(--color-brand-main, #06402B);
  color: var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.04);
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: var(--color-brand-main, #06402B);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
}

.btn-save:hover {
  background: #0a5c3a;
  box-shadow: 0 4px 12px rgba(6, 64, 43, 0.25);
  transform: translateY(-1px);
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
  color: #1E40AF;
}
</style>
