<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <!-- Header -->
        <header class="modal-header">
          <div class="header-title">
            <PlusCircleIcon class="icon" />
            <h2 class="modal-title">Agregar Nuevo Producto</h2>
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
                <label for="stock">Stock Inicial *</label>
                <input 
                  type="number" 
                  id="stock" 
                  v-model.number="formData.stock" 
                  min="0" 
                  required 
                  placeholder="0"
                  class="form-input"
                />
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
              <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
              <button type="submit" class="btn-save">
                <PlusIcon class="icon-small" />
                Agregar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { XMarkIcon, PlusCircleIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

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
}>();

const emit = defineEmits(['close', 'productAdded']);

const formData = reactive({
  name: '',
  category: '',
  sku: '',
  stock: 0,
  price: 0,
  image: ''
});

const imagePreview = ref('');

// Reset form when modal closes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
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
  const randomNum = Math.floor(Math.random() * 90000) + 10000;
  formData.sku = `SKU-${randomNum}`;
};

const handleSubmit = () => {
  const newProduct: Product = {
    id: Date.now().toString(),
    name: formData.name,
    category: formData.category,
    sku: formData.sku,
    stock: formData.stock,
    price: formData.price,
    image: formData.image || 'https://via.placeholder.com/150'
  };

  emit('productAdded', newProduct);
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
  color: #10B981;
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
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #F9FAFB;
}

.form-input:focus {
  outline: none;
  border-color: #10B981;
  background: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  background: #EDFDF5;
  color: #059669;
  border: 1px solid #A7F3D0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.file-input::-webkit-file-upload-button:hover {
  background: #D1FAE5;
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
  background: white;
  border: 1px solid #D1D5DB;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #F9FAFB;
  border-color: #9CA3AF;
}

.btn-save {
  padding: 0.75rem 1.5rem;
  background: #10B981; /* Green brand color */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save:hover {
  background: #059669;
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
</style>
