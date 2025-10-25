# TeknoGadget - Sistema de Inventario PWA

## 📱 Instalación como Aplicación Nativa

Tu aplicación ahora es una **Progressive Web App (PWA)** y puede instalarse como una aplicación nativa en cualquier dispositivo.

### Cómo instalar en diferentes dispositivos:

#### 🖥️ **Windows/Linux/Mac (Chrome/Edge)**
1. Abre la aplicación en tu navegador
2. Busca el ícono de instalación (➕) en la barra de direcciones
3. Haz clic en "Instalar" o "Install"
4. La aplicación se abrirá en su propia ventana

#### 📱 **Android (Chrome)**
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) en la esquina superior derecha
3. Selecciona "Agregar a pantalla de inicio" o "Install app"
4. Confirma la instalación

#### 🍎 **iOS/iPhone (Safari)**
1. Abre la aplicación en Safari
2. Toca el botón de compartir (□↑)
3. Desplázate y selecciona "Agregar a pantalla de inicio"
4. Toca "Agregar"

### ✨ Características PWA Incluidas:

- ✅ **Instalable**: Se puede instalar como app nativa en cualquier dispositivo
- ✅ **Funciona sin conexión**: Cache inteligente de recursos
- ✅ **Auto-actualización**: La app se actualiza automáticamente
- ✅ **Icono en pantalla**: Aparece como cualquier otra app
- ✅ **Modo independiente**: Se ejecuta en su propia ventana
- ✅ **Optimizada**: Carga rápida y rendimiento mejorado

### 🎨 Personalizar Iconos

Reemplaza estos archivos en la carpeta `public/`:
- `pwa-192x192.png` - Icono de 192x192 píxeles
- `pwa-512x512.png` - Icono de 512x512 píxeles
- `apple-touch-icon.png` - Icono de 180x180 píxeles para iOS

**Recomendación**: Usa herramientas como [realfavicongenerator.net](https://realfavicongenerator.net/) para generar todos los iconos necesarios.

### 🚀 Desarrollo y Producción

```bash
# Modo desarrollo (con PWA)
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

### 🔧 Configuración PWA

La configuración PWA se encuentra en `vite.config.ts`. Puedes personalizar:
- Nombre de la aplicación
- Colores del tema
- Estrategias de caché
- Íconos y recursos
- Comportamiento offline

### 📝 Notas Importantes:

1. **HTTPS requerido**: En producción, la app debe servirse por HTTPS para que PWA funcione
2. **Desarrollo local**: En `localhost` funciona sin HTTPS
3. **Service Worker**: Se actualiza automáticamente en cada despliegue
4. **Caché**: Las imágenes externas se cachean durante 30 días

### 🌐 Despliegue

Para que la PWA funcione en producción, despliega en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier hosting con HTTPS

Todos estos servicios proveen HTTPS automáticamente.

---

**¡Tu app está lista para instalarse! 🎉**
