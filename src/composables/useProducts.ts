/**
 * useProducts
 * Composable para gestionar productos con paginación y filtros
 * Utiliza productsService para las peticiones a la API
 */

import { ref, computed } from 'vue';
import { productsService, type PaginationResponse, type Product, type ProductFilters } from '@/services/products.service';

// Re-exportar tipos para conveniencia
export type { Product, PaginationResponse, ProductFilters };

export function useProducts() {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    pageSize: 10,
  });

  const filters = ref<ProductFilters>({
    search: '',
    category: '',
    supplier: '',
    sku: '',
    stock_status: '',
    min_price: '',
    max_price: '',
    ordering: '-created_at',
  });

  /**
   * Obtiene productos de la API con paginación y filtros aplicados
   */
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await productsService.getProducts(
        pagination.value.currentPage,
        pagination.value.pageSize,
        filters.value
      );

      if (response.success && response.data) {
        const { results, count, next, previous } = response.data;
        products.value = results.map(p => ({
          ...p,
          image: p.image_url || p.image || null,
        }));

        pagination.value.count = count;
        pagination.value.next = next;
        pagination.value.previous = previous;
      } else {
        error.value = response.error || 'No se pudieron obtener los productos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error al obtener productos';
      console.error('Error fetching products:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Navega a una página específica
   */
  const goToPage = (pageNum: number) => {
    pagination.value.currentPage = pageNum;
    return fetchProducts();
  };

  /**
   * Cambia el tamaño de página y regresa a la primera página
   */
  const setPageSize = (size: number) => {
    pagination.value.pageSize = size;
    pagination.value.currentPage = 1;
    return fetchProducts();
  };

  /**
   * Aplica nuevos filtros y regresa a la primera página
   */
  const applyFilters = (newFilters: Partial<ProductFilters>) => {
    Object.assign(filters.value, newFilters);
    pagination.value.currentPage = 1;
    return fetchProducts();
  };

  /**
   * Limpia todos los filtros y regresa a la primera página
   */
  const clearFilters = () => {
    filters.value = {
      search: '',
      category: '',
      supplier: '',
      sku: '',
      stock_status: '',
      min_price: '',
      max_price: '',
      ordering: '-created_at',
    };
    pagination.value.currentPage = 1;
    return fetchProducts();
  };

  /**
   * Calcula el número total de páginas basado en la paginación
   */
  const totalPages = computed(() => {
    return Math.ceil(pagination.value.count / pagination.value.pageSize);
  });

  /**
   * Indica si existe una próxima página
   */
  const hasNextPage = computed(() => pagination.value.next !== null);

  /**
   * Indica si existe una página anterior
   */
  const hasPreviousPage = computed(() => pagination.value.previous !== null);

  /**
   * Productos con stock bajo (> 0 y <= 10)
   */
  const lowStockProducts = computed(() => {
    return products.value.filter(p => {
      const stock = p.current_stock ?? p.stock ?? 0;
      return stock > 0 && stock < 5;
    });
  });

  /**
   * Productos sin stock
   */
  const outOfStockProducts = computed(() => {
    return products.value.filter(p => {
      const stock = p.current_stock ?? p.stock ?? 0;
      return stock === 0;
    });
  });

  /**
   * Valor total del inventario
   */
  const inventoryValue = computed(() => {
    return products.value.reduce((total, p) => {
      const baseCost = Number(p.base_cost ?? p.baseCost ?? 0);
      const stock = Number(p.current_stock ?? p.stock ?? 0);
      return total + (baseCost * stock);
    }, 0);
  });

  /**
   * Listado de todos los SKUs
   */
  const allSkus = computed(() => products.value.map(p => p.sku));

  return {
    // State
    products,
    isLoading,
    error,
    pagination,
    filters,

    // Methods
    fetchProducts,
    goToPage,
    setPageSize,
    applyFilters,
    clearFilters,

    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
    allSkus,
  };
}
