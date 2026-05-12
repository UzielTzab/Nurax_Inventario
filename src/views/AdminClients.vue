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
            <AppButton variant="fill" @click="showAddModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
              </svg>
              Nuevo Cliente
            </AppButton>
          </div>
        </div>

        <!-- Table Card -->
        <div class="table-card">
          <!-- Search + Filter inside card -->
          <div class="toolbar" style="padding: 1.25rem; border-bottom: 1px solid #e5e7eb;">
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
            <AppSelect
              v-model="statusFilter"
              :options="[
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ]"
            />
          </div>

          <table class="clients-table">
            <thead>
              <tr>
                <th>Negocio</th>
                <th>Propietario</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Skeleton rows while loading -->
              <template v-if="isLoading">
                <tr v-for="i in 5" :key="'sk-'+i" class="table-row">
                  <td><AppSkeleton width="140px" height="1.2rem" /></td>
                  <td>
                    <div class="client-info">
                      <AppSkeleton width="38px" height="38px" rounded />
                      <div style="display:flex;flex-direction:column;gap:0.4rem;">
                        <AppSkeleton width="120px" height="0.875rem" />
                        <AppSkeleton width="160px" height="0.75rem" />
                      </div>
                    </div>
                  </td>
                  <td><AppSkeleton width="60px" height="1.4rem" radius="20px" /></td>
                  <td><AppSkeleton width="80px" height="0.875rem" /></td>
                  <td><AppSkeleton width="70px" height="1.4rem" radius="20px" /></td>
                  <td>
                    <div style="display:flex;gap:0.75rem;align-items:center;">
                      <AppSkeleton width="44px" height="24px" radius="999px" />
                      <AppSkeleton width="32px" height="32px" radius="8px" />
                    </div>
                  </td>
                </tr>
              </template>
              <!-- Actual rows -->
              <tr v-else v-for="client in clients" :key="client.id" class="table-row">
                <td>
                  <p style="font-weight: 700; font-size: 1.125rem; color: #111827; margin: 0;">{{ client.company || 'Sin Empresa' }}</p>
                </td>
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
                <td>
                  <span class="plan-badge" :class="'plan-' + (client.plan || 'basico').toLowerCase()">{{ client.plan || 'Básico' }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="client.is_active ? 'status-active' : 'status-inactive'">
                    <span class="status-dot"></span>
                    {{ client.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <!-- Toggle switch de activar/desactivar -->
                    <button
                      class="toggle-switch"
                      :class="{ 'toggle-on': client.is_active, 'toggle-off': !client.is_active }"
                      @click="confirmToggle(client)"
                      :title="isCurrentAdminUser(client.id) ? 'No puedes cambiar el estado de tu propia cuenta' : (client.is_active ? 'Desactivar cuenta' : 'Activar cuenta')"
                      role="switch"
                      :aria-checked="client.is_active"
                      :disabled="isCurrentAdminUser(client.id)"
                    >
                      <span class="toggle-thumb"></span>
                    </button>
                    <!-- Kebab Menu for Delete -->
                    <div style="position: relative;" class="kebab-menu-container">
                      <button
                        class="action-btn"
                        @click="toggleKebabMenu(client.id)"
                        title="Opciones"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                        </svg>
                      </button>
                      <div v-if="activeKebabMenu === client.id" style="position: fixed; inset: 0; z-index: 40;" @click="toggleKebabMenu(null)"></div>
                      <div v-if="activeKebabMenu === client.id" class="kebab-dropdown" style="z-index: 50;">
                        <button
                          class="kebab-item delete-item"
                          @click="confirmDelete(client); toggleKebabMenu(null)"
                          :disabled="isCurrentAdminUser(client.id)"
                        >
                          Eliminar Negocio
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoading && clients.length === 0">
                <td colspan="6" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
                  </svg>
                  <p>No se encontraron clientes</p>
                </td>
              </tr>
            </tbody>
          </table>
          <Pagination
            v-if="!isLoading"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="totalItems"
          />
        </div>

      </div>
    </div>

    <!-- Modal Nuevo Cliente / Éxito -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showAddModal" class="modal-backdrop">
          <div class="modal-card">
            
            <template v-if="!createdClientData">
              <div class="modal-header">
                <h3 class="modal-title">Alta de Nuevo Negocio</h3>
                <button class="modal-close" @click="showAddModal = false">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </button>
              </div>
              <form @submit.prevent="addClient" class="modal-body">
                <AppInput
                  v-model="newClient.name"
                  label="Nombre completo"
                  placeholder="Ej. Juan García"
                  required
                />
                <AppInput
                  v-model="newClient.email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="juan@empresa.com"
                  hint="La contraseña temporal se generará automáticamente de forma segura."
                  required
                />
                <AppInput
                  v-model="newClient.company"
                  label="Empresa"
                  placeholder="Nombre de la empresa"
                  required
                />
                <div class="modal-field">
                  <label class="modal-label">Plan</label>
                  <AppSelect
                    v-model="newClient.plan"
                    placeholder="Selecciona un plan"
                    :options="[
                      { value: 'basico', label: 'Básico' },
                      { value: 'pro', label: 'Pro' }
                    ]"
                  />
                </div>
                <div class="modal-footer">
                  <AppButton variant="outline" @click="showAddModal = false" type="button" :disabled="isSubmitting">Cancelar</AppButton>
                  <AppButton variant="fill" type="submit" :loading="isSubmitting">Agregar Cliente</AppButton>
                </div>
              </form>
            </template>

            <template v-else>
              <div class="modal-body" style="text-align: center; padding: 3rem 2rem;">
                <div style="font-size: 3.5rem; color: #16a34a; margin-bottom: 1rem; display: flex; justify-content: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 64px; height: 64px;">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="modal-title" style="margin-bottom: 1.5rem; font-size: 1.5rem;">¡Negocio creado exitosamente!</h3>
                
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
                  <p style="margin: 0; font-size: 1.125rem; color: #374151;"><strong>Correo:</strong> {{ createdClientData.email }}</p>
                  <p style="margin: 0.5rem 0 0; font-size: 1.125rem; color: #374151;"><strong>Contraseña:</strong> {{ createdClientData.password }}</p>
                </div>

                <AppButton variant="fill" style="width: 100%; padding: 0.875rem; font-size: 1rem; justify-content: center;" @click="copyWelcomeMessage">
                  Copiar mensaje de bienvenida
                </AppButton>
                <AppButton variant="outline" style="width: 100%; margin-top: 0.75rem; justify-content: center;" @click="closeModalOrSuccess()">
                  Cerrar
                </AppButton>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Modal Confirmar Cambio de Estado -->
    <ConfirmationModal
      :isOpen="!!toggleTarget"
      :title="toggleTarget?.is_active ? 'Desactivar cuenta' : 'Activar cuenta'"
      type="warning"
      :confirmText="toggleTarget?.is_active ? 'Sí, desactivar' : 'Sí, activar'"
      @close="toggleTarget = null"
      @confirm="applyToggle"
      :isLoading="isSubmitting"
    >
      <div v-if="toggleTarget">
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
        <p v-if="toggleTarget.is_active" class="toggle-msg toggle-msg-warn">
          Al <strong>desactivar</strong> esta cuenta, el cliente perderá acceso al sistema hasta que sea reactivado.
        </p>
        <p v-else class="toggle-msg toggle-msg-warn">
          Al <strong>activar</strong> esta cuenta, el cliente recuperará acceso completo al sistema.
        </p>
      </div>
    </ConfirmationModal>

    <!-- Confirm Delete Modal -->
    <ConfirmationModal
      :isOpen="!!deleteTarget"
      title="Eliminar Cliente Permanentemente"
      type="danger"
      confirmText="Eliminar definitivamente"
      @close="deleteTarget = null; deleteConfirmText = ''"
      @confirm="deleteClient"
      :isLoading="isSubmitting"
      :isConfirmDisabled="deleteConfirmText !== (deleteTarget?.company || deleteTarget?.name)"
    >
      <div v-if="deleteTarget">
        <p class="delete-msg" style="color: #dc2626; font-weight: 500;">
          Esta acción borrará todas sus ventas e inventario y no se puede deshacer.
        </p>
        <AppInput
          v-model="deleteConfirmText"
          :label="`Escribe el nombre del negocio ${deleteTarget?.company || deleteTarget?.name} para confirmar la eliminación definitiva:`"
          placeholder="Nombre del negocio"
        />
      </div>
    </ConfirmationModal>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { AppButton, AppSelect, AppInput, ConfirmationModal, Pagination } from '@/components/ui';
import apiClient from '@/services/api';
import { useSnackbar } from '@/composables/useSnackbar';
import { useAuth } from '@/composables/useAuth';

const { enqueueSnackbar } = useSnackbar();
const { currentUser } = useAuth();

interface Client {
  id: string | number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  is_active: boolean;
  avatarColor: string;
  company?: string;
  plan?: string;
  store_id?: string;
}

interface CreateWithOwnerResponse {
  credentials?: {
    username?: string;
    email?: string;
    password?: string;
  };
}

const AVATAR_COLORS = [
  '#06402B', '#0f766e', '#1d4ed8', '#7c3aed',
  '#b45309', '#be185d', '#0369a1', '#15803d',
];

const clients = ref<Client[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const searchQuery = ref('');
const statusFilter = ref<'all' | 'active' | 'inactive'>('all');
const showAddModal = ref(false);
const deleteTarget = ref<Client | null>(null);
const toggleTarget = ref<Client | null>(null);
const createdClientData = ref<{ email: string; password?: string } | null>(null);
const activeKebabMenu = ref<string | number | null>(null);
const deleteConfirmText = ref('');

const toggleKebabMenu = (id: string | number | null) => {
  activeKebabMenu.value = activeKebabMenu.value === id ? null : id;
};

const closeModalOrSuccess = () => {
  showAddModal.value = false;
  createdClientData.value = null;
  newClient.value = { name: '', email: '', company: '', plan: 'basico' };
};

const copyWelcomeMessage = async () => {
  if (!createdClientData.value) return;
  const msg = `¡Hola! Tu Punto de Venta Nurax está listo. Ingresa en app.nurax.mx con tu correo: ${createdClientData.value.email} y esta contraseña temporal: ${createdClientData.value.password}`;
  try {
    await navigator.clipboard.writeText(msg);
    enqueueSnackbar({ type: 'success', title: 'Copiado', message: 'Mensaje de bienvenida copiado al portapapeles.', duration: 3000 });
  } catch (e) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo copiar el mensaje.', duration: 3000 });
  }
};

const newClient = ref({
  name: '',
  email: '',
  company: '',
  plan: 'basico',
});

const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

let searchTimeout: ReturnType<typeof setTimeout>;
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchClients();
  }, 300);
});

watch([currentPage, pageSize], () => {
  fetchClients();
});

/**
 * Verifica si un cliente es el usuario actual (admin)
 * Si es verdad, no se puede desactivar ni eliminar
 */
const isCurrentAdminUser = (clientId: string | number): boolean => {
  return clientId === currentUser.value?.id && currentUser.value?.role === 'admin';
};

// Abre el modal de confirmación para cambiar el estado
const confirmToggle = (client: Client) => {
  // No permitir desactivar/activar la cuenta del admin actual
  if (isCurrentAdminUser(client.id)) {
    enqueueSnackbar({
      type: 'error',
      title: 'Acción no permitida',
      message: 'No puedes cambiar el estado de tu propia cuenta.',
      duration: 3000
    });
    return;
  }
  toggleTarget.value = client;
};

// Aplica el cambio de estado después de confirmar
const applyToggle = async () => {
  if (!toggleTarget.value) return;
  const client = toggleTarget.value;
  const newState = !client.is_active;
  isSubmitting.value = true;
  try {
    // PATCH /v1/accounts/users/software-clients/{id}/toggle-active/
    const response = await apiClient.patch<{ active: boolean }>(
      `/v1/accounts/users/software-clients/${client.id}/toggle-active/`,
      { is_active: newState }
    );
    if (response.success && response.data !== undefined) {
      // Actualizamos localmente. El backend devuelve la respuesta pero el estado se actualiza con newState
      client.is_active = newState;
      const action = client.is_active ? 'activado' : 'desactivado';
      enqueueSnackbar({ type: 'success', title: 'Estado actualizado', message: `El cliente fue ${action} correctamente.`, duration: 3000 });
      // Re-fetch para confirmar el estado persistido en el servidor
      await fetchClients();
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo actualizar el estado.', duration: 4000 });
    }
  } catch (error) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    isSubmitting.value = false;
    toggleTarget.value = null; // Cerramos el modal solo al terminar para poder mostrar el loading antes
  }
};

const confirmDelete = (client: Client) => {
  // No permitir eliminar la cuenta del admin actual
  if (isCurrentAdminUser(client.id)) {
    enqueueSnackbar({
      type: 'error',
      title: 'Acción no permitida',
      message: 'No puedes eliminar tu propia cuenta.',
      duration: 3000
    });
    return;
  }
  deleteTarget.value = client;
};

const deleteClient = async () => {
  if (!deleteTarget.value) return;
  const targetId = deleteTarget.value.id;
  isSubmitting.value = true;
  try {
    // DELETE /v1/accounts/users/software-clients/{id}/ (soft delete => is_active=false)
    const response = await apiClient.delete(`/v1/accounts/users/software-clients/${targetId}/`);
    if (response.success) {
      clients.value = clients.value.filter(c => c.id !== targetId);
      enqueueSnackbar({ type: 'success', title: 'Cliente eliminado', message: 'La cuenta fue eliminada permanentemente.', duration: 3000 });
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo eliminar el cliente.', duration: 3000 });
    }
  } catch (err) {
    console.error(err);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión al servidor.', duration: 3000 });
  } finally {
    isSubmitting.value = false;
    deleteTarget.value = null;
    deleteConfirmText.value = '';
  }
};

const fetchClients = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchQuery.value,
      status: statusFilter.value
    };
    // Consumir /api/v1/accounts/users/software-clients/ — dueños de tienda
    const response = await apiClient.get<any>('/v1/accounts/users/software-clients/', { params });
    if (response.success && response.data) {
      // Manejar formato paginado DRF: {count, next, previous, results}
      const clientsList = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      totalItems.value = response.data.count ?? clientsList.length;
      
      clients.value = clientsList.map((c: any, index: number) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        role: c.role || 'owner',
        is_active: Boolean(c.is_active),
        joinDate: c.created_at
          ? new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—',
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length] ?? '#06402B',
        company: c.store_name,
        plan: c.store_plan,
        store_id: c.store_id,
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

const addClient = async () => {
  isSubmitting.value = true;
  try {
    const normalizedPlan = newClient.value.plan === 'básico' ? 'basico' : newClient.value.plan;
    const payload = {
      store_name: newClient.value.company?.trim() || `Tienda de ${newClient.value.name.trim()}`,
      store_plan: normalizedPlan,
      store_tax_id: '',
      owner_email: newClient.value.email,
      owner_name: newClient.value.name,
    };
    
    const response = await apiClient.post<CreateWithOwnerResponse>('/v1/accounts/stores/create-with-owner/', payload);
    if (response.success) {
      const username = response.data?.credentials?.username || payload.owner_email;
      const password = response.data?.credentials?.password || 'nurax123';
      
      createdClientData.value = { email: username, password };
      await fetchClients(); // Recargar la lista con los IDs reales de la DB
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo crear el cliente. Verifica los datos.', duration: 4000 });
    }
  } catch (error) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'Error de conexión con el servidor.', duration: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.clients-wrapper {
  flex: 2;
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
  font-family: inherit;
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
  font-family: inherit;
  color: #111827;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-brand-main);
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.08);
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
  font-weight: 700;
  color: #0284c7;
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
.plan-pro      { background: #fef08a; color: #ca8a04; }
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

/* Kebab Menu */
.kebab-menu-container {
  position: relative;
}

.kebab-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 50;
  padding: 0.25rem 0;
}

.kebab-item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.kebab-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.kebab-item.delete-item {
  color: #dc2626;
}

.kebab-item.delete-item:hover:not(:disabled) {
  background: #fef2f2;
}

/* Action button */
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

/* Disabled state */
.toggle-switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toggle-switch:disabled .toggle-thumb {
  box-shadow: none;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn:disabled:hover {
  background: white;
  border-color: #e5e7eb;
  color: #6b7280;
}

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
  font-family: inherit;
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
  font-family: inherit;
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
