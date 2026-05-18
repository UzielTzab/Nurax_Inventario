# API y servicios

Este documento resume los contratos HTTP que el frontend consume hoy. La fuente
de verdad sigue siendo `src/services/*`, stores y componentes que llaman
`apiClient` directamente.

## Cliente HTTP

Archivo: `src/services/api.ts`.

- Base URL: `VITE_API_BASE_URL || VITE_API_URL || http://localhost:8000/api`.
- Usa `credentials: 'include'` para enviar cookies HttpOnly.
- JSON por defecto con `Content-Type: application/json`.
- Si el body es `FormData`, elimina `Content-Type` para que el navegador agregue
  el boundary.
- Ante `401`, intenta `POST /auth/refresh/` y reintenta la peticion.

## Auth y usuario

Archivo: `src/services/auth.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Login | `POST /auth/login/` |
| Perfil actual | `GET /v1/accounts/users/me/` |
| Actualizar avatar/perfil | `PATCH /v1/accounts/users/me/` |
| Registro | `POST /v1/accounts/users/register/` |
| Logout | `POST /auth/logout/` |
| Verificar cookie | `POST /auth/verify/` |
| Cambiar contrasena | `PATCH /v1/accounts/users/change-password/` |

## Productos, categorias e inventario

Archivo: `src/services/products.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Listar productos | `GET /v1/products/products/` |
| Producto por id | `GET /v1/products/products/{id}/` |
| Crear producto | `POST /v1/products/products/` |
| Actualizar producto | `PUT /v1/products/products/{id}/` |
| Patch producto | `PATCH /v1/products/products/{id}/` |
| Eliminar producto | `DELETE /v1/products/products/{id}/` |
| Movimientos inventario | `POST /v1/inventory/transactions/` |
| Kardex por producto | `GET /v1/inventory/transactions/?product={id}` |
| Movimientos de producto | `GET /v1/products/products/{id}/movements/` |
| Categorias | `GET /v1/products/categories/` |
| Crear categoria | `POST /v1/products/categories/` |

Filtros de productos activos:

- `page`
- `page_size`
- `search`
- `category`
- `supplier`
- `sku`
- `stock_status`
- `min_price`
- `max_price`
- `ordering`

`product.store.ts` tambien llama:

- `GET /v1/accounts/stores/` para resolver tienda activa si no viene en perfil.
- `POST /v1/products/codes/` para codigos de producto.
- `POST /v1/products/packagings/` para empaques.
- `POST /v1/products/products/bulk_delete/` para borrado masivo con fallback a
  borrado individual.

## Proveedores

Archivo: `src/services/suppliers.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Listar proveedores | `GET /v1/products/suppliers/` |
| Proveedor por id | `GET /v1/products/suppliers/{id}/` |
| Crear proveedor | `POST /v1/products/suppliers/` |
| Actualizar proveedor | `PUT /v1/products/suppliers/{id}/` |
| Eliminar proveedor | `DELETE /v1/products/suppliers/{id}/` |

En `PUT`, el frontend agrega `store` cuando tiene `storeId` porque el backend lo
requiere.

## Ventas y cuentas por cobrar

Archivo: `src/services/sales.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Historial de ventas | `GET /v1/sales/sales/?page={n}&page_size={n}` |
| Cuentas por cobrar | `GET /v1/sales/sales/accounts_receivable/?page={n}&page_size={n}&include_completed=true` |
| Venta por id | `GET /v1/sales/sales/{id}/` |
| Crear venta | `POST /v1/sales/sales/` |
| Cancelar venta | `POST /v1/sales/sales/{id}/cancel/` |
| Registrar pago | `POST /v1/sales/payments/` |
| Pagos de venta | `GET /v1/sales/sales/{id}/payments/` |

`sales.store.ts` resuelve tienda activa con `GET /v1/accounts/stores/` cuando
el perfil no trae `store_profile.id`.

Contrato actual de `Sale`:

- `id`: UUID tecnico de backend (se mantiene para operaciones y URLs).
- `sale_number`: correlativo incremental por tienda para mostrar en UI como
  `ID Venta` (`#1`, `#2`, ...).

## Carritos POS

Archivo principal: `src/components/SalesModal.vue`.

| Accion | Metodo y ruta |
| --- | --- |
| Carrito activo | `GET /v1/carts/carts/my-cart/` |
| Apartar carrito | `POST /v1/carts/carts/{id}/park/` |
| Carritos apartados | `GET /v1/carts/carts/parked/` |
| Descartar carrito | `DELETE /v1/carts/carts/{id}/` |
| Restaurar carrito | `POST /v1/carts/carts/{id}/restore/` |
| Sincronizar carrito | `POST /v1/carts/carts/sync-cart/` |
| Auth Pusher | `POST /pusher/auth/` |

## Caja y gastos

Archivos: `src/services/shifts.service.ts`, `src/services/expenses.service.ts`,
`src/views/Shifts.vue`.

| Accion | Metodo y ruta |
| --- | --- |
| Listar turnos | `GET /v1/expenses/cash-shifts/` |
| Turno por id | `GET /v1/expenses/cash-shifts/{id}/` |
| Abrir turno | `POST /v1/expenses/cash-shifts/` |
| Cerrar turno | `POST /v1/expenses/cash-shifts/{id}/close/` |
| Movimiento de caja | `POST /v1/expenses/cash-movements/` |
| Listar gastos | `GET /v1/expenses/expenses/` |
| Gasto por id | `GET /v1/expenses/expenses/{id}/` |
| Crear gasto | `POST /v1/expenses/expenses/` |
| Actualizar gasto | `PATCH /v1/expenses/expenses/{id}/` |
| Eliminar gasto | `DELETE /v1/expenses/expenses/{id}/` |

Los gastos usan `FormData` si hay `receipt_file`.

## Settings de tienda

Archivo: `src/services/store-settings.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Cargar datos de tienda | `GET /v1/accounts/users/me/` |
| Actualizar tienda | `PATCH /v1/accounts/stores/{storeId}/` |

El servicio normaliza `store_profile` a `StoreSettings` y conserva `storeId` en
memoria.

## Onboarding

Archivo: `src/services/onboarding.service.ts`.

| Accion | Metodo y ruta |
| --- | --- |
| Onboarding legacy | `POST /v1/accounts/store-profiles/onboarding-complete/` |
| Wizard actual | `POST /v1/onboarding/wizard/` |

El wizard envia tienda, configuracion inicial y proveedor inicial opcional.

## Administracion de clientes

Archivo: `src/views/AdminClients.vue`.

| Accion | Metodo y ruta |
| --- | --- |
| Listar clientes software | `GET /v1/accounts/users/software-clients/` |
| Activar/desactivar cliente | `PATCH /v1/accounts/users/software-clients/{id}/toggle-active/` |
| Eliminar cliente | `DELETE /v1/accounts/users/software-clients/{id}/` |
| Crear tienda con owner | `POST /v1/accounts/stores/create-with-owner/` |

La vista protege al admin actual para no desactivarse ni eliminarse desde la UI.

## Equipo de tienda

Archivo: `src/views/Team.vue`.

| Accion | Metodo y ruta |
| --- | --- |
| Listar empleados | `GET /v1/stores/{storeId}/employees/` |
| Crear empleado | `POST /v1/stores/{storeId}/employees/` |
| Actualizar empleado | `PATCH /v1/stores/{storeId}/employees/{employeeId}/` |
| Suspender/reactivar empleado | `PATCH /v1/stores/{storeId}/employees/{employeeId}/` |
| Resetear contrasena | `POST /v1/stores/{storeId}/employees/{employeeId}/reset-password/` |

## Reglas al cambiar endpoints

1. Buscar el endpoint en `src/services`, stores y componentes con `rg "ruta" src`.
2. Cambiar el contrato en el servicio mas cercano al dominio.
3. Si un componente llama `apiClient` directo, decidir si conviene moverlo a un
   service antes de aumentar la duplicacion.
4. Actualizar este documento en la misma tarea.
5. Correr `npm run build`.
