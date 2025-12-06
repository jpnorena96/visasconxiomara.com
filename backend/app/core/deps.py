from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import decode_token
from app.repositories.user_repo import UserRepo
from app.models.user import User

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

def current_user(db: Session = Depends(get_db), token: str = Depends(oauth2)) -> User:
    try:
        payload = decode_token(token)
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    user = UserRepo(db).get_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user

# Alias para compatibilidad
get_current_user = current_user

def require_admin(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin")
    return user
