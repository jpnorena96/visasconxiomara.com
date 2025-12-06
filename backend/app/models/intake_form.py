from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class IntakeForm(Base):
    """Modelo para almacenar los datos del formulario de solicitud de visa"""
    __tablename__ = "intake_forms"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Información Personal (Paso 1)
    apellidos: Mapped[str | None] = mapped_column(String(200))
    nombres: Mapped[str | None] = mapped_column(String(200))
    fecha_nacimiento: Mapped[str | None] = mapped_column(String(20))  # Stored as string for flexibility
    nacionalidad: Mapped[str | None] = mapped_column(String(100))
    pasaporte: Mapped[str | None] = mapped_column(String(50))
    
    # Información Académica (Paso 2)
    nivel_educativo: Mapped[str | None] = mapped_column(String(100))
    institucion: Mapped[str | None] = mapped_column(String(200))
    
    # Información Laboral (Paso 3)
    ocupacion: Mapped[str | None] = mapped_column(String(200))
    compania: Mapped[str | None] = mapped_column(String(200))
    
    # Información Familiar (Paso 4)
    padre_nombre: Mapped[str | None] = mapped_column(String(200))
    madre_nombre: Mapped[str | None] = mapped_column(String(200))
    
    # Historial de Viajes (Paso 5)
    viajes: Mapped[str | None] = mapped_column(Text)  # Formato libre
    
    # Información General (Paso 6)
    familiares_exterior: Mapped[str | None] = mapped_column(Text)
    
    # Datos de miembros de la familia (JSON string)
    family_members_data: Mapped[str | None] = mapped_column(Text)
    
    # Metadata
    is_completed: Mapped[bool] = mapped_column(default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
