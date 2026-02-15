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
      <div class="user-profile-container" ref="menuRef">
        <div class="user-profile" @click="toggleUserMenu">
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

        <!-- User Dropdown Menu -->
        <div v-if="showUserMenu" class="user-menu-dropdown">
          <div class="menu-header">
            <span class="menu-user-name">Alex D.</span>
            <span class="menu-user-email">alex@nurax.com</span>
          </div>
          <div class="menu-divider"></div>
          <button class="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
            </svg>
            Mi Perfil
          </button>
          <button class="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            Configuración
          </button>
          <div class="menu-divider"></div>
          <button class="menu-item text-danger" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clip-rule="evenodd" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { logout } = useAuth();
const emit = defineEmits(['quickSell']);

const showUserMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleLogout = () => {
  logout();
  router.push('/login');
};

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

.logo-icon-container {
  width: 36px;
  height: 36px;
  background: var(--color-brand-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-primary);
  flex-shrink: 0;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: var(--color-brand-primary);
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
  cursor: pointer;
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

.user-profile-container {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
  user-select: none;
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

/* User Menu Dropdown */
.user-menu-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 0.5rem;
  z-index: 1000;
  animation: slideUp 0.15s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  padding: 1rem;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.menu-user-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.menu-user-email {
  color: #6B7280;
  font-size: 0.75rem;
}

.menu-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 0.25rem 0;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #F3F4F6;
}

.menu-item svg {
  width: 18px;
  height: 18px;
  color: #6B7280;
}

.menu-item.text-danger {
  color: #EF4444;
}

.menu-item.text-danger:hover {
  background: #FEF2F2;
}

.menu-item.text-danger svg {
  color: #EF4444;
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
