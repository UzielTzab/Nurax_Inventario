# Sistema de Notificaciones Snackbar

## 📋 Descripción

Sistema de notificaciones tipo toast/snackbar con diseño moderno y animaciones suaves. Permite mostrar mensajes al usuario de forma elegante y no intrusiva.

## 🎨 Tipos de Notificaciones

- **success** - Verde (para acciones exitosas)
- **info** - Azul (para información general)
- **warning** - Naranja (para advertencias)
- **error** - Rojo (para errores)

## 🚀 Uso Básico

### 1. Importar el composable

```typescript
import { useSnackbar } from '../composables/useSnackbar';

const { enqueueSnackbar } = useSnackbar();
```

### 2. Mostrar una notificación

```typescript
// Notificación simple
enqueueSnackbar({
  type: 'success',
  title: 'Producto guardado',
  message: 'El producto se ha guardado correctamente',
  duration: 5000  // 5 segundos (opcional, por defecto es 5000)
});

// Notificación de bienvenida (como en el Dashboard)
enqueueSnackbar({
  type: 'success',
  title: `Welcome back, ${userName}! 👋`,
  message: 'System status is Healthy. You have pending inventory actions.',
  duration: 6000
});
```

## 📝 Opciones Disponibles

```typescript
interface SnackbarOptions {
  type?: 'success' | 'info' | 'warning' | 'error';  // Tipo de notificación
  title: string;                                     // Título (requerido)
  message?: string;                                  // Mensaje opcional
  duration?: number;                                 // Duración en ms (0 = no se cierra automáticamente)
  closable?: boolean;                                // Mostrar botón de cerrar (default: true)
}
```

## 💡 Ejemplos de Uso

### Notificación de éxito
```typescript
enqueueSnackbar({
  type: 'success',
  title: '✅ Operación exitosa',
  message: 'Los cambios se han guardado correctamente'
});
```

### Notificación de error
```typescript
enqueueSnackbar({
  type: 'error',
  title: '❌ Error al guardar',
  message: 'No se pudo conectar con el servidor. Intenta nuevamente.'
});
```

### Notificación de advertencia
```typescript
enqueueSnackbar({
  type: 'warning',
  title: '⚠️ Stock bajo',
  message: 'El producto "Laptop Pro" tiene solo 3 unidades disponibles'
});
```

### Notificación de información
```typescript
enqueueSnackbar({
  type: 'info',
  title: 'ℹ️ Actualización disponible',
  message: 'Hay una nueva versión del sistema disponible'
});
```

### Notificación persistente (no se cierra automáticamente)
```typescript
enqueueSnackbar({
  type: 'warning',
  title: 'Acción requerida',
  message: 'Debes completar tu perfil antes de continuar',
  duration: 0,  // No se cierra automáticamente
  closable: true  // El usuario debe cerrarla manualmente
});
```

## 🎯 Métodos Disponibles

```typescript
const { enqueueSnackbar, closeSnackbar, clearAll } = useSnackbar();

// Mostrar notificación (retorna el ID)
const id = enqueueSnackbar({ ... });

// Cerrar una notificación específica
closeSnackbar(id);

// Cerrar todas las notificaciones
clearAll();
```

## 🎨 Personalización

El componente ya está estilizado con:
- Gradientes oscuros según el tipo
- Borde lateral de color
- Iconos SVG para cada tipo
- Animaciones de entrada/salida
- Diseño responsive
- Backdrop blur para efecto glassmorphism

## 📱 Responsive

Las notificaciones se adaptan automáticamente:
- **Desktop**: Esquina superior derecha, ancho fijo
- **Mobile**: Ocupa todo el ancho con márgenes laterales

## ⚙️ Configuración Global

El contenedor `SnackbarContainer` ya está agregado en `App.vue`, por lo que las notificaciones están disponibles en toda la aplicación.

## 🔧 Archivos del Sistema

- `src/components/common/Snackbar.vue` - Componente individual
- `src/components/common/SnackbarContainer.vue` - Contenedor global
- `src/composables/useSnackbar.ts` - Lógica de estado
- `src/App.vue` - Integración global
