# 📚 Documentación — Nurax Inventario

Índice de documentación del proyecto frontend Nurax Inventario. Estos archivos contienen información esencial para entender la arquitectura, estado y APIs del sistema.

---

## 📂 Contenido

### **Skills (Guías para Agentes AI & Desarrolladores)**

Estos documentos contienen contexto de referencia rápida.

#### 🎓 Onboarding & Context
| Documento | Descripción |
|-----------|-----------|
| [skills/README.md](./skills/README.md) | **ÍNDICE CENTRAL**. Mapa de todos los docs — cuándo usar cada uno. **Empieza aquí.** |
| [skills/SKILL.md](./skills/SKILL.md) | **Stack técnico completo**. Vue 3, TypeScript, endpoints `/api/v1/`, componentes, design system. |
| [skills/AGENT.md](./skills/AGENT.md) | **Context para agentes IA**. Stack, arquitectura, **🚨 bug fix 30-Mar-2026**, git workflow. |

#### 🔧 Troubleshooting
| Documento | Descripción |
|-----------|-----------|
| [skills/BACKEND_TROUBLESHOOTING.md](./skills/BACKEND_TROUBLESHOOTING.md) | **Errores Django backend**. 404 en `/api/v1/`, migrations, auth, debugging. ← **Nuevo 30-Mar** |
| [skills/FRONTEND_TROUBLESHOOTING.md](./skills/FRONTEND_TROUBLESHOOTING.md) | **Errores Vue frontend**. 404 login, CORS, fonts, estado Pinia. ← **Nuevo 30-Mar** |

#### 📊 Project Tracking
| Documento | Descripción |
|-----------|-----------|
| [skills/PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) | **Estado + bugs + roadmap**. Features completadas, cambios recientes, bugs conocidos. Actualizar cada sesión. |

#### 📡 API & Real-time
| Documento | Descripción |
|-----------|-----------|
| [skills/FRONTEND_PRODUCTS_API_GUIDE.md](./skills/FRONTEND_PRODUCTS_API_GUIDE.md) | **Guía API Productos**. Endpoint `/api/v1/products/products/`, paginación, filtros, búsqueda. |
| [skills/PUSHER_EVENTS_CONTEXT.md](./skills/PUSHER_EVENTS_CONTEXT.md) | **Eventos Pusher real-time**. Estructura payloads, canales, sincronización multi-ventana. |

---

## 🎯 Por Dónde Empezar

### Caso 1: Eres un agente AI nuevo en el proyecto
1. Lee [skills/README.md](./skills/README.md) — **Índice y cuándo usar cada doc** (5 min)
2. Lee [skills/AGENT.md](./skills/AGENT.md) — **Context general + últimos cambios** (10 min)
3. Accede documentos específicos según tarea

### Caso 2: Hay un bug; necesito resolver
1. ¿Es error 404 en login? → [FRONTEND_TROUBLESHOOTING.md — Login](./skills/FRONTEND_TROUBLESHOOTING.md#-error-404-al-hacer-login-la-cuenta-no-existe)
2. ¿Es error Django? → [BACKEND_TROUBLESHOOTING.md](./skills/BACKEND_TROUBLESHOOTING.md)
3. ¿Es problema con componentes? → [SKILL.md — Componentes](./skills/SKILL.md#-componentes-más-usados)

### Caso 3: Eres un desarrollador nuevo
1. Lee [SKILL.md](./skills/SKILL.md) completamente (20 min)
2. Revisa [PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) — estado actual (15 min)
3. Consulta troubleshooting si encuentras problemas

### Caso 4: Cambió la API; necesito actualizar rutas
1. Revisa [SKILL.md — Endpoints](./skills/SKILL.md#%EF%B8%8F-endpoints-de-api) — rutas actuales con `/api/v1/`
2. Actualiza en servicios/componentes
3. Test con [BACKEND_TROUBLESHOOTING.md — Testing](./skills/BACKEND_TROUBLESHOOTING.md#-testing-backend-endpoints)

---

## 🚨 Cambios Recientes — Sesión 30 Marzo 2026

### Bug Crítico Fixed: 404 en Login
**Problema:** Frontend no podía conectar a `/api/v1/accounts/users/me/` → 404  
**Causa:** Backend URLs no registraban prefijo `/v1/` correctamente  
**Solución:** Actualizado `nurax_backend/urls.py` + reorganizado `api/urls.py`  

**Documentación:**
- [BACKEND_TROUBLESHOOTING.md — Análisis completo](./skills/BACKEND_TROUBLESHOOTING.md#-error-404-en-apiv1accountsusersmecrítico)
- [FRONTEND_TROUBLESHOOTING.md — Síntoma & verificación](./skills/FRONTEND_TROUBLESHOOTING.md#-error-404-al-hacer-login-la-cuenta-no-existe)
- [PROJECT_STATUS.md — Historial de sesión](./skills/PROJECT_STATUS.md#-raíz-del-problema-identificada)

---

## 🔄 Cadencia de Actualización

| Documento | Frecuencia | Cuándo |
|-----------|-----------|--------|
| skills/README.md | Ad hoc | Nuevo documento o cambios estructura |
| SKILL.md | Cambios arquitectónicos | Cuando agregar/remover features |
| AGENT.md | Cada sesión importante | Bugs críticos, cambios paradigma |
| PROJECT_STATUS.md | **Fin de cada sesión** | Registrar avance + bugs encontrados |
| Troubleshooting docs | Ad hoc | Cuando se descubre bug común |
| PUSHER_EVENTS_CONTEXT.md | Cambios Pusher | Nuevo evento o payload |
| FRONTEND_PRODUCTS_API_GUIDE.md | Cambios endpoint | Backend modifica `/api/v1/products/` |

---

## 📌 Estructura del Proyecto

```
nurax_inventario/
├── docs/                    # 📚 Documentación
│   ├── README.md           # Este archivo (índice)
│   └── skills/             # Guías de referencia
│       ├── SKILL.md
│       ├── PROJECT_STATUS.md
│       ├── PUSHER_EVENTS_CONTEXT.md
│       └── FRONTEND_PRODUCTS_API_GUIDE.md
├── src/                    # 💻 Código fuente
│   ├── components/
│   ├── composables/
│   ├── services/
│   ├── stores/
│   ├── views/
│   └── ...
├── package.json
└── vite.config.ts
```

---

## ❓ ¿No encontraste lo que buscas?

- **Error o bug a reportar:** Crea un issue en GitHub
- **Pregunta sobre arquitectura:** Revisa [SKILL.md](./skills/SKILL.md) §Reglas Importantes
- **Pregunta sobre estado:** Consulta [PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) §❓ PREGUNTAS
- **Pregunta sobre API:** Busca en [FRONTEND_PRODUCTS_API_GUIDE.md](./skills/FRONTEND_PRODUCTS_API_GUIDE.md)
- **Pregunta sobre eventos:** Busca en [PUSHER_EVENTS_CONTEXT.md](./skills/PUSHER_EVENTS_CONTEXT.md)

---

**Última actualización:** 23 de Marzo 2026
