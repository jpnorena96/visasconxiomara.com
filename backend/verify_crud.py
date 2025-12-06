"""
Script de verificación rápida del sistema CRUD de usuarios
Ejecutar con: python verify_crud.py
"""
from app.core.db import SessionLocal
from app.repositories.user_repo import UserRepo
from sqlalchemy import inspect

def verify_crud():
    print("=" * 70)
    print("🔍 VERIFICACIÓN DEL SISTEMA CRUD DE USUARIOS")
    print("=" * 70)
    
    db = SessionLocal()
    repo = UserRepo(db)
    
    # 1. Verificar tablas
    print("\n📋 1. Verificando tablas en la base de datos...")
    try:
        from app.core.db import engine
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"   ✅ Tablas encontradas: {', '.join(tables)}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # 2. Contar usuarios
    print("\n👥 2. Contando usuarios...")
    try:
        total = repo.count_all()
        admins = repo.count_by_role("admin")
        customers = repo.count_by_role("customer")
        
        print(f"   ✅ Total de usuarios: {total}")
        print(f"   ✅ Administradores: {admins}")
        print(f"   ✅ Clientes: {customers}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # 3. Listar usuarios
    print("\n📝 3. Listando usuarios...")
    try:
        users = repo.list_all(limit=20)
        if users:
            print(f"   ✅ Se encontraron {len(users)} usuarios:")
            for user in users:
                status = "🟢 Activo" if user.is_active else "🔴 Inactivo"
                role_icon = "🔐" if user.role == "admin" else "👤"
                print(f"      {role_icon} ID: {user.id} | {user.email} | {user.role} | {status}")
        else:
            print("   ⚠️  No se encontraron usuarios")
            print("   💡 Ejecuta: python seed_users.py")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # 4. Verificar métodos del repositorio
    print("\n🔧 4. Verificando métodos del repositorio...")
    methods = [
        'get_by_id',
        'get_by_email',
        'create',
        'list_all',
        'list_customers',
        'list_admins',
        'update',
        'update_password',
        'toggle_active',
        'delete',
        'count_by_role',
        'count_all'
    ]
    
    for method in methods:
        if hasattr(repo, method):
            print(f"   ✅ {method}")
        else:
            print(f"   ❌ {method} - NO ENCONTRADO")
    
    # 5. Verificar credenciales de prueba
    print("\n🔑 5. Verificando usuarios de prueba...")
    test_users = [
        ("admin@xiomara.com", "admin"),
        ("cliente1@example.com", "customer"),
    ]
    
    for email, expected_role in test_users:
        user = repo.get_by_email(email)
        if user:
            if user.role == expected_role:
                print(f"   ✅ {email} - Rol: {user.role}")
            else:
                print(f"   ⚠️  {email} - Rol esperado: {expected_role}, encontrado: {user.role}")
        else:
            print(f"   ❌ {email} - NO ENCONTRADO")
    
    db.close()
    
    print("\n" + "=" * 70)
    print("✨ VERIFICACIÓN COMPLETADA")
    print("=" * 70)
    
    # Instrucciones finales
    print("\n📚 Próximos pasos:")
    print("   1. Servidor corriendo en: http://localhost:8000")
    print("   2. Documentación API: http://localhost:8000/docs")
    print("   3. Endpoints CRUD: http://localhost:8000/api/v1/admin/users")
    print("\n💡 Para probar los endpoints:")
    print("   1. Ve a http://localhost:8000/docs")
    print("   2. Haz login con: admin@xiomara.com / admin123")
    print("   3. Copia el token y autorízate (botón 'Authorize')")
    print("   4. Prueba los endpoints en la sección 'users'")
    print("\n📖 Lee CRUD_USUARIOS.md para más información")
    print("=" * 70)

if __name__ == "__main__":
    try:
        verify_crud()
    except Exception as e:
        print(f"\n❌ Error general: {e}")
        print("\n💡 Asegúrate de que:")
        print("   1. MySQL está corriendo")
        print("   2. La base de datos existe (ejecuta: python setup_database.py)")
        print("   3. Los usuarios están insertados (ejecuta: python seed_users.py)")
