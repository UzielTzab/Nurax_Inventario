# Nurax Inventario Frontend

Frontend operativo de Nurax para inventario, ventas, caja, proveedores, gastos,
cuentas por cobrar, administracion de clientes y equipo de tienda.

Ultima auditoria de documentacion: 2026-05-17. La fuente de verdad es el codigo
en `src/`, no documentos historicos.

## Stack

- Vue 3 + TypeScript + Vite.
- Pinia para estado de productos, ventas, turnos, gastos y onboarding.
- Vue Router con guardias por sesion, rol y onboarding.
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- PWA con `vite-plugin-pwa`.
- Pusher para sincronizacion POS, inventario, ventas y carrito.
- API HTTP centralizada en `src/services/api.ts` con cookies HttpOnly.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Variables de entorno

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_URL=http://localhost:8000/api
VITE_PUSHER_APP_KEY=
VITE_PUSHER_APP_CLUSTER=
```

`VITE_API_BASE_URL` tiene prioridad. Si no existe, se usa `VITE_API_URL`; si
tampoco existe, el fallback es `http://localhost:8000/api`.

## Estructura viva

- `src/router/index.ts`: rutas y guardias de acceso.
- `src/services/`: contratos HTTP por dominio.
- `src/stores/`: estado Pinia compartido.
- `src/composables/`: logica reusable para auth, productos, categorias,
  proveedores, snackbars, settings y cambio de password.
- `src/views/`: pantallas ruteadas.
- `src/components/layout/`: shell del dashboard y sidebar.
- `src/components/ui/`: componentes base del design system.
- `public/images/` y `public/sounds/`: assets usados por login, PWA y POS.

## Documentacion

La documentacion activa esta compactada en `docs/`:

- [Indice](./docs/README.md)
- [Arquitectura Final](./docs/ARQUITECTURA_FINAL.md)
- [API y servicios](./docs/API_Y_SERVICIOS.md)
- [Flujos UI](./docs/FLUJOS_UI.md)
- [Desarrollo](./docs/DESARROLLO.md)
