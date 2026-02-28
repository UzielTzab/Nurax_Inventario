<template>
  <DashboardLayout>
    <div class="suppliers-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Proveedores</h1>
          <p class="page-subtitle">Gestiona la relación con tus proveedores y surtido de productos</p>
        </div>
        <AppButton variant="fill" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Nuevo Proveedor
        </AppButton>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="search-icon">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar por nombre, empresa o producto..." 
            class="search-input"
          />
        </div>
      </div>

      <!-- Suppliers Grid -->
      <div class="suppliers-grid">
        <div v-for="supplier in filteredSuppliers" :key="supplier.id" class="supplier-card" @click="viewSupplierDetails(supplier)">
          <div class="card-header">
            <div class="supplier-avatar">
              <span>{{ getInitials(supplier.name) }}</span>
            </div>
            <div class="supplier-info-header">
              <h3>{{ supplier.name }}</h3>
              <span class="contact-person">{{ supplier.company || 'Sin empresa' }}</span>
            </div>
            <div class="supplier-status">
               <span class="status-dot"></span> Active
            </div>
          </div>
          
          <div class="card-body">
            <div class="info-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="info-icon">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <span>{{ supplier.email }}</span>
            </div>
            <div class="info-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="info-icon">
                <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clip-rule="evenodd" />
              </svg>
              <span>{{ supplier.phone }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-danger-outline" @click.stop="handleDeleteSupplier(supplier)" title="Eliminar proveedor">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
              </svg>
            </button>
            <AppButton variant="outline">Ver Detalles</AppButton>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredSuppliers.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <h3>No se encontraron proveedores</h3>
        <p>Ajusta tu búsqueda o agrega un nuevo proveedor a tu lista.</p>
      </div>
      
      <!-- Supplier Details Modal -->
      <div v-if="selectedSupplier" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title-group">
                <h2>{{ selectedSupplier.name }}</h2>
                <span class="modal-subtitle">ID: {{ selectedSupplier.id }}</span>
            </div>
            <button class="close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div class="modal-body-layout">
             <!-- Left: Contact Info -->
             <div class="supplier-contact-panel">
                <h3>Contacto</h3>
                <div class="contact-details">
                    <div class="contact-group">
                        <label>Empresa</label>
                        <p>{{ selectedSupplier.company || 'N/A' }}</p>
                    </div>
                    <div class="contact-group">
                        <label>Correo Electrónico</label>
                        <p>{{ selectedSupplier.email }}</p>
                    </div>
                    <div class="contact-group">
                        <label>Teléfono</label>
                        <p>{{ selectedSupplier.phone }}</p>
                    </div>
                </div>
                <div class="contact-actions">
                    <AppButton variant="fill">Enviar Mensaje</AppButton>
                    <AppButton variant="outline">Editar Info</AppButton>
                </div>
             </div>

             <!-- Right: Products List -->
             <div class="supplier-products-panel">
                <h3>Productos Suministrados</h3>
                <div class="products-table-wrapper">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Costo</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="product in selectedSupplier.products" :key="product.sku">
                                <td class="font-medium">{{ product.name }}</td>
                                <td class="text-sm text-gray">{{ product.sku }}</td>
                                <td>${{ product.cost.toFixed(2) }}</td>
                                <td>
                                    <span :class="['stock-badge', product.stock > 10 ? 'success' : 'warning']">
                                        {{ product.stock }}
                                    </span>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                    <p style="margin-top: 1rem; color: #6B7280; font-size: 0.875rem;">(Los productos por proveedor aún se están consultando desde el servidor)</p>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal: Añadir Proveedor -->
    <AddSupplierModal
      :is-open="showAddModal"
      @close="showAddModal = false"
      @supplier-created="showAddModal = false"
    />
    <!-- Modal: Confirmar Borrado -->
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
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AddSupplierModal from '@/components/AddSupplierModal.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSuppliers, type Supplier } from '@/composables/useSuppliers';

const { enqueueSnackbar } = useSnackbar();
const { suppliers, deleteSupplier } = useSuppliers();

const confirmationState = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'info' as 'danger' | 'warning' | 'info' | 'success',
  confirmText: 'Confirmar',
  onConfirm: () => {}
});

const handleConfirmation = () => confirmationState.value.onConfirm();

const handleDeleteSupplier = (supplier: Supplier) => {
  confirmationState.value = {
    isOpen: true,
    title: 'Eliminar Proveedor',
    message: `¿Estás seguro de que deseas eliminar al proveedor "${supplier.name}"? Los productos vinculados a este proveedor perderán la referencia de suministro. Esta acción no se puede deshacer.`,
    type: 'danger',
    confirmText: 'Sí, eliminar',
    onConfirm: async () => {
      confirmationState.value.isOpen = false;
      const result = await deleteSupplier(supplier.id);
      if (result.success) {
        enqueueSnackbar({
          type: 'success',
          title: 'Proveedor eliminado',
          message: `${supplier.name} eliminado exitosamente.`,
          duration: 3000
        });
        if (selectedSupplier.value?.id === supplier.id) {
          selectedSupplier.value = null; // Cierra el panel de detalles si estaba abierto
        }
      } else {
        enqueueSnackbar({
          type: 'error',
          title: 'No se pudo eliminar',
          message: result.error || 'Ocurrió un error inesperado.',
          duration: 4000
        });
      }
    }
  };
};

const searchQuery = ref('');
const selectedSupplier = ref<Supplier | null>(null);
const showAddModal = ref(false);

const filteredSuppliers = computed(() => {
    if (!searchQuery.value) return suppliers.value;
    const query = searchQuery.value.toLowerCase();
    return suppliers.value.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.company?.toLowerCase().includes(query)
    );
});

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const viewSupplierDetails = (supplier: Supplier) => {
    selectedSupplier.value = supplier;
};

const closeModal = () => {
    selectedSupplier.value = null;
};
</script>

<style scoped>
.suppliers-container {
background: var(--color-card-stats-fill);
padding: 1.75rem 2rem;
max-width: 100%;
min-height: 100vh;
margin: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-brand-primary);
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    box-shadow: 0 4px 6px -1px rgba(6, 64, 43, 0.2), 0 2px 4px -1px rgba(6, 64, 43, 0.1);
}

.btn-primary svg {
    width: 20px;
    height: 20px;
}

.search-bar {
    margin-bottom: 2rem;
}

.search-input-wrapper {
    position: relative;
    max-width: 500px;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9CA3AF;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s;
}

.search-input:focus {
    border-color: var(--color-brand-primary);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.suppliers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
}

.supplier-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
}

.supplier-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: var(--color-brand-primary);
}

.card-header {
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    border-bottom: 1px solid #F3F4F6;
}

.supplier-avatar {
    width: 48px;
    height: 48px;
    background: #EFF6FF;
    color: #3B82F6;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    flex-shrink: 0;
}

.supplier-info-header {
    flex: 1;
}

.supplier-info-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
}

.contact-person {
    font-size: 0.875rem;
    color: #6B7280;
}

.supplier-status {
    font-size: 0.75rem;
    font-weight: 600;
    color: #10B981;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.status-dot {
    width: 6px;
    height: 6px;
    background: #10B981;
    border-radius: 50%;
}

.card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #4B5563;
}

.info-icon {
    width: 18px;
    height: 18px;
    color: #9CA3AF;
}

.card-footer {
    padding: 1.25rem 1.5rem;
    background: #F9FAFB;
    border-top: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stats-item {
    display: flex;
    flex-direction: column;
}

.stats-value {
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
    line-height: 1;
}

.stats-value.highlight {
    color: #F59E0B;
}

.stats-label {
    font-size: 0.75rem;
    color: #6B7280;
}

.btn-details {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-details:hover {
    border-color: #9CA3AF;
    background: #F3F4F6;
}

.btn-danger-outline {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: 1px solid #FECACA;
    border-radius: 6px;
    background: white;
    color: #DC2626;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-danger-outline:hover {
    background: #FEF2F2;
    border-color: #F87171;
}

.btn-danger-outline svg {
    width: 20px;
    height: 20px;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-title-group h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}

.modal-subtitle {
    font-size: 0.875rem;
    color: #9CA3AF;
    font-family: monospace;
}

.close-btn {
    background: none;
    border: none;
    color: #9CA3AF;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: #F3F4F6;
    color: #111827;
}

.close-btn svg {
    width: 24px;
    height: 24px;
}

.modal-body-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    min-height: 400px;
}

.supplier-contact-panel {
    padding: 2rem;
    background: #F9FAFB;
    border-right: 1px solid #E5E7EB;
}

.supplier-contact-panel h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
}

.contact-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6B7280;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.contact-group p {
    margin: 0;
    font-size: 0.95rem;
    color: #1F2937;
    font-weight: 500;
}

.link {
    color: #3B82F6;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}

.contact-actions {
    display: flex;
    gap: 0.75rem;
}

.btn-action {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-action.primary {
    background: #3B82F6;
    color: white;
    border: none;
}

.btn-action.primary:hover {
    background: #2563EB;
}

.btn-action.secondary {
    background: white;
    border: 1px solid #D1D5DB;
    color: #374151;
}

.btn-action.secondary:hover {
    background: #F3F4F6;
    border-color: #9CA3AF;
}

.supplier-products-panel {
    padding: 2rem;
}

.supplier-products-panel h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
}

.products-table {
    width: 100%;
    border-collapse: collapse;
}

.products-table th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    border-bottom: 1px solid #E5E7EB;
}

.products-table td {
    padding: 1rem;
    border-bottom: 1px solid #F3F4F6;
    color: #374151;
    font-size: 0.875rem;
}

.text-sm {
    font-size: 0.75rem;
}

.text-gray {
    color: #6B7280;
}

.font-medium {
    font-weight: 500;
    color: #111827;
}

.stock-badge {
    display: inline-flex;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.stock-badge.success {
    background: #ECFDF5;
    color: #10B981;
}

.stock-badge.warning {
    background: #FFF7ED;
    color: #C2410C;
}

@media (max-width: 1024px) {
    .modal-body-layout {
        grid-template-columns: 1fr;
    }
    
    .supplier-contact-panel {
        border-right: none;
        border-bottom: 1px solid #E5E7EB;
        padding: 1.5rem;
    }

    .supplier-products-panel {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .btn-primary {
        width: 100%;
        justify-content: center;
    }
    
    .suppliers-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        max-height: 100vh;
        border-radius: 0;
        height: 100%;
    }
    
    .modal-header {
        padding: 1rem;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: white;
    border-radius: 16px;
    margin-top: 1rem;
}

.empty-state svg {
    width: 64px;
    height: 64px;
    color: #9CA3AF;
    margin-bottom: 1rem;
    opacity: 0.6;
}

.empty-state h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
}

.empty-state p {
    margin: 0;
    color: #6B7280;
    font-size: 0.875rem;
}
</style>
