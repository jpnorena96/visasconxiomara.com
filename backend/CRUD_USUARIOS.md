# 📚 Documentación CRUD de Usuarios - Xiomara Backend

## 🎯 Resumen

Se ha implementado un sistema completo de CRUD (Create, Read, Update, Delete) para la gestión de usuarios en el backend de Xiomara. Este sistema incluye:

- ✅ **Repositorio expandido** con todas las operaciones CRUD
- ✅ **Schemas completos** para validación de datos
- ✅ **Endpoints REST** para todas las operaciones
- ✅ **Usuarios de prueba** insertados automáticamente
- ✅ **Permisos de administrador** en todos los endpoints

---

## 🗂️ Estructura de Archivos Modificados/Creados

```
backend/
├── app/
│   ├── repositories/
│   │   └── user_repo.py          ✨ EXPANDIDO - Métodos CRUD completos
│   ├── schemas/
│   │   └── user.py                ✨ EXPANDIDO - Schemas para CRUD
│   ├── api/v1/
│   │   └── users.py               🆕 NUEVO - Endpoints CRUD
│   └── main.py                    ✨ MODIFICADO - Router registrado
├── seed_users.py                  🆕 NUEVO - Script de seed
└── CRUD_USUARIOS.md               🆕 NUEVO - Esta documentación
```

---

## 👥 Usuarios de Prueba Insertados

### 🔐 Administradores

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| `admin@xiomara.com` | `admin123` | admin | Administrador principal |
| `admin2@xiomara.com` | `admin123` | admin | Administrador secundario |

### 👤 Clientes

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| `cliente1@example.com` | `cliente123` | customer | Cliente de prueba 1 |
| `cliente2@example.com` | `cliente123` | customer | Cliente de prueba 2 |
| `maria@example.com` | `maria123` | customer | Cliente María |
| `juan@example.com` | `juan123` | customer | Cliente Juan |

---

## 🔌 Endpoints Disponibles

Todos los endpoints requieren autenticación como **administrador**.

Base URL: `http://localhost:8000/api/v1/admin/users`

### 1. **Obtener Estadísticas** 📊

```http
GET /api/v1/admin/users/stats
```

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Respuesta:**
```json
{
  "total_users": 6,
  "total_admins": 2,
  "total_customers": 4,
  "active_users": 6
}
```

---

### 2. **Listar Usuarios** 📋

```http
GET /api/v1/admin/users?skip=0&limit=100&role=customer
```

**Query Parameters:**
- `skip` (opcional): Número de registros a saltar (paginación)
- `limit` (opcional): Límite de registros (máx 100)
- `role` (opcional): Filtrar por rol (`admin` o `customer`)

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "email": "admin@xiomara.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2025-12-05T19:15:00"
  },
  {
    "id": 2,
    "email": "cliente1@example.com",
    "role": "customer",
    "is_active": true,
    "created_at": "2025-12-05T19:15:01"
  }
]
```

---

### 3. **Obtener Usuario por ID** 🔍

```http
GET /api/v1/admin/users/{user_id}
```

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Respuesta:**
```json
{
  "id": 1,
  "email": "admin@xiomara.com",
  "role": "admin",
  "is_active": true,
  "created_at": "2025-12-05T19:15:00"
}
```

---

### 4. **Crear Usuario** ➕

```http
POST /api/v1/admin/users
```

**Headers:**
```
Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Validaciones:**
- Email debe ser válido
- Password mínimo 6 caracteres
- Role debe ser `admin` o `customer`

**Respuesta:** (Status 201)
```json
{
  "id": 7,
  "email": "nuevo@example.com",
  "role": "customer",
  "is_active": true,
  "created_at": "2025-12-05T19:20:00"
}
```

---

### 5. **Actualizar Usuario** ✏️

```http
PUT /api/v1/admin/users/{user_id}
```

**Headers:**
```
Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Body:** (todos los campos son opcionales)
```json
{
  "email": "nuevo_email@example.com",
  "role": "admin",
  "is_active": false
}
```

**Respuesta:**
```json
{
  "id": 7,
  "email": "nuevo_email@example.com",
  "role": "admin",
  "is_active": false,
  "created_at": "2025-12-05T19:20:00"
}
```

---

### 6. **Cambiar Contraseña** 🔑

```http
PATCH /api/v1/admin/users/{user_id}/password
```

**Headers:**
```
Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Body:**
```json
{
  "new_password": "nueva_password123"
}
```

**Respuesta:**
```json
{
  "id": 7,
  "email": "nuevo_email@example.com",
  "role": "admin",
  "is_active": true
}
```

---

### 7. **Activar/Desactivar Usuario** 🔄

```http
PATCH /api/v1/admin/users/{user_id}/toggle-active
```

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Respuesta:**
```json
{
  "id": 7,
  "email": "nuevo_email@example.com",
  "role": "admin",
  "is_active": false
}
```

**Nota:** No puedes desactivar tu propia cuenta de administrador.

---

### 8. **Eliminar Usuario** 🗑️

```http
DELETE /api/v1/admin/users/{user_id}
```

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Respuesta:** (Status 204 - No Content)

**Nota:** No puedes eliminar tu propia cuenta de administrador.

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Usando Swagger UI (Recomendado)

1. Inicia el servidor:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Abre en tu navegador:
   ```
   http://localhost:8000/docs
   ```

3. **Autenticarse:**
   - Ve a `/api/v1/login`
   - Usa las credenciales de admin:
     ```json
     {
       "email": "admin@xiomara.com",
       "password": "admin123"
     }
     ```
   - Copia el `access_token` de la respuesta

4. **Autorizar en Swagger:**
   - Haz clic en el botón "Authorize" (🔒)
   - Ingresa: `Bearer {tu_token}`
   - Haz clic en "Authorize"

5. **Probar endpoints:**
   - Ahora puedes probar todos los endpoints de `/api/v1/admin/users`

---

### Opción 2: Usando cURL

1. **Login:**
```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@xiomara.com","password":"admin123"}'
```

2. **Guardar el token** (reemplaza YOUR_TOKEN con el token recibido)

3. **Listar usuarios:**
```bash
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. **Crear usuario:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"customer"}'
```

---

### Opción 3: Usando Postman

1. Importa la colección: `collection_postman.json`
2. Crea una variable de entorno `token`
3. Haz login y guarda el token
4. Prueba los endpoints

---

## 📝 Métodos del Repositorio

El archivo `app/repositories/user_repo.py` ahora incluye:

| Método | Descripción |
|--------|-------------|
| `get_by_id(user_id)` | Obtener usuario por ID |
| `get_by_email(email)` | Obtener usuario por email |
| `create(email, hashed_password, role)` | Crear nuevo usuario |
| `list_all(skip, limit)` | Listar todos con paginación |
| `list_customers()` | Listar solo clientes |
| `list_admins()` | Listar solo administradores |
| `update(user, **kwargs)` | Actualizar campos de usuario |
| `update_password(user, hashed_password)` | Cambiar contraseña |
| `toggle_active(user)` | Activar/desactivar usuario |
| `delete(user)` | Eliminar usuario |
| `count_by_role(role)` | Contar usuarios por rol |
| `count_all()` | Contar todos los usuarios |

---

## 🔒 Seguridad

- ✅ Todos los endpoints requieren autenticación de administrador
- ✅ Las contraseñas se hashean con bcrypt
- ✅ No se puede eliminar o desactivar la propia cuenta de admin
- ✅ Validación de emails únicos
- ✅ Validación de roles permitidos

---

## 🚀 Comandos Útiles

### Reinsertar usuarios de prueba:
```bash
python seed_users.py
```

### Verificar usuarios en la base de datos:
```bash
python -c "from app.core.db import SessionLocal; from app.repositories.user_repo import UserRepo; db = SessionLocal(); users = UserRepo(db).list_all(); print(f'Total usuarios: {len(users)}'); [print(f'- {u.email} ({u.role})') for u in users]"
```

### Contar usuarios por rol:
```bash
python -c "from app.core.db import SessionLocal; from app.repositories.user_repo import UserRepo; db = SessionLocal(); repo = UserRepo(db); print(f'Admins: {repo.count_by_role(\"admin\")}'); print(f'Customers: {repo.count_by_role(\"customer\")}')"
```

---

## 🎨 Próximos Pasos Sugeridos

1. **Frontend:** Crear interfaz de administración para gestionar usuarios
2. **Filtros avanzados:** Agregar búsqueda por email, fecha de creación, etc.
3. **Soft delete:** Implementar eliminación suave en lugar de hard delete
4. **Auditoría:** Registrar quién modificó qué y cuándo
5. **Roles personalizados:** Expandir más allá de admin/customer
6. **Permisos granulares:** Sistema de permisos más detallado

---

## 🆘 Solución de Problemas

### Error: "Usuario no encontrado"
- Verifica que el ID existe en la base de datos
- Usa el endpoint de listar usuarios para ver los IDs disponibles

### Error: "El email ya está registrado"
- El email debe ser único en el sistema
- Verifica que no exista otro usuario con ese email

### Error: "Credenciales inválidas"
- Verifica que estés usando las credenciales correctas
- Asegúrate de que el usuario sea administrador

### Error: "No puedes eliminar tu propia cuenta"
- Por seguridad, no puedes eliminar o desactivar tu propia cuenta de admin
- Usa otra cuenta de administrador para hacer cambios

---

## 📞 Soporte

Si tienes problemas o preguntas, revisa:
1. Los logs del servidor
2. La documentación de Swagger en `/docs`
3. Los ejemplos en esta documentación

---

**¡Listo para usar! 🎉**
