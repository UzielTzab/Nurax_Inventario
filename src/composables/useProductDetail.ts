import { ref } from 'vue';
import apiClient from '@/services/api';
import {
  productsService,
  type CategoryOption,
  type PaginationResponse,
  type ProductMovement,
} from '@/services/products.service';

export function useProductDetail() {
  const categoriesList = ref<CategoryOption[]>([]);
  const activeStoreId = ref<string | null>(null);

  const resolveStoreId = async (currentUser: any): Promise<string | null> => {
    if (activeStoreId.value) return activeStoreId.value;

    const fromUser = currentUser?.store_profile?.id;
    if (fromUser) {
      activeStoreId.value = String(fromUser);
      return activeStoreId.value;
    }

    try {
      const storesRes = await apiClient.get<any>('/v1/accounts/stores/');
      if (storesRes.success && Array.isArray(storesRes.data) && storesRes.data.length > 0) {
        const active = storesRes.data.find((s: any) => s.active) || storesRes.data[0];
        activeStoreId.value = String(active.id);
        return activeStoreId.value;
      }
    } catch (e) {
      console.error('[useProductDetail] Error resolving store id:', e);
    }

    return null;
  };

  const fetchCategories = async (currentUser: any) => {
    try {
      const storeId = await resolveStoreId(currentUser);
      const res = await productsService.getCategories(storeId || undefined);
      if (res.success && res.data) {
        categoriesList.value = Array.isArray(res.data)
          ? res.data
          : (res.data as PaginationResponse<CategoryOption>).results || [];
      }
    } catch (e) {
      console.error('[useProductDetail] Error fetching categories:', e);
    }
  };

  const createCategory = async (name: string, currentUser: any) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, error: 'Escribe un nombre de categoria.' };
    }

    const storeId = await resolveStoreId(currentUser);
    if (!storeId) {
      return { success: false, error: 'No se encontro la tienda activa.' };
    }

    const response = await productsService.createCategory({
      name: trimmed,
      store: storeId,
    });

    if (response.success && response.data) {
      const alreadyExists = categoriesList.value.some((c) => String(c.id) === String(response.data?.id));
      if (!alreadyExists) {
        categoriesList.value.push(response.data);
      }
    }

    return response;
  };

  const fetchProductById = async (id: string | number) => {
    return productsService.getProduct(id);
  };

  const fetchProductMovements = async (id: string | number): Promise<ProductMovement[]> => {
    const res = await productsService.getProductMovements(id);
    if (!res.success || !res.data) return [];
    return Array.isArray(res.data)
      ? res.data
      : ((res.data as PaginationResponse<ProductMovement>).results || []);
  };

  const patchProductById = async (id: string | number, data: FormData | Record<string, any>) => {
    return productsService.patchProduct(id, data);
  };

  const deleteProductById = async (id: string | number) => {
    return productsService.deleteProduct(id);
  };

  return {
    categoriesList,
    fetchCategories,
    createCategory,
    fetchProductById,
    fetchProductMovements,
    patchProductById,
    deleteProductById,
  };
}
