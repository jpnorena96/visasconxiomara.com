# Uso de emergencia para desarrollo: crear tablas si no existen.
from app.core.db import engine
from app.models import user, document  # noqa
from app.core.db import Base

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas (si no existían).")
