/**
 * expenses.service.ts
 * Servicio especializado para todas las peticiones relacionadas con gastos
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface Expense {
  id: number;
  user: number;
  amount: number | string;
  category: 'servicios' | 'nomina' | 'proveedores' | 'varios';
  description: string;
  receipt_url: string | null;
  created_at: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE GASTOS
// ════════════════════════════════════════════════════════════════════════════

class ExpensesService {
  /**
   * Obtiene el listado de gastos
   */
  async getExpenses() {
    return apiClient.get<Expense[]>('/expenses/');
  }

  /**
   * Obtiene un gasto específico por ID
   */
  async getExpense(id: number | string) {
    return apiClient.get<Expense>(`/expenses/${id}/`);
  }

  /**
   * Crea un nuevo gasto with optional receipt file
   */
  async createExpense(expenseData: {
    amount: number;
    category: string;
    description: string;
    receipt_file?: File | null;
  }) {
    const fd = new FormData();
    fd.append('amount', String(expenseData.amount));
    fd.append('category', expenseData.category);
    fd.append('description', expenseData.description);

    if (expenseData.receipt_file) {
      fd.append('receipt_file', expenseData.receipt_file);
    }

    return apiClient.post<Expense>('/expenses/', fd);
  }

  /**
   * Actualiza un gasto existente
   */
  async updateExpense(
    id: number | string,
    expenseData: Partial<{
      amount: number;
      category: string;
      description: string;
      receipt_file?: File | null;
    }>
  ) {
    const fd = new FormData();
    if (expenseData.amount !== undefined) {
      fd.append('amount', String(expenseData.amount));
    }
    if (expenseData.category) fd.append('category', expenseData.category);
    if (expenseData.description) fd.append('description', expenseData.description);
    if (expenseData.receipt_file) fd.append('receipt_file', expenseData.receipt_file);

    return apiClient.patch<Expense>(`/expenses/${id}/`, fd);
  }

  /**
   * Elimina un gasto
   */
  async deleteExpense(id: number | string) {
    return apiClient.delete(`/expenses/${id}/`);
  }
}

// Exportar la instancia del servicio (singleton)
export const expensesService = new ExpensesService();
