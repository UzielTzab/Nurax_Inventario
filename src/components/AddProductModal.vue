<template>
  <Transition name="panel-fade">
    <div v-if="isOpen" class="panel-overlay" @click.self="$emit('close')">
      <aside class="side-panel">
        <header class="panel-header">
          <div class="header-title">
            <PlusCircleIcon class="icon" />
            <h2 class="panel-title">{{ productToEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <XMarkIcon class="icon" />
          </button>
        </header>

        <form class="panel-form" @submit.prevent="handleSubmit">
          <div class="panel-body">
            <section class="form-section">
              <h3 class="section-title">Lo Esencial</h3>

              <div class="image-upload-section">
                <label class="image-dropzone" :class="{ 'has-image': imagePreview }" for="image-main">
                  <div v-if="!imagePreview" class="dropzone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span class="dropzone-text">Arrastra imagen o toca para seleccionar</span>
                  </div>
                  <img v-else :src="imagePreview" alt="Preview" class="preview-img" />
                  <input
                    id="image-main"
                    type="file"
                    accept="image/*"
                    class="file-input-hidden"
                    @change="handleImageUpload"
                  />
                  <button v-if="imagePreview" type="button" class="remove-img-btn" @click.prevent="removeImage" title="Quitar imagen">
                    <XMarkIcon style="width: 16px; height: 16px" />
                  </button>
                </label>
              </div>

              <AppInput
                id="name"
                v-model="formData.name"
                label="Nombre del producto"
                placeholder="Ej: Cable USB-C"
                required
              />

              <div class="field-block">
                <label class="field-label">Categoria</label>
                <input
                  v-model="categorySearch"
                  type="text"
                  class="form-input"
                  placeholder="Buscar categoria..."
                />
                <div class="category-select-row">
                  <select v-model="formData.category" class="form-input">
                    <option value="">Selecciona categoria</option>
                    <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <AppButton
                    type="button"
                    variant="outline"
                    size="sm"
                    :icon="PlusIcon"
                    iconOnly
                    class="square-icon-button"
                    title="Agregar categoria"
                    @click="showCategoryModal = true"
                  />
                </div>
              </div>
            </section>

            <section class="form-section">
              <h3 class="section-title">Finanzas</h3>

              <div class="grid-two">
                <AppInput
                  id="baseCost"
                  v-model.number="formData.baseCost"
                  type="number"
                  label="Costo base ($)"
                  min="0"
                  placeholder="0.00"
                  @input="onBaseCostInput"
                />
                <AppInput
                  id="salePrice"
                  v-model.number="formData.salePrice"
                  type="number"
                  label="Precio de venta ($)"
                  min="0"
                  placeholder="0.00"
                  @input="onSalePriceInput"
                />
              </div>

              <AppInput
                id="margin"
                v-model.number="formData.marginPercent"
                type="number"
                label="Margen (%)"
                min="0"
                placeholder="0"
                hint="Campo bidireccional: costo + margen recalcula precio"
                @input="onMarginInput"
              />
            </section>

            <section class="form-section">
              <h3 class="section-title">Codigos y Escaner</h3>

              <div class="field-block">
                <label class="field-label">Codigo principal</label>
                <div class="inline-input-actions">
                  <AppInput
                    id="sku"
                    v-model="formData.sku"
                    placeholder="Si lo dejas vacio se autogenera"
                    style="flex: 1"
                  />
                  <button type="button" class="btn-scan" @click="startScanForPrimary" title="Escanear codigo principal">
                    <QrCodeIcon style="width: 18px; height: 18px" />
                  </button>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label">Codigos alternativos</label>
                <div class="list-block">
                  <div v-for="(_, idx) in formData.alternativeCodes" :key="idx" class="list-row">
                    <input v-model="formData.alternativeCodes[idx]" class="form-input" type="text" placeholder="Codigo alternativo" />
                    <button type="button" class="btn-scan small" @click="startScanForAlt(idx)" title="Escanear codigo alternativo">
                      <QrCodeIcon style="width: 16px; height: 16px" />
                    </button>
                    <button type="button" class="btn-remove" @click="removeAltCode(idx)" title="Eliminar codigo">
                      <XMarkIcon style="width: 16px; height: 16px" />
                    </button>
                  </div>
                </div>
                <AppButton type="button" variant="outline" size="sm" :icon="PlusIcon" @click="addAltCode">
                  Agregar otro codigo
                </AppButton>
              </div>
            </section>

            <section class="form-section">
              <h3 class="section-title">Inventario y Proveedor</h3>

              <div class="field-block">
                <label class="field-label">Stock fisico actual</label>
                <div class="stock-input-wrapper">
                  <button type="button" class="btn-adjust" @click="adjustStock(-1)" :disabled="formData.stock <= 0">-</button>
                  <input v-model.number="formData.stock" class="form-input stock-input" type="number" min="0" />
                  <button type="button" class="btn-adjust" @click="adjustStock(1)">+</button>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label">Proveedor</label>
                <input
                  v-model="supplierSearch"
                  type="text"
                  class="form-input"
                  placeholder="Buscar proveedor..."
                />
                <div class="supplier-row">
                  <select v-model="formData.supplierId" class="form-input supplier-select">
                    <option value="">Ninguno</option>
                    <option v-for="s in filteredSuppliers" :key="s.id" :value="String(s.id)">{{ s.name }}</option>
                  </select>
                  <button type="button" class="btn-new-supplier" @click="showAddSupplierModal = true" title="Crear proveedor">
                    <PlusIcon style="width: 14px; height: 14px" />
                    <span>Nuevo</span>
                  </button>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h3 class="section-title">Como se vende</h3>

              <AppInput
                id="baseUnit"
                v-model="formData.baseUnitName"
                label="Unidad de venta base"
                placeholder="Unidad / Pieza"
              />

              <div class="field-block">
                <label class="field-label">Empaques mayoristas</label>
                <div class="list-block">
                  <div v-for="(pkg, idx) in formData.majorPackagings" :key="idx" class="grid-pack-row">
                    <input v-model="pkg.name" class="form-input" type="text" placeholder="Nombre (Ej. Caja con 50)" />
                    <input v-model.number="pkg.quantityPerUnit" class="form-input" type="number" min="1" placeholder="Cantidad" />
                    <button type="button" class="btn-remove" @click="removePackaging(idx)" title="Eliminar empaque">
                      <XMarkIcon style="width: 16px; height: 16px" />
                    </button>
                  </div>
                </div>
                <AppButton type="button" variant="outline" size="sm" :icon="PlusIcon" @click="addPackaging">
                  Agregar empaque mayorista
                </AppButton>
              </div>
            </section>
          </div>

          <footer class="panel-footer">
            <label class="save-another-check">
              <input v-model="saveAndCreateAnother" type="checkbox" :disabled="!!productToEdit || loading" />
              <span>Guardar y crear otro</span>
            </label>

            <div class="footer-actions">
              <AppButton variant="outline" type="button" :disabled="loading" @click="$emit('close')">Cancelar</AppButton>
              <AppButton variant="fill" type="submit" :loading="loading">Guardar producto</AppButton>
            </div>
          </footer>
        </form>
      </aside>
    </div>
  </Transition>

  <Transition name="fade">
    <div
      v-if="isScanning"
      class="scan-overlay"
      @click.self="isScanning = false"
    >
      <div class="scan-modal">
        <h3>Escanear codigo</h3>
        <div class="scan-frame">
          <qrcode-stream
            @detect="onDecodeSku"
            @error="onError"
            :formats="barcodeFormats"
            :track="paintOutline"
          ></qrcode-stream>
          <div class="scanner-laser"></div>
        </div>
        <AppButton variant="outline" type="button" @click="isScanning = false">Cancelar</AppButton>
      </div>
    </div>
  </Transition>

  <AddSupplierModal
    :is-open="showAddSupplierModal"
    @close="showAddSupplierModal = false"
    @supplier-created="onSupplierCreated"
  />

  <Transition name="fade">
    <div v-if="showCategoryModal" class="panel-overlay" @click.self="showCategoryModal = false">
      <div class="category-modal">
        <header class="category-header">
          <h2>Nueva categoria</h2>
          <button class="close-btn" @click="showCategoryModal = false">
            <XMarkIcon class="icon" />
          </button>
        </header>
        <div class="category-body">
          <AppInput
            v-model="newCategoryName"
            label="Nombre"
            placeholder="Ej: Audio, Cables, Accesorios"
          />
          <p v-if="categoryError" class="category-error">{{ categoryError }}</p>
          <div class="footer-actions">
            <AppButton variant="outline" type="button" @click="showCategoryModal = false">Cancelar</AppButton>
            <AppButton variant="fill" type="button" :loading="isCreatingCategory" @click="createCategory">Crear categoria</AppButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  PlusCircleIcon,
  PlusIcon,
  QrCodeIcon,
  XMarkIcon,
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
  price?: string | number;
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
const showCategoryModal = ref(false);
const newCategoryName = ref('');
const isCreatingCategory = ref(false);
const categoryError = ref('');
const activeStoreId = ref<string | null>(null);

const categoriesList = ref<Array<{ id: number | string; name: string }>>([]);
const categorySearch = ref('');
const supplierSearch = ref('');
const saveAndCreateAnother = ref(false);

const filteredCategories = computed(() => {
  const q = categorySearch.value.trim().toLowerCase();
  if (!q) return categoriesList.value;
  return categoriesList.value.filter((cat) => cat.name.toLowerCase().includes(q));
});

const filteredSuppliers = computed(() => {
  const q = supplierSearch.value.trim().toLowerCase();
  if (!q) return suppliers.value;
  return suppliers.value.filter((supplier) => supplier.name.toLowerCase().includes(q));
});

const isScanning = ref(false);
const scanTarget = ref<{ type: 'principal' | 'alt'; index?: number }>({ type: 'principal' });

const barcodeFormats = ref<any[]>([
  'qr_code',
  'ean_13',
  'ean_8',
  'code_128',
  'code_39',
  'upc_a',
  'upc_e',
]);

const formData = reactive({
  name: '',
  category: '',
  sku: '',
  stock: 0,
  baseCost: 0,
  salePrice: 0,
  marginPercent: 0,
  image: '',
  supplierId: '',
  baseUnitName: 'Unidad / Pieza',
  alternativeCodes: [] as string[],
  majorPackagings: [] as Array<{ name: string; quantityPerUnit: number }>,
});

const imagePreview = ref('');
const rawImageFile = ref<File | null>(null);

const normalizeNumber = (value: unknown) => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const recalcSaleFromMargin = () => {
  const base = normalizeNumber(formData.baseCost);
  const margin = normalizeNumber(formData.marginPercent);
  const price = base * (1 + margin / 100);
  formData.salePrice = Number(price.toFixed(2));
};

const recalcMarginFromPrices = () => {
  const base = normalizeNumber(formData.baseCost);
  const sale = normalizeNumber(formData.salePrice);
  if (base <= 0) {
    formData.marginPercent = 0;
    return;
  }
  formData.marginPercent = Number((((sale - base) / base) * 100).toFixed(2));
};

const onBaseCostInput = () => {
  if (normalizeNumber(formData.marginPercent) > 0) {
    recalcSaleFromMargin();
    return;
  }
  recalcMarginFromPrices();
};

const onSalePriceInput = () => {
  recalcMarginFromPrices();
};

const onMarginInput = () => {
  recalcSaleFromMargin();
};

const generateSKU = () => {
  let maxNumber = 0;
  if (props.existingSkus?.length) {
    props.existingSkus.forEach((sku) => {
      if (!sku) return; // Validación: ignorar valores undefined/null
      const match = sku.match(/\d+$/);
      if (!match) return;
      const num = parseInt(match[0], 10);
      if (num > maxNumber) maxNumber = num;
    });
  }
  const nextNumber = maxNumber + 1;
  formData.sku = `SKU-${nextNumber.toString().padStart(4, '0')}`;
};

const resetFormForCreate = () => {
  formData.name = '';
  formData.category = '';
  formData.sku = '';
  formData.stock = 0;
  formData.baseCost = 0;
  formData.salePrice = 0;
  formData.marginPercent = 0;
  formData.image = '';
  formData.supplierId = '';
  formData.baseUnitName = 'Unidad / Pieza';
  formData.alternativeCodes = [];
  formData.majorPackagings = [];
  imagePreview.value = '';
  rawImageFile.value = null;
  saveAndCreateAnother.value = false;
  generateSKU();
};

const populateFormForEdit = (product: Product) => {
  formData.name = product.name || '';
  formData.category = String(product.category || '');
  formData.sku = product.sku || '';
  formData.stock = normalizeNumber(product.stock);
  formData.baseCost = normalizeNumber(product.baseCost);
  formData.salePrice = normalizeNumber(product.salePrice ?? product.price);
  recalcMarginFromPrices();
  formData.image = product.image || '';
  formData.supplierId = String(product.supplierId ?? product.supplier ?? '');
  formData.baseUnitName = 'Unidad / Pieza';
  formData.alternativeCodes = (product.productCodes || []).map((item) => item.code).filter(Boolean);
  formData.majorPackagings = (product.packagings || [])
    .filter((pack) => pack.quantityPerUnit > 1)
    .map((pack) => ({ name: pack.name, quantityPerUnit: pack.quantityPerUnit }));

  imagePreview.value = product.image || '';
  rawImageFile.value = null;
  saveAndCreateAnother.value = false;
};

watch(
  () => props.isOpen,
  (open) => {
    if (!open) return;
    if (props.productToEdit) {
      populateFormForEdit(props.productToEdit);
      return;
    }
    resetFormForCreate();
  }
);

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = String(e.target?.result || '');
    imagePreview.value = result;
    formData.image = result;
  };
  reader.readAsDataURL(file);

  rawImageFile.value = file;
  target.value = '';
};

const removeImage = () => {
  imagePreview.value = '';
  formData.image = '';
  rawImageFile.value = null;
};

const adjustStock = (amount: number) => {
  const next = normalizeNumber(formData.stock) + amount;
  formData.stock = Math.max(0, next);
};

const addAltCode = () => {
  formData.alternativeCodes.push('');
};

const removeAltCode = (idx: number) => {
  formData.alternativeCodes.splice(idx, 1);
};

const addPackaging = () => {
  formData.majorPackagings.push({ name: '', quantityPerUnit: 1 });
};

const removePackaging = (idx: number) => {
  formData.majorPackagings.splice(idx, 1);
};

const startScanForPrimary = () => {
  scanTarget.value = { type: 'principal' };
  isScanning.value = true;
};

const startScanForAlt = (index: number) => {
  scanTarget.value = { type: 'alt', index };
  isScanning.value = true;
};

const onDecodeSku = (detectedCodes: any[]) => {
  const rawValue = detectedCodes?.[0]?.rawValue;
  if (!rawValue) return;

  if (scanTarget.value.type === 'principal') {
    formData.sku = rawValue;
  } else if (typeof scanTarget.value.index === 'number') {
    formData.alternativeCodes[scanTarget.value.index] = rawValue;
  }

  const audio = new Audio('/sounds/Fx_Scanning.wav');
  audio.play().catch(() => undefined);
  isScanning.value = false;
};

const onError = (err: any) => {
  isScanning.value = false;
  let errMsg = 'Error con la camara: ';
  if (err.name === 'NotAllowedError') errMsg += 'permiso denegado';
  else if (err.name === 'NotFoundError') errMsg += 'no se encontro camara';
  else if (err.name === 'NotSupportedError') errMsg += 'se requiere HTTPS';
  else if (err.name === 'NotReadableError') errMsg += 'camara en uso';
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
      const active = storesRes.data.find((item: any) => item.active) || storesRes.data[0];
      activeStoreId.value = String(active.id);
      return activeStoreId.value;
    }
  } catch (error) {
    console.error('Error resolving store id:', error);
  }

  return null;
};

const fetchCategories = async () => {
  try {
    const storeId = await resolveStoreId();
    const response = await apiClient.get<any>('/v1/products/categories/', {
      params: storeId ? { store_id: storeId } : undefined,
    });
    if (!response.success || !response.data) return;
    categoriesList.value = response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const createCategory = async () => {
  categoryError.value = '';
  const name = newCategoryName.value.trim();
  if (!name) {
    categoryError.value = 'Escribe un nombre de categoria.';
    return;
  }

  const storeId = await resolveStoreId();
  if (!storeId) {
    categoryError.value = 'No se encontro la tienda activa.';
    return;
  }

  isCreatingCategory.value = true;
  try {
    const response = await apiClient.post<any>('/v1/products/categories/', {
      name,
      store: storeId,
    });

    if (!response.success || !response.data) {
      categoryError.value = response.error || 'No se pudo crear la categoria.';
      return;
    }

    categoriesList.value.push(response.data);
    formData.category = response.data.id;
    newCategoryName.value = '';
    showCategoryModal.value = false;
  } catch (error: any) {
    categoryError.value = error?.message || 'Error al crear categoria.';
  } finally {
    isCreatingCategory.value = false;
  }
};

const onSupplierCreated = (supplierId: string, supplierName: string) => {
  formData.supplierId = supplierId;
  if (!suppliers.value.find((supplier) => String(supplier.id) === supplierId)) {
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

const buildProductCodesPayload = () => {
  const productCodes = [] as Array<{ codeType: string; code: string }>;

  if (formData.sku.trim()) {
    productCodes.push({ codeType: 'ean13', code: formData.sku.trim() });
  }

  formData.alternativeCodes.forEach((code) => {
    const clean = code.trim();
    if (!clean) return;
    productCodes.push({ codeType: 'ean13', code: clean });
  });

  return productCodes;
};

const buildPackagingsPayload = () => {
  const packagings = [{ name: formData.baseUnitName.trim() || 'Unidad / Pieza', quantityPerUnit: 1 }];

  formData.majorPackagings.forEach((packaging) => {
    const name = packaging.name.trim();
    const quantity = Math.max(1, normalizeNumber(packaging.quantityPerUnit));
    if (!name) return;
    packagings.push({ name, quantityPerUnit: quantity });
  });

  return packagings;
};

const handleSubmit = () => {
  const baseCost = normalizeNumber(formData.baseCost);
  const salePrice = normalizeNumber(formData.salePrice);

  // Solo validar margen cuando el usuario realmente ingresa precios.
  if ((baseCost > 0 || salePrice > 0) && salePrice <= baseCost) {
    alert('El precio de venta debe ser mayor que el costo base');
    return;
  }

  const payload: any = {
    name: formData.name,
    category: formData.category,
    sku: formData.sku,
    stock: formData.stock,
    baseCost: formData.baseCost,
    salePrice: formData.salePrice,
    imageFile: rawImageFile.value,
    supplierId: formData.supplierId,
    supplier: formData.supplierId,
    productCodes: buildProductCodesPayload(),
    packagings: buildPackagingsPayload(),
  };

  if (props.productToEdit) {
    emit('productUpdated', { ...props.productToEdit, ...payload });
    return;
  }

  emit('productAdded', {
    ...payload,
    saveAndCreateAnother: saveAndCreateAnother.value,
  });

  if (saveAndCreateAnother.value) {
    resetFormForCreate();
  }
};

onMounted(async () => {
  await initSession();
  await Promise.all([fetchCategories(), fetchSuppliers()]);
});

watch(showCategoryModal, (open) => {
  if (!open) return;
  categoryError.value = '';
});
</script>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-end;
  z-index: 9999;
}

.side-panel {
  width: clamp(420px, 40vw, 760px);
  height: 100vh;
  background: #f8fafc;
  border-left: 1px solid #e5e7eb;
  box-shadow: -16px 0 32px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
}

.panel-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.panel-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.icon {
  width: 22px;
  height: 22px;
  color: #06402b;
}

.close-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn:hover {
  background: #f3f4f6;
}

.panel-form {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.panel-body {
  padding: 1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.form-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  margin: 0;
  font-size: 0.86rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 700;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.8rem;
  color: #374151;
  font-weight: 600;
}

.grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
}

.form-input {
  width: 100%;
  padding: 0.62rem 0.72rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #06402b;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.1);
}

.image-upload-section {
  display: flex;
  flex-direction: column;
}

.image-dropzone {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 10px;
  border: 2px dashed #d1d5db;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.image-dropzone:hover {
  border-color: #06402b;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  color: #6b7280;
  padding: 0.8rem;
}

.upload-icon {
  width: 28px;
  height: 28px;
}

.dropzone-text {
  font-size: 0.75rem;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input-hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.remove-img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.category-select-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

:deep(.square-icon-button) {
  border-radius: 8px !important;
  width: 40px;
  height: 40px;
  min-width: 40px !important;
  padding: 0 !important;
}

.inline-input-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-scan {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid #22c55e;
  background: #f0fdf4;
  color: #16a34a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-scan.small {
  width: 34px;
  height: 34px;
  border-radius: 8px;
}

.list-block {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.list-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.4rem;
  align-items: center;
}

.grid-pack-row {
  display: grid;
  grid-template-columns: 1fr 120px auto;
  gap: 0.4rem;
  align-items: center;
}

.btn-remove {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.stock-input-wrapper {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  gap: 0.45rem;
  align-items: center;
}

.stock-input {
  text-align: center;
  font-weight: 700;
}

.btn-adjust {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 1rem;
  cursor: pointer;
}

.btn-adjust:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.supplier-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.btn-new-supplier {
  border: 1px solid rgba(6, 64, 43, 0.25);
  background: rgba(6, 64, 43, 0.08);
  color: #06402b;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.6rem 0.72rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.panel-footer {
  border-top: 1px solid #e5e7eb;
  background: #fff;
  padding: 0.8rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.save-another-check {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: #4b5563;
  font-weight: 600;
}

.footer-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.scan-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.56);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-modal {
  background: white;
  border-radius: 14px;
  width: 92%;
  max-width: 420px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.scan-modal h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.scan-frame {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  position: relative;
}

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

.category-modal {
  width: 92%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.category-header {
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.category-header h2 {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.category-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.category-error {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
}

.panel-fade-enter-active,
.panel-fade-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .side-panel {
    width: min(100vw, 560px);
  }
}

@media (max-width: 640px) {
  .side-panel {
    width: 100vw;
  }

  .grid-two {
    grid-template-columns: 1fr;
  }

  .panel-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .grid-pack-row {
    grid-template-columns: 1fr 90px auto;
  }
}
</style>
