# Arquitectura Reestructurada - Nurax Inventario

## Descripción General

La aplicación ha sido reestructurada siguiendo una arquitectura limpia y escalable con separación clara de responsabilidades. Esta estructura permite mantener el código organizado, facilita el testing y prepara la aplicación para el consumo de APIs.

## Estructura de Carpetas

```
src/
├── main.ts                    ← Punto de entrada de la aplicación
├── App.vue                    ← Componente raíz
├── style.css                  ← Estilos globales y variables CSS
│
├── router/
│   └── index.ts              ← Configuración de Vue Router
│                              ← Guards de autenticación
│                              ← Rutas protegidas
│
├── layouts/                   ← Layouts reutilizables
│   ├── AuthLayout.vue         ← Layout para páginas de autenticación
│   └── DashboardLayout.vue    ← Layout para el dashboard (con Sidebar)
│
├── views/                     ← Páginas/Vistas completas
│   ├── Login.vue              ← Página de login
│   ├── Dashboard.vue          ← Página principal del dashboard
│   ├── ProductsView.vue       ← Vista de productos
│   └── InventoryView.vue      ← Vista de inventario
│
├── components/                ← Componentes reutilizables
│   ├── layout/
│   │   ├── DashboardLayout.vue ← (deprecated, ahora en layouts/)
│   │   ├── Sidebar.vue
│   │   └── TopBar.vue
│   ├── ui/                    ← Componentes UI base
│   │   ├── Badge.vue
│   │   ├── ButtonIcon.vue
│   │   ├── ButtonPrimary.vue
│   │   ├── CardContainer.vue
│   │   └── ... más componentes
│   ├── products/              ← Componentes específicos de productos
│   │   └── ProductCard.vue
│   ├── inventory/             ← Componentes específicos de inventario
│   ├── common/                ← Componentes comunes
│   │   ├── LoadingScreen.vue
│   │   ├── Snackbar.vue
│   │   └── SnackbarContainer.vue
│   └── dashboard/
│       ├── AlertBadges.vue
│       ├── DashboardOverview.vue
│       ├── FilterBar.vue
│       └── ... más componentes
│
├── stores/                    ← Stores de Pinia (State Management)
│   ├── auth.store.ts          ← Store de autenticación
│   ├── product.store.ts       ← Store de productos
│   └── inventory.store.ts     ← Store de inventario
│
├── services/                  ← Servicios de API y lógica de negocio
│   ├── api.ts                 ← Cliente HTTP base (ApiClient)
│   ├── auth.service.ts        ← Servicio de autenticación
│   └── product.service.ts     ← Servicio de productos
│
├── composables/               ← Lógica reutilizable (Composition API)
│   ├── useAuth.ts             ← Hook de autenticación
│   ├── useSnackbar.ts         ← Hook de notificaciones
│   └── useLoadingScreen.ts    ← Hook de pantalla de carga
│
└── assets/                    ← Recursos estáticos
    └── ... imágenes, fuentes, etc.
```

## Flujo de Autenticación

```
1. Usuario accede a "/" (raíz)
   ↓
2. Guard de router verifica isAuthenticated
   ↓
3. Si NO está autenticado → Redirige a "/auth/login"
   ├→ AuthLayout renderiza
   └→ Login.vue se muestra
   
4. Usuario completa login
   ├→ Login.vue emite evento
   ├→ App.vue captura con useLoadingScreen
   ├→ LoadingScreen se muestra
   
5. LoadingScreen completa
   ├→ completeLogin actualiza estado
   ├→ Router navega a "/"
   └→ Guard verifica isAuthenticated (ahora = true)
   
6. Dashboard se renderiza con DashboardLayout
   └→ Usuario puede navegar entre vistas
```

## Componentes Clave

### Router (router/index.ts)
- Configura todas las rutas de la aplicación
- Implementa guards de autenticación
- Maneja redirecciones
- Actualiza títulos de página

### Layouts
- **AuthLayout**: Wrapper simple para páginas de auth
- **DashboardLayout**: Incluye Sidebar + contenido principal

### Stores (Pinia)
Cada store manejaun dominio específico:

```typescript
// auth.store.ts
- user: objeto del usuario autenticado
- isAuthenticated: boolean
- login(email, password): Promise
- logout(): void

// product.store.ts
- products: array de productos
- fetchProducts(): Promise
- addProduct(product): Promise
- updateProduct(id, updates): Promise
- deleteProduct(id): Promise

// inventory.store.ts
- inventory: items de inventario
- fetchInventory(): Promise
- updateInventory(productId, quantity): Promise
```

### Services
Capa de comunicación con APIs:

```typescript
// api.ts - Cliente HTTP base con métodos:
- get<T>(endpoint, config?)
- post<T>(endpoint, body?, config?)
- put<T>(endpoint, body?, config?)
- delete<T>(endpoint, config?)

// auth.service.ts
- login(credentials)
- register(data)
- logout()
- verifyToken(token)

// product.service.ts
- getAll()
- getById(id)
- create(product)
- update(id, updates)
- delete(id)
- search(query)
```

## Flujo de Datos

```
Vista (Component)
    ↓
Composables (useAuth, useSnackbar, etc.)
    ↓
Stores (Pinia - auth.store, product.store, etc.)
    ↓
Services (auth.service, product.service, etc.)
    ↓
API (api.ts - ApiClient)
    ↓
Backend
```

## Implementación de APIs

**IMPORTANTE**: Los servicios están preparados con TODOs para consumir APIs reales.

### Paso 1: Configurar variable de entorno
```typescript
// En .env.local
VITE_API_URL=http://localhost:3000/api
```

### Paso 2: Actualizar servicios
```typescript
// En services/api.ts
const apiClient = new ApiClient(import.meta.env.VITE_API_URL)

// Descomentar las llamadas a fetch/axios
```

### Paso 3: Actualizar stores
```typescript
// En stores/product.store.ts
const response = await productService.getAll()
products.value = response.data
```

## Seguridad y Guards

El router implementa guards para:
- ✅ Redirigir usuarios no autenticados a login
- ✅ Redirigir usuarios autenticados lejos de login
- ✅ Validar permisos de ruta (meta.requiresAuth)

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth/login')
  } else if (to.path.startsWith('/auth') && isAuthenticated.value) {
    next('/')
  }
})
```

## Regresar a Modelos Anteriores

Si necesitas volver a los componentes anteriores:
1. La copia original de `DashboardLayout.vue` sigue en `src/components/layout/`
2. Todos los componentes de `src/components/` siguen siendo funcionales
3. Las views de antes (`Dashboard.vue`, `Login.vue`, `Products.vue`) aún existen

## Próximos Pasos

1. **Conectar APIs**
   - Actualizar `services/api.ts` con la URL del backend
   - Descomentarлlamadas en servicios
   - Validar respuestas

2. **Agregar más funcionalidades**
   - Crear nuevas rutas según necesidades
   - Agregar más stores si es necesario
   - Extender componentes según diseño

3. **Testing**
   - Tests unitarios para composables
   - Tests de integración para stores
   - Tests end-to-end para flujos

4. **Optimización**
   - Lazy loading de rutas
   - Code splitting de componentes
   - Caching de datos

## Dependencias Instaladas

```json
{
  "vue": "^3.5.28",
  "vue-router": "^4.x",
  "pinia": "^2.x",
  "tailwindcss": "^4.1.16",
  "aos": "^2.3.4",
  "@heroicons/vue": "^2.2.0"
}
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

---

**Última actualización**: 14 de Febrero, 2026
**Versión de arquitectura**: 2.0.0 (Con Routing y State Management)
