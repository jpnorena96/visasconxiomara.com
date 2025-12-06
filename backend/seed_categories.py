"""
Script para poblar las categorías de documentos iniciales
Ejecutar con: python seed_categories.py
"""
from sqlalchemy.orm import Session
from app.core.db import engine
from app.models.category import Category

def seed_categories():
    """Crea las categorías de documentos predeterminadas"""
    print("📋 Poblando categorías de documentos...")
    
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
        {"name": "Acta de Nacimiento", "description": "Acta de nacimiento apostillada", "is_required": False, "display_order": 11},
        {"name": "Certificado de Matrimonio", "description": "Acta de matrimonio si aplica", "is_required": False, "display_order": 12},
    ]
    
    with Session(engine) as session:
        try:
            # Verificar si ya existen categorías
            existing_count = session.query(Category).count()
            
            if existing_count > 0:
                print(f"⚠️  Ya existen {existing_count} categorías en la base de datos")
                response = input("¿Deseas eliminarlas y crear nuevas? (s/n): ")
                if response.lower() != 's':
                    print("❌ Operación cancelada")
                    return
                
                # Eliminar categorías existentes
                session.query(Category).delete()
                session.commit()
                print("🗑️  Categorías anteriores eliminadas")
            
            # Crear nuevas categorías
            for cat_data in categories_data:
                category = Category(**cat_data)
                session.add(category)
            
            session.commit()
            
            print(f"✅ {len(categories_data)} categorías creadas exitosamente:")
            for cat in categories_data:
                required_text = "✓ Requerida" if cat["is_required"] else "○ Opcional"
                print(f"   {cat['display_order']}. {cat['name']} - {required_text}")
            
        except Exception as e:
            session.rollback()
            print(f"❌ Error al crear categorías: {e}")
            raise

def main():
    print("=" * 60)
    print("🏷️  SEED DE CATEGORÍAS - XIOMARA BACKEND")
    print("=" * 60)
    
    seed_categories()
    
    print("\n" + "=" * 60)
    print("✨ ¡Categorías pobladas exitosamente!")
    print("=" * 60)

if __name__ == "__main__":
    main()
