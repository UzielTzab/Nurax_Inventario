# Documentacion compacta - Nurax Inventario

Esta carpeta reemplaza los planes viejos, reportes de sesion y la carpeta
`docs/skills`. La regla es simple: menos archivos, mas verdad.

Ultima auditoria: 2026-05-17.

## Fuente de verdad

La documentacion se actualizo leyendo el proyecto real:

- `package.json`
- `vite.config.ts`
- `src/main.ts`
- `src/App.vue`
- `src/router/index.ts`
- `src/services/*`
- `src/stores/*`
- `src/composables/*`
- `src/views/*`
- `src/components/*`
- `src/style.css`

Si un documento contradice el codigo, gana el codigo y se corrige el documento.

## Documentos vivos

| Documento | Uso |
| --- | --- |
| [ARQUITECTURA_FINAL.md](./ARQUITECTURA_FINAL.md) | Como esta armado el frontend, rutas, estado, auth, PWA, Pusher y design system. |
| [API_Y_SERVICIOS.md](./API_Y_SERVICIOS.md) | Contratos HTTP consumidos por servicios, stores y componentes. |
| [FLUJOS_UI.md](./FLUJOS_UI.md) | Flujos principales de producto: login, onboarding, inventario, POS, caja, equipo y administracion. |
| [DESARROLLO.md](./DESARROLLO.md) | Setup local, comandos, variables de entorno, convenciones y checklist de cambio. |

## Que se elimino

Se eliminaron documentos que ya no debian ser la referencia diaria:

- Planes de refactor incompletos o ya ejecutados.
- Bitacoras de sesiones y resumenes ejecutivos duplicados.
- Documentos de `docs/skills` con rutas, bugs o estados historicos.
- Troubleshooting del backend dentro del repositorio frontend.
- Documentos con el nombre anterior de arquitectura; el nombre vigente es
  Arquitectura Final.

## Politica de mantenimiento

- No crear un MD por cada sesion.
- No recrear `docs/skills`.
- Si cambia un endpoint, actualizar [API_Y_SERVICIOS.md](./API_Y_SERVICIOS.md).
- Si cambia una ruta o guardia, actualizar [ARQUITECTURA_FINAL.md](./ARQUITECTURA_FINAL.md).
- Si cambia un flujo visible para el usuario, actualizar [FLUJOS_UI.md](./FLUJOS_UI.md).
- Si cambia setup, tooling o comandos, actualizar [DESARROLLO.md](./DESARROLLO.md).
- No guardar credenciales en documentacion.
