/**
 * product.store.ts
 * Store Pinia para gestionar productos
 * Utiliza productsService para las peticiones a la API
 *
 * Métodos:
 * - fetchProducts(): Obtiene listado de productos
 * - addProduct(): Crea un nuevo producto
 * - updateProduct(): Actualiza un producto
 * - deleteProduct(): Elimina un producto
 * - bulkDeleteProducts(): Elimina múltiples productos
 * - manualAdjustment(): Registra movimiento de inventario
 * - fetchKardex(): Obtiene historial de movimientos de un producto
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productsService, type Product, type InventoryTransaction } from '@/services/products.service';
import apiClient from '@/services/api';

// Re-exportar tipos para conveniencia (InventoryTx mantener por compatibilidad)
export type { Product };
export type InventoryTx = InventoryTransaction;

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const CATEGORY_MAP: Record<number, string> = {
    1: 'Laptop',
    2: 'Smartphone',
    3: 'Audio',
    4: 'Wearable',
    5: 'Fotografía',
    6: 'Gaming',
    7: 'Accesorios',
    8: 'Otros',
  };

  /**
   * Obtiene todos los productos
   */
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await productsService.getAllProducts();

      if (response.success && response.data && Array.isArray(response.data)) {
        products.value = response.data.map((p: Product) => ({
          ...p,
          category_name:
            (p as any).category_name || CATEGORY_MAP[Number(p.category)] || `Categoría ${p.category}`,
          image: p.image_url || p.image || null,
        }));
      } else {
        error.value = response.error || 'No se pudieron obtener los productos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error fetching products:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Crea un nuevo producto con archivo de imagen opcional, códigos y empaques
   */
  const addProduct = async (productData: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const fd = new FormData();
      fd.append('name', productData.name);
      fd.append('sku', productData.sku);
      
      // Usar base_cost y sale_price en lugar de price
      if (productData.baseCost !== undefined) {
        fd.append('base_cost', String(productData.baseCost));
      }
      if (productData.salePrice !== undefined) {
        fd.append('sale_price', String(productData.salePrice));
      }

      // Manejo de categoría: convertir string a número si es necesario
      const catVal = parseInt(String(productData.category), 10);
      fd.append('category', String(isNaN(catVal) ? '1' : catVal));

      // Manejo de proveedor
      if (productData.supplierId || productData.supplier) {
        fd.append('supplier', String(productData.supplierId || productData.supplier));
      } else {
        fd.append('supplier', '');
      }

      // Stock opcional
      if (productData.stock !== undefined) {
        fd.append('stock', String(productData.stock));
      }

      // Imagen opcional
      if (productData.imageFile) {
        fd.append('image_file', productData.imageFile);
      }

      const response = await productsService.createProduct(fd);

      if (response.success && response.data) {
        const productId = response.data.id;
        
        // Crear códigos de producto en endpoint separado
        if (productData.productCodes && Array.isArray(productData.productCodes)) {
          for (const code of productData.productCodes) {
            if (code.code && code.codeType) {
              try {
                await apiClient.post('/v1/products/codes/', {
                  product: productId,
                  code: code.code,
                  code_type: code.codeType,
                });
              } catch (err) {
                console.warn('Error creating product code:', err);
                // No fallar el proceso completo si falla un código
              }
            }
          }
        }

        // Crear empaques en endpoint separado
        if (productData.packagings && Array.isArray(productData.packagings)) {
          for (const pkg of productData.packagings) {
            if (pkg.name && pkg.quantityPerUnit) {
              try {
                await apiClient.post('/v1/products/packagings/', {
                  product: productId,
                  name: pkg.name,
                  quantity_per_unit: pkg.quantityPerUnit,
                });
              } catch (err) {
                console.warn('Error creating product packaging:', err);
                // No fallar el proceso completo si falla un empaque
              }
            }
          }
        }

        // Re-obtener el producto con códigos y empaques actualizados
        const updatedResponse = await productsService.getProduct(productId);
        if (updatedResponse.success && updatedResponse.data) {
          const newData = {
            ...updatedResponse.data,
            category_name:
              (updatedResponse.data as any).category_name ||
              CATEGORY_MAP[Number(updatedResponse.data.category)] ||
              `Categoría ${updatedResponse.data.category}`,
            image: updatedResponse.data.image_url || updatedResponse.data.image || null,
          };
          products.value.push(newData);
          return { success: true, data: newData };
        } else {
          products.value.push(response.data);
          return { success: true, data: response.data };
        }
      } else {
        error.value = response.error || 'No se pudo crear el producto';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error adding product:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Actualiza un producto existente con código y empaques
   */
  const updateProduct = async (updatedProduct: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const fd = new FormData();
      if (updatedProduct.name) fd.append('name', updatedProduct.name);
      if (updatedProduct.sku) fd.append('sku', updatedProduct.sku);
      
      // Usar base_cost y sale_price en lugar de price
      if (updatedProduct.baseCost !== undefined) {
        fd.append('base_cost', String(updatedProduct.baseCost));
      }
      if (updatedProduct.salePrice !== undefined) {
        fd.append('sale_price', String(updatedProduct.salePrice));
      }

      if (updatedProduct.category) {
        const updatedCat = parseInt(String(updatedProduct.category), 10);
        fd.append('category', String(isNaN(updatedCat) ? '1' : updatedCat));
      }

      if (updatedProduct.supplierId || updatedProduct.supplier) {
        fd.append('supplier', String(updatedProduct.supplierId || updatedProduct.supplier));
      } else if (updatedProduct.supplierId === '') {
        fd.append('supplier', '');
      }

      if (updatedProduct.stock !== undefined) fd.append('stock', String(updatedProduct.stock));

      if (updatedProduct.imageFile) {
        fd.append('image_file', updatedProduct.imageFile);
      }

      const response = await productsService.updateProduct(updatedProduct.id, fd);

      if (response.success && response.data) {
        const productId = response.data.id;
        
        // Si hay códigos nuevos, crearlos
        if (updatedProduct.productCodes && Array.isArray(updatedProduct.productCodes)) {
          for (const code of updatedProduct.productCodes) {
            if (code.code && code.codeType && !code.id) {
              // Solo crear si no tiene ID (son nuevos)
              try {
                await apiClient.post('/v1/products/codes/', {
                  product: productId,
                  code: code.code,
                  code_type: code.codeType,
                });
              } catch (err) {
                console.warn('Error creating product code:', err);
              }
            }
          }
        }

        // Si hay empaques nuevos, crearlos
        if (updatedProduct.packagings && Array.isArray(updatedProduct.packagings)) {
          for (const pkg of updatedProduct.packagings) {
            if (pkg.name && pkg.quantityPerUnit && !pkg.id) {
              // Solo crear si no tiene ID (son nuevos)
              try {
                await apiClient.post('/v1/products/packagings/', {
                  product: productId,
                  name: pkg.name,
                  quantity_per_unit: pkg.quantityPerUnit,
                });
              } catch (err) {
                console.warn('Error creating product packaging:', err);
              }
            }
          }
        }

        // Re-obtener el producto actualizado
        const updatedResponse = await productsService.getProduct(productId);
        if (updatedResponse.success && updatedResponse.data) {
          const newData = {
            ...updatedResponse.data,
            category_name:
              (updatedResponse.data as any).category_name ||
              CATEGORY_MAP[Number(updatedResponse.data.category)] ||
              `Categoría ${updatedResponse.data.category}`,
            image: updatedResponse.data.image_url || updatedResponse.data.image || null,
          };
          const index = products.value.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            products.value[index] = newData;
          }
          return { success: true, data: newData };
        } else {
          const newData = {
            ...response.data,
            category_name:
              (response.data as any).category_name ||
              CATEGORY_MAP[Number(response.data.category)] ||
              `Categoría ${response.data.category}`,
            image: response.data.image_url || response.data.image || null,
          };
          const index = products.value.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            products.value[index] = newData;
          }
          return { success: true, data: newData };
        }
      } else {
        error.value = response.error || 'No se pudo actualizar el producto';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error updating product:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Elimina un producto
   */
  const deleteProduct = async (id: string | number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await productsService.deleteProduct(id);

      if (response.success) {
        products.value = products.value.filter(p => p.id !== id);
        return { success: true };
      } else {
        error.value = response.error || 'Error al eliminar en el servidor';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error deleting product:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Elimina múltiples productos
   */
  const bulkDeleteProducts = async (ids: (string | number)[]) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Intentar con endpoint bulk_delete si existe
      const response = await apiClient.post<any>('/products/bulk_delete/', { ids });

      if (response.success) {
        products.value = products.value.filter(p => !ids.includes(p.id));
        return { success: true };
      } else {
        error.value = response.error || 'Error borrando productos';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      // Fallback: borrar uno por uno si el endpoint no existe
      console.warn('Bulk delete endpoint error, falling back to sequential delete:', err);
      let successCount = 0;

      for (const id of ids) {
        try {
          const res = await productsService.deleteProduct(id);
          if (res.success) {
            products.value = products.value.filter(p => p.id !== id);
            successCount++;
          }
        } catch (e) {
          /* ignorar errores individuales para continuar */
        }
      }

      return { success: successCount > 0 };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Registra un movimiento manual de inventario
   */
  const manualAdjustment = async (
    productId: number,
    quantity: number,
    transaction_type: 'in' | 'out' | 'adjustment' | 'waste',
    reason: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await productsService.recordInventoryTransaction(
        productId,
        transaction_type,
        quantity,
        reason
      );

      if (response.success) {
        // Actualizar stock local basado en el tipo de transacción
        const product = products.value.find(p => p.id === productId);
        if (product) {
          if (['out', 'waste'].includes(transaction_type)) {
            product.stock = Math.max(0, product.stock - quantity);
          } else {
            product.stock += quantity;
          }
        }
        return { success: true };
      } else {
        error.value = response.error || 'No se pudo ajustar el inventario';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error('Error in manual adjustment:', err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Obtiene el historial de movimientos (kardex) de un producto
   */
  const fetchKardex = async (productId: number | string) => {
    try {
      const response = await productsService.getProductKardex(productId);

      if (response.success && response.data) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Disminuye el stock localmente (para respuesta rápida en la venta)
   */
  const decreaseStock = (id: string | number, quantity: number) => {
    const product = products.value.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, product.stock - quantity);
    }
  };

  /**
   * Número total de productos
   */
  const totalProducts = computed(() => products.value.length);

  /**
   * Productos con stock bajo
   */
  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock > 0 && p.stock <= 10);
  });

  /**
   * Productos sin stock
   */
  const outOfStockProducts = computed(() => {
    return products.value.filter(p => p.stock === 0);
  });

  /**
   * Valor total del inventario
   */
  const inventoryValue = computed(() => {
    return products.value.reduce(
      (total, p) => total + parseFloat(String(p.price)) * p.stock,
      0
    );
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

    // Methods
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    manualAdjustment,
    fetchKardex,
    decreaseStock,

    // Computed
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
    allSkus,
  };
});
