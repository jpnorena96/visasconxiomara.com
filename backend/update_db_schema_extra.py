from app.core.db import engine
from sqlalchemy import text

def add_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE intake_forms ADD COLUMN parents_data TEXT"))
            print("Added parents_data column")
        except Exception as e:
            print(f"Error adding parents_data: {e}")

        try:
            conn.execute(text("ALTER TABLE intake_forms ADD COLUMN education_data TEXT"))
            print("Added education_data column")
        except Exception as e:
            print(f"Error adding education_data: {e}")

        try:
            conn.execute(text("ALTER TABLE intake_forms ADD COLUMN work_data TEXT"))
            print("Added work_data column")
        except Exception as e:
            print(f"Error adding work_data: {e}")
            
        conn.commit()

if __name__ == "__main__":
    add_columns()
