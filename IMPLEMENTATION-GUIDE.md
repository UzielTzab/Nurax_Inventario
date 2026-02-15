# Guía de Implementación - Nueva Arquitectura

## ✅ Cambios Realizados

La aplicación ha sido completamente reestructurada siguiendo una arquitectura moderna y escalable:

### 1. **Sistema de Enrutamiento (Vue Router)**
- ✅ Creado `router/index.ts` con todas las rutas configuradas
- ✅ Implementados guards de autenticación automáticos
- ✅ Rutas protegidas que requieren autenticación
- ✅ Redirecciones automáticas basadas en estado de autenticación

**Rutas disponibles:**
```
/auth/login              → Página de login (sin autenticación)
/                        → Dashboard (requiere autenticación)
/products               → Vista de productos
/inventory              → Vista de inventario
```

### 2. **Layouts Separados**
- ✅ `layouts/AuthLayout.vue` - Para páginas de autenticación
- ✅ `layouts/DashboardLayout.vue` - Para el dashboard con sidebar

### 3. **Estado Global (Pinia Stores)**
Se crearon 3 stores principales listos para consumir APIs:

```typescript
// stores/auth.store.ts
- Maneja usuario y estado de autenticación
- Métodos: login(), logout()

// stores/product.store.ts
- Maneja productos
- Métodos: fetchProducts(), addProduct(), updateProduct(), deleteProduct()

// stores/inventory.store.ts
- Maneja inventario
- Métodos: fetchInventory(), updateInventory(), getLowStockItems()
```

### 4. **Capa de Servicios**
Preparada la capa de comunicación con backend:

```typescript
// services/api.ts
- Cliente HTTP base (ApiClient)
- Métodos: get(), post(), put(), delete()

// services/auth.service.ts
- login(), register(), logout(), verifyToken()

// services/product.service.ts
- CRUD completo para productos
- Búsqueda y filtrado
```

### 5. **Nuevas Vistas**
- ✅ `ProductsView.vue` - Vista de productos (placeholder)
- ✅ `InventoryView.vue` - Vista de inventario (placeholder)

### 6. **Composables Actualizados**
- ✅ `useLoadingScreen.ts` - Maneja la pantalla de carga global

### 7. **Dependencias Instaladas**
```bash
✓ vue-router ^4.x
✓ pinia ^2.x
```

## 🔄 Flujo de Datos Actual

```
Component (ProductsView.vue)
    ↓ uses
Composable (useAuth, useSnackbar)
    ↓ updates/reads from
Store (productStore, authStore)
    ↓ calls
Service (productService.getAll())
    ↓ makes HTTP request via
ApiClient (api.ts)
    ↓
Backend API (cuando esté lista)
```

## 📋 Próximos Pasos para Integración de API

### Paso 1: Configurar Variables de Entorno

Crear `.env.local` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
# o la URL de tu servidor backend
```

### Paso 2: Actualizar el Cliente API

En `src/services/api.ts`, descomentar y actualizar:
```typescript
// Cambiar de:
const apiClient = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:3000/api')

// A usar fetch o axios (requiere instalación)
```

### Paso 3: Descomentar Llamadas en Servicios

**En `auth.service.ts`:**
```typescript
async login(credentials: LoginData) {
  // Descomentar:
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  // Comentar:
  // return { success: true, data: {...} }
}
```

### Paso 4: Actualizar Stores

**En `stores/product.store.ts`:**
```typescript
const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Descomentar:
    const response = await productService.getAll()
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false
  }
}
```

### Paso 5: Usar Stores en Componentes

**Ejemplo en ProductsView.vue:**
```typescript
<script setup lang="ts">
import { useProductStore } from '@/stores/product.store'
import { onMounted } from 'vue'

const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<template>
  <div v-if="productStore.isLoading">Cargando...</div>
  <div v-else>
    <div v-for="product in productStore.products" :key="product.id">
      {{ product.name }}
    </div>
  </div>
</template>
```

## 🧪 Testear la Arquitectura Sin Backend

La aplicación está configurada para funcionar sin backend (retorna datos mock):

```bash
npm run dev
```

1. Abre `http://localhost:5173`
2. Intenta hacer login (cualquier credencial funciona)
3. Se mostrará la pantalla de carga
4. Se redirigirá al dashboard

## 📁 Estructura Verificada

```
src/
├── router/index.ts                          ✓
├── layouts/
│   ├── AuthLayout.vue                       ✓
│   └── DashboardLayout.vue                  ✓
├── views/
│   ├── Login.vue                            ✓ (existente)
│   ├── Dashboard.vue                        ✓ (existente)
│   ├── ProductsView.vue                     ✓ (nueva)
│   └── InventoryView.vue                    ✓ (nueva)
├── stores/
│   ├── auth.store.ts                        ✓
│   ├── product.store.ts                     ✓
│   └── inventory.store.ts                   ✓
├── services/
│   ├── api.ts                               ✓
│   ├── auth.service.ts                      ✓
│   └── product.service.ts                   ✓
├── composables/
│   ├── useAuth.ts                           ✓ (existente)
│   ├── useSnackbar.ts                       ✓ (existente)
│   └── useLoadingScreen.ts                  ✓ (nueva)
└── components/                              ✓ (todos existentes)
```

## 🛠️ Importes Actualizados

Todos los imports nuevos usan el alias `@/`:
```typescript
// ✓ Correcto
import { useAuth } from '@/composables/useAuth'
import { useProductStore } from '@/stores/product.store'
import TopBar from '@/components/layout/TopBar.vue'

// ✗ Evitar
import { useAuth } from '../composables/useAuth'
import { useProductStore } from '../stores/product.store'
```

## ✨ Compilación

La aplicación compila sin errores:
```bash
npm run build
# ✓ 89 modules transformed
# ✓ built in 7.01s
```

## 📝 Notas Importantes

1. **Parámetros no utilizados están prefijados con `_`**
   - Esto indica que son placeholders para cuando se implemente API real
   - Ejemplo: `_productId`, `_query`, `_password`

2. **TODOs en el código**
   - Buscar por "TODO" para encontrar puntos de integración de API

3. **Importes comentados**
   - Algunos imports de `apiClient` están comentados
   - Se descomenta cuando se implemente la API real

4. **Datos Mock**
   - Los servicios retornan datos mock
   - Descomentar las llamadas cuando backend esté listo

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview del build
npm run preview
```

---

**Status**: ✅ Arquitectura completa y lista para usar
**Última actualización**: 14 de Febrero, 2026
**TypeScript**: Sin errores
**Build**: Exitoso (151.97 kB JS gzipped)
