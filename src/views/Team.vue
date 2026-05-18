<template>
  <DashboardLayout>
    <div class="team-shell">
      <div class="team-page">
        <div class="team-header">
          <div>
            <h1 class="page-title">Equipo</h1>
            <p class="page-subtitle">
              Gestiona cajeros y administradores de tu tienda con una vista clara de cupos, accesos y actividad.
            </p>
          </div>

          <div class="team-header-actions">
            <div class="plan-meter-card" :class="planStateClass">
              <div class="plan-meter-top">
                <div>
                  <div class="plan-meter-label">Uso del plan</div>
                  <div class="plan-meter-text">{{ planUsageText }}</div>
                </div>
                <div class="plan-meter-pill">{{ planNameLabel }}</div>
              </div>
              <div class="plan-meter-bar">
                <div class="plan-meter-fill" :style="{ width: planUsagePercent + '%' }"></div>
              </div>
            </div>

            <AppButton variant="fill" @click="openDrawer" :disabled="!canAddMore">
              <PlusIcon class="btn-icon" />
              Agregar miembro
            </AppButton>
          </div>
        </div>

        <div class="team-table-card">
          <div class="team-table-header">
            <div>
              <h2>Miembros activos</h2>
              <p>Usuarios que tienen acceso al sistema en esta tienda.</p>
            </div>
            <div class="team-table-meta">{{ visibleEmployees.length }} visibles</div>
          </div>

          <template v-if="isLoading">
            <div class="team-loading-grid">
              <div v-for="n in 4" :key="n" class="team-skeleton-row">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-line skeleton-line-lg"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-badge"></div>
                <div class="skeleton skeleton-line"></div>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="visibleEmployees.length === 0" class="team-empty-state">
              <div class="team-empty-illustration">
                <UserGroupIcon class="team-empty-icon" />
              </div>
              <h3>AÃºn no tienes empleados registrados.</h3>
              <p>Agrega a tu equipo para llevar un mejor control de tus turnos de caja.</p>
              <AppButton variant="outline" @click="openDrawer" :disabled="!canAddMore">
                <PlusIcon class="btn-icon" />
                Agregar primer miembro
              </AppButton>
            </div>

            <div v-else class="team-table-wrap">
              <table class="team-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Usuario de ingreso</th>
                    <th>Rol</th>
                    <th>Ãšltimo acceso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in visibleEmployees" :key="employee.id" :class="{ 'row-suspended': !employee.is_active }">
                    <td>
                      <div class="employee-cell">
                        <div class="employee-avatar" :class="roleAvatarClass(employee.membership_role)">
                          <img v-if="employee.avatar_url" :src="employee.avatar_url" :alt="employee.name">
                          <span v-else>{{ employee.initials }}</span>
                        </div>
                        <div>
                          <div class="employee-name">{{ employee.name }}</div>
                          <div class="employee-meta">{{ employee.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="login-cell">
                        <span class="login-username">{{ employee.username }}</span>
                        <button class="copy-icon-btn" @click="copyUsername(employee)" :title="copiedEmployeeId === employee.id ? 'Copiado' : 'Copiar usuario de ingreso'">
                          <CheckCircleIcon v-if="copiedEmployeeId === employee.id" class="copy-icon copy-icon-success" />
                          <ClipboardIcon v-else class="copy-icon" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span class="role-badge" :class="roleBadgeClass(employee.membership_role)">
                        {{ employee.role_label }}
                      </span>
                    </td>
                    <td>
                      <span class="last-access" :class="{ muted: employee.last_login === null }">
                        {{ formatLastLogin(employee.last_login) }}
                      </span>
                    </td>
                    <td>
                      <div class="kebab-wrap">
                        <button class="icon-kebab-btn" :class="{ active: openMenuId === employee.id }" @click.stop="openMenuId = openMenuId === employee.id ? '' : employee.id">
                          <EllipsisVerticalIcon class="kebab-icon" />
                        </button>
                        
                        <transition name="fade">
                          <div v-if="openMenuId === employee.id" class="kebab-menu">
                            <button class="kebab-item" @click="openEditDrawer(employee)">
                              <PencilIcon class="kebab-item-icon" /> Editar empleado
                            </button>
                            <button class="kebab-item" @click="confirmResetPassword(employee)">
                              <KeyIcon class="kebab-item-icon" /> Restablecer contraseÃ±a
                            </button>
                            <div class="kebab-divider"></div>
                            <button class="kebab-item" :class="employee.is_active ? 'text-danger' : 'text-success'" @click="toggleEmployeeStatus(employee)">
                              <NoSymbolIcon v-if="employee.is_active" class="kebab-item-icon" /> 
                              <PlayCircleIcon v-else class="kebab-item-icon" /> 
                              {{ employee.is_active ? 'Suspender acceso' : 'Reactivar acceso' }}
                            </button>
                          </div>
                        </transition>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="openMenuId" class="menu-overlay" @click="openMenuId = ''"></div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <transition name="drawer-fade">
        <div v-if="showDrawer" class="drawer-backdrop" @click.self="closeDrawer">
          <div class="drawer-panel">
            <div class="drawer-head">
              <div>
                <p class="drawer-kicker" v-if="!isEditing">Nuevo miembro</p>
                <p class="drawer-kicker" v-else>Editar miembro</p>
                <h2 v-if="!isEditing">Crear acceso para el equipo</h2>
                <h2 v-else>Actualizar empleado</h2>
              </div>
              <button class="icon-close-btn" @click="closeDrawer">
                <XMarkIcon class="close-icon" />
              </button>
            </div>

            <p class="drawer-description" v-if="!isEditing">
              Completa los datos y genera accesos listos para entregar al instante.
            </p>
            <p class="drawer-description" v-else>
              Modifica los detalles del empleado o suspende su acceso.
            </p>

            <form class="drawer-form" @submit.prevent="submitEmployee">
              <div v-if="isEditing" class="field-stack" style="margin-bottom: 0.5rem;">
                <label class="field-label">Estado de la cuenta</label>
                <div class="toggle-status-wrap">
                  <div class="toggle-status-text">
                    <span :class="employeeStatusClass">{{ employeeStatusText }}</span>
                  </div>
                  <button type="button" class="switch-btn" :class="{ 'switch-active': currentEditIsActive }" @click="toggleEditStatus">
                    <div class="switch-thumb"></div>
                  </button>
                </div>
              </div>
              <AppInput
                v-model="form.name"
                label="Nombre completo"
                placeholder="Ej. MarÃ­a LÃ³pez"
                required
              />

              <div class="field-stack">
                <label class="field-label">Usuario de ingreso</label>
                <div class="username-row">
                  <input
                    v-model="form.username"
                    type="text"
                    class="text-input"
                    :placeholder="isEditing ? '' : 'galileo_maria'"
                    @input="onUsernameInput"
                    :disabled="isEditing"
                    :class="{ 'input-disabled': isEditing }"
                  >
                  <button v-if="!isEditing" type="button" class="ghost-button" @click="syncUsernameFromName">
                    Recalcular
                  </button>
                </div>
                <p class="field-help" v-if="!isEditing">Se sugiere automÃ¡ticamente con el formato tienda_empleado.</p>
                <p class="field-help" v-else>El usuario de ingreso no se puede cambiar por seguridad e historial.</p>
              </div>

              <div class="field-stack" v-if="!isEditing">
                <label class="field-label">ContraseÃ±a</label>
                <div class="password-row">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="text-input password-input"
                    placeholder="ContraseÃ±a segura"
                    required
                  >
                  <button type="button" class="icon-toggle-btn" @click="showPassword = !showPassword" :title="showPassword ? 'Ocultar contraseÃ±a' : 'Mostrar contraseÃ±a'">
                    <EyeIcon v-if="!showPassword" class="toggle-icon" />
                    <EyeSlashIcon v-else class="toggle-icon" />
                  </button>
                </div>
                <button type="button" class="ghost-button secondary" @click="generateSecurePassword">
                  Generar segura
                </button>
              </div>

              <div class="field-stack">
                <label class="field-label">Rol</label>
                <div class="role-select-wrap">
                  <button type="button" class="role-select-button" @click="showRoleMenu = !showRoleMenu">
                    <div>
                      <div class="role-select-label">{{ selectedRoleOption.label }}</div>
                      <div class="role-select-helper">{{ selectedRoleOption.helper }}</div>
                    </div>
                    <ChevronDownIcon class="role-chevron" />
                  </button>

                  <transition name="fade">
                    <div v-if="showRoleMenu" class="role-select-menu">
                      <button
                        v-for="option in roleOptions"
                        :key="option.value"
                        type="button"
                        class="role-select-item"
                        :class="{ active: form.role === option.value }"
                        @click="selectRole(option.value)"
                      >
                        <div class="role-select-item-title">{{ option.label }}</div>
                        <div class="role-select-item-helper">{{ option.helper }}</div>
                      </button>
                    </div>
                  </transition>
                </div>
              </div>

              <div class="drawer-actions">
                <AppButton variant="outline" type="button" @click="closeDrawer" :disabled="isSaving">
                  Cancelar
                </AppButton>
                <AppButton variant="fill" type="submit" :loading="isSaving" :disabled="!canAddMore && !isEditing">
                  {{ isEditing ? 'Guardar cambios' : 'Crear empleado' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="showSuccessModal" class="success-backdrop" @click.self="closeSuccessModal">
          <div class="success-card">
            <div class="success-icon-wrap">
              <CheckCircleIcon class="success-icon" />
            </div>
            <h2>Â¡Empleado creado exitosamente!</h2>
            <p class="success-copy">
              Entrega estos accesos al cajero para que pueda entrar de inmediato.
            </p>

            <div class="credentials-grid">
              <div class="credential-box">
                <span class="credential-label">Usuario</span>
                <span class="credential-value">{{ createdCredentials.username }}</span>
              </div>
              <div class="credential-box">
                <span class="credential-label">ContraseÃ±a</span>
                <span class="credential-value credential-password">{{ createdCredentials.password }}</span>
              </div>
            </div>

            <div class="success-actions">
              <AppButton variant="fill" class="copy-access-btn" @click="copyAccesses">
                <ClipboardIcon class="btn-icon" />
                Copiar accesos
              </AppButton>
              <AppButton variant="outline" @click="closeSuccessModal">
                Cerrar
              </AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="fade">
        <div v-if="showResetModal" class="success-backdrop" @click.self="cancelReset">
          <div class="success-card">
            <div class="success-icon-wrap" style="background: linear-gradient(135deg, #fee2e2, #fef9c3);">
              <KeyIcon class="success-icon" style="color: #ea580c;" />
            </div>
            <h2>Â¿Restablecer contraseÃ±a?</h2>
            <p class="success-copy">
              Se generarÃ¡ una nueva contraseÃ±a segura para <strong>{{ resetTargetEmployee?.name }}</strong>. PodrÃ¡s copiarla en el siguiente paso.
            </p>
            
            <div class="success-actions" style="margin-top: 1.5rem;">
              <AppButton variant="outline" @click="cancelReset" :disabled="isSaving">
                Cancelar
              </AppButton>
              <AppButton variant="fill" @click="executeResetPassword" :loading="isSaving">
                Generar nueva contraseÃ±a
              </AppButton>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useSnackbar } from '@/composables/useSnackbar';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { AppButton, AppInput } from '@/components/ui';
import apiClient from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ClipboardIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  KeyIcon,
  NoSymbolIcon,
  PlayCircleIcon
} from '@heroicons/vue/24/outline';

const { currentUser } = useAuth();
const { enqueueSnackbar } = useSnackbar();

interface TeamEmployee {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  role_label: string;
  membership_role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  initials: string;
}

interface TeamResponse {
  store: {
    id: string;
    name: string;
    plan: string;
  };
  plan_limit: number | null;
  employees_count: number;
  can_add_more: boolean;
  employees: TeamEmployee[];
}

interface EmployeeForm {
  name: string;
  username: string;
  password: string;
  role: 'cashier' | 'manager';
}

interface RoleOption {
  value: 'cashier' | 'manager';
  label: string;
  helper: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'cashier',
    label: 'Cajero',
    helper: 'Solo puede cobrar y ver su propio turno.',
  },
  {
    value: 'manager',
    label: 'Admin',
    helper: 'Acceso total a reportes, inventario y configuraciÃ³n.',
  },
];

const isLoading = ref(false);
const isSaving = ref(false);
const showDrawer = ref(false);
const showSuccessModal = ref(false);
const showRoleMenu = ref(false);
const showPassword = ref(false);
const usernameTouched = ref(false);
const copiedEmployeeId = ref('');
const openMenuId = ref('');
const isEditing = ref(false);
const editingEmployeeId = ref('');
const employees = ref<TeamEmployee[]>([]);
const planLimit = ref<number | null>(null);
const storePlan = ref('basico');
const storeName = ref('');
const canAddMore = ref(true);

const form = ref<EmployeeForm>({
  name: '',
  username: '',
  password: '',
  role: 'cashier',
});

const createdCredentials = ref({
  username: '',
  password: '',
  email: '',
});

const normalize = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const generateSecurePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let result = '';
  for (let index = 0; index < 12; index += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  form.value.password = result;
};

const buildSuggestedUsername = () => {
  const storeSlug = normalize(storeName.value || 'tienda');
  const employeeSlug = normalize(form.value.name || 'empleado');
  return `${storeSlug}_${employeeSlug}`.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
};

const syncUsernameFromName = () => {
  form.value.username = buildSuggestedUsername();
  usernameTouched.value = false;
};

const onUsernameInput = () => {
  usernameTouched.value = true;
};

const selectRole = (role: EmployeeForm['role']) => {
  form.value.role = role;
  showRoleMenu.value = false;
};

const selectedRoleOption = computed<RoleOption>(() => {
  return roleOptions.find((option) => option.value === form.value.role) || roleOptions[0]!;
});

const currentStoreId = computed(() => currentUser.value?.store_profile?.id || '');

const visibleEmployees = computed(() => employees.value.filter((employee) => employee.membership_role !== 'owner'));

const planNameLabel = computed(() => {
  if (!storePlan.value) return 'Plan';
  return storePlan.value === 'basico' ? 'Plan BÃ¡sico' : 'Plan Pro';
});

const planUsagePercent = computed(() => {
  if (!planLimit.value || planLimit.value <= 0) return 0;
  return Math.min(100, Math.round((employees.value.length / planLimit.value) * 100));
});

const planStateClass = computed(() => {
  if (!planLimit.value) return 'plan-state-neutral';
  if (employees.value.length >= planLimit.value) return 'plan-state-danger';
  if (planUsagePercent.value >= 80) return 'plan-state-warning';
  return 'plan-state-ok';
});

const planUsageText = computed(() => {
  if (!planLimit.value) return `${employees.value.length} miembros activos`;
  return `${employees.value.length} de ${planLimit.value} cupos usados`;
});

const roleBadgeClass = (role: string) => {
  if (role === 'owner') return 'badge-owner';
  if (role === 'manager') return 'badge-admin';
  return 'badge-cashier';
};

const roleAvatarClass = (role: string) => {
  if (role === 'owner') return 'avatar-owner';
  if (role === 'manager') return 'avatar-admin';
  return 'avatar-cashier';
};

const formatLastLogin = (lastLogin: string | null) => {
  if (!lastLogin) return 'Nunca';
  return formatDistanceToNow(new Date(lastLogin), { addSuffix: true, locale: es });
};

const copyText = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text);
    enqueueSnackbar({ type: 'success', title: 'Copiado', message: successMessage, duration: 2200 });
  } catch {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo copiar al portapapeles.', duration: 3000 });
  }
};

const copyUsername = async (employee: TeamEmployee) => {
  copiedEmployeeId.value = employee.id;
  await copyText(employee.username, `Usuario ${employee.username} copiado.`);
  window.setTimeout(() => {
    if (copiedEmployeeId.value === employee.id) {
      copiedEmployeeId.value = '';
    }
  }, 1500);
};

const copyAccesses = async () => {
  const payload = `Usuario: ${createdCredentials.value.username}\nContraseÃ±a: ${createdCredentials.value.password}`;
  await copyText(payload, 'Accesos copiados.');
};

const resetForm = () => {
  form.value = {
    name: '',
    username: '',
    password: '',
    role: 'cashier',
  };
  usernameTouched.value = false;
  showPassword.value = false;
  isEditing.value = false;
  editingEmployeeId.value = '';
  generateSecurePassword();
};

const openDrawer = () => {
  resetForm();
  showDrawer.value = true;
};

const closeDrawer = () => {
  showDrawer.value = false;
  showRoleMenu.value = false;
  isEditing.value = false;
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const openEditDrawer = (employee: TeamEmployee) => {
  resetForm();
  isEditing.value = true;
  editingEmployeeId.value = employee.id;
  form.value.name = employee.name;
  form.value.username = employee.username;
  form.value.role = employee.membership_role as 'cashier' | 'manager';
  form.value.password = '';
  openMenuId.value = '';
  showDrawer.value = true;
};

const toggleEmployeeStatus = async (employee: TeamEmployee) => {
  if (!currentStoreId.value) return;
  
  openMenuId.value = '';
  const newState = !employee.is_active;
  try {
    const response = await apiClient.patch<{ success: boolean; data: TeamEmployee }>(
      `/v1/stores/${currentStoreId.value}/employees/${employee.id}/`,
      { is_active: newState }
    );
    if (response.success && response.data) {
      await loadTeam();
      enqueueSnackbar({ type: 'success', title: 'Ã‰xito', message: `El acceso ha sido ${newState ? 'reactivado' : 'suspendido'}.`, duration: 4000 });
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo actualizar el estado.', duration: 4000 });
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo actualizar el estado.', duration: 4000 });
  }
};

const currentEditIsActive = computed(() => {
  const emp = employees.value.find(e => e.id === editingEmployeeId.value);
  return emp ? emp.is_active : false;
});
const employeeStatusText = computed(() => currentEditIsActive.value ? 'Activo' : 'Suspendido');
const employeeStatusClass = computed(() => currentEditIsActive.value ? 'status-text-active' : 'status-text-suspended');

const toggleEditStatus = async () => {
  const emp = employees.value.find(e => e.id === editingEmployeeId.value);
  if (emp) {
    await toggleEmployeeStatus(emp);
  }
};

const showResetModal = ref(false);
const resetTargetEmployee = ref<TeamEmployee | null>(null);

const confirmResetPassword = (employee: TeamEmployee) => {
  openMenuId.value = '';
  resetTargetEmployee.value = employee;
  showResetModal.value = true;
};

const cancelReset = () => {
  showResetModal.value = false;
  resetTargetEmployee.value = null;
};

const executeResetPassword = async () => {
  if (!currentStoreId.value || !resetTargetEmployee.value) return;
  
  isSaving.value = true;
  try {
    const response = await apiClient.post<{ success: boolean; new_password: string }>(
      `/v1/stores/${currentStoreId.value}/employees/${resetTargetEmployee.value.id}/reset-password/`,
      {}
    );
    if (response.success && response.data) {
      createdCredentials.value = {
        username: resetTargetEmployee.value.username,
        password: response.data.new_password,
        email: resetTargetEmployee.value.email
      };
      showResetModal.value = false;
      showSuccessModal.value = true;
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo restablecer la contraseÃ±a.', duration: 4000 });
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo restablecer la contraseÃ±a.', duration: 4000 });
  } finally {
    isSaving.value = false;
  }
};

const loadTeam = async () => {
  if (!currentStoreId.value) {
    employees.value = [];
    planLimit.value = null;
    storePlan.value = '';
    storeName.value = currentUser.value?.store_profile?.name || '';
    canAddMore.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const response = await apiClient.get<TeamResponse>(`/v1/stores/${currentStoreId.value}/employees/`);
    if (response.success && response.data) {
      const data = response.data;
      employees.value = data.employees || [];
      planLimit.value = data.plan_limit;
      storePlan.value = data.store?.plan || '';
      storeName.value = data.store?.name || currentUser.value?.store_profile?.name || '';
      canAddMore.value = data.can_add_more;
    } else {
      enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo cargar el equipo.', duration: 4000 });
    }
  } catch (error) {
    console.error('Error loading team:', error);
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo cargar el equipo.', duration: 4000 });
  } finally {
    isLoading.value = false;
  }
};

const submitEmployee = async () => {
  if (!currentStoreId.value) {
    enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo identificar la tienda.', duration: 4000 });
    return;
  }

  isSaving.value = true;
  try {
    if (isEditing.value) {
      const payload = {
        name: form.value.name.trim(),
        role: form.value.role,
      };

      const response = await apiClient.patch<{ success: boolean; data: TeamEmployee }>(
        `/v1/stores/${currentStoreId.value}/employees/${editingEmployeeId.value}/`,
        payload,
      );

      if (response.success && response.data) {
        showDrawer.value = false;
        await loadTeam();
        enqueueSnackbar({ type: 'success', title: 'Ã‰xito', message: 'Empleado actualizado correctamente.', duration: 4000 });
      } else {
        enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo actualizar el empleado.', duration: 4000 });
      }
    } else {
      const payload = {
        name: form.value.name.trim(),
        username: form.value.username.trim(),
        password: form.value.password,
        role: form.value.role,
      };

      const response = await apiClient.post<{ employee: TeamEmployee; credentials: { username: string; password: string; email: string } }>(
        `/v1/stores/${currentStoreId.value}/employees/`,
        payload,
      );

      if (response.success && response.data) {
        createdCredentials.value = response.data.credentials;
        showDrawer.value = false;
        showSuccessModal.value = true;
        await loadTeam();
      } else {
        enqueueSnackbar({ type: 'error', title: 'Error', message: response.error || 'No se pudo crear el empleado.', duration: 4000 });
      }
    }
  } catch (error: any) {
    console.error('Error saving employee:', error);
    const message = error?.response?.data?.error || 'No se pudo guardar el empleado.';
    enqueueSnackbar({ type: 'error', title: 'Error', message, duration: 4000 });
  } finally {
    isSaving.value = false;
  }
};

watch(
  () => form.value.name,
  () => {
    if (!usernameTouched.value) {
      form.value.username = buildSuggestedUsername();
    }
  },
);

watch(
  () => currentStoreId.value,
  async () => {
    await loadTeam();
  },
  { immediate: true },
);

watch(
  () => showDrawer.value,
  (open) => {
    if (!open) {
      showRoleMenu.value = false;
    }
  },
);

onMounted(() => {
  if (!form.value.password) {
    generateSecurePassword();
  }
});
</script>

<style scoped>
.team-shell {
  flex: 2;
  overflow-y: auto;
  height: 100%;
  background:transparent;
}

.team-page {
  background-color: var(--color-background-secondary);
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.team-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  margin: 0.35rem 0 0;
  color: #64748b;
  max-width: 760px;
}

.team-header-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.plan-meter-card {
  min-width: 280px;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.plan-meter-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.plan-meter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.plan-meter-text {
  margin-top: 0.2rem;
  font-weight: 700;
  color: #0f172a;
}

.plan-meter-pill {
  border-radius: 999px;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: #e2e8f0;
  color: #334155;
  white-space: nowrap;
}

.plan-meter-bar {
  margin-top: 0.75rem;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.plan-meter-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s ease;
  background: linear-gradient(90deg, #16a34a, #84cc16);
}

.plan-state-warning .plan-meter-fill {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.plan-state-danger .plan-meter-fill {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.team-table-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.15rem;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.06);
}

.team-table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.team-table-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

.team-table-header p {
  margin: 0.15rem 0 0;
  color: #64748b;
}

.team-table-meta {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
}

.team-loading-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.team-skeleton-row {
  display: grid;
  grid-template-columns: 56px minmax(180px, 1.8fr) minmax(180px, 1.1fr) 120px 140px;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton {
  border-radius: 999px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
}

.skeleton-line {
  height: 0.85rem;
}

.skeleton-line-lg {
  height: 1rem;
}

.skeleton-badge {
  width: 90px;
  height: 1.7rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.team-table-wrap {
  overflow-x: auto;
}

.team-table {
  width: 100%;
  border-collapse: collapse;
}

.team-table thead th {
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  font-weight: 800;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.team-table tbody td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #eef2f7;
  vertical-align: middle;
}

.team-table tbody tr:hover {
  background: #f8fafc;
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-owner { background: linear-gradient(135deg, #06402b, #16a34a); }
.avatar-admin { background: linear-gradient(135deg, #1d4ed8, #0f766e); }
.avatar-cashier { background: linear-gradient(135deg, #475569, #0f172a); }

.employee-name {
  font-weight: 800;
  color: #0f172a;
}

.employee-meta {
  color: #64748b;
  font-size: 0.86rem;
}

.login-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-username {
  font-weight: 700;
  color: #0f172a;
}

.copy-icon-btn {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-icon-btn:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.copy-icon {
  width: 16px;
  height: 16px;
}

.copy-icon-success {
  color: #16a34a;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 800;
}

.badge-owner { background: #dcfce7; color: #166534; }
.badge-admin { background: #dbeafe; color: #1d4ed8; }
.badge-cashier { background: #e2e8f0; color: #334155; }

.last-access {
  color: #334155;
  font-weight: 600;
}

.last-access.muted {
  color: #94a3b8;
}

.team-empty-state {
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.9rem;
}

.team-empty-illustration {
  width: 84px;
  height: 84px;
  border-radius: 24px;
  background: linear-gradient(180deg, #ecfdf5, #f8fafc);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1fae5;
}

.team-empty-icon {
  width: 42px;
  height: 42px;
  color: #0f766e;
}

.team-empty-state h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}

.team-empty-state p {
  margin: 0;
  max-width: 640px;
  color: #64748b;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.drawer-backdrop,
.success-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.drawer-backdrop {
  z-index: 10100;
}

.success-backdrop {
  z-index: 10120;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
}

.drawer-panel {
  width: min(100%, 540px);
  height: 100%;
  background: #ffffff;
  box-shadow: -24px 0 60px rgba(15, 23, 42, 0.18);
  padding: 1.5rem;
  overflow-y: auto;
}

.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.drawer-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  font-weight: 800;
  font-size: 0.75rem;
}

.drawer-head h2 {
  margin: 0.25rem 0 0;
  color: #0f172a;
  font-size: 1.45rem;
  font-weight: 900;
}

.icon-close-btn {
  width: 42px;
  height: 42px;
  border: none;
  background: #f8fafc;
  color: #475569;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-icon {
  width: 20px;
  height: 20px;
}

.drawer-description {
  margin: 0.8rem 0 1.2rem;
  color: #64748b;
}

.drawer-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.86rem;
  font-weight: 800;
  color: #0f172a;
}

.field-help {
  margin: 0;
  color: #94a3b8;
  font-size: 0.8rem;
}

.username-row,
.password-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.text-input {
  width: 100%;
  border: 1.5px solid #dbe3ef;
  border-radius: 16px;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  background: #ffffff;
  transition: all 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #06402b;
  box-shadow: 0 0 0 4px rgba(6, 64, 43, 0.1);
}

.password-input {
  padding-right: 3.4rem;
}

.ghost-button {
  border: none;
  background: #eef2ff;
  color: #1d4ed8;
  border-radius: 14px;
  padding: 0.82rem 0.95rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.ghost-button.secondary {
  align-self: flex-start;
  background: transparent;
  color: #0f766e;
  border: 1px dashed #99f6e4;
}

.icon-toggle-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: #f8fafc;
  color: #475569;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-icon {
  width: 18px;
  height: 18px;
}

.role-select-wrap {
  position: relative;
}

.role-select-button {
  width: 100%;
  border: 1.5px solid #dbe3ef;
  background: #ffffff;
  border-radius: 16px;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
}

.role-select-label {
  font-weight: 800;
  color: #0f172a;
}

.role-select-helper {
  margin-top: 0.2rem;
  color: #64748b;
  font-size: 0.82rem;
  text-align: left;
}

.role-chevron {
  width: 18px;
  height: 18px;
  color: #64748b;
  flex-shrink: 0;
}

.role-select-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 2;
  border: 1px solid #dbe3ef;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.16);
  padding: 0.45rem;
}

.role-select-item {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 0.75rem 0.8rem;
  border-radius: 14px;
  cursor: pointer;
}

.role-select-item:hover,
.role-select-item.active {
  background: #f8fafc;
}

.role-select-item-title {
  font-weight: 800;
  color: #0f172a;
}

.role-select-item-helper {
  color: #64748b;
  font-size: 0.82rem;
  margin-top: 0.1rem;
}

.drawer-actions,
.success-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.6rem;
}

.success-card {
  width: min(100%, 640px);
  background: #ffffff;
  border-radius: 28px;
  padding: 2rem;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);
  text-align: center;
}

.success-icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #dcfce7, #fef9c3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  width: 38px;
  height: 38px;
  color: #15803d;
}

.success-card h2 {
  margin: 0;
  font-size: 1.55rem;
  color: #0f172a;
  font-weight: 900;
}

.success-copy {
  margin: 0.55rem auto 1.35rem;
  color: #64748b;
  max-width: 520px;
}

.credentials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.credential-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1rem;
  text-align: left;
}

.credential-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.credential-value {
  display: block;
  margin-top: 0.45rem;
  color: #0f172a;
  font-weight: 900;
  font-size: 1.25rem;
  word-break: break-all;
}

.credential-password {
  letter-spacing: 0.06em;
}

.copy-access-btn {
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #111827;
}

.copy-access-btn:hover {
  filter: brightness(0.98);
}

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
}

.kebab-wrap {
  position: relative;
  z-index: 11;
  display: flex;
  justify-content: flex-end;
}

.icon-kebab-btn {
  border: none;
  background: transparent;
  color: #64748b;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-kebab-btn:hover, .icon-kebab-btn.active {
  background: #f1f5f9;
  color: #0f172a;
}

.kebab-icon {
  width: 20px;
  height: 20px;
}

.kebab-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  z-index: 20;
}

.kebab-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.kebab-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.kebab-item-icon {
  width: 16px;
  height: 16px;
}

.kebab-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0.25rem 0;
}

.text-danger {
  color: #ef4444 !important;
}

.text-danger:hover {
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.text-success {
  color: #10b981 !important;
}

.text-success:hover {
  background: #ecfdf5 !important;
  color: #059669 !important;
}

.row-suspended td {
  opacity: 0.55;
}

.input-disabled {
  background: #f8fafc !important;
  color: #94a3b8 !important;
  cursor: not-allowed;
  border-color: #e2e8f0 !important;
}

.toggle-status-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.toggle-status-text {
  font-weight: 700;
  font-size: 0.95rem;
}

.status-text-active {
  color: #16a34a;
}

.status-text-suspended {
  color: #ef4444;
}

.switch-btn {
  width: 48px;
  height: 26px;
  background: #cbd5e1;
  border-radius: 999px;
  border: none;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-btn.switch-active {
  background: #16a34a;
}

.switch-thumb {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 999px;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.switch-active .switch-thumb {
  transform: translateX(22px);
}

@media (max-width: 980px) {
  .team-header {
    flex-direction: column;
  }

  .team-header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .plan-meter-card {
    flex: 1;
    min-width: 0;
  }

  .team-skeleton-row {
    grid-template-columns: 56px minmax(160px, 1.4fr) minmax(140px, 1fr);
  }
}

@media (max-width: 760px) {
  .team-page {
    padding: 1rem;
  }

  .team-header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .success-card {
    padding: 1.5rem;
  }

  .credentials-grid {
    grid-template-columns: 1fr;
  }

  .drawer-panel {
    width: 100%;
    padding: 1.2rem;
  }

  .drawer-actions,
  .success-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .team-table thead {
    display: none;
  }

  .team-table tbody tr {
    display: grid;
    gap: 0.75rem;
    padding: 1rem 0;
  }

  .team-table tbody td {
    border-bottom: none;
    padding: 0;
  }
}
</style>

