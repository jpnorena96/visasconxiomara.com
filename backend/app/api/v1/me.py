from fastapi import APIRouter, Depends
from app.core.deps import current_user

router = APIRouter()

@router.get("/me")
def me(user = Depends(current_user)):
    return {"id": user.id, "email": user.email, "role": user.role}
