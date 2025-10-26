# 📖 Guía del Sistema Híbrido de Inventario

## 🎯 ¿Qué es el sistema híbrido?

Tu sistema ahora maneja **dos tipos de productos**:

### 1. **Productos BULK (Agrupados)** 📦
- **Ejemplo**: Auriculares genéricos, cables, fundas
- **Cómo funciona**: Cuentas solo la cantidad total
- **Al recibir**: "Llegaron 25 auriculares"
- **Al vender**: Resta 1 del total
- **Ventaja**: Simple y rápido

### 2. **Productos SERIALIZED (Serializados)** 🔢
- **Ejemplo**: Laptops, smartphones, tablets
- **Cómo funciona**: Cada unidad tiene su número único (IMEI, número de serie)
- **Al recibir**: Escaneas cada laptop individualmente
- **Al vender**: Seleccionas cuál unidad específica
- **Ventaja**: Control total, garantías individuales

---

## 🔄 FLUJO COMPLETO PASO A PASO

### **PASO 1: Crear un Nuevo Producto**
1. Clic en "Nuevo Producto" (botón verde)
2. Llena el formulario
3. **IMPORTANTE**: Selecciona el modo de rastreo:
   - 📦 Bulk: Para productos de bajo valor
   - 🔢 Serializado: Para productos de alto valor

---

### **PASO 2: Recibir Inventario del Proveedor**

#### Si es BULK:
```
1. Clic en "Recibir Inventario" (botón azul)
2. Busca el producto por nombre o SKU
3. Ingresa: "¿Cuántas unidades recibes?" → 25
4. Clic en "Guardar Entrada"
✅ Listo! Se agregaron 25 unidades al stock
```

#### Si es SERIALIZADO:
```
1. Clic en "Recibir Inventario"
2. Busca el producto (ej: Laptop Gamer)
3. El sistema te pedirá escanear CADA unidad:
   - Escanea: SN-LAP-004
   - Escanea: SN-LAP-005
   - Escanea: SN-LAP-006
4. Clic en "Guardar Entrada"
✅ Se registraron 3 laptops con sus números de serie únicos
```

---

### **PASO 3: Vender un Producto**

#### Si es BULK:
```
1. Clic en "Escanear Barcode" (botón morado)
2. Escanea o escribe el SKU del producto
3. Clic en "Vender"
✅ Se resta 1 del inventario automáticamente
```

#### Si es SERIALIZADO:
```
1. Clic en "Escanear Barcode"
2. Escanea el SKU del producto
3. El sistema muestra un dropdown: "Selecciona unidad"
   - SN-LAP-004
   - SN-LAP-005
   - SN-LAP-006
4. Selecciona la que vas a vender
5. Clic en "Vender"
✅ Esa unidad específica se marca como VENDIDA
✅ Se guarda: fecha, ticket de venta
```

---

### **PASO 4: Alertas Automáticas**
- La campanita 🔔 en la esquina muestra alertas
- Se activa cuando:
  - ⚠️ Productos con ≤ 10 unidades (Bajo Stock)
  - 🚨 Productos con 0 unidades (Agotado)
- Haz clic para ver el panel completo

---

## 📊 ¿QUÉ VES EN LA TABLA?

| Columna | Qué significa |
|---------|--------------|
| **Producto** | Nombre e imagen |
| **SKU** | Código único del modelo |
| **Modo** | 📦 Bulk o 🔢 Serial |
| **Cantidad** | Stock disponible actual |
| **Precio** | Precio de venta |
| **Proveedor** | De dónde viene |
| **Estado** | En Stock / Bajo Stock / Agotado |
| **Acciones** | ✏️ Editar / 🗑️ Eliminar |

---

## 🖨️ HARDWARE NECESARIO

Para escanear códigos de barras necesitas:

**OPCIÓN ECONÓMICA** ($25 USD):
- Lector USB Honeywell Voyager 1200g
- Se conecta a tu laptop/PC
- Funciona como un teclado
- Plug & Play (sin instalación)

**Cómo usarlo**:
1. Conecta el lector USB
2. Abre el sistema en tu navegador
3. Haz clic en cualquier campo de entrada
4. Escanea el código de barras
5. ¡Se escribe automáticamente!

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### ✅ USA BULK para:
- Accesorios genéricos
- Productos de bajo costo (<$50)
- Artículos sin garantía individual
- Alto volumen de ventas

### ✅ USA SERIALIZED para:
- Electrónicos de alto valor (>$200)
- Productos con garantía
- Artículos únicos o personalizados
- Control de reparaciones

---

## 🚀 FLUJO RÁPIDO DE TRABAJO

**RECEPCIÓN MATUTINA:**
```
1. Llega el camión del proveedor
2. Abres "Recibir Inventario"
3. Escaneas cada caja/producto
4. Sistema registra todo automáticamente
⏱️ Tiempo: 2-3 minutos por entrega
```

**VENTA AL CLIENTE:**
```
1. Cliente: "Quiero este producto"
2. Escaneas el código
3. Si es serializado, seleccionas unidad
4. Clic en "Vender"
5. Imprimes ticket (opcional)
⏱️ Tiempo: 30 segundos por venta
```

---

## 📱 ACCESO DESDE CUALQUIER DISPOSITIVO

Como es una PWA (Progressive Web App):
- ✅ Laptop en el mostrador
- ✅ Tablet para inventario físico
- ✅ Teléfono para ventas rápidas
- ✅ Funciona OFFLINE (sin internet)

---

## 🔍 EJEMPLO REAL

**Tienda: "TeknoGadget"**

**Productos BULK:**
- Auriculares bluetooth: 45 unidades
- Fundas para celular: 120 unidades
- Cables USB-C: 78 unidades

**Productos SERIALIZED:**
- Laptop Dell XPS (SN-001, SN-002, SN-003): 3 unidades
- iPhone 15 Pro (IMEI-789, IMEI-790): 2 unidades

**Cuando vendes:**
- Auricular → Solo resta 1
- iPhone 15 → Registra IMEI-789 vendido a "Juan Pérez" el 25/10/2025

**Ventaja:** Si Juan regresa en 3 meses:
- Puedes buscar por IMEI-789
- Ves la fecha de compra
- Validas garantía automáticamente

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Puedo cambiar un producto de BULK a SERIALIZED?**
R: Sí, edita el producto y cambia el modo de rastreo.

**P: ¿Qué pasa si escaneo mal un número de serie?**
R: En el modal de recepción puedes eliminarlo antes de guardar (botón X).

**P: ¿Los lectores de barcode son universales?**
R: Sí, cualquier lector USB estándar funciona con tu sistema.

**P: ¿Necesito internet?**
R: No, la app funciona offline. Los datos se guardan en tu navegador.

---

## 🎓 RESUMEN EN 3 PASOS

1. **Recibe inventario** → "Recibir Inventario" (azul)
2. **Vende productos** → "Escanear Barcode" (morado)
3. **Monitorea alertas** → Campanita 🔔 (notificaciones)

¡Eso es todo! Sistema simple pero profesional. 🚀
