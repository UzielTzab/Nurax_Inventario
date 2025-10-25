<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar 
      :alertCount="lowStockCount" 
      @openAddProduct="showAddProductModal = true" 
      @openNotifications="showNotifications = true"
    />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8">
          <h3 class="text-gray-700 text-3xl font-medium">Inventario de Productos</h3>
          <p class="text-gray-500">Administra y visualiza la información de los productos</p>
          
          <div class="mt-8">
            <div class="flex items-center justify-between">
              <div class="relative w-full max-w-lg">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
                </span>
                <input class="w-full pl-10 pr-4 py-2 border rounded-md" type="text" placeholder="Buscar producto por nombre, SKU o proveedor">
              </div>
              <div class="flex items-center">
                <button @click="showBarcodeScanner = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md ml-4 flex items-center transition-colors">
                  <QrCodeIcon class="h-5 w-5 mr-2" />
                  Escanear Barcode
                </button>
                <button class="ml-4 text-gray-600 hover:text-gray-900 flex items-center transition-colors">
                  <FunnelIcon class="h-5 w-5 mr-1" />
                  Filtrar
                </button>
                <button class="ml-4 text-gray-600 hover:text-gray-900 flex items-center transition-colors">
                  <BarsArrowUpIcon class="h-5 w-5 mr-1" />
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
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="product in products" :key="product.sku" class="hover:bg-gray-50">
                          <td @click="selectedProduct = product" class="px-6 py-4 whitespace-nowrap cursor-pointer">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full object-cover" :src="product.image" alt="">
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
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex gap-2">
                              <button @click="openEditModal(product)" class="text-indigo-600 hover:text-indigo-900 transition-colors" title="Editar">
                                <PencilIcon class="h-5 w-5" />
                              </button>
                              <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900 transition-colors" title="Eliminar">
                                <TrashIcon class="h-5 w-5" />
                              </button>
                            </div>
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
      <BarcodeScanner 
        :isOpen="showBarcodeScanner" 
        :products="products" 
        @close="showBarcodeScanner = false"
        @productSold="handleProductSold"
      />
      <AddProductModal 
        :isOpen="showAddProductModal" 
        @close="showAddProductModal = false"
        @productAdded="handleProductAdded"
      />
      <EditProductModal 
        :isOpen="showEditModal"
        :product="productToEdit"
        @close="showEditModal = false; productToEdit = null"
        @productUpdated="handleProductUpdated"
      />
      <DeleteConfirmModal 
        :isOpen="showDeleteModal"
        :product="productToDelete"
        @close="showDeleteModal = false; productToDelete = null"
        @confirm="handleProductDeleted"
      />
      <NotificationPanel 
        :isOpen="showNotifications"
        :products="products"
        @close="showNotifications = false"
        @viewProduct="viewProductFromNotification"
        @restock="restockProduct"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { MagnifyingGlassIcon, QrCodeIcon, FunnelIcon, BarsArrowUpIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Sidebar from '../components/layout/Sidebar.vue';
import ProductDetail from '../components/ProductDetail.vue';
import BarcodeScanner from '../components/BarcodeScanner.vue';
import AddProductModal from '../components/AddProductModal.vue';
import EditProductModal from '../components/EditProductModal.vue';
import DeleteConfirmModal from '../components/DeleteConfirmModal.vue';
import NotificationPanel from '../components/NotificationPanel.vue';

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
  { name: 'Laptop Gamer X1', category: 'Laptop', sku: 'SKU-84562', quantity: 120, price: '$1,250.00', supplier: 'TechSupplier Inc.', status: 'En Stock', image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg' },
  { name: 'Smartphone Pro', category: 'Smartphone', sku: 'SKU-34789', quantity: 350, price: '$899.99', supplier: 'Gadgetron', status: 'En Stock', image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg' },
  { name: 'Auriculares Inalámbricos', category: 'Audio', sku: 'SKU-11234', quantity: 10, price: '$199.50', supplier: 'AudioPhile Co.', status: 'Bajo Stock', image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg' },
  { name: 'Smartwatch Fit 2', category: 'Wearable', sku: 'SKU-55678', quantity: 0, price: '$250.00', supplier: 'Gadgetron', status: 'Agotado', image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg' },
  { name: 'Cámara DSLR Pro', category: 'Fotografía', sku: 'SKU-99876', quantity: 75, price: '$1,800.00', supplier: 'PhotoGear Ltd.', status: 'En Stock', image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg' },
]);

const selectedProduct: Ref<Product | null> = ref(null);
const showBarcodeScanner = ref(false);
const showAddProductModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showNotifications = ref(false);
const productToEdit: Ref<Product | null> = ref(null);
const productToDelete: Ref<Product | null> = ref(null);

// Computed property to count low stock products
const lowStockCount = computed(() => {
  return products.value.filter(product => product.quantity <= 10).length;
});

const getStatusClass = (status: string) => {
  if (status === 'En Stock') return 'bg-green-100 text-green-800';
  if (status === 'Bajo Stock') return 'bg-yellow-100 text-yellow-800';
  if (status === 'Agotado') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

const handleProductSold = (product: Product) => {
  // Find the product in the array and decrease quantity
  const productIndex = products.value.findIndex(p => p.sku === product.sku);
  if (productIndex !== -1 && products.value[productIndex]) {
    const currentProduct = products.value[productIndex];
    currentProduct.quantity -= 1;
    
    // Update status based on new quantity
    if (currentProduct.quantity === 0) {
      currentProduct.status = 'Agotado';
    } else if (currentProduct.quantity <= 10) {
      currentProduct.status = 'Bajo Stock';
    }
    
    // Close the scanner
    showBarcodeScanner.value = false;
    
    // Show success notification (you can enhance this with a toast notification)
    alert(`✅ Venta exitosa!\n${product.name}\nPrecio: ${product.price}\nStock restante: ${currentProduct.quantity}`);
  }
};

const handleProductAdded = (product: Product) => {
  // Add the new product to the beginning of the array
  products.value.unshift(product);
  
  // Close the modal
  showAddProductModal.value = false;
  
  // Show success notification
  alert(`✅ Producto agregado exitosamente!\n${product.name}\nSKU: ${product.sku}\nCantidad: ${product.quantity}`);
};

const openEditModal = (product: Product) => {
  productToEdit.value = product;
  showEditModal.value = true;
};

const confirmDelete = (product: Product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const handleProductUpdated = (updatedProduct: Product) => {
  // Find the product in the array and update it
  const productIndex = products.value.findIndex(p => p.sku === updatedProduct.sku);
  if (productIndex !== -1) {
    products.value[productIndex] = updatedProduct;
  }
  
  // Close the modal
  showEditModal.value = false;
  productToEdit.value = null;
  
  // Show success notification
  alert(`✅ Producto actualizado exitosamente!\n${updatedProduct.name}\nSKU: ${updatedProduct.sku}`);
};

const handleProductDeleted = () => {
  if (productToDelete.value) {
    // Remove the product from the array
    products.value = products.value.filter(p => p.sku !== productToDelete.value?.sku);
    
    // Show success notification
    alert(`✅ Producto eliminado exitosamente!\n${productToDelete.value.name}`);
  }
  
  // Close the modal
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const viewProductFromNotification = (product: Product) => {
  // Close notifications panel
  showNotifications.value = false;
  
  // Open product detail
  selectedProduct.value = product;
};

const restockProduct = (product: Product) => {
  // Close notifications
  showNotifications.value = false;
  
  // Open edit modal to restock
  productToEdit.value = product;
  showEditModal.value = true;
  
  // Show message
  alert(`📦 Abriendo formulario de edición para reabastecer:\n${product.name}\nStock actual: ${product.quantity} unidades`);
};


</script>
