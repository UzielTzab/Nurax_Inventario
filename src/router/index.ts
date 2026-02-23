import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Views - Auth
import Login from '@/views/Login.vue'

// Views - Dashboard
import Inventory from '@/views/Inventory.vue'
import SalesHistory from '@/views/SalesHistory.vue'
import Suppliers from '@/views/Suppliers.vue'
import AdminClients from '@/views/AdminClients.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    component: Login,
    meta: { title: 'Login', public: true }
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/inventory'
  },
  {
    path: '/dashboard/inventory',
    component: Inventory,
    meta: { title: 'Inventario', roles: ['admin', 'cliente'] }
  },
  {
    path: '/dashboard/sales',
    component: SalesHistory,
    meta: { title: 'Historial de Ventas', roles: ['admin', 'cliente'] }
  },
  {
    path: '/dashboard/suppliers',
    component: Suppliers,
    meta: { title: 'Proveedores', roles: ['admin', 'cliente'] }
  },
  {
    path: '/dashboard/clients',
    component: AdminClients,
    meta: { title: 'Clientes', roles: ['admin'] }
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
router.beforeEach((to) => {
  const { isAuthenticated, currentUser } = useAuth()

  // Rutas públicas
  if (to.meta.public) return true

  // Si no está autenticado → login
  if (!isAuthenticated.value) return '/auth/login'

  // Verificar roles si la ruta los requiere
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && currentUser.value) {
    const userRole = currentUser.value.role
    if (!requiredRoles.includes(userRole)) {
      // Redirigir al área correcta según el rol
      return userRole === 'admin' ? '/dashboard/clients' : '/dashboard/inventory'
    }
  }

  return true
})

export default router
