"""
Endpoints CRUD para gestión de usuarios (solo administradores)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import require_admin
from app.core.security import hash_password
from app.repositories.user_repo import UserRepo
from app.schemas.user import (
    UserOut, 
    UserDetailOut, 
    UserCreateIn, 
    UserUpdateIn, 
    UserPasswordUpdateIn,
    UserStatsOut
)

router = APIRouter()

@router.get("/stats", response_model=UserStatsOut)
def get_user_stats(
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Obtener estadísticas de usuarios"""
    repo = UserRepo(db)
    total = repo.count_all()
    admins = repo.count_by_role("admin")
    customers = repo.count_by_role("customer")
    
    # Contar usuarios activos
    from app.models.user import User
    active = db.query(User).filter(User.is_active == True).count()
    
    return UserStatsOut(
        total_users=total,
        total_admins=admins,
        total_customers=customers,
        active_users=active
    )

@router.get("/", response_model=list[UserDetailOut])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role: str = Query(None, pattern="^(admin|customer)$"),
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Listar todos los usuarios con filtros opcionales"""
    repo = UserRepo(db)
    
    if role == "admin":
        return repo.list_admins()
    elif role == "customer":
        return repo.list_customers()
    else:
        return repo.list_all(skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserDetailOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Obtener un usuario por ID"""
    repo = UserRepo(db)
    user = repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user

@router.post("/", response_model=UserDetailOut, status_code=201)
def create_user(
    data: UserCreateIn,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Crear un nuevo usuario (admin o customer)"""
    repo = UserRepo(db)
    
    # Verificar si el email ya existe
    existing = repo.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Crear el usuario
    hashed_pwd = hash_password(data.password)
    user = repo.create(
        email=data.email,
        hashed_password=hashed_pwd,
        role=data.role
    )
    
    return user

@router.put("/{user_id}", response_model=UserDetailOut)
def update_user(
    user_id: int,
    data: UserUpdateIn,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Actualizar información de un usuario"""
    repo = UserRepo(db)
    user = repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Si se está actualizando el email, verificar que no exista
    if data.email and data.email != user.email:
        existing = repo.get_by_email(data.email)
        if existing:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
    
    # Actualizar campos
    update_data = data.model_dump(exclude_unset=True)
    updated_user = repo.update(user, **update_data)
    
    return updated_user

@router.patch("/{user_id}/password", response_model=UserOut)
def update_user_password(
    user_id: int,
    data: UserPasswordUpdateIn,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Cambiar la contraseña de un usuario"""
    repo = UserRepo(db)
    user = repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    hashed_pwd = hash_password(data.new_password)
    updated_user = repo.update_password(user, hashed_pwd)
    
    return updated_user

@router.patch("/{user_id}/toggle-active", response_model=UserOut)
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Activar/desactivar un usuario"""
    repo = UserRepo(db)
    user = repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # No permitir desactivar al propio admin
    if user.email == admin.email:
        raise HTTPException(status_code=400, detail="No puedes desactivar tu propia cuenta")
    
    updated_user = repo.toggle_active(user)
    
    return updated_user

@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db), 
    admin = Depends(require_admin)
):
    """Eliminar un usuario permanentemente"""
    repo = UserRepo(db)
    user = repo.get_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # No permitir eliminar al propio admin
    if user.email == admin.email:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    
    repo.delete(user)
    
    return None
