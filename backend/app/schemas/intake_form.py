from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# IntakeForm Schemas
class IntakeFormBase(BaseModel):
    # Información Personal
    apellidos: Optional[str] = None
    nombres: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    nacionalidad: Optional[str] = None
    pasaporte: Optional[str] = None
    
    # Información Académica
    nivel_educativo: Optional[str] = None
    institucion: Optional[str] = None
    
    # Información Laboral
    ocupacion: Optional[str] = None
    compania: Optional[str] = None
    
    # Información Familiar
    padre_nombre: Optional[str] = None
    madre_nombre: Optional[str] = None
    
    # Historial de Viajes
    viajes: Optional[str] = None
    
    # Información General
    familiares_exterior: Optional[str] = None
    
    # Datos de miembros de la familia
    family_members_data: Optional[str] = None

class IntakeFormCreate(IntakeFormBase):
    is_completed: bool = False

class IntakeFormUpdate(IntakeFormBase):
    is_completed: Optional[bool] = None

class IntakeFormResponse(IntakeFormBase):
    id: int
    user_id: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
