<template>
  <Teleport to="body">
    <!-- Desktop: Modal -->
    <Transition v-if="!isDrawer" name="fade">
      <div v-if="isOpen" class="modal-overlay" style="z-index: 12020;">
        <div class="modal-content" style="max-width: 400px; padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; margin: 0;">Nuevo Cliente</h3>
            <button @click="handleClose" style="background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0.25rem;">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">Nombre del Cliente *</label>
              <input type="text" v-model="form.name" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: border-color 0.2s;" placeholder="Ej: Juan Pérez" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">Teléfono (Opcional)</label>
              <input type="text" v-model="form.phone" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: border-color 0.2s;" placeholder="Ej: 5512345678" />
            </div>
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.875rem; color: #374151; margin-bottom: 0.5rem;">Correo Electrónico (Opcional)</label>
              <input type="email" v-model="form.email" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: border-color 0.2s;" placeholder="Ej: juan@ejemplo.com" />
            </div>
          </div>
          <div style="margin-top: 2rem;">
            <AppButton variant="fill" fullWidth :loading="isLoading" :disabled="!form.name.trim()" @click="handleSubmit">
              Guardar Cliente
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile: Drawer -->
    <Transition v-else name="slide-right">
      <div v-if="isOpen" class="drawer-overlay">
        <div class="drawer-content">
          <div class="modal-header">
            <h3 class="modal-title">Nuevo Cliente</h3>
            <button @click="handleClose" class="btn-close"><XMarkIcon class="w-6 h-6" /></button>
          </div>
          <div style="padding: 1rem 0;">
            <p class="text-sm text-gray-500 mb-4">Registra rápidamente un cliente para asignarle una deuda o fiado.</p>
            <div class="input-section">
              <label class="input-label">Nombre del Cliente *</label>
              <input type="text" v-model="form.name" class="payment-input" style="padding-left: 1rem;" placeholder="Ej: Juan Pérez" />
            </div>
            <div class="input-section">
              <label class="input-label">Teléfono (Opcional)</label>
              <input type="text" v-model="form.phone" class="payment-input" style="padding-left: 1rem;" placeholder="Ej: 5512345678" />
            </div>
            <div class="input-section">
              <label class="input-label">Correo Electrónico (Opcional)</label>
              <input type="email" v-model="form.email" class="payment-input" style="padding-left: 1rem;" placeholder="Ej: juan@ejemplo.com" />
            </div>
            <div style="margin-top: 2rem;">
              <AppButton variant="fill" fullWidth :loading="isLoading" :disabled="!form.name.trim()" @click="handleSubmit">Guardar Cliente</AppButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { AppButton } from '@/components/ui';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import apiClient from '@/services/api';
import { useSnackbar } from '@/composables/useSnackbar';

interface Props {
  isOpen: boolean;
  isDrawer?: boolean; // true para drawer (AccountsReceivable), false para modal (SalesModal)
  onSuccess?: (clientId: string | number) => void; // Callback cuando se crea el cliente
}

interface ClientForm {
  name: string;
  phone: string;
  email: string;
}

const props = withDefaults(defineProps<Props>(), {
  isDrawer: false
});

const emit = defineEmits<{
  close: [];
  clientCreated: [clientId: string | number];
}>();

const { enqueueSnackbar } = useSnackbar();

const form = reactive<ClientForm>({
  name: '',
  phone: '',
  email: ''
});

const isLoading = ref(false);

const handleClose = () => {
  form.name = '';
  form.phone = '';
  form.email = '';
  emit('close');
};

const handleSubmit = async () => {
  if (!form.name.trim()) return;

  isLoading.value = true;
  try {
    const response = await apiClient.post<{ id?: string | number }>('/v1/accounts/clients/', {
      name: form.name,
      phone: form.phone,
      email: form.email
    });

    if (response.success && response.data) {
      enqueueSnackbar({
        type: 'success',
        title: 'Cliente creado',
        message: 'El cliente se registró correctamente.'
      });

      const clientId = response.data.id;
      
      // Resetear formulario y cerrar
      form.name = '';
      form.phone = '';
      form.email = '';
      emit('close');

      // Emitir eventos para que los padres puedan reaccionar
      emit('clientCreated', clientId!);
      if (props.onSuccess) {
        props.onSuccess(clientId!);
      }
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error',
        message: 'No se pudo crear el cliente.'
      });
    }
  } catch (err) {
    console.error('[AddClientModal] Error creating client:', err);
    enqueueSnackbar({
      type: 'error',
      title: 'Error',
      message: 'Error de conexión. Intenta de nuevo.'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
