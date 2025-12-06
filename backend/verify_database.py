"""
Script para verificar las tablas y datos creados en la base de datos
"""
from sqlalchemy import inspect
from sqlalchemy.orm import Session
from app.core.db import engine
from app.models.user import User
from app.models.client import Client
from app.models.category import Category

def verify_database():
    print("=" * 70)
    print("VERIFICACION DE BASE DE DATOS")
    print("=" * 70)
    
    # Verificar tablas
    print("\n1. TABLAS CREADAS:")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if tables:
        print(f"   Total: {len(tables)} tablas")
        for table in sorted(tables):
            columns = inspector.get_columns(table)
            print(f"   - {table} ({len(columns)} columnas)")
    else:
        print("   [ERROR] No se encontraron tablas!")
        return
    
    # Verificar usuarios
    print("\n2. USUARIOS:")
    with Session(engine) as session:
        users = session.query(User).all()
        print(f"   Total: {len(users)} usuarios")
        for user in users:
            print(f"   - {user.email} (rol: {user.role})")
    
    # Verificar clientes
    print("\n3. CLIENTES:")
    with Session(engine) as session:
        clients = session.query(Client).all()
        print(f"   Total: {len(clients)} clientes")
        for client in clients:
            print(f"   - {client.first_name} {client.last_name} ({client.visa_type})")
    
    # Verificar categorías
    print("\n4. CATEGORIAS:")
    with Session(engine) as session:
        categories = session.query(Category).all()
        print(f"   Total: {len(categories)} categorias")
        for cat in categories:
            req = "Requerida" if cat.is_required else "Opcional"
            print(f"   - {cat.name} ({req})")
    
    print("\n" + "=" * 70)
    print("[OK] VERIFICACION COMPLETADA")
    print("=" * 70)

if __name__ == "__main__":
    try:
        verify_database()
    except Exception as e:
        print(f"\n[ERROR] Error durante la verificacion: {e}")
        import traceback
        traceback.print_exc()
