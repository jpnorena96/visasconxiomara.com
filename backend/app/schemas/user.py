from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Schema para crear usuario (solo admin puede crear)
class UserCreateIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="customer", pattern="^(admin|customer)$")

# Schema para actualizar usuario
class UserUpdateIn(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = Field(None, pattern="^(admin|customer)$")
    is_active: Optional[bool] = None

# Schema para cambiar contraseña
class UserPasswordUpdateIn(BaseModel):
    new_password: str = Field(..., min_length=6)

# Schema de salida básico
class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True

# Schema de salida detallado
class UserDetailOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema para estadísticas
class UserStatsOut(BaseModel):
    total_users: int
    total_admins: int
    total_customers: int
    active_users: int

