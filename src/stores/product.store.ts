import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  image: string;
}

export const useProductStore = defineStore('products', () => {
  // Initial Mock Data
  const products = ref<Product[]>([
    {
      id: '1',
      name: 'Wireless Headphones',
      category: 'Audio',
      sku: 'SKU-11234',
      stock: 10,
      price: 199.50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      name: 'DSLR Camera Pro',
      category: 'Photography',
      sku: 'SKU-99876',
      stock: 75,
      price: 1800.00,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Smartwatch Fit 2',
      category: 'Wearable',
      sku: 'SKU-55678',
      stock: 0,
      price: 250.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      name: 'Laptop Pro 15"',
      category: 'Computing',
      sku: 'SKU-44321',
      stock: 25,
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop'
    },
    {
      id: '5',
      name: 'Bluetooth Speaker',
      category: 'Audio',
      sku: 'SKU-77889',
      stock: 50,
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop'
    }
  ]);

  // Getters
  const totalProducts = computed(() => products.value.length);
  
  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.stock > 0 && p.stock <= 10);
  });

  const outOfStockProducts = computed(() => {
    return products.value.filter(p => p.stock === 0);
  });

  const inventoryValue = computed(() => {
    return products.value.reduce((total, p) => total + (p.price * p.stock), 0);
  });
  
  const allSkus = computed(() => products.value.map(p => p.sku));

  const addProduct = (product: Product) => {
    products.value.push(product);
  };

  const updateProduct = (updatedProduct: Product) => {
    const index = products.value.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  };

  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id);
  };
  
  const bulkDeleteProducts = (ids: string[]) => {
    products.value = products.value.filter(p => !ids.includes(p.id));
  };
  
  const updateStock = (id: string, newStock: number) => {
    const product = products.value.find(p => p.id === id);
    if(product) {
       product.stock = newStock;
    }
  };
  
  const decreaseStock = (id: string, quantity: number) => {
    const product = products.value.find(p => p.id === id);
    if(product) {
       product.stock = Math.max(0, product.stock - quantity);
    }
  };

  return {
    products,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryValue,
    allSkus,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    updateStock,
    decreaseStock
  };
});
