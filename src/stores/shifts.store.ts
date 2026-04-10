/**
 * shifts.store.ts
 * Store Pinia para gestionar turnos
 * Utiliza shiftsService para las peticiones a la API
 *
 * Métodos:
 * - fetchShifts(): Obtiene listado de turnos
 * - openShift(): Abre un nuevo turno
 * - closeShift(): Cierra un turno abierto
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { shiftsService, type Shift } from '@/services/shifts.service';
import { useAuth } from '@/composables/useAuth';
import apiClient from '@/services/api';

// Re-exportar tipos para conveniencia
export type { Shift };

export const useShiftsStore = defineStore('shifts', () => {
  const shifts = ref<Shift[]>([]);
  const currentShift = ref<Shift | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const activeStoreId = ref<string | number | null>(null);
  const { currentUser, initSession } = useAuth();

  const resolveStoreId = async (): Promise<string | number | null> => {
    if (activeStoreId.value) return activeStoreId.value;

    await initSession();
    const fromProfile = currentUser.value?.store_profile?.id;
    if (fromProfile) {
      activeStoreId.value = fromProfile;
      return activeStoreId.value;
    }

    try {
      const response = await apiClient.get<any>('/v1/accounts/stores/');
      if (!response.success || !response.data) return null;

      const stores = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as any).results)
          ? (response.data as any).results
          : [];

      if (!stores.length) return null;

      const activeStore = stores.find((store: any) => store.active) || stores[0];
      activeStoreId.value = activeStore.id;
      return activeStoreId.value;
    } catch (err) {
      console.error('Error resolving active store for cash shift:', err);
      return null;
    }
  };

  /**
   * Obtiene el listado de todos los turnos
   */
  const fetchShifts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await shiftsService.getShifts();

      if (response.success && response.data) {
        const dataArr: Shift[] = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
        shifts.value = dataArr;

        // Determinar el turno abierto (closed_at === null)
        const open = dataArr.find(s => s.closed_at === null);
        currentShift.value = open || null;
      } else {
        error.value = response.error || 'No se pudieron cargar los turnos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión al cargar turnos';
      console.error('Error fetching shifts:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Abre un nuevo turno con efectivo inicial
   */
  const openShift = async (starting_cash: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const storeId = await resolveStoreId();
      if (!storeId) {
        const msg = 'No se pudo determinar la tienda activa para abrir la caja.';
        error.value = msg;
        return { success: false, error: msg };
      }

      const response = await shiftsService.openShift(starting_cash, storeId);

      if (response.success && response.data) {
        shifts.value.unshift(response.data);
        currentShift.value = response.data;
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'Error al abrir el turno. Puede que ya tengas uno abierto.';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error al abrir el turno';
      error.value = msg;
      console.error('Error opening shift:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cierra un turno abierto
   */
  const closeShift = async (id: number | string, expected_cash: number, actual_cash: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await shiftsService.closeShift(id, expected_cash, actual_cash);

      if (response.success && response.data) {
        const index = shifts.value.findIndex(s => s.id === id);
        if (index !== -1) {
          shifts.value[index] = response.data;
        }
        currentShift.value = null;
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'Error al cerrar el turno';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error de conexión al cerrar turno';
      error.value = msg;
      console.error('Error closing shift:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Indica si hay un turno abierto actualmente
   */
  const hasOpenShift = computed(() => currentShift.value !== null);

  return {
    // State
    shifts,
    currentShift,
    isLoading,
    error,

    // Methods
    fetchShifts,
    openShift,
    closeShift,

    // Computed
    hasOpenShift,
  };
});
