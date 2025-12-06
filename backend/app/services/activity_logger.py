from sqlalchemy.orm import Session
from app.models.activity import Activity

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
