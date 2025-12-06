"""
API endpoints para actividades y logs del sistema
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.core.db import get_db
from app.core.deps import require_admin
from app.models.user import User
from app.models.activity import Activity
from app.schemas.activity import ActivityResponse, ActivityCreate

router = APIRouter(prefix="/admin/activities", tags=["Admin - Activities"])

@router.get("", response_model=List[ActivityResponse])
def get_activities(
    skip: int = 0,
    limit: int = 100,
    activity_type: str = None,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener actividades del sistema (solo admin)"""
    query = db.query(Activity)
    
    # Filtrar por tipo si se especifica
    if activity_type:
        query = query.filter(Activity.activity_type == activity_type)
    
    # Filtrar por fecha (últimos N días)
    date_from = datetime.utcnow() - timedelta(days=days)
    query = query.filter(Activity.created_at >= date_from)
    
    # Ordenar por más reciente primero
    activities = query.order_by(Activity.created_at.desc()).offset(skip).limit(limit).all()
    
    return activities

@router.get("/recent", response_model=List[ActivityResponse])
def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener actividades recientes (solo admin)"""
    activities = db.query(Activity).order_by(
        Activity.created_at.desc()
    ).limit(limit).all()
    
    return activities

@router.get("/types")
def get_activity_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Obtener tipos de actividades disponibles"""
    types = db.query(Activity.activity_type).distinct().all()
    
    return [t[0] for t in types if t[0]]

@router.post("", response_model=ActivityResponse)
def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Crear nueva actividad (solo admin)"""
    new_activity = Activity(
        **activity_data.dict(),
        performed_by_id=current_user.id,
        performed_by_email=current_user.email
    )
    
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    
    return new_activity

# Función helper para registrar actividades (puede ser usada internamente)
def log_activity(
    db: Session,
    activity_type: str,
    title: str,
    description: str = None,
    user_id: int = None,
    performed_by_id: int = None,
    performed_by_email: str = None,
    extra_data: str = None
):
    """Helper para registrar actividades"""
    activity = Activity(
        activity_type=activity_type,
        title=title,
        description=description,
        user_id=user_id,
        performed_by_id=performed_by_id,
        performed_by_email=performed_by_email,
        extra_data=extra_data
    )
    
    db.add(activity)
    db.commit()
    
    return activity
