---
name: Nurax Inventario — Contexto del Proyecto
description: >
  Guía de referencia rápida para agentes AI. Describe tecnologías, estructura,
  componentes reutilizables y consumos de API del sistema de gestión de inventario Nurax.
---

# 🧠 Nurax Inventario — Project Skill

> Sistema de gestión de inventario, ventas y proveedores para pequeños y medianos negocios.
> Frontend SPA en **Vue 3 + TypeScript + Vite**. Backend en **Django REST Framework**.

---

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Lenguaje | TypeScript |
| Build | Vite |
| Estilos | CSS Scoped + TailwindCSS v4 (tokens en `style.css`) |
| Estado | Pinia |
| Routing | Vue Router 4 |
| HTTP | Fetch nativo vía `ApiClient` (`services/api.ts`) |
| Auth | JWT (access + refresh token en `localStorage`) |
| Imágenes | Cloudinary (URLs almacenadas en backend) |
| Animaciones | AOS (solo en Login y LandingPage) |
| Icons | Heroicons (`@heroicons/vue/24/outline`) |
| Excel | SheetJS (`xlsx`) |

---

## 🎨 Diseño & Paleta

**NO usar colores ad-hoc. Siempre usar los tokens del tema:**

```css
/* Marca */
--color-brand-main: #227d52
--color-brand-main-gradient: linear-gradient(to top, #227d52, #13452d)
--color-brand-secondary: #06402B

/* Fondos */
--color-background: #ffffff
--color-card-fill: #ffffff
--color-card-border: #e5e7eb

/* Texto */
--color-text-main: #1f2937
--color-text-secondary: #6b7280

/* Estados */
--color-status-success: #22c55e
--color-status-warning: #f97316
--color-status-danger: #ef4444
```

- **Fuente:** `Inter` (Google Fonts)
- **Border-radius botones:** `30px` (pill)
- **Border-radius inputs:** `12px`
- **Border-radius cards:** `16-24px`

---

## 📁 Estructura de `/src`

```
src/
│
├── App.vue                   # Raíz: RouterView + LoadingScreen + SnackbarContainer
├── main.ts                   # Bootstrap Vue + Pinia + Router
├── style.css                 # Design tokens globales (paleta, fuente, scrollbar)
│
├── views/                    # Una vista por ruta del router
│   ├── LandingPage.vue       # Página pública de promoción del producto (ruta: /)
│   ├── Login.vue             # Autenticación con AOS (ruta: /auth/login)
│   ├── Inventory.vue         # Panel de inventario principal (ruta: /dashboard/inventory)
│   ├── SalesHistory.vue      # Historial de ventas + gráfica (ruta: /dashboard/sales)
│   ├── Suppliers.vue         # CRUD de proveedores (ruta: /dashboard/suppliers)
│   ├── AdminClients.vue      # Gestión de usuarios — solo admin (ruta: /dashboard/clients)
│   └── Settings.vue          # Config de tienda — solo cliente (ruta: /dashboard/settings)
│
├── components/
│   ├── common/               # Componentes globales (usados en App.vue)
│   │   ├── LoadingScreen.vue       # Pantalla de carga post-login
│   │   ├── Snackbar.vue            # Toast individual
│   │   └── SnackbarContainer.vue  # Cola de toasts
│   │
│   ├── layout/               # Shell del dashboard
│   │   ├── DashboardLayout.vue    # Layout principal: sidebar + topbar + modales globales
│   │   └── Sidebar.vue            # Menú lateral con navegación por roles
│   │
│   ├── dashboard/            # Componentes de panel de datos
│   │   ├── ProductTable.vue       # Tabla de productos con filtros, paginación y acciones
│   │   └── StatsCard.vue          # Tarjeta de estadística (ícono + valor + tendencia)
│   │
│   ├── ui/                   # Design system base — SIEMPRE usar estos en lugar de HTML nativo
│   │   ├── AppButton.vue          # Botón: variantes fill / outline, loading state
│   │   ├── AppInput.vue           # Input: label, ícono, toggle password, error/hint
│   │   └── ConfirmationModal.vue  # Modal genérico de confirmación (¿Eliminar?)
│   │
│   └── (raíz de components/) # Modales de negocio específicos
│       ├── AddProductModal.vue        # Formulario alta de producto
│       ├── EditProductModal.vue       # Formulario edición de producto
│       ├── AddSupplierModal.vue       # Formulario alta de proveedor
│       ├── DeleteConfirmModal.vue     # Confirmación de borrado
│       ├── SalesModal.vue             # POS: venta rápida
│       ├── SaleSuccessModal.vue       # Recibo de venta exitosa
│       ├── BarcodeScanner.vue         # Escáner de código de barras (cámara)
│       ├── InventoryReceiptModal.vue  # Recibo de recepción de inventario
│       ├── NotificationPanel.vue      # Panel flotante de alertas de stock
│       └── ProductDetail.vue          # Detalle de producto
│
├── composables/              # Lógica reactiva compartida (Vue hooks)
│   ├── useAuth.ts            # ⭐ Auth principal: login, logout, initSession, currentUser
│   ├── useSnackbar.ts        # Cola global de notificaciones → enqueueSnackbar()
│   ├── useLoadingScreen.ts   # Control de LoadingScreen post-login
│   ├── useStoreSettings.ts   # Configuración de tienda desde API (singleton)
│   └── useSuppliers.ts       # CRUD de proveedores desde API
│
├── services/                 # Capa HTTP — solo llaman a la API, no tienen estado
│   ├── api.ts                # ⭐ ApiClient: fetch + JWT inject + refresh token interceptor
│   └── auth.service.ts       # login(), fetchUser(), updateAvatar(), logout()
│
├── stores/                   # Estado global Pinia
│   ├── product.store.ts      # ⭐ Productos: fetch, add, update, delete, stock, computed
│   └── sales.store.ts        # ⭐ Ventas: fetch, add, cancelSale, weeklyData, modal state
│
├── router/
│   └── index.ts              # Rutas + guard de autenticación y roles
│
├── utils/
│   └── (formatters, helpers) # Funciones puras sin estado
│
└── assets/                   # Recursos estáticos procesados por Vite
```

---

## 🛣️ Rutas y Roles

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | `LandingPage.vue` | Público |
| `/auth/login` | `Login.vue` | Público |
| `/dashboard/inventory` | `Inventory.vue` | Rol: `cliente` |
| `/dashboard/sales` | `SalesHistory.vue` | Rol: `cliente` |
| `/dashboard/suppliers` | `Suppliers.vue` | Rol: `cliente` |
| `/dashboard/clients` | `AdminClients.vue` | Rol: `admin` |
| `/dashboard/settings` | `Settings.vue` | Rol: `cliente` |

> El guard hace `await initSession()` (singleton) antes de evaluar la sesión.
> Admin → redirige a `/dashboard/clients`. Cliente → redirige a `/dashboard/inventory`.

---

## 🌐 Endpoints de API

**Base URL:** `VITE_API_BASE_URL` → fallback `http://localhost:8000/api`

### ✅ Endpoints Activos

| Endpoint | Método | Quién | Descripción |
|---|---|---|---|
| `/auth/login/` | POST | `auth.service` | Obtiene `access` + `refresh` JWT |
| `/auth/refresh/` | POST | `api.ts` auto | Interceptor 401 — renueva token silenciosamente |
| `/users/me/` | GET | `auth.service` | Perfil del usuario autenticado |
| `/users/me/avatar/` | PATCH (FormData) | `auth.service` | Actualizar foto de perfil |
| `/products/` | GET | `product.store` | Lista todos los productos del usuario |
| `/products/` | POST (FormData) | `product.store` | Crea producto (con imagen a Cloudinary) |
| `/products/:id/` | PATCH (FormData) | `product.store` | Edita producto |
| `/sales/` | GET | `sales.store` | Lista ventas del usuario |
| `/sales/` | POST | `sales.store` | Registra una venta nueva |
| `/sales/:id/cancel/` | POST | `sales.store` | Cancela una venta |
| `/store/` | GET | `useStoreSettings` | Config de tienda (nombre, moneda, etc.) |
| `/suppliers/` | GET | `useSuppliers` | Lista proveedores |
| `/suppliers/` | POST | `useSuppliers` | Crea proveedor |
| `/suppliers/:id/` | DELETE | `useSuppliers` | Elimina proveedor |

### ⏳ Endpoints Pendientes (no implementados aún)

| Endpoint | Método | Descripción |
|---|---|---|
| `/auth/register/` | POST | Registro de usuario (placeholder en auth.service) |
| `/auth/verify/` | POST | Verificación de token (placeholder) |
| `/products/:id/` | DELETE | Borrado físico en backend (actualmente solo local) |

---

## 🧩 Componentes más usados

### `AppButton.vue` — `@/components/ui/AppButton.vue`
```vue
<AppButton variant="fill" @click="handler">Guardar</AppButton>
<AppButton variant="outline" :loading="isSaving">Cancelar</AppButton>
<AppButton variant="fill" :disabled="true">Desactivado</AppButton>
```
Props: `variant: 'fill' | 'outline'`, `loading: boolean`, `disabled: boolean`, `fullWidth: boolean`, `type: 'button'|'submit'|'reset'`

---

### `AppInput.vue` — `@/components/ui/AppInput.vue`
```vue
<AppInput v-model="email" label="Correo" type="email" placeholder="..." :error="errorMsg">
  <template #icon>
    <svg>...</svg>  <!-- ícono izquierdo -->
  </template>
</AppInput>
```
Props: `modelValue`, `label`, `type`, `placeholder`, `error`, `hint`, `required`, `disabled`, `autocomplete`

---

### `useSnackbar` — `@/composables/useSnackbar.ts`
```ts
const { enqueueSnackbar } = useSnackbar()

enqueueSnackbar({ type: 'success', title: 'Guardado', message: 'Cambios guardados.', duration: 3000 })
enqueueSnackbar({ type: 'error', title: 'Error', message: 'No se pudo conectar.' })
// type: 'success' | 'error' | 'warning' | 'info'
```

---

### `useAuth` — `@/composables/useAuth.ts`
```ts
const { currentUser, isAuthenticated, login, logout, initSession, updateAvatarUrl } = useAuth()

// currentUser.value → { id, username, name, email, role: 'admin'|'cliente', avatar_url }
```

---

### `DashboardLayout.vue` — `@/components/layout/DashboardLayout.vue`
Todas las vistas del dashboard **se renderizan dentro de este layout** vía `<slot />`.
Incluye: sidebar, topbar (búsqueda, perfil, notificaciones), modales de perfil y Excel.
**No importar manualmente** — el router lo resuelve.

---

### `StatsCard.vue` — `@/components/dashboard/StatsCard.vue`
```vue
<StatsCard title="Productos" :value="totalProducts" icon="📦" trend="+12%" />
```

---

### `ConfirmationModal.vue` — `@/components/ui/ConfirmationModal.vue`
```vue
<ConfirmationModal
  v-if="showConfirm"
  title="¿Eliminar producto?"
  message="Esta acción no se puede deshacer."
  @confirm="handleDelete"
  @cancel="showConfirm = false"
/>
```

---

## 🚫 Reglas Importantes para Agentes

1. **No crear nuevos stores** sin revisar si `product.store.ts` o `sales.store.ts` ya cubren la necesidad.
2. **No duplicar lógica de auth** — toda la autenticación pasa por `useAuth.ts`.
3. **No hacer `fetch` directo** — siempre usar `apiClient` de `services/api.ts`.
4. **No usar colores hardcodeados** — siempre usar variables CSS del tema.
5. **No crear botones o inputs con HTML nativo** — usar `AppButton` y `AppInput`.
6. **No crear archivos en `layouts/`** — esa carpeta fue eliminada. Los layouts viven en `components/layout/`.
7. **No crear vistas tipo "placeholder"** — si una vista no tiene contenido real, no existe.
8. **El rol `admin` solo ve `/dashboard/clients`** — no tiene acceso a inventario, ventas ni proveedores.
9. **El rol `cliente` no ve `/dashboard/clients`** — el router lo bloquea y redirige.
10. **Imágenes de productos** → se suben como `FormData` con campo `image_file` → backend maneja Cloudinary.
