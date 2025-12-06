from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import hash_password, verify_password, create_token
from app.schemas.auth import RegisterIn, LoginIn, TokenOut
from app.repositories.user_repo import UserRepo

router = APIRouter()

@router.post('/register', response_model=TokenOut)  # crea siempre customer
def register(data: RegisterIn, db: Session = Depends(get_db)):
    repo = UserRepo(db)
    if repo.get_by_email(data.email):
        raise HTTPException(400, 'Correo ya registrado')
    user = repo.create(email=data.email, hashed_password=hash_password(data.password), role="customer")
    return TokenOut(access_token=create_token(user.email))

@router.post('/login', response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    repo = UserRepo(db)
    user = repo.get_by_email(data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, 'Credenciales inválidas')
    return TokenOut(access_token=create_token(user.email))
