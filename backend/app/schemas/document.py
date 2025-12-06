from pydantic import BaseModel
from datetime import datetime

class DocumentOut(BaseModel):
    id: int
    category: str
    original_name: str
    mime_type: str
    size_bytes: int
    status: str
    admin_notes: str | None = None
    family_member_name: str | None = None
    created_at: datetime
    class Config:
        from_attributes = True

class AdminReviewIn(BaseModel):
    status: str  # "approved" | "rejected"
    admin_notes: str | None = None
