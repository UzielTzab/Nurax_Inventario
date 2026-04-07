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
                  <AppInput
                    id="name"
                    v-model="formData.name"
                    label="Nombre del Producto"
                    placeholder="Ej: Laptop Gamer X1"
                    required
                  />
                </div>

            <!-- Category & SKU -->
            <div class="form-row">
              <div class="form-group">
                <label for="category">Categoría *</label>
                <div class="category-select-row">
                  <select id="category" v-model="formData.category" required class="form-input">
                    <option value="">Seleccione una categoría</option>
                    <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <AppButton
                    type="button"
                    variant="outline"
                    size="sm"
                    :icon="PlusIcon"
                    iconOnly
                    class="square-icon-button"
                    title="Agregar categoría"
                    @click="showCategoryModal = true"
                  />
                </div>
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
                <div style="display: flex; gap: 8px; align-items: flex-start;">
                  <AppInput
                    style="flex: 1;"
                    id="sku"
                    v-model="formData.sku"
                    placeholder="Escriba o escanee..."
                    hint="Si dejas vacío, autogenerará"
                  />
                  <button type="button" @click="isScanning = true" class="btn-scan" title="Escanear SKU" style="height: 44px; width: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1.5px solid #22c55e; background: #f0fdf4; color: #16a34a; cursor: pointer;">
                    <QrCodeIcon style="width: 20px; height: 20px;" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Cost & Price -->
            <div class="form-row">
              <div class="form-group">
                <AppInput
                  id="baseCost"
                  v-model.number="formData.baseCost"
                  type="number"
                  label="Costo Base ($)"
                  placeholder="0.00"
                  :hint="`Costo para ti: ${formData.baseCost}`"
                  required
                />
              </div>
              <div class="form-group">
                <AppInput
                  id="salePrice"
                  v-model.number="formData.salePrice"
                  type="number"
                  label="Precio de Venta ($)"
                  placeholder="0.00"
                  :hint="`Margen: ${(formData.salePrice - formData.baseCost).toFixed(2)}`"
                  required
                  :class="{ 'input-error': formData.salePrice <= formData.baseCost && formData.salePrice > 0 }"
                />
              </div>
            </div>

            <!-- Stock -->
            <div class="form-row">
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
            </div>
              </div> <!-- /product-data-section -->
            </div>     <!-- /product-top-row -->

            <div class="advanced-toggle">
              <AppButton
                variant="outline"
                size="sm"
                type="button"
                :icon="showAdvanced ? ChevronUpIcon : ChevronDownIcon"
                iconPosition="right"
                @click="toggleAdvanced"
              >
                Opciones avanzadas
              </AppButton>
              <p class="advanced-hint">Codigos y empaques son opcionales.</p>
            </div>

            <div v-if="showAdvanced" class="advanced-sections">
            <!-- ── SECCIÓN EXPANDIBLE: CÓDIGOS ── -->
            <details class="collapsible-section">
              <summary class="collapsible-header">
                <span class="collapsible-title">
                  <TagIcon class="icon-small" />
                  Codigos de producto
                </span>
                <span class="badge-count">{{ formData.productCodes.length }}</span>
              </summary>
              <div class="collapsible-content">
                <p class="section-hint">
                  Usa el tipo que veas impreso en el producto. Si no sabes, elige "EAN-13 (codigo de barras)".
                </p>
                <div class="codes-list">
                  <div v-if="formData.productCodes.length === 0" class="empty-state">
                    <p>No hay códigos agregados. Opcional.</p>
                  </div>
                  <div v-for="(code, idx) in formData.productCodes" :key="idx" class="code-item">
                    <select v-model="code.codeType" class="form-input code-type-select">
                      <option value="ean13">EAN-13 (codigo de barras)</option>
                      <option value="qr">QR (codigo rapido)</option>
                      <option value="upc">UPC (codigo de producto)</option>
                      <option value="shelf_label">Etiqueta de estante</option>
                    </select>
                    <input v-model="code.code" type="text" placeholder="Código..." class="form-input code-value-input" />
                    <button type="button" class="btn-remove" @click="removeCode(idx)" title="Eliminar código">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <AppButton type="button" variant="outline" size="sm" :icon="PlusIcon" @click="addCode">
                  Agregar codigo
                </AppButton>
              </div>
            </details>

            <!-- ── SECCIÓN EXPANDIBLE: EMPAQUES ── -->
            <details class="collapsible-section">
              <summary class="collapsible-header">
                <span class="collapsible-title">
                  <ArchiveBoxIcon class="icon-small" />
                  Empaques y formatos de venta
                </span>
                <span class="badge-count">{{ formData.packagings.length }}</span>
              </summary>
              <div class="collapsible-content">
                <p class="section-hint">
                  Ejemplos: "Caja con 50", "Paquete x6", "Unidad".
                </p>
                <div class="packagings-list">
                  <div v-if="formData.packagings.length === 0" class="empty-state">
                    <p>No hay empaques agregados. Opcional.</p>
                  </div>
                  <div v-for="(pkg, idx) in formData.packagings" :key="idx" class="packaging-item">
                    <input v-model="pkg.name" type="text" placeholder="Nombre del empaque" class="form-input packaging-name-input" />
                    <input v-model.number="pkg.quantityPerUnit" type="number" placeholder="Cantidad" class="form-input packaging-qty-input" min="1" />
                    <button type="button" class="btn-remove" @click="removePackaging(idx)" title="Eliminar empaque">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px;">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <AppButton type="button" variant="outline" size="sm" :icon="PlusIcon" @click="addPackaging">
                  Agregar empaque
                </AppButton>
              </div>
            </details>
            </div>
            <!-- Actions -->
            <div class="form-actions">
              <AppButton variant="outline" type="button" @click="$emit('close')" :disabled="loading">Cancelar</AppButton>
              <AppButton variant="fill" type="submit" :loading="loading">
                {{ productToEdit ? 'Guardar Cambios' : 'Agregar Producto' }}
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Scanner Overlay para AddProduct -->
  <Transition name="fade">
    <div v-if="isScanning" class="modal-overlay" style="z-index: 1050; display: flex; align-items: center; justify-content: center; flex-direction: column;" @click.self="isScanning = false">
       <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 400px; display: flex; flex-direction: column; gap: 1rem; align-items: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
         <h3 style="font-weight: 600; font-size: 1.25rem;">Escanear Código</h3>
         <div style="width: 100%; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #000; position: relative;">
           <qrcode-stream 
             @detect="onDecodeSku"
             @error="onError"
             :formats="barcodeFormats"
             :track="paintOutline"
           ></qrcode-stream>
           <div class="scanner-laser"></div>
         </div>
         <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">Centra el código de barras o QR en la cámara</p>
         <AppButton variant="outline" type="button" @click="isScanning = false" style="width: 100%;">
           <XMarkIcon class="icon" style="width:20px; height:20px; display:inline;" /> Cancelar
         </AppButton>
       </div>
    </div>
  </Transition>

  <!-- Sub-modal: Crear Proveedor -->
  <AddSupplierModal
    :is-open="showAddSupplierModal"
    @close="showAddSupplierModal = false"
    @supplier-created="onSupplierCreated"
  />

  <!-- Sub-modal: Crear Categoría -->
  <Transition name="fade">
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
      <div class="modal-content" style="max-width: 420px;">
        <header class="modal-header">
          <div class="header-title">
            <FolderPlusIcon class="icon" />
            <h2 class="modal-title">Nueva Categoría</h2>
          </div>
          <button class="close-btn" @click="showCategoryModal = false">
            <XMarkIcon class="icon" />
          </button>
        </header>
        <div class="modal-body">
          <div class="form-group">
            <AppInput
              v-model="newCategoryName"
              label="Nombre de la categoría"
              placeholder="Ej: Audio, Cables, Accesorios"
            />
            <p v-if="categoryError" class="category-error">{{ categoryError }}</p>
          </div>
          <div class="form-actions">
            <AppButton variant="outline" type="button" @click="showCategoryModal = false">
              Cancelar
            </AppButton>
            <AppButton
              variant="fill"
              type="button"
              :loading="isCreatingCategory"
              :icon="PlusIcon"
              @click="createCategory"
            >
              Crear categoría
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue';
import {
  XMarkIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  QrCodeIcon,
  TagIcon,
  ArchiveBoxIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  FolderPlusIcon,
} from '@heroicons/vue/24/outline';
import { QrcodeStream } from 'vue-qrcode-reader';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AddSupplierModal from '@/components/AddSupplierModal.vue';
import { useSuppliers } from '@/composables/useSuppliers';
import { useAuth } from '@/composables/useAuth';
import apiClient from '@/services/api';

interface Product {
  id: string | number;
  name: string;
  category: string | number;
  sku: string;
  stock: number;
  baseCost?: string | number;
  salePrice?: string | number;
  price?: string | number; // legacy support
  image?: string | null;
  supplierId?: string;
  supplier?: string | number | null;
  productCodes?: Array<{ codeType: string; code: string }>;
  packagings?: Array<{ name: string; quantityPerUnit: number }>;
}

const props = defineProps<{
  isOpen: boolean;
  productToEdit?: Product | null;
  existingSkus?: string[];
  loading?: boolean;
}>();

const emit = defineEmits(['close', 'productAdded', 'productUpdated']);

const { suppliers, fetchSuppliers } = useSuppliers();
const { currentUser, initSession } = useAuth();
const showAddSupplierModal = ref(false);

const categoriesList = ref<Array<{id: number | string, name: string}>>([]);
const isScanning = ref(false);
const showAdvanced = ref(false);
const showCategoryModal = ref(false);
const newCategoryName = ref('');
const isCreatingCategory = ref(false);
const categoryError = ref('');
const activeStoreId = ref<string | null>(null);

const barcodeFormats = ref<any[]>([
  'qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'
]);

const onError = (err: any) => {
  isScanning.value = false;
  let errMsg = 'Error con la cámara: ';
  if (err.name === 'NotAllowedError') errMsg += 'Permiso denegado.';
  else if (err.name === 'NotFoundError') errMsg += 'No se encontró cámara.';
  else if (err.name === 'NotSupportedError') errMsg += 'Contexto no seguro (HTTPS requerido).';
  else if (err.name === 'NotReadableError') errMsg += 'Cámara en uso.';
  else errMsg += err.message || err.name;
  alert(errMsg);
};

const paintOutline = (detectedCodes: any[], ctx: CanvasRenderingContext2D) => {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();
    ctx.stroke();
  }
};

const onDecodeSku = (detectedCodes: any[]) => {
  if (detectedCodes.length > 0) {
    formData.sku = detectedCodes[0].rawValue;
    // Play bip sound
    const audio = new Audio('/sounds/Fx_Scanning.wav');
    audio.play().catch(e => console.error('Error playing sound:', e));
    isScanning.value = false;
  }
};

const resolveStoreId = async (): Promise<string | null> => {
  if (activeStoreId.value) return activeStoreId.value;

  const fromUser = currentUser.value?.store_profile?.id;
  if (fromUser) {
    activeStoreId.value = String(fromUser);
    return activeStoreId.value;
  }

  try {
    const storesRes = await apiClient.get<any>('/v1/accounts/stores/');
    if (storesRes.success && Array.isArray(storesRes.data) && storesRes.data.length > 0) {
      const active = storesRes.data.find((s: any) => s.active) || storesRes.data[0];
      activeStoreId.value = String(active.id);
      return activeStoreId.value;
    }
  } catch (e) {
    console.error('Error resolving store id:', e);
  }

  return null;
};

const fetchCategories = async () => {
  try {
    const storeId = await resolveStoreId();
    const res = await apiClient.get<any>('/v1/products/categories/', {
      params: storeId ? { store_id: storeId } : undefined,
    });
     if (res.success && res.data) {
       categoriesList.value = res.data.results || res.data;
    }
  } catch(e) {
    console.error("Error fetching categories:", e);
  }
};

const loadSuppliers = async () => {
  try {
    await fetchSuppliers();
  } catch(e) {
    console.error("Error loading suppliers:", e);
  }
};

const createCategory = async () => {
  categoryError.value = '';
  const name = newCategoryName.value.trim();
  if (!name) {
    categoryError.value = 'Escribe un nombre para la categoria.';
    return;
  }

  const storeId = await resolveStoreId();
  if (!storeId) {
    categoryError.value = 'No se encontro la tienda activa.';
    return;
  }

  isCreatingCategory.value = true;
  try {
    const res = await apiClient.post<any>('/v1/products/categories/', {
      name,
      store: storeId,
    });

    if (res.success && res.data) {
      const created = res.data;
      categoriesList.value.push(created);
      formData.category = created.id;
      newCategoryName.value = '';
      showCategoryModal.value = false;
    } else {
      categoryError.value = res.error || 'No se pudo crear la categoria.';
    }
  } catch (e: any) {
    categoryError.value = e?.message || 'Error al crear la categoria.';
  } finally {
    isCreatingCategory.value = false;
  }
};

onMounted(async () => {
  await initSession();
  fetchCategories();
  loadSuppliers();
});

const formData = reactive({
  name: '',
  category: '',
  sku: '',
  stock: 0,
  baseCost: 0,
  salePrice: 0,
  image: '',
  supplierId: '',
  productCodes: [] as Array<{ codeType: string; code: string }>,
  packagings: [] as Array<{ name: string; quantityPerUnit: number }>,
});

const imagePreview = ref('');
const rawImageFile = ref<File | null>(null);



// Reset or populate form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.productToEdit) {
      Object.assign(formData, {
        name: props.productToEdit.name,
        category: props.productToEdit.category,
        sku: props.productToEdit.sku,
        stock: props.productToEdit.stock,
        baseCost: props.productToEdit.baseCost ?? 0,
        salePrice: props.productToEdit.salePrice ?? props.productToEdit.price ?? 0,
        image: props.productToEdit.image,
        supplierId: props.productToEdit.supplierId ?? props.productToEdit.supplier ?? '',
        productCodes: props.productToEdit.productCodes ?? [],
        packagings: props.productToEdit.packagings ?? [],
      });
      imagePreview.value = props.productToEdit.image || '';
      rawImageFile.value = null;
      showAdvanced.value =
        (formData.productCodes?.length ?? 0) > 0 || (formData.packagings?.length ?? 0) > 0;
    } else {
      Object.assign(formData, { 
        name: '', 
        category: '', 
        sku: '', 
        stock: 0, 
        baseCost: 0, 
        salePrice: 0, 
        image: '', 
        supplierId: '',
        productCodes: [],
        packagings: [],
      });
      imagePreview.value = '';
      rawImageFile.value = null;
      generateSKU();
      showAdvanced.value = false;
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

const addCode = () => {
  formData.productCodes.push({ codeType: 'ean13', code: '' });
};

const removeCode = (index: number) => {
  formData.productCodes.splice(index, 1);
};

const addPackaging = () => {
  formData.packagings.push({ name: '', quantityPerUnit: 1 });
};

const removePackaging = (index: number) => {
  formData.packagings.splice(index, 1);
};

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value;
  if (showAdvanced.value && formData.productCodes.length === 0) {
    addCode();
  }
};

watch(showCategoryModal, (open) => {
  if (open) {
    categoryError.value = '';
  }
});

/** Called when AddSupplierModal successfully creates a supplier */
const onSupplierCreated = (supplierId: string, supplierName: string) => {
  // Asignar el proveedor recién creado al formulario
  formData.supplierId = supplierId;
  
  // Asegurar que el nuevo proveedor aparece en la lista
  // (El composable ya lo agregó a través de addSupplier, pero por si acaso)
  if (suppliers.value && !suppliers.value.find(s => String(s.id) === supplierId)) {
    suppliers.value.push({
      id: supplierId,
      name: supplierName,
      contactPerson: '',
      phone: '',
      email: '',
      website: '',
      address: '',
    } as any);
  }
};

const handleSubmit = () => {
  // Validación: sale_price debe ser mayor que base_cost
  if (formData.salePrice <= formData.baseCost) {
    alert('El precio de venta debe ser mayor que el costo base');
    return;
  }

  if (props.productToEdit) {
    const updatedProduct: any = {
      ...props.productToEdit,
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      baseCost: formData.baseCost,
      salePrice: formData.salePrice,
      imageFile: rawImageFile.value,
      supplierId: formData.supplierId,
      supplier: formData.supplierId,
      productCodes: formData.productCodes.filter(c => c.code.trim()), // Solo enviar los que tengan código
      packagings: formData.packagings.filter(p => p.name.trim()), // Solo enviar los que tengan nombre
    };
    emit('productUpdated', updatedProduct);
  } else {
    const newProduct: any = {
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      baseCost: formData.baseCost,
      salePrice: formData.salePrice,
      imageFile: rawImageFile.value,
      supplierId: formData.supplierId,
      supplier: formData.supplierId,
      productCodes: formData.productCodes.filter(c => c.code.trim()), // Solo enviar los que tengan código
      packagings: formData.packagings.filter(p => p.name.trim()), // Solo enviar los que tengan nombre
    };
    emit('productAdded', newProduct);
  }
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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236B7280' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M6 8l4 4 4-4' /%3e%3c/svg%3e");
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

.category-error {
  margin: 0;
  color: #DC2626;
  font-size: 0.8rem;
  font-weight: 600;
}

.category-select-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

:deep(.square-icon-button) {
  border-radius: 8px !important;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  min-width: 40px !important;
  justify-content: center;
}

.advanced-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
}

.advanced-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #6B7280;
}

.advanced-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Collapsible Sections */
.collapsible-section {
  display: block;
  border: 1.5px solid #E5E7EB;
  border-radius: 8px;
  background: #F9FAFB;
  overflow: hidden;
}

.collapsible-section > summary {
  list-style: none;
  padding: 1rem;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s;
  border-bottom: 1px solid #E5E7EB;
}

.collapsible-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.collapsible-section > summary:hover {
  background: #F3F4F6;
}

.collapsible-section > summary::marker {
  content: '';
}

.collapsible-section > summary::before {
  content: '▶';
  display: inline-block;
  margin-right: 0.5rem;
  transition: transform 0.2s;
  color: var(--color-brand-main, #06402B);
}

.collapsible-section[open] > summary::before {
  transform: rotate(90deg);
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-brand-main, #06402B);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.collapsible-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #6B7280;
}

.codes-list,
.packagings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 1rem;
  color: #9CA3AF;
  font-size: 0.875rem;
  background: white;
  border-radius: 6px;
  border: 1px dashed #D1D5DB;
}

.code-item,
.packaging-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.code-type-select,
.packaging-name-input,
.packaging-qty-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
}

.code-type-select {
  min-width: 100px;
}

.code-value-input {
  flex: 1;
}

.packaging-name-input {
  flex: 1;
}

.packaging-qty-input {
  width: 80px;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #EF4444;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #FCA5A5;
  border-color: #DC2626;
}

.btn-add-code,
.btn-add-packaging {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-brand-main, #06402B);
  background: rgba(6, 64, 43, 0.07);
  color: var(--color-brand-main, #06402B);
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-family: inherit;
}

.btn-add-code:hover,
.btn-add-packaging:hover {
  background: rgba(6, 64, 43, 0.13);
}

.input-error {
  border-color: #EF4444;
  background: #FEE2E2;
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

/* Scanner Laser Animation */
.scanner-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #22c55e;
  box-shadow: 0 0 10px 2px rgba(34, 197, 94, 0.5);
  animation: scan-laser 2s infinite linear;
  pointer-events: none;
  z-index: 10;
}

@keyframes scan-laser {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
</style>
