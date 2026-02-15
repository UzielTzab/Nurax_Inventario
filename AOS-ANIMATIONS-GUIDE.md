# 🎨 Guía de Animaciones con AOS

## ✅ AOS Instalado y Configurado

AOS (Animate On Scroll) está instalado y listo para usar en toda la aplicación.

### 📦 Paquetes Instalados
- `aos` - Librería de animaciones
- `@types/aos` - Tipos de TypeScript

---

## 🚀 Cómo Usar AOS

### **1. En el componente Login.vue (ya implementado)**

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

onMounted(() => {
  AOS.init({
    duration: 600,        // Duración de la animación (ms)
    easing: 'ease-out-cubic', // Tipo de curva
    once: true,          // Animar solo una vez
    offset: 50,          // Offset desde el trigger point
  });
});
</script>

<template>
  <div data-aos="fade-up" data-aos-delay="100">
    <!-- Tu contenido -->
  </div>
</template>
```

---

## 🎯 Animaciones Disponibles

### **Fade Animations**
```html
<div data-aos="fade-up">Fade up</div>
<div data-aos="fade-down">Fade down</div>
<div data-aos="fade-left">Fade left</div>
<div data-aos="fade-right">Fade right</div>
<div data-aos="fade-up-right">Fade up right</div>
<div data-aos="fade-up-left">Fade up left</div>
```

### **Zoom Animations**
```html
<div data-aos="zoom-in">Zoom in</div>
<div data-aos="zoom-in-up">Zoom in up</div>
<div data-aos="zoom-in-down">Zoom in down</div>
<div data-aos="zoom-out">Zoom out</div>
```

### **Flip Animations**
```html
<div data-aos="flip-left">Flip left</div>
<div data-aos="flip-right">Flip right</div>
<div data-aos="flip-up">Flip up</div>
<div data-aos="flip-down">Flip down</div>
```

### **Slide Animations**
```html
<div data-aos="slide-up">Slide up</div>
<div data-aos="slide-down">Slide down</div>
<div data-aos="slide-left">Slide left</div>
<div data-aos="slide-right">Slide right</div>
```

---

## ⚙️ Atributos de Configuración

### **Delay (Retraso)**
```html
<div data-aos="fade-up" data-aos-delay="100">Delay 100ms</div>
<div data-aos="fade-up" data-aos-delay="200">Delay 200ms</div>
<div data-aos="fade-up" data-aos-delay="300">Delay 300ms</div>
```

### **Duration (Duración)**
```html
<div data-aos="fade-up" data-aos-duration="400">Rápido (400ms)</div>
<div data-aos="fade-up" data-aos-duration="800">Normal (800ms)</div>
<div data-aos="fade-up" data-aos-duration="1200">Lento (1200ms)</div>
```

### **Easing (Curva de animación)**
```html
<div data-aos="fade-up" data-aos-easing="linear">Linear</div>
<div data-aos="fade-up" data-aos-easing="ease-in-out">Ease in out</div>
<div data-aos="fade-up" data-aos-easing="ease-out-cubic">Ease out cubic</div>
```

### **Anchor Placement**
```html
<div data-aos="fade-up" data-aos-anchor-placement="top-bottom">
  Se activa cuando el top del elemento toca el bottom del viewport
</div>
```

### **Once (Animar solo una vez)**
```html
<div data-aos="fade-up" data-aos-once="true">Solo anima una vez</div>
<div data-aos="fade-up" data-aos-once="false">Anima cada vez que scrolleas</div>
```

---

## 💡 Ejemplos Prácticos

### **Animación Escalonada (Staggered)**
```html
<div data-aos="fade-up" data-aos-delay="0">Primero</div>
<div data-aos="fade-up" data-aos-delay="100">Segundo</div>
<div data-aos="fade-up" data-aos-delay="200">Tercero</div>
<div data-aos="fade-up" data-aos-delay="300">Cuarto</div>
```

### **Cards con Zoom**
```html
<div class="card" data-aos="zoom-in" data-aos-delay="100">
  <h3>Card 1</h3>
</div>
<div class="card" data-aos="zoom-in" data-aos-delay="200">
  <h3>Card 2</h3>
</div>
```

### **Lista de Productos**
```html
<div 
  v-for="(product, index) in products" 
  :key="product.id"
  data-aos="fade-up"
  :data-aos-delay="index * 100"
>
  {{ product.name }}
</div>
```

---

## 🔧 Configuración Global

Para usar AOS en toda la aplicación, puedes inicializarlo en `main.ts`:

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

app.mount('#app')

// Inicializar AOS después de montar
AOS.init({
  duration: 600,
  easing: 'ease-out-cubic',
  once: true,
  offset: 50,
})
```

Luego solo usas los atributos `data-aos` en cualquier componente sin necesidad de importar AOS.

---

## 📚 Recursos

- **Documentación oficial**: https://michalsnik.github.io/aos/
- **GitHub**: https://github.com/michalsnik/aos
- **Demo de todas las animaciones**: https://michalsnik.github.io/aos/

---

## 🎯 Mejores Prácticas

1. ✅ **Usa `once: true`** para mejor performance (anima solo una vez)
2. ✅ **Delays de 100-200ms** entre elementos para efecto escalonado
3. ✅ **Duration de 400-800ms** para animaciones suaves
4. ✅ **Usa `fade-up`** como animación por defecto (la más popular)
5. ❌ **No abuses** de las animaciones - menos es más
6. ❌ **Evita duraciones > 1000ms** - se sienten lentas

---

## 🚀 Próximos Pasos

Ahora puedes agregar animaciones a:
- ✅ Dashboard components (WelcomeCard, StatsCard, etc.)
- ✅ Product cards en la tabla
- ✅ Modales al aparecer
- ✅ Sidebar items
- ✅ Cualquier elemento que quieras animar
