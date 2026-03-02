import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/api';

export interface Shift {
  id: number;
  user: number;
  starting_cash: number | string;
  expected_cash: number | string | null;
  actual_cash: number | string | null;
  difference: number | string | null;
  status?: 'open' | 'closed';
  opened_at: string;
  closed_at: string | null;
}

export const useShiftsStore = defineStore('shifts', () => {
  const shifts = ref<Shift[]>([]);
  const currentShift = ref<Shift | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchShifts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get<Shift[]>('/shifts/');
      if (response.success && response.data) {
        const dataArr: Shift[] = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
        shifts.value = dataArr;
        // The backend determines open shifts by closed_at being null
        const open = dataArr.find(s => s.closed_at === null);
        currentShift.value = open || null;
      } else {
        error.value = response.error || 'No se pudieron cargar los turnos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión al cargar turnos';
    } finally {
      isLoading.value = false;
    }
  };

  const openShift = async (starting_cash: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post<Shift>('/shifts/open/', { starting_cash });
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
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  const closeShift = async (id: number, expected_cash: number, actual_cash: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post<Shift>(`/shifts/${id}/close/`, {
        expected_cash,
        actual_cash
      });
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
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  const hasOpenShift = computed(() => currentShift.value !== null);

  return {
    shifts,
    currentShift,
    isLoading,
    error,
    hasOpenShift,
    fetchShifts,
    openShift,
    closeShift
  };
});
