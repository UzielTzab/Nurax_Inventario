<template>
  <DashboardLayout @quick-sell="handleQuickSell">


    <!-- Main Content -->
    <div class="inventory-wrapper">
      <div class="inventory-inner">
        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Inventario</h1>
            <p class="page-subtitle">Administración de inventario y ventas</p>
          </div>
          <div class="header-actions">
            <AppButton variant="outline" :icon="PlusIcon" @click="handleAddProduct">
              Nuevo Producto
            </AppButton>
            <AppButton variant="outline" :icon="ArrowUpTrayIcon" @click="handleOpenImportExcel">
              Importar Excel/CSV
            </AppButton>
          </div>
        </div>
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
          <template v-if="isLoading">
            <div v-for="i in 3" :key="'sk-stat-'+i" class="skeleton-stat-card">
              <AppSkeleton width="44px" height="44px" radius="10px" />
              <div style="flex:1; display:flex; flex-direction:column; gap:0.5rem;">
                <AppSkeleton width="110px" height="0.75rem" />
                <AppSkeleton width="60px" height="1.75rem" />
              </div>
            </div>
          </template>
          <template v-else>
          <StatsCard
            label="Productos totales"
            :value="pagination.count"
            :icon="CubeIcon"
            icon-type="brand"
            variant="brand"
          />
          <StatsCard
            v-if="canViewInventoryValue"
            label="Valor del inventario"
            :value="formatCurrency(inventoryValue)"
            :icon="CurrencyDollarIcon"
            icon-type="success"
          />
          <StatsCard
            v-else
            label="Turno actual"
            :value="'Activo'"
            :icon="CurrencyDollarIcon"
            icon-type="success"
          />
          <StatsCard
            label="Alertas de stock"
            :value="lowStockProducts.length"
            :variant="lowStockProducts.length > 0 ? 'danger' : 'success'"
            :icon="ExclamationTriangleIcon"
            :icon-type="lowStockProducts.length > 0 ? 'danger' : 'success'"
            subtitle="Productos con menos de 5 unidades"
          />

          </template>
        </div>

        <!-- Skeleton: Product Table -->
        <template v-if="isLoading">
          <div class="skeleton-table-wrap">
            <div class="skeleton-table-header">
              <AppSkeleton width="160px" height="1rem" />
              <AppSkeleton width="90px" height="2rem" radius="9999px" />
            </div>
            <div v-for="i in 6" :key="'sk-row-'+i" class="skeleton-table-row">
              <div class="skeleton-cell-product">
                <AppSkeleton width="46px" height="46px" radius="10px" />
                <div style="display:flex;flex-direction:column;gap:0.4rem;">
                  <AppSkeleton width="130px" height="0.9rem" />
                  <AppSkeleton width="80px" height="0.75rem" />
                </div>
              </div>
              <AppSkeleton width="80px" height="0.875rem" />
              <AppSkeleton width="40px" height="0.875rem" />
              <AppSkeleton width="80px" height="0.875rem" />
              <AppSkeleton width="70px" height="1.4rem" radius="20px" />
              <AppSkeleton width="32px" height="32px" radius="6px" />
            </div>
          </div>
        </template>

        <!-- Product Table (with integrated filter panel) -->
        <template v-else>
          <ProductTable
            :products="products"
            :filters="apiFilters"
            :suppliers="supplierOptions"
            :user-role="currentUser?.role"
            :low-stock-count="lowStockProducts.length"
            :out-of-stock-count="outOfStockProducts.length"
            @edit="handleEditProduct"
            @delete="handleDeleteProduct"
            @delete-multiple="handleBulkDelete"
            @restock="handleRestock"
            @adjust-stock="handleInlineStockAdjustment"
            @update:filters="onFiltersUpdate"
          />

          <!-- Pagination -->
          <Pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :total="pagination.count"
            @update:current-page="goToPage"
            @update:page-size="setPageSize"
          />
        </template>

      </div>
    </div>

    <!-- SalesModal removed (handled by layout) -->
    
    <AddProductModal
      :is-open="showAddProductModal"
      :product-to-edit="selectedProduct"
      :existing-skus="allSkus"
      :loading="isSubmitting"
      @close="showAddProductModal = false"
      @product-added="handleSaveNewProduct"
      @product-updated="handleUpdateProduct"
    />

    <FirstProductModal
      :is-open="showFirstProductModal"
      @close="showFirstProductModal = false"
      @create-product="handleFirstProductCreate"
      @load-excel="handleFirstProductLoadExcel"
    />

    <RestockModal
      v-if="selectedProductForRestock"
      :is-open="showRestockModal"
      :product-id="selectedProductForRestock.id"
      @cancel="showRestockModal = false"
      @confirm="onRestockConfirm"
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Pusher from 'pusher-js';
import { 
  CubeIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppSkeleton from '@/components/ui/AppSkeleton.vue';

// import DashboardOverview from '@/components/dashboard/DashboardOverview.vue';  // TODO: Uncomment when ready
import StatsCard from '@/components/dashboard/StatsCard.vue';
import ProductTable, { type Product as TableProduct } from '@/components/dashboard/ProductTable.vue';
import AddProductModal from '@/components/AddProductModal.vue';
import FirstProductModal from '@/components/FirstProductModal.vue';
import RestockModal from '@/components/RestockModal.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuth } from '@/composables/useAuth';
import { useProducts } from '@/composables/useProducts';
import { useProductStore } from '@/stores/product.store';
import { useSalesStore } from '@/stores/sales.store';
import { useSuppliers } from '@/composables/useSuppliers';

// Snackbar
const { enqueueSnackbar } = useSnackbar();
const { currentUser } = useAuth();

// Composables para paginación y filtros
const {
  products,
  isLoading,
  pagination,
  filters: apiFilters,
  fetchProducts,
  applyFilters,
  setPageSize,
  goToPage,
  lowStockProducts,
  outOfStockProducts,
  inventoryValue,
  allSkus,
} = useProducts();

const { suppliers, fetchSuppliers } = useSuppliers();

// Store para operaciones CRUD
const productStore = useProductStore();

// Stores
const salesStore = useSalesStore();

// Pusher setup
let pusher: Pusher | null = null;
let channel: any = null;

onMounted(async () => {
  await fetchProducts();
  await fetchSuppliers();
  
  // Mostrar FirstProductModal si no hay productos
  if (pagination.value.count === 0) {
    showFirstProductModal.value = true;
  }
  
  await salesStore.fetchSales();
  
  // Inicializar Pusher para escuchar cambios de inventario en tiempo real
  const userId = currentUser.value?.id || 1;
  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

  pusher = new Pusher(pusherKey, {
    cluster: pusherCluster,
    forceTLS: true
  });

  const channelName = `pos-user-${userId}`;
  channel = pusher.subscribe(channelName);

  // Escuchar evento INVENTORY_UPDATED y refrescar productos automáticamente
  channel.bind('INVENTORY_UPDATED', async (data: any) => {
    console.log("[Inventory] 📦 Evento INVENTORY_UPDATED recibido:", data);
    console.log("[Inventory] 🔄 Reseteando a página 1 y limpiando filtros...");
    
    try {
      // Resetear a página 1 para asegurar que el nuevo producto sea visible
      pagination.value.currentPage = 1;
      
      // Limpiar filtros activos para mostrar TODOS los productos nuevos
      apiFilters.value.search = '';
      apiFilters.value.category = '';
      apiFilters.value.sku = '';
      apiFilters.value.stock_status = '';
      apiFilters.value.min_price = '';
      apiFilters.value.max_price = '';
      // Mantener el ordering por última creación
      apiFilters.value.ordering = '-created_at';
      
      console.log("[Inventory] ⏳ Refrescando tabla con: GET /api/products/?page=1&page_size=10&ordering=-created_at");
      await fetchProducts();
      
      console.log("[Inventory] ✅ Tabla actualizada exitosamente");
      console.log("[Inventory] 📊 Total de productos:", pagination.value.count);
      console.log("[Inventory] 👀 Productos en vista (página 1):", products.value.length);
      
      enqueueSnackbar({
        type: 'info',
        title: 'Inventario Actualizado',
        message: 'Los productos se han refrescado automáticamente',
        duration: 2000
      });
    } catch (err) {
      console.error("[Inventory] ❌ Error refrescando productos:", err);
    }
  });

  console.log(`[Inventory] 🎧 Listening para cambios en canal: ${channelName}`);
});

onUnmounted(() => {
  if (channel && pusher) {
    console.log("[Inventory] 🔌 Desconectando Pusher");
    pusher.unsubscribe(`pos-user-${currentUser.value?.id || 1}`);
    pusher.disconnect();
  }
});

const showAddProductModal = ref(false);
const showFirstProductModal = ref(false);
const showRestockModal = ref(false);
const selectedProduct = ref<any | null>(null);
const selectedProductForRestock = ref<any | null>(null);
const isSubmitting = ref(false);

const confirmationState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'danger' | 'warning' | 'info' | 'success',
  confirmText: 'Confirmar',
  onConfirm: () => {}
});


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const canViewInventoryValue = computed(() => {
  const role = (currentUser.value?.role || '').toLowerCase();
  return ['propietario', 'gerente', 'admin'].includes(role);
});

const supplierOptions = computed(() => {
  return suppliers.value.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
  }));
});

// Handlers
const handleQuickSell = () => {
  salesStore.openModal();
};

const handleOpenImportExcel = () => {
  window.dispatchEvent(new CustomEvent('open-excel-import'));
};

// ===== FIRST PRODUCT MODAL HANDLERS =====
const handleFirstProductCreate = () => {
  showFirstProductModal.value = false;
  handleAddProduct();
};

const handleFirstProductLoadExcel = () => {
  showFirstProductModal.value = false;
  // TODO: Abrir modal de carga de Excel
  enqueueSnackbar({
    type: 'info',
    title: 'Excel Import',
    message: 'Funcionalidad de carga de Excel próximamente',
    duration: 3000
  });
};

const handleAddProduct = () => {
  selectedProduct.value = null; // Clear selected product for new addition
  showAddProductModal.value = true;
};

const handleSaveNewProduct = async (newProduct: any) => {
  isSubmitting.value = true;
  try {
    const result = await productStore.addProduct(newProduct);
    if (result.success) {
      enqueueSnackbar({
        type: 'success',
        title: 'Producto Agregado',
        message: `${newProduct.name} se agregó al inventario exitosamente.`,
        duration: 3000
      });
      showAddProductModal.value = false;
      // Refrescar lista de productos
      fetchProducts();
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error al agregar',
        message: result.error || 'No se pudo crear el producto',
        duration: 4000
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleEditProduct = (product: TableProduct) => {
  selectedProduct.value = product;
  showAddProductModal.value = true;
};

const handleUpdateProduct = async (updatedProduct: any) => {
  isSubmitting.value = true;
  try {
    const result = await productStore.updateProduct(updatedProduct);
    if (result.success) {
      enqueueSnackbar({
        type: 'success',
        title: 'Producto Actualizado',
        message: `${updatedProduct.name} ha sido actualizado correctamente.`,
        duration: 3000
      });
      showAddProductModal.value = false;
      // Refrescar lista de productos
      fetchProducts();
    } else {
      enqueueSnackbar({
        type: 'error',
        title: 'Error al actualizar',
        message: result.error || 'No se pudo actualizar el producto',
        duration: 4000
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteProduct = (product: TableProduct) => {
  confirmationState.value = {
    isOpen: true,
    title: 'Eliminar Producto',
    message: `¿Estás seguro de que deseas eliminar ${product.name}?`,
    type: 'danger',
    confirmText: 'Sí, eliminar',
    onConfirm: async () => {
      const result = await productStore.deleteProduct(product.id);
      if (result.success) {
        enqueueSnackbar({
          type: 'success',
          title: 'Producto Eliminado',
          message: `${product.name} ha sido eliminado del inventario.`,
          duration: 5000,
          actionLabel: 'Deshacer',
          onAction: () => {
            productStore.addProduct(product);
            fetchProducts();
            enqueueSnackbar({
              type: 'info',
              title: 'Acción deshecha',
              message: `El producto ${product.name} ha sido restaurado.`,
              duration: 3000
            });
          }
        });
        // Refrescar lista de productos
        fetchProducts();
      } else {
        enqueueSnackbar({
          type: 'error',
          title: 'Error al eliminar',
          message: result.error || 'No se pudo eliminar el producto.',
          duration: 5000
        });
      }
      confirmationState.value.isOpen = false;
    }
  };
};

const handleBulkDelete = (ids: string[]) => {
  confirmationState.value = {
    isOpen: true,
    title: 'Eliminar Productos',
    message: `¿Estás seguro de que deseas eliminar ${ids.length} productos seleccionados?`,
    type: 'danger',
    confirmText: `Sí, eliminar ${ids.length} productos`,
    onConfirm: async () => {
      // Store products to restore before deleting
      const productsToRestore = products.value.filter(p => ids.includes(String(p.id)));
      
      const result = await productStore.bulkDeleteProducts(ids);
      if (result.success) {
        enqueueSnackbar({
          type: 'success',
          title: 'Productos Eliminados',
          message: `${ids.length} productos han sido eliminados del inventario.`,
          duration: 5000,
          actionLabel: 'Deshacer',
          onAction: () => {
            productsToRestore.forEach(p => productStore.addProduct(p));
            fetchProducts();
            enqueueSnackbar({
              type: 'info',
              title: 'Acción deshecha',
              message: `Se han restaurado ${ids.length} productos.`,
              duration: 3000
            });
          }
        });
        // Refrescar lista de productos
        fetchProducts();
      } else {
        enqueueSnackbar({
          type: 'error',
          title: 'Error al eliminar múltiples',
          message: result.error || 'No se pudieron eliminar todos los productos seleccionados.',
          duration: 5000
        });
      }
      confirmationState.value.isOpen = false;
    }
  };
};

const handleRestock = (product: TableProduct) => {
  selectedProductForRestock.value = product;
  showRestockModal.value = true;
};

const onRestockConfirm = async () => {
  showRestockModal.value = false;
  // Refrescar lista de productos para mostrar nuevo stock
  await fetchProducts();
  enqueueSnackbar({
    type: 'success',
    title: 'Reabastecer Exitoso',
    message: 'El stock ha sido actualizado.',
    duration: 3000
  });
};

const handleConfirmation = () => {
  confirmationState.value.onConfirm();
};

const handleInlineStockAdjustment = async (product: TableProduct, newStock: number) => {
  const currentStock = Number((product as any).current_stock ?? product.stock ?? 0);
  const delta = newStock - currentStock;

  if (delta === 0) return;

  const result = await productStore.manualAdjustment(
    Number(product.id),
    Math.abs(delta),
    delta > 0 ? 'in' : 'out',
    `Ajuste rapido desde tabla (${currentStock} -> ${newStock})`
  );

  if (result.success) {
    enqueueSnackbar({
      type: 'success',
      title: 'Stock actualizado',
      message: `Nuevo stock de ${product.name}: ${newStock}`,
      duration: 2400,
    });
    await fetchProducts();
    return;
  }

  enqueueSnackbar({
    type: 'error',
    title: 'No se pudo ajustar el stock',
    message: result.error || 'Ocurrio un error al guardar el ajuste',
    duration: 4000,
  });
};

// Actualizar filtros y llamar API
function onFiltersUpdate(newFilters: any) {
  const mappedFilters: any = {
    search: newFilters.search ?? '',
    category: newFilters.category ?? '',
    supplier: newFilters.supplier ?? '',
    sku: newFilters.sku ?? '',
    min_price: newFilters.min_price ?? '',
    max_price: newFilters.max_price ?? '',
    ordering: newFilters.ordering ?? '-created_at',
    stock_status: '',
  };

  if (newFilters.stockFilter === 'out-of-stock') {
    mappedFilters.stock_status = 'out_of_stock';
  } else if (newFilters.stockFilter === 'low-stock') {
    mappedFilters.stock_status = 'low_stock';
  } else {
    mappedFilters.stock_status = newFilters.stock_status ?? '';
  }

  applyFilters(mappedFilters);
}
</script>

<style scoped>

.inventory-wrapper {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}

.inventory-inner {
  background: var(--color-card-stats-fill);
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 1.75rem 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  /* Select the second child directly (Valor del inventario) regardless if real or skeleton */
  .stats-grid > div:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .stats-grid > div:nth-child(1) {
    grid-column: 1;
    grid-row: 2;
  }
  .stats-grid > div:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }
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

/* Header Styles */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  color: #6B7280;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-action svg {
  width: 20px;
  height: 20px;
}

.btn-action.primary {
  background: var(--color-brand-main);
  color: white;
}

.btn-action.primary:hover {
  background: #085036;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(6, 64, 43, 0.3);
}

.btn-action.secondary {
  background: white;
  color: var(--color-text-main);
  border: 1px solid var(--color-card-border);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-action.secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-action {
    flex: 1;
    justify-content: center;
  }
}
</style>
