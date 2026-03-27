# 📊 PROJECT_STATUS.md — Nurax Inventario Frontend

> Documento de estado del proyecto frontend. Ayuda a alinear el trabajo entre desarrollo y agentes AI.
> Última actualización: 23 de Marzo 2026

---

## 🎯 Estado General

| Aspecto | Estado | Descripción |
|---------|--------|-------------|
| **Build** | ✅ Pasando | 907 módulos, 0 errores TypeScript |
| **Onboarding** | ✅ Completo | 3 pasos funcionales, wizard con sidebar |
| **Autenticación** | ✅ Completo | JWT (access/refresh), guards en router |
| **Inventario** | ✅ Funcional | CRUD completo, FirstProductModal, búsqueda/filtros |
| **Ventas** | ✅ Funcional | Historial, gráficas, modal de ventas |
| **Proveedores** | ✅ CRUD | Crear, listar, editar, eliminar |
| **Turnos (Shifts)** | ⚠️ Recién Fixed | Abrir/cerrar turno (fix en cierre: fórmula de cálculo) |
| **Gastos** | ✅ CRUD | Registrar, listar, categorías |
| **Cuentas por Cobrar** | ❓ DESCONOCIDO | Existe vista, estado funcional desconocido |
| **Admin - Clientes** | ❓ DESCONOCIDO | Existe para admins, funcionalidad incierta |

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

## 🔧 Cambios Recientes

### ✅ Corregidos en sesiones anteriores
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
| ✅ FIXED | Proveedor no aparecía post-create | Media | Commit 72af48b |
| ✅ FIXED | Error cerrar turno (FieldError) | Alta | Commits d10fc72 + a652a9d |
| ❓ UNKNOWN | (Revisar si hay más) | - | - |

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
