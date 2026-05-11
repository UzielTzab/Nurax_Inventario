/**
 * useCategories.ts
 * Composable para obtener y gestionar todas las categorías disponibles
 */

import { ref, computed } from 'vue';
import { productsService, type CategoryOption } from '@/services/products.service';

export function useCategories() {
  const categories = ref<CategoryOption[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Obtiene todas las categorías disponibles
   */
  const fetchCategories = async (storeId?: string | number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await productsService.getCategories(storeId);

      if (response.success && response.data) {
        // Puede retornar array directo o PaginationResponse
        if (Array.isArray(response.data)) {
          categories.value = response.data;
        } else {
          // Si es paginado, extraer results
          const paginatedData = response.data as any;
          categories.value = paginatedData.results || [];
        }
      } else {
        error.value = response.error || 'No se pudieron obtener las categorías';
      }
    } catch (err: any) {
      error.value = err.message || 'Error al obtener categorías';
      console.error('Error fetching categories:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Obtiene una categoría por ID
   */
  const getCategoryById = (id: string | number) => {
    return categories.value.find(cat => String(cat.id) === String(id));
  };

  /**
   * Obtiene el nombre de una categoría por ID
   */
  const getCategoryName = (id: string | number) => {
    const cat = getCategoryById(id);
    return cat?.name || 'Sin categoría';
  };

  /**
   * Categorías ordenadas alfabéticamente
   */
  const sortedCategories = computed(() => {
    return [...categories.value].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
  });

  return {
    categories,
    sortedCategories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryName,
  };
}
