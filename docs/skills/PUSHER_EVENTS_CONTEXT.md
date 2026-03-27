# 📡 Eventos Pusher - Contexto Para Frontend

## Estado Actual
✅ **Backend está completamente implementado**. Los eventos Pusher ahora se disparan con datos completos según lo requerido.

---

## 📋 Eventos Implementados

### 1. **INVENTORY_UPDATED** (Privado - Canal por usuario)
**Cuándo se dispara:**
- Después de crear una venta (POST `/api/sales/`)
- Después de cancelar una venta (POST `/api/sales/{id}/cancel/`)
- Cuando se modifica un producto (PUT `/api/products/{id}/`)
- Cuando se elimina un producto (DELETE `/api/products/{id}/`)

**Canal:** `pos-user-{user_id}` (privado)

**Estructura del Payload:**
```json
{
  "message": "update",
  "sale_id": 123,
  "product_id": 45,
  "new_stock": 98,
  "timestamp": "2026-03-08T14:30:45.123456Z"
}
```

**Casos de uso:**
- Al vender 2 unidades del producto 45: Se envía UN evento por cada item del carrito
- Si el carrito tiene 3 productos distintos: Se envían 3 eventos `INVENTORY_UPDATED` (uno por producto)
- Al cancelar una venta: Se envía un evento por cada producto que se restaura

**Manejo en Frontend (Pseudocódigo):**
```javascript
// En tu listener de Pusher:
pusher.subscribe('pos-user-' + userId)
  .bind('INVENTORY_UPDATED', (data) => {
    // 👇 Opción 1: Actualizar stock del producto específico
    updateProductStock(data.product_id, data.new_stock);
    
    // 👇 Opción 2: Re-traer inventario completo
    fetchProducts(); // Si prefieres refrescar todo
  });
```

---

### 2. **SALES_COMPLETED** (Privado - Canal por usuario)
**Cuándo se dispara:**
- Inmediatamente después de crear una venta exitosa (POST `/api/sales/`)
- **Se dispara UNA SOLA VEZ por venta**, con el total y cantidad de items

**Canal:** `pos-user-{user_id}` (privado)

**Estructura del Payload:**
```json
{
  "transaction_id": "TRX-00001",
  "total": 8000.00,
  "items_count": 3,
  "timestamp": "2026-03-08T14:30:45.123456Z"
}
```

**Manejo en Frontend (Pseudocódigo):**
```javascript
pusher.subscribe('pos-user-' + userId)
  .bind('SALES_COMPLETED', (data) => {
    console.log(`✅ Venta completada: ${data.transaction_id}`);
    console.log(`Total: $${data.total} | Items: ${data.items_count}`);
    
    // Acciones recomendadas:
    // 1. Limpiar carrito local
    clearCart();
    
    // 2. Mostrar notificación de éxito
    showNotification('Venta registrada exitosamente');
    
    // 3. Registrar en historial de ventas
    addToSalesHistory(data);
    
    // 4. Re-traer inventario para sincronizar ambas pestañas
    fetchProducts();
  });
```

---

### 3. **SALES_CANCELLED** (Privado - Canal por usuario)
**Cuándo se dispara:**
- Cuando se cancela una venta (POST `/api/sales/{id}/cancel/`)
- Después de restaurar el stock completo

**Canal:** `pos-user-{user_id}` (privado)

**Estructura del Payload:**
```json
{
  "transaction_id": "TRX-00001",
  "timestamp": "2026-03-08T14:30:45.123456Z"
}
```

**Manejo en Frontend (Pseudocódigo):**
```javascript
pusher.subscribe('pos-user-' + userId)
  .bind('SALES_CANCELLED', (data) => {
    console.log(`❌ Venta cancelada: ${data.transaction_id}`);
    
    // Acciones recomendadas:
    fetchProducts(); // Refrescar inventario
    showNotification('Venta cancelada y stock restaurado');
  });
```

---

### 4. **PRODUCT_SCANNED** (Privado - Canal por usuario)
**Cuándo se dispara:**
- Cuando se escanea un código de barras (POST `/api/products/scan/`)

**Canal:** `pos-user-{user_id}` (privado)

**Estructura del Payload:**
```json
{
  "product": {
    "id": 45,
    "name": "Producto Ejemplo",
    "sku": "P001",
    "stock": 98,
    "price": 250.00,
    "image_url": "https://...",
    "status": "in_stock"
  }
}
```

**Manejo en Frontend:** Ya implementado probablemente.

---

### 5. **CART_UPDATED** (Privado - Canal por usuario)
**Cuándo se dispara:**
- Cuando se sincroniza el carrito (POST `/api/products/sync-cart/`)

**Canal:** `pos-user-{user_id}` (privado)

**Estructura del Payload:**
```json
{
  "cart": [
    {"product_id": 45, "quantity": 2, "unit_price": 250.00},
    {"product_id": 12, "quantity": 1, "unit_price": 500.00}
  ],
  "device_id": "chrome-session-001"
}
```

---

## 🔄 Flujo Completo de Sincronización

### Ejemplo Real: Dos navegadores abiertos (Firefox y Chrome)

```
1️⃣ Usuario en Firefox VENDE 2 unidades del producto 45
   ├─ POST /api/sales/ ✅
   ├─ Backend decrementa stock (45: 100 → 98)
   │
   ├─ 📡 Pusher dispara INVENTORY_UPDATED (+2 eventos si es carrito con 2 items)
   │   └─ product_id: 45, new_stock: 98
   │
   └─ 📡 Pusher dispara SALES_COMPLETED
       └─ transaction_id: TRX-00123, total: 8000, items_count: 2

2️⃣ Chrome (misma sesión) recibe ambos eventos
   ├─ INVENTORY_UPDATED → updateProductStock(45, 98)
   ├─ SALES_COMPLETED → clearCart() + fetchProducts()
   │
   └─ ✅ Chrome ahora muestra inventario actualizado SIN refresh manual

3️⃣ Resultado: AMBAS PESTAÑAS sincronizadas en < 100ms
```

---

## ⚡ Requisitos del Frontend

### Listeners que DEBEN estar activos:
1. ✅ `INVENTORY_UPDATED` → Llamar `fetchProducts()` o actualizar producto específico
2. ✅ `SALES_COMPLETED` → Limpiar carrito y refrescar inventario
3. ✅ `SALES_CANCELLED` → Refrescar inventario
4. ✅ `CART_UPDATED` → Sincronizar carrito entre navegadores (si aplica)

### Channel de Suscripción Obligatorio:
```javascript
const channel = pusher.subscribe(`pos-user-${userId}`);
// Esto es PRIVADO y requiere autenticación en el backend
```

---

## 🧪 Testing / Debugging

### Verificar que los eventos se envíen:
1. Abre la consola del navegador (F12)
2. En tu código Pusher, agrega logs:
```javascript
pusher.logToConsole = true; // Debug mode

channel.bind('INVENTORY_UPDATED', (data) => {
  console.log('📦 Inventario actualizado:', data);
});

channel.bind('SALES_COMPLETED', (data) => {
  console.log('✅ Venta completada:', data);
});
```

3. Crea una venta desde Firefox → Verifica que Chrome reciba los eventos

---

## 📌 Notas Importantes

- ✅ Todos los payloads incluyen `timestamp` en ISO 8601
- ✅ Los canales `pos-user-{user_id}` son **PRIVADOS** → Requieren autenticación
- ✅ Los eventos son **casi instantáneos** (< 100ms típicamente)
- ✅ Las transacciones se guardan en BD (no solo en Pusher)
- ⚠️ Si Pusher falla (conexión perdida), el usuario debería ver un indicador visual
- ⚠️ Implementar reintentos si es necesario (Pusher tiene reconexión automática)

---

## 🚀 Próximos Pasos

El **backend está listo**. Ahora el frontend debe:
1. Verificar que los listeners estén activos para todos los eventos
2. Implementar la lógica de `fetchProducts()` en cada evento recibido
3. Probar con Firefox y Chrome simultáneamente
4. Verificar que NO hay lag entre la venta en una pestaña y la actualización en la otra

¿Necesitas que debuguee algo o que agregue más eventos?
