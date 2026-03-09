/**
 * useSuppliers
 * Composable para gestionar proveedores
 * Utiliza suppliersService para las peticiones a la API
 *
 * Exporta:
 * - suppliers: Listado de proveedores
 * - isLoading: Indica si está cargando
 * - error: Mensajes de error si los hay
 * - fetchSuppliers(): Obtiene proveedores
 * - addSupplier(data): Crea un proveedor
 * - updateSupplier(id, data): Actualiza un proveedor
 * - deleteSupplier(id): Elimina un proveedor
 */

import { ref } from 'vue';
import { suppliersService, type Supplier } from '@/services/suppliers.service';

// Re-exportar tipos para conveniencia
export type { Supplier };

export function useSuppliers() {
  const suppliers = ref<Supplier[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene el listado de proveedores desde la API
   */
  const fetchSuppliers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await suppliersService.getSuppliers();

      if (response.success && response.data) {
        // Manejar tanto array directo como respuesta paginada
        suppliers.value = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
      } else {
        error.value = response.error || 'No se pudieron cargar los proveedores';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error fetching suppliers:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Crea un nuevo proveedor
   */
  const addSupplier = async (supplierData: Partial<Supplier>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await suppliersService.createSupplier(supplierData);

      if (response.success && response.data) {
        suppliers.value.push(response.data);
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'Error al crear proveedor';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error adding supplier:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Actualiza un proveedor existente
   */
  const updateSupplier = async (id: number | string, supplierData: Partial<Supplier>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await suppliersService.updateSupplier(id, supplierData);

      if (response.success && response.data) {
        const index = suppliers.value.findIndex(s => String(s.id) === String(id));
        if (index !== -1) {
          suppliers.value[index] = response.data;
        }
        return { success: true, data: response.data };
      } else {
        error.value = response.error || 'Error al actualizar proveedor';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error updating supplier:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Elimina un proveedor existente
   */
  const deleteSupplier = async (id: number | string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await suppliersService.deleteSupplier(id);

      if (response.success) {
        suppliers.value = suppliers.value.filter(s => String(s.id) !== String(id));
        return { success: true };
      } else {
        error.value = response.error || 'Error al eliminar proveedor';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error deleting supplier:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    suppliers,
    isLoading,
    error,

    // Methods
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
