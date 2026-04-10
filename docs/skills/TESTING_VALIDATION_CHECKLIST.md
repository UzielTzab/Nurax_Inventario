# ✅ TESTING & VALIDATION CHECKLIST - Mejoras Inventario

**Fecha**: Abril 8, 2026  
**Propósito**: Verificar que cada feature esté correctamente implementado  
**Usuarios**: QA Team, Dev Lead

---

## 🎯 Matriz de Testing

### Nivel 1: FRONTEND (Visual & Interaction)

#### **KPI Cards**
- [ ] Tarjeta "Valor Inventario" visible para Propietario
- [ ] Tarjeta "Valor Inventario" visible para Gerente
- [ ] Tarjeta "Valor Inventario" **NO visible** para Cajero
- [ ] Tarjeta "Alertas Stock" muestra número correcto (stock < 5)
- [ ] Tarjeta "Alertas Stock" tiene badge rojo si hay alertas
- [ ] Click en "Alertas Stock" filtra tabla automáticamente
- [ ] Número de "Productos Activos" es correcto
- [ ] **Mobile**: Cards se apilan correctamente
- [ ] **Performance**: Las cards se calculan sin lag

#### **Tabla de Productos**
- [ ] Columna PRODUCTO muestra: Nombre + 2 Badges (Categoría | Proveedor)
- [ ] Badges tienen colores distintos (verde para categoría, azul para proveedor)
- [ ] Columna CÓDIGO muestra ícono QR + código principal
- [ ] Columna PRECIO muestra precio_venta en grande
- [ ] Columna PRECIO muestra "Costo: $X.XX" para Propietario/Gerente (SOLO)
- [ ] Columna PRECIO **NO muestra** costo para Cajero
- [ ] Columna STOCK muestra número + botones [ - ] [ + ]
- [ ] Columna EMPAQUE muestra tipo correcto (Unidad, Caja, etc)
- [ ] **Scroll**: Tabla horizontal en mobile sin romper layout
- [ ] **Performance**: Tabla con 100+ productos carga en < 2 seg

#### **Stock Inline Edit**
- [ ] Stock es editable con doble-clic
- [ ] Al doble-clic, aparece input editable
- [ ] Presionar ENTER guarda cambio
- [ ] Presionar ESC cancela edición
- [ ] Blur fuera del input también guarda
- [ ] Botón [ + ] incrementa stock en 1
- [ ] Botón [ - ] decrementa stock en 1
- [ ] Stock no puede ser negativo (min 0)
- [ ] **Toast**: Aparece "✓ Stock ajustado a X" después de guardar
- [ ] **Toast**: Aparece error si falla la API

#### **Botón Importar Excel**
- [ ] Botón "⬆️ Importar Excel" existe al lado de "+ Nuevo Producto"
- [ ] Click abre Modal
- [ ] Modal puede recibir archivos por drag-drop
- [ ] Modal puede recibir archivos con click
- [ ] Modal valida que Excel tenga columnas: Nombre, SKU, Categoría, Precio, Stock
- [ ] **Error**: Si columnas faltan, muestra mensaje claro
- [ ] Preview muestra primeros 5 productos
- [ ] Si hay > 5 productos, muestra "... y 245 más"
- [ ] Botón "Importar" deshabilitado si no hay preview
- [ ] Click "Importar" dispara POST y muestra loading
- [ ] **Success**: Toast de éxito después de importar
- [ ] **Tabla actualiza** automáticamente con nuevos productos

#### **Botón Vincular Escáner**
- [ ] Botón "📱" (celular) existe en Topbar
- [ ] Click abre Modal
- [ ] Modal muestra QR grande
- [ ] Modal muestra Session ID debajo del QR
- [ ] QR es legible (suficientemente grande, contraste bueno)
- [ ] **Mobile**: QR es visible y legible en móvil
- [ ] Botón "Listo" cierra el modal

#### **Filtros Avanzados**
- [ ] Botón "Ver filtros" despliega opciones
- [ ] Dropdown de CATEGORÍA muestra todas las categorías
- [ ] Dropdown de PROVEEDOR muestra todos los proveedores
- [ ] Seleccionar categoría filtra tabla en tiempo real
- [ ] Seleccionar proveedor filtra tabla en tiempo real
- [ ] Combinar ambos filtros funciona (AND logic)
- [ ] Botón "Limpiar Filtros" resetea todo

#### **RBAC - Sidebar**
- [ ] **Propietario**: Ve TODAS las opciones del menú
- [ ] **Gerente**: Ve Inventario, Ventas, Proveedores, Corte de Caja (NO Configuración)
- [ ] **Cajero**: Ve SOLO "Vender" + "Mi Corte de Caja"
- [ ] **Opción oculta**: No aparece en HTML/CSS (no solo display: none)
- [ ] **Topbar**: Botón "Vender" visible para TODOS los roles
- [ ] **Topbar**: Botón "Vincular Escáner" visible para TODOS los roles

#### **Topbar Global**
- [ ] Botón "🛒 Vender" siempre disponible (arriba derecha)
- [ ] Botón "📱 Vincular Escáner" al lado del botón Vender
- [ ] Estos botones funcionan desde CUALQUIER pantalla
- [ ] No hay duplicados de botón "Vender"

---

### Nivel 2: BACKEND (API & Data)

#### **Stock Adjustment Endpoint**
```bash
POST /api/v1/inventory/ajuste-stock/
```
- [ ] Endpoint existe y retorna 201
- [ ] Valida `producto_id` existe
- [ ] Valida `cantidad` es número
- [ ] Crea registro `MOVIMIENTO_INVENTARIO`
- [ ] Campo `tipo_ajuste` = "AJUSTE"
- [ ] Campo `motivo` se guarda
- [ ] Registra `usuario_id` del request
- [ ] Registra `fecha` actual
- [ ] Retorna objeto con: id, producto_id, cantidad, fecha, usuario
- [ ] Stock del producto se actualiza correctamente
- [ ] Si stock final sería negativo, rechaza (o permite según regla)

#### **Batch Import Endpoint**
```bash
POST /api/v1/products/batch-import/
```
- [ ] Endpoint existe y retorna 201
- [ ] Body es array de productos
- [ ] Valida cada producto tiene: nombre, sku, precio, stock
- [ ] Crea registros PRODUCTO correctamente
- [ ] Crea registros CODIGO_PRODUCTO (SKU como principal)
- [ ] Retorna: { creados: 500, errores: [] }
- [ ] Si hay errores, retorna línea y razón
- [ ] **Rollback**: Si error a mitad, ¿qué sucede? (all-or-nothing o parcial?)

#### **Session Creation Endpoint**
```bash
GET /api/v1/sessions/create/
```
- [ ] Endpoint existe y retorna 200
- [ ] Retorna `session_id` único
- [ ] `session_id` es diferente cada vez
- [ ] `session_id` es válido para Pusher
- [ ] Frontend puede usar ese session_id

#### **KPI Data**
- [ ] Productos tienen campo `costo_base`
- [ ] Productos tienen campo `stock_actual`
- [ ] Productos tienen campo `activo`
- [ ] Categoría está relacionada (FK)
- [ ] Proveedor está relacionado (FK)
- [ ] Cálculo de "Valor Inventario" es 100% preciso

---

### Nivel 3: INTEGRACIÓN (End-to-End)

#### **Flujo: Ajuste Rápido de Stock**
```
1. Usuario abre Inventario
2. Ve tabla con 100 productos
3. Doble-click en producto #50, stock dice 47
4. Aparece input, usuario borra y escribe 46
5. Presiona ENTER
6. Toast: "✓ Stock ajustado a 46"
7. POST /api/v1/inventory/ajuste-stock/ enviado
8. Backend crea MOVIMIENTO_INVENTARIO
9. Otro usuario en otra ventana recibe actualización Pusher
10. Tabla de otro usuario muestra "46"
```

✅ **Validar**:
- [ ] Toast aparece en < 1 segundo
- [ ] Movimiento se registra en BD
- [ ] Sincronización Pusher funciona
- [ ] Stock no puede ser negativo

#### **Flujo: Importar 500 Productos**
```
1. Usuario click en "Importar Excel"
2. Modal abre
3. Usuario arrastra archivo (500 productos)
4. Preview muestra primeros 5
5. Usuario click "Importar"
6. Loading spinner aparece
7. 2-5 segundos después: Toast "✓ 500 productos importados"
8. Tabla se actualiza (aparecen los 500 nuevos)
9. Búsqueda funciona en los nuevos productos
```

✅ **Validar**:
- [ ] No hay errores en console
- [ ] Base de datos tiene 500 productos nuevos
- [ ] Cada producto tiene categoría asignada
- [ ] Códigos (SKU) están todos creados
- [ ] Stock está correcto para cada uno

#### **Flujo: Propietario ve Costos, Cajero NO**
```
1. Propietario abre Inventario
2. Ve tabla con columa "PRECIO"
3. Debajo de cada precio ve: "Costo: $25.00"
4. Propietario cierra sesión

5. Cajero abre Inventario
6. Ve tabla con columna "PRECIO"
7. Solo ve "$45.99" (NO ve el costo)
```

✅ **Validar**:
- [ ] Información de costo NO se envía en API a Cajero
- [ ] O se envía pero Frontend no la renderiza
- [ ] Inspeccionar código fuente: HTML no tiene costo para Cajero

---

### Nivel 4: PERFORMANCE & EDGE CASES

#### **Performance**
- [ ] Tabla con 1000 productos carga correcto
- [ ] No hay lag al escribir en filtro de búsqueda
- [ ] Filtros se aplican en < 500ms
- [ ] Stock inline edit dispara <200ms
- [ ] Excel con 1000 rows se importa en < 10 seg
- [ ] Calculoss de KPI (valor inventario) < 500ms

#### **Edge Cases**
- [ ] Stock ajustado a 0 → producto sigue visible
- [ ] Stock ajustado a número muy grande (999999) → funciona
- [ ] Usuario intenta editar stock sin permiso → error 403
- [ ] Usuario importa Excel con columnas desordenadas → funciona igual
- [ ] Usuario importa Excel con acentos/caracteres raros → funciona
- [ ] Dos usuarios simultáneamente ajustan stock del mismo producto → OK
- [ ] Usuario desconecta a mitad de importación → ¿rollback?

#### **Mobile/Responsive**
- [ ] Tabla scrollea horizontalmente en mobile
- [ ] KPI cards se apilan en 1 columna en mobile
- [ ] Botones de stock son clickeables en mobile (no demasiado pequeños)
- [ ] Modal importar se adapta a pantalla chica
- [ ] QR es legible en pantalla 320px

---

### Nivel 5: SEGURIDAD (RBAC)

#### **Access Control**
- [ ] Cajero intenta acceder a `/settings` → redirige a `/dashboard`
- [ ] Gerente intenta crear cliente → error 403
- [ ] Propietario puede hacer todo ✓
- [ ] Endpoint de importar valida permisos
- [ ] JWT contiene `role` y se valida en backend

#### **Data Privacy**
- [ ] Cajero NO ve el campo `costo_base` en API
- [ ] Cajero NO puede filtrar/editar GASTOS
- [ ] Gerente NO puede ver sección de CONFIGURACIÓN
- [ ] Frontend respeta roles (no solo backend)

---

### Nivel 6: CROSS-BROWSER TESTING

- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Elementos críticos:**
- [ ] Tabla responsive
- [ ] Modales centrados
- [ ] QR legible
- [ ] Inputs editable inline

---

## 📊 Scorecard de Testing

### Por Feature

| Feature | Frontend | Backend | E2E | Performance | Security | Score |
|---------|----------|---------|-----|-------------|----------|-------|
| **KPI Cards** | ✅ | ✅ | ✅ | ✅ | ✅ | 5/5 |
| **Tabla Enriquecida** | 🟡 | ✅ | ✅ | ✅ | ✅ | 4/5 |
| **Stock Inline** | ✅ | 🟡 | ✅ | ✅ | 🟡 | 4/5 |
| **Importar Excel** | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | 3/5 |
| **Escáner QR** | 🟡 | ✅ | 🟡 | ✅ | ✅ | 4/5 |
| **RBAC Sidebar** | ✅ | ✅ | ✅ | ✅ | ✅ | 5/5 |
| **Filters** | 🟡 | ✅ | ✅ | 🟡 | ✅ | 4/5 |

Leyenda: ✅ = Pass, 🟡 = Partial, ❌ = Fail

---

## 🚀 Go/No-Go Criteria

### ✅ GREEN LIGHT (Deploy to Production)
- [ ] Todos los tests de Nivel 1-3 en ✅
- [ ] Performance dentro de targets
- [ ] Security audit: 0 issues críticos
- [ ] Mobile tested en iOS & Android
- [ ] 2 navegadores testeados

### 🟡 YELLOW LIGHT (Conditional)
- [ ] Máx 2 features con issues menores
- [ ] Ningun issue crítico de seguridad
- [ ] Performance dentro de 80% target
- [ ] Recomendación: Hotfix post-deploy

### ❌ RED LIGHT (Hold)
- [ ] > 2 features con issues
- [ ] Algún issue crítico de seguridad
- [ ] Performance < 60% target
- [ ] Recomendación: Volver a development

---

## 📋 Template de Reporte

```markdown
## Testing Report - [FECHA]

### Features Testeadas
- [ ] KPI Cards
- [ ] Tabla Enriquecida
- [ ] Stock Inline
- [ ] Importar Excel
- [ ] Escáner QR
- [ ] RBAC
- [ ] Filters

### Issues Encontrados

#### Crítico
- [x] Issue 1: [Descripción] (Fix priority: P0)
- [ ] (No issues críticos)

#### Mayor
- [x] Issue 2: [Descripción] (Fix priority: P1)

#### Menor
- [x] Issue 3: [Descripción] (Fix priority: P2)

### Performance Metrics
- KPI Load: **250ms** (✅ < 500ms)
- Tabla Load (100 items): **850ms** (❌ > 500ms)
- Stock Edit: **150ms** (✅ < 200ms)
- Import 500 items: **3.2s** (✅ < 10s)

### Browsers Tested
- ✅ Chrome 130
- ✅ Firefox 132
- ❌ Safari (falla input editable)
- ✅ Edge 130
- ✅ iOS Safari
- ⏳ Android Chrome (pendiente)

### Conclusión
**Status**: 🟡 YELLOW - Listo con hotfix para Safari
```

---

## 📞 Escalation Points

| Issue | Dueño | Action |
|-------|-------|--------|
| Performance lenta en tabla grande | Frontend Dev | Optimizar virtualization |
| Excel import falla | Backend Dev | Validar batch endpoint |
| RBAC no funciona en algún endpoint | Backend Dev | Audit permissions |
| QR no se escanea (Safari) | Frontend Dev | Cambiar librería QR |

---

**Documento**: TESTING_VALIDATION_CHECKLIST  
**Creado**: Abril 8, 2026  
**Versión**: 1.0  
**Próxima revisión**: Post-Sprint 1

