# 🚀 PLAN DE MEJORAS - Inventario & Layout Global

**Fecha de creación**: Abril 8, 2026  
**Objetivo**: Enriquecer la interfaz de Inventario y optimizar el Layout Global con nuevas funcionalidades y mejora UX  
**Prioridad**: Alta (Impacta directamente la experiencia del usuario)

---

## 📋 ÍNDICE

1. [Actualización de Tarjetas KPI](#1-actualización-de-tarjetas-kpi)
2. [Enriquecimiento de la Tabla de Productos](#2-enriquecimiento-de-la-tabla-de-productos)
3. [Innovaciones UX en Botones](#3-innovaciones-ux-para-los-botones)
4. [Ajuste Rápido de Stock (Inline Edit)](#4-ajuste-rápido-de-stock-inline-edit)
5. [Optimización del Layout Global](#5-optimización-del-layout-global-sidebar--topbar)
6. [Control de Acceso por Rol (RBAC)](#6-control-de-acceso-por-rol-rbac)

---

## 1. Actualización de Tarjetas KPI

### 📊 Estado Actual
Las tarjetas KPI (cuadros superiores) están bien diseñadas, pero ahora tienen respaldo real en la BD.

### 1.1 Tarjeta: "Valor del Inventario" (Propietarios/Gerentes)

**Qué mostrar:**
- Sumatoria de: `PRODUCTO.costo_base × PRODUCTO.stock_actual`
- **NO** usar `precio_venta` (ese es margen bruto)
- Usar `costo_base` (lo que costó al dueño adquirirlo)

**Lógica:**
```typescript
// En stores/product.store.ts
const inventoryValue = computed(() => {
  return productStore.products.reduce((total, product) => {
    return total + (product.costo_base * product.stock_actual);
  }, 0);
});
```

**Visibilidad (RBAC):**
- ✅ Visible si: `user.role === 'propietario'` o `user.role === 'gerente'`
- ✅ Si es `cajero`: Ocultar esta tarjeta O mostrar "Turno Actual" en su lugar
- Código: 
```typescript
const showInventoryValue = computed(() => {
  return ['propietario', 'gerente'].includes(currentUser.value?.role);
});
```

**Ejemplo Visual:**
```
┌─────────────────────────────────┐
│ VALOR DEL INVENTARIO            │
│ $4,250.00                       │
│ (Calculado en tiempo real)      │
└─────────────────────────────────┘
```

---

### 1.2 Tarjeta: "Alertas de Stock" (Reemplaza "Productos sin stock")

**Cambio:** `Productos sin stock` → `Alertas de Stock`

**Qué mostrar:**
- Cantidad de productos donde: `stock_actual < 5`
- Estos son los que necesitan reorden pronto
- Es más útil que saber cuáles están completamente agotados

**Lógica:**
```typescript
const lowStockProductsCount = computed(() => {
  return productStore.products.filter(p => p.stock_actual < 5).length;
});
```

**Ejemplo Visual:**
```
┌─────────────────────────────────┐
│ ALERTAS DE STOCK                │
│ 3 productos                     │
│ (Menos de 5 unidades)           │
└─────────────────────────────────┘
```

**Interacción:**
- Al hacer clic, debe filtrar automáticamente la tabla para mostrar solo estos productos
- Mostrar un badge rojo si el número > 0

---

### 1.3 Tarjeta: "Productos Activos" (Keep as is)

```
┌─────────────────────────────────┐
│ PRODUCTOS ACTIVOS               │
│ 47                              │
│ (Product.activo === true)       │
└─────────────────────────────────┘
```

---

## 2. Enriquecimiento de la Tabla de Productos

### 📋 Objetivo
La tabla actual es muy plana. Vamos a inyectarle la estructura relacional para que sea súper útil.

### 2.1 Estructura General

| Actual | Nueva | Fuente de Datos |
|--------|-------|-----------------|
| PRODUCTO | Nombre + Categoría + Proveedor | `PRODUCTO.nombre`, `CATEGORIA`, `PROVEEDOR` |
| SKU | CÓDIGO + Ícono QR | `CODIGO_PRODUCTO.codigo` (principal) |
| PRECIO | precio_venta + costo_base* | `PRODUCTO.precio_venta`, `PRODUCTO.costo_base` |
| STOCK | stock_actual + Botones [-]/[+] | `PRODUCTO.stock_actual` + Ajuste Rápido |
| STATUS | EMPAQUE | `EMPAQUE_PRODUCTO.tipo` (Ej: "Unidad", "Caja") |

*Solo visible si `user.role` es Propietario/Gerente

---

### 2.2 Columna: PRODUCTO (Enriquecida)

**Antes:**
```
Micrófono USB Condenser
```

**Después:**
```
Micrófono USB Condenser        ← Nombre en negrita
Audio | Sony Electronics       ← Badge: Categoría | Proveedor
```

**HTML/Vue:**
```vue
<td class="product-cell">
  <div class="product-name">{{ product.nombre }}</div>
  <div class="product-badges">
    <span class="badge badge-category">{{ product.categoria.nombre }}</span>
    <span class="badge badge-supplier">{{ product.proveedor.nombre }}</span>
  </div>
</td>
```

**CSS:**
```css
.product-cell {
  padding: 12px 16px;
}

.product-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.product-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f0fdf4;
  color: #065f46;
}

.badge-supplier {
  background: #f0f9ff;
  color: #0369a1;
}
```

---

### 2.3 Columna: CÓDIGO (Reemplaza SKU)

**Cambio:**
- Título: `SKU` → `CÓDIGO`
- Contenido: Buscar en tabla `CODIGO_PRODUCTO` el código principal
- Añadir: Ícono pequeño de código de barras (QR/Barcode)

**Consulta a Backend:**
El frontend debe pedir a la API:
```
GET /api/v1/products/codigos-producto/?producto_id={id}
```

**Lógica:**
```typescript
const primaryCode = computed(() => {
  return product.codigos?.find(c => c.es_principal)?.codigo || 'N/A';
});
```

**Visual:**
```
📊 CÓDIGO
━━━━━━━━━━━━━━━
SKU-001234
```

---

### 2.4 Columna: PRECIO (Con Costo Base)

**Antes:**
```
$45.99
```

**Después (Para Todos):**
```
$45.99                    ← Precio de Venta (Grande)
```

**Después (Si user.role ∈ ['propietario', 'gerente']):**
```
$45.99                    ← Precio de Venta (Grande)
Costo: $25.00             ← Costo Base (Pequeño, gris)
```

**Vue:**
```vue
<td class="price-cell">
  <div class="sale-price">${{ product.precio_venta.toFixed(2) }}</div>
  <div v-if="showCostBasePrice" class="cost-price">
    Costo: ${{ product.costo_base.toFixed(2) }}
  </div>
</td>
```

**CSS:**
```css
.price-cell {
  text-align: right;
  padding: 12px 16px;
}

.sale-price {
  font-size: 1.0rem;
  font-weight: 700;
  color: #111827;
}

.cost-price {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}
```

---

### 2.5 Columna: STOCK (Con Ajuste Rápido)

**Antes:**
```
47 unidades
```

**Después:**
```
[ - ]  47  [ + ]
```

Los botones `[ - ]` y `[ + ]` son botones fantasma (ghost) que disparan ajustes rápidos.

**Interacción:**
- Ver sección [4. Ajuste Rápido](#4-ajuste-rápido-de-stock-inline-edit)

**Vue:**
```vue
<td class="stock-cell">
  <div class="stock-controls">
    <button class="btn-ghost btn-sm" @click="decreaseStock(product)">−</button>
    <span class="stock-value">{{ product.stock_actual }}</span>
    <button class="btn-ghost btn-sm" @click="increaseStock(product)">+</button>
  </div>
</td>
```

---

### 2.6 Columna: EMPAQUE (Reemplaza STATUS)

**Cambio:**
- Eliminar columna STATUS (agotado/disponible)
- Agregar columna EMPAQUE
- El status ya se entiende viendo el stock

**Qué mostrar:**
Leer de `EMPAQUE_PRODUCTO.tipo` (ej: "Unidad", "Caja de 50", "Paquete")

**Backend esperado:**
```python
GET /api/v1/products/empaques/?producto_id={id}
```

**Visual:**
```
EMPAQUE
━━━━━━━━━
Unidad

Caja de 50

Paquete x 10
```

---

## 3. Innovaciones UX para los Botones

### 🔘 3.1 Botón "+ Nuevo Producto" (Mejorado)

**Ubicación:** Header de la tabla de Inventario

**Cambio:**
Agregar un botón secundario al lado para **"Importar Excel/CSV"**

**Visual:**
```
┌──────────────────┐  ┌──────────────────┐
│ + Nuevo Producto │  │ ⬆️  Importar Excel│
└──────────────────┘  └──────────────────┘
```

**Funcionalidad del Botón Importar:**
- Al hacer clic, abre un Modal con drag-and-drop para archivos `.xlsx`, `.csv`
- El frontend debe validar que el Excel tenga las columnas esperadas:
  - `Nombre`, `SKU`, `Categoría`, `Precio`, `Stock`, `Imagen URL`
- Preview de los primeros 5 productos antes de confirmar
- Un solo clic de "Importar" y se envía el batch a:
  ```
  POST /api/v1/products/batch-import/
  ```

**Lógica Modal:**
```typescript
// Pasos:
1. Usuario hace clic en "Importar Excel"
2. Se abre Modal con zona de drag-drop
3. Usuario arrastra o selecciona archivo
4. Frontend parse Excel con XLSX library
5. Mostrar preview de primeros 5 rows
6. Usuario confirma
7. POST /api/v1/products/batch-import/ con array de productos
8. Toast de éxito o error
9. Refetch products
```

---

### 🔘 3.2 Botón "Vender" (Verde oscuro - Topbar)

**Ubicación:** Header global (Topbar - derecha)

**Estado Actual:**
- Abre el módulo de Punto de Venta (POS)
- ✅ Correcto, **KEEP AS IS**

**Innovación Móvil:**
Agregar un botón con ícono de **celular/QR** al lado de "Vender" que diga **"Vincular Escáner"**

**Visual:**
```
┌──────────────┐  ┌──────────────────────┐
│ 🛒 Vender   │  │ 📱 Vincular Escáner │
└──────────────┘  └──────────────────────┘
```

**Funcionalidad:**
- Al hacer clic, abre un Modal mostrando un **Código QR grande**
- El QR debe contener: `id_sesion` de Pusher del navegador (session ID)
- Un celular (con app móvil) puede escanear ese QR y conectarse a ese navegador
- El título del modal: "Vincular Escáner Móvil"
- Debajo del QR: "Por favor, escanea este código con tu app móvil"

**Backend esperado:**
```python
GET /api/v1/sessions/create/  # Retorna un id_sesion único
```

---

### 🔘 3.3 Sectores de Filtros (Mejorados)

**Ubicación:** Header de tabla, botón "Ver filtros"

**Cambio:**
Agregar selectores para las nuevas tablas relacionales:

**Opciones nuevas:**
1. **Filtrar por CATEGORÍA**
   - Dropdown con lista de todas las categorías
   - Ej: "Audio", "Video", "Cables", "Accesorios"
2. **Filtrar por PROVEEDOR**
   - Dropdown con lista de todos los proveedores
   - Ej: "Sony Electronics", "AmazonBasics", etc.

**Comportamiento:**
- Los filtros son acumulativos (AND logic)
- Cambiar filtro debe actualizar tabla en tiempo real
- Button "Limpiar Filtros" para resetear

**Vue:**
```typescript
const filters = reactive({
  search: '',
  categoria_id: null,
  proveedor_id: null,
  lowStock: false, // "Alertas de Stock"
});

const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    if (filters.search && !p.nombre.toLowerCase().includes(filters.search)) return false;
    if (filters.categoria_id && p.categoria.id !== filters.categoria_id) return false;
    if (filters.proveedor_id && p.proveedor.id !== filters.proveedor_id) return false;
    if (filters.lowStock && p.stock_actual >= 5) return false;
    return true;
  });
});
```

---

## 4. Ajuste Rápido de Stock (Inline Edit)

### ⚡ 4.1 El Problema

En la mayoría de POS, para corregir un stock equivocado (ej: tabla dice 10, pero hay 9 físicamente):
1. Entra en el módulo de inventario
2. Busca el producto
3. Abre el formulario de edición
4. Cambia el stock
5. Guarda
6. **5 clicks + cambio de pantalla**

### ⚡ 4.2 La Solución: Edición Inline

**Experiencia del usuario:**
1. El campo **STOCK** en la tabla es editable
2. Usuario hace clic en "47"
3. Aparece un input que dice "47"
4. Usuario borra y escribe "46"
5. Usuario presiona **ENTER**
6. Frontend calcula automáticamente: `46 - 47 = -1`
7. Frontend dispara silenciosamente: `POST /api/v1/inventory/ajuste-stock/`
   ```json
   {
     "producto_id": 123,
     "cantidad": -1,
     "tipo_ajuste": "AJUSTE",
     "motivo": "Corrección de inventario",
     "usuario_id": current_user.id
   }
   ```
8. Toast de confirmación: "✓ Stock ajustado a 46"
9. Tabla se actualiza en vivo

### ⚡ 4.3 Implementación

**Vue Template:**
```vue
<td class="stock-cell">
  <div v-if="!editingProductId.includes(product.id)" class="stock-display">
    <span @dblclick="startEditingStock(product.id)">{{ product.stock_actual }}</span>
    <span class="edit-hint">(doble-clic para editar)</span>
  </div>
  
  <input
    v-else
    v-model.number="tempStockValue"
    type="number"
    class="stock-input"
    @keyup.enter="saveStockAdjustment(product)"
    @keyup.esc="cancelEditingStock()"
    @blur="saveStockAdjustment(product)"
    autofocus
  />
</td>
```

**Script:**
```typescript
const editingProductId = ref<number[]>([]);
const tempStockValue = ref<number>(0);

const startEditingStock = (productId: number) => {
  const product = productStore.products.find(p => p.id === productId);
  if (product) {
    tempStockValue.value = product.stock_actual;
    editingProductId.value.push(productId);
  }
};

const saveStockAdjustment = async (product: Product) => {
  const oldStock = product.stock_actual;
  const newStock = tempStockValue.value;
  const ajuste = newStock - oldStock; // Ej: 46 - 47 = -1

  if (ajuste === 0) {
    cancelEditingStock();
    return;
  }

  try {
    // POST al backend
    await apiClient.post('/api/v1/inventory/ajuste-stock/', {
      producto_id: product.id,
      cantidad: ajuste,
      tipo_ajuste: 'AJUSTE',
      motivo: 'Corrección de inventario',
    });

    // Actualizar store localmente
    product.stock_actual = newStock;

    // Toast
    enqueueSnackbar({
      type: 'success',
      message: `✓ Stock ajustado a ${newStock}`,
      duration: 2000,
    });

    editingProductId.value = editingProductId.value.filter(id => id !== product.id);
  } catch (err) {
    enqueueSnackbar({
      type: 'error',
      message: 'Error al ajustar stock',
    });
    tempStockValue.value = oldStock;
  }
};

const cancelEditingStock = () => {
  editingProductId.value = [];
  tempStockValue.value = 0;
};
```

**CSS:**
```css
.stock-display {
  cursor: text;
  position: relative;
}

.edit-hint {
  font-size: 0.7rem;
  color: #d1d5db;
  margin-left: 4px;
}

.stock-display:hover .edit-hint {
  color: #a3a6b4;
}

.stock-input {
  width: 60px;
  padding: 6px 8px;
  border: 2px solid #06402b;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  color: #111827;
}

.stock-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(6, 64, 43, 0.1);
}
```

---

## 5. Optimización del Layout Global (Sidebar + Topbar)

### 🎯 5.1 El Problema: "Doble Botón de Vender"

**Situación actual:**
- Botón "Vender" en Topbar (arriba a la derecha)
- Botón "Vender" otra vez en el Sidebar o en la vista de Inventario
- Confunde al usuario: ¿Cuál presiono?

### 🎯 5.2 La Solución

#### **Topbar (Head global):**
- **Botón "Vender"** (Verde oscuro) → **Universal**
  - No importa dónde esté el usuario (Gastos, Proveedores, Configuración)
  - Presiona el botón, se abre el POS
  - Esto debería ser un acceso global

- **Botón "Vincular Escáner"** (Celular/QR)
  - Abre Modal con QR para emparejar celular
  - Ver sección [3.2](#32-botón-vender-verde-oscuro---topbar)

#### **Sidebar/Inventario:**
- **Eliminar** el botón "Vender" duplicado
- **Mantener**: Botón "+ Nuevo Producto" + Botón "⬆️ Importar Excel"
- Esto hace que la vista sea clara: es para **gestionar inventario**, no para vender

---

### 🎯 5.3 Topbar - Estructura Ideal

```
[☰ Menu] [🔍 Search] ... [🛒 Vender] [📱 Vincular Escáner] [🔔] [👤 Perfil]
```

**Responsabilidades:**
- **Vender**: Abre POS (global, siempre disponible)
- **Vincular Escáner**: Abre Modal con QR (nuevaGlobal)
- **Notificaciones**: Alertas de stock, etc.
- **Perfil**: Editar datos, cerrar sesión

---

## 6. Control de Acceso por Rol (RBAC)

### 👥 6.1 Configuración de Roles

El frontend debe leer el rol del usuario desde el JWT/API (`currentUser.role`) y mostrar/ocultar opciones.

### 👥 6.2 Visibilidad del Sidebar por Rol

#### **PROPIETARIO** (Acceso total)
```
Visibles:
✅ Dashboard
✅ Inventario
✅ Ventas
✅ Proveedores
✅ Gastos
✅ Corte de Caja
✅ Cuentas por Cobrar
✅ Configuración
✅ Admin - Clientes (si está disponible)
```

#### **GERENTE** (Control casi total)
```
Visibles:
✅ Dashboard
✅ Inventario (CRUD completo)
✅ Ventas (Lectura + Reportes)
✅ Proveedores (CRUD)
✅ Gastos (Lectura)
✅ Corte de Caja
✅ Cuentas por Cobrar
❌ Configuración (OCULTO)
❌ Admin - Clientes (OCULTO)

Nota: Pueden ver costo_base, margen, pero no configurar tienda ni crear usuarios.
```

#### **CAJERO** (Operacional básico)
```
Visibles:
✅ Punto de Venta (Vender)
✅ Corte de Caja (Solo el suyo)
✅ Inventario (Lectura, sin editar stock) O (Editar solo via Ajuste Rápido)

Ocultos:
❌ Dashboard (Datos agregados)
❌ Proveedores
❌ Gastos
❌ Cuentas por Cobrar
❌ Configuración
❌ Admin - Clientes

BotonesToparTop:
- ✅ "Vender" (siempre)
- ✅ "Vincular Escáner" (siempre)
- ✅ Notificaciones (si tiene tienda abierta)
```

### 👥 6.3 Implementación

**En `Sidebar.vue`:**
```typescript
const visibleMenuItems = computed(() => {
  const role = currentUser.value?.role;
  const baseMenu = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Inventario', icon: 'box', path: '/dashboard/inventory' },
  ];

  // Vendedor/Cajero: Solo POS
  if (role === 'cajero') {
    return [
      { label: 'Punto de Venta', icon: 'shopping-cart', path: '/dashboard/pos' },
      { label: 'Corte de Caja', icon: 'calculator', path: '/dashboard/shifts' },
    ];
  }

  // Propietario y Gerente: Todo
  const allMenu = [
    ...baseMenu,
    { label: 'Ventas', icon: 'chart', path: '/dashboard/sales' },
    { label: 'Proveedores', icon: 'truck', path: '/dashboard/suppliers' },
    { label: 'Gastos', icon: 'money', path: '/dashboard/expenses' },
    { label: 'Corte de Caja', icon: 'calculator', path: '/dashboard/shifts' },
    { label: 'Cuentas por Cobrar', icon: 'document', path: '/dashboard/receivables' },
  ];

  if (role === 'propietario') {
    allMenu.push(
      { label: 'Configuración', icon: 'settings', path: '/dashboard/settings' },
      { label: 'Clientes', icon: 'users', path: '/dashboard/clients' }
    );
  }

  return allMenu;
});
```

**En `DashboardLayout.vue` (Topbar):**
```vue
<!-- Botón Vender: TODOS LOS ROLES -->
<AppButton 
  v-if="currentUser?.role !== undefined"
  variant="fill" 
  icon="shopping-cart"
  @click="salesStore.openModal()"
>
  Vender
</AppButton>

<!-- Botón Vincular Escáner: TODOS LOS ROLES -->
<button 
  v-if="currentUser?.role !== undefined"
  class="icon-btn"
  @click="openScannerPairingModal()"
  title="Vincular Escáner Móvil"
>
  <QrCodeIcon class="w-5 h-5" />
</button>

<!-- Botón Importar: SOLO PROPIETARIO/GERENTE EN INVENTARIO -->
<AppButton
  v-if="isInventoryPage && ['propietario', 'gerente'].includes(currentUser?.role)"
  variant="outline"
  icon="arrow-down-tray"
  @click="openExcelImportModal()"
>
  ⬆️ Importar Excel
</AppButton>
```

---

## 📝 Resumen de Cambios

| Componente | Cambio | Impacto |
|-----------|--------|--------|
| **KPI Cards** | Agregar "Valor de Inventario" + cambiar "Sin Stock" → "Alertas" | Medium (Visual) |
| **Tabla Productos** | Enriquecer con Categoría, Proveedor, Costo Base, Empaque | High (Data) |
| **Botones** | Importar Excel + Vincular Escáner | High (UX) |
| **Stock** | Editable inline con ajuste automático | High (UX) |
| **Sidebar** | RBAC: Ocultar opciones por rol | High (Security) |
| **Topbar** | Centralizar acciones globales (Vender, Escáner) | Medium (UX) |

---

## 🎯 Prioridad de Implementación

1. **FASE 1 (Crítica):** KPI actualizado + RBAC en Sidebar (Seguridad)
2. **FASE 2 (Alta):** Enriquecimiento tabla + Ajuste Rápido (Core Feature)
3. **FASE 3 (Media):** Botones mejorados (Importar Excel, Escáner)
4. **FASE 4 (Mejora):** Filtros avanzados + Detalles visuales

---

## ✅ Checklist para Implementación

- [ ] KPI "Valor Inventario" calculado y visible (Propietarios/Gerentes)
- [ ] KPI "Alertas Stock" reemplazado (productos con < 5 unidades)
- [ ] Tabla enriquecida con Categoría + Proveedor + Costo Base
- [ ] Columna CÓDIGO reemplaza SKU con ícono QR
- [ ] Columna EMPAQUE muestra tipo de empaque
- [ ] Stock es editable inline con ajuste automático
- [ ] Botón "Importar Excel" funcional con preview
- [ ] Botón "Vincular Escáner" abre Modal con QR
- [ ] Filtros por Categoría y Proveedor en tabla
- [ ] Sidebar oculta opciones según rol (RBAC)
- [ ] Topbar centraliza acciones globales (Vender + Escáner)
- [ ] Toasts de éxito/error funcionales
- [ ] Mobile responsive en todas las nuevas características

---

## 📞 Notas Importantes

- **Backend esperado**: Algunos endpoints pueden no existir. El equipo backend debe crear:
  - `POST /api/v1/products/batch-import/`
  - `POST /api/v1/inventory/ajuste-stock/`
  - `GET /api/v1/sessions/create/` (para QR)
  
- **Seguridad**: Validar en frontend Y backend que el usuario tenga permisos (RBAC)
- **Real-time**: Si hay múltiples usuarios, considerar Pusher para actualizaciones en vivo
- **Testing**: Probar con diferentes roles (Propietario, Gerente, Cajero)

---

**Documento creado**: Abril 8, 2026  
**Versión**: 1.0  
**Status**: 📋 Listo para implementación
