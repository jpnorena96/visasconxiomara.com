from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(settings.DB_URI, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

# ⬇️ IMPORTANTE: Sin @contextmanager, usar yield directamente
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
