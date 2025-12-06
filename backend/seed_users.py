"""
Script para insertar usuarios de prueba en la base de datos
Ejecutar con: python seed_users.py
"""
from app.core.db import SessionLocal
from app.core.security import hash_password
from app.repositories.user_repo import UserRepo

def seed_users():
    """Insertar usuarios de prueba para cada rol"""
    db = SessionLocal()
    repo = UserRepo(db)
    
    print("=" * 60)
    print("🌱 SEED DE USUARIOS - XIOMARA BACKEND")
    print("=" * 60)
    
    users_to_create = [
        {
            "email": "admin@xiomara.com",
            "password": "admin123",
            "role": "admin",
            "description": "Administrador principal"
        },
        {
            "email": "admin2@xiomara.com",
            "password": "admin123",
            "role": "admin",
            "description": "Administrador secundario"
        },
        {
            "email": "cliente1@example.com",
            "password": "cliente123",
            "role": "customer",
            "description": "Cliente de prueba 1"
        },
        {
            "email": "cliente2@example.com",
            "password": "cliente123",
            "role": "customer",
            "description": "Cliente de prueba 2"
        },
        {
            "email": "maria@example.com",
            "password": "maria123",
            "role": "customer",
            "description": "Cliente María"
        },
        {
            "email": "juan@example.com",
            "password": "juan123",
            "role": "customer",
            "description": "Cliente Juan"
        }
    ]
    
    created_count = 0
    skipped_count = 0
    
    for user_data in users_to_create:
        email = user_data["email"]
        
        # Verificar si ya existe
        existing = repo.get_by_email(email)
        
        if existing:
            print(f"⏭️  Usuario ya existe: {email} ({user_data['description']})")
            skipped_count += 1
        else:
            # Crear el usuario
            hashed_pwd = hash_password(user_data["password"])
            user = repo.create(
                email=email,
                hashed_password=hashed_pwd,
                role=user_data["role"]
            )
            print(f"✅ Creado: {email} - {user_data['description']} (ID: {user.id})")
            created_count += 1
    
    db.close()
    
    print("\n" + "=" * 60)
    print(f"✨ Seed completado!")
    print(f"   - Usuarios creados: {created_count}")
    print(f"   - Usuarios omitidos (ya existían): {skipped_count}")
    print("=" * 60)
    
    # Mostrar credenciales
    print("\n📋 CREDENCIALES DE ACCESO:")
    print("\n🔐 Administradores:")
    print("   Email: admin@xiomara.com")
    print("   Password: admin123")
    print("\n   Email: admin2@xiomara.com")
    print("   Password: admin123")
    
    print("\n👤 Clientes:")
    print("   Email: cliente1@example.com")
    print("   Password: cliente123")
    print("\n   Email: cliente2@example.com")
    print("   Password: cliente123")
    print("\n   Email: maria@example.com")
    print("   Password: maria123")
    print("\n   Email: juan@example.com")
    print("   Password: juan123")
    
    print("\n💡 Puedes usar estas credenciales para probar la API")
    print("=" * 60)

if __name__ == "__main__":
    try:
        seed_users()
    except Exception as e:
        print(f"\n❌ Error durante el seed: {e}")
        print("\n💡 Asegúrate de que:")
        print("   1. La base de datos existe y las tablas están creadas")
        print("   2. MySQL está corriendo")
        print("   3. Las credenciales en .env son correctas")
