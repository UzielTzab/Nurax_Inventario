---
name: skills-index
description: >
  Índice y guía de cuándo usar cada documento de skills.
---

# 📚 Skills Documentation Index

> Referencia central de toda la documentación de Nurax Inventario (Frontend).
> Última actualización: **2 de Abril 2026**

---

## 🚨 IMPORTANTE - URLs de API (Lo Más Crítico)

### Si tienes problemas con peticiones HTTP 404:
1. **Primero lee:** [API_URLS_COMPARISON.md](./API_URLS_COMPARISON.md) (2 min) ← Aquí están TODAS las URLs correctas
2. **Luego revisa:** [API_URLS_VERIFICATION.md](./API_URLS_VERIFICATION.md) (5 min) ← Auditoría completa
3. **Cuando cambies un servicio:** Sigue [FRONTEND_API_URLS_MAINTENANCE.md](./FRONTEND_API_URLS_MAINTENANCE.md) ← Obligatorio
4. **Después de cambio:** Ejecuta [POST_CHANGE_DOCS_SYNC.md](./POST_CHANGE_DOCS_SYNC.md) ← Auto-sync documentation

---

## 🗺️ Mapa de Documentos

### 🔐 API URLs & HTTP Requests (CRÍTICO)

#### [API_URLS_COMPARISON.md](./API_URLS_COMPARISON.md) - 📋 COMIENZA AQUÍ
**Para qué:** Comparación lado-a-lado Frontend ↔ Backend de TODAS las URLs  
**Cuándo usarlo:**
- ✅ Empezar un cambio en servicios
- ✅ Error 404 en peticiones HTTP
- ✅ Verificación rápida de ruta correcta
- ✅ Nuevo desarrollador necesita referencia rápida

**Contiene:**
- ✅ Tabla de correspondencias Frontend/Backend
- ✅ Explicación de diferencia /v1/ vs /auth/
- ✅ URLs correctas e incorrectas (corregidas)
- ✅ Testing con curl

**Estado:** ✅ Actualizado 2-Abr-26 (Después de correcciones)

---

#### [API_URLS_VERIFICATION.md](./API_URLS_VERIFICATION.md) - 📊 AUDITORÍA COMPLETA
**Para qué:** Auditoría exhaustiva de TODAS las URLs por servicio  
**Cuándo usarlo:**
- ✅ Verificación deep de un servicio específico
- ✅ Entender qué endpoints existen/no existen
- ✅ Ver problemas identificados con detalles
- ✅ Referencia completa de cada servicio

**Contiene:**
- ✅ Detalle por archivo de servicio
- ✅ Status ✅/❌ de cada URL
- ✅ Problemas críticos encontrados + soluciones
- ✅ Convenciones de URLs
- ✅ Referencias a código backend

**Problemas corregidos:**
- ✅ `/products/{id}/record-transaction/` → `/v1/inventory/transactions/`
- ✅ `/products/{id}/kardex/` → `/v1/inventory/transactions/?product=ID`

**Estado:** ✅ Actualizado 2-Abr-26

---

#### [FRONTEND_API_URLS_MAINTENANCE.md](./FRONTEND_API_URLS_MAINTENANCE.md) - 🔗 MANTENIMIENTO
**Para qué:** SKILL obligatorio para TODOS los cambios en `src/services/`  
**Cuándo usarlo:** ⚠️ SIEMPRE que modifiques un servicio

**Contenido:**
- ✅ Checklist de verificación de URLs
- ✅ Referencia rápida de todas las rutas
- ✅ Errores comunes + cómo evitarlos
- ✅ Protocolo de verificación
- ✅ Git commit estándar

**OBLIGATORIO:** Seguir este SKILL después de cambios en servicios

---

#### [POST_CHANGE_DOCS_SYNC.md](./POST_CHANGE_DOCS_SYNC.md) - 🔄 AUTO-SYNC
**Para qué:** Auto-sincronizar documentación después CADA cambio  
**Cuándo usarlo:** ⚠️ Después de modificar `src/services/` (OBLIGATORIO)

**Procesos:**
- ✅ Checklist tipo de cambio (corregir/agregar/refactorizar)
- ✅ Validación en 4 pasos ('grep's + curl)
- ✅ Template para nuevos serviceios
- ✅ Señales de alerta
- ✅ Para CI/CD futuro

**Flujo:**
```
Editar servicio → Seguir FRONTEND_API_URLS_MAINTENANCE → Ejecutar POST_CHANGE_DOCS_SYNC
```

---

### 🎓 Onboarding & Context

#### [SKILL.md](./SKILL.md)
**Para qué:** Entender el **stack técnico completo** del proyecto  
**Cuándo usarlo:** 
- Primer día en el proyecto → lee esto primero
- Necesitas saber tecnologías usadas
- Buscas estructura general de carpetas

**Contiene:**
- ✅ Stack: Vue 3, TypeScript, Vite, Pinia, TailwindCSS, Django DRF
- ✅ Estructura de carpetas `/src`
- ✅ Rutas públicas/protegidas y roles
- ✅ Componentes principales
- ✅ Endpoints de API organizados por dominio
- ✅ Design system y paleta de colores

---

#### [AGENT.md](./AGENT.md)
**Para qué:** Context rápido para agentes IA (Copilot, Claude, etc.)  
**Cuándo usarlo:**
- Cuando invocas un agente IA
- Necesitas describirle el proyecto rápidamente
- Requieres entender la arquitectura B/F

**Contiene:**
- ✅ Overview del proyecto
- ✅ Stack resumido
- ✅ Problemas conocidos y soluciones
- ✅ Git workflow

**Última actualización:** 30-Mar-2026 (agregado fix de routing)

---

### 🔧 Troubleshooting (Cuando algo está roto)

#### [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md)
**Para qué:** Resolver errores comunes de **backend Django**  
**Cuándo usarlo:**
- ❌ Recibiendo 404 Not Found
- ❌ Error `InconsistentMigrationHistory`
- ❌ 401 Unauthorized
- ❌ 403 Forbidden
- ❌ Migration errors
- ⏱️ Necesitas testear endpoints

**Contiene:**
- ✅ 404 en `/api/v1/accounts/users/me/` — **Caso de estudio completo**
- ✅ Root cause analysis del bug
- ✅ Solución paso-a-paso
- ✅ Verificación y testing commands
- ✅ Migration issues
- ✅ Debugging tips

**Última actualización:** 30-Mar-2026 (new file)

---

#### [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md)
**Para qué:** Resolver errores comunes de **frontend Vue + TypeScript**  
**Cuándo usarlo:**
- ❌ 404 al intentar login
- ❌ "Cannot reach server"
- ❌ CORS errors
- ❌ Fonte (Inter) no carga
- ❌ Componentes no renderizan
- ❌ Pinia state no persiste
- ❌ Timeout en requests

**Contiene:**
- ✅ 404 al login — **Explicación de qué paso con el fix**
- ✅ Cómo detectar problemas con DevTools
- ✅ Auth: 401 vs 403
- ✅ CORS configuration
- ✅ Typography (Inter font) issues
- ✅ Router guards
- ✅ Estado Pinia

**Última actualización:** 30-Mar-2026 (new file)

---

### 📊 Project Status & Planning

#### [PROJECT_STATUS.md](./PROJECT_STATUS.md)
**Para qué:** Entender **qué está hecho, qué está por hacer**  
**Cuándo usarlo:**
- Planificación de features
- Revisar bugs conocidos
- Entender decisiones arquitectónicas
- Historial de sesiones previas

**Contiene:**
- ✅ Estado actual (Build, API, Auth, Features)
- ✅ Arquitectura y decisiones
- ✅ Features por prioridad (Crítico, Alto, Medio, Bajo)
- ✅ **🎯 Cambios recientes Sesión 30-Mar-2026:** Backend routing fix documentado
- ✅ Bugs known + status
- ✅ Change log histórico

**Última actualización:** 30-Mar-2026 (sesión routing fix + documentación)

---

### 📡 API Specifications

#### [FRONTEND_PRODUCTS_API_GUIDE.md](./FRONTEND_PRODUCTS_API_GUIDE.md)
**Para qué:** Referencia de cómo consumir el endpoint de **productos** desde frontend  
**Cuándo usarlo:**
- Necesitas fetch de productos con filtros
- Buscas parámetros de paginación
- Requieres búsqueda y ordenamiento
- Cómo hacer requests correctamente

**Contiene:**
- ✅ Endpoint: `GET /api/v1/products/products/`
- ✅ Query params (paginación, búsqueda, filtros, ordering)
- ✅ Response format
- ✅ Ejemplos de requests
- ✅ Error responses

**Última actualización:** 30-Mar-2026 (actualizado a `/api/v1/products/products/`)

---

#### [PUSHER_EVENTS_CONTEXT.md](./PUSHER_EVENTS_CONTEXT.md)
**Para qué:** Entender eventos **real-time** vía Pusher.js  
**Cuándo usarlo:**
- Implementas notificaciones en tiempo real
- Necesitas actualizar datos sin polling
- Sincronizar múltiples clientes
- Entender arquitectura de eventos

**Contiene:**
- ✅ Eventos disponibles (product-updated, sale-created, etc.)
- ✅ Payload de cada evento
- ✅ Cómo subscribirse en Vue
- ✅ Cuándo se disparan

**Última actualización:** 23-Mar-2026

---

### 🔐 Seguridad & Autenticación

#### [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md) ⚠️ **CRÍTICO**
**Para qué:** Guía completa de seguridad de tokens JWT, prevención de XSS/CSRF, y mejores prácticas  
**Cuándo usarlo:**
- ❌ **URGENTE:** Almacenar tokens en localStorage es vulnerable a XSS
- ✅ Implementar autenticación segura con HttpOnly cookies
- ✅ Entender ataques de seguridad y mitigaciones
- ✅ Auditoría de seguridad de autenticación

**Contiene:**
- 🚨 **Vulnerabilidad identificada:** localStorage + XSS = robo de token
- ✅ Solución recomendada: HttpOnly + Secure Cookies
- ✅ Implementación backend (Django) con ejemplos código
- ✅ Implementación frontend (Vue) simplificada
- ✅ Comparativa localStorage vs HttpOnly
- ✅ Checklist de seguridad OWASP
- ✅ Mitigaciones contra XSS, CSRF, token theft
- ✅ Plan de implementación por fases
- ✅ Referencias OWASP

**Impacto potencial si no se implementa:**
- 🔴 CRÍTICA: Robo de tokens vía XSS
- 🔴 CRÍTICA: Acceso no autorizado a datos de clientes
- 🔴 CRÍTICA: Manipulación de inventario y ventas
- 🔴 CRÍTICA: Exfiltración de datos de negocio

**Estado:** ✅ 6-Abr-2026 — **Frontend completado, Backend en progreso**

---

### 📋 Documentos de Implementación (Refactorización Completada)

#### [SUMMARY_EXECUTIVE.md](./SUMMARY_EXECUTIVE.md) - 🎯 RESUMEN EJECUTIVO
**Para qué:** Overview rápido de cambios de seguridad implementados  
**Cuándo usarlo:**
- Necesitas entender QUÉ cambió y POR QUÉ
- Requieres métricas de seguridad before/after
- Necesitas plan de próximos pasos

**Contiene:**
- ✅ Cambios clave de seguridad
- ✅ Impacto de seguridad (vulnerabilidades eliminadas)
- ✅ Matriz de testing
- ✅ Plan de implementación backend (3 horas)

**Última actualización:** 6-Abr-2026

---

#### [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md) - 💻 DETALLES FRONTEND
**Para qué:** Documentación completa de refactorización frontend (localStorage → HttpOnly)  
**Cuándo usarlo:**
- Necesitas entender cambios específicos en frontend
- Requieres guía de testing post-implementación
- Buscas troubleshooting de XSS protection

**Contiene:**
- ✅ Cambios por archivo (api.ts, auth.service.ts, useAuth.ts)
- ✅ Flujo de autenticación nuevo (seguro)
- ✅ Matrix de seguridad post-implementación
- ✅ Testing manual (XSS protection verification)
- ✅ Dependencias backend requeridas

**Última actualización:** 6-Abr-2026

---

#### [ARCHITECTURE_DIFF.md](./ARCHITECTURE_DIFF.md) - 🔍 DIFF VISUAL
**Para qué:** Diff detallado de código mostrando ANTES/DESPUÉS  
**Cuándo usarlo:**
- Necesitas ver exactamente QUÉ código cambió
- Quieres entender la refactorización línea por línea
- Requieres argumentar cambios a team review

**Contiene:**
- ✅ Diff completo de 3 archivos refactorizados
- ✅ Explicación de cada cambio
- ✅ Estadísticas: -35 líneas, -32% complejidad
- ✅ Flujo comparativo ANTES vs DESPUÉS
- ✅ Verificación visual en DevTools

**Última actualización:** 6-Abr-2026

---

#### [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - ✅ ESTADO FINAL
**Para qué:** Confirmación de que implementación frontend está COMPLETA y SEGURA  
**Cuándo usarlo:**
- Necesitas confirmar que frontend está listo
- Requieres checklist de validación
- Buscas próximos pasos (backend)

**Contiene:**
- ✅ Cambios realizados (3 archivos, 100% completos)
- ✅ Resultados (código/seguridad/impacto)
- ✅ Documentación creada
- ✅ Verificación realizada (0 errores TypeScript)
- ✅ Próximos pasos claramente marcados

**Estado:** ✅ Frontend COMPLETADO | ⏳ Backend PENDIENTE

---

## 🗂️ Cuando Usar Cada Documento

### Escenario 1: "Soy nuevo en el proyecto"
1. Lee [AGENT.md](./AGENT.md) (5 min) — Overview general
2. Lee [SKILL.md](./SKILL.md) (15 min) — Stack técnico detallado
3. Explora `/src` estructura real

### Escenario 2: "Login falla; me da 404"
1. Abre DevTools, confirma error en `/api/v1/accounts/users/me/`
2. Lee [FRONTEND_TROUBLESHOOTING.md#error-404-al-hacer-login](./FRONTEND_TROUBLESHOOTING.md#-error-404-al-hacer-login-la-cuenta-no-existe) (10 min)
3. Verifica backend con [BACKEND_TROUBLESHOOTING.md#verificacion-de-backend](./BACKEND_TROUBLESHOOTING.md#-error-404-en-apiv1accountsusersmecrítico)

### Escenario 3: "Backend cambió, necesito actualizar rutas"
1. Revisa [SKILL.md — Endpoints](./SKILL.md#%EF%B8%8F-endpoints-de-api)
2. Busca endpoint en `/api/v1/{domain}`
3. Actualiza en services/components
4. Test con [BACKEND_TROUBLESHOOTING.md — Testing](./BACKEND_TROUBLESHOOTING.md#-testing-backend-endpoints)

### Escenario 4: "Queremos implementar Pusher para real-time"
1. Lee [PUSHER_EVENTS_CONTEXT.md](./PUSHER_EVENTS_CONTEXT.md)
2. Entiende eventos disponibles
3. Implementa en componentes Vue

### Escenario 5: "Hay un bug; no sé por dónde empezar"
1. Identifica: ¿Es frontend o backend?
   - Frontend (Vue/TypeScript) → [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md)
   - Backend (Django) → [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md)
2. Busca tu síntoma específico
3. Sigue los pasos de fix

### Escenario 6: "Necesito auditar seguridad de autenticación"
1. Lee [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md) ⚠️ CRÍTICO
2. Entiende vulnerabilidad actual (localStorage + XSS)
3. Revisa plan de implementación (HttpOnly cookies)
4. Coordina con backend para implementación por fases

---

## 📄 Checklist para Agentes IA

Cuando invoques un agente IA para trabajar en Nurax, proporciona:

- [ ] Lee [AGENT.md](./AGENT.md) — Contexto del proyecto y últimas sesiones
- [ ] Accede [SKILL.md](./SKILL.md) — Endpoints y estructura técnica
- [ ] Revisa [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md) — Posibles vulnerabilidades de seguridad
- [ ] Revisa [PROJECT_STATUS.md](./PROJECT_STATUS.md) — Qué está hecho/por hacer
- [ ] Consulta troubleshooting si hay error:
  - Si es API 404: [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md)
  - Si es frontend error: [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md)

---

## 🔄 Cómo Mantener Estos Docs Actualizados

**Importante:** Cuando hagas cambios significativos, actualiza los docs correspondientes:

| Si cambias... | Actualiza... |
|---|---|
| Add/remove endpoint API | [SKILL.md](./SKILL.md#%EF%B8%8F-endpoints-de-api), [FRONTEND_PRODUCTS_API_GUIDE.md](./FRONTEND_PRODUCTS_API_GUIDE.md) |
| Fix un bug importante | [PROJECT_STATUS.md](./PROJECT_STATUS.md#-bugs-conocidos), [troubleshooting correspondiente] |
| Cambias stack o estructura | [SKILL.md](./SKILL.md), [AGENT.md](./AGENT.md) |
| Implementas feature nueva | [PROJECT_STATUS.md](./PROJECT_STATUS.md#-features-por-prioridad) |
| Cambias autenticación/JWT | [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md) |
| Descubres issue común | Crea/actualiza en [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md) o [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md) |

---

## 🎯 Quick Links

- 🎨 **Design System:** [SKILL.md — Diseño & Paleta](./SKILL.md#%EF%B8%8F-dise%C3%B1o--paleta)
- 📦 **Componentes:** [SKILL.md — Componentes más usados](./SKILL.md#-componentes-más-usados)
- 🔐 **Auth:** [FRONTEND_TROUBLESHOOTING.md — Authentication](./FRONTEND_TROUBLESHOOTING.md#--authentication-errors)
- �️ **Seguridad JWT:** [AUTH_SECURITY_BEST_PRACTICES.md](./AUTH_SECURITY_BEST_PRACTICES.md) ⚠️ **CRÍTICO - localStorage es vulnerable**- 💻 **Refactorización Frontend:** [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md) ✅ **COMPLETADO 6-Abr**
- 🔍 **Diff de Cambios:** [ARCHITECTURE_DIFF.md](./ARCHITECTURE_DIFF.md)
- 📊 **Resumen Ejecutivo:** [SUMMARY_EXECUTIVE.md](./SUMMARY_EXECUTIVE.md)- �🛠️ **API:** [SKILL.md — Endpoints](./SKILL.md#%EF%B8%8F-endpoints-de-api)
- 🐛 **404 Fix:** [BACKEND_TROUBLESHOOTING.md — Error 404](./BACKEND_TROUBLESHOOTING.md#-error-404-en-apiv1accountsusersmecrítico)
- 📊 **Estado:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 📞 Soporte

Si un documento no responde tu pregunta:
1. Usa `grep` para buscar en archivos: `grep -r "tu-pregunta" docs/skills/`
2. Revisa el historial de commits para cambios recientes
3. Consulta el docstring de componentes en VSCode (Copilot: "Explain this component")

