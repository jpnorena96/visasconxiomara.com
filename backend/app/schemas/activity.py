from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Activity Schemas
class ActivityBase(BaseModel):
    activity_type: str
    title: str
    description: Optional[str] = None
    extra_data: Optional[str] = None

class ActivityCreate(ActivityBase):
    user_id: Optional[int] = None
    performed_by_id: Optional[int] = None
    performed_by_email: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: int
    user_id: Optional[int] = None
    performed_by_id: Optional[int] = None
    performed_by_email: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
