<template>
  <DashboardLayout>
    <div class="clients-wrapper">
      <div class="clients-inner">

        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Clientes</h1>
            <p class="page-subtitle">Gestión de cuentas de clientes del sistema</p>
          </div>
          <div class="header-actions">
            <AppButton variant="outline" @click="showAddModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
              </svg>
              Nuevo Cliente
            </AppButton>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-brand">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div>
              <p class="stat-label">Total Clientes</p>
              <p class="stat-value">{{ clients.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="stat-label">Activos</p>
              <p class="stat-value">{{ activeClients }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-warning">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="stat-label">Inactivos</p>
              <p class="stat-value">{{ clients.length - activeClients }}</p>
            </div>
          </div>
        </div>

        <!-- Search + Filter -->
        <div class="toolbar">
          <div class="search-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar cliente por nombre, correo o empresa..."
              class="search-input"
            />
          </div>
          <select v-model="statusFilter" class="filter-select">
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        <!-- Table -->
        <div class="table-card">
          <table class="clients-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Plan</th>
                <th>Fecha alta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in filteredClients" :key="client.id" class="table-row">
                <td>
                  <div class="client-info">
                    <div class="client-avatar" :style="{ background: client.avatarColor }">
                      {{ client.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="client-name">{{ client.name }}</p>
                      <p class="client-email">{{ client.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="td-secondary">{{ client.company }}</td>
                <td>
                  <span class="plan-badge" :class="'plan-' + client.plan">
                    {{ client.plan }}
                  </span>
                </td>
                <td class="td-secondary">{{ client.joinDate }}</td>
                <td>
                  <span class="status-badge" :class="client.active ? 'status-active' : 'status-inactive'">
                    <span class="status-dot"></span>
                    {{ client.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <!-- Toggle switch de activar/desactivar -->
                    <button
                      class="toggle-switch"
                      :class="{ 'toggle-on': client.active, 'toggle-off': !client.active }"
                      @click="confirmToggle(client)"
                      :title="client.active ? 'Desactivar cuenta' : 'Activar cuenta'"
                      role="switch"
                      :aria-checked="client.active"
                    >
                      <span class="toggle-thumb"></span>
                    </button>
                    <!-- Eliminar -->
                    <button class="action-btn action-delete" @click="confirmDelete(client)" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0 && !isLoading">
                <td colspan="6" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
                  </svg>
                  <p>No se encontraron clientes</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- Modal Nuevo Cliente -->
    <transition name="modal-fade">
      <div v-if="showAddModal" class="modal-backdrop" @click.self="showAddModal = false">
        <div class="modal-card" data-aos="zoom-in" data-aos-duration="250">
          <div class="modal-header">
            <h3 class="modal-title">Nuevo Cliente</h3>
            <button class="modal-close" @click="showAddModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="addClient" class="modal-body">
            <div class="modal-field">
              <label class="modal-label">Nombre completo *</label>
              <input v-model="newClient.name" type="text" class="modal-input" placeholder="Ej. Juan García" required />
            </div>
            <div class="modal-field">
              <label class="modal-label">Correo electrónico *</label>
              <input v-model="newClient.email" type="email" class="modal-input" placeholder="juan@empresa.com" required />
            </div>
            <div class="modal-field">
              <label class="modal-label">Empresa</label>
              <input v-model="newClient.company" type="text" class="modal-input" placeholder="Nombre de la empresa" />
            </div>
            <div class="modal-field">
              <label class="modal-label">Plan</label>
              <select v-model="newClient.plan" class="modal-input">
                <option value="básico">Básico</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div class="modal-footer">
              <AppButton variant="outline" @click="showAddModal = false" type="button">Cancelar</AppButton>
              <AppButton variant="fill" type="submit">Agregar Cliente</AppButton>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Confirmar Cambio de Estado -->
    <transition name="modal-fade">
      <div v-if="toggleTarget" class="modal-backdrop" @click.self="toggleTarget = null">
        <div class="modal-card modal-card-sm">
          <div class="modal-header">
            <div class="modal-title-row">
              <!-- Ícono contextual -->
              <div class="modal-icon-wrap" :class="toggleTarget.active ? 'icon-warn' : 'icon-success'">
                <svg v-if="toggleTarget.active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="modal-title">{{ toggleTarget.active ? 'Desactivar cuenta' : 'Activar cuenta' }}</h3>
            </div>
            <button class="modal-close" @click="toggleTarget = null">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <!-- Preview del cliente -->
            <div class="toggle-client-preview">
              <div class="client-avatar" :style="{ background: toggleTarget.avatarColor }">
                {{ toggleTarget.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="client-name">{{ toggleTarget.name }}</p>
                <p class="client-email">{{ toggleTarget.email }}</p>
              </div>
            </div>
            <!-- Mensaje contextual -->
            <p v-if="toggleTarget.active" class="toggle-msg toggle-msg-warn">
              Al <strong>desactivar</strong> esta cuenta, el cliente perderá acceso al sistema hasta que sea reactivado.
            </p>
            <p v-else class="toggle-msg toggle-msg-success">
              Al <strong>activar</strong> esta cuenta, el cliente recuperará acceso completo al sistema.
            </p>
            <div class="modal-footer">
              <AppButton variant="outline" @click="toggleTarget = null" type="button">Cancelar</AppButton>
              <AppButton variant="fill" @click="applyToggle" type="button">
                {{ toggleTarget?.active ? 'Sí, desactivar' : 'Sí, activar' }}
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm Delete Modal -->
    <transition name="modal-fade">
      <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <div class="modal-card modal-card-sm">
          <div class="modal-header">
            <h3 class="modal-title">Eliminar Cliente</h3>
            <button class="modal-close" @click="deleteTarget = null">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="delete-msg">¿Estás seguro de eliminar a <strong>{{ deleteTarget?.name }}</strong>? Esta acción no se puede deshacer.</p>
            <div class="modal-footer">
              <AppButton variant="outline" @click="deleteTarget = null" type="button">Cancelar</AppButton>
              <AppButton variant="fill" @click="deleteClient" type="button">Sí, eliminar</AppButton>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import apiClient from '@/services/api';
import { useSnackbar } from '@/composables/useSnackbar';

const { enqueueSnackbar } = useSnackbar();

interface Client {
  id: string | number;
  name: string;
  email: string;
  company: string;
  plan: 'básico' | 'pro' | 'enterprise';
  joinDate: string;
  active: boolean;
  avatarColor: string;
}

const AVATAR_COLORS = [
  '#06402B', '#0f766e', '#1d4ed8', '#7c3aed',
  '#b45309', '#be185d', '#0369a1', '#15803d',
];

const clients = ref<Client[]>([]);
const isLoading = ref(false);

const searchQuery = ref('');
const statusFilter = ref<'all' | 'active' | 'inactive'>('all');
const showAddModal = ref(false);
const deleteTarget = ref<Client | null>(null);
const toggleTarget = ref<Client | null>(null);

const newClient = ref({
  name: '',
  email: '',
  company: '',
  plan: 'básico' as Client['plan'],
});

const activeClients = computed(() => clients.value.filter(c => c.active).length);

const filteredClients = computed(() => {
  let list = [...clients.value];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value === 'active') list = list.filter(c => c.active);
  if (statusFilter.value === 'inactive') list = list.filter(c => !c.active);
  return list;
});

// Abre el modal de confirmación para cambiar el estado
const confirmToggle = (client: Client) => {
  toggleTarget.value = client;
};

// Aplica el cambio de estado después de confirmar
const applyToggle = async () => {
  if (!toggleTarget.value) return;
  const client = toggleTarget.value;
  try {
    const response = await apiClient.patch<{ active: boolean }>(`/clients/${client.id}/toggle_active/`, {});
    if (response.success && response.data) {
      client.active = response.data.active;
      enqueueSnackbar({ type: 'success', title: 'Estado actualizado', message: 'El estado del cliente fue actualizado.', duration: 3000 });
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo actualizar el estado.', duration: 3000 });
    }
  } catch (error) {
    console.error("No tienes permisos o el cliente no existe", error);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    toggleTarget.value = null;
  }
};

const confirmDelete = (client: Client) => {
  deleteTarget.value = client;
};

const deleteClient = async () => {
  if (!deleteTarget.value) return;
  const targetId = deleteTarget.value.id;
  try {
    const response = await apiClient.delete(`/clients/${targetId}/`);
    if (response.success) {
      clients.value = clients.value.filter(c => c.id !== targetId);
      enqueueSnackbar({ type: 'success', title: 'Cliente eliminado', message: 'El cliente ha sido eliminado exitosamente.', duration: 3000 });
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo eliminar al cliente', duration: 3000 });
    }
  } catch (err) {
    console.error(err);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    deleteTarget.value = null;
  }
};

const fetchClients = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get<any[]>('/clients/');
    if (response.success && response.data) {
      clients.value = response.data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        company: c.company,
        plan: c.plan,
        active: c.active,
        joinDate: new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        avatarColor: c.avatar_color || '#06402B'
      }));
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudieron cargar los clientes.', duration: 3000 });
    }
  } catch (error) {
    console.error('Error fetching clients:', error);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchClients();
});

const addClient = () => {
  const colorIndex = clients.value.length % AVATAR_COLORS.length;
  clients.value.push({
    id: Date.now().toString(),
    name: newClient.value.name,
    email: newClient.value.email,
    company: newClient.value.company || '—',
    plan: newClient.value.plan,
    joinDate: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
    active: true,
    avatarColor: AVATAR_COLORS[colorIndex] ?? '#06402B',
  });
  newClient.value = { name: '', email: '', company: '', plan: 'básico' };
  showAddModal.value = false;
};
</script>

<style scoped>
.clients-wrapper {
  flex: 1;
  overflow-y: auto;
  height: 100%;
}

.clients-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--color-card-stats-fill);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #6b7280;
  margin-top: 0.25rem;
  font-size: 0.9375rem;
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
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: 'Inter', sans-serif;
}

.btn-action svg {
  width: 18px;
  height: 18px;
}

.btn-action.primary {
  background: var(--color-brand-main);
  color: white;
}

.btn-action.primary:hover {
  background: #0a5c3a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 64, 43, 0.25);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap svg {
  width: 22px;
  height: 22px;
}

.stat-icon-brand { background: rgba(6, 64, 43, 0.08); color: var(--color-brand-main); }
.stat-icon-success { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.stat-icon-warning { background: rgba(249, 115, 22, 0.1); color: #ea580c; }

.stat-label {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  position: relative;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Inter', sans-serif;
  color: #111827;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.filter-select {
  padding: 0.625rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-brand-main);
}

/* Table */
.table-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
}

.clients-table thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.clients-table th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #fafafa;
}

.clients-table td {
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  vertical-align: middle;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.client-name {
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-size: 0.9375rem;
}

.client-email {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.td-secondary {
  color: #4b5563;
}

/* Plan badge */
.plan-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.plan-básico   { background: #eff6ff; color: #1d4ed8; }
.plan-pro      { background: #f0fdf4; color: #15803d; }
.plan-enterprise { background: #faf5ff; color: #7c3aed; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.status-active   { background: #f0fdf4; color: #16a34a; }
.status-inactive { background: #f9fafb; color: #9ca3af; }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Row actions */
.row-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ===== TOGGLE SWITCH ===== */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.25s ease;
  flex-shrink: 0;
  outline: none;
}

.toggle-switch:focus-visible {
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.2);
}

.toggle-on  { background: var(--color-brand-main, #06402B); }
.toggle-off { background: #d1d5db; }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}

.toggle-on .toggle-thumb {
  transform: translateX(20px);
}

.toggle-off .toggle-thumb {
  transform: translateX(0);
}

.toggle-switch:hover .toggle-thumb {
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* Delete button */
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-delete { color: #6b7280; }
.action-delete:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem !important;
  color: #9ca3af;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  display: block;
  stroke: #d1d5db;
}

.empty-state p {
  margin: 0;
  font-size: 0.9375rem;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-card-sm {
  max-width: 380px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.15s;
}

.modal-close:hover { background: #e5e7eb; }
.modal-close svg { width: 16px; height: 16px; }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.modal-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.modal-input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.modal-input:focus {
  outline: none;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn-cancel, .btn-save, .btn-danger, .btn-warn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: 'Inter', sans-serif;
  transition: all 0.15s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}
.btn-cancel:hover { background: #e5e7eb; }

.btn-save {
  background: var(--color-brand-main);
  color: white;
}
.btn-save:hover { background: #0a5c3a; }

.btn-danger {
  background: #dc2626;
  color: white;
}
.btn-danger:hover { background: #b91c1c; }

.btn-warn {
  background: #ea580c;
  color: white;
}
.btn-warn:hover { background: #c2410c; }

/* Toggle modal extras */
.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.modal-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon-wrap svg { width: 18px; height: 18px; }

.icon-warn    { background: rgba(234, 88, 12, 0.08); color: #ea580c; }
.icon-success { background: rgba(6, 64, 43, 0.08); color: var(--color-brand-main, #06402B); }

.toggle-client-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.toggle-msg {
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.toggle-msg-warn    {
  background: rgba(234, 88, 12, 0.06);
  color: #7c2d12;
  border: 1px solid rgba(234, 88, 12, 0.2);
}
.toggle-msg-success {
  background: rgba(6, 64, 43, 0.06);
  color: var(--color-brand-main, #06402B);
  border: 1px solid rgba(6, 64, 43, 0.15);
}

.delete-msg {
  font-size: 0.9375rem;
  color: #374151;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

/* Modal transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.25s ease, opacity 0.2s;
}
.modal-fade-enter-from .modal-card {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
.modal-fade-leave-to .modal-card {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .clients-inner {
    padding: 1.25rem 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .clients-table th:nth-child(3),
  .clients-table td:nth-child(3),
  .clients-table th:nth-child(4),
  .clients-table td:nth-child(4) {
    display: none;
  }
}
</style>
