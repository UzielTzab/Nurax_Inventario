---
name: frontend-api-urls-maintenance
description: >
  SKILL para desarrolladores del frontend Nurax Inventario.
  Garantiza que todas las URLs de API en servicios estén correctas y documentadas.
  TODOS los cambios en services/ DEBEN actualizar docs/skills/API_URLS_VERIFICATION.md
---

# 🔗 SKILL - Mantenimiento de URLs de API (Frontend)

**Objetivo:** Garantizar que todas las peticiones HTTP desde el frontend al backend usen las rutas correctas SIEMPRE.

**Cuándo usar este SKILL:**
- ✅ Al modificar cualquier archivo en `src/services/`
- ✅ Al agregar un nuevo endpoint
- ✅ Al corregir un error 404 o problema de peticiones
- ✅ Al actualizar la documentación de API del backend

---

## 🚨 El Problema

El frontend y backend pueden desincronizarse fácilmente:

```
Backend actualiza: /api/v1/products/products/
Frontend sigue usando: /products/products/
Resultado: 404 NOT FOUND
```

Este SKILL previene eso 🔒

---

## 📋 Checklist - Cada Cambio en Services

### **Paso 1: Verificar Estructura de URL**

```typescript
// ✅ CORRECTO - Con versión v1
apiClient.get('/v1/products/products/')

// ⚠️ EXCEPCIÓN - Auth sin v1
apiClient.post('/auth/login/', ...)

// ❌ INCORRECTO - Falta /v1/
apiClient.get('/products/products/')  

// ❌ INCORRECTO - Doble /api/
apiClient.get('/api/v1/products/products/')  // Base URL ya incluye /api
```

**Regla áurea:** 
```
URL Completa = Base URL (/api) + Ruta (/v1/...)
              = /api/v1/products/products/
```

### **Paso 2: Validar que el Endpoint Existe en Backend**

Si agregas una ruta nueva:

```typescript
// ANTES de usar, verificar en backend/nurax_backend/urls.py
path('api/v1/mi-app/', include('mi_app.urls')),

// O verificar en mi_app/urls.py
router.register('mi-recurso', MiViewSet, basename='mi-recurso')
```

### **Paso 3: Documentar el Cambio**

**Actualizar:** `docs/skills/API_URLS_VERIFICATION.md`

Buscar la sección del servicio y agregar/actualizar la tabla:

```markdown
| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/products/products/nuevo/` | ✅ Nuevo | ✅ |
```

### **Paso 4: Agregar Comentario en el Código**

```typescript
/**
 * Mi función nueva
 * 
 * ✅ ENDPOINT CORRECTO: GET /v1/products/products/nuevo/
 */
async miNuevaFuncion() {
  return apiClient.get('/v1/products/products/nuevo/');
}
```

### **Paso 5: Test Manual**

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/v1/products/products/nuevo/
# Debe retornar 200 OK
```

---

## 📚 Referencia Rápida de URLs

### **Autenticación** (SIN /v1/)
```typescript
POST   /auth/login/              ← Obtener tokens
POST   /auth/refresh/            ← Refrescar token
POST   /auth/register/           ← Registrar (no implementado)
POST   /auth/verify/             ← Verificar (no implementado)
```

### **Accounts** (CON /v1/)
```typescript
GET    /v1/accounts/users/me/           ← Perfil actual
PATCH  /v1/accounts/users/me/           ← Actualizar perfil
GET    /v1/accounts/store-profiles/     ← Config de tienda
PATCH  /v1/accounts/store-profiles/     ← Actualizar config
```

### **Productos** (CON /v1/)
```typescript
GET    /v1/products/products/                        ← Listar
POST   /v1/products/products/                        ← Crear
GET    /v1/products/products/{id}/                   ← Detalle
PUT    /v1/products/products/{id}/                   ← Actualizar
DELETE /v1/products/products/{id}/                   ← Eliminar
POST   /v1/products/products/bulk-import/            ← Importar en batch
GET    /v1/products/categories/                      ← Categorías
GET    /v1/products/suppliers/                       ← Proveedores
```

### **Inventario** (CON /v1/)
```typescript
GET    /v1/inventory/transactions/                   ← Listar transacciones
POST   /v1/inventory/transactions/                   ← Crear transacción
GET    /v1/inventory/transactions/?product=ID       ← Kardex por producto
GET    /v1/inventory/movements/                      ← Movimientos
```

### **Ventas** (CON /v1/)
```typescript
GET    /v1/sales/sales/                              ← Listar ventas
POST   /v1/sales/sales/                              ← Crear venta
GET    /v1/sales/sales/{id}/                         ← Detalle
POST   /v1/sales/sales/{id}/cancel/                  ← Cancelar
POST   /v1/sales/payments/                           ← Registrar pago
GET    /v1/sales/sales/{id}/payments/                ← Pagos de venta
```

### **Gastos** (CON /v1/)
```typescript
GET    /v1/expenses/expenses/                        ← Listar gastos
POST   /v1/expenses/expenses/                        ← Crear gasto
GET    /v1/expenses/cash-shifts/                     ← Cortes de caja
POST   /v1/expenses/cash-shifts/open/                ← Abrir corte
POST   /v1/expenses/cash-shifts/{id}/close/          ← Cerrar corte
```

---

## 🔴 Errores Comunes

### ❌ Error: Olvidad /v1/
```typescript
// INCORRECTO
apiClient.get('/products/products/')  // 404

// CORRECTO
apiClient.get('/v1/products/products/')  // 200
```

### ❌ Error: Usar /api/ en la ruta
```typescript
// INCORRECTO - /api ya está en la base URL
apiClient.get('/api/v1/products/products/')  
// Resultado: /api/api/v1/products/products/ ❌

// CORRECTO
apiClient.get('/v1/products/products/')  
// Resultado: /api/v1/products/products/ ✅
```

### ❌ Error: Auth CON /v1/
```typescript
// INCORRECTO 
apiClient.post('/v1/auth/login/', ...)  // 404

// CORRECTO - Auth es excepción
apiClient.post('/auth/login/', ...)  // 200
```

### ❌ Error: Endpoint personalizado mal formado
```typescript
// INCORRECTO - Falta /v1/
apiClient.post(`/products/${id}/custom-action/`, ...)

// CORRECTO
apiClient.post(`/v1/products/products/${id}/custom-action/`, ...)
```

---

## 📝 Plantilla para Agregar Nuevo Endpoint

### 1. En el código del servicio

```typescript
/**
 * Mi nuevo endpoint
 * 
 * 📍 Backend: GET /api/v1/mi-app/mi-recurso/
 * ✅ Verificado con backend
 * 📅 Actualizado: 2 de Abril, 2026
 */
async miNuevoMetodo() {
  // SIEMPRE comentar la URL completa para referencia
  // GET /api/v1/mi-app/mi-recurso/ 
  return apiClient.get('/v1/mi-app/mi-recurso/');
}
```

### 2. Actualizar docs/skills/API_URLS_VERIFICATION.md

Agregar fila a tabla correspondiente:

```markdown
| GET | `/v1/mi-app/mi-recurso/` | ✅ | ✅ |
```

### 3. Crear test (opcional pero recomendado)

```typescript
// src/services/__tests__/mi-service.test.ts
describe('miNuevoMetodo', () => {
  it('debe llamar GET /v1/mi-app/mi-recurso/', async () => {
    // Test aquí
  });
});
```

---

## 🧪 Protocolo de Verificación

Antes de hacer COMMIT con cambios en services:

```bash
# ✅ Paso 1: Verificar referencia cruzada
grep -r "apiClient\." src/services/*.ts | grep -v "/v1/"
# Resultado debe mostrar SOLO /auth/ (excepto auth, todo debe tener /v1/)

# ✅ Paso 2: Verificar sintaxis TypeScript
npm run type-check

# ✅ Paso 3: Verificar que la URL está documentada
grep -i "tu-nueva-ruta" docs/skills/API_URLS_VERIFICATION.md

# ✅ Paso 4: Test con curl (si es necesario)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/tu/nueva/ruta/ \
  -X GET
```

---

## 📋 Git Commit Estándar

Cuando actualices URLs:

```
git commit -m "refactor(services): actualizar URLs de inventory

- Cambiar /products/{id}/record-transaction/ → /v1/inventory/transactions/
- Cambiar /products/{id}/kardex/ → /v1/inventory/transactions/?product=
- Actualizar API_URLS_VERIFICATION.md
- Agregar comentarios de referencia en código

Fixes: #123 (si hay issue)"
```

---

## 🔗 Documentos Relacionados

- **Backend URLs:** `/nurax_backend/nurax_backend/urls.py`
- **API Docs Backend:** `/nurax_backend/docs/API_ENDPOINTS.md`
- **Auditoría Actual:** `/nurax_inventario/docs/skills/API_URLS_VERIFICATION.md`
- **Development Guide Frontend:** `/nurax_inventario/README.md`

---

## ✅ Última Verificación

**Ejecutar antes de cada release:**

```bash
# Comparar URLs frontend vs backend
echo "Frontend URLs:"
grep -r "apiClient\." src/services/ | sed "s/.*apiClient\.\(get\|post\|put\|patch\|delete\)(['\"]//;s/['\"]).*//" | sort | uniq

echo -e "\nBackend URLs:"
grep "path(" nurax_backend/nurax_backend/urls.py | sort | uniq
```

**Resultado esperado:** Todas las rutas del frontend existen en el backend.

---

**Responsable de mantener:** Equipo Frontend  
**Última actualización:** 2 de Abril, 2026  
**Estado:** ✅ ACTIVO - TODOS LOS CAMBIOS DEBEN SEGUIR ESTE SKILL
