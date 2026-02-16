import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Views - Auth
import Login from '@/views/Login.vue'

// Views - Dashboard
import Dashboard from '@/views/Dashboard.vue'
import SalesHistory from '@/views/SalesHistory.vue'
import Suppliers from '@/views/Suppliers.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/inventory'
  },
  {
    path: '/dashboard/inventory',
    component: Dashboard,
    meta: { title: 'Inventario' }
  },
  {
    path: '/dashboard/sales',
    component: SalesHistory,
    meta: { title: 'Historial de Ventas' }
  },
  {
    path: '/dashboard/suppliers',
    component: Suppliers,
    meta: { title: 'Proveedores' }
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

export default router
