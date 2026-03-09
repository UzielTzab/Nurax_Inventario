/**
 * suppliers.service.ts
 * Servicio especializado para todas las peticiones relacionadas con proveedores
 */

import apiClient from './api';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ════════════════════════════════════════════════════════════════════════════

export interface Supplier {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  company: string;
  contactPerson?: string;
  website?: string;
  address?: string;
  created_at?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE PROVEEDORES
// ════════════════════════════════════════════════════════════════════════════

class SuppliersService {
  /**
   * Obtiene el listado de proveedores
   */
  async getSuppliers() {
    return apiClient.get<Supplier[]>('/suppliers/');
  }

  /**
   * Obtiene un proveedor específico por ID
   */
  async getSupplier(id: number | string) {
    return apiClient.get<Supplier>(`/suppliers/${id}/`);
  }

  /**
   * Crea un nuevo proveedor
   */
  async createSupplier(data: Partial<Supplier>) {
    const payload = {
      name: data.name,
      company: data.company || data.name,
      email: data.email || '',
      phone: data.phone || '',
    };
    return apiClient.post<Supplier>('/suppliers/', payload);
  }

  /**
   * Actualiza un proveedor existente
   */
  async updateSupplier(id: number | string, data: Partial<Supplier>) {
    const payload = {
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
    };
    return apiClient.put<Supplier>(`/suppliers/${id}/`, payload);
  }

  /**
   * Elimina un proveedor
   */
  async deleteSupplier(id: number | string) {
    return apiClient.delete(`/suppliers/${id}/`);
  }
}

// Exportar la instancia del servicio (singleton)
export const suppliersService = new SuppliersService();
