import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/api';

export interface Product {
  id: number | string;
  name: string;
  category: number | string;
  category_name?: string;
  supplier?: number | string | null;
  sku: string;
  stock: number;
  price: number | string;
  image: string | null;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryTx {
  id: number;
  product: number;
  product_name?: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'waste';
  quantity: number;
  reason: string;
  user: number;
  created_at: string;
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

const CATEGORY_MAP: Record<number, string> = {
  1: 'Laptop', 2: 'Smartphone', 3: 'Audio', 4: 'Wearable', 
  5: 'Fotografía', 6: 'Gaming', 7: 'Accesorios', 8: 'Otros'
};

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get<Product[]>('/products/');
      if (response.success && response.data) {
        products.value = response.data.map(p => ({
          ...p,
          category_name: (p as any).category_name || CATEGORY_MAP[Number(p.category)] || `Categoría ${p.category}`,
          image: p.image_url || p.image || null
        }));
      } else {
        error.value = response.error || 'No se pudieron obtener los productos';
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  // Getters
  const totalProducts = computed(() => products.value.length);
  
  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock > 0 && p.stock <= 10);
  });

  const outOfStockProducts = computed(() => {
    return products.value.filter(p => p.stock === 0);
  });

  const inventoryValue = computed(() => {
    return products.value.reduce((total, p) => total + (parseFloat(String(p.price)) * p.stock), 0);
  });
  
  const allSkus = computed(() => products.value.map(p => p.sku));

  const addProduct = async (productData: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const fd = new FormData();
      fd.append('name', productData.name);
      fd.append('sku', productData.sku);
      fd.append('price', String(productData.price));
      
      // Default to Category 1 if category is a string like "Laptop" instead of an ID, you might need to adjust this depending on the API mapping
      const catVal = parseInt(String(productData.category), 10);
      fd.append('category', String(isNaN(catVal) ? '1' : catVal));
      
      if (productData.supplierId || productData.supplier) {
        fd.append('supplier', String(productData.supplierId || productData.supplier));
      } else {
        fd.append('supplier', ''); // Send empty if removed
      }
      
      if (productData.stock !== undefined) {
          fd.append('stock', String(productData.stock));
      }
      
      if (productData.imageFile) {
        fd.append('image_file', productData.imageFile);
      }

      const response = await apiClient.post<Product>('/products/', fd);
      if (response.success && response.data) {
        const newData = { 
          ...response.data, 
          category_name: (response.data as any).category_name || CATEGORY_MAP[Number(response.data.category)] || `Categoría ${response.data.category}`,
          image: response.data.image_url || response.data.image || null 
        };
        products.value.push(newData);
        return { success: true, data: newData };
      } else {
        error.value = response.error || 'No se pudo crear el producto';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const updateProduct = async (updatedProduct: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const fd = new FormData();
      if (updatedProduct.name) fd.append('name', updatedProduct.name);
      if (updatedProduct.sku) fd.append('sku', updatedProduct.sku);
      if (updatedProduct.price) fd.append('price', String(updatedProduct.price));
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
      
      const response = await apiClient.patch<Product>(`/products/${updatedProduct.id}/`, fd);
      if (response.success && response.data) {
        const newData = { 
          ...response.data, 
          category_name: (response.data as any).category_name || CATEGORY_MAP[Number(response.data.category)] || `Categoría ${response.data.category}`,
          image: response.data.image_url || response.data.image || null 
        };
        const index = products.value.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          products.value[index] = newData;
        }
        return { success: true, data: newData };
      } else {
         error.value = response.error || 'No se pudo actualizar el producto';
         return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Error de conexión';
      console.error(err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProduct = (id: string | number) => {
    products.value = products.value.filter(p => p.id !== id);
  };
  
  const bulkDeleteProducts = (ids: (string | number)[]) => {
    products.value = products.value.filter(p => !ids.includes(p.id));
  };
  
  // NOTE: This now updates stock via the backend Kárdex to prevent "robo hormiga"
  const manualAdjustment = async (productId: number, quantity: number, transaction_type: 'in' | 'out' | 'adjustment' | 'waste', reason: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post<any>('/inventory-tx/manual_adjustment/', {
        product: productId,
        quantity,
        transaction_type,
        reason
      });
      if (response.success) {
         // The backend creates the tx and adjusts product's stock. 
         // We update local stock:
         const product = products.value.find(p => p.id === productId);
         if (product) {
            // Note: If transaction_type 'out' or 'waste', backend might treat quantity as negative internally or require positive quantity but subtract it.
            // Assuming quantity is absolute and type determines operation:
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
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const fetchKardex = async (productId: number | string) => {
     try {
       const response = await apiClient.get<InventoryTx[]>(`/inventory-tx/?product=${productId}`);
       if (response.success && response.data) {
         return { success: true, data: response.data };
       }
       return { success: false, error: response.error };
     } catch (err: any) {
       return { success: false, error: err.message };
     }
  };
  
  // Temporarily kept for fast UI response on Sales (Sale modal can still call this directly or you can refactor)
  const decreaseStock = (id: string | number, quantity: number) => {
    const product = products.value.find(p => p.id === id);
    if(product) {
       product.stock = Math.max(0, product.stock - quantity);
    }
  };

  return {
    products,
    isLoading,
    error,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
    allSkus,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    manualAdjustment,
    fetchKardex,
    decreaseStock
  };
});
