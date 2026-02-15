<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <img src="/nurax_logo.png" alt="Logo"></img>
        </div>
        <div class="logo-text-container">
          <span class="logo-text">Nurax</span>
          <span class="logo-subtitle">INVENTARIO</span>
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
          @click.prevent="setActive(item.id)"
        >
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path :fill-rule="item.iconFillRule || 'evenodd'" :d="item.iconPath" :clip-rule="item.iconClipRule || 'evenodd'" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </div>
    </nav>

    <!-- User Profile & Appearance -->
    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <img src="https://ui-avatars.com/api/?name=Alex+D&background=f59e0b&color=fff" alt="User" />
          <div class="user-status"></div>
        </div>
        <div class="user-info">
          <div class="user-name">Alex D.</div>
          <div class="user-role">Gerente de Tienda</div>
        </div>
        <button class="user-menu-btn" title="Menú de Usuario">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- Appearance Button -->
      <button class="appearance-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
        <span>Apariencia</span>
        <div class="appearance-indicator"></div>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['quickSell']);

// Tipos para el menú
interface MenuItem {
  id: string;
  label: string;
  iconPath: string;
  iconFillRule?: 'evenodd' | 'nonzero' | 'inherit';
  iconClipRule?: 'evenodd' | 'nonzero' | 'inherit';
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const activeItem = ref('inventory');

// Configuración del menú
const menuSections = ref<MenuSection[]>([
  {
    label: 'MENÚ PRINCIPAL',
    items: [
      {
        id: 'inventory',
        label: 'Inventario',
        iconPath: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 001.972 0l.74-4.435A1 1 0 0110.853 2H13a1 1 0 011 1v2h.5A1.5 1.5 0 0115.5 6.5v9A1.5 1.5 0 0114 16.5H2A1.5 1.5 0 01.5 15v-9A1.5 1.5 0 012 4.5H2.5V3zm6 2v2h2V5H8z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      },
      {
        id: 'orders',
        label: 'Historial de ventas',
        iconPath: 'M3 4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm3 6h6v2H6v-2zm0 4h6v2H6v-2z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      },
      {
        id: 'suppliers',
        label: 'Proveedores',
        iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        iconFillRule: 'evenodd',
        iconClipRule: 'evenodd'
      }
    ]
  },
 
]);

const setActive = (id: string) => {
  activeItem.value = id;
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: var(--color-brand-secondary);
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 1.5rem 0;
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

.logo-icon {
  width: 36px;
  height: 36px;
  background: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-primary);
  flex-shrink: 0;
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
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
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
  background: linear-gradient(180deg, #F97316 0%, #EA580C 100%);
  color: white;
  border: none;
  border-radius: 12px;
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
  padding: 0 1rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-label {
  font-size: 0.5625rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 0.75rem;
  margin-bottom: 0.375rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item-active {
  background: var(--color-brand-primary);
  color: white;
  border-left: 3px solid transparent;
  font-weight: 600;
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.nav-item-active:hover {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: inherit;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  color: inherit;
}

.nav-item-active .nav-icon,
.nav-item-active .nav-icon svg {
  color: white;
}

.sidebar-footer {
  padding: 0 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: var(--color-brand-primary);
  border: 2px solid var(--color-brand-primary);
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  flex-shrink: 0;
}

.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.user-menu-btn svg {
  width: 16px;
  height: 16px;
}

.appearance-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.appearance-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.appearance-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.appearance-indicator {
  margin-left: auto;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>
