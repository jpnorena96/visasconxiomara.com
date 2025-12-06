from app.core.db import engine
from sqlalchemy import text

def add_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE documents ADD COLUMN family_member_name VARCHAR(200)"))
            print("Added family_member_name column")
        except Exception as e:
            print(f"Error adding family_member_name (maybe exists): {e}")
            
        conn.commit()

if __name__ == "__main__":
    add_columns()
