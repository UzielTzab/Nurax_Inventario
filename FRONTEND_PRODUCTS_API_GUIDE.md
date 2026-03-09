# 📦 Guía de Consumo - API de Productos con Paginación y Filtros

## 🎯 Introducción

El endpoint `/api/products/` ha sido refactorizado para soportar **paginación servidor-lado** con **filtros avanzados**. Esto garantiza:

✅ Mejor rendimiento (solo se traen los datos necesarios)  
✅ Escalabilidad (soporta catálogos de 100K+ productos)  
✅ Filtros aplicados en BD (búsquedas muy rápidas)  
✅ Respuesta JSON estandarizada con metadatos de paginación  

---

## 📡 Endpoint Principal

### **GET `/api/products/`**

Retorna una lista paginada de productos con soporte para búsqueda, filtrado y ordenamiento.

---

## 📋 Parámetros Query

### **Paginación**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | integer | Número de página (comienza en 1) | `?page=2` |
| `page_size` | integer | Items por página (10, 25, 50, 100) | `?page_size=25` |

**Valores válidos de `page_size`:**
- `10` (por defecto)
- `25`
- `50`
- `100` (máximo)

---

### **Búsqueda**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `search` | string | Busca en nombre y SKU | `?search=iphone` |

⚠️ La búsqueda es **case-insensitive** y busca palabras parciales.

---

### **Filtrado**

| Parámetro | Tipo | Valores | Descripción | Ejemplo |
|-----------|------|--------|-------------|---------|
| `category` | integer (ID) | ID de categoría | Filtra por categoría | `?category=5` |
| `sku` | string | Código SKU | Filtra por código exacto | `?sku=SKU-0001` |
| `stock_status` | string | `in_stock`, `low_stock`, `out_of_stock` | Filtra por estado de inventario | `?stock_status=in_stock` |
| `min_price` | decimal | Precio en $ | Precio mínimo | `?min_price=10.50` |
| `max_price` | decimal | Precio en $ | Precio máximo | `?max_price=500.00` |

**Definiciones de `stock_status`:**
- `in_stock` → stock > 10
- `low_stock` → 0 < stock ≤ 10
- `out_of_stock` → stock = 0

---

### **Ordenamiento**

| Parámetro | Tipo | Valores | Descripción | Ejemplo |
|-----------|------|--------|-------------|---------|
| `ordering` | string | `-price`, `price`, `-stock`, `stock`, `-name`, `name`, `-created_at`, `created_at` | Ordena los resultados | `?ordering=-price` |

⚠️ Anteponer `-` para orden descendente. Sin `-` es ascendente.

---

## 📨 Respuesta Exitosa (200 OK)

```json
{
  "count": 156,
  "next": "http://api/products/?page=2&page_size=10&category=5",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "MacBook Pro 16",
      "category": 2,
      "category_name": "Computadoras",
      "supplier": 1,
      "sku": "SKU-0001",
      "stock": 5,
      "price": "1500.00",
      "image_url": "https://res.cloudinary.com/.../macbook.png",
      "status": "low_stock",
      "created_at": "2024-03-01T10:30:00Z",
      "updated_at": "2024-03-08T14:25:00Z"
    },
    {
      "id": 2,
      "name": "OPPO Reno 10",
      "category": 3,
      "category_name": "Smartphones",
      "supplier": 2,
      "sku": "SKU-0002",
      "stock": 15,
      "price": "1300.00",
      "image_url": "https://res.cloudinary.com/.../oppo.png",
      "status": "in_stock",
      "created_at": "2024-03-02T09:15:00Z",
      "updated_at": "2024-03-08T11:00:00Z"
    }
  ]
}
```

### **Campos en `results`:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID del producto |
| `name` | string | Nombre del producto |
| `category` | integer | ID de la categoría |
| `category_name` | string | Nombre de la categoría (solo lectura) |
| `supplier` | integer | ID del proveedor |
| `sku` | string | Código SKU único |
| `stock` | integer | Cantidad en inventario |
| `price` | decimal | Precio en USD |
| `image_url` | string | URL de la imagen en Cloudinary |
| `status` | string | Estado del stock: `in_stock`, `low_stock`, `out_of_stock` |
| `created_at` | datetime | Fecha de creación (ISO 8601) |
| `updated_at` | datetime | Fecha de última actualización (ISO 8601) |

### **Metadatos de Paginación:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `count` | integer | Total de productos que coinciden |
| `next` | string \| null | URL para la siguiente página (null si es la última) |
| `previous` | string \| null | URL para la página anterior (null si es la primera) |

---

## 💡 Ejemplos de Uso

### **1. Obtener los primeros 10 productos (por defecto)**

```
GET /api/products/
```

### **2. Pagina 2 con 25 items por página**

```
GET /api/products/?page=2&page_size=25
```

### **3. Buscar "iPhone" con máximo 50 items**

```
GET /api/products/?search=iphone&page_size=50
```

### **4. Productos en stock de la categoría 5, ordenados por precio descendente**

```
GET /api/products/?category=5&stock_status=in_stock&ordering=-price
```

### **5. Productos entre $100 y $500, stock bajo**

```
GET /api/products/?min_price=100&max_price=500&stock_status=low_stock&page_size=50
```

### **6. Búsqueda por SKU exacto**

```
GET /api/products/?sku=SKU-0001
```

### **7. Todos los productos, ordenados alfabéticamente**

```
GET /api/products/?ordering=name&page_size=100
```

### **8. Combinación avanzada: búsqueda, filtros, ordenamiento y paginación**

```
GET /api/products/?search=laptop&category=2&stock_status=in_stock&min_price=800&ordering=-price&page=1&page_size=25
```

---

## 🔧 Implementación en Frontend (Vue.js)

### **Composable para consumir la API**

```javascript
// composables/useProducts.js
import { ref, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10
  })

  const filters = ref({
    search: '',
    category: null,
    stock_status: null,
    min_price: null,
    max_price: null,
    ordering: '-created_at'
  })

  // Construir query string desde filtros
  const buildQueryString = () => {
    const params = new URLSearchParams()
    
    params.append('page', pagination.value.currentPage)
    params.append('page_size', pagination.value.pageSize)
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.category) params.append('category', filters.value.category)
    if (filters.value.stock_status) params.append('stock_status', filters.value.stock_status)
    if (filters.value.min_price) params.append('min_price', filters.value.min_price)
    if (filters.value.max_price) params.append('max_price', filters.value.max_price)
    if (filters.value.ordering) params.append('ordering', filters.value.ordering)
    
    return params.toString()
  }

  // Fetch productos con filtros actuales
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const token = localStorage.getItem('access_token') // Token JWT
      const queryString = buildQueryString()
      const response = await fetch(
        `${API_BASE}/products/?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
      
      const data = await response.json()
      products.value = data.results
      pagination.value.count = data.count
      pagination.value.next = data.next
      pagination.value.previous = data.previous
    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  // Cambiar página
  const goToPage = (pageNum) => {
    pagination.value.currentPage = pageNum
    fetchProducts()
  }

  // Cambiar items por página (resetea a página 1)
  const setPageSize = (size) => {
    pagination.value.pageSize = size
    pagination.value.currentPage = 1
    fetchProducts()
  }

  // Aplicar filtro (resetea a página 1)
  const applyFilters = (newFilters) => {
    Object.assign(filters.value, newFilters)
    pagination.value.currentPage = 1
    fetchProducts()
  }

  // Limpiar filtros
  const clearFilters = () => {
    filters.value = {
      search: '',
      category: null,
      stock_status: null,
      min_price: null,
      max_price: null,
      ordering: '-created_at'
    }
    pagination.value.currentPage = 1
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    fetchProducts,
    goToPage,
    setPageSize,
    applyFilters,
    clearFilters
  }
}
```

### **Uso en componente Vue**

```vue
<template>
  <div class="products-container">
    <!-- Formulario de Filtros -->
    <div class="filtros-section">
      <input 
        v-model="filters.search" 
        @input="applyFilters({ search: filters.search })"
        placeholder="Buscar por nombre o SKU..."
        class="search-input"
      />
      
      <select 
        v-model="filters.category" 
        @change="applyFilters({ category: filters.category })"
      >
        <option value="">Todas las categorías</option>
        <option value="2">Computadoras</option>
        <option value="3">Smartphones</option>
      </select>

      <select 
        v-model="filters.stock_status" 
        @change="applyFilters({ stock_status: filters.stock_status })"
      >
        <option value="">Todos los estados</option>
        <option value="in_stock">En Stock</option>
        <option value="low_stock">Stock Bajo</option>
        <option value="out_of_stock">Agotado</option>
      </select>

      <select 
        v-model="pagination.pageSize" 
        @change="setPageSize(pagination.pageSize)"
      >
        <option value="10">10 por página</option>
        <option value="25">25 por página</option>
        <option value="50">50 por página</option>
        <option value="100">100 por página</option>
      </select>

      <button @click="clearFilters">Limpiar Filtros</button>
    </div>

    <!-- Lista de Productos -->
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image_url" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.category_name }}</p>
        <p class="price">${{ product.price }}</p>
        <p :class="`status ${product.status}`">{{ product.status }}</p>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination">
      <button 
        @click="goToPage(pagination.currentPage - 1)"
        :disabled="!pagination.previous"
      >
        Anterior
      </button>
      
      <span>Página {{ pagination.currentPage }} de {{ Math.ceil(pagination.count / pagination.pageSize) }}</span>
      
      <button 
        @click="goToPage(pagination.currentPage + 1)"
        :disabled="!pagination.next"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProducts } from '@/composables/useProducts'

const { products, loading, error, pagination, filters, applyFilters, setPageSize, goToPage, clearFilters } = useProducts()

// Cargar productos al montar el componente
const { fetchProducts } = useProducts()
fetchProducts()
</script>

<style scoped>
.products-container {
  padding: 20px;
}

.filtros-section {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filtros-section input,
.filtros-section select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.product-card h3 {
  font-size: 14px;
  margin: 10px 0;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
}

.status {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  margin-top: 10px;
  display: inline-block;
}

.status.in_stock {
  background-color: #d4edda;
  color: #155724;
}

.status.low_stock {
  background-color: #fff3cd;
  color: #856404;
}

.status.out_of_stock {
  background-color: #f8d7da;
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.error {
  color: #d32f2f;
}
</style>
```

---

## 🔐 Autenticación

Todos los requests requieren un **JWT token** en el header:

```
Authorization: Bearer <tu_access_token>
```

El token se obtiene del login:

```bash
POST /api/token/
{
  "email": "tuuser@example.com",
  "password": "tupassword"
}
```

---

## ⚠️ Casos de Error

### **401 Unauthorized**
```json
{
  "detail": "Authentication credentials were not provided."
}
```
**Solución:** Incluir token JWT válido en header `Authorization`

### **400 Bad Request**
```json
{
  "detail": "Invalid page number."
}
```
**Solución:** Verificar que `page` y `page_size` sean números válidos

### **404 Not Found**
```json
{
  "detail": "Not found."
}
```
**Solución:** El usuario no tiene permisos o el endpoint no existe

---

## 📊 Notas Importantes

1. **Filtros se aplican en BD**: Todos los filtros (`search`, `category`, `stock_status`, etc.) se aplican ANTES de paginar. Esto significa que los 10 productos que ves son ya filtrados.

2. **Búsqueda case-insensitive**: El `search` busca en nombre y SKU sin importar mayúsculas/minúsculas.

3. **Paginación 1-indexed**: Las páginas comienzan en 1, no en 0.

4. **DefaultOrder**: Por defecto, los productos se ordenan por fecha de creación descendente (`-created_at`). Cambiar con parámetro `ordering`.

5. **Máx items por página**: No se puede solicitar más de 100 items por página (para rendimiento).

6. **Permisos**: Los usuarios normales solo ven sus propios productos. Solo admins ven todos.

---

## 🚀 Próximos Pasos

1. Copiar el composable `useProducts.js` en tu proyecto
2. Usarlo en los componentes que muestren listados
3. Conectar con tu selector visual de items/página
4. Testear con diferentes combinaciones de filtros
5. Implementar debounce en búsqueda (opcional pero recomendado)

---

**¿Preguntas?** Contáctame para aclaraciones adicionales.
