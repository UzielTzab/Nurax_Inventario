import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/services/api';

export interface Expense {
  id: number;
  user: number;
  amount: number | string;
  category: 'servicios' | 'nomina' | 'proveedores' | 'varios';
  description: string;
  receipt_url: string | null;
  created_at: string;
}

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchExpenses = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get<Expense[]>('/expenses/');
      if (response.success && response.data) {
        expenses.value = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
      } else {
        error.value = response.error || 'No se pudieron cargar los gastos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión al cargar gastos';
    } finally {
      isLoading.value = false;
    }
  };

  const addExpense = async (expenseData: { amount: number, category: string, description: string, receipt_file?: File | null }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const fd = new FormData();
      fd.append('amount', String(expenseData.amount));
      fd.append('category', expenseData.category);
      fd.append('description', expenseData.description);
      
      if (expenseData.receipt_file) {
        fd.append('receipt_file', expenseData.receipt_file);
      }

      const response = await apiClient.post<Expense>('/expenses/', fd);
      if (response.success && response.data) {
        expenses.value.unshift(response.data);
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'No se pudo crear el gasto';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      const msg = err.message || 'Error de conexión al guardar gasto';
      error.value = msg;
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    addExpense
  };
});
