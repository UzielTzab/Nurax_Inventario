---
name: skills-index
description: >
  Índice y guía de cuándo usar cada documento de skills.
---

# 📚 Skills Documentation Index

> Referencia central de toda la documentación de Nurax Inventario.
> Última actualización: **30 de Marzo 2026**

---

## 🗺️ Mapa de Documentos

### 🎓 Onboarding & Context (Empezar por aquí)

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

**Última actualización:** 30-Mar-2026 (endpoints ahora con `/api/v1/`)

---

#### [AGENT.md](./AGENT.md)
**Para qué:** Context rápido para agentes IA (Copilot, Claude, etc.)  
**Cuándo usarlo:**
- Cuando invocas un agente IA
- Necesitas describirle el proyecto rápidamente
- Requieres entender la arquitectura B/F

**Contiene:**
- ✅ Overview del proyecto
- ✅ **🚨 CRÍTICO:** Explicación del bug de routing backend + fix (30-Mar-2026)
- ✅ Documentación creada/actualizada
- ✅ Stack principal resumido
- ✅ Git workflow y convenciones

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

---

## 📄 Checklist para Agentes IA

Cuando invoques un agente IA para trabajar en Nurax, proporciona:

- [ ] Lee [AGENT.md](./AGENT.md) — Contexto del proyecto y últimas sesiones
- [ ] Accede [SKILL.md](./SKILL.md) — Endpoints y estructura técnica
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
| Descubres issue común | Crea/actualiza en [FRONTEND_TROUBLESHOOTING.md](./FRONTEND_TROUBLESHOOTING.md) o [BACKEND_TROUBLESHOOTING.md](./BACKEND_TROUBLESHOOTING.md) |

---

## 🎯 Quick Links

- 🎨 **Design System:** [SKILL.md — Diseño & Paleta](./SKILL.md#%EF%B8%8F-dise%C3%B1o--paleta)
- 📦 **Componentes:** [SKILL.md — Componentes más usados](./SKILL.md#-componentes-más-usados)
- 🔐 **Auth:** [FRONTEND_TROUBLESHOOTING.md — Authentication](./FRONTEND_TROUBLESHOOTING.md#--authentication-errors)
- 🛠️ **API:** [SKILL.md — Endpoints](./SKILL.md#%EF%B8%8F-endpoints-de-api)
- 🐛 **404 Fix:** [BACKEND_TROUBLESHOOTING.md — Error 404](./BACKEND_TROUBLESHOOTING.md#-error-404-en-apiv1accountsusersmecrítico)
- 📊 **Estado:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 📞 Soporte

Si un documento no responde tu pregunta:
1. Usa `grep` para buscar en archivos: `grep -r "tu-pregunta" docs/skills/`
2. Revisa el historial de commits para cambios recientes
3. Consulta el docstring de componentes en VSCode (Copilot: "Explain this component")

