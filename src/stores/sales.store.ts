/**
 * sales.store.ts
 * Store Pinia para gestionar ventas y pagos
 * Utiliza salesService para las peticiones a la API
 *
 * Métodos:
 * - fetchSales(): Obtiene listado de ventas
 * - addSale(): Crea una nueva venta
 * - cancelSale(): Cancela una venta
 * - addPayment(): Registra un pago/abono a una venta
 * - removeSale(): Elimina una venta del estado local
 * - openModal/closeModal: Gestiona estado del modal
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { salesService, type Sale, type Payment, type SaleItem } from '@/services/sales.service';

// Re-exportar tipos para conveniencia
export type { Sale, Payment, SaleItem };

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Paginación
  const totalSales = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const nextPageUrl = ref<string | null>(null);
  const previousPageUrl = ref<string | null>(null);

  /**
   * Obtiene el listado de ventas con paginación
   * @param page - Número de página (por defecto 1)
   * @param size - Registros por página (por defecto 10)
   */
  const fetchSales = async (page: number = 1, size: number = 10) => {
    isLoading.value = true;
    error.value = null;
    currentPage.value = page;
    pageSize.value = size;

    try {
      const response = await salesService.getSales(page, size);

      if (response.success) {
        // response.data ahora es el array de results
        sales.value = Array.isArray(response.data) ? response.data : [];
        totalSales.value = response.count || 0;
        nextPageUrl.value = response.next || null;
        previousPageUrl.value = response.previous || null;
      } else {
        error.value = response.error || 'No se pudieron cargar las ventas';
        sales.value = [];
        totalSales.value = 0;
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      sales.value = [];
      console.error('Error fetching sales:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Crea una nueva venta
   */
  const addSale = async (saleData: {
    transaction_id: string;
    items: any[];
    total: number | string;
    user: number;
    status: string;
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await salesService.createSale(saleData);

      if (response.success && response.data) {
        // Asegurar que sales.value es un array antes de unshift
        if (!Array.isArray(sales.value)) {
          sales.value = [];
        }
        sales.value.unshift(response.data);
        return { success: true, transaction_id: response.data.transaction_id, id: response.data.id };
      } else {
        error.value = response.error || 'Error al procesar la venta';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error de conexión';
      error.value = msg;
      console.error('Error adding sale:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cancela una venta existente
   */
  const cancelSale = async (id: string | number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await salesService.cancelSale(id);

      if (response.success) {
        const saleIndex = sales.value.findIndex(s => String(s.id) === String(id));
        if (saleIndex !== -1) {
          const saleToCancel = sales.value[saleIndex];
          if (saleToCancel) {
            saleToCancel.status = 'cancelled';
          }
        }
        return { success: true };
      } else {
        error.value = response.error || 'No se pudo cancelar la venta';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error al conectar con el servidor';
      error.value = msg;
      console.error('Error cancelling sale:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Elimina una venta del estado local
   */
  const removeSale = (id: string | number) => {
    sales.value = sales.value.filter(s => String(s.id) !== String(id));
  };

  /**
   * Registra un pago/abono a una venta
   */
  const addPayment = async (saleId: number, amount: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await salesService.addPayment(saleId, amount);

      if (response.success && response.data) {
        // Actualizar historial de pagos en la venta local
        const sale = sales.value.find(s => s.id === saleId);
        if (sale) {
          if (!sale.payments) sale.payments = [];
          sale.payments.push(response.data);

          // Actualizar estado si total pagado >= total
          const paid = sale.payments.reduce((acc, p) => acc + parseFloat(String(p.amount)), 0);
          if (paid >= parseFloat(String(sale.total))) {
            sale.status = 'completed';
          }
        }
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'Error al registrar abono';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error de conexión';
      error.value = msg;
      console.error('Error adding payment:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Calcula los datos de ventas por semana
   */
  const weeklyData = computed(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const data = days.map(day => ({ day, amount: 0 }));

    // Obtener inicio de semana (Lunes)
    const now = new Date();
    const currentDay = now.getDay() || 7; // 1 (Lun) a 7 (Dom)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    sales.value.forEach(sale => {
      const date = new Date(sale.created_at);
      if (date >= startOfWeek) {
        const dayIndex = (date.getDay() + 6) % 7;
        if (dayIndex >= 0 && dayIndex < 7 && data[dayIndex]) {
          data[dayIndex]!.amount += parseFloat(String(sale.total));
        }
      }
    });

    return data;
  });

  // ════════════════════════════════════════════════════════════════════════════
  // MODAL STATE (UI)
  // ════════════════════════════════════════════════════════════════════════════

  const isModalOpen = ref(false);
  const isScannerOpen = ref(false);
  const scannerMode = ref<'single' | 'continuous'>('single');  // Nuevo: rastrear el modo de escaneo

  const openModal = () => {
    isModalOpen.value = true;
  };

  const openScanner = () => {
    isModalOpen.value = true;
    isScannerOpen.value = true;
    scannerMode.value = 'single';
  };

  const openContinuousScanner = () => {
    isModalOpen.value = true;
    isScannerOpen.value = true;
    scannerMode.value = 'continuous';
  };

  const closeModal = () => {
    isModalOpen.value = false;
    isScannerOpen.value = false;
    scannerMode.value = 'single';
  };

  return {
    // State
    sales,
    isLoading,
    error,
    totalSales,
    currentPage,
    pageSize,
    nextPageUrl,
    previousPageUrl,
    isModalOpen,
    isScannerOpen,
    scannerMode,  // Nuevo: exportar modo de escaneo

    // Methods
    fetchSales,
    addSale,
    cancelSale,
    removeSale,
    addPayment,
    openModal,
    openScanner,
    openContinuousScanner,  // Nuevo: abrir escaneo en modo continuo
    closeModal,

    // Computed
    weeklyData,
  };
});
