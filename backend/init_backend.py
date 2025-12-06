"""
Script completo de inicialización del backend de Xiomara
Ejecutar con: python init_backend.py
"""
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import hash_password

def create_database():
    """Crea la base de datos si no existe"""
    db_uri_without_db = settings.DB_URI.rsplit('/', 1)[0]
    
    print(f"🔌 Conectando a MySQL en {settings.DB_HOST}:{settings.DB_PORT}...")
    
    try:
        engine = create_engine(db_uri_without_db, isolation_level="AUTOCOMMIT")
        
        with engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            print(f"✅ Base de datos '{settings.DB_NAME}' creada o ya existe")
            
        engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Error al crear la base de datos: {e}")
        return False

def create_tables():
    """Crea las tablas usando SQLAlchemy"""
    print(f"\n📋 Creando tablas en la base de datos '{settings.DB_NAME}'...")
    
    try:
        from app.core.db import engine, Base
        # Importar todos los modelos
        from app.models import user, document, client, intake_form, category, activity  # noqa
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        
        print("✅ Tablas creadas exitosamente:")
        for table in Base.metadata.sorted_tables:
            print(f"   - {table.name}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear las tablas: {e}")
        return False

def seed_admin_user():
    """Crea un usuario administrador por defecto"""
    print("\n👤 Creando usuario administrador...")
    
    try:
        from app.core.db import engine
        from app.models.user import User
        
        with Session(engine) as session:
            # Verificar si ya existe un admin
            existing_admin = session.query(User).filter(User.email == "admin@xiomara.com").first()
            
            if existing_admin:
                print("⚠️  Usuario admin ya existe")
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
            
            print("✅ Usuario administrador creado:")
            print("   Email: admin@xiomara.com")
            print("   Password: admin123")
            print("   ⚠️  CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear usuario admin: {e}")
        return False

def seed_categories():
    """Crea las categorías de documentos predeterminadas"""
    print("\n📋 Poblando categorías de documentos...")
    
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
                print(f"⚠️  Ya existen {existing_count} categorías")
                return True
            
            # Crear nuevas categorías
            for cat_data in categories_data:
                category = Category(**cat_data)
                session.add(category)
            
            session.commit()
            
            print(f"✅ {len(categories_data)} categorías creadas exitosamente")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear categorías: {e}")
        return False

def seed_test_customer():
    """Crea un usuario de prueba tipo customer"""
    print("\n👤 Creando usuario de prueba (customer)...")
    
    try:
        from app.core.db import engine
        from app.models.user import User
        from app.models.client import Client
        
        with Session(engine) as session:
            # Verificar si ya existe
            existing_customer = session.query(User).filter(User.email == "test@example.com").first()
            
            if existing_customer:
                print("⚠️  Usuario de prueba ya existe")
                return True
            
            # Crear nuevo customer
            customer = User(
                email="test@example.com",
                hashed_password=hash_password("test123"),
                role="customer",
                is_active=True
            )
            session.add(customer)
            session.flush()  # Para obtener el ID
            
            # Crear perfil de cliente
            client_profile = Client(
                user_id=customer.id,
                first_name="María",
                last_name="González",
                phone="+57 300 123 4567",
                destination_country="Estados Unidos",
                visa_type="Turista B1/B2",
                status="active",
                progress=45,
                notes="Cliente de prueba para desarrollo"
            )
            session.add(client_profile)
            session.commit()
            
            print("✅ Usuario de prueba creado:")
            print("   Email: test@example.com")
            print("   Password: test123")
            print("   Rol: customer")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al crear usuario de prueba: {e}")
        return False

def main():
    print("=" * 70)
    print("🚀 INICIALIZACIÓN COMPLETA DEL BACKEND - XIOMARA")
    print("=" * 70)
    
    # Paso 1: Crear la base de datos
    if not create_database():
        sys.exit(1)
    
    # Paso 2: Crear las tablas
    if not create_tables():
        sys.exit(1)
    
    # Paso 3: Crear usuario admin
    if not seed_admin_user():
        sys.exit(1)
    
    # Paso 4: Poblar categorías
    if not seed_categories():
        sys.exit(1)
    
    # Paso 5: Crear usuario de prueba
    if not seed_test_customer():
        sys.exit(1)
    
    print("\n" + "=" * 70)
    print("✨ ¡Inicialización completada exitosamente!")
    print("=" * 70)
    print("\n📊 Resumen:")
    print("   ✅ Base de datos creada")
    print("   ✅ 6 tablas creadas (users, clients, documents, intake_forms, categories, activities)")
    print("   ✅ Usuario admin creado (admin@xiomara.com / admin123)")
    print("   ✅ Usuario de prueba creado (test@example.com / test123)")
    print("   ✅ 10 categorías de documentos creadas")
    print("\n💡 Próximos pasos:")
    print("   1. Inicia el servidor: uvicorn app.main:app --reload")
    print("   2. Accede a la documentación: http://localhost:8000/docs")
    print("   3. Prueba el login con los usuarios creados")
    print("\n⚠️  IMPORTANTE: Cambia las contraseñas por defecto en producción")

if __name__ == "__main__":
    main()
