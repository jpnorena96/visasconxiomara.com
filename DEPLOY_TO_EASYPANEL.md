# Guía de Despliegue en Easypanel (VPS Contabo)

Esta guía te ayudará a desplegar tu aplicación completa (Frontend + Backend + Base de Datos) en tu VPS con Easypanel.

## Estructura del Proyecto
Hemos preparado el proyecto para ser desplegado fácilmente:
- **Frontend** (Raíz): Tiene su propio `Dockerfile` y `nginx.conf`.
- **Backend** (`/backend`): Tiene su propio `Dockerfile` y `requirements.txt`.

## Paso 1: Preparar Git
Sube tu código a un repositorio (GitHub, GitLab, etc.).
1. Crea un repositorio vació en GitHub.
2. Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin <URL_DE_TU_REPO>
   git push -u origin main
   ```

## Paso 2: Crear Proyecto en Easypanel
1. Entra a tu Easypanel.
2. Crea un nuevo **Project** llamado `xiomara-portal`.

## Paso 3: Crear Base de Datos (MySQL)
1. Dentro del proyecto, haz clic en **+ Service** -> **Database** -> **MySQL**.
2. Dale el nombre `mysql-db`.
3. Crea el servicio.
4. Una vez creado, entra a los detalles del servicio y busca la sección **Connection Details**.
   - Anota el `Host` (usualmente es el nombre del servicio, ej: `mysql-db`).
   - Anota el `Port` (3306).
   - Anota el `Username` (root o el que se genere).
   - Anota el `Password`.
   - Anota el `Database Name`.

## Paso 4: Desplegar Backend
1. Haz clic en **+ Service** -> **App**.
2. Nombre: `backend`.
3. Source: **Git**.
   - Repository URL: `<URL_DE_TU_REPO>`
   - Branch: `main`
   - **Root Directory**: `/backend` (¡Muy importante!)
4. Build Method: **Dockerfile** (Selecciona el Dockerfile que está en `/backend/Dockerfile`).
5. **Environment Variables**:
   Agrega las variables necesarias para conectar a la base de datos que creaste en el paso 3:
   ```
   DB_HOST=mysql-db (o el host interno que te dio Easypanel)
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=<la_password_de_la_db>
   DB_NAME=xiomara_db
   SECRET_KEY=inventa_una_clave_secreta_segura
   APP_NAME=XiomaraBackend
   CORS_ORIGINS=* (o la URL de tu frontend cuando la tengas)
   ```
6. **Port**: Asegúrate que el puerto expuesto sea `8000`.
7. Haz clic en **Create & Deploy**.
8. Una vez desplegado, Easypanel te dará una URL pública (ej: `https://backend.tu-dominio.com`). ¡Cópiala!

## Paso 5: Desplegar Frontend
1. Haz clic en **+ Service** -> **App**.
2. Nombre: `frontend`.
3. Source: **Git**.
   - Repository URL: `<URL_DE_TU_REPO>`
   - Branch: `main`
   - **Root Directory**: `/` (Déjalo vacío o pon `/`)
4. Build Method: **Dockerfile** (Selecciona el Dockerfile de la raíz).
5. **Environment Variables**:
   Necesitas decirle al frontend dónde está el backend.
   Nota: Como Vite construye la app en tiempo de build, necesitamos pasar la variable *antes* del build o usar un truco. En Dockerfile, las variables de entorno de tiempo de ejecución no siempre se "queman" en el build de React.
   
   **Opción Recomendada**:
   Agrega la variable:
   ```
   VITE_API_URL=https://backend.tu-dominio.com
   ```
   (Reemplaza con la URL real de tu backend del Paso 4).
   
   *Importante*: Si cambias la variable `VITE_API_URL`, debes hacer **Rebuild** del frontend para que tome el nuevo valor.

6. **Port**: El frontend expone el puerto `80`.
7. Haz clic en **Create & Deploy**.

## Verificación
1. Entra a la URL de tu Frontend.
2. Intenta hacer login o registrarte.
3. Si falla, revisa los logs del Backend en Easypanel para ver si hay errores de conexión a la base de datos.
4. Revisa la consola del navegador (F12) para ver si las peticiones están yendo a la URL correcta del backend.

¡Listo! Tu aplicación debería estar funcionando en tu VPS.
