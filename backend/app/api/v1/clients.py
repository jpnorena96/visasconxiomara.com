"""
API endpoints para gestión de clientes (Admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.core.deps import get_current_user, require_admin
from app.core.security import hash_password
from app.models.user import User
from app.models.client import Client
from app.schemas.client import ClientResponse, ClientUpdate, ClientWithUser, ClientCreate, ClientCreateRequest

router = APIRouter(prefix="/admin/clients", tags=["Admin - Clients"])

@router.post("", response_model=ClientWithUser, status_code=status.HTTP_201_CREATED)
def create_client(
    client_in: ClientCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Crear nuevo cliente con cuenta de usuario (solo admin)"""
    # Verificar si el email ya existe
    existing_user = db.query(User).filter(User.email == client_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear usuario
    new_user = User(
        email=client_in.email,
        hashed_password=hash_password(client_in.password),
        role="customer",
        is_active=True
    )
    db.add(new_user)
    db.flush()  # Para obtener el ID
    
    # Crear perfil de cliente
    # Excluir email y password del modelo de cliente
    client_data = client_in.dict(exclude={'email', 'password'})
    new_client = Client(
        user_id=new_user.id,
        **client_data
    )
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    # Log activity
    from app.services.activity_logger import log_activity
    log_activity(
        db=db,
        activity_type="user_registered",
        title="Nuevo cliente registrado",
        description=f"{new_user.email} se registró en el sistema",
        user_id=new_user.id,
        performed_by_id=current_user.id,
        performed_by_email=current_user.email
    )
    
    return {
        **new_client.__dict__,
        "email": new_user.email
    }

@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Eliminar cliente (solo admin)"""
    client = db.query(Client).filter(Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Eliminar el usuario asociado (esto eliminará el cliente en cascada)
    user = db.query(User).filter(User.id == client.user_id).first()
    if user:
        db.delete(user)
    
    db.commit()
    
    return {"message": "Cliente eliminado exitosamente"}

@router.get("", response_model=List[ClientWithUser])
def get_all_clients(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener todos los clientes (solo admin)"""
    query = db.query(Client).join(User, Client.user_id == User.id)
    
    if status:
        query = query.filter(Client.status == status)
    
    clients = query.offset(skip).limit(limit).all()
    
    # Agregar email del usuario a cada cliente
    result = []
    for client in clients:
        user = db.query(User).filter(User.id == client.user_id).first()
        client_dict = {
            **client.__dict__,
            "email": user.email if user else None
        }
        result.append(client_dict)
    
    return result

@router.get("/{client_id}", response_model=ClientWithUser)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener un cliente específico"""
    client = db.query(Client).filter(Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    user = db.query(User).filter(User.id == client.user_id).first()
    
    return {
        **client.__dict__,
        "email": user.email if user else None
    }

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Actualizar información de un cliente"""
    client = db.query(Client).filter(Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Actualizar campos
    update_data = client_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.commit()
    db.refresh(client)

    # Log activity
    from app.services.activity_logger import log_activity
    log_activity(
        db=db,
        activity_type="client_updated",
        title="Cliente actualizado",
        description=f"Admin actualizó perfil de cliente ID {client.id}",
        user_id=client.user_id,
        performed_by_id=current_user.id,
        performed_by_email=current_user.email
    )
    
    return client

@router.get("/{client_id}/documents")
def get_client_documents(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener documentos de un cliente"""
    from app.models.document import Document
    
    client = db.query(Client).filter(Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    documents = db.query(Document).filter(Document.user_id == client.user_id).all()
    
    return documents

@router.get("/me/profile", response_model=ClientResponse)
def get_my_client_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener mi perfil de cliente"""
    client = db.query(Client).filter(Client.user_id == current_user.id).first()
    
    if not client:
        # Crear perfil si no existe
        client = Client(user_id=current_user.id)
        db.add(client)
        db.commit()
        db.refresh(client)
    
    return client

@router.put("/me/profile", response_model=ClientResponse)
def update_my_client_profile(
    client_update: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar mi perfil de cliente"""
    client = db.query(Client).filter(Client.user_id == current_user.id).first()
    
    if not client:
        # Crear perfil si no existe
        client = Client(user_id=current_user.id)
        db.add(client)
    
    # Actualizar campos
    update_data = client_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.commit()
    db.refresh(client)
    
    return client
