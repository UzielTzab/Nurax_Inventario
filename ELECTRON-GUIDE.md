# 🖥️ Guía de Electron - TeknoGadget Inventory

## 📋 Requisitos
- Node.js instalado
- Dependencias instaladas (`npm install`)

## 🚀 Comandos Disponibles

### Desarrollo Web (Vite)
```bash
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Desarrollo con Electron (Método Fácil)
```bash
npm run electron:start
```
Este comando automáticamente:
1. Inicia el servidor Vite
2. Espera a que esté listo
3. Abre la aplicación en Electron con DevTools

### Desarrollo con Electron (Método Manual)
```bash
# Terminal 1: Inicia Vite
npm run dev

# Terminal 2: Espera a que Vite esté listo, luego ejecuta
npm run electron:dev
```

### Construir Ejecutable para Windows
```bash
npm run electron:build-win
```
Genera un ejecutable `.exe` portable en la carpeta `release/`

### Construir para Todas las Plataformas
```bash
npm run electron:build
```
Genera ejecutables para Windows, macOS y Linux (si estás en la plataforma correspondiente)

## 📦 Estructura de Archivos

```
teknogadget_web/
├── electron/
│   └── main.js          # Archivo principal de Electron
├── dist/                # Build de la aplicación web (generado)
├── release/             # Ejecutables generados (ignorado por git)
├── public/
│   ├── pwa-192x192.png  # Icono de la aplicación
│   └── pwa-512x512.png
└── package.json         # Configuración de Electron Builder
```

## ⚙️ Configuración

### Personalización del Ejecutable

En `package.json`, sección `"build"`:

```json
{
  "build": {
    "appId": "com.teknogadget.inventory",
    "productName": "TeknoGadget Inventory",
    "win": {
      "target": "portable",
      "icon": "public/pwa-512x512.png"
    }
  }
}
```

### Modificar Tamaño de Ventana

En `electron/main.js`:

```javascript
mainWindow = new BrowserWindow({
  width: 1280,      // Ancho
  height: 800,      // Alto
  minWidth: 1024,   // Ancho mínimo
  minHeight: 600    // Alto mínimo
})
```

## 🎯 Flujo de Trabajo Recomendado

### Durante el Desarrollo:

**Opción 1: Solo Web (Más Rápido)**
```bash
npm run dev
```
Desarrolla en el navegador con hot-reload instantáneo.

**Opción 2: Con Electron (Probar Funcionalidad Nativa)**
```bash
npm run electron:start
```
Prueba en Electron cuando necesites verificar comportamiento de ventana nativa.

### Para Distribuir:
1. **Prueba final**: `npm run dev` y verifica que todo funciona
2. **Construye**: `npm run build`
3. **Genera ejecutable**: `npm run electron:build-win`
4. **Encuentra el archivo**: Busca en `release/TeknoGadget Inventory-1.0.0-x64.exe`
5. **Comparte**: Envía el `.exe` a tu cliente

## ✨ Características de Electron

### Incluidas en la Configuración:

✅ **Ventana sin menú**: Interfaz limpia y profesional
✅ **Icono personalizado**: Tu logo de TeknoGadget
✅ **Instancia única**: No se pueden abrir múltiples ventanas
✅ **DevTools en desarrollo**: Solo disponible en modo dev
✅ **Links externos**: Se abren en el navegador predeterminado
✅ **Ejecutable portable**: No requiere instalación

## 📊 Tamaño del Ejecutable

El archivo `.exe` generado pesará aproximadamente **150-200 MB** porque incluye:
- Chromium embebido
- Node.js runtime
- Tu aplicación Vue

## 🔧 Solución de Problemas

### Error: "Cannot find module 'electron-serve'"
```bash
npm install electron-serve
```

### El ejecutable no inicia
1. Verifica que el build se completó: `npm run build`
2. Revisa que existe la carpeta `dist/`
3. Intenta ejecutar: `npm run electron:dev` primero

### Cambios no se reflejan en Electron
1. Reconstruye: `npm run build`
2. Cierra Electron y vuelve a ejecutar: `npm run electron:dev`

## 🎨 Ventajas de Usar Electron

✅ **Aplicación Nativa**: Se ve como una app de escritorio real
✅ **Sin Navegador**: No se ve la barra de direcciones
✅ **Distribución Fácil**: Un solo archivo `.exe`
✅ **Offline Completo**: No requiere conexión a internet
✅ **Profesional**: Ideal para entregar a clientes

## 📝 Notas Importantes

- **Modo Desarrollo**: Electron carga desde `http://localhost:5173` (servidor Vite)
- **Modo Producción**: Electron carga desde la carpeta `dist/` local
- **Hot Reload**: En desarrollo, los cambios en Vue se actualizan automáticamente
- **Build Required**: Siempre ejecuta `npm run build` antes de generar el ejecutable

## 🚀 Entrega al Cliente

Tu cliente solo necesita:
1. El archivo `.exe` de la carpeta `release/`
2. Doble clic para ejecutar
3. ¡Listo! No necesita instalar Node.js, npm, ni nada más

---

**Comando rápido para entregar:**
```bash
npm run electron:build-win
```

El ejecutable estará en: `release/TeknoGadget Inventory-1.0.0-x64.exe`
