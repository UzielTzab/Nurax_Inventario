<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon-container">
          <div class="logo-icon">
            <!-- Leaf icon -->
            <img src="/public/nurax_logo.png" alt="Logo">
          </div>
        </div>
        <div class="logo-text-container">
          <span class="logo-text">Nurax</span>
        </div>
      </div>
    </div>
    <!-- Main Menu -->
    <nav class="sidebar-nav">
      <div 
        v-for="section in menuSections" 
        :key="section.label" 
        class="nav-section"
      >
        <div class="nav-section-label">{{ section.label }}</div>
        <a 
          v-for="item in section.items"
          :key="item.id"
          href="#" 
          class="nav-item"
          :class="{ 'nav-item-active': activeItem === item.id }"
          @click.prevent="setActive(item)"
        >
          <!-- Icon: outline when inactive, solid when active -->
          <component
            :is="activeItem === item.id ? item.iconSolid : item.iconOutline"
            class="nav-icon"
          />
          <span class="nav-text">{{ item.label }}</span>
        </a>
      </div>
    </nav>


  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import type { Component } from 'vue';

// Heroicons Outline (inactivo)
import {
  CubeIcon as CubeOutline,
  ShoppingBagIcon as ShoppingBagOutline,
  UsersIcon as UsersOutline,
  UserGroupIcon as UserGroupOutline,
} from '@heroicons/vue/24/outline';

// Heroicons Solid (activo)
import {
  CubeIcon as CubeSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  UsersIcon as UsersSolid,
  UserGroupIcon as UserGroupSolid,
} from '@heroicons/vue/24/solid';

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['quickSell', 'close']);
const { currentUser } = useAuth();

// Tipos para el menú
interface MenuItem {
  id: string;
  label: string;
  route?: string;
  iconOutline: Component; // Componente Heroicon Outline (inactivo)
  iconSolid: Component;   // Componente Heroicon Solid (activo)
  roles?: string[];
}

interface MenuSection {
  label: string;
  items: MenuItem[];
  roles?: string[];
}

const activeItem = ref('inventory');

// Sync active item with route
watch(() => route.path, (path) => {
  if (path.includes('/dashboard/sales')) {
    activeItem.value = 'orders';
  } else if (path.includes('/dashboard/suppliers')) {
    activeItem.value = 'suppliers';
  } else if (path.includes('/dashboard/inventory') || path === '/dashboard') {
    activeItem.value = 'inventory';
  } else if (path.includes('/dashboard/clients')) {
    activeItem.value = 'clients';
  }
}, { immediate: true });

// Todas las secciones del menú con control de roles
const allMenuSections: MenuSection[] = [
  {
    label: '',
    roles: ['cliente'],
    items: [
      {
        id: 'inventory',
        label: 'Inventario',
        route: '/dashboard/inventory',
        roles: ['cliente'],
        iconOutline: CubeOutline,
        iconSolid: CubeSolid,
      },
      {
        id: 'orders',
        label: 'Historial de ventas',
        route: '/dashboard/sales',
        roles: ['cliente'],
        iconOutline: ShoppingBagOutline,
        iconSolid: ShoppingBagSolid,
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        route: '/dashboard/suppliers',
        roles: ['cliente'],
        iconOutline: UsersOutline,
        iconSolid: UsersSolid,
      }
    ]
  },
  {
    label: 'Administración',
    roles: ['admin'],
    items: [
      {
        id: 'clients',
        label: 'Clientes',
        route: '/dashboard/clients',
        roles: ['admin'],
        iconOutline: UserGroupOutline,
        iconSolid: UserGroupSolid,
      }
    ]
  }
];

// Menú filtrado según el rol del usuario actual
const menuSections = computed(() => {
  const role = currentUser.value?.role ?? 'cliente';
  return allMenuSections
    .filter(s => !s.roles || s.roles.includes(role))
    .map(s => ({
      ...s,
      items: s.items.filter(i => !i.roles || i.roles.includes(role))
    }))
    .filter(s => s.items.length > 0);
});

const setActive = (item: MenuItem) => {
  activeItem.value = item.id;
  if (item.route) {
    router.push(item.route);
  }
  if (window.innerWidth <= 1024) {
    emit('close');
  }
};

defineProps<{
  isOpen?: boolean;
}>();

</script>

<style scoped>
.sidebar {
  width: 100%;
  background: var(--color-card-stats-fill);
  color: var(--color-text-main);
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 0 1.25rem;
  margin-bottom: 2.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.logo-icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--color-brand-main-dark);
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--color-brand-primary);
  line-height: 1;
  text-transform: uppercase;
}

.logo-tagline {
  font-size: 0.65rem;
  font-weight: 500;
  color: white;
  margin-top: 2px;
  font-style: italic;
  opacity: 0;
  animation: fadeInTagline 1s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes fadeInTagline {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar-action {
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.btn-sell-now {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--color-brand-main);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 3rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.1), 0 2px 4px -1px rgba(234, 88, 12, 0.06);
}

.btn-sell-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3), 0 4px 6px -2px rgba(234, 88, 12, 0.1);
}

.btn-sell-now svg {
  width: 20px;
  height: 20px;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  padding: 0 0.5rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.25rem;
  margin: 0 0.5rem;
  border-radius: 24px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 300;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(58, 66, 63, 0.05);
  color: var(--color-brand-main);
  cursor: pointer;
}

.nav-item-active {
  background: transparent;
  font-weight: 700;
}

.nav-item-active .nav-text {
  background: #000000;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Pill indicator izquierdo redondeado */
.nav-item-active::before {
  content: '';
  display: block;
  position: absolute;
  left: -1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 100%;
  /* Gradiente especial: verde claro -> verde oscuro -> verde claro */
  background: linear-gradient(210deg, #4ade80 0%, #06402b 100%);
  border-radius: 0 10px 10px 0;
}

.nav-item-active:hover {
  background: rgba(6, 64, 43, 0.04);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.nav-item-active .nav-icon,
.nav-item-active .nav-icon svg {
  color: var(--color-brand-main); /* Icono en sólido main */
}


</style>



