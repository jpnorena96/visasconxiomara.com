from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Client Schemas
class ClientBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    destination_country: Optional[str] = None
    visa_type: Optional[str] = None
    application_type: str = "individual"
    family_members_count: int = 1
    status: str = "pending"
    progress: int = 0
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientCreateRequest(ClientCreate):
    email: EmailStr
    password: str

class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    destination_country: Optional[str] = None
    visa_type: Optional[str] = None
    application_type: Optional[str] = None
    family_members_count: Optional[int] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    notes: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    user_id: int
    total_documents: int
    pending_documents: int
    join_date: datetime
    last_activity: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ClientWithUser(ClientResponse):
    """Client response with user email"""
    email: Optional[str]
