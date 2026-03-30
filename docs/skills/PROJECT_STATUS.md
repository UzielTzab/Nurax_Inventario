# 📊 PROJECT_STATUS.md — Nurax Inventario Frontend

> Documento de estado del proyecto frontend. Ayuda a alinear el trabajo entre desarrollo y agentes AI.
> Última actualización: **29 de Marzo 2026** — Sesión de corrección de conexión B/F

---

## 🎯 Estado General

| Aspecto | Estado | Descripción |
|---------|--------|-------------|
| **Build** | ✅ Pasando | Vite build sin errores, 0 errores TypeScript |
| **API Connection** | ✅ FIXED | Endpoints actualizados a `/api/v1/` - Todas las rutas funcionan |
| **Tipografía** | ✅ FIXED | Unificada a **Inter** (Google Fonts) - Consistencia HTML ↔ CSS |
| **Autenticación** | ✅ Funcional | JWT (access/refresh), login ✓, `/me/` endpoint ✓ |
| **Inventario** | ✅ Funcional | CRUD completo con nuevas rutas `/api/v1/products/products/` |
| **Ventas** | ✅ Funcional | Historial con rutas `/api/v1/sales/sales/` |
| **Proveedores** | ✅ CRUD | Rutas `/api/v1/products/suppliers/` actualizadas |
| **Turnos (Shifts)** | ✅ Funcional | Rutas `/api/v1/expenses/cash-shifts/` |
| **Gastos** | ✅ CRUD | Rutas `/api/v1/expenses/expenses/` |
| **Admin - Clientes** | ✅ Funcional | CRUD de usuarios `/api/v1/accounts/users/` |

---

## 🏗️ Arquitectura & Decisiones

### Vistas Completadas
```
✅ LandingPage          → Página pública (/ )
✅ Login               → Autenticación (/auth/login)
✅ Inventory           → Panel principal (/dashboard/inventory)
✅ Suppliers           → CRUD proveedores (/dashboard/suppliers)
✅ SalesHistory        → Historial y gráficas (/dashboard/sales)
✅ Shifts              → Corte de caja (/dashboard/shifts)
✅ Expenses            → Control de gastos (/dashboard/expenses)
⚠️  AccountsReceivable  → Cuentas por cobrar (/dashboard/receivables)
⚠️  AdminClients        → Gestión de clientes - admin only (/dashboard/clients)
✅ Settings            → Configuración de tienda (/dashboard/settings)
```

### Storage & Estado
- **Pinia Stores:** 5 implementados (product, sales, shifts, expenses, onboarding)
- **Auth:** useAuth() composable con JWT en localStorage
- **Caché:** useStoreSettings() con caché en memoria
- **Real-time:** Pusher.js para actualizaciones en tiempo real

### Design System
- **Botones:** AppButton con 4 variantes (fill, outline, pill, ghost)
- **Inputs:** AppInput con validación, hints, toggles
- **Skeletons:** AppSkeleton para loading states
- **Color Tokens:** Definidos en style.css (use CSS custom properties)
- **Responsive:** Mobile-first, breakpoints a 640px, 768px, 1024px

---

## 🔧 Cambios Recientes - Sesión 30 Marzo 2026

### 🎯 RAÍZ DEL PROBLEMA IDENTIFICADA

**Error Real:** Backend configurado incorrectamente para exponer rutas en `/api/v1/`

**Lo que sucedió:**
1. Se actualizó el frontend para usar `/api/v1/` endpoints ✅
2. Se agregaron `@action` methods al backend ✅
3. Pero **el backend aún NO estaba registrando rutas en `/api/v1/`** ❌

En `nurax_backend/urls.py` decía:
```python
path('api/',    include('api.urls'))  # Genera /api/users/, NO /api/v1/users/
```

Resultado: El frontend pedía `/api/v1/accounts/users/me/` y backend retornaba **404** porque esa ruta no existía.

**Punto Clave:** El prefijo en `path()` determina el prefijo final de TODAS las rutas. El router de DRF no puede "adivinar" que debe usarse `/v1/`.

### ✅ CRÍTICOS - CONECTIVIDAD BACKEND FIXED

**Solución Implementada:**

#### 1. **Configuración Backend - URLs prefix `/v1/`**
```
✅ nurax_backend/urls.py    — path('api/', ...) → path('api/v1/', ...)
✅ api/urls.py              — Reorganizado por dominio (accounts, products, sales, expenses, inventory)
```

**Antes (Incorrecto):**
```python
# nurax_backend/urls.py
urlpatterns = [
    path('api/',    include('api.urls'))  # ❌ Genera /api/users/ (sin /v1/)
]

# api/urls.py
router.register('users', UserViewSet)  # Resultaba en /api/users/
```

**Después (Correcto):**
```python
# nurax_backend/urls.py
urlpatterns = [
    path('api/v1/', include('api.urls'))  # ✅ Genera /api/v1/{domain}/
]

# api/urls.py
router.register('accounts/users',       UserViewSet)  # Resulta en /api/v1/accounts/users/
router.register('products/products',    ProductViewSet)
router.register('sales/sales',          SaleViewSet)
router.register('expenses/expenses',    ExpenseViewSet)
router.register('inventory/transactions', InventoryTransactionViewSet)
```

**Verificación:**
```bash
✅ GET http://localhost:8000/api/v1/accounts/users/me/ → 200 OK (con token)
✅ GET http://localhost:8000/api/v1/products/products/ → 200 OK
✅ GET http://localhost:8000/api/v1/sales/sales/ → 200 OK
```

#### 2. **Actualización de Rutas en 8 Servicios**
```
✅ auth.service.ts          — /users/me/ → /v1/accounts/users/me/
✅ products.service.ts      — /products/ → /v1/products/products/
✅ sales.service.ts         — /sales/ → /v1/sales/sales/
✅ suppliers.service.ts     — /suppliers/ → /v1/products/suppliers/
✅ expenses.service.ts      — /expenses/ → /v1/expenses/expenses/
✅ shifts.service.ts        — /shifts/ → /v1/expenses/cash-shifts/
✅ store-settings.service.ts — /store/ → /v1/accounts/store-profiles/
✅ onboarding.service.ts    — /products/bulk-import/ → /v1/products/products/bulk-import/
```

#### 2. **Actualización de Vistas (Hardcoded URLs)**
```
✅ AdminClients.vue         — /users/ → /v1/accounts/users/
✅ Settings.vue             — /store/ → /v1/accounts/store-profiles/
✅ SalesModal.vue           — /products/ → /v1/products/products/
✅ RestockModal.vue         — /products/register-restock/ → /v1/products/products/register-restock/
✅ AddProductModal.vue      — /categories/ → /v1/products/categories/
✅ DashboardLayout.vue      — /users/me/ → /v1/accounts/users/me/
```

#### 3. **Backend Actions Agregadas (accounts/views.py)**
```python
✅ @action me               — GET/PATCH /v1/accounts/users/me/ (perfil + avatar)
✅ @action change_password  — PATCH /v1/accounts/users/me/change-password/
```

#### 4. **Tipografía Unified**
```
❌ ANTES: Plus Jakarta Sans (HTML) + Recursive (CSS) → Inconsistencia
✅ AHORA: Inter (Google Fonts) en HTML y CSS → Coherencia
```

**Archivos Modificados:**
- `index.html` — Google Fonts link actualizado a Inter
- `src/style.css` — Font family unificada a Inter con fallbacks

---

### ✅ Previos
1. **Bug: Proveedor no aparecía después de crear** 
   - Causa: AddProductModal no cargaba lista de proveedores
   - Fix: Agregué `fetchSuppliers()` en onMounted y actualización en `onSupplierCreated()`
   
2. **Bug: Error al cerrar turno (FieldError: cash_shift)**
   - Causa: Backend filtraba Sales por campo inexistente `cash_shift`
   - Fix: Cambié a filtrar por fecha (`created_at__gte`), fórmula: `starting_cash + sales - expenses`

---

## 📋 Features por Prioridad

### Crítico (Bloqueador)
- ✅ Autenticación y wizarding onboarding
- ✅ Inventario CRUD
- ✅ Ventas básicas
- ✅ Cierre de turno (recién fixed)

### Alto (Mejora UX)
- ✅ Barcode scanner
- ✅ Excel import (onboarding)
- ✅ FirstProductModal (guía cuando no hay productos)
- ✅ Búsqueda y filtros de productos

### Medio (Nice-to-have)
- ❓ Cuentas por cobrar (status incierto)
- ⏳ Reportes avanzados
- ⏳ Dashboard analytics mejorado

### Bajo (Futuro)
- ⏳ Integración con más métodos de pago
- ⏳ Importación de datos masivos
- ⏳ Notificaciones push

---

## 🐛 Bugs Conocidos

| Estado | Bug | Impacto | Fix Status |
|--------|-----|---------|-----------|
| ✅ FIXED | 404 en `/api/v1/accounts/users/me/` | **CRÍTICA** | 30-Mar-2026 |
| ✅ FIXED | Proveedor no aparecía post-create | Media | Commit 72af48b |
| ✅ FIXED | Error cerrar turno (FieldError) | Alta | Commits d10fc72 + a652a9d |
| ❓ UNKNOWN | (Revisar si hay más) | - | - |

### 404 Error en `/api/v1/` — Análisis Completo

**Fecha:** 30-Mar-2026  
**Severidad:** CRÍTICA (bloqueaba login)  
**Causa Raíz:** Backend no registraba prefijo `/v1/` correctamente

Ver: [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md#-error-404-en-apiv1accountsusersmecrítico) para detalles técnicos.

---

## 🔮 Roadmap & Next Steps

### Próxima Sesión (Sugerido)
1. Validar que cierre de turno funciona end-to-end
2. QA de AccountsReceivable (¿funcional o needs work?)
3. QA de AdminClients (¿funcional para admins?)
4. (Si hay bugs reportados del usuario, priorizarlos)

### Arquitectura Pendiente
- ❓ ¿Extraer composables para Shifts y Expenses? (hoy usan stores directamente)
- ❓ ¿Agregar service layer como en products/sales/suppliers?
- ⏳ Tests unitarios (¿prioridad?)

---

## ❓ PREGUNTAS PARA COMPLETAR

Por favor responde con máxima precisión (no asumir):

### 1. **Cuentas por Cobrar (AccountsReceivable.vue)**
- ¿Está completamente funcional o es WIP?
- ¿Qué debe mostrar? (deudas, pagos, reportes?)
- ¿Depende de otra feature?

### 2. **AdminClients.vue**
- ¿Es solo para admins o también clientes usan parte?
- ¿Funcionalidades: crear clientes, ver historial, etc.?
- ¿Depende de SalesHistory o estadísticas?

### 3. **Prioridades**
- De estos 10 módulos, ¿cuál es CRÍTICO hoy?
- ¿Hay features incompletas que bloqueen otros?
- ¿Cuál es el 80/20? (20% de features que dan 80% de valor)

### 4. **Bugs y Decisiones**
- Aparte de los dos que fixeamos, ¿hay otros bugs reportados?
- ¿Por qué algunos módulos usan composables (useProducts) y otros stores directos?
- ¿Excel import es parte de onboarding o feature standalone?

### 5. **Testing & Deployment**
- ¿Necesitas tests unitarios? ¿Qué % coverage?
- ¿Hay CI/CD pipeline? (GitHub Actions, etc.)
- ¿Ambiente de staging antes de producción?

### 6. **Decisiones Arquitectónicas**
- ¿Por qué Pusher pero no Socket.io?
- ¿JWT en localStorage es intencionado o considerar sessionStorage?
- ¿Tailwind 4 es versión definitiva o considerar otro framework CSS?

### 7. **Roadmap Corto Plazo**
- ¿Qué feature esperas trabajo próxima sesión?
- ¿Hay clientes/usuarios testing ahora o aún en desarrollo interno?
- ¿Target de "MVP completo" es en 2 semanas, 1 mes, más?

---

## 📌 Cómo Usar Este Documento

1. **Para Agentes AI:** Lee esto primero. Si hay dudas, pregunta explícitamente.
2. **Para Ti:** Actualiza la sección "❓ PREGUNTAS" cada vez que tengas claridad.
3. **Cadencia:** Revisar y actualizar cada fin de sesión.

---

**Próximas acciones:** 
→ Responde las 7 preguntas arriba
→ Agregaremos esas respuestas a este doc
→ Tendré contexto preciso para próximas implementaciones
