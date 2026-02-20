<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon-container">
          <div class="logo-icon">
            <img src="/nurax_logo.png" alt="Logo"></img>
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
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path :fill-rule="item.iconFillRule || 'evenodd'" :d="item.iconPath" :clip-rule="item.iconClipRule || 'evenodd'" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </div>
    </nav>


  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['quickSell', 'close']);

// Tipos para el menú
interface MenuItem {
  id: string;
  label: string;
  route?: string;
  iconPath: string;
  iconFillRule?: 'evenodd' | 'nonzero' | 'inherit';
  iconClipRule?: 'evenodd' | 'nonzero' | 'inherit';
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const activeItem = ref('inventory');

// Sync active item with route
watch(() => route.path, (path) => {
  if (path.includes('/dashboard/sales')) {
    activeItem.value = 'orders'; // 'orders' is the ID for Sales History in our menu
  } else if (path.includes('/dashboard/suppliers')) {
    activeItem.value = 'suppliers';
  } else if (path.includes('/dashboard/inventory') || path === '/dashboard') {
    activeItem.value = 'inventory';
  }
}, { immediate: true });

// Configuración del menú
const menuSections = ref<MenuSection[]>([
  {
    label: '',
    items: [
      {
        id: 'inventory',
        label: 'Inventario',
        route: '/dashboard/inventory',
        iconPath: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 001.972 0l.74-4.435A1 1 0 0110.853 2H13a1 1 0 011 1v2h.5A1.5 1.5 0 0115.5 6.5v9A1.5 1.5 0 0114 16.5H2A1.5 1.5 0 01.5 15v-9A1.5 1.5 0 012 4.5H2.5V3zm6 2v2h2V5H8z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      },
      {
        id: 'orders',
        label: 'Historial de ventas',
        route: '/dashboard/sales',
        iconPath: 'M3 4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm3 6h6v2H6v-2zm0 4h6v2H6v-2z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        route: '/dashboard/suppliers',
        iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      }
    ]
  },
 
]);

const setActive = (item: MenuItem) => {
  activeItem.value = item.id;
  if (item.route) {
    router.push(item.route);
  }
  // Auto-close on mobile
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
  background: #ffffff;
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
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  color: var(--color-brand-main);
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
  font-size: 1rem;
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
  border-radius: 10px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(6, 64, 43, 0.05);
  color: var(--color-brand-main);
  cursor: pointer;
}

.nav-item-active {
  background: transparent;
  color: var(--color-brand-main);
  font-weight: 700;
}

/* Pill indicator izquierdo redondeado */
.nav-item-active::before {
  content: '';
  display: block;
  position: absolute;
  left: -0rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: var(--color-brand-main);
  border-radius: 0 4px 4px 0;
}

.nav-item-active:hover {
  background: rgba(6, 64, 43, 0.04);
  color: var(--color-brand-main);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: inherit;
  transition: color 0.2s;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  color: inherit;
}

.nav-item-active .nav-icon,
.nav-item-active .nav-icon svg {
  color: var(--color-brand-main);
}


</style>



