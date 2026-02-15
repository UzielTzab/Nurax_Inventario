import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Views - Auth
import Login from '@/views/Login.vue'

// Views - Dashboard
import Dashboard from '@/views/Dashboard.vue'

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
    component: Dashboard,
    meta: { title: 'Dashboard' }
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
