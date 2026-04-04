# 📋 PLAN DE REFACTORIZACIÓN - Frontend nurax_inventario

**Fecha de inicio**: Abril 4, 2026  
**Objetivo**: Reestructurar frontend para consumir correctamente ARCHITECTURE_V2 del backend

---

## 📊 RESUMEN DE FASES

| # | Fase | Estado | Duración | Archivos |
|---|------|--------|----------|----------|
| 1 | Eliminar Landing Page & Redireccionar a Login | ✅ **COMPLETADA** | 5 min | 2 |
| 2 | Actualizar API Services para ARCHITECTURE_V2 | ⏳ Por iniciar | 45 min | 9 |
| 3 | Crear Stores Pinia para Auth & Admin | ⏳ Por iniciar | 30 min | 2 |
| 4 | Crear/Actualizar Componentes de Login | ⏳ Por iniciar | 20 min | 1 |
| 5 | Crear Componentes Admin (CRUD Clientes) | ⏳ Por iniciar | 60 min | 3 |
| 6 | Actualizar Composables | ⏳ Por iniciar | 20 min | 2 |
| 7 | Integración de Foto de Perfil | ⏳ Por iniciar | 40 min | 3 |
| 8 | Testing & Ajustes Finales | ⏳ Por iniciar | 60 min | ~20 |
| | **TOTAL** | - | **280 min (4.7 hrs)** | ~50 |

---

## ✅ FASE 1: Eliminar Landing Page & Redireccionar a Login

**Estado**: ✅ **COMPLETADA**  
**Fecha completada**: Abril 4, 2026  
**Duración real**: ~10 minutos

### Cambios realizados

#### ✅ router/index.ts
- ❌ Eliminado: `import LandingPage from '@/views/LandingPage.vue'`
- ❌ Eliminado: Comentario `// Views - Landing`
- ✅ Ruta raíz `/` ahora apunta a `Login` component
- ✅ Eliminada ruta `/auth/login` (redundante)
- ✅ Catch-all redirige a `/` en lugar de `/auth/login`
- ✅ Guard de navegación actualizado con nueva ruta raíz

#### ✅ views/LandingPage.vue
- ❌ Archivo eliminado del proyecto

### Verificación
```
✅ Router compilado sin errores
✅ Ruta raíz apunta a Login
✅ Guard redirige correctamente a dashboard según rol
✅ Catch-all redirect funciona
```

---

## ⏳ FASE 2: Actualizar API Services para ARCHITECTURE_V2

**Estado**: ⏳ **Por iniciar**  
**Archivos**: 9 services  
**Cambios**: ~6 nuevos endpoints + actualización de existentes

### Cambios planificados

#### auth.service.ts (Principal)
```typescript
// ACTUALIZACIONES
POST /api/v1/auth/login/  // cambio de ruta

// NUEVOS ENDPOINTS
GET /api/v1/accounts/users/me/
PATCH /api/v1/accounts/users/me/
PATCH /api/v1/accounts/users/change_password/
POST /api/v1/accounts/clients/
PATCH /api/v1/accounts/clients/{id}/
GET /api/v1/accounts/clients/
GET /api/v1/accounts/stores/
```

#### products.service.ts
- Agregar parámetro `store_id` a todos los endpoints

#### sales.service.ts
- Incluir `store_id` en request body
- Incluir `cash_shift_id` en crear venta

#### shifts.service.ts
- Cambiar endpoints para CashShift
- Incluir `store_id` requerido

#### suppliers.service.ts
- Agregar `store_id` a filtros

#### expenses.service.ts
- Nuevos endpoints para CashMovement, PurchaseOrder

#### store-settings.service.ts
- Actualizar para Store model

---

## ⏳ FASE 3: Crear Stores Pinia para Auth & Admin

**Estado**: ⏳ **Por iniciar**  
**Archivos**: 2 (nuevos)

### Stores planificadas

#### stores/auth.store.ts
```typescript
State:
- currentUser
- currentStore
- isAuthenticated
- tokens
- loading

Getters:
- isAdmin
- isLoggedIn

Actions:
- login(email, password)
- logout()
- fetchProfile()
- updateProfile(name, email)
- changePassword()
- uploadProfilePhoto()
- selectStore()
- restoreSession()
```

#### stores/admin.store.ts
```typescript
State:
- clients []
- selectedClient
- loading
- filters

Getters:
- clientCount
- searchedClients

Actions:
- fetchClients(storeId)
- createClient(data)
- updateClient(id, data)
- deleteClient(id)
- selectClient(id)
- clearClients()
```

---

## ⏳ FASE 4: Crear/Actualizar Componentes de Login

**Estado**: ⏳ **Por iniciar**  
**Archivo**: 1 (actualizar)

### Cambios en views/Login.vue
- Consumir `/api/v1/auth/login/`
- Usar `useAuthStore()`
- Redirigir según rol:
  - Admin → `/dashboard/clients`
  - Cliente → `/dashboard/inventory`
- Loading states mejorados
- Error handling robusto

---

## ⏳ FASE 5: Crear Componentes Admin (CRUD Clientes)

**Estado**: ⏳ **Por iniciar**  
**Archivos**: 3

### Componentes planificados

#### views/AdminClients.vue (Actualizar/Recrear)
- Tabla de clientes con columnas: Nombre | Email | Límite Crédito | Acciones
- Botón "+ Nuevo Cliente"
- Acciones: Editar | Eliminar
- Integración con `useAdminStore()`

#### components/admin/ClientFormModal.vue (NUEVO)
- Form con campos: name, email, credit_limit
- Modo: create | edit
- Validación frontend
- Botones: Guardar | Cancelar

#### components/admin/ClientsTable.vue (NUEVO - opcional)
- Tabla reutilizable
- Slots para customización

---

## ⏳ FASE 6: Actualizar Composables

**Estado**: ⏳ **Por iniciar**  
**Archivos**: 2

### Cambios planificados

#### composables/useAuth.ts (Actualizar)
- Usar `useAuthStore()` internamente
- Mantener interfaz hacia componentes
- Remover duplicación de lógica

#### composables/useClients.ts (NUEVO - opcional)
- Helper para operaciones de clientes
- Usa `useAdminStore()` internamente

---

## ⏳ FASE 7: Integración de Foto de Perfil

**Estado**: ⏳ **Por iniciar**  
**Archivos**: 3

### Componentes planificados

#### components/auth/ProfilePhotoUploader.vue (NUEVO)
- Preview de foto actual
- Input file
- Upload a Cloudinary vía backend
- Loading state

#### views/Settings.vue (Actualizar/Recrear)
- Sección "Mi Perfil" con ProfilePhotoUploader
- Sección "Cambiar Contraseña"
- Sección "Datos Almacén" (admin only)

#### auth.service.ts (Expandir)
- Método `uploadProfilePhoto(file)`

---

## ⏳ FASE 8: Testing & Ajustes Finales

**Estado**: ⏳ **Por iniciar**  
**Archivos**: Todos (revisión)

### Testing checklist

#### ✅ Flujo Admin
- [ ] Login con admin credentials
- [ ] Redirige a `/dashboard/clients`
- [ ] Ver tabla de clientes
- [ ] Crear nuevo cliente
- [ ] Editar cliente existente
- [ ] Eliminar cliente
- [ ] Cambiar contraseña
- [ ] Cambiar foto de perfil

#### ✅ Flujo Cliente
- [ ] Login con cliente credentials
- [ ] Redirige a `/dashboard/inventory`
- [ ] Acceder a Settings
- [ ] Cambiar foto
- [ ] Cambiar contraseña

#### ✅ Error Handling
- [ ] Credenciales inválidas
- [ ] Campos requeridos
- [ ] Archivo muy grande
- [ ] Sin conexión
- [ ] Validación backend

---

## 📝 NOTAS IMPORTANTES

### Endpoints Backend (ARCHITECTURE_V2)
```
Base URL: http://localhost:8000/api/v1/

Auth:
- POST /auth/login/

Accounts:
- GET /accounts/users/me/
- PATCH /accounts/users/me/
- PATCH /accounts/users/change_password/
- GET /accounts/stores/
- POST /accounts/clients/
- PATCH /accounts/clients/{id}/
- GET /accounts/clients/

Products:
- GET /products/products/ ?store_id=xxx
- POST /products/categories/ body.store
- GET /products/suppliers/ ?store_id=xxx
- etc.
```

### Admin Credentials (para testing)
```
Email: uzieltzab8@gmail.com
Password: 2jusni!+1
```

### Multitenancy
- Todos los requests deben incluir `store_id`
- Backend filtra datos por StoreMembership del usuario
- QuerySet filtering por `user.storemembership_set.values_list('store_id')`

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar backend** ⚠️ (problema reportado)
2. Iniciar FASE 2 (auth.service.ts primero)
3. Crear Pinia stores (FASE 3)
4. Actualizar Login component (FASE 4)
5. Crear admin CRUD (FASE 5)
6. Testing completo (FASE 8)

---

## 📅 HISTORIAL DE CAMBIOS

### Abril 4, 2026 - Mañana
- **FASE 1 COMPLETADA**: Eliminada Landing Page, Login como ruta raíz

### Abril 4, 2026 - Tarde
- **⚠️ Backend Critical Issue Found**: Admin panel crash + database schema mismatch
- **🔧 Fixed Issues**:
  - ✅ accounts/serializers.py: Removed orphaned `StoreProfileSerializer`
  - ✅ All 20 models: Added missing `created_at` and `updated_at` timestamp fields
  - ✅ Database: Reset and recreated tables (new migration 0001_initial + 0002_fix_admin_dependency)
  - ✅ Django check: PASSED ✅ "System check identified no issues"

- **📊 Backend Status - NOW FULLY OPERATIONAL**:
  - ✅ Admin panel online - no import errors
  - ✅ All models with UUID primary keys + timestamps
  - ✅ Database tables created and synced
  - ✅ Ready for API testing

- **Next Action**: Begin FASE 2 - Update API Services

---

**Documento actualizado**: Abril 4, 2026  
**Responsable**: GitHub Copilot
