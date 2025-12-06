"""
Script para crear la base de datos y las tablas de Xiomara Backend
Ejecutar con: python setup_database.py
"""
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

def create_database():
    """Crea la base de datos si no existe"""
    # Conectar sin especificar la base de datos
    db_uri_without_db = settings.DB_URI.rsplit('/', 1)[0]
    
    print(f"🔌 Conectando a MySQL en {settings.DB_HOST}:{settings.DB_PORT}...")
    
    try:
        engine = create_engine(db_uri_without_db, isolation_level="AUTOCOMMIT")
        
        with engine.connect() as conn:
            # Crear la base de datos si no existe
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            print(f"✅ Base de datos '{settings.DB_NAME}' creada o ya existe")
            
        engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Error al crear la base de datos: {e}")
        print("\n💡 Asegúrate de que:")
        print("   1. MySQL está corriendo")
        print("   2. Las credenciales en .env son correctas")
        print(f"   3. El usuario '{settings.DB_USER}' tiene permisos para crear bases de datos")
        return False

def create_tables():
    """Crea las tablas usando SQLAlchemy"""
    print(f"\n📋 Creando tablas en la base de datos '{settings.DB_NAME}'...")
    
    try:
        from app.core.db import engine, Base
        # Importar todos los modelos para que se registren
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

def verify_tables():
    """Verifica que las tablas se hayan creado correctamente"""
    print("\n🔍 Verificando tablas creadas...")
    
    try:
        from app.core.db import engine
        from sqlalchemy import inspect
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if tables:
            print(f"✅ Se encontraron {len(tables)} tabla(s):")
            for table in tables:
                columns = inspector.get_columns(table)
                print(f"\n   📄 Tabla: {table}")
                print(f"      Columnas: {len(columns)}")
                for col in columns:
                    print(f"         - {col['name']} ({col['type']})")
        else:
            print("⚠️  No se encontraron tablas")
            
        return True
        
    except Exception as e:
        print(f"❌ Error al verificar las tablas: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 SETUP DE BASE DE DATOS - XIOMARA BACKEND")
    print("=" * 60)
    
    # Paso 1: Crear la base de datos
    if not create_database():
        sys.exit(1)
    
    # Paso 2: Crear las tablas
    if not create_tables():
        sys.exit(1)
    
    # Paso 3: Verificar
    verify_tables()
    
    print("\n" + "=" * 60)
    print("✨ ¡Setup completado exitosamente!")
    print("=" * 60)
    print("\n💡 Próximos pasos:")
    print("   1. Puedes iniciar el servidor: uvicorn app.main:app --reload")
    print("   2. Crear un usuario admin si es necesario")
    print("   3. Probar los endpoints con Postman o similar")

if __name__ == "__main__":
    main()
