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

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get<Product[]>('/products/');
      if (response.success && response.data) {
        products.value = response.data.map(p => ({
          ...p,
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
      fd.append('category', String(productData.category ? parseInt(productData.category, 10) : '1'));
      
      if (productData.supplierId || productData.supplier) {
        fd.append('supplier', String(productData.supplierId || productData.supplier));
      }
      
      if (productData.stock !== undefined) {
          fd.append('stock', String(productData.stock));
      }
      
      if (productData.imageFile) {
        fd.append('image_file', productData.imageFile);
      }

      const response = await apiClient.post<Product>('/products/', fd);
      if (response.success && response.data) {
        const newData = { ...response.data, image: response.data.image_url || response.data.image || null };
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
      if (updatedProduct.category) fd.append('category', String(parseInt(updatedProduct.category, 10)));
      if (updatedProduct.supplierId || updatedProduct.supplier) fd.append('supplier', String(updatedProduct.supplierId || updatedProduct.supplier));
      if (updatedProduct.stock !== undefined) fd.append('stock', String(updatedProduct.stock));
      
      if (updatedProduct.imageFile) {
        fd.append('image_file', updatedProduct.imageFile);
      }
      
      const response = await apiClient.patch<Product>(`/products/${updatedProduct.id}/`, fd);
      if (response.success && response.data) {
        const newData = { ...response.data, image: response.data.image_url || response.data.image || null };
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
  
  const updateStock = (id: string | number, newStock: number) => {
    const product = products.value.find(p => p.id === id);
    if(product) {
       product.stock = newStock;
    }
  };
  
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
    updateStock,
    decreaseStock
  };
});
