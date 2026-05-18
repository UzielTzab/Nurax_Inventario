# Arquitectura Final del frontend

Este documento describe el frontend real de `nurax_inventario` al 2026-05-17.
El nombre vigente es Arquitectura Final.

## Resumen

Nurax Inventario es una SPA Vue 3 con TypeScript. El login vive en `/` y las
pantallas operativas viven bajo `/dashboard/*`. Cada vista ruteada del dashboard
usa `DashboardLayout.vue`, que concentra sidebar, acciones POS, menu de perfil,
modal de editar perfil, notificaciones, sincronizacion Pusher y el modal global
de ventas.

## Entrada de la app

- `src/main.ts` crea la app, registra Pinia, Vue Router y `AppButton` global.
- En desarrollo se desregistran service workers para evitar cache vieja.
- `src/App.vue` contiene `RouterView` y `SnackbarContainer`.
- `vite.config.ts` habilita Vue, Vue DevTools, Tailwind, alias `@` y PWA.

## Rutas

| Ruta | Vista | Roles |
| --- | --- | --- |
| `/` | `Login.vue` | publica |
| `/dashboard` | redirige a dashboard valido | sesion |
| `/dashboard/onboarding` | `OnboardingWizard.vue` | `cliente`, `propietario` |
| `/dashboard/inventory` | `Inventory.vue` | `cliente`, `propietario`, `gerente`, `admin`, `cajero` |
| `/dashboard/sales` | `SalesHistory.vue` | `cliente`, `propietario`, `gerente`, `admin` |
| `/dashboard/suppliers` | `Suppliers.vue` | `cliente`, `propietario`, `gerente`, `admin` |
| `/dashboard/shifts` | `Shifts.vue` | `cliente`, `propietario`, `gerente`, `admin`, `cajero` |
| `/dashboard/expenses` | `Expenses.vue` | `cliente`, `propietario`, `admin` |
| `/dashboard/receivables` | `AccountsReceivable.vue` | `cliente`, `propietario`, `gerente`, `admin`, `cajero` |
| `/dashboard/clients` | `AdminClients.vue` | `admin` |
| `/dashboard/settings` | `Settings.vue` | `cliente`, `propietario`, `admin` |
| `/dashboard/team` | `Team.vue` | `propietario` |
| `/:pathMatch(.*)*` | redirect a `/` | fallback |

El guard de `src/router/index.ts` siempre ejecuta `initSession()` antes de
decidir. Si el usuario ya tiene sesion y entra a `/`, se manda a
`/dashboard/clients` si es `admin`; el resto va a `/dashboard/inventory`.

## Roles

El router normaliza roles de backend:

- `owner` -> `propietario`
- `manager` -> `gerente`
- `cashier` -> `cajero`

Para usuarios `cliente`, el guard revisa `store_profile.membership_role`.
Los owners sin setup completo van a `/dashboard/onboarding`; empleados no pueden
entrar al onboarding.

## Autenticacion

La autenticacion viva esta en:

- `src/services/api.ts`
- `src/services/auth.service.ts`
- `src/composables/useAuth.ts`

El frontend no guarda tokens en `localStorage`. El backend envia cookies
HttpOnly y `apiClient` usa `credentials: 'include'`. Cuando recibe un `401`,
`apiClient` intenta `POST /auth/refresh/` y reintenta la peticion original.

`useAuth()` mantiene estado singleton con:

- `isAuthenticated`
- `currentUser`
- `login()`
- `logout()`
- `initSession()`
- `checkSession()`
- `updateAvatarUrl()`

`initSession()` reutiliza una unica promise para evitar pedir `/me/` varias
veces desde el router y la app al mismo tiempo.

## Estado

Stores Pinia reales:

- `product.store.ts`: CRUD de productos, codigos, empaques, ajustes manuales,
  kardex y metricas locales.
- `sales.store.ts`: historial de ventas, cuentas por cobrar, pagos, cancelacion
  y estado del modal POS. En historial, el ID visible usa `sale_number` del
  backend; el UUID (`id`) queda como identificador tecnico.
- `shifts.store.ts`: turnos/cortes de caja y turno abierto.
- `expenses.store.ts`: listado y alta de gastos.
- `onboarding.store.ts`: datos locales del wizard antes de enviarlo.

Composables principales:

- `useProducts()`: paginacion y filtros de productos.
- `useCategories()`: categorias para formularios/filtros.
- `useSuppliers()`: proveedores.
- `useStoreSettings()`: datos de tienda.
- `useChangePassword()`: validacion y submit de contrasena.
- `useSnackbar()`: notificaciones globales.

## Layout y UI

`DashboardLayout.vue` es el shell operativo. Maneja:

- `Sidebar.vue`
- acciones POS visibles segun ruta
- menu y modal de perfil
- cambio de password dentro del modal de perfil
- modal de QR para emparejar scanner
- modal global `SalesModal.vue`
- eventos globales de importacion Excel
- Pusher del usuario para `INVENTORY_UPDATED`

El design system esta en `src/components/ui/`:

- `AppButton`
- `AppInput`
- `AppSelect`
- `AppFormSection`
- `AppSkeleton`
- `ConfirmationModal`
- `AppModal`
- `AppEmptyState`
- `Pagination`
- `Badge`
- `WhatsAppIcon`

Tokens globales relevantes estan en `src/style.css`:

- brand amarillo: `#e6ab17`
- texto principal: `#1f2937`
- sidebar/brand dark legacy: `#06402b`
- bordes: `#e5e7eb`
- success/warning/danger: `#22c55e`, `#f97316`, `#ef4444`

## Pusher

Hay dos zonas de tiempo real:

- `DashboardLayout.vue` se suscribe a `pos-user-{userId}` y escucha
  `INVENTORY_UPDATED`, `update` y `message` para refrescar productos.
- `SalesModal.vue` usa Pusher para POS y carrito. Se autentica contra
  `POST /pusher/auth/`, escucha `PRODUCT_SCANNED`, `INVENTORY_UPDATED`,
  `SALES_COMPLETED`, `SALES_CANCELLED` y tambien canales privados de carrito
  `private-cart-{sessionId}` con `CART_UPDATED`.

## PWA

`vite-plugin-pwa` esta activo con `registerType: 'autoUpdate'`. El manifest usa
el nombre `Nurax - Inventario`, icono `/images/nurax_logo_app_192.png` y cachea
assets de build e imagenes de logo.

## Observaciones actuales

- `src/views/Products.vue` existe, pero no esta registrada en el router actual.
  La pantalla viva de inventario es `src/views/Inventory.vue`.
- El logout en `DashboardLayout.vue` empuja a `/auth/login`; como esa ruta no
  existe, el catch-all termina redirigiendo a `/`. Funciona, pero conviene
  normalizarlo a `/` cuando se toque el layout.
