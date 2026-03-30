---
name: frontend-troubleshooting
description: >
  Guía para resolver errores comunes en el frontend Vue. 
  Cubre problemas de API, autenticación, estado y configuración.
---

# 🔧 Frontend Troubleshooting Guide

> Referencia rápida para diagnóstico y resolución de bugs en `nurax_inventario`.
> Última actualización: **30 de Marzo 2026**

---

## 🚨 Error 404 al hacer Login ("La cuenta no existe")

### Síntoma
```
Login: ✅ POST /api/auth/login/ → 200 OK (tokens recibidos)
Pero luego: ❌ GET /api/v1/accounts/users/me/ → 404 Not Found
```

Frontend recibe tokens válidos pero falla al obtener el perfil de usuario.

### Causa Raíz
**Backend no tenía el prefijo `/v1/` registrado en sus URLs.**

- Frontend actualizado: Usa `/api/v1/accounts/users/me/` ✅
- Backend antiguo: Registraba rutas en `/api/` directamente ❌
- Resultado: Ruta no existe en backend → **404**

### Cómo Detectar el Problema

1. **Abre DevTools (F12) → Network tab**
2. **Intenta login**
3. **Busca el request a `/api/v1/accounts/users/me/`**
4. **Si muestra Status 404:** El backend aún no está correctamente configurado

### Solución
**El backend debe estar configurado con `/api/v1/`.**

Verifica en `nurax_backend/urls.py`:
```python
# ✅ CORRECTO
urlpatterns = [
    path('api/v1/', include('api.urls')),  # ← Esto genera /api/v1/...
]

# ❌ INCORRECTO
urlpatterns = [
    path('api/', include('api.urls')),  # ← Esto genera /api/... (SIN /v1/)
]
```

Si el backend tiene el prefijo incorrecto:
1. Arregla `nurax_backend/urls.py`: Cambia `path('api/',` a `path('api/v1/',`
2. Reinicia backend: `docker-compose restart api`
3. Limpia cache del navegador: Ctrl+Shift+R
4. Intenta login nuevo

**Verificación de Backend:**
```bash
# Test con PowerShell para verificar que el endpoint existe
$loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login/" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"uzieltzab8@gmail.com","password":"2jusni!+1"}' `
  -UseBasicParsing

$token = ($loginResponse.Content | ConvertFrom-Json).access

# Ahora test /me/ endpoint
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/accounts/users/me/" `
  -Headers @{"Authorization"="Bearer $token"} `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

Si retorna 200 con el perfil del usuario, el backend está bien. Si sigue dando 404, el backend aún necesita fix.

---

## 🔐 "Authentication credentials were not provided" en requests

### Síntoma
```
Status Code: 401
Response: {"detail":"Authentication credentials were not provided."}
```

Endpoint requiere autenticación pero el token no se está enviando.

### Causa
En `services/api.ts`, el `Authorization` header no se está agregando correctamente.

### Solución
Verifica que `apiClient` esté agregando el token:

```typescript
// services/api.ts
let authToken = '';

export const setAuthToken = (token: string) => {
  authToken = token;
};

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

// Interceptor: agrega el token a TODOS los requests
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;  // ← Crítico
  }
  return config;
});
```

**El test:** Si después de login el token se almacena pero no se envía, revisa:
1. ¿Se llama a `setAuthToken()` después del login?
2. ¿El interceptor está registrado?
3. ¿El localStorage tiene el token guardado?

```javascript
// En consola del navegador:
localStorage.getItem('auth_token')  // Debe mostrar "eyJ..."
```

---

## 🔄 CORS Errors: "Access to XMLHttpRequest blocked"

### Síntoma
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

Browser bloquea request desde frontend a backend por política CORS.

### Causa
Backend no tiene CORS configurado correctamente para origen `http://localhost:5173`.

### Solución
Verifica `nurax_backend/settings.py`:

```python
# ✅ CORRECTO - Desarrollo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # Frontend dev (si Vite usa 3000)
    "http://localhost:5173",   # Frontend dev (Vite por defecto)
    "http://127.0.0.1:5173",
]

# Para producción:
CORS_ALLOWED_ORIGINS = [
    "https://tu-dominio.com",
]
```

Después de cambiar:
```bash
docker-compose restart api
```

---

## 🌐 Frontend No Puede Conectar al Backend ("Cannot reach server")

### Síntoma
```
TypeError: Failed to fetch
XHR Error: net::ERR_CONNECTION_REFUSED
```

Frontend no puede alcanzar el backend.

### Checklist
1. **¿Backend está corriendo?**
   ```bash
   docker ps  # Debe mostrar contenedor "nurax_api"
   ```

2. **¿Puerto 8000 está abierto?**
   ```bash
   netstat -ano | Select-String ":8000"  # PowerShell
   # Debe mostrar "LISTENING"
   ```

3. **¿Frontend tiene la URL correcta?**
   ```typescript
   // En files: services/api.ts, .env, etc.
   baseURL: 'http://localhost:8000'  // ← Correcto
   baseURL: 'http://127.0.0.1:8000'  // ← También OK
   ```

4. **¿Firewall bloquea puerto 8000?**
   Prueba con:
   ```bash
   curl http://localhost:8000/api/docs/
   # Si retorna HTML, el puerto está abierto
   ```

---

## 🎨 Cambiar la Fuente (Font-Family) de Toda la App

### 🎯 CENTRALIZADO EN UN ÚNICO LUGAR

**Toda la fuente está controlada por UNA sola variable en `src/style.css`:**

```css
/* src/style.css - @theme section */
--font-family-sans: "Plus Jakarta Sans", sans-serif;
```

No hay múltiples archivos. Un cambio aquí = cambio en toda la app.

### ✅ Cómo Cambiar la Fuente

#### Opción 1: Cambiar a Recursive (Google Fonts)
```css
/* src/style.css */
--font-family-sans: "Recursive", sans-serif;

/* index.html */
<link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

#### Opción 2: Cambiar a Inter (Google Fonts)
```css
/* src/style.css */
--font-family-sans: "Inter", sans-serif;

/* index.html */
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

#### Opción 3: Cambiar a Plus Jakarta Sans (Google Fonts)
```css
/* src/style.css */
--font-family-sans: "Plus Jakarta Sans", sans-serif;

/* index.html */
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 📝 Pasos para Cambiar

1. **Actualiza la variable CSS** en `src/style.css`:
   ```css
   --font-family-sans: "NEW_FONT_NAME", sans-serif;
   ```

2. **Actualiza el Google Fonts link** en `index.html` (si es de Google Fonts):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=NEW_FONT_NAME:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **Baja el servidor**: `Ctrl+C`

4. **Levanta el servidor**: `npm run dev`

5. **Hard refresh**: `Ctrl+Shift+R`

### ⚠️ Problemas Comunes

#### "La fuente no cambia en toda la app"
- Asegúrate que la variable en `src/style.css` está actualizada
- Verifica que el `index.html` tiene el Google Fonts link correcto
- Limpia todo el cache: DevTools → Application → Clear all storage

#### "La landing no tiene la fuente"
- La landing heredaba `font-family` anterior. Ahora usa `font-family: inherit;` en todos los componentes
- Si sigue sin funcionar, limpia cache: `Ctrl+Shift+R`

#### "Solo cambió en parte de la app"
- **NO** hay `font-family` hardcoded en componentes (todos usan `inherit`)
- Si ves `font-family` en algún lado, es un bug. Reporta para que lo arreglemos

### 🔍 Verificación en DevTools

1. **Abre DevTools** (F12)
2. **Inspect cualquier elemento**
3. **Mira la sección "Styles"**
4. Deberías ver: `font-family: var(--font-family-sans)` o `font-family: inherit`
5. **NO deberías ver** `font-family: 'NombreEspecifico', sans-serif;` (hardcoded)

---

## 🧠 Pinia State No Persiste Después de Reload

### Síntoma
```
Datos se cargan correctamente
Pero después de F5 (reload): Todo desaparece, debe loguearse de nuevo
```

El estado de Pinia no se persiste en localStorage.

### Causa
Pinia no tiene plugin de persistencia configurado.

### Solución
En `main.ts`, configura persistencia:

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

En cada store que quieras persistir:
```typescript
export const useAuthStore = defineStore('auth', () => {
  return {
    // state, getters, actions...
  }
}, {
  persist: true  // ← Agregar esto
})
```

---

## 📡 API Request Timeout

### Síntoma
```
Error: The operation timed out.
(Después de esperar 30+ segundos)
```

El backend tardó demasiado en responder.

### Causas Comunes
1. **Backend está lento/caído**
2. **Query muy pesada (muchos registros sin límite)**
3. **Red lenta**

### Solución
1. **Verifica backend está corriendo:** `docker ps`
2. **Revisa logs del backend:** `docker-compose logs api --tail=50`
3. **Agrega timeout en `api.ts` si es muy bajo:**
   ```typescript
   const apiClient = axios.create({
     baseURL: 'http://localhost:8000',
     timeout: 30000,  // 30 segundos
   });
   ```

---

## 🐛 Componentes No Renderizan Despúes del Login

### Síntoma
```
Login exitoso ✅
Router redirige a /dashboard/inventory ✅
Pero componente no se ve ❌ (pantalla en blanco)
```

### Causa Común
**Route guard bloqueando la navegación.**

En `router/index.ts`, verifica que `beforeEach` no está bloqueando usuarios logueados:

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // ❌ INCORRECTO: Bloquea a usuarios logueados
  if (!authStore.isLoggedIn && to.meta.requiresAuth) {
    next('/auth/login')
    return
  }
  
  // ✅ CORRECTO: Permite si está logueado
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/auth/login')
    return
  }
  
  next()
})
```

---

## 📝 Change Log

### 30-Mar-2026
- **Fixed:** 404 Error on `/api/v1/accounts/users/me/` during login
- **Root Cause:** Backend URL prefix incorrect (`/api/` instead of `/api/v1/`)
- **Frontend Impact:** Updated all service files to use `/api/v1/` endpoints
- **Status:** ✅ Login now works correctly
- **Documentation:** Created FRONTEND_TROUBLESHOOTING.md with complete guide

