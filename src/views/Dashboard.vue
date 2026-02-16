<template>
  <DashboardLayout @quick-sell="handleQuickSell">
    <!-- Top Bar -->
    <TopBar
      title="Administración de inventario y ventas"
      description="SISTEMA EN LÍNEA
      "
      :show-alerts="true"
      :low-stock-count="lowStockProducts.length"
      :out-of-stock-count="outOfStockProducts.length"
      @quick-sell="handleQuickSell"
      @add-product="handleAddProduct"
    />

    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="dashboard-container">
        <!-- Welcome Card -->
        <!-- <div class="welcome-card">
          <div class="welcome-card-content">
            <h2 class="welcome-title">Buenos días, {{ userName }}</h2>
            <p class="welcome-subtitle">Tu negocio está creciendo. Los niveles de stock son estables y tienes pedidos pendientes por surtir.</p>
            <div class="welcome-tags">
              <span class="status-tag tag-warning">
                <span class="status-dot"></span>
                <span>{{ lowStockProducts.length }} BAJO STOCK</span>
              </span>
              <span class="status-tag tag-danger">
                <span class="status-dot"></span>
                <span>{{ outOfStockProducts.length }} SIN STOCK</span>
              </span>
            </div>
          </div>
          <div class="welcome-card-action">
             <div class="action-icon-wrapper">
                <div class="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clip-rule="evenodd" />
                  </svg>
                </div>
             </div>
             <h3>¿Listo para realizar una venta?</h3>
             <p>Procesa transacciones en segundos.</p>
             <button class="btn-start-sale" @click="handleQuickSell">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 1.05.328 2.032.891 2.845a4.502 4.502 0 005.157 1.155A4.502 4.502 0 0013.5 19.5a4.502 4.502 0 00.99-9H6.18l-.51-1.912A1.984 1.984 0 003.886 6.75H2.25zM13.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M7.34 6.75L7.85 8.654h13.9a.75.75 0 00.58-1.218 5.755 5.755 0 00-4.08-1.921 7.252 7.252 0 00-4.755 0 5.755 5.755 0 00-4.08 1.921.75.75 0 00-.58 1.218z" />
               </svg>
               Nueva Venta
             </button>
          </div>
        </div> -->

        <!-- Stats Cards -->
        <div class="stats-grid">
          <StatsCard
            label="Productos totales"
            :value="totalProducts"
            :trend="{ direction: 'up', value: '+12% vs last month' }"
            :icon="CubeIcon"
            icon-type="primary"
          />
          <StatsCard
            label="Valor del inventario"
            :value="formatCurrency(inventoryValue) + ' MXN'"
            subtitle="Calculado diariamente"
            :icon="CurrencyDollarIcon"
            icon-type="success"
          />
          <StatsCard
            label="Productos sin stock"
            :value="outOfStockProducts.length"
            :subtitle="outOfStockProducts.length > 0 ? 'Requiere atención' : 'Inventario saludable'"
            :variant="outOfStockProducts.length > 0 ? 'danger' : 'success'"
            :icon="ExclamationTriangleIcon"
            :icon-type="outOfStockProducts.length > 0 ? 'danger' : 'success'"
          />
        </div>

        <!-- Tabs & View Toggle Row -->
        <div class="tabs-actions-row">
          <TabGroup
            v-model="activeTab"
            :tabs="tabs"
            class="flex-1"
          />
          
          <div class="view-toggle">
            <button
              class="view-btn"
              :class="{ 'view-active': viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              class="view-btn"
              :class="{ 'view-active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zM4.25 11A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zM13.25 2A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zM13.25 11A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Product Table -->
        <ProductTable
          v-if="viewMode === 'list'"
          :products="filteredProducts"
          @edit="handleEditProduct"
          @delete="handleDeleteProduct"
          @delete-multiple="handleBulkDelete"
          @restock="handleRestock"
        />

        <!-- Product Grid -->
        <ProductGrid
          v-else
          :products="filteredProducts"
          @edit="handleEditProduct"
          @delete="handleDeleteProduct"
          @restock="handleRestock"
        />

        <!-- Pagination -->
        <Pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalProducts"
        />

      </div>
    </main>

    <!-- SalesModal removed (handled by layout) -->
    
    <AddProductModal
      :is-open="showAddProductModal"
      :product-to-edit="selectedProduct"
      :existing-skus="allSkus"
      @close="showAddProductModal = false"
      @product-added="handleSaveNewProduct"
      @product-updated="handleUpdateProduct"
    />

    <ConfirmationModal
      :is-open="confirmationState.isOpen"
      :title="confirmationState.title"
      :message="confirmationState.message"
      :type="confirmationState.type"
      :confirm-text="confirmationState.confirmText"
      @close="confirmationState.isOpen = false"
      @confirm="handleConfirmation"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  CubeIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  RectangleStackIcon,
  ArchiveBoxXMarkIcon 
} from '@heroicons/vue/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import TopBar from '@/components/layout/TopBar.vue';
// import DashboardOverview from '@/components/dashboard/DashboardOverview.vue';  // TODO: Uncomment when ready
import StatsCard from '@/components/dashboard/StatsCard.vue';
import TabGroup, { type Tab } from '@/components/ui/TabGroup.vue';
import ProductTable, { type Product } from '@/components/dashboard/ProductTable.vue';
import ProductGrid from '@/components/dashboard/ProductGrid.vue';
import AddProductModal from '@/components/AddProductModal.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useProductStore } from '@/stores/product.store';
import { useSalesStore } from '@/stores/sales.store';
import { storeToRefs } from 'pinia';

// Snackbar
const { enqueueSnackbar } = useSnackbar();

// Stores
const productStore = useProductStore();
const salesStore = useSalesStore();

const { 
  products: allProducts,
  totalProducts,
  lowStockProducts,
  outOfStockProducts,
  inventoryValue,
  allSkus
} = storeToRefs(productStore);

const showAddProductModal = ref(false);
const selectedProduct = ref<Product | null>(null);

const confirmationState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'danger' | 'warning' | 'info' | 'success',
  confirmText: 'Confirmar',
  onConfirm: () => {}
});



// Tabs
const activeTab = ref('all');

// Filters type definition
interface Filters {
  category: string;
  supplier: string;
  priceRange: string;
}

// Filters
const filters = ref<Filters>({
  category: '',
  supplier: '',
  priceRange: ''
});

const viewMode = ref<'list' | 'grid'>('list');

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

const filteredProducts = computed(() => {
  let products = [...allProducts.value];

  // Filter by tab
  if (activeTab.value === 'low-stock') {
    products = products.filter(p => p.stock > 0 && p.stock <= 10);
  } else if (activeTab.value === 'out-of-stock') {
    products = products.filter(p => p.stock === 0);
  }

  // Filter by category
  if (filters.value.category) {
    products = products.filter(p => 
      p.category.toLowerCase() === filters.value.category.toLowerCase()
    );
  }

  // Filter by price range
  if (filters.value.priceRange) {
    const parts = filters.value.priceRange.split('-');
    const min = parts[0] ? parseFloat(parts[0]) : 0;
    const max = parts[1] && parts[1].replace('+', '') !== parts[1] 
      ? Infinity 
      : parts[1] ? parseFloat(parts[1]) : Infinity;
    
    products = products.filter(p => {
      if (max === Infinity) return p.price >= min;
      return p.price >= min && p.price <= max;
    });
  }

  return products;
});

const tabs = computed<Tab[]>(() => [
  { id: 'all', label: 'Todos los productos', count: totalProducts.value, icon: RectangleStackIcon },
  { id: 'low-stock', label: 'Bajo inventario', count: lowStockProducts.value.length, icon: ExclamationTriangleIcon },
  { id: 'out-of-stock', label: 'Sin inventario', count: outOfStockProducts.value.length, icon: ArchiveBoxXMarkIcon },
]);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

// Handlers
const handleQuickSell = () => {
  salesStore.openModal();
};

const handleAddProduct = () => {
  selectedProduct.value = null; // Clear selected product for new addition
  showAddProductModal.value = true;
};

const handleSaveNewProduct = (newProduct: Product) => {
  productStore.addProduct(newProduct);
  enqueueSnackbar({
    type: 'success',
    title: 'Producto Agregado',
    message: `${newProduct.name} se agregó al inventario exitosamente.`,
    duration: 3000
  });
};

const handleEditProduct = (product: Product) => {
  selectedProduct.value = product;
  showAddProductModal.value = true;
};

const handleUpdateProduct = (updatedProduct: Product) => {
  productStore.updateProduct(updatedProduct);
  enqueueSnackbar({
    type: 'success',
    title: 'Producto Actualizado',
    message: `${updatedProduct.name} ha sido actualizado correctamente.`,
    duration: 3000
  });
};

const handleDeleteProduct = (product: Product) => {
  confirmationState.value = {
    isOpen: true,
    title: 'Eliminar Producto',
    message: `¿Estás seguro de que deseas eliminar ${product.name}? Esta acción no se puede deshacer.`,
    type: 'danger',
    confirmText: 'Sí, eliminar',
    onConfirm: () => {
      productStore.deleteProduct(product.id);
      enqueueSnackbar({
        type: 'success',
        title: 'Producto Eliminado',
        message: `${product.name} ha sido eliminado del inventario.`,
        duration: 3000
      });
      confirmationState.value.isOpen = false;
    }
  };
};

const handleBulkDelete = (ids: string[]) => {
  confirmationState.value = {
    isOpen: true,
    title: 'Eliminar Productos',
    message: `¿Estás seguro de que deseas eliminar ${ids.length} productos seleccionados? Esta acción no se puede deshacer.`,
    type: 'danger',
    confirmText: `Sí, eliminar ${ids.length} productos`,
    onConfirm: () => {
      productStore.bulkDeleteProducts(ids);
      enqueueSnackbar({
        type: 'success',
        title: 'Productos Eliminados',
        message: `${ids.length} productos han sido eliminados del inventario.`,
        duration: 3000
      });
      confirmationState.value.isOpen = false;
    }
  };
};

const handleRestock = (product: Product) => {
  selectedProduct.value = product;
  showAddProductModal.value = true;
  enqueueSnackbar({
    type: 'info',
    title: 'Reabastecer Producto',
    message: 'Actualiza el campo de "Stock" para agregar inventario.',
    duration: 5000
  });
};

const handleConfirmation = () => {
  confirmationState.value.onConfirm();
};
</script>

<style scoped>
.dashboard-main {
  flex: 1;
  overflow-y: auto;
  background: #f2f3f5;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.tabs-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.view-btn {
  padding: 0.5rem;
  background: white;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  width: 20px;
  height: 20px;
}

.view-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.view-active {
  background: var(--color-brand-secondary) !important;
  color: white !important;
}

.view-btn:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}


@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .dashboard-top {
    grid-template-columns: 1fr;
  }
}


@media (max-width: 640px) {
  .dashboard-container {
    padding: 1rem;
  }
}

.welcome-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-card-border);
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  color: #6B7280;
  margin-bottom: 1.5rem;
  max-width: 500px;
  line-height: 1.5;
}

.welcome-tags {
  display: flex;
  gap: 1rem;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tag-warning {
  background: #FFF7ED;
  color: #C2410C;
}

.tag-danger {
  background: #FEF2F2;
  color: #DC2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.welcome-card-action {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-left: 2rem;
  border-left: 1px solid #F3F4F6;
}

.action-icon-wrapper {
  background: #FFF7ED;
  padding: 0.75rem;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}
.action-icon {
    color: #F97316;
    width: 24px;
    height: 24px;
}
.action-icon svg {
    width: 100%;
    height: 100%;
}

.welcome-card-action h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.welcome-card-action p {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0 0 1rem 0;
}

.btn-start-sale {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #F97316 0%, #EA580C 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.1), 0 2px 4px -1px rgba(234, 88, 12, 0.06);
}

.btn-start-sale svg {
  width: 20px;
  height: 20px;
}

.btn-start-sale:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3), 0 4px 6px -2px rgba(234, 88, 12, 0.1);
}

.fab-sell {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(180deg, #F97316 0%, #EA580C 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 50;
}

.fab-sell:hover {
  transform: scale(1.1);
}

.fab-sell svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 1024px) {
  .welcome-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
  
  .welcome-card-action {
    width: 100%;
    border-left: none;
    padding-left: 0;
    border-top: 1px solid #F3F4F6;
    padding-top: 2rem;
  }
}
</style>
