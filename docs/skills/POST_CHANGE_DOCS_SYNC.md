---
name: frontend-documentation-sync
description: >
  SKILL de Auto-Sincronización de Documentación.
  Se ejecuta OBLIGATORIAMENTE después de cada modificación en src/services/
  Mantiene docs/skills/API_URLS_VERIFICATION.md actualizada automáticamente.
---

# 🔄 SKILL - Auto-Sincronización Documentación Frontend

**Tipo:** Obligatorio Post-Cambio  
**Ejecutar después de:** Modificaciones en `src/services/`  
**Tiempo requerido:** 2-3 minutos  

---

## 🎯 Objetivo

Cada vez que modifiques URL, endpoint, o agregues un método en los servicios del frontend, DEBES actualizar la documentación para mantenerla sincronizada.

**Sin esto:** Los próximos desarrolladores harán cambios duplicados o incompletos.

---

## 📋 CHECKLIST - Después de Cambiar un Servicio

### Para CADA cambio que hagas en `src/services/*`:

- [ ] 1. **Identifica** qué métodos/URLs cambiaron
- [ ] 2. **Localiza** la sección en `API_URLS_VERIFICATION.md`
- [ ] 3. **Actualiza** la tabla de URLs
- [ ] 4. **Agrega** comentarios en el código con referencia
- [ ] 5. **Valida** con curl o llamada de prueba
- [ ] 6. **Documenta** en el Git commit message

---

## 📝 Guía por Tipo de Cambio

### **Caso 1: Corrijo una URL (la corregí como el kardex)**

```typescript
// ANTES ❌
async getProductKardex(productId) {
  return apiClient.get(`/products/${productId}/kardex/`);
}

// DESPUÉS ✅
async getProductKardex(productId) {
  return apiClient.get(`/v1/inventory/transactions/?product=${productId}`);
}
```

**Acciones de documentación:**

1. Editar `docs/skills/API_URLS_VERIFICATION.md`
2. Buscar sección `products.service.ts`
3. Actualizar tabla:

```markdown
// ANTES
| GET | `/products/{id}/kardex/` | ❌ NO EXISTE | ❌ |

// DESPUÉS  
| GET | `/v1/inventory/transactions/?product=ID` | ✅ Filtro |✅ |
```

4. Agregar nota en "Problemas Identificados" si fue crítico
5. Git commit:
   ```
   git commit -m "fix(docs): actualizar URL de kardex después de corrección"
   ```

---

### **Caso 2: Agrego un nuevo método**

```typescript
// NUEVO ✨
async getProductStats(productId) {
  return apiClient.get(`/v1/products/products/${productId}/stats/`);
}
```

**Acciones de documentación:**

1. Editar `docs/skills/API_URLS_VERIFICATION.md`
2. Agregar fila en tabla `products.service.ts`:
   ```markdown
   | GET | `/v1/products/products/{id}/stats/` | ✅ Nuevo | ✅ |
   ```
3. Agregar comentario en el código:
   ```typescript
   /**
    * ✅ ENDPOINT CORRECTO: GET /v1/products/products/{id}/stats/
    */
   async getProductStats(productId) {
   ```
4. Git commit:
   ```
   git commit -m "feat: agregar método getProductStats - GET /v1/products/products/{id}/stats/"
   ```

---

### **Caso 3: Cambio estructura de un endpoint**

```typescript
// ANTES
async createProduct(data) {
  return apiClient.post(`/v1/products/products/`, {
    name: data.name,
    price: data.price
  });
}

// DESPUÉS - Cambio estructura del payload
async createProduct(data) {
  return apiClient.post(`/v1/products/products/`, {
    name: data.name,
    price: data.price,
    supplier: data.supplierId  // ← NUEVO CAMPO
  });
}
```

**Acciones de documentación:**

1. Editar `docs/skills/API_URLS_VERIFICATION.md`
2. Buscar sección y agregar nota:
   ```markdown
   **Actualizado:** 2-Abr-26 - Agregar campo `supplier` a POST  
   ```
3. Si es cambio breaking, actualizar tabla
4. Git commit:
   ```
   git commit -m "refactor(services): agregar campo supplier a createProduct"
   ```

---

## 🔍 Checklist de Validación

**Antes de hacer COMMIT:**

### Validación 1: URL está en docs
```bash
# Buscar tu nueva URL en documentación
grep -i "tu/nueva/url" docs/skills/API_URLS_VERIFICATION.md

# ✅ Si sale resultado: OK - continuar
# ❌ Si no sale: AGREGAR A DOCS AHORA
```

### Validación 2: Formato correcto
```typescript
// Verificar estos puntos:
✅ Empieza con /v1/ o /auth/ (SIN /api/)
✅ Tiene comentario con referencia ()
✅ Es accesible desde apiClient (get/post/put/patch/delete)
✅ No duplica rutas ya existentes
```

### Validación 3: Backend existe
```bash
# Verificar que la ruta existe en backend
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/tu/nueva/url/ \
  -X GET
# ✅ 200 OK = Existe
# ❌ 404 Not Found = No existe - REVISAR
```

### Validación 4: Documentación actualizada
```bash
# Debe existir una tabla con la URL
grep -B5 -A5 "/v1/tu/nueva/url/" docs/skills/API_URLS_VERIFICATION.md
# ✅ Debe mostrar la URL en una tabla
```

---

## 📊 Template de Actualización

Copia esto y completa cuando agregues un nuevo servicio/endpoint:

```markdown
### **Nº€ nuevo-servicio.service.ts** STATUS

**Archivo:** `src/services/nuevo-servicio.service.ts`

| Método | Ruta Frontend | Backend | Estado |
|--------|--------------|---------|--------|
| GET | `/v1/nuevo/items/` | ✅ | ✅ |
| POST | `/v1/nuevo/items/` | ✅ | ✅ |
| GET | `/v1/nuevo/items/{id}/` | ✅ | ✅ |
| PUT | `/v1/nuevo/items/{id}/` | ✅ | ✅ |
| DELETE | `/v1/nuevo/items/{id}/` | ✅ | ✅ |

**Notas:**
- [Agregar notas relevantes aquí]
```

---

## 🚨 Señales de Alerta

Si ves CUALQUIERA de esto → ACTUALIZA DOCS INMEDIATAMENTE:

```
🚨 Error 404 en frontend
🚨 Cambio en URL del backend
🚨 Nuevo método agregado
🚨 Breaking change en estructura de datos
🚨 Cambio en parámetros query
🚨 Cambio en payload de POST/PUT
```

---

## 🔗 Proceso de CI/CD Futuro

Cuando tengas CI/CD, agregar verificación:

```yaml
# .github/workflows/docs-sync.yml
- name: Verificar URLs sincronizadas
  run: |
    # Verificar que todas las URLs en servicios están en docs
    URLS_EN_CODIGO=$(grep -r "apiClient\." src/services/ | sed "s/.*apiClient\.\(post\|get\|put\|patch\|delete\)(['\"]//;s/['\"]).*//" | sort | uniq)
    URLS_EN_DOCS=$(grep "/v1/" docs/skills/API_URLS_VERIFICATION.md | sed "s/.*\`//;s/\`.*//" | sort | uniq)
    
    DIFF=$(comm -23 <(echo "$URLS_EN_CODIGO") <(echo "$URLS_EN_DOCS"))
    
    if [ ! -z "$DIFF" ]; then
      echo "❌ URLs no documentadas:"
      echo "$DIFF"
      exit 1
    fi
    echo "✅ Todas las URLs están documentadas"
```

---

## 📝 Ejemplo Real: Mi Corrección de Kardex

**Cambio hecho:**
```typescript
// ANTES
async getProductKardex(productId) {
  return apiClient.get(`/products/${productId}/kardex/`);
}

// DESPUÉS
async getProductKardex(productId) {
  return apiClient.get(`/v1/inventory/transactions/?product=${productId}`);
}
```

**Documentación actualizada:**

1. ✅ Edité `docs/skills/API_URLS_VERIFICATION.md`
2. ✅ Cambié en tabla de products.service.ts:
   ```
   | GET | `/products/{id}/kardex/` | ❌ | ❌ |
   ↓
   | GET | `/v1/inventory/transactions/?product=ID` | ✅ | ✅ |
   ```
3. ✅ Agregué comentario en código
4. ✅ Validé con curl - 200 OK
5. ✅ Git commit con descripción clara

**Resultado:** Próximos desarrolladores saben que kardex fue migrado ✅

---

## 🎓 Lecciones Aprendidas

### ❌ NO hacer esto:
```
- Cambiar URL sin actualizar docs
- Agregar nuevo servicio sin documentarlo
- Hacer cambio breaking sin notar en commit
- Copiar URLs sin entender /v1/ vs /auth/
```

### ✅ SIEMPRE hacer esto:
```
- Actualizar docs INMEDIATAMENTE después
- Agregar comentario con URL en el código
- Validar que backend tiene el endpoint
- Describir el cambio en Git commit
```

---

## 📞 Preguntas Frecuentes

**P: ¿Qué pasa si olvido actualizar docs?**  
R: El próximo cambio introducirá duplicados/conflictos. Los tests de CI/CD fallarán (cuando los tengas).

**P: ¿Quién revisa que docs esté actualizado?**  
R: En PR: Code Review. En CI/CD: Script automático. TODOS somos responsables.

**P: ¿Debo comentar TODAS las URLs?**  
R: No, solo comentar con referencia si es compleja o si fue corregida recientemente.

---

## 🏁 Checklist Final (ANTES de hacer COMMIT)

- [ ] Código está funcionando
- [ ] URL nueva/modificada está en `API_URLS_VERIFICATION.md`
- [ ] URL tiene comentario en el código
- [ ] URL fue probada con curl/API
- [ ] Backend URL existe y es accesible
- [ ] Git commit message describe el cambio
- [ ] Buscaste en docs si URL ya existía (no duplicar)
- [ ] Verificaste que NO queda `/api/` en la ruta

---

**Estado:** 🟢 ACTIVO  
**Responsables:** Todos los que modificamos services/  
**Frecuencia:** Después de CADA cambio en src/services/  
**Última actualización:** 2 de Abril, 2026
