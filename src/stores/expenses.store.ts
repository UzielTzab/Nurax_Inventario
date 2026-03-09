/**
 * expenses.store.ts
 * Store Pinia para gestionar gastos
 * Utiliza expensesService para las peticiones a la API
 *
 * Métodos:
 * - fetchExpenses(): Obtiene listado de gastos
 * - addExpense(): Crea un nuevo gasto
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { expensesService, type Expense } from '@/services/expenses.service';

// Re-exportar tipos para conveniencia
export type { Expense };

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene el listado de gastos
   */
  const fetchExpenses = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await expensesService.getExpenses();

      if (response.success && response.data) {
        expenses.value = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
      } else {
        error.value = response.error || 'No se pudieron cargar los gastos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión al cargar gastos';
      console.error('Error fetching expenses:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Crea un nuevo gasto con receipts opcionales
   */
  const addExpense = async (expenseData: {
    amount: number;
    category: string;
    description: string;
    receipt_file?: File | null;
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await expensesService.createExpense(expenseData);

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
      console.error('Error adding expense:', err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    expenses,
    isLoading,
    error,

    // Methods
    fetchExpenses,
    addExpense,
  };
});
