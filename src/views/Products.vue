<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8">
          <h3 class="text-gray-700 text-3xl font-medium">Inventario de Productos</h3>
          <p class="text-gray-500">Administra y visualiza la información de los productos</p>
          
          <div class="mt-8">
            <div class="flex items-center justify-between">
              <div class="relative w-full max-w-lg">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L15.803 15.803M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <input class="w-full pl-10 pr-4 py-2 border rounded-md" type="text" placeholder="Buscar producto por nombre, SKU o proveedor">
              </div>
              <div class="flex items-center">
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-md ml-4">Escanear Barcode</button>
                <button class="ml-4 text-gray-600 flex items-center">
                  <svg class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
                  Filtrar
                </button>
                <button class="ml-4 text-gray-600 flex items-center">
                  <svg class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2z" /></svg>
                  Ordenar
                </button>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <div class="flex flex-col">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in products" :key="product.sku" @click="selectedProduct = product" class="cursor-pointer hover:bg-gray-100">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full" :src="product.image" alt="">
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                                <div class="text-sm text-gray-500">{{ product.category }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.sku }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.quantity }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.price }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.supplier }}</td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getStatusClass(product.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              {{ product.status }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ProductDetail :product="selectedProduct" v-if="selectedProduct" @close="selectedProduct = null" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import ProductDetail from '../components/ProductDetail.vue';

interface Product {
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: string;
  supplier: string;
  status: string;
  image: string;
}

const products: Ref<Product[]> = ref([
  { name: 'Laptop Gamer X1', category: 'Laptop', sku: 'SKU-84562', quantity: 120, price: '$1,250.00', supplier: 'TechSupplier Inc.', status: 'En Stock', image: 'https://via.placeholder.com/150' },
  { name: 'Smartphone Pro', category: 'Smartphone', sku: 'SKU-34789', quantity: 350, price: '$899.99', supplier: 'Gadgetron', status: 'En Stock', image: 'https://via.placeholder.com/150' },
  { name: 'Auriculares Inalámbricos', category: 'Audio', sku: 'SKU-11234', quantity: 10, price: '$199.50', supplier: 'AudioPhile Co.', status: 'Bajo Stock', image: 'https://via.placeholder.com/150' },
  { name: 'Smartwatch Fit 2', category: 'Wearable', sku: 'SKU-55678', quantity: 0, price: '$250.00', supplier: 'Gadgetron', status: 'Agotado', image: 'https://via.placeholder.com/150' },
  { name: 'Cámara DSLR Pro', category: 'Fotografía', sku: 'SKU-99876', quantity: 75, price: '$1,800.00', supplier: 'PhotoGear Ltd.', status: 'En Stock', image: 'https://via.placeholder.com/150' },
]);

const selectedProduct: Ref<Product | null> = ref(null);

const getStatusClass = (status: string) => {
  if (status === 'En Stock') return 'bg-green-100 text-green-800';
  if (status === 'Bajo Stock') return 'bg-yellow-100 text-yellow-800';
  if (status === 'Agotado') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};
</script>
