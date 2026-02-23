<template>
  <div class="flex h-screen bg-dark-main text-white">
    <Sidebar 
      :isOpen="isSidebarOpen"
      @close="isSidebarOpen = false"
      @openAddProduct="showAddProductModal = true" 
      @openInventoryReceipt="showInventoryReceipt = true"
    />
    <div class="flex-1 flex flex-col overflow-hidden lg:ml-[220px]">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-dark-main">
        <div class="container mx-auto px-6 py-8">
          <!-- Header con título y notificaciones -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <!-- Mobile Sidebar Toggle -->
              <button 
                @click="isSidebarOpen = true" 
                class="lg:hidden p-2 text-gray-400 hover:bg-white/10 rounded-lg"
              >
                <Bars3Icon class="h-6 w-6" />
              </button>
              
              <div>
                <h3 class="text-white text-2xl lg:text-3xl font-bold tracking-tight">Inventario</h3>
                <p class="text-gray-400 text-sm lg:text-base">Administra tus productos</p>
              </div>
            </div>
            
            <!-- Botón de notificaciones -->
            <button 
              @click="showNotifications = true" 
              class="relative p-2 text-gray-400 hover:bg-white/10 rounded-full transition-colors"
              title="Notificaciones"
            >
              <BellAlertIcon class="h-6 w-6" />
              <span 
                v-if="lowStockCount > 0" 
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
              >
                {{ lowStockCount }}
              </span>
            </button>
          </div>
          
          <!-- Contenedor para botón y búsqueda/filtros en la misma fila -->
          <div class="mt-6 flex flex-col lg:flex-row gap-4 items-center">            
            <!-- Contenedor oscuro con sombra para búsqueda y filtros -->
            <div class="flex-1 bg-dark-card rounded-xl border border-dark-border p-4">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <!-- Buscador -->
                <div class="relative flex-1 max-w-lg">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
                  </span>
                  <input 
                    v-model="searchQuery"
                    class="w-full pl-10 pr-4 py-2 bg-dark-input border border-dark-border text-white rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent placeholder-gray-500 transition-all" 
                    type="text" 
                    placeholder="Buscar por nombre, SKU o proveedor"
                  >
                </div>
                
                <!-- Filtros y ordenamiento -->
                <div class="flex items-center gap-3">
                  <!-- Filtro por categoría -->
                  <div class="relative">
                    <button 
                      @click="showCategoryFilter = !showCategoryFilter"
                      class="flex items-center px-4 py-2 bg-dark-input border border-dark-border rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <FunnelIcon class="h-5 w-5 mr-2 text-gray-400" />
                      <span class="text-white">{{ selectedCategory || 'Categoría' }}</span>
                    </button>
                      <div 
                        v-if="showCategoryFilter" 
                        class="absolute z-10 mt-2 w-48 bg-dark-card rounded-lg shadow-xl border border-dark-border overflow-hidden"
                      >
                        <button 
                          @click="selectedCategory = ''; showCategoryFilter = false"
                          class="w-full text-left px-4 py-2 hover:bg-white/5"
                        >
                          Todas las categorías
                        </button>
                        <button 
                          v-for="category in categories" 
                          :key="category"
                          @click="selectedCategory = category; showCategoryFilter = false"
                          class="w-full text-left px-4 py-2 hover:bg-white/5"
                          :class="{ 'bg-brand-primary/20 text-brand-primary': selectedCategory === category }"
                        >
                          {{ category }}
                        </button>
                      </div>
                  </div>
          
                  <!-- Filtro por estado -->
                  <div class="relative">
                    <button 
                      @click="showStatusFilter = !showStatusFilter"
                      class="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FunnelIcon class="h-5 w-5 mr-2 text-gray-600" />
                      <span class="text-gray-700">{{ selectedStatus || 'Estado' }}</span>
                    </button>
                    <div 
                      v-if="showStatusFilter" 
                      class="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <button 
                        @click="selectedStatus = ''; showStatusFilter = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                      >
                        Todos los estados
                      </button>
                      <button 
                        v-for="status in statuses" 
                        :key="status"
                        @click="selectedStatus = status; showStatusFilter = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50"
                        :class="{ 'bg-indigo-50 text-indigo-600': selectedStatus === status }"
                      >
                        {{ status }}
                      </button>
                    </div>
                  </div>
          
                  <!-- Ordenamiento -->
                  <div class="relative">
                    <button 
                      @click="showSortOptions = !showSortOptions"
                      class="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BarsArrowUpIcon class="h-5 w-5 mr-2 text-gray-600" />
                      <span class="text-gray-700">Ordenar</span>
                    </button>
                    <div 
                      v-if="showSortOptions" 
                      class="absolute z-10 mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <button 
                        @click="sortBy = 'name'; showSortOptions = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                        :class="{ 'bg-indigo-50 text-indigo-600': sortBy === 'name' }"
                      >
                        Por nombre (A-Z)
                      </button>
                      <button 
                        @click="sortBy = 'quantity-asc'; showSortOptions = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50"
                        :class="{ 'bg-indigo-50 text-indigo-600': sortBy === 'quantity-asc' }"
                      >
                        Cantidad (menor a mayor)
                      </button>
                      <button 
                        @click="sortBy = 'quantity-desc'; showSortOptions = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50"
                        :class="{ 'bg-indigo-50 text-indigo-600': sortBy === 'quantity-desc' }"
                      >
                        Cantidad (mayor a menor)
                      </button>
                      <button 
                        @click="sortBy = 'price-asc'; showSortOptions = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50"
                        :class="{ 'bg-indigo-50 text-indigo-600': sortBy === 'price-asc' }"
                      >
                        Precio (menor a mayor)
                      </button>
                      <button 
                        @click="sortBy = 'price-desc'; showSortOptions = false"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg"
                        :class="{ 'bg-indigo-50 text-indigo-600': sortBy === 'price-desc' }"
                      >
                        Precio (mayor a menor)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          
              <!-- Filtros activos -->
              <div v-if="selectedCategory || selectedStatus || searchQuery" class="mt-3 flex flex-wrap gap-2">
                <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                  Búsqueda: "{{ searchQuery }}"
                  <button @click="searchQuery = ''" class="ml-2 hover:text-indigo-900">×</button>
                </span>
                <span v-if="selectedCategory" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Categoría: {{ selectedCategory }}
                  <button @click="selectedCategory = ''" class="ml-2 hover:text-blue-900">×</button>
                </span>
                <span v-if="selectedStatus" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Estado: {{ selectedStatus }}
                  <button @click="selectedStatus = ''" class="ml-2 hover:text-green-900">×</button>
                </span>
              </div>
            </div>
            <!-- Botón Escanear Barcode -->
            <div class="lg:flex-shrink-0">
              <AppButton variant="fill" class="w-full lg:w-auto" @click="showBarcodeScanner = true">
                <QrCodeIcon />
                Vender
              </AppButton>
            </div>
          </div>

          <div class="mt-8">
            <div class="flex flex-col">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="shadow-2xl overflow-hidden border border-dark-border sm:rounded-xl bg-dark-card">
                    <table class="min-w-full divide-y divide-dark-border">
                      <thead class="bg-white/5">
                        <tr>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Producto</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Modo</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Cantidad</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Precio</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Proveedor</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                          <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-dark-border">
                        <tr v-if="filteredProducts.length === 0">
                          <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                            <div class="flex flex-col items-center">
                              <MagnifyingGlassIcon class="h-12 w-12 text-gray-400 mb-2" />
                              <p class="text-lg font-medium">No se encontraron productos</p>
                              <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                          </td>
                        </tr>
                        <tr 
                          v-for="product in filteredProducts" 
                          :key="product.sku" 
                          @click="selectedProduct = product"
                          class="hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10" :src="product.image" alt="">
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-bold text-white">{{ product.name }}</div>
                                <div class="text-xs text-gray-500">{{ product.category }}</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap" @click.stop>
                            <div class="flex items-center gap-2">
                              <span class="text-sm text-gray-400 font-mono">{{ product.sku }}</span>
                              <button 
                                @click="copyToClipboard(product.sku)"
                                class="text-gray-500 hover:text-brand-primary transition-colors"
                                title="Copiar SKU"
                              >
                                <ClipboardIcon class="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span 
                              :class="[
                                'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full',
                                product.trackingMode === 'serialized' ? 'bg-purple-500/10 text-purple-400' : 'bg-brand-accent/10 text-brand-accent'
                              ]"
                            >
                              {{ product.trackingMode === 'serialized' ? 'Serial' : 'Bulk' }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.quantity }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.price }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.supplier }}</td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getStatusClass(product.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              {{ product.status }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                            <div class="flex gap-4">
                              <button @click="openEditModal(product)" class="text-gray-400 hover:text-white transition-colors" title="Editar">
                                <PencilIcon class="h-5 w-5" />
                              </button>
                              <button @click="confirmDelete(product)" class="text-gray-400 hover:text-status-danger transition-colors" title="Eliminar">
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
      <ProductDetail 
        :product="selectedProduct" 
        v-if="selectedProduct" 
        @close="selectedProduct = null"
        @restock="restockFromDetail"
      />
      <BarcodeScanner 
        :isOpen="showBarcodeScanner" 
        :products="products" 
        @close="showBarcodeScanner = false"
        @productSold="handleProductSold"
      />
      <AddProductModal 
        :isOpen="showAddProductModal"
        :existingSkus="products.map(p => p.sku)"
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
        :products="(products as any)"
        @close="showNotifications = false"
        @viewProduct="viewProductFromNotification"
        @restock="restockProduct"
      />
      <InventoryReceiptModal 
        :isOpen="showInventoryReceipt"
        :products="products"
        :preSelectedProduct="productToRestock"
        @close="showInventoryReceipt = false; productToRestock = null"
        @inventoryAdded="handleInventoryAdded"
      />
      <SaleSuccessModal 
        :isOpen="showSaleSuccess"
        :cart="[{
          id: 'sale-item',
          name: saleDetails.productName,
          price: parseFloat(saleDetails.unitPrice.replace(/[$,]/g, '')) || 0,
          quantity: saleDetails.quantity
        }]"
        :total="(parseFloat(saleDetails.unitPrice.replace(/[$,]/g, '')) || 0) * saleDetails.quantity"
        @close="showSaleSuccess = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { MagnifyingGlassIcon, QrCodeIcon, FunnelIcon, BarsArrowUpIcon, PencilIcon, TrashIcon, BellAlertIcon, ClipboardIcon, Bars3Icon } from '@heroicons/vue/24/outline';

const isSidebarOpen = ref(false);
import Sidebar from '../components/layout/Sidebar.vue';
import ProductDetail from '../components/ProductDetail.vue';
import BarcodeScanner from '../components/BarcodeScanner.vue';
import AddProductModal from '../components/AddProductModal.vue';
import EditProductModal from '../components/EditProductModal.vue';
import DeleteConfirmModal from '../components/DeleteConfirmModal.vue';
import NotificationPanel from '../components/NotificationPanel.vue';
import InventoryReceiptModal from '../components/InventoryReceiptModal.vue';
import SaleSuccessModal from '../components/SaleSuccessModal.vue';

// Tipos de datos
interface SerializedItem {
  serialNumber: string;
  barcode: string;
  status: 'available' | 'sold' | 'reserved';
  soldTo?: string;
  soldDate?: string;
  saleTicket?: string;
}

interface Product {
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: string;
  supplier: string;
  status: string;
  image: string;
  barcode: string;
  trackingMode: 'bulk' | 'serialized'; // Modo de rastreo
  serializedItems?: SerializedItem[]; // Items individuales
  // Nuevos campos para código de barras de fábrica
  barcodeType: 'generated' | 'factory'; // Tipo de código de barras
  factoryBarcode?: string; // Código de barras real del producto de fábrica
  brand?: string; // Marca del producto
  model?: string; // Modelo del producto
}

const products: Ref<Product[]> = ref([
  { 
    name: 'Laptop Gamer X1', 
    category: 'Laptop', 
    sku: 'SKU-84562', 
    quantity: 3, 
    price: '$1,250.00', 
    supplier: 'TechSupplier Inc.', 
    status: 'En Stock', 
    image: 'https://imggraficos.gruporeforma.com/2022/05/Laptops-gamer-asus-hot-sale-2022-2.png',
    barcode: '7891234567890',
    trackingMode: 'serialized',
    barcodeType: 'generated',
    serializedItems: [
      { serialNumber: 'SN-LAP-001', barcode: '7891234567891', status: 'available' },
      { serialNumber: 'SN-LAP-002', barcode: '7891234567892', status: 'available' },
      { serialNumber: 'SN-LAP-003', barcode: '7891234567893', status: 'available' }
    ]
  },
  { 
    name: 'Smartphone Pro', 
    category: 'Smartphone', 
    sku: 'SKU-34789', 
    quantity: 2, 
    price: '$899.99', 
    supplier: 'Gadgetron', 
    status: 'En Stock', 
    image: 'https://images.samsung.com/is/image/samsung/p6pim/mx/sm-a175flbiltm/gallery/mx-galaxy-a17-sm-a175-sm-a175flbiltm-thumb-549075941',
    barcode: '7891234567894',
    trackingMode: 'serialized',
    barcodeType: 'generated',
    serializedItems: [
      { serialNumber: 'IMEI-123456789', barcode: '7891234567895', status: 'available' },
      { serialNumber: 'IMEI-123456790', barcode: '7891234567896', status: 'available' }
    ]
  },
  { 
    name: 'Auriculares Inalámbricos', 
    category: 'Audio', 
    sku: 'SKU-11234', 
    quantity: 10, 
    price: '$199.50', 
    supplier: 'AudioPhile Co.', 
    status: 'Bajo Stock', 
    image: 'https://m.media-amazon.com/images/I/71RjIshY0GL.jpg',
    barcode: '7891234567897',
    trackingMode: 'bulk',
    barcodeType: 'generated'
  },
  { 
    name: 'Smartwatch Fit 2', 
    category: 'Wearable', 
    sku: 'SKU-55678', 
    quantity: 0, 
    price: '$250.00', 
    supplier: 'Gadgetron', 
    status: 'Agotado', 
    image: 'https://m.media-amazon.com/images/I/71qth-es3nL._AC_SX679_.jpg',
    barcode: '7891234567898',
    trackingMode: 'bulk',
    barcodeType: 'generated'
  },
  { 
    name: 'Cámara DSLR Pro', 
    category: 'Fotografía', 
    sku: 'SKU-99876', 
    quantity: 75, 
    price: '$1,800.00', 
    supplier: 'PhotoGear Ltd.', 
    status: 'En Stock', 
    image: 'https://www.canon.com.mx/datacenter/image/resize-center/328x328/imagenesproducto/fichero/3512_EOS_6D_Mark_II_01.jpg/',
    barcode: '7891234567899',
    trackingMode: 'bulk',
    barcodeType: 'generated'
  },
]);

const selectedProduct: Ref<Product | null> = ref(null);
const showBarcodeScanner = ref(false);
const showAddProductModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showNotifications = ref(false);
const showInventoryReceipt = ref(false);
const showSaleSuccess = ref(false);
const productToEdit: Ref<Product | null> = ref(null);
const productToDelete: Ref<Product | null> = ref(null);
const productToRestock: Ref<Product | null> = ref(null);

// Sale details for success modal
const saleDetails = ref({
  productName: '',
  unitPrice: '',
  quantity: 1,
  remainingStock: 0,
  serialNumber: ''
});

// Search and filter states
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const sortBy = ref('name');
const showCategoryFilter = ref(false);
const showStatusFilter = ref(false);
const showSortOptions = ref(false);

// Get unique categories and statuses from products
const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.category))];
  return uniqueCategories.sort();
});

const statuses = computed(() => {
  const uniqueStatuses = [...new Set(products.value.map(p => p.status))];
  return uniqueStatuses.sort();
});

// Filtered and sorted products
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.supplier.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }

  // Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(product => product.status === selectedStatus.value);
  }

  // Apply sorting
  const sorted = [...filtered];
  switch (sortBy.value) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'quantity-asc':
      sorted.sort((a, b) => a.quantity - b.quantity);
      break;
    case 'quantity-desc':
      sorted.sort((a, b) => b.quantity - a.quantity);
      break;
    case 'price-asc':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[$,]/g, ''));
        const priceB = parseFloat(b.price.replace(/[$,]/g, ''));
        return priceA - priceB;
      });
      break;
    case 'price-desc':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[$,]/g, ''));
        const priceB = parseFloat(b.price.replace(/[$,]/g, ''));
        return priceB - priceA;
      });
      break;
  }

  return sorted;
});

// Computed property to count low stock products
const lowStockCount = computed(() => {
  return products.value.filter(product => product.quantity <= 10).length;
});

const getStatusClass = (status: string) => {
  if (status === 'En Stock') return 'bg-brand-secondary/10 text-brand-secondary';
  if (status === 'Bajo Stock') return 'bg-brand-primary/10 text-brand-primary';
  if (status === 'Agotado') return 'bg-status-danger/10 text-status-danger';
  return 'bg-gray-100/10 text-gray-400';
};

// Copy SKU to clipboard
const copyToClipboard = async (sku: string) => {
  try {
    await navigator.clipboard.writeText(sku);
    alert(`✅ SKU copiado al portapapeles:\n${sku}`);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = sku;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert(`✅ SKU copiado al portapapeles:\n${sku}`);
    } catch (e) {
      alert('❌ Error al copiar el SKU');
    }
    document.body.removeChild(textArea);
  }
};

const handleProductSold = (product: Product, serialItem?: SerializedItem, quantity: number = 1) => {
  // Find the product in the array
  const productIndex = products.value.findIndex(p => p.sku === product.sku);
  if (productIndex !== -1 && products.value[productIndex]) {
    const currentProduct = products.value[productIndex];
    
    if (product.trackingMode === 'serialized' && serialItem) {
      // Serialized mode: mark the specific item as sold
      if (currentProduct.serializedItems) {
        const itemIndex = currentProduct.serializedItems.findIndex(
          item => item.serialNumber === serialItem.serialNumber
        );
        if (itemIndex !== -1 && currentProduct.serializedItems[itemIndex]) {
          currentProduct.serializedItems[itemIndex].status = 'sold';
          currentProduct.serializedItems[itemIndex].soldDate = new Date().toISOString();
          currentProduct.serializedItems[itemIndex].saleTicket = `VT-${Date.now()}`;
        }
        // Update quantity based on available items
        currentProduct.quantity = currentProduct.serializedItems.filter(
          item => item.status === 'available'
        ).length;
      }
    } else {
      // Bulk mode: decrease quantity by the specified amount
      if (quantity > currentProduct.quantity) {
        alert(`❌ Error: No hay suficiente inventario.\n\nSolicitado: ${quantity}\nDisponible: ${currentProduct.quantity}`);
        return;
      }
      currentProduct.quantity -= quantity;
    }
    
    // Update status based on new quantity
    if (currentProduct.quantity === 0) {
      currentProduct.status = 'Agotado';
    } else if (currentProduct.quantity <= 10) {
      currentProduct.status = 'Bajo Stock';
    }
    
    // Close the scanner
    showBarcodeScanner.value = false;
    
    // Prepare sale details for modal
    saleDetails.value = {
      productName: product.name,
      unitPrice: product.price,
      quantity: quantity,
      remainingStock: currentProduct.quantity,
      serialNumber: serialItem ? serialItem.serialNumber : ''
    };
    
    // Show success modal
    showSaleSuccess.value = true;
  }
};

const handleProductAdded = (product: any) => {
  // Map incoming product (potentially from store/modal with different shape) to local shape
  const quantity = product.quantity ?? product.stock ?? 0;
  const price = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price;
  
  // Determine status
  let status = 'En Stock';
  if (quantity === 0) status = 'Agotado';
  else if (quantity <= 10) status = 'Bajo Stock';

  const newProduct: Product = {
    ...product,
    quantity,
    price,
    status,
    // ensure required fields if missing
    supplier: product.supplier || 'Proveedor Desconocido',
    image: product.image || 'https://via.placeholder.com/150',
    barcode: product.barcode || '',
    trackingMode: product.trackingMode || 'bulk'
  };

  // Add the new product to the beginning of the array
  products.value.unshift(newProduct);
  
  // Close the modal
  showAddProductModal.value = false;
  
  // Show success notification
  alert(`✅ Producto agregado exitosamente!\n${newProduct.name}\nSKU: ${newProduct.sku}\nCantidad: ${newProduct.quantity}`);
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

const viewProductFromNotification = (product: any) => {
  // Close notifications panel
  showNotifications.value = false;
  
  // Open product detail
  selectedProduct.value = product;
};

const restockProduct = (product: any) => {
  // Close notifications
  showNotifications.value = false;
  
  // Open inventory receipt modal with pre-selected product
  productToRestock.value = product;
  showInventoryReceipt.value = true;
};

const restockFromDetail = (product: Product) => {
  // Close product detail
  selectedProduct.value = null;
  
  // Open inventory receipt modal with pre-selected product
  productToRestock.value = product;
  showInventoryReceipt.value = true;
};

const handleInventoryAdded = (product: Product, quantity: number, serialNumbers?: SerializedItem[]) => {
  // Find the product in the array
  const productIndex = products.value.findIndex(p => p.sku === product.sku);
  
  if (productIndex !== -1) {
    const existingProduct = products.value[productIndex];
    
    if (existingProduct) {
      if (product.trackingMode === 'bulk') {
        // Bulk mode: just add the quantity
        existingProduct.quantity += quantity;
      } else {
        // Serialized mode: add the serial numbers
        if (serialNumbers) {
          if (!existingProduct.serializedItems) {
            existingProduct.serializedItems = [];
          }
          existingProduct.serializedItems.push(...serialNumbers);
          existingProduct.quantity = existingProduct.serializedItems.length;
        }
      }
      
      // Update status based on new quantity
      if (existingProduct.quantity === 0) {
        existingProduct.status = 'Agotado';
      } else if (existingProduct.quantity <= 10) {
        existingProduct.status = 'Bajo Stock';
      } else {
        existingProduct.status = 'En Stock';
      }
    }
  }
  
  // Close the modal
  showInventoryReceipt.value = false;
};

</script>
