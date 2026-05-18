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

## Protocolo obligatorio antes de codificar UI

Antes de crear o pegar UI nueva en una vista, hay que verificar reutilizacion.
Este paso es obligatorio para devs y agentes.

1. Buscar componentes base en `src/components/ui`:
   - `rg --files src/components/ui`
2. Buscar si ya existe un patron equivalente en el proyecto:
   - `rg "<AppButton|<AppInput|<AppSelect|<ConfirmationModal|<AppModal|<AppEmptyState|<Pagination|<Badge" src/views src/components -n`
3. Decidir con esta regla:
   - Si ya existe un componente que cubre >= 80% del caso, reutilizar.
   - Si faltan props menores, extender el componente existente.
   - Solo crear componente nuevo si el patron se repetira en 2 o mas pantallas.
4. Si se crea componente nuevo:
   - Debe vivir en `src/components/ui`.
   - Debe exportarse en `src/components/ui/index.ts`.
   - Debe usarse al menos en 1 vista del cambio actual (no dejarlo muerto).
5. Validar antes de cerrar:
   - `npx vue-tsc -b`
   - `npm run build` (cuando el entorno lo permita)

### Que no se debe hacer

- Duplicar modales, empty states, switches o toolbars sin revisar `ui/`.
- Dejar `<button>`, `<input>` o `<select>` sueltos si hay equivalente UI.
- Crear variantes locales con estilos inline que ya existen en componentes base.

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
