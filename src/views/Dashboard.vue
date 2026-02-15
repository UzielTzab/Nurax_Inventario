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
            :value="1248"
            :trend="{ direction: 'up', value: '+12% vs last month' }"
          />
          <StatsCard
            label="Valor del inventario"
            value="$45,280 MXN"
            subtitle="Calculado diariamente"
          />
          <StatsCard
            label="Pedidos activos"
            :value="12"
            subtitle="Requiere acción"
          />
          <StatsCard
            label="Alertas de proveedores"
            value="02"
            subtitle="Pending review"
          />
        </div>

        <!-- Tabs -->
        <TabGroup
          v-model="activeTab"
          :tabs="tabs"
        />

        <!-- Filter Bar -->
        <FilterBar
          v-model:filters="filters"
          v-model:view="viewMode"
        />

        <!-- Product Table -->
        <ProductTable
          :products="filteredProducts"
          @edit="handleEditProduct"
          @delete="handleDeleteProduct"
        />

        <!-- Pagination -->
        <Pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalProducts"
        />

        <!-- Floating Action Button -->
         <button class="fab-sell" @click="handleQuickSell">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 1.05.328 2.032.891 2.845a4.502 4.502 0 005.157 1.155A4.502 4.502 0 0013.5 19.5a4.502 4.502 0 00.99-9H6.18l-.51-1.912A1.984 1.984 0 003.886 6.75H2.25zM13.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M7.34 6.75L7.85 8.654h13.9a.75.75 0 00.58-1.218 5.755 5.755 0 00-4.08-1.921 7.252 7.252 0 00-4.755 0 5.755 5.755 0 00-4.08 1.921.75.75 0 00-.58 1.218z" />
            </svg>
         </button>
      </div>
    </main>

    <SalesModal 
      :is-open="showSalesModal" 
      :products="allProducts"
      @close="showSalesModal = false" 
    />
    
    <AddProductModal
      :is-open="showAddProductModal"
      @close="showAddProductModal = false"
      @product-added="handleSaveNewProduct"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import TopBar from '@/components/layout/TopBar.vue';
// import DashboardOverview from '@/components/dashboard/DashboardOverview.vue';  // TODO: Uncomment when ready
import StatsCard from '@/components/dashboard/StatsCard.vue';
import TabGroup, { type Tab } from '@/components/ui/TabGroup.vue';
import FilterBar, { type Filters } from '@/components/dashboard/FilterBar.vue';
import ProductTable, { type Product } from '@/components/dashboard/ProductTable.vue';
import SalesModal from '@/components/SalesModal.vue';
import AddProductModal from '@/components/AddProductModal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { useSnackbar } from '@/composables/useSnackbar';

// Snackbar
const { enqueueSnackbar } = useSnackbar();

const showSalesModal = ref(false);
const showAddProductModal = ref(false);

// User data
const userName = ref('Leonez');

// Tabs
const activeTab = ref('all');
const tabs = ref<Tab[]>([
  { id: 'all', label: 'Todos los productos', count: 45 },
  { id: 'low-stock', label: 'Bajo inventario', count: 3 },
  { id: 'out-of-stock', label: 'Sin inventario', count: 1 },
  { id: 'categories', label: 'Categorias' }
]);

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

// Sample products data
const allProducts = ref<Product[]>([
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

const totalProducts = computed(() => allProducts.value.length);

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

// Products with low stock (1-10 units)
const lowStockProducts = computed(() => {
  return allProducts.value.filter(p => p.stock > 0 && p.stock <= 10);
});

// Products out of stock
const outOfStockProducts = computed(() => {
  return allProducts.value.filter(p => p.stock === 0);
});
// Handlers
const handleQuickSell = () => {
  showSalesModal.value = true;
};

const handleAddProduct = () => {
  showAddProductModal.value = true;
};

const handleSaveNewProduct = (newProduct: Product) => {
  allProducts.value.push(newProduct); // Add to local state
  enqueueSnackbar({
    type: 'success',
    title: 'Producto Agregado',
    message: `${newProduct.name} se agregó al inventario exitosamente.`,
    duration: 3000
  });
};

const handleEditProduct = (product: Product) => {
  console.log('Edit product:', product);
  // Implementar lógica de edición
};

const handleDeleteProduct = (product: Product) => {
  console.log('Delete product:', product);
  // Implementar lógica de eliminación
};

// Show welcome message when dashboard loads
onMounted(() => {
  enqueueSnackbar({
    type: 'success',
    title: `Bienvenido, ${userName.value}! 👋`,
    message: 'El sistema esta en estado saludable. Tienes acciones de inventario pendientes que requieren tu atención para mantener niveles optimales de stock.',
    duration: 12000
  });
});
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
