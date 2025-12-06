from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class Activity(Base):
    """Modelo para registro de actividades del sistema"""
    __tablename__ = "activities"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    
    # Tipo de actividad
    activity_type: Mapped[str] = mapped_column(String(50), nullable=False)  
    # Ejemplos: user_registered, document_uploaded, document_approved, document_rejected, 
    # form_submitted, client_updated, etc.
    
    # Descripción de la actividad
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    
    # Metadata adicional (JSON como string)
    extra_data: Mapped[str | None] = mapped_column(Text)  # Puede almacenar JSON
    
    # Información del usuario que realizó la acción (si aplica)
    performed_by_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    performed_by_email: Mapped[str | None] = mapped_column(String(255))
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
