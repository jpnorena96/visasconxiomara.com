"""
API endpoints para formularios de solicitud de visa
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.db import get_db
from app.core.deps import get_current_user, require_admin
from app.models.user import User
from app.models.intake_form import IntakeForm
from app.schemas.intake_form import IntakeFormResponse, IntakeFormCreate, IntakeFormUpdate

router = APIRouter(prefix="/forms", tags=["Forms"])

@router.post("", response_model=IntakeFormResponse)
def create_or_update_form(
    form_data: IntakeFormCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear o actualizar formulario de solicitud"""
    # Verificar si ya existe un formulario para este usuario
    existing_form = db.query(IntakeForm).filter(
        IntakeForm.user_id == current_user.id
    ).first()
    
    if existing_form:
        # Actualizar formulario existente
        update_data = form_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing_form, field, value)
        
        # Si se marca como completado, guardar la fecha
        if form_data.is_completed and not existing_form.completed_at:
            existing_form.completed_at = datetime.utcnow()
        
        db.commit()
        db.refresh(existing_form)

        # Log activity
        from app.services.activity_logger import log_activity
        log_activity(
            db=db,
            activity_type="form_submitted" if form_data.is_completed else "form_updated",
            title="Formulario enviado" if form_data.is_completed else "Formulario actualizado",
            description=f"{current_user.email} {'completó' if form_data.is_completed else 'actualizó'} su formulario",
            user_id=current_user.id,
            performed_by_id=current_user.id,
            performed_by_email=current_user.email
        )

        return existing_form
    else:
        # Crear nuevo formulario
        new_form = IntakeForm(
            user_id=current_user.id,
            **form_data.dict()
        )
        
        if form_data.is_completed:
            new_form.completed_at = datetime.utcnow()
        
        db.add(new_form)
        db.commit()
        db.refresh(new_form)

        # Log activity
        from app.services.activity_logger import log_activity
        log_activity(
            db=db,
            activity_type="form_submitted" if form_data.is_completed else "form_updated",
            title="Formulario enviado" if form_data.is_completed else "Formulario actualizado",
            description=f"{current_user.email} {'completó' if form_data.is_completed else 'actualizó'} su formulario",
            user_id=current_user.id,
            performed_by_id=current_user.id,
            performed_by_email=current_user.email
        )

        return new_form

@router.get("/me", response_model=IntakeFormResponse)
def get_my_form(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener mi formulario"""
    form = db.query(IntakeForm).filter(
        IntakeForm.user_id == current_user.id
    ).first()
    
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formulario no encontrado"
        )
    
    return form

@router.put("/me", response_model=IntakeFormResponse)
def update_my_form(
    form_update: IntakeFormUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar mi formulario"""
    form = db.query(IntakeForm).filter(
        IntakeForm.user_id == current_user.id
    ).first()
    
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formulario no encontrado. Usa POST para crear uno nuevo."
        )
    
    # Actualizar campos
    update_data = form_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(form, field, value)
    
    # Si se marca como completado, guardar la fecha
    if form_update.is_completed and not form.completed_at:
        form.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(form)

    # Log activity
    from app.services.activity_logger import log_activity
    log_activity(
        db=db,
        activity_type="form_submitted" if form_update.is_completed else "form_updated",
        title="Formulario enviado" if form_update.is_completed else "Formulario actualizado",
        description=f"{current_user.email} {'completó' if form_update.is_completed else 'actualizó'} su formulario",
        user_id=current_user.id,
        performed_by_id=current_user.id,
        performed_by_email=current_user.email
    )
    
    return form

@router.get("/admin/all", response_model=List[IntakeFormResponse])
def get_all_forms(
    skip: int = 0,
    limit: int = 100,
    completed: bool = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener todos los formularios (solo admin)"""
    query = db.query(IntakeForm)
    
    if completed is not None:
        query = query.filter(IntakeForm.is_completed == completed)
    
    forms = query.offset(skip).limit(limit).all()
    
    return forms

@router.get("/admin/{form_id}", response_model=IntakeFormResponse)
def get_form_by_id(
    form_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener un formulario específico (solo admin)"""
    form = db.query(IntakeForm).filter(IntakeForm.id == form_id).first()
    
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formulario no encontrado"
        )
    
    return form
