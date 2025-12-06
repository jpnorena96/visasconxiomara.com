from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.core.db import Base

class Client(Base):
    """Modelo extendido de cliente con información detallada"""
    __tablename__ = "clients"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Información personal
    first_name: Mapped[str | None] = mapped_column(String(100))
    last_name: Mapped[str | None] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))
    
    # Información de visa
    destination_country: Mapped[str | None] = mapped_column(String(100))
    visa_type: Mapped[str | None] = mapped_column(String(100))
    application_type: Mapped[str] = mapped_column(String(20), default="individual")
    family_members_count: Mapped[int] = mapped_column(Integer, default=1)
    
    # Estado y progreso
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending|active|completed|inactive
    progress: Mapped[int] = mapped_column(Integer, default=0)  # 0-100
    
    # Contadores
    total_documents: Mapped[int] = mapped_column(Integer, default=0)
    pending_documents: Mapped[int] = mapped_column(Integer, default=0)
    
    # Notas administrativas
    notes: Mapped[str | None] = mapped_column(Text)
    
    # Fechas
    join_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_activity: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
