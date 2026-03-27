# 📚 Documentación — Nurax Inventario

Índice de documentación del proyecto frontend Nurax Inventario. Estos archivos contienen información esencial para entender la arquitectura, estado y APIs del sistema.

---

## 📂 Contenido

### **Skills (Guías para Agentes AI)**

Estos documentos contienen contexto de referencia rápida para agentes AI y desarrolladores.

| Documento | Descripción |
|-----------|-----------|
| [SKILL.md](./skills/SKILL.md) | **Contexto general del proyecto**. Stack tecnológico, estructura de `/src`, rutas, endpoints, componentes reutilizables y reglas importantes. **Leer primero.** |
| [PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) | **Estado del proyecto frontend**. Features completadas, bugs conocidos, roadmap y preguntas para precisar especificaciones. Actualizar cada sesión. |
| [PUSHER_EVENTS_CONTEXT.md](./skills/PUSHER_EVENTS_CONTEXT.md) | **Eventos Pusher en tiempo real**. Estructura de payloads, canales, ejemplos de sincronización multi-ventana y requisitos del frontend. |
| [FRONTEND_PRODUCTS_API_GUIDE.md](./skills/FRONTEND_PRODUCTS_API_GUIDE.md) | **Guía API Productos**. Paginación, filtros, búsqueda, parámetros query y ejemplos prácticos de consumo. |

---

## 🎯 Por Dónde Empezar

1. **Eres un agente AI nuevamente ejecutando tareas:**
   - Lee [SKILL.md](./skills/SKILL.md) primero (5 min)
   - Consulta [PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) para contexto de cambios recientes
   - Accede a [PUSHER_EVENTS_CONTEXT.md](./skills/PUSHER_EVENTS_CONTEXT.md) o [FRONTEND_PRODUCTS_API_GUIDE.md](./skills/FRONTEND_PRODUCTS_API_GUIDE.md) según la tarea

2. **Eres un desarrollador nuevo en el proyecto:**
   - Lee [SKILL.md](./skills/SKILL.md) completamente
   - Revisa [PROJECT_STATUS.md](./skills/PROJECT_STATUS.md) para saber qué está completado y qué no
   - Consulta archivos específicos según tu tarea

3. **Necesitas información sobre una API o evento específico:**
   - Para productos (GET/POST/PATCH): [FRONTEND_PRODUCTS_API_GUIDE.md](./skills/FRONTEND_PRODUCTS_API_GUIDE.md)
   - Para eventos Pusher: [PUSHER_EVENTS_CONTEXT.md](./skills/PUSHER_EVENTS_CONTEXT.md)
   - Para componentes, servicios, stores: [SKILL.md](./skills/SKILL.md)

---

## 🔄 Cadencia de Actualización

| Documento | Frecuencia | Responsable |
|-----------|-----------|-------------|
| SKILL.md | Cuando hay cambios arquitectónicos | Desarrollador |
| PROJECT_STATUS.md | **Fin de cada sesión de desarrollo** | Desarrollador |
| PUSHER_EVENTS_CONTEXT.md | Cuando se agregan/modifican eventos | Backend |
| FRONTEND_PRODUCTS_API_GUIDE.md | Cuando endpoint `/api/products/` cambia | Backend |

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
