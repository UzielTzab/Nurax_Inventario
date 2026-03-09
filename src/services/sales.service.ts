/**
 * sales.service.ts
 * Servicio especializado para todas las peticiones relacionadas con ventas e historial de pagos
 * Centraliza:
 * - Listado de ventas
 * - Crear nueva venta
 * - Cancelar venta
 * - Pagos y abonos a ventas
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface SaleItem {
  id: number;
  product: number | null;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  subtotal: string | number;
}

export interface Payment {
  id: number;
  amount: number | string;
  created_at: string;
}

export interface Sale {
  id: number;
  transaction_id: string;
  user: number;
  status: string; // 'completed', 'pending', 'cancelled', 'credit', 'layaway'
  total: string | number;
  created_at: string;
  items: SaleItem[];
  payments?: Payment[];
}

export interface PaginatedSalesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sale[];
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE VENTAS
// ════════════════════════════════════════════════════════════════════════════

class SalesService {
  /**
   * Obtiene el listado paginado de ventas
   * @param page - Número de página (por defecto 1)
   * @param pageSize - Número de registros por página (por defecto 10)
   * @param search - Búsqueda opcional por transaction_id
   * @returns Objeto con count, next, previous y results
   */
  async getSales(page: number = 1, pageSize: number = 10, search?: string) {
    try {
      let url = `/sales/?page=${page}&page_size=${pageSize}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await apiClient.get<PaginatedSalesResponse>(url);
      
      if (response.success && response.data) {
        // response.data ahora es: { count, next, previous, results: [...] }
        return {
          success: true,
          data: response.data.results || [],
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous,
          error: null
        };
      }
      
      return {
        success: false,
        data: [],
        count: 0,
        next: null,
        previous: null,
        error: response.error || 'Error al obtener ventas'
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        count: 0,
        next: null,
        previous: null,
        error: err.message || 'Error al obtener ventas'
      };
    }
  }

  /**
   * Obtiene una venta específica por ID
   */
  async getSale(id: number | string) {
    try {
      const response = await apiClient.get<Sale>(`/sales/${id}/`);
      return {
        success: response.success,
        data: response.data,
        error: response.error
      };
    } catch (err: any) {
      return {
        success: false,
        data: undefined,
        error: err.message || 'Error al obtener venta'
      };
    }
  }

  /**
   * Crea una nueva venta
   * Backend devuelve el objeto Sale directamente en response.data
   */
  async createSale(saleData: {
    transaction_id: string;
    items: any[];
    total: number | string;
    user: number;
    status: string;
  }) {
    try {
      const response = await apiClient.post<Sale>('/sales/', saleData);
      
      // Normalizar respuesta - backend devuelve Sale en response.data
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data as Sale,
          error: null
        };
      }
      
      return {
        success: false,
        data: undefined,
        error: response.error || 'Error al crear venta'
      };
    } catch (err: any) {
      return {
        success: false,
        data: undefined,
        error: err.message || 'Error al crear venta'
      };
    }
  }

  /**
   * Cancela una venta existente
   * Backend envía eventos Pusher INVENTORY_UPDATED y SALES_CANCELLED
   */
  async cancelSale(id: number | string) {
    try {
      const response = await apiClient.post<{ status: string }>(`/sales/${id}/cancel/`, {});
      return {
        success: response.success,
        data: response.data,
        error: response.error
      };
    } catch (err: any) {
      return {
        success: false,
        data: undefined,
        error: err.message || 'Error al cancelar venta'
      };
    }
  }

  /**
   * Registra un pago/abono a una venta
   */
  async addPayment(saleId: number, amount: number) {
    try {
      const response = await apiClient.post<Payment>('/payments/', {
        sale: saleId,
        amount,
      });
      return {
        success: response.success,
        data: response.data,
        error: response.error
      };
    } catch (err: any) {
      return {
        success: false,
        data: undefined,
        error: err.message || 'Error al registrar pago'
      };
    }
  }

  /**
   * Obtiene el historial de pagos de una venta
   */
  async getSalePayments(saleId: number | string) {
    try {
      const response = await apiClient.get<Payment[]>(`/sales/${saleId}/payments/`);
      return {
        success: response.success,
        data: response.data || [],
        error: response.error
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: err.message || 'Error al obtener pagos'
      };
    }
  }
}

// Exportar la instancia del servicio (singleton)
export const salesService = new SalesService();
