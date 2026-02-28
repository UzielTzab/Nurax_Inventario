import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/api';

export interface SaleItem {
  id: number;
  product: number | null;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
}

export interface Sale {
  id: number;
  transaction_id: string;
  user: number;
  status: string;
  total: string | number;
  created_at: string;
  items: SaleItem[];
}

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchSales = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get<Sale[]>('/sales/');
      if (response.success && response.data) {
        sales.value = response.data;
      } else {
        error.value = response.error || 'No se pudieron cargar las ventas';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const addSale = async (saleData: { transaction_id: string; items: any[]; total: number | string; user: number; status: string }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post<Sale>('/sales/', saleData);
      if (response.success && response.data) {
        sales.value.unshift(response.data);
        return { success: true, transaction_id: response.data.transaction_id };
      } else {
        error.value = response.error || 'Error al procesar la venta';
        return { success: false, error: error.value };
      }
    } catch(err: any) {
      const msg = err.message || 'Error de conexión';
      error.value = msg;
      console.error(err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  const removeSale = (id: string | number) => {
    sales.value = sales.value.filter(s => String(s.id) !== String(id));
  };

  const weeklyData = computed(() => {
    // Array para Lunes-Domingo
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

  // Modal State
  const isModalOpen = ref(false);

  const openModal = () => {
    console.log('SalesStore: Opening modal');
    isModalOpen.value = true;
  };

  const closeModal = () => {
    console.log('SalesStore: Closing modal');
    isModalOpen.value = false;
  };

  return { 
    sales, 
    isLoading, 
    error, 
    fetchSales, 
    addSale, 
    removeSale, 
    weeklyData, 
    isModalOpen, 
    openModal, 
    closeModal 
  };
});
