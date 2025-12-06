# 🗄️ Guía para Crear la Base de Datos y Tablas

## Configuración Actual

Tu proyecto está configurado para usar MySQL con las siguientes credenciales (ver `.env`):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Maria123
DB_NAME=visa_bot_db
```

## 📝 Modelos Definidos

Tu aplicación tiene 2 tablas principales:

### 1. **users** (Usuarios)
- `id` - ID único
- `email` - Email único del usuario
- `hashed_password` - Contraseña encriptada
- `role` - Rol (admin/customer)
- `is_active` - Si el usuario está activo
- `created_at` - Fecha de creación

### 2. **documents** (Documentos)
- `id` - ID único
- `user_id` - Referencia al usuario
- `category` - Categoría del documento
- `original_name` - Nombre original del archivo
- `stored_name` - Nombre almacenado
- `mime_type` - Tipo de archivo
- `size_bytes` - Tamaño en bytes
- `status` - Estado (pending/approved/rejected)
- `admin_notes` - Notas del administrador
- `created_at` - Fecha de creación

---

## 🚀 Métodos para Crear la Base de Datos

### **Método 1: Usando el Script Automático (RECOMENDADO)**

Ejecuta el script que he creado:

```bash
python setup_database.py
```

Este script:
1. ✅ Crea la base de datos `visa_bot_db` si no existe
2. ✅ Crea todas las tablas definidas en los modelos
3. ✅ Verifica que todo se haya creado correctamente

---

### **Método 2: Usando el Script Original**

Si prefieres usar el script original del proyecto:

```bash
python -m app._init_db_once
```

**NOTA:** Este método asume que la base de datos `visa_bot_db` ya existe.

---

### **Método 3: Manualmente con MySQL**

#### Paso 1: Conectar a MySQL

Abre MySQL Workbench, phpMyAdmin, o la línea de comandos de MySQL:

```bash
# Si tienes mysql en el PATH
mysql -u root -p
# Ingresa la contraseña: Maria123
```

#### Paso 2: Crear la Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS visa_bot_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE visa_bot_db;
```

#### Paso 3: Crear las Tablas Manualmente

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de documentos
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    original_name VARCHAR(255),
    stored_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes INT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    admin_notes VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Paso 4: Verificar

```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE documents;
```

---

## ✅ Verificación

Para verificar que todo está funcionando correctamente:

### 1. Verificar que MySQL está corriendo

```bash
# Windows
Get-Service MySQL*
```

### 2. Verificar la conexión desde Python

```bash
python -c "from app.core.db import engine; print('✅ Conexión exitosa' if engine.connect() else '❌ Error')"
```

### 3. Verificar las tablas

```bash
python -c "from sqlalchemy import inspect; from app.core.db import engine; print(inspect(engine).get_table_names())"
```

---

## 🔧 Solución de Problemas

### Error: "Can't connect to MySQL server"
- ✅ Verifica que MySQL esté corriendo
- ✅ Verifica el puerto (3306)
- ✅ Verifica las credenciales en `.env`

### Error: "Access denied for user"
- ✅ Verifica el usuario y contraseña en `.env`
- ✅ Asegúrate de que el usuario tiene permisos

### Error: "Unknown database"
- ✅ Ejecuta primero `setup_database.py` o crea la base de datos manualmente

### Error al importar módulos
- ✅ Asegúrate de estar en el directorio correcto
- ✅ Verifica que todas las dependencias estén instaladas: `pip install -r requirements.txt`

---

## 📚 Próximos Pasos

Una vez creada la base de datos:

1. **Iniciar el servidor:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Crear un usuario administrador** (si es necesario)

3. **Probar los endpoints** usando Postman o la colección incluida

4. **Verificar la documentación** en: http://localhost:8000/docs

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas, verifica:
- [ ] MySQL está instalado y corriendo
- [ ] Las credenciales en `.env` son correctas
- [ ] Todas las dependencias están instaladas
- [ ] Estás en el directorio correcto del proyecto
