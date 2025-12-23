"""
Script completo de inicialización del backend de Xiomara
Ejecutar con: python init_backend.py
"""
import sys
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import hash_password

def create_database():
    """Crea la base de datos si no existe, o verifica conexión si ya existe"""
    print(f"🔌 Intentando conectar a MySQL en {settings.DB_HOST}:{settings.DB_PORT}...")

    # 1. Intentar conectar directamente a la base de datos objetivo
    # Esto es ideal para entornos como Easypanel donde la DB ya está creada
    try:
        engine = create_engine(settings.DB_URI)
        with engine.connect() as conn:
            print(f"✅ Conexión exitosa a la base de datos '{settings.DB_NAME}'")
        engine.dispose()
        return True
    except Exception as e:
        print(f"⚠️  No se pudo conectar directamente a '{settings.DB_NAME}': {e}")
        print("   Intentando crear la base de datos...")

    # 2. Si falla, intentar conectarse sin DB seleccionada y crearla
    # Esto funciona si tenemos permisos de root o similares
    db_uri_without_db = settings.DB_URI.rsplit('/', 1)[0]
    
    try:
        # Reintentos por si MySQL está despertando
        max_retries = 5
        for i in range(max_retries):
            try:
                engine = create_engine(db_uri_without_db, isolation_level="AUTOCOMMIT")
                with engine.connect() as conn:
                    conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
                    print(f"✅ Base de datos '{settings.DB_NAME}' asegurada")
                engine.dispose()
                return True
            except Exception as e_retry:
                if i < max_retries - 1:
                    print(f"   ⏳ Esperando a MySQL ({i+1}/{max_retries})...")
                    time.sleep(3)
                else:
                    raise e_retry
        
    except Exception as e:
        print(f"❌ Error crítico al crear la base de datos: {e}")
        print("   Si estás en un hosting compartido (Easypanel), verifica que la DB ya exista y las credenciales sean correctas.")
        return False

def create_tables():
    """Crea las tablas usando SQLAlchemy"""
    print(f"\n📋 Verificando/Creando tablas en '{settings.DB_NAME}'...")
    
    try:
        from app.core.db import engine, Base
        # Importar todos los modelos
        from app.models import user, document, client, intake_form, category, activity  # noqa
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        print("✅ Esquema de tablas sincronizado exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error al crear las tablas: {e}")
        return False

def seed_admin_user():
    """Crea un usuario administrador por defecto"""
    print("\n👤 Verificando usuario administrador...")
    
    try:
        from app.core.db import engine
        from app.models.user import User
        
        with Session(engine) as session:
            # Verificar si ya existe un admin
            existing_admin = session.query(User).filter(User.email == "admin@xiomara.com").first()
            
            if existing_admin:
                print("   ✅ Usuario admin ya existe")
                return True
            
            # Crear nuevo admin
            admin = User(
                email="admin@xiomara.com",
                hashed_password=hash_password("admin123"),
                role="admin",
                is_active=True
            )
            session.add(admin)
            session.commit()
            
            print("   ✅ Usuario administrador creado (admin@xiomara.com / admin123)")
            print("   ⚠️  CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear usuario admin: {e}")
        return False

def seed_categories():
    """Crea las categorías de documentos predeterminadas"""
    print("\n📋 Verificando categorías de documentos...")
    
    categories_data = [
        {"name": "Pasaporte", "description": "Copia del pasaporte vigente", "is_required": True, "display_order": 1},
        {"name": "DNI", "description": "Documento Nacional de Identidad", "is_required": True, "display_order": 2},
        {"name": "Foto Tamaño Pasaporte", "description": "Fotografía reciente tamaño pasaporte", "is_required": True, "display_order": 3},
        {"name": "Certificado Laboral", "description": "Carta de empleo actual", "is_required": True, "display_order": 4},
        {"name": "Estados Financieros", "description": "Estados de cuenta bancarios (últimos 3 meses)", "is_required": True, "display_order": 5},
        {"name": "Certificado de Estudios", "description": "Diplomas o certificados académicos", "is_required": False, "display_order": 6},
        {"name": "Carta de Invitación", "description": "Carta de invitación si aplica", "is_required": False, "display_order": 7},
        {"name": "Reserva de Hotel", "description": "Confirmación de reserva de alojamiento", "is_required": False, "display_order": 8},
        {"name": "Boletos de Avión", "description": "Itinerario de vuelo", "is_required": False, "display_order": 9},
        {"name": "Seguro de Viaje", "description": "Póliza de seguro médico de viaje", "is_required": False, "display_order": 10},
    ]
    
    try:
        from app.core.db import engine
        from app.models.category import Category
        
        with Session(engine) as session:
            # Verificar si ya existen categorías
            existing_count = session.query(Category).count()
            
            if existing_count > 0:
                print(f"   ✅ Ya existen {existing_count} categorías")
                return True
            
            # Crear nuevas categorías
            for cat_data in categories_data:
                category = Category(**cat_data)
                session.add(category)
            
            session.commit()
            
            print(f"   ✅ {len(categories_data)} categorías iniciales creadas")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear categorías: {e}")
        return False

def main():
    print("=" * 70)
    print("🚀 INICIALIZANDO BACKEND (AUTO-DEPLOY)")
    print("=" * 70)
    
    # Paso 1: Base de datos
    if not create_database():
        # Si falla esto es crítico, pero en algunos envs la DB ya existe y el check falló falsamente
        # Intentamos seguir, si falla create_tables ahí sí nos detenemos
        print("⚠️ Advertencia en paso de BD, intentando continuar...")
    
    # Paso 2: Crear las tablas (Crítico)
    if not create_tables():
        print("❌ Fallo crítico al crear tablas. Abortando.")
        sys.exit(1)
    
    # Paso 3: Datos semilla (Opcionales pero recomendados)
    seed_admin_user()
    seed_categories()
    
    print("\n" + "=" * 70)
    print("✨ INICIALIZACIÓN COMPLETADA")
    print("=" * 70)

if __name__ == "__main__":
    main()
