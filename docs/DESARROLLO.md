# Desarrollo

Guia corta para trabajar en `nurax_inventario` sin perseguir documentos viejos.

## Requisitos

- Node.js compatible con Vite 7.
- npm.
- Backend de Nurax disponible en la URL configurada.

## Instalacion y comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` ejecuta `vue-tsc -b` y luego `vite build`.

## Entorno

Variables soportadas:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_URL=http://localhost:8000/api
VITE_PUSHER_APP_KEY=
VITE_PUSHER_APP_CLUSTER=
```

`VITE_API_BASE_URL` tiene prioridad sobre `VITE_API_URL`.

## Convenciones de codigo

- Usar alias `@` para imports desde `src`.
- Mantener llamadas HTTP en `src/services` cuando sean de dominio reusable.
- Stores Pinia para estado compartido entre vistas.
- Composables para logica reusable sin acoplarla a la UI.
- Componentes base en `src/components/ui`.
- Vistas ruteadas en `src/views`.
- Usar `DashboardLayout` en pantallas internas.

## Autenticacion

- No guardar tokens en `localStorage`.
- El backend maneja cookies HttpOnly.
- Todas las peticiones del `apiClient` usan `credentials: 'include'`.
- Ante cambios de auth, revisar `src/services/api.ts`,
  `src/services/auth.service.ts`, `src/composables/useAuth.ts` y router guard.

## Design system

Tokens base en `src/style.css`:

- Brand: `#e6ab17`.
- Texto principal: `#1f2937`.
- Verde/sidebar legacy: `#06402b`.
- Bordes: `#e5e7eb`.

Antes de crear un control nuevo, revisar si existe en `src/components/ui`.

## Checklist antes de cerrar una tarea

1. `rg` para encontrar usos relacionados.
2. Actualizar docs solo si cambia arquitectura, contrato API, setup o flujo UI.
3. Correr `npm run build`.
4. Revisar que no queden referencias a docs eliminados.
5. No agregar credenciales ni bitacoras de sesion en Markdown.

## Documentacion

La documentacion activa se limita a:

- `docs/README.md`
- `docs/ARQUITECTURA_FINAL.md`
- `docs/API_Y_SERVICIOS.md`
- `docs/FLUJOS_UI.md`
- `docs/DESARROLLO.md`

La carpeta `docs/skills` fue retirada por exceso de documentos duplicados y
obsoletos. No debe recrearse como deposito de notas.

