/**
 * useSuppliers — Composable for fetching and managing suppliers from the API.
 */
import { ref } from 'vue'
import apiClient from '@/services/api'

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

const suppliers = ref<Supplier[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useSuppliers() {
  const fetchSuppliers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers/')
      if (response.success && response.data) {
        suppliers.value = response.data
      } else {
        error.value = response.error || 'No se pudieron cargar los proveedores'
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function addSupplier(supplierData: Partial<Supplier>) {
    isLoading.value = true;
    error.value = null;
    try {
      // Filtrar y estructurar datos para evitar mandar campos no válidos como contactPerson o address si es que vienen formados distinto
      const payload = {
        name: supplierData.name,
        company: supplierData.company || supplierData.name,
        email: supplierData.email || '',
        phone: supplierData.phone || ''
      };
      
      const response = await apiClient.post<Supplier>('/suppliers/', payload);
      if (response.success && response.data) {
         suppliers.value.push(response.data);
         return response.data;
      } else {
         error.value = response.error || 'Error al crear proveedor';
         throw new Error(error.value);
      }
    } catch(err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSupplier(id: string | number) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.delete(`/suppliers/${id}/`);
      if (response.success) {
         suppliers.value = suppliers.value.filter(s => s.id !== id);
         return { success: true };
      } else {
         error.value = response.error || 'Error al eliminar proveedor';
         return { success: false, error: error.value };
      }
    } catch(err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  return { suppliers, isLoading, error, fetchSuppliers, addSupplier, deleteSupplier }
}
