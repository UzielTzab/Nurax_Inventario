# 🔐 Restricción de Auto-Protección del Admin

## ¿Qué se implementó?

Se agregó una **restricción de seguridad** en el panel de administración para evitar que el **admin (superusuario) pueda desactivar o eliminar su propia cuenta** accidentalmente.

---

## 📋 Detalles Técnicos

### Ubicación
- **Archivo:** `src/views/AdminClients.vue`
- **Componente:** Panel de Gestión de Clientes

### Validación

Se implementó una función helper que verifica:

```typescript
const isCurrentAdminUser = (clientId: string | number): boolean => {
  return clientId === currentUser.value?.id && currentUser.value?.role === 'admin';
};
```

**Condiciones:**
1. El ID del cliente debe coincidir con el ID del usuario actual
2. El rol del usuario actual debe ser 'admin'

---

## 🎯 Comportamiento

### En la Tabla de Clientes

**Si es el admin actual:**

1. ✅ Botón de **toggle** (activar/desactivar):
   - Se **deshabilita** (opacity: 0.5)
   - Muestra tooltip: "No puedes cambiar el estado de tu propia cuenta"
   - No dispara ninguna acción

2. ✅ Botón de **eliminar**:
   - Se **deshabilita** (opacity: 0.5)
   - Muestra tooltip: "No puedes eliminar tu propia cuenta"
   - No dispara ninguna acción

3. ✅ Notificación si intenta clicar:
   - Snackbar con: `type: 'error'`
   - Título: "Acción no permitida"
   - Mensaje: "No puedes [cambiar el estado/eliminar] de tu propia cuenta."
   - Duración: 3 segundos

---

## 💡 Casos de Uso

### ✅ Se permite (otros clientes):
- Desactivar a otro cliente
- Eliminar a otro cliente
- Modificar cualquier cuenta que no sea la propia

### ❌ NO se permite (tu propia cuenta):
- Desactivar tu cuenta
- Eliminar tu cuenta
- Cambiar tu estado de activación

---

## 🎨 Cambios Visuales

### Estados de los Botones

**Habilitado (otros clientes):**
```css
toggle-switch {
  cursor: pointer;
  opacity: 1;
  transition: background 0.25s ease;
}

action-btn {
  cursor: pointer;
  opacity: 1;
}
```

**Deshabilitado (tu propia cuenta):**
```css
.toggle-switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn:disabled:hover {
  background: white;
  border-color: #e5e7eb;
  color: #6b7280;
}
```

---

## 🔄 Flujo de Interacción

```
Usuario Admin abre panel de Clientes
         ↓
Ve su propia cuenta en la tabla
         ↓
Intenta clicar toggle o delete
         ↓
Se dispara confirmToggle() o confirmDelete()
         ↓
Se valida: ¿Es el admin actual?
         ├─ SÍ → Muestra snackbar de error, no abre modal
         └─ NO → Abre modal de confirmación (comportamiento normal)
```

---

## 🛡️ Beneficios de Seguridad

### 1. **Prevención de Accesos Accidentales**
   - Evita bloquear al único admin del sistema
   - Protege contra clicks accidentales

### 2. **Mejor UX**
   - Botones visualmente deshabilitados
   - Tooltips informativos
   - Snackbars explicativos

### 3. **Consistencia**
   - Mismo patrón en toggle y delete
   - Validación en frontend + backend (si aplica)

### 4. **Trazabilidad**
   - Se muestra mensaje claro al intentar accionar
   - El admin sabe por qué no puede actuar

---

## 📝 Código Modificado

### 1. Import del composable de Auth
```typescript
import { useAuth } from '@/composables/useAuth';
```

### 2. Desestructuración de currentUser
```typescript
const { currentUser } = useAuth();
```

### 3. Función helper
```typescript
const isCurrentAdminUser = (clientId: string | number): boolean => {
  return clientId === currentUser.value?.id && currentUser.value?.role === 'admin';
};
```

### 4. Validación en confirmToggle
```typescript
const confirmToggle = (client: Client) => {
  if (isCurrentAdminUser(client.id)) {
    enqueueSnackbar({
      type: 'error',
      title: 'Acción no permitida',
      message: 'No puedes cambiar el estado de tu propia cuenta.',
      duration: 3000
    });
    return;
  }
  toggleTarget.value = client;
};
```

### 5. Validación en confirmDelete
```typescript
const confirmDelete = (client: Client) => {
  if (isCurrentAdminUser(client.id)) {
    enqueueSnackbar({
      type: 'error',
      title: 'Acción no permitida',
      message: 'No puedes eliminar tu propia cuenta.',
      duration: 3000
    });
    return;
  }
  deleteTarget.value = client;
};
```

### 6. Atributos en Template
```vue
<!-- Toggle Button -->
<button
  :disabled="isCurrentAdminUser(client.id)"
  :title="isCurrentAdminUser(client.id) 
    ? 'No puedes cambiar el estado de tu propia cuenta' 
    : 'Desactivar/Activar cuenta'"
  @click="confirmToggle(client)"
/>

<!-- Delete Button -->
<button
  :disabled="isCurrentAdminUser(client.id)"
  :title="isCurrentAdminUser(client.id) 
    ? 'No puedes eliminar tu propia cuenta' 
    : 'Eliminar'"
  @click="confirmDelete(client)"
/>
```

### 7. Estilos CSS para estado deshabilitado
```css
.toggle-switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn:disabled:hover {
  background: white;
  border-color: #e5e7eb;
  color: #6b7280;
}
```

---

## 🧪 Validación

### Frontend
- ✅ Botones deshabilitados visualmente
- ✅ Tooltips informativos
- ✅ Snackbars de error
- ✅ No abre modales de confirmación

### Ejemplo de Ejecución
```
1. Admin se loguea
2. Navega a Panel → Clientes
3. Ve su propia cuenta en la tabla
4. Intenta clicar el toggle
5. Se muestra: "Acción no permitida - No puedes cambiar el estado de tu propia cuenta"
6. No se abre modal, botón permanece deshabilitado
```

---

## 📊 Compatibilidad

### Funciona con:
- ✅ Roles: `'admin'`
- ✅ currentUser del composable `useAuth()`
- ✅ Cliente con `id` y `is_active`

### No afecta:
- ✅ Otros roles ('cliente', etc.)
- ✅ Otras cuentas en la tabla
- ✅ API endpoints (validación solo frontend)

---

## 🔍 Consideraciones

### ¿Y si hay múltiples admins?
- Esta restricción **solo aplica a tu propia cuenta**
- Otros admins pueden desactivarte o eliminarte
- Es una protección contra accidentes propios, no contra otros admins

### ¿Qué pasa en el backend?
- El backend debería tener su propia validación (si lo deseas implementar)
- Esta es una protección de UX en frontend
- Recomendación: implementar validación similar en `toggle_software_client` y `delete_software_client` del backend

---

## 🚀 Próximas Mejoras (Opcional)

1. **Backend Validation**
   - Agregar check en `toggle_software_client()`
   - Agregar check en `delete_software_client()`
   - Responder con 403 Forbidden si intenta auto-eliminarse

2. **Logging**
   - Registrar intentos de auto-eliminación
   - Auditar acciones de admins

3. **Multi-Admin Support**
   - Permitir que solo un super-admin pueda eliminar otros admins
   - Rol de "super-admin" vs "admin" regular

4. **UI Enhancements**
   - Mostrar badge "Ésta eres tú" en tu propia cuenta
   - Highlight visual en tu fila

---

## 📞 Soporte

Si encuentras algún problema o comportamiento inesperado:

1. Verifica que `currentUser.value?.role === 'admin'`
2. Verifica que los IDs coincidan correctamente
3. Revisa la consola para mensajes de error
4. Consulta el archivo `src/views/AdminClients.vue`

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y Funcional

