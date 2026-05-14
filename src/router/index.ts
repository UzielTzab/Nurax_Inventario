import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Views - Auth
import Login from '@/views/Login.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Login,
    meta: { title: 'Login', public: true }
  },
  {
    path: '/dashboard',
    // Removed static redirect, handled in guard
    redirect: () => {
      // Will be handled in the guard. For fallback:
      return '/dashboard/inventory'
    }
  },
  {
    path: '/dashboard/onboarding',
    component: () => import('@/components/onboarding/OnboardingWizard.vue'),
    meta: { title: 'Configuración Inicial', roles: ['cliente', 'propietario'] }
  },
  {
    path: '/dashboard/inventory',
    component: () => import('@/views/Inventory.vue'),
    meta: { title: 'Inventario', roles: ['cliente', 'propietario', 'gerente', 'admin', 'cajero'] }
  },
  {
    path: '/dashboard/sales',
    component: () => import('@/views/SalesHistory.vue'),
    meta: { title: 'Historial de Ventas', roles: ['cliente', 'propietario', 'gerente', 'admin'] }
  },
  {
    path: '/dashboard/suppliers',
    component: () => import('@/views/Suppliers.vue'),
    meta: { title: 'Proveedores', roles: ['cliente', 'propietario', 'gerente', 'admin'] }
  },
  {
    path: '/dashboard/shifts',
    component: () => import('@/views/Shifts.vue'),
    meta: { title: 'Corte de Caja', roles: ['cliente', 'propietario', 'gerente', 'admin', 'cajero'] }
  },
  {
    path: '/dashboard/expenses',
    component: () => import('@/views/Expenses.vue'),
    meta: { title: 'Gastos', roles: ['cliente', 'propietario', 'admin'] }
  },
  {
    path: '/dashboard/receivables',
    component: () => import('@/views/AccountsReceivable.vue'),
    meta: { title: 'Cuentas por Cobrar', roles: ['cliente', 'propietario', 'gerente', 'admin', 'cajero'] }
  },
  {
    path: '/dashboard/clients',
    component: () => import('@/views/AdminClients.vue'),
    meta: { title: 'Clientes', roles: ['admin'] }
  },
  {
    path: '/dashboard/settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: 'Configuración', roles: ['cliente', 'propietario', 'admin'] }
  },
  {
    path: '/dashboard/team',
    component: () => import('@/views/Team.vue'),
    meta: { title: 'Equipo', roles: ['propietario'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación
router.beforeEach(async (to) => {
  const { isAuthenticated, currentUser, initSession } = useAuth()
  const normalizeRole = (role?: string) => {
    const membershipRole = ((currentUser.value as any)?.store_profile?.membership_role || '').toLowerCase()
    if (membershipRole === 'owner') return 'propietario'
    if (membershipRole === 'manager') return 'gerente'
    if (membershipRole === 'cashier') return 'cajero'

    const normalized = (role || '').toLowerCase()
    if (normalized === 'owner') return 'propietario'
    if (normalized === 'manager') return 'gerente'
    if (normalized === 'cashier') return 'cajero'
    return normalized
  }

  // Esperar a que se restaure la sesión desde los tokens guardados.
  // initSession() usa un singleton -> solo llama al backend UNA vez,
  // sin importar cuántas veces el guard se ejecute.
  await initSession()

  // Si el usuario ya está logueado e intenta entrar al login, mandarlo directo a su dashboard.
  if (to.path === '/' && isAuthenticated.value) {
    const role = normalizeRole(currentUser.value?.role)
    return role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
  }

  // Rutas públicas (landing, etc.) se permiten si no cayeron en el caso de arriba
  if (to.meta.public) return true

  // Si después de initSession() no hay sesión válida y no es ruta pública → login
  if (!isAuthenticated.value) return '/'

  // ⭐ Detectar si cliente no completó el setup y redirigir al onboarding
  if (currentUser.value?.role === 'cliente') {
    const storeProfile = (currentUser.value as any).store_profile
    const membershipRole = (storeProfile?.membership_role || '').toLowerCase()
    const isOnboardingRoute = to.path === '/dashboard/onboarding'
    
    if (membershipRole === 'owner' || membershipRole === '') {
      if (storeProfile && !storeProfile.is_first_setup_completed && !isOnboardingRoute) {
        // Cliente no completó setup → mandarlo al onboarding
        return '/dashboard/onboarding'
      }
      
      if (storeProfile && storeProfile.is_first_setup_completed && isOnboardingRoute) {
        // Cliente ya completó setup pero intenta volver al onboarding → al inventory
        return '/dashboard/inventory'
      }
    } else {
      // Empleados no deben ver el onboarding
      if (isOnboardingRoute) {
        return '/dashboard/inventory'
      }
    }
  }

  // Redirigir la base del dashboard según el rol
  if (to.path === '/dashboard' && currentUser.value) {
    const role = normalizeRole(currentUser.value.role)
    return role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
  }

  // Verificar roles si la ruta los requiere
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && currentUser.value) {
    const userRole = normalizeRole(currentUser.value.role)
    if (!requiredRoles.includes(userRole)) {
      return userRole === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
    }
  }

  return true
})

export default router
