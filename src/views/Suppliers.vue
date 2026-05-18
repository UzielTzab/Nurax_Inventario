<template>
  <DashboardLayout>
    <div class="suppliers-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Proveedores</h1>
          <p class="page-subtitle">Gestiona la relación con tus proveedores y surtido de productos</p>
        </div>
        <AppButton variant="fill" @click="openDrawer()">
          <PlusIcon style="width: 20px; height: 20px;" />
          Nuevo Proveedor
        </AppButton>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar por nombre, empresa o producto..." 
            class="search-input"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredSuppliers.length === 0" class="empty-state">
        <ArchiveBoxIcon class="empty-icon" />
        <h3>No se encontraron proveedores</h3>
        <p>Aún no tienes proveedores registrados. Agrégalos para agilizar tus compras y reabastecimiento.</p>
      </div>

      <!-- Suppliers Table (Contact Directory) -->
      <div v-else class="directory-table-container">
        <table class="directory-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="supplier-row" @click="openDrawer(supplier.id)">
              <td>
                <div class="supplier-cell">
                  <div class="supplier-avatar">
                    <span>{{ getInitials(supplier.name) }}</span>
                  </div>
                  <div class="supplier-name-info">
                    <span class="supplier-name">{{ supplier.name }}</span>
                    <span v-if="supplier.company && supplier.company !== supplier.name" class="supplier-company">{{ supplier.company }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-cell">
                  <span class="contact-info-text">{{ supplier.phone || supplier.email || 'Sin información de contacto' }}</span>
                  
                  <a v-if="isPhone(supplier.phone)" :href="getWhatsAppUrl(supplier.phone)" target="_blank" rel="noopener noreferrer" @click.stop class="whatsapp-btn" title="Contactar por WhatsApp">
                    <WhatsAppIcon class="whatsapp-icon" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Supplier Detail Drawer -->
    <SupplierDetailDrawer
      :is-open="showDrawer"
      :supplier-id="drawerSupplierId"
      @close="closeDrawer"
      @saved="handleSupplierSaved"
      @deleted="handleSupplierDeleted"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MagnifyingGlassIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline';
import { PlusIcon } from '@heroicons/vue/24/solid';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon.vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AppButton from '@/components/ui/AppButton.vue';
import SupplierDetailDrawer from '@/components/SupplierDetailDrawer.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useSuppliers, type Supplier } from '@/composables/useSuppliers';
const { enqueueSnackbar } = useSnackbar();
const { suppliers, isLoading, deleteSupplier, fetchSuppliers } = useSuppliers();

onMounted(() => {
  if (suppliers.value.length === 0) {
    fetchSuppliers();
  }
});

const searchQuery = ref('');
const showDrawer = ref(false);
const drawerSupplierId = ref<string | number | null>(null);

const openDrawer = (id?: string | number) => {
  drawerSupplierId.value = id || null;
  showDrawer.value = true;
};

const closeDrawer = () => {
  showDrawer.value = false;
  setTimeout(() => {
    drawerSupplierId.value = null;
  }, 300);
};

const handleSupplierSaved = async () => {
  await fetchSuppliers();
};

const handleSupplierDeleted = async () => {
  await fetchSuppliers();
};

const isPhone = (text: string) => {
  if (!text) return false;
  const digits = text.replace(/\D/g, '');
  return digits.length >= 10;
};

const getWhatsAppUrl = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
};

const filteredSuppliers = computed(() => {
    if (!searchQuery.value) return suppliers.value;
    const query = searchQuery.value.toLowerCase();
    return suppliers.value.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.company?.toLowerCase().includes(query)
    );
});

const getInitials = (name: string) => {
    if (!name) return 'PR';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};
</script>

<style scoped>
.suppliers-container {
background: var(--color-background-secondary);
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

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    border: 1px dashed #E5E7EB;
    margin-top: 2rem;
}

.empty-icon {
    width: 64px;
    height: 64px;
    color: #9CA3AF;
    margin-bottom: 1.5rem;
}

.empty-state h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.empty-state p {
    margin-top: 0.5rem;
    color: #6B7280;
    max-width: 400px;
}

/* Directory Table */
.directory-table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.directory-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.directory-table th {
    background: #F9FAFB;
    padding: 1rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #E5E7EB;
}

.supplier-row {
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid #F3F4F6;
}

.supplier-row:last-child {
    border-bottom: none;
}

.supplier-row:hover {
    background: #F9FAFB;
}

.supplier-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
}

.supplier-avatar {
    width: 40px;
    height: 40px;
    background: #EFF6FF;
    color: #3B82F6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
}

.supplier-name-info {
    display: flex;
    flex-direction: column;
}

.supplier-name {
    font-weight: 600;
    color: #111827;
    font-size: 0.95rem;
}

.supplier-company {
    font-size: 0.8rem;
    color: #6B7280;
}

.contact-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
}

.contact-info-text {
    font-size: 0.9rem;
    color: #4B5563;
}

.whatsapp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ECFDF5;
    color: #10B981;
    transition: all 0.2s;
}

.whatsapp-btn:hover {
    background: #D1FAE5;
    transform: scale(1.05);
}

.whatsapp-icon {
    width: 18px;
    height: 18px;
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

