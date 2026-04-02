---
name: api-urls-comparison
description: >
  Comparación lado a lado de URLs Frontend vs Backend.
  Guía rápida para verificar correspondencias correctas.
---

# 🔗 Comparación URLs: Frontend ↔ Backend

**Propósito:** Verificación rápida sin errar  
**Actualizado:** 2 de Abril, 2026  
**Estado:** 🟢 Sincronizado (Después de correcciones)

---

## 📋 Cómo Usar Este Documento

```
FRONTEND (Ruta en apiClient)     =    BACKEND (URL completa)
/v1/productos/items/            =    /api/v1/productos/items/
```

**Regla simple:** 
- Frontend = Ruta relativa (sin `/api`)
- Backend = Ruta en servidor (con `/api`)

---

## 🔐 AUTENTICACIÓN (EXCEPCIÓN: Sin /v1/)

```
FRONTEND                     BACKEND                        ESTADO
─────────────────────────────────────────────────────────────────
POST /auth/login/       →   POST /api/auth/login/       ✅
POST /auth/refresh/      →   POST /api/auth/refresh/      ✅
POST /auth/register/     →   POST /api/auth/register/     ❌ No existe
POST /auth/verify/       →   POST /api/auth/verify/       ❌ No existe
```

**Notas:**
- Auth son las ÚNICAS rutas SIN `/v1/`
- register y verify no existen en backend actual

---

## 👤 ACCOUNTS (CON /v1/)

```
FRONTEND                                BACKEND                                     ESTADO
────────────────────────────────────────────────────────────────────────────────────────────
GET  /v1/accounts/users/me/        →   GET  /api/v1/accounts/users/me/        ✅
PATCH /v1/accounts/users/me/       →   PATCH /api/v1/accounts/users/me/       ✅
GET  /v1/accounts/store-profiles/  →   GET  /api/v1/accounts/store-profiles/  ✅
PATCH /v1/accounts/store-profiles/ →   PATCH /api/v1/accounts/store-profiles/ ✅
```

**Referencia en Frontend:** `src/services/auth.service.ts`, `src/services/store-settings.service.ts`

---

## 📦 PRODUCTOS (CON /v1/)

```
FRONTEND                                      BACKEND                                          ESTADO
─────────────────────────────────────────────────────────────────────────────────────────────────────────
GET    /v1/products/products/           →   GET    /api/v1/products/products/            ✅
POST   /v1/products/products/           →   POST   /api/v1/products/products/            ✅
GET    /v1/products/products/{id}/      →   GET    /api/v1/products/products/{id}/       ✅
PUT    /v1/products/products/{id}/      →   PUT    /api/v1/products/products/{id}/       ✅
DELETE /v1/products/products/{id}/      →   DELETE /api/v1/products/products/{id}/       ✅
POST   /v1/products/products/bulk-import/ → POST   /api/v1/products/products/bulk-import/ ✅

GET    /v1/products/categories/         →   GET    /api/v1/products/categories/          ✅
POST   /v1/products/categories/         →   POST   /api/v1/products/categories/          ✅

GET    /v1/products/suppliers/          →   GET    /api/v1/products/suppliers/           ✅
POST   /v1/products/suppliers/          →   POST   /api/v1/products/suppliers/           ✅
PUT    /v1/products/suppliers/{id}/     →   PUT    /api/v1/products/suppliers/{id}/      ✅
DELETE /v1/products/suppliers/{id}/     →   DELETE /api/v1/products/suppliers/{id}/      ✅
```

**Referencia en Frontend:** `src/services/products.service.ts`, `src/services/onboarding.service.ts`

---

## 📊 INVENTARIO (CON /v1/)

```
FRONTEND                                      BACKEND                                           ESTADO
──────────────────────────────────────────────────────────────────────────────────────────────────────────
GET    /v1/inventory/transactions/      →   GET    /api/v1/inventory/transactions/       ✅
POST   /v1/inventory/transactions/      →   POST   /api/v1/inventory/transactions/       ✅
GET    /v1/inventory/transactions/?product=ID → GET /api/v1/inventory/transactions/?... ✅

GET    /v1/inventory/movements/         →   GET    /api/v1/inventory/movements/          ✅
POST   /v1/inventory/movements/         →   POST   /api/v1/inventory/movements/          ✅
```

**Frecuencia de uso:** Mendiante `recordInventoryTransaction()` y `getProductKardex()`

**Referencia en Frontend:** `src/services/products.service.ts` (después de corrección)

---

## 💰 VENTAS (CON /v1/)

```
FRONTEND                                      BACKEND                                           ESTADO
──────────────────────────────────────────────────────────────────────────────────────────────────────────
GET    /v1/sales/sales/                 →   GET    /api/v1/sales/sales/                  ✅
POST   /v1/sales/sales/                 →   POST   /api/v1/sales/sales/                  ✅
GET    /v1/sales/sales/{id}/            →   GET    /api/v1/sales/sales/{id}/             ✅
POST   /v1/sales/sales/{id}/cancel/     →   POST   /api/v1/sales/sales/{id}/cancel/      ✅

POST   /v1/sales/payments/              →   POST   /api/v1/sales/payments/               ✅
GET    /v1/sales/sales/{id}/payments/   →   GET    /api/v1/sales/sales/{id}/payments/    ✅
```

**Referencia en Frontend:** `src/services/sales.service.ts`

---

## 💸 GASTOS (CON /v1/)

```
FRONTEND                                      BACKEND                                           ESTADO
──────────────────────────────────────────────────────────────────────────────────────────────────────────
GET    /v1/expenses/expenses/           →   GET    /api/v1/expenses/expenses/            ✅
POST   /v1/expenses/expenses/           →   POST   /api/v1/expenses/expenses/            ✅
PATCH  /v1/expenses/expenses/{id}/      →   PATCH  /api/v1/expenses/expenses/{id}/       ✅
DELETE /v1/expenses/expenses/{id}/      →   DELETE /api/v1/expenses/expenses/{id}/       ✅

GET    /v1/expenses/cash-shifts/        →   GET    /api/v1/expenses/cash-shifts/         ✅
POST   /v1/expenses/cash-shifts/open/   →   POST   /api/v1/expenses/cash-shifts/open/    ✅
POST   /v1/expenses/cash-shifts/{id}/close/ → POST /api/v1/expenses/cash-shifts/{id}/close/ ✅
```

**Referencia en Frontend:** `src/services/expenses.service.ts`, `src/services/shifts.service.ts`

---

## 📋 VERIFICACIÓN RÁPIDA

### ¿Es una URL de Auth?
```
SI (/auth/*) → NO añadir /v1/
NO (otra)   → Añadir /v1/
```

### ¿La ruta es válida?
```
Frontend:  /v1/products/items/
Base URL:  http://localhost:8000/api
Completa:  http://localhost:8000/api/v1/products/items/
         ✅ CORRECTA
```

### ¿Existe en Backend?
```
Verificar en:
- nurax_backend/nurax_backend/urls.py
- O en cada app/{nombre}/urls.py
```

---

## 🔴 URLs INCORRECTAS (CORREGIDAS)

Estos FUERON problemas - AHORA están CORRECTOS:

```
ANTES ❌                              DESPUÉS ✅
────────────────────────────────────┼──────────────────────────────────────
/products/{id}/record-transaction/  |  /v1/inventory/transactions/
/products/{id}/kardex/              |  /v1/inventory/transactions/?product=ID
```

**Archivos afectados:**
- ✅ `src/services/products.service.ts` → Corregido
- ✅ `docs/skills/API_URLS_VERIFICATION.md` → Documentado

---

## 🚀 Testing Rápido

### Verificar todas las URLs:
```bash
#!/bin/bash
TOKEN="your-jwt-token"

echo "Testing Auth..."
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

echo -e "\nTesting Products..."
curl -X GET "http://localhost:8000/api/v1/products/products/" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\nTesting Inventory..."
curl -X GET "http://localhost:8000/api/v1/inventory/transactions/" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\nTesting Sales..."
curl -X GET "http://localhost:8000/api/v1/sales/sales/" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:** 200 OK para todas ✅

---

## 📊 Resumen de Estado

| Componente | Total URLs | ✅ Correctas | ⚠️ Incompletas | ❌ Incorrectas |
|-----------|-----------|------------|---------------|---------------|
| Auth | 4 | 2 | 2 | 0 |
| Accounts | 4 | 4 | 0 | 0 |
| Products | 12 | 12 | 0 | 0 |
| Inventory | 6 | 6 | 0 | 0 |
| Sales | 6 | 6 | 0 | 0 |
| Expenses | 7 | 7 | 0 | 0 |
| **TOTAL** | **39** | **37** | **2** | **0** |

**Incompletos:** register, verify (no implementados en backend)

---

## 🎯 Próximos Pasos

1. ✅ Corregir URLs incorrectas → HECHO
2. ✅ Documentar cambios → HECHO
3. ✅ Crear SKILLS de mantenimiento → HECHO
4. □ Implementar register/verify en backend (futuro)
5. □ Agregar CI/CD checks para URLs (futuro)

---

**Última verificación:** 2 de Abril, 2026  
**Verificado por:** Sistema de Auditoría  
**Próxima actualización:** Automática con SKILL POST_CHANGE_DOCS_SYNC.md
