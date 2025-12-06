from app.core.db import engine
from sqlalchemy import text

def add_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE intake_forms ADD COLUMN family_members_data TEXT"))
            print("Added family_members_data column")
        except Exception as e:
            print(f"Error adding family_members_data (maybe exists): {e}")
            
        conn.commit()

if __name__ == "__main__":
    add_columns()
