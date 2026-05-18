<template>
  <Teleport to="body">
  <Transition name="panel-fade">
    <div v-if="isOpen" class="panel-overlay" @click.self="$emit('close')">
      <aside class="side-panel">
        <!-- Header -->
        <header class="panel-header">
          <div class="header-title">
            <BuildingOfficeIcon class="icon" />
            <h2 class="panel-title">{{ isEdit ? 'Detalles del Proveedor' : 'Nuevo Proveedor' }}</h2>
          </div>
          <div class="header-right">
            <button
              v-if="isEdit && !isLoading"
              class="btn-danger-ghost"
              type="button"
              @click="confirmDelete"
              title="Eliminar proveedor"
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
          <div v-for="i in 2" :key="i" class="sk-field">
            <div class="sk-block sk-label"></div>
            <div class="sk-block sk-input"></div>
          </div>
        </div>

        <!-- Form -->
        <form v-else class="panel-form" @submit.prevent="handleSave">
          <div class="panel-body">
            <div class="form-section">
              <h3 class="section-title">Lo Esencial</h3>
              
              <div class="field-block">
                <label class="field-label">Nombre del Proveedor</label>
                <input v-model="form.name" class="form-input form-input-lg" type="text" placeholder="Ej: Bimbo, TechWholesale" required />
              </div>

              <div class="field-block" style="margin-top: 1rem;">
                <label class="field-label">Información de Contacto (Opcional)</label>
                <input v-model="form.phone" class="form-input" type="text" placeholder="Teléfonos, emails o nombres del vendedor" />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="panel-footer">
            <AppButton variant="outline" type="button" :disabled="isSaving" @click="$emit('close')">Cancelar</AppButton>
            <AppButton variant="fill" type="submit" :loading="isSaving">Guardar Proveedor</AppButton>
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
        <h3 class="confirm-title">Eliminar Proveedor</h3>
        <p class="confirm-msg">¿Estás seguro de que deseas eliminar a <strong>{{ form.name }}</strong>? Los productos vinculados a este proveedor perderán la referencia de suministro. Esta acción no se puede deshacer.</p>
        <div class="confirm-actions">
          <AppButton variant="outline" type="button" @click="showDeleteModal = false">Cancelar</AppButton>
          <AppButton variant="fill" type="button" class="btn-delete-confirm" :loading="isDeleting" @click="doDelete">
            Sí, eliminar
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { BuildingOfficeIcon, XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline';
import AppButton from '@/components/ui/AppButton.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSuppliers } from '@/composables/useSuppliers';
import apiClient from '@/services/api';

const props = defineProps<{
  isOpen: boolean;
  supplierId: string | number | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [supplier: any];
  deleted: [id: string | number];
}>();

const { enqueueSnackbar } = useSnackbar();
const { addSupplier, updateSupplier, deleteSupplier } = useSuppliers();

const isLoading = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);

const isEdit = computed(() => !!props.supplierId);

const form = ref({
  name: '',
  phone: '', // acts as the generic contact info
});

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
  };
};

const handleKeydown = (e: KeyboardEvent) => {
  if (props.isOpen && e.key === 'Escape') {
    if (showDeleteModal.value) {
      showDeleteModal.value = false;
    } else {
      emit('close');
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const fetchSupplier = async (id: string | number) => {
  isLoading.value = true;
  try {
    const res = await apiClient.get<any>(`/v1/products/suppliers/${id}/`);
    if (res.success && res.data) {
      const s = res.data;
      form.value = {
        name: s.name || '',
        phone: s.phone || s.contact_info || '',
      };
    }
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => [props.isOpen, props.supplierId],
  async ([open, id]) => {
    if (!open) {
      resetForm();
      showDeleteModal.value = false;
      return;
    }
    if (id) {
      await fetchSupplier(id as string);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  isSaving.value = true;
  try {
    const payload = {
      name: form.value.name,
      company: form.value.name, // Keep company same as name for simplicity if required
      phone: form.value.phone,
    };
    
    let res;
    if (isEdit.value && props.supplierId) {
      res = await updateSupplier(props.supplierId, payload);
    } else {
      res = await addSupplier(payload);
    }

    if (res.success) {
      enqueueSnackbar({
        type: 'success',
        title: isEdit.value ? 'Proveedor Actualizado' : 'Proveedor Creado',
        message: `${form.value.name} se ha guardado correctamente.`,
        duration: 3000
      });
      emit('saved', res.data);
      emit('close');
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo guardar el proveedor.',
        duration: 4000
      });
    }
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const doDelete = async () => {
  if (!props.supplierId) return;
  isDeleting.value = true;
  try {
    const res = await deleteSupplier(props.supplierId);
    if (res.success) {
      showDeleteModal.value = false;
      emit('deleted', props.supplierId);
      emit('close');
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo eliminar el proveedor.',
        duration: 4000
      });
    }
  } finally {
    isDeleting.value = false;
  }
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
.sk-field { padding: 0 1.5rem .75rem; margin-top: 1rem; }
.sk-label { height: .65rem; width: 30%; margin-bottom: .4rem; }
.sk-input { height: 2.1rem; width: 100%; }
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

/* Form */
.panel-form {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.panel-body {
  background: var(--color-background-secondary);
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

.form-input-lg {
  font-size: 1.1rem;
  padding: .75rem;
}

.form-input:focus {
  outline: none;
  border-color: #06402b;
  box-shadow: 0 0 0 3px rgba(6,64,43,.1);
}

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
