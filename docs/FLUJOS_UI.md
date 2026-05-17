# Flujos UI

Resumen de las pantallas y comportamientos visibles del frontend real.

## Login

Archivo: `src/views/Login.vue`.

- Ruta publica: `/`.
- Valida correo o username con Zod.
- Usa `useAuth().login()`.
- Redirige `admin` a `/dashboard/clients`.
- Redirige el resto a `/dashboard/inventory`.
- Muestra errores humanizados para credenciales, cuenta inactiva, rate limit o
  problemas de red.

## Onboarding

Archivos:

- `src/components/onboarding/OnboardingWizard.vue`
- `src/stores/onboarding.store.ts`
- `src/services/onboarding.service.ts`

El router manda al owner cliente sin setup a `/dashboard/onboarding`. El wizard
recopila datos de tienda, nicho, caja inicial y proveedor inicial opcional, y
envia `POST /v1/onboarding/wizard/`.

## Dashboard

Archivo: `src/components/layout/DashboardLayout.vue`.

El layout rodea todas las vistas ruteadas del dashboard. Contiene:

- Sidebar.
- Topbar.
- Perfil de usuario.
- Modal de editar perfil.
- Cambio de contrasena visible dentro del modal de perfil.
- Acciones POS.
- QR para emparejar scanner.
- Modal global de venta.
- Snackbar global mediante `SnackbarContainer`.

## Inventario

Archivo: `src/views/Inventory.vue`.

Flujo principal:

1. Carga productos paginados con `useProducts()`.
2. Carga categorias y proveedores.
3. Muestra filtros integrados en `ProductTable`.
4. Permite crear, editar, ver detalle, eliminar, borrar multiples productos,
   importar Excel y hacer ajustes de stock.
5. Usa modales/drawers: `AddProductModal`, `ProductDetailDrawer`,
   `RestockModal`, `ConfirmationModal`.
6. Reacciona a ventas completadas mediante `salesStore.lastCompletedSaleTimestamp`.

Pantalla viva: `Inventory.vue`. `Products.vue` existe pero no esta en el router.

## Punto de venta

Archivo: `src/components/SalesModal.vue`.

Capacidades actuales:

- Busqueda y seleccion de productos.
- Carrito editable.
- Scanner simple y continuo.
- Apertura de caja si no hay turno.
- Venta de contado, credito/apartado segun la UI.
- Pago y cambio.
- Ticket de venta y modal de exito.
- Revertir venta hacia carrito.
- Apartar, restaurar y descartar carritos.
- Sincronizacion Pusher con otros dispositivos.

Atajos relevantes implementados en el modal:

- `F2`: enfocar busqueda.
- `F4` o espacio sobre `document.body`: iniciar checkout si hay carrito.

## Historial de ventas

Archivo: `src/views/SalesHistory.vue`.

Usa `sales.store.ts` para listar ventas paginadas, buscar, abrir detalle y
cancelar ventas con confirmacion.

## Cuentas por cobrar

Archivo: `src/views/AccountsReceivable.vue`.

Usa `fetchReceivables()` con `include_completed=true`. Permite revisar deudas,
crear adeudos manuales y registrar abonos segun el flujo disponible en la vista.

## Caja

Archivo: `src/views/Shifts.vue`.

Capacidades:

- Ver turno abierto.
- Abrir turno con efectivo inicial.
- Registrar entradas/salidas de caja.
- Cerrar turno con efectivo esperado y real.
- Ver historial paginado.

`SalesModal.vue` bloquea checkout si no hay turno abierto.

## Gastos

Archivo: `src/views/Expenses.vue`.

Maneja alta y listado de gastos. Las categorias vivas son:

- `servicios`
- `nomina`
- `proveedores`
- `varios`

Soporta comprobante por archivo mediante `receipt_file`.

## Proveedores

Archivo: `src/views/Suppliers.vue`.

Usa `useSuppliers()` y componentes:

- `AddSupplierModal`
- `SupplierDetailDrawer`
- `WhatsAppIcon`

Permite listar, crear, editar, eliminar y contactar proveedores.

## Settings

Archivo: `src/views/Settings.vue`.

Maneja datos de tienda con `useStoreSettings()`, campos de ticket/logo/direccion
y valores visibles de configuracion. Carga skeletons mientras espera backend.

## Equipo

Archivo: `src/views/Team.vue`.

Disponible solo para `propietario`. Permite:

- Listar empleados de la tienda.
- Crear empleado `cashier` o `manager`.
- Editar nombre/rol.
- Suspender o reactivar acceso.
- Resetear contrasena.
- Copiar credenciales generadas.
- Respetar limite de empleados segun plan.

## Administracion de clientes

Archivo: `src/views/AdminClients.vue`.

Disponible solo para `admin`. Permite:

- Listar clientes software con filtros y paginacion.
- Crear tienda con owner.
- Copiar mensaje de bienvenida con credenciales generadas.
- Activar/desactivar clientes.
- Eliminar clientes.
- Bloquear autodesactivacion o autoeliminacion del admin actual desde la UI.

## Perfil

Archivo: `src/components/layout/DashboardLayout.vue`.

El menu de perfil abre el modal de edicion. El modal actual agrupa:

- Datos del usuario.
- Avatar.
- Seguridad con cambio de contrasena visible en la misma pantalla.

La intencion UX vigente es evitar que el usuario tenga que descubrir un
desplegable para cambiar contrasena.

