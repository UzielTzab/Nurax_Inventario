
```
Necesito que generes un archivo AGENT.md (o CLAUDE.md) para documentar este proyecto.
Este archivo será usado por IAs/Copilot para entender el contexto del repositorio.

**Información del proyecto:**
- **Nombre:** [Tu nombre del proyecto]
- **Descripción:** [Descripción breve: qué hace el proyecto, tecnología principal]
- **Tipo:** [Monorepo/Proyecto único/Workspace]
- **Stack principal:** [tecnologías principales: ej. Next.js 16 + React 19 + Django 4.2]

**Estructura del repositorio:**
[Incluye la salida de: `tree -L 3 -I 'node_modules|.git|dist|build'`
O usa: `Get-ChildItem -Recurse -Depth 3 | Select-Object FullName | Format-List` en PowerShell]

**Componentes/Módulos principales:**

[Para cada módulo principal, especifica:]
- Directorio: [ruta]
- Purpose: [Qué hace]
- Tecnologías: [Herramientas específicas]
- Archivos clave: [Archivos principales a mantener en mente]

**Ejemplo:**
- **Backend API**
  - Directorio: `api/v1/`
  - Purpose: REST/GraphQL API principal
  - Tecnologías: Node.js/Express o Django o FastAPI
  - Archivos clave: `api/v1/routes/`, `api/v1/models/`, `api/v1/middleware/`

**Cómo ejecutar/desarrollar:**

[Para cada part del proyecto:]
```bash
# [Descripción de la tarea]
[comando exacto]
```

**Puertos principales:**
- [Aplicación 1]: puerto [número]
- [Aplicación 2]: puerto [número]
- [Base datos/servicios]: puerto [número]

**Patrones clave del proyecto:**

[Lista los patrones más importantes, ej:]
- Sistema de autenticación: [cómo funciona]
- Manejo de estado frontend: [Redux/Context/Zustand/etc]
- Estructura de carpetas: [convención usada]
- Base de datos: [relational/document/relaciones clave]
- Roles y permisos: [cómo se implementan]

**Variables de entorno críticas:**

[Ejemplo:
```env
DATABASE_URL=postgresql://...
API_KEY=xxx
JWT_SECRET=xxx
FRONTEND_URL=http://localhost:3000
```]

**Credenciales de prueba / Seeding de datos:**

[Tabla con users/passwords para desarrollo]

**Convenciones de código:**

- Linting: [eslint/black/flake8]
- Formatting: [prettier/black]
- Type checking: [TypeScript/mypy/etc]
- Testing: [Jest/pytest/mocha]

**Estructura específica a recordar:**

[Características únicas del proyecto, ej:]
- La carpeta `utils/hooks/` debe importarse como `@hooks/`
- Las rutas de API siguen el patrón `src/app/api/[resource]/route.ts`
- El estado global se maneja en `src/store/` con Redux Toolkit
- Las llamadas a BD siempre usan el ORM [Django ORM/Prisma/SQLAlchemy]

**Archivos importantes para IA:**
- `package.json` - dependencias y scripts
- `[Backend] requirements.txt / pyproject.toml / package.json` - dependencias backend
- `tsconfig.json / .eslintrc` - configuración TS/linting
- `.env.example` - variables de entorno
- Archivos de configuración: `next.config.js`, `django settings.py`, etc.

**Notas especiales:**

[Cualquier quirk o contexto importante que el IA deba saber:
- Soft deletes están habilitados en Model X
- Las imágenes se guardan en S3
- El CORS está configurado de manera especial
- Hay un script particular que debe correr antes de commitear
- Etc.]

Basándote en esta información, genera un archivo AGENT.md estructurado similar a este modelo:
https://github.com/nativo-digital/b2b-platform-frontend/blob/main/CLAUDE.md

El archivo debe incluir:
1. **Project Overview** - descripción clara del proyecto
2. **Build & Development Commands** - comandos organizados por aplicación
3. **Architecture** - desglose de carpetas principales con propósito
4. **Key Technologies** - listado por backend/frontend/infrastructure
5. **Environment Configuration** - cómo se configura el proyecto
6. **Test Credentials** - tabla con usuarios de prueba
7. **Domain Context** - conceptos de negocio importantes
8. **Key Patterns/Convenciones** - cómo se hace X en este proyecto

Mantén el formato conciso, markdown bien formateado, y enfocado en información práctica.
```

---

## Cómo usar esta plantilla:

1. **Copia el prompt** arriba
2. **Llena los valores** entre `[CORCHETES]` con info de tu proyecto
3. **Pégalo en una nueva conversación** con Claude o Copilot
4. **Ajusta según necesites** - el resultado será un agent.md personalizado

## Tips:

- **Sé específico** con los comandos (incluye flags, rutas exactas)
- **Incluye comandos reales** que funcionan en tu proyecto
- **Secciona bien** - cada sección principal debe ser clara
- **Enfócate en lo práctico** - qué necesita saber la IA para trabajar
- **Incluye patrones únicos** de tu proyecto que diferencien tu arquitectura

---

## Variantes según tu caso:

**Si tienes un monorepo:**
```
Estructura del repositorio:
- /apps/backend - [descripción]
- /apps/frontend - [descripción]
- /apps/admin - [descripción]
- /packages/shared - [descripción]
```

**Si tienes microservicios:**
```
Servicios principales:
- /services/auth-service - [descripción]
- /services/payment-service - [descripción]
- /services/notification-service - [descripción]
```

**Si es un proyecto más simple:**
Reduce las secciones al mínimo viable pero mantén claridad.

