<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="profile-modal-backdrop" style="z-index: 9999" @click.self="$emit('close')">
        <div class="profile-modal" style="max-width: 450px;">
          <!-- Header -->
          <div class="pm-header">
            <h3 class="pm-title text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-indigo-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Abrir Nueva Caja
            </h3>
            <button class="pm-close" @click="$emit('close')">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="pm-body p-6">
            <p class="text-sm text-gray-500 mb-6 font-medium">
              Parece que aún no has aperturado tu turno. Ingresa el fondo de caja inicial para comenzar a cobrar ventas.
            </p>

            <form @submit.prevent="handleOpenShift">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">Fondo Inicial en Efectivo:</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    v-model.number="startingCash"
                    required
                    class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 transition-colors focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="flex gap-3 mt-8">
                <AppButton variant="outline" class="flex-1" type="button" @click="$emit('close')" :disabled="isSubmitting">
                  Más tarde
                </AppButton>
                <AppButton variant="fill" class="flex-1" type="submit" :loading="isSubmitting">
                  <span v-if="!isSubmitting">Abrir Turno</span>
                  <span v-else>Abriendo...</span>
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShiftsStore } from '@/stores/shifts.store';
import { useSnackbar } from '@/composables/useSnackbar';
import AppButton from '@/components/ui/AppButton.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'shift-opened']);

const shiftsStore = useShiftsStore();
const { enqueueSnackbar } = useSnackbar();

const startingCash = ref<number | null>(null);
const isSubmitting = ref(false);

const handleOpenShift = async () => {
  if (startingCash.value === null || startingCash.value < 0) {
    enqueueSnackbar({ type: 'warning', title: 'Inválido', message: 'Ingresa una cantidad inicial válida.' });
    return;
  }
  
  isSubmitting.value = true;
  try {
    const result = await shiftsStore.openShift(startingCash.value);
    if (result.success) {
      enqueueSnackbar({ type: 'success', title: 'Turno Abierto', message: '¡Que tengas una excelente jornada!' });
      startingCash.value = null; // reset
      emit('shift-opened');
      emit('close');
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: result.error });
    }
  } catch(e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.profile-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.profile-modal {
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
  background: #f8fafc;
}

.pm-title {
  margin: 0;
  color: #1f2937;
}

.pm-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
}

.pm-close:hover {
  color: #ef4444;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
