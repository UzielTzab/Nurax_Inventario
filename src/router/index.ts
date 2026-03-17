import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Views - Landing
import LandingPage from '@/views/LandingPage.vue'

// Views - Auth
import Login from '@/views/Login.vue'

// Views - Dashboard
import Inventory from '@/views/Inventory.vue'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard.vue'
import SalesHistory from '@/views/SalesHistory.vue'
import Suppliers from '@/views/Suppliers.vue'
import AdminClients from '@/views/AdminClients.vue'
import Settings from '@/views/Settings.vue'
import Shifts from '@/views/Shifts.vue'
import Expenses from '@/views/Expenses.vue'
import AccountsReceivable from '@/views/AccountsReceivable.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LandingPage,
    meta: { title: 'Nurax - Gestión Inteligente de Inventario', public: true }
  },
  {
    path: '/auth/login',
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
    component: OnboardingWizard,
    meta: { title: 'Configuración Inicial', roles: ['cliente'] }
  },
  {
    path: '/dashboard/inventory',
    component: Inventory,
    meta: { title: 'Inventario', roles: ['cliente'] }
  },
  {
    path: '/dashboard/sales',
    component: SalesHistory,
    meta: { title: 'Historial de Ventas', roles: ['cliente'] }
  },
  {
    path: '/dashboard/suppliers',
    component: Suppliers,
    meta: { title: 'Proveedores', roles: ['cliente'] }
  },
  {
    path: '/dashboard/shifts',
    component: Shifts,
    meta: { title: 'Corte de Caja', roles: ['cliente'] }
  },
  {
    path: '/dashboard/expenses',
    component: Expenses,
    meta: { title: 'Gastos', roles: ['cliente'] }
  },
  {
    path: '/dashboard/receivables',
    component: AccountsReceivable,
    meta: { title: 'Cuentas por Cobrar', roles: ['cliente'] }
  },
  {
    path: '/dashboard/clients',
    component: AdminClients,
    meta: { title: 'Clientes', roles: ['admin'] }
  },
  {
    path: '/dashboard/settings',
    component: Settings,
    meta: { title: 'Configuración', roles: ['cliente'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación
router.beforeEach(async (to) => {
  const { isAuthenticated, currentUser, initSession } = useAuth()

  // Esperar a que se restaure la sesión desde los tokens guardados.
  // initSession() usa un singleton → solo llama al backend UNA vez,
  // sin importar cuántas veces el guard se ejecute.
  await initSession()

  // Si el usuario ya está logueado e intenta entrar al login, mandarlo directo a su dashboard.
  if (to.path === '/auth/login' && isAuthenticated.value) {
    return currentUser.value?.role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
  }

  // Rutas públicas (landing, etc.) se permiten si no cayeron en el caso de arriba
  if (to.meta.public) return true

  // Si después de initSession() no hay sesión válida y no es ruta pública → login
  if (!isAuthenticated.value) return '/auth/login'

  // ⭐ Detectar si cliente no completó el setup y redirigir al onboarding
  if (currentUser.value?.role === 'cliente') {
    const storeProfile = (currentUser.value as any).store_profile
    const isOnboardingRoute = to.path === '/dashboard/onboarding'
    
    if (storeProfile && !storeProfile.is_first_setup_completed && !isOnboardingRoute) {
      // Cliente no completó setup → mandarlo al onboarding
      return '/dashboard/onboarding'
    }
    
    if (storeProfile && storeProfile.is_first_setup_completed && isOnboardingRoute) {
      // Cliente ya completó setup pero intenta volver al onboarding → al inventory
      return '/dashboard/inventory'
    }
  }

  // Redirigir la base del dashboard según el rol
  if (to.path === '/dashboard' && currentUser.value) {
    return currentUser.value.role === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
  }

  // Verificar roles si la ruta los requiere
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && currentUser.value) {
    const userRole = currentUser.value.role
    if (!requiredRoles.includes(userRole)) {
      return userRole === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
    }
  }

  return true
})

export default router
