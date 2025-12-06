# 🚀 Xiomara Visa Portal - Backend

Backend completo para el portal de gestión de visas de Xiomara, construido con FastAPI, SQLAlchemy y MySQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Inicialización](#inicialización)
- [Modelos de Datos](#modelos-de-datos)
- [API Endpoints](#api-endpoints)
- [Desarrollo](#desarrollo)

## ✨ Características

- ✅ Autenticación JWT con roles (admin/customer)
- ✅ Gestión completa de usuarios
- ✅ Gestión de clientes con perfiles detallados
- ✅ Sistema de carga y revisión de documentos
- ✅ Formulario de solicitud de visa (7 pasos)
- ✅ Categorías de documentos configurables
- ✅ Registro de actividades (audit log)
- ✅ API RESTful completa
- ✅ Documentación automática con Swagger/OpenAPI
- ✅ Validación de datos con Pydantic
- ✅ Migraciones de base de datos

## 🛠️ Tecnologías

- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy 2.0** - ORM para Python
- **MySQL 8.0+** - Base de datos relacional
- **Pydantic** - Validación de datos
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hashing de contraseñas
- **Python 3.11+** - Lenguaje de programación

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── api/              # Endpoints de la API
│   │   ├── auth.py       # Autenticación
│   │   ├── users.py      # Gestión de usuarios
│   │   ├── clients.py    # Gestión de clientes
│   │   ├── documents.py  # Gestión de documentos
│   │   ├── forms.py      # Formularios de solicitud
│   │   └── admin.py      # Endpoints administrativos
│   ├── core/             # Configuración y utilidades
│   │   ├── config.py     # Configuración de la app
│   │   ├── db.py         # Conexión a base de datos
│   │   ├── security.py   # Seguridad y JWT
│   │   └── deps.py       # Dependencias
│   ├── models/           # Modelos SQLAlchemy
│   │   ├── user.py       # Usuario
│   │   ├── client.py     # Cliente
│   │   ├── document.py   # Documento
│   │   ├── intake_form.py # Formulario
│   │   ├── category.py   # Categoría
│   │   └── activity.py   # Actividad
│   ├── schemas/          # Schemas Pydantic
│   │   ├── user.py
│   │   ├── client.py
│   │   ├── document.py
│   │   ├── intake_form.py
│   │   ├── category.py
│   │   └── activity.py
│   ├── repositories/     # Capa de acceso a datos
│   └── main.py           # Punto de entrada
├── .env                  # Variables de entorno
├── requirements.txt      # Dependencias
├── init_backend.py       # Script de inicialización
├── setup_database.py     # Setup de base de datos
└── README.md             # Este archivo
```

## 🔧 Instalación

### Prerrequisitos

- Python 3.11 o superior
- MySQL 8.0 o superior
- pip (gestor de paquetes de Python)

### Pasos

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Crear entorno virtual**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

## ⚙️ Configuración

1. **Crear archivo `.env`** en la carpeta `backend/`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=xiomara_db

# Security
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5173
```

2. **Asegúrate de que MySQL esté corriendo**
   ```bash
   # Windows
   net start MySQL80
   
   # Linux
   sudo systemctl start mysql
   ```

## 🚀 Inicialización

### Opción 1: Script Completo (Recomendado)

Ejecuta el script de inicialización que crea todo automáticamente:

```bash
python init_backend.py
```

Este script:
- ✅ Crea la base de datos
- ✅ Crea todas las tablas (6 tablas)
- ✅ Crea usuario admin (admin@xiomara.com / admin123)
- ✅ Crea usuario de prueba (test@example.com / test123)
- ✅ Pobla 10 categorías de documentos

### Opción 2: Paso a Paso

```bash
# 1. Crear base de datos y tablas
python setup_database.py

# 2. Crear usuarios
python seed_users.py

# 3. Crear categorías
python seed_categories.py
```

## 💾 Modelos de Datos

### 1. User (Usuario)
```python
- id: int
- email: str (único)
- hashed_password: str
- role: str (admin|customer)
- is_active: bool
- created_at: datetime
```

### 2. Client (Cliente)
```python
- id: int
- user_id: int (FK)
- first_name: str
- last_name: str
- phone: str
- destination_country: str
- visa_type: str
- status: str (pending|active|completed|inactive)
- progress: int (0-100)
- total_documents: int
- pending_documents: int
- notes: text
- join_date: datetime
- last_activity: datetime
```

### 3. Document (Documento)
```python
- id: int
- user_id: int (FK)
- category: str
- original_name: str
- stored_name: str
- mime_type: str
- size_bytes: int
- status: str (pending|approved|rejected)
- admin_notes: str
- created_at: datetime
```

### 4. IntakeForm (Formulario)
```python
- id: int
- user_id: int (FK)
- apellidos, nombres, fecha_nacimiento
- nacionalidad, pasaporte
- nivel_educativo, institucion
- ocupacion, compania
- padre_nombre, madre_nombre
- viajes, familiares_exterior
- is_completed: bool
- completed_at: datetime
```

### 5. Category (Categoría)
```python
- id: int
- name: str (único)
- description: str
- is_required: bool
- display_order: int
- is_active: bool
```

### 6. Activity (Actividad)
```python
- id: int
- user_id: int (FK)
- activity_type: str
- title: str
- description: text
- metadata: text (JSON)
- performed_by_id: int (FK)
- performed_by_email: str
- created_at: datetime
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `GET /api/v1/auth/me` - Usuario actual

### Usuarios (Admin)
- `GET /api/v1/users` - Listar usuarios
- `GET /api/v1/users/{id}` - Obtener usuario
- `PUT /api/v1/users/{id}` - Actualizar usuario
- `DELETE /api/v1/users/{id}` - Eliminar usuario

### Clientes (Admin)
- `GET /api/v1/admin/clients` - Listar clientes
- `GET /api/v1/admin/clients/{id}` - Obtener cliente
- `PUT /api/v1/admin/clients/{id}` - Actualizar cliente
- `GET /api/v1/admin/clients/{id}/documents` - Documentos del cliente

### Documentos
- `POST /api/v1/documents/upload` - Subir documento
- `GET /api/v1/documents` - Listar mis documentos
- `GET /api/v1/documents/{id}` - Obtener documento
- `DELETE /api/v1/documents/{id}` - Eliminar documento
- `PATCH /api/v1/admin/documents/{id}` - Revisar documento (Admin)

### Formularios
- `POST /api/v1/forms` - Crear/actualizar formulario
- `GET /api/v1/forms/me` - Obtener mi formulario
- `GET /api/v1/admin/forms` - Listar formularios (Admin)

### Categorías (Admin)
- `GET /api/v1/categories` - Listar categorías
- `POST /api/v1/admin/categories` - Crear categoría
- `PUT /api/v1/admin/categories/{id}` - Actualizar categoría
- `DELETE /api/v1/admin/categories/{id}` - Eliminar categoría

### Actividades (Admin)
- `GET /api/v1/admin/activities` - Listar actividades
- `GET /api/v1/admin/activities/recent` - Actividades recientes

## 🏃 Desarrollo

### Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
uvicorn app.main:app --reload

# Especificar puerto
uvicorn app.main:app --reload --port 8000

# Con host específico
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Acceder a la documentación

Una vez iniciado el servidor:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Probar endpoints

1. **Usando Swagger UI** (http://localhost:8000/docs)
   - Interfaz interactiva para probar todos los endpoints
   - Incluye autenticación JWT

2. **Usando cURL**
   ```bash
   # Login
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@xiomara.com","password":"admin123"}'
   
   # Obtener usuario actual (con token)
   curl -X GET http://localhost:8000/api/v1/auth/me \
     -H "Authorization: Bearer TU_TOKEN_AQUI"
   ```

3. **Usando Postman**
   - Importa el archivo `collection_postman.json` incluido

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Protección de rutas por roles
- ✅ Validación de datos con Pydantic
- ✅ CORS configurado
- ✅ SQL injection prevention (SQLAlchemy)

## 📝 Usuarios por Defecto

Después de ejecutar `init_backend.py`:

**Administrador:**
- Email: `admin@xiomara.com`
- Password: `admin123`
- Rol: `admin`

**Cliente de Prueba:**
- Email: `test@example.com`
- Password: `test123`
- Rol: `customer`

⚠️ **IMPORTANTE**: Cambia estas contraseñas en producción.

## 🐛 Troubleshooting

### Error de conexión a MySQL
```
Solución:
1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en .env
3. Verifica que el puerto 3306 esté disponible
```

### Error al crear tablas
```
Solución:
1. Verifica que el usuario tenga permisos
2. Elimina la base de datos y vuelve a ejecutar init_backend.py
```

### Error de importación de módulos
```
Solución:
1. Activa el entorno virtual
2. Reinstala dependencias: pip install -r requirements.txt
```

## 📚 Recursos Adicionales

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 👥 Soporte

Para reportar problemas o solicitar características, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para Xiomara Visa Portal**
