from app.core.db import engine
from sqlalchemy import text

def add_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE clients ADD COLUMN application_type VARCHAR(20) DEFAULT 'individual'"))
            print("Added application_type column")
        except Exception as e:
            print(f"Error adding application_type (maybe exists): {e}")
            
        try:
            conn.execute(text("ALTER TABLE clients ADD COLUMN family_members_count INTEGER DEFAULT 1"))
            print("Added family_members_count column")
        except Exception as e:
            print(f"Error adding family_members_count (maybe exists): {e}")
            
        conn.commit()

if __name__ == "__main__":
    add_columns()
