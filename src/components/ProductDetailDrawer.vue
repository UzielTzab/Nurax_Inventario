<template>
  <Transition name="panel-fade">
    <div v-if="isOpen" class="panel-overlay" @click.self="$emit('close')">
      <aside class="side-panel">
        <!-- Header -->
        <header class="panel-header">
          <div class="header-title">
            <PencilSquareIcon class="icon" />
            <h2 class="panel-title">Detalle del Producto</h2>
          </div>
          <div class="header-right">
            <button
              v-if="!isLoading"
              class="btn-danger-ghost"
              type="button"
              @click="confirmDelete"
              title="Eliminar producto"
            >
              <TrashIcon style="width:16px;height:16px" />
              Eliminar
            </button>
            <button class="close-btn" @click="$emit('close')">
              <XMarkIcon class="icon" />
            </button>
          </div>
        </header>

        <!-- Skeleton loader -->
        <div v-if="isLoading" class="panel-body">
          <div class="skeleton-section">
            <div class="sk-block sk-img"></div>
            <div style="flex:1;display:flex;flex-direction:column;gap:.6rem">
              <div class="sk-block sk-line w-3/4"></div>
              <div class="sk-block sk-line w-1/2"></div>
            </div>
          </div>
          <div v-for="i in 5" :key="i" class="sk-field">
            <div class="sk-block sk-label"></div>
            <div class="sk-block sk-input"></div>
          </div>
        </div>

        <!-- Form -->
        <form v-else class="panel-form" @submit.prevent="handleSave">
          <div class="panel-body">
            <!-- Image -->
            <div class="image-upload-section">
              <label class="image-dropzone" :class="{ 'has-image': imagePreview }" for="pdp-image">
                <div v-if="!imagePreview" class="dropzone-content">
                  <PhotoIcon class="upload-icon" />
                  <span class="dropzone-text">Cambiar imagen</span>
                </div>
                <img v-else :src="imagePreview" alt="Preview" class="preview-img" />
                <input id="pdp-image" type="file" accept="image/*" class="file-input-hidden" @change="handleImageUpload" />
                <button v-if="imagePreview" type="button" class="remove-img-btn" @click.prevent="removeImage">
                  <XMarkIcon style="width:16px;height:16px" />
                </button>
              </label>
            </div>

            <!-- Basic info -->
            <div class="form-section">
              <h3 class="section-title">Lo Esencial</h3>
              <div class="field-block">
                <label class="field-label">Nombre del producto</label>
                <input v-model="form.name" class="form-input" type="text" placeholder="Nombre del producto" required />
              </div>
              <div class="field-block">
                <label class="field-label">Categoría</label>
                <AppSelect v-model="form.category" :options="categoriesList" placeholder="Selecciona categoría" />
              </div>
            </div>

            <!-- Financials -->
            <div class="form-section">
              <h3 class="section-title">Finanzas</h3>
              <div class="grid-two">
                <div class="field-block">
                  <label class="field-label">Costo base ($)</label>
                  <input v-model.number="form.baseCost" class="form-input" type="number" min="0" step="0.01" />
                </div>
                <div class="field-block">
                  <label class="field-label">Precio de venta ($)</label>
                  <input v-model.number="form.salePrice" class="form-input" type="number" min="0.01" step="0.01" />
                </div>
              </div>
            </div>

            <!-- Stock -->
            <div class="form-section">
              <h3 class="section-title">Inventario</h3>
              <div class="field-block">
                <label class="field-label">Stock físico actual</label>
                <div class="stock-input-wrapper">
                  <button type="button" class="btn-adjust" @click="form.stock = Math.max(0, form.stock - 1)">−</button>
                  <input v-model.number="form.stock" class="form-input stock-input" type="number" min="0" />
                  <button type="button" class="btn-adjust" @click="form.stock++">+</button>
                </div>
              </div>
              <div class="field-block">
                <label class="field-label">Proveedor</label>
                <AppSelect v-model="form.supplierId" :options="supplierOptions" placeholder="Ninguno" />
              </div>
            </div>

            <!-- Últimos Movimientos -->
            <div class="form-section movements-section">
              <h3 class="section-title">
                <ArrowsRightLeftIcon style="width:16px;height:16px;color:#6b7280" />
                Últimos Movimientos
              </h3>
              <div v-if="loadingMovements" class="movements-loading">
                <div v-for="i in 3" :key="i" class="sk-block sk-movement"></div>
              </div>
              <div v-else-if="movements.length === 0" class="movements-empty">
                Sin movimientos registrados aún.
              </div>
              <div v-else class="movements-list">
                <div v-for="mv in movements" :key="mv.id" class="movement-row">
                  <span :class="['mv-type', mvTypeClass(mv.movement_type)]">
                    {{ mvTypeLabel(mv.movement_type) }}
                  </span>
                  <span class="mv-qty" :class="mv.quantity >= 0 ? 'positive' : 'negative'">
                    {{ mv.quantity >= 0 ? '+' : '' }}{{ mv.quantity }} uds
                  </span>
                  <span class="mv-stock">Stock: {{ mv.stock_before }} → {{ mv.stock_after }}</span>
                  <span class="mv-date">{{ formatDate(mv.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="panel-footer">
            <AppButton variant="outline" type="button" :disabled="isSaving" @click="$emit('close')">Cancelar</AppButton>
            <AppButton variant="fill" type="submit" :loading="isSaving">Guardar Cambios</AppButton>
          </footer>
        </form>
      </aside>
    </div>
  </Transition>

  <!-- Delete Confirmation Modal -->
  <Transition name="fade">
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="confirm-modal">
        <div class="confirm-icon">
          <TrashIcon style="width:28px;height:28px;color:#dc2626" />
        </div>
        <h3 class="confirm-title">Eliminar Producto</h3>
        <p class="confirm-msg">¿Estás seguro de que deseas eliminar <strong>{{ form.name }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="confirm-actions">
          <AppButton variant="outline" type="button" @click="showDeleteModal = false">Cancelar</AppButton>
          <AppButton variant="fill" type="button" class="btn-delete-confirm" :loading="isDeleting" @click="doDelete">
            Sí, eliminar
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import {
  PencilSquareIcon,
  XMarkIcon,
  TrashIcon,
  PhotoIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/vue/24/outline';
import AppButton from '@/components/ui/AppButton.vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import apiClient from '@/services/api';
import { useSuppliers } from '@/composables/useSuppliers';

interface Movement {
  id: string;
  movement_type: string;
  quantity: number;
  stock_before: number;
  stock_after: number;
  created_at: string;
  user_name?: string;
}

const props = defineProps<{
  isOpen: boolean;
  productId: string | number | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [product: any];
  deleted: [id: string | number];
}>();

const { suppliers } = useSuppliers();

const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const loadingMovements = ref(false);
const movements = ref<Movement[]>([]);
const imagePreview = ref('');
const rawImageFile = ref<File | null>(null);
const categoriesList = ref<Array<{ id: string; name: string }>>([]);

const form = ref({
  name: '',
  category: '',
  supplierId: '',
  baseCost: 0,
  salePrice: 0,
  stock: 0,
});

const supplierOptions = computed(() =>
  suppliers.value.map((s: any) => ({ id: String(s.id), name: s.name }))
);

const fetchProduct = async (id: string | number) => {
  isLoading.value = true;
  try {
    const res = await apiClient.get<any>(`/v1/products/products/${id}/`);
    if (res.success && res.data) {
      const p = res.data;
      form.value = {
        name: p.name || '',
        category: String(p.category || ''),
        supplierId: String(p.supplier || ''),
        baseCost: Number(p.base_cost ?? 0),
        salePrice: Number(p.sale_price ?? 0),
        stock: Number(p.current_stock ?? 0),
      };
      imagePreview.value = p.image_url || '';
      rawImageFile.value = null;
    }
  } finally {
    isLoading.value = false;
  }
};

const fetchMovements = async (id: string | number) => {
  loadingMovements.value = true;
  movements.value = [];
  try {
    const res = await apiClient.get<any>(`/v1/products/products/${id}/movements/`);
    if (res.success && res.data) {
      movements.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
    }
  } finally {
    loadingMovements.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await apiClient.get<any>('/v1/products/categories/');
    if (res.success && res.data) {
      categoriesList.value = res.data.results || res.data;
    }
  } catch {}
};

watch(
  () => [props.isOpen, props.productId],
  async ([open, id]) => {
    if (!open || !id) return;
    await fetchCategories();
    await fetchProduct(id as string);
    await fetchMovements(id as string);
  },
  { immediate: true }
);

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  rawImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { imagePreview.value = String(ev.target?.result || ''); };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imagePreview.value = '';
  rawImageFile.value = null;
};

const handleSave = async () => {
  if (!props.productId) return;
  isSaving.value = true;
  try {
    let payload: FormData | Record<string, any>;
    if (rawImageFile.value) {
      const fd = new FormData();
      fd.append('name', form.value.name);
      fd.append('base_cost', String(form.value.baseCost));
      fd.append('sale_price', String(form.value.salePrice));
      fd.append('current_stock', String(form.value.stock));
      if (form.value.category) fd.append('category', form.value.category);
      if (form.value.supplierId) fd.append('supplier', form.value.supplierId);
      fd.append('image_file', rawImageFile.value);
      payload = fd;
    } else {
      payload = {
        name: form.value.name,
        base_cost: form.value.baseCost,
        sale_price: form.value.salePrice,
        current_stock: form.value.stock,
        category: form.value.category || undefined,
        supplier: form.value.supplierId || undefined,
      };
    }
    const res = await apiClient.patch<any>(`/v1/products/products/${props.productId}/`, payload);
    if (res.success) {
      emit('saved', res.data);
    }
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = () => { showDeleteModal.value = true; };

const doDelete = async () => {
  if (!props.productId) return;
  isDeleting.value = true;
  try {
    const res = await apiClient.delete(`/v1/products/products/${props.productId}/`);
    if (res.success) {
      showDeleteModal.value = false;
      emit('deleted', props.productId);
      emit('close');
    }
  } finally {
    isDeleting.value = false;
  }
};

const mvTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    sale: 'Venta', purchase: 'Compra', adjustment: 'Ajuste', return: 'Devolución',
  };
  return map[type] || type;
};

const mvTypeClass = (type: string) => {
  const map: Record<string, string> = {
    sale: 'mv-sale', purchase: 'mv-purchase', adjustment: 'mv-adjustment', return: 'mv-return',
  };
  return map[type] || '';
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
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
  width: clamp(420px, 40vw, 720px);
  height: 100vh;
  background: #f8fafc;
  border-left: 1px solid #e5e7eb;
  box-shadow: -16px 0 32px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.28s cubic-bezier(.4,0,.2,1);
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
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
  background: #fff;
}

.header-title {
  display: flex;
  align-items: center;
  gap: .6rem;
}

.panel-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.icon { width: 22px; height: 22px; color: #06402b; }

.header-right {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.close-btn {
  border: 1.5px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-btn:hover { background: #f3f4f6; }

.btn-danger-ghost {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .4rem .75rem;
  border: 1.5px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 8px;
  font-size: .82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}

.btn-danger-ghost:hover {
  background: #fee2e2;
  border-color: #f87171;
}

/* Skeleton */
.skeleton-section {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  align-items: center;
}

.sk-block {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.sk-img { width: 72px; height: 72px; border-radius: 10px; flex-shrink: 0; }
.sk-line { height: .85rem; }
.w-3\/4 { width: 75%; }
.w-1\/2 { width: 50%; }
.sk-field { padding: 0 1.5rem .75rem; }
.sk-label { height: .65rem; width: 30%; margin-bottom: .4rem; }
.sk-input { height: 2.1rem; width: 100%; }
.sk-movement { height: 2.5rem; width: 100%; margin-bottom: .5rem; border-radius: 8px; }

/* Form */
.panel-form {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section { display: flex; flex-direction: column; gap: .65rem; }

.section-title {
  font-size: .72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: .8px;
  margin: 0 0 .1rem;
  display: flex;
  align-items: center;
  gap: .35rem;
}

.field-block { display: flex; flex-direction: column; gap: .3rem; }

.field-label {
  font-size: .8rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: .55rem .75rem;
  font-size: .9rem;
  color: #111827;
  background: #fff;
  transition: border-color .15s;
}

.form-input:focus {
  outline: none;
  border-color: #06402b;
  box-shadow: 0 0 0 3px rgba(6,64,43,.1);
}

.grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }

.stock-input-wrapper {
  display: flex;
  align-items: center;
  gap: .4rem;
}

.stock-input { text-align: center; width: 5rem; }

.btn-adjust {
  width: 32px;
  height: 32px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
}

.btn-adjust:hover { background: #f3f4f6; }

/* Image upload */
.image-upload-section { display: flex; justify-content: center; }

.image-dropzone {
  width: 90px;
  height: 90px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #f9fafb;
  transition: border-color .15s;
}

.image-dropzone:hover { border-color: #06402b; }

.image-dropzone.has-image { border-style: solid; }

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .3rem;
  color: #9ca3af;
}

.upload-icon { width: 24px; height: 24px; }

.dropzone-text { font-size: .65rem; font-weight: 600; text-align: center; }

.preview-img { width: 100%; height: 100%; object-fit: cover; }

.file-input-hidden { display: none; }

.remove-img-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(15,23,42,.65);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Movements */
.movements-section { border-top: 1px solid #e5e7eb; padding-top: .75rem; }

.movements-loading, .movements-empty {
  font-size: .82rem;
  color: #9ca3af;
  padding: .5rem 0;
}

.movements-list { display: flex; flex-direction: column; gap: .4rem; }

.movement-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: .5rem;
  padding: .55rem .75rem;
  background: #f9fafb;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: .78rem;
}

.mv-type {
  padding: .15rem .5rem;
  border-radius: 999px;
  font-size: .7rem;
  font-weight: 700;
  white-space: nowrap;
}

.mv-sale    { background: #fef2f2; color: #dc2626; }
.mv-purchase{ background: #ecfdf5; color: #065f46; }
.mv-adjustment { background: #eff6ff; color: #1d4ed8; }
.mv-return  { background: #fefce8; color: #92400e; }

.mv-qty { font-weight: 700; }
.positive { color: #16a34a; }
.negative { color: #dc2626; }

.mv-stock { color: #6b7280; }

.mv-date { color: #9ca3af; font-size: .7rem; white-space: nowrap; }

/* Footer */
.panel-footer {
  position: sticky;
  bottom: 0;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  gap: .65rem;
}

/* Delete modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.confirm-modal {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 20px 60px rgba(15,23,42,.2);
}

.confirm-icon {
  width: 56px;
  height: 56px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-title { margin: 0; font-size: 1.15rem; font-weight: 700; color: #111827; }

.confirm-msg { margin: 0; text-align: center; font-size: .88rem; color: #4b5563; line-height: 1.5; }

.confirm-actions { display: flex; gap: .65rem; width: 100%; justify-content: center; }

.btn-delete-confirm { background: #dc2626 !important; border-color: #dc2626 !important; }

/* Transitions */
.panel-fade-enter-active, .panel-fade-leave-active { transition: opacity .2s; }
.panel-fade-enter-from, .panel-fade-leave-to { opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
