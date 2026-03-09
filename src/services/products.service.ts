/**
 * products.service.ts
 * Servicio especializado para todas las peticiones relacionadas con productos
 * Centraliza la lógica de fetch de productos, con soporte para:
 * - Listado con paginación y filtros
 * - Crear, actualizar, eliminar productos
 * - Movimientos de inventario (kardex)
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface Product {
  id: number | string;
  name: string;
  category: number | string;
  category_name?: string;
  supplier?: number | string | null;
  sku: string;
  stock: number;
  price: number | string;
  image_url?: string | null;
  image?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductFilters {
  search?: string;
  category?: number | string;
  sku?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | string;
  min_price?: number | string;
  max_price?: number | string;
  ordering?: string;
}

export interface InventoryTransaction {
  id: number;
  product: number;
  product_name?: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'waste';
  quantity: number;
  reason: string;
  user: number;
  created_at: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE PRODUCTOS
// ════════════════════════════════════════════════════════════════════════════

class ProductsService {
  /**
   * Obtiene el listado de productos con paginación y filtros
   */
  async getProducts(page: number = 1, pageSize: number = 10, filters?: ProductFilters) {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };

    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.sku) params.sku = filters.sku;
    if (filters?.stock_status) params.stock_status = filters.stock_status;
    if (filters?.min_price) params.min_price = filters.min_price;
    if (filters?.max_price) params.max_price = filters.max_price;
    if (filters?.ordering) params.ordering = filters.ordering;

    return apiClient.get<PaginationResponse<Product>>('/products/', { params });
  }

  /**
   * Obtiene todos los productos sin paginación
   * NOTA: El endpoint retorna datos paginados, se extrae automaticamente .results
   */
  async getAllProducts(): Promise<{ success: boolean; data?: Product[]; error?: string; status?: number }> {
    const response = await apiClient.get<PaginationResponse<Product> | Product[]>('/products/');
    
    // Normalizar respuesta: si es paginada, extraer .results
    if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        const paginatedData = response.data as unknown as PaginationResponse<Product>;
        return {
          success: true,
          data: paginatedData.results,
        };
      }
    }
    
    return {
      success: false,
      error: response.error,
      status: response.status,
    };
  }

  /**
   * Obtiene un producto específico por ID
   */
  async getProduct(id: number | string) {
    return apiClient.get<Product>(`/products/${id}/`);
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(data: FormData | Partial<Product>) {
    return apiClient.post<Product>('/products/', data);
  }

  /**
   * Actualiza un producto existente
   */
  async updateProduct(id: number | string, data: FormData | Partial<Product>) {
    return apiClient.put<Product>(`/products/${id}/`, data);
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(id: number | string) {
    return apiClient.delete(`/products/${id}/`);
  }

  /**
   * Registra un movimiento de inventario (entrada, salida, ajuste, desperdicio)
   */
  async recordInventoryTransaction(
    productId: number | string,
    transactionType: 'in' | 'out' | 'adjustment' | 'waste',
    quantity: number,
    reason: string,
  ) {
    return apiClient.post<InventoryTransaction>(
      `/products/${productId}/record-transaction/`,
      { transaction_type: transactionType, quantity, reason }
    );
  }

  /**
   * Obtiene el historial de movimientos de un producto (kardex)
   */
  async getProductKardex(productId: number | string) {
    return apiClient.get<InventoryTransaction[]>(`/products/${productId}/kardex/`);
  }
}

// Exportar la instancia del servicio (singleton)
export const productsService = new ProductsService();
