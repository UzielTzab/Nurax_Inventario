---
name: backend-troubleshooting
description: >
  Guía para resolver errores comunes en el backend Django/DRF.
  Cubre problemas de routing, autenticación, migraciones y configuración.
---

# 🔧 Backend Troubleshooting Guide

> Referencia rápida para diagnóstico y resolución de bugs en `nurax_backend`.
> Última actualización: **30 de Marzo 2026**

---

## 🚨 Error 404 en `/api/v1/accounts/users/me/` (CRÍTICO)

### Síntoma
```bash
Request URL: http://localhost:8000/api/v1/accounts/users/me/
Status Code: 404 Not Found
Response: "Not Found: /api/v1/accounts/users/me/"
```

Frontend intenta acceder pero backend retorna 404, aunque el endpoint debería existir.

### Causa Raíz
La configuración de URLs del backend no tiene el prefijo `/v1/` registrado correctamente.

**En `nurax_backend/urls.py`:**
```python
# ❌ INCORRECTO
urlpatterns = [
    path('api/',          include('api.urls')),  # Esto genera /api/users/, NO /api/v1/users/
]

# ✅ CORRECTO
urlpatterns = [
    path('api/v1/',       include('api.urls')),  # Esto genera /api/v1/users/
]
```

### Punto Clave del Problema
El router de DRF genera rutas **dinámicamente** basándose en el `path()` que le pasas:

```python
# En api/urls.py
router.register('users', UserViewSet)

# Si en urls.py haces:
path('api/',    include(...))    → Genera /api/users/
path('api/v1/', include(...))    → Genera /api/v1/users/
```

**La ruta final = `path()` prefix + `register()` basename**

### Solución Completa

**Paso 1:** Actualizar `nurax_backend/urls.py`
```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/',          include('api.urls')),  # ← El prefijo v1 va aquí
    path('api/auth/login/',   TokenObtainPairView.as_view(),  name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),
]
```

**Paso 2:** Reorganizar `api/urls.py` por dominio
```python
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProductViewSet, SaleViewSet, ...

router = DefaultRouter()

# Accounts domain
router.register('accounts/users',          UserViewSet)
router.register('accounts/store-profiles', StoreProfileViewSet, basename='store')

# Products domain
router.register('products/products',       ProductViewSet)
router.register('products/suppliers',      SupplierViewSet)
router.register('products/categories',     CategoryViewSet)

# Sales domain
router.register('sales/sales',             SaleViewSet)
router.register('sales/clients',           ClientViewSet)

# Expenses domain
router.register('expenses/expenses',       ExpenseViewSet)
router.register('expenses/cash-shifts',    CashShiftViewSet)

# Inventory domain
router.register('inventory/transactions',  InventoryTransactionViewSet)

urlpatterns = router.urls
```

**Paso 3:** Reiniciar el backend
```bash
docker-compose restart api
```

**Paso 4:** Verificar
```bash
# Login para obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"uzieltzab8@gmail.com","password":"2jusni!+1"}'

# Con token, probar el endpoint
curl -X GET http://localhost:8000/api/v1/accounts/users/me/ \
  -H "Authorization: Bearer <access_token>"
  
# Debería retornar 200 con perfil del usuario
```

### Resultados Esperados After Fix

```
✅ GET  /api/v1/accounts/users/               → 401 (needs auth) o 200
✅ GET  /api/v1/accounts/users/me/            → 200 (con token)
✅ GET  /api/v1/products/products/            → 200
✅ GET  /api/v1/sales/sales/                  → 200
✅ GET  /api/v1/expenses/cash-shifts/         → 200
✅ GET  /api/v1/inventory/transactions/       → 200
```

---

## 🔄 InconsistentMigrationHistory Error

### Síntoma
```bash
InconsistentMigrationHistory: Migration admin.0001_initial is applied before 
its dependency api.0001_initial
```

Ocurre después de cambios en la estructura de aplicaciones o refactoring de migraciones.

### Causa
La base de datos tiene un historial de migraciones inconsistente. Probablemente:
- Migraciones aplicadas en orden incorrecto
- Eliminaste apps/modelos y luego creaste nuevas migraciones
- Volumen de Docker con estado corrupto

### Solución Rápida (DESTRUCTIVA)
```bash
# Destroy volume y recrear BD limpia
cd nurax_backend
docker-compose down -v

# Recrear todo
docker-compose up -d

# Verificar logs
docker-compose logs api --tail=30
```

**⚠️ ADVERTENCIA:** Esto **elimina todos los datos**. Solo para desarrollo.

### Solución Conservadora (Preserva datos)
1. Conectarse al contenedor
```bash
docker exec -it nurax_api bash
```

2. Hacer backup de la BD
```bash
python manage.py dumpdata > backup.json
```

3. Limpiar migraciones problemáticas
```bash
# Listar migraciones
python manage.py showmigrations api

# Revertir hasta una migración conocida buena
python manage.py migrate api 0001
```

4. Aplicar migraciones nuevamente
```bash
python manage.py migrate
```

---

## 🔐 Authentication Errors

### 401 Unauthorized
```bash
Status: 401
Response: {"detail":"Authentication credentials were not provided."}
```

**Solución:**
- Verificar que el header `Authorization: Bearer <token>` está presente
- Token no es válido o expiró → Usar refresh token

```python
# En frontend: auth.service.ts
const response = await fetch('/api/v1/accounts/users/me/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`  # ← Verificar esto
  }
})
```

### 403 Forbidden
```bash
Status: 403
Response: {"detail":"You do not have permission to perform this action."}
```

**Solución:**
- El usuario no es admin
- Endpoint requiere ciertos permisos
- Verificar `permission_classes` en ViewSet

```python
# En backend: views.py
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Solo usuarios logueados
    # O:
    permission_classes = [IsAuthenticated, IsAdminUser]  # Solo admins
```

---

## 🏗️ Migration Issues

### "No changes detected"
```bash
python manage.py makemigrations
No changes detected in app 'api'
```

**Posibles causas:**
- No modificaste ningún modelo
- El modelo no está registrado en `__init__.py`
- Migraciones ya existen para los cambios

### "Table already exists"
```bash
django.db.utils.ProgrammingError: relation "api_user" already exists
```

**Solución:**
```bash
# Ver estado de migraciones
python manage.py showmigrations

# Si una migración está marcada como aplicada pero la tabla no existe
python manage.py migrate --fake api 0001
```

---

## 🧪 Testing Backend Endpoints

### Quick cURL Tests

**1. Login → Get Tokens**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "uzieltzab8@gmail.com",
    "password": "2jusni!+1"
  }' | jq '.access'
```

**2. Get User Profile**
```bash
TOKEN="eyJ..."  # From login response
curl -X GET http://localhost:8000/api/v1/accounts/users/me/ \
  -H "Authorization: Bearer $TOKEN"
```

**3. List All Users (Admin)**
```bash
curl -X GET "http://localhost:8000/api/v1/accounts/users/?role=cliente" \
  -H "Authorization: Bearer $TOKEN"
```

**4. Update Store Settings**
```bash
curl -X PATCH http://localhost:8000/api/v1/accounts/store-profiles/1/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Mi Empresa","currency_symbol":"$"}'
```

### PowerShell Quick Test
```powershell
# Login
$login = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login/" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"uzieltzab8@gmail.com","password":"2jusni!+1"}' `
  -UseBasicParsing

$token = ($login.Content | ConvertFrom-Json).access
$headers = @{"Authorization"="Bearer $token"}

# Get profile
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/accounts/users/me/" `
  -Headers $headers `
  -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## 🔍 Debugging Tips

### Enable SQL Query Logging
En `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### View All Available Endpoints
```bash
python manage.py show_urls
# O
curl http://localhost:8000/api/schema/  # Si drf_spectacular está instalado
```

### Check Django Admin
```bash
# Crear usuario admin si no existe
python manage.py createsuperuser

# Acceder en http://localhost:8000/admin/
```

---

## 📝 Change Log

### 30-Mar-2026
- **Fixed:** 404 Error on `/api/v1/accounts/users/me/`
- **Root Cause:** Backend URLs prefijo incorrecto (`/api/` en lugar de `/api/v1/`)
- **Solution:** Actualizado `nurax_backend/urls.py` + reorganizado `api/urls.py` por dominio
- **Result:** ✅ All 5 domains now accessible under `/api/v1/{domain}/`

