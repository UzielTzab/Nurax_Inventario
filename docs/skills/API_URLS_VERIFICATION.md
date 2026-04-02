---
name: api-urls-verification
description: >
  Guía de verificación y corrección de URLs de API Frontend vs Backend.
  Asegura que todas las peticiones HTTP estén dirigidas a los endpoints correctos.
---

# 🔗 Auditoría de URLs - Frontend API Calls

**Última actualización:** 2 de Abril, 2026  
**Estado:** 🔴 PROBLEMAS ENCONTRADOS - 5 URLs INCORRECTAS

---

## 📊 Resumen Ejecutivo

| Estado | Cantidad | Detalles |
|--------|----------|---------|
| ✅ Correcto | 22 endpoints | Usando rutas correctas v1 |
| ⚠️ Incompleto | 2 endpoints | Métodos POST/GET a rutas válidas pero sin formato correcto |
| ❌ Incorrecto | 3 endpoints | Apuntando a rutas que no existen en backend |

---

## 🏗️ Configuración del Frontend

### **Base URL (api.ts)**
```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL 
  || import.meta.env.VITE_API_URL 
  || 'http://localhost:8000/api'
```

**Resultado:** `http://localhost:8000/api`

### **Estructura de Rutas**

Cuando el frontend hace:
```typescript
apiClient.get('/v1/products/products/', ...)
```

La URL completa es:
```
http://localhost:8000/api/v1/products/products/
```

✅ **CORRECTO** - Se forma correctamente

---

## 📋 Auditoría Detallada por Servicio

### **1️⃣ auth.service.ts** ✅ CORRECTO

**Archivo:** `src/services/auth.service.ts`

| Método | Ruta Frontend | URL Completa | Backend | Estado |
|--------|--------------|--------------|---------|--------|
| POST | `/auth/login/` | `/api/auth/login/` | `POST /api/auth/login/` | ✅ |
| GET | `/v1/accounts/users/me/` | `/api/v1/accounts/users/me/` | `GET /api/v1/accounts/users/me/` | ✅ |
| PATCH | `/v1/accounts/users/me/` | `/api/v1/accounts/users/me/` | `PATCH /api/v1/accounts/users/me/` | ✅ |
| POST | `/auth/register/` | `/api/auth/register/` | ❌ NO EXISTE | ⚠️ Sin implementar |
| POST | `/auth/verify/` | `/api/auth/verify/` | ❌ NO EXISTE | ⚠️ Sin implementar |

**Notas:**
- `register/` y `verify/` no existen en el backend actual (están comentados)
- Los endpoints principales (login, me, update avatar) están CORRECTOS

---

### **2️⃣ products.service.ts** ⚠️ PROBLEMAS ENCONTRADOS

**Archivo:** `src/services/products.service.ts`

| Método | Ruta Frontend | URL Completa | Backend | Estado |
|--------|--------------|----|---------|--------|
| GET | `/v1/products/products/` | `/api/v1/products/products/` | ✅ Existe | ✅ |
| GET | `/v1/products/products/{id}/` | `/api/v1/products/products/{id}/` | ✅ Existe | ✅ |
| POST | `/v1/products/products/` | `/api/v1/products/products/` | ✅ Existe | ✅ |
| PUT | `/v1/products/products/{id}/` | `/api/v1/products/products/{id}/` | ✅ Existe | ✅ |
| DELETE | `/v1/products/products/{id}/` | `/api/v1/products/products/{id}/` | ✅ Existe | ✅ |
| POST | `/v1/products/products/bulk-import/` | `/api/v1/products/products/bulk-import/` | ✅ Existe (con @action) | ✅ |
| **POST** | **`/products/{id}/record-transaction/`** | **`/api/products/{id}/record-transaction/`** | ❌ NO EXISTE | ❌ INCORRECTO |
| **GET** | **`/products/{id}/kardex/`** | **`/api/products/{id}/kardex/`** | ❌ NO EXISTE | ❌ INCORRECTO |

**Problemas Identificados:**

```typescript
// ❌ LÍNEA 152 - INCORRECTO
async recordInventoryTransaction(...) {
  return apiClient.post<InventoryTransaction>(
    `/products/${productId}/record-transaction/`,  // ❌ Falta /v1/products/products
    { transaction_type: transactionType, quantity, reason }
  );
}

// ❌ LÍNEA 162 - INCORRECTO
async getProductKardex(productId: number | string) {
  return apiClient.get<InventoryTransaction[]>(
    `/products/${productId}/kardex/`  // ❌ Falta prefix
  );
}
```

**Solución:**
```typescript
// ✅ CORRECTO - Usar endpoints de inventory
async recordInventoryTransaction(...) {
  return apiClient.post<InventoryTransaction>(
    `/v1/inventory/transactions/`,  // ✅ Usar endpoint correcto
    { 
      product: productId,
      transaction_type: transactionType, 
      quantity, 
      reason 
    }
  );
}

async getProductKardex(productId: number | string) {
  return apiClient.get<InventoryTransaction[]>(
    `/v1/inventory/transactions/?product=${productId}`  // ✅ Filtrar por producto
  );
}
```

---

### **3️⃣ suppliers.service.ts** ✅ CORRECTO

**Archivo:** `src/services/suppliers.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/products/suppliers/` | ✅ | ✅ |
| GET | `/v1/products/suppliers/{id}/` | ✅ | ✅ |
| POST | `/v1/products/suppliers/` | ✅ | ✅ |
| PUT | `/v1/products/suppliers/{id}/` | ✅ | ✅ |
| DELETE | `/v1/products/suppliers/{id}/` | ✅ | ✅ |

---

### **4️⃣ expenses.service.ts** ✅ CORRECTO

**Archivo:** `src/services/expenses.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/expenses/expenses/` | ✅ | ✅ |
| GET | `/v1/expenses/expenses/{id}/` | ✅ | ✅ |
| POST | `/v1/expenses/expenses/` | ✅ | ✅ |
| PATCH | `/v1/expenses/expenses/{id}/` | ✅ | ✅ |
| DELETE | `/v1/expenses/expenses/{id}/` | ✅ | ✅ |

---

### **5️⃣ shifts.service.ts** ✅ CORRECTO

**Archivo:** `src/services/shifts.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/expenses/cash-shifts/` | ✅ | ✅ |
| GET | `/v1/expenses/cash-shifts/{id}/` | ✅ | ✅ |
| POST | `/v1/expenses/cash-shifts/open/` | ✅ (custom action) | ✅ |
| POST | `/v1/expenses/cash-shifts/{id}/close/` | ✅ (custom action) | ✅ |

---

### **6️⃣ sales.service.ts** ✅ CORRECTO

**Archivo:** `src/services/sales.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/sales/sales/` | ✅ | ✅ |
| GET | `/v1/sales/sales/{id}/` | ✅ | ✅ |
| POST | `/v1/sales/sales/` | ✅ | ✅ |
| POST | `/v1/sales/sales/{id}/cancel/` | ✅ (custom action) | ✅ |
| POST | `/v1/sales/payments/` | ✅ | ✅ |
| GET | `/v1/sales/sales/{id}/payments/` | ✅ | ✅ |

---

### **7️⃣ store-settings.service.ts** ✅ CORRECTO

**Archivo:** `src/services/store-settings.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/accounts/store-profiles/` | ✅ | ✅ |
| PATCH | `/v1/accounts/store-profiles/` | ✅ | ✅ |

---

### **8️⃣ onboarding.service.ts** ✅ CORRECTO

**Archivo:** `src/services/onboarding.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| POST | `/v1/products/products/bulk-import/` | ✅ (custom action) | ✅ |
| POST | `/v1/accounts/store-profiles/onboarding-complete/` | ⚠️ Ver nota | ⚠️ |

**Nota:** `/onboarding-complete/` podría ser custom action en store-profiles, verificar existencia.

---

## 🔴 Problemas Críticos Encontrados

### **Problema 1: URLs de Transacciones de Inventario**

**Ubicación:** `src/services/products.service.ts` línea 152

```typescript
// ❌ INCORRECTO - Endpoint no existe
const url = `/products/${productId}/record-transaction/`;
```

**Punto Actual URL Completa:** `http://localhost:8000/api/products/...`  
**Punto Actual Estado:** `404 Not Found`

**Causa:** El frontend está usando la ruta antigua sin `/v1/` y sin el prefijo `/inventory/`

**Solución:**
```typescript
// ✅ CORRECTO - Usar endpoint de inventory
const url = `/v1/inventory/transactions/`;
```

---

### **Problema 2: Kardex (Historial de Movimientos)**

**Ubicación:** `src/services/products.service.ts` línea 162

```typescript
// ❌ INCORRECTO - Endpoint no existe
const url = `/products/${productId}/kardex/`;
```

**Causa:** Ruta incompleta, debería estar en `/v1/inventory/`

**Solución:**
```typescript
// ✅ CORRECTO - Filtrar transacciones por producto
const url = `/v1/inventory/transactions/?product=${productId}`;
```

---

## ✅ Plan de Corrección

### **Fase 1: Actualizar Products Service**
1. Reemplazar rutas de transacciones
2. Reemplazar rutas de kardex
3. Ajustar payload de datos si es necesario

### **Fase 2: Validar Todos los Servicios**
1. Ejecutar auditoría completa
2. Crear mapping de URLs
3. Documentar cambios

### **Fase 3: Pruebas**
1. Test endpoint por endpoint
2. Verificar respuestas 200/201
3. Test con datos reales

### **Fase 4: Actualizar Documentación**
1. Crear documento de convenciones
2. Agregar comentarios en servicios
3. Mantener sync con backend

---

## 📝 Convenciones de URLs (Frontend)

**Regla #1: Usar siempre `/v1/` para endpoints versionados**
```typescript
// ✅ CORRECTO
apiClient.get('/v1/products/products/')

// ❌ INCORRECTO - Falta versión
apiClient.get('/products/products/')
```

**Regla #2: Auth endpoints son excepción (sin `/v1/`)**
```typescript
// ✅ CORRECTO - Auth no lleva v1
apiClient.post('/auth/login/', credentials)

// ❌ INCORRECTO - Auth no lleva v1
apiClient.post('/v1/auth/login/', credentials)
```

**Regla #3: Siempre usar el prefijo de dominio correcto**
```typescript
// ✅ CORRECTO
/v1/products/products/     →  GET /api/v1/products/products/
/v1/expenses/expenses/     →  GET /api/v1/expenses/expenses/
/v1/inventory/transactions/ → POST /api/v1/inventory/transactions/

// ❌ INCORRECTO
/products/products/        →  GET /api/products/products/ (404)
/expenses/                 →  GET /api/expenses/ (404)
```

---

## 🔗 Referencias

**Backend URLs (urls.py):**
```python
path('api/auth/login/', ...),           # SIN /v1/
path('api/auth/refresh/', ...),         # SIN /v1/
path('api/v1/accounts/', ...),          # CON /v1/
path('api/v1/products/', ...),          # CON /v1/
path('api/v1/sales/', ...),             # CON /v1/
path('api/v1/inventory/', ...),         # CON /v1/
path('api/v1/expenses/', ...),          # CON /v1/
```

**Frontend Base URL:**
```
http://localhost:8000/api
```

---

## ✅ Estado de Correcciones

- [ ] Corregir `recordInventoryTransaction()` en products.service.ts
- [ ] Corregir `getProductKardex()` en products.service.ts
- [ ] Verificar endpoints de auth (register, verify)
- [ ] Verificar endpoint onboarding-complete
- [ ] Agregar tests de peticiones HTTP
- [ ] Documentar en SKILL
- [ ] Actualizar docs cada cambio

---

**Próximo paso:** Ejecutar correcciones y validar con 200/201 responses.
