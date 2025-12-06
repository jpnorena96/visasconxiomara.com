import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import require_admin
from app.repositories.user_repo import UserRepo
from app.repositories.document_repo import DocumentRepo
from app.schemas.user import UserOut
from app.schemas.document import DocumentOut, AdminReviewIn
from app.core.config import settings

router = APIRouter()

@router.get("/customers", response_model=list[UserOut])
def list_customers(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return UserRepo(db).list_customers()

@router.get("/customers/{user_id}/documents", response_model=list[DocumentOut])
def list_customer_docs(user_id:int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    return DocumentRepo(db).list_by_user_admin(user_id=user_id)

@router.get("/documents/{doc_id}/download")
def download_any(doc_id:int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    doc = DocumentRepo(db).get(doc_id)
    if not doc:
        raise HTTPException(404, "No encontrado")
    path = os.path.join(settings.UPLOAD_DIR, doc.stored_name)
    print(f"DEBUG DOWNLOAD: ID={doc_id}, Stored={doc.stored_name}, Path={path}, Exists={os.path.exists(path)}")
    if not os.path.exists(path):
        raise HTTPException(404, f"Archivo físico no encontrado: {path}")
    return FileResponse(path, media_type=doc.mime_type, filename=doc.original_name)

@router.put("/documents/{doc_id}", response_model=DocumentOut)
@router.patch("/documents/{doc_id}", response_model=DocumentOut)
def review_document(doc_id:int, data: AdminReviewIn, db: Session = Depends(get_db), admin = Depends(require_admin)):
    if data.status not in ("approved","rejected"):
        raise HTTPException(400, "status debe ser 'approved' o 'rejected'")
    repo = DocumentRepo(db)
    doc = repo.get(doc_id)
    if not doc:
        raise HTTPException(404, "No encontrado")
    updated_doc = repo.review(doc=doc, status=data.status, admin_notes=data.admin_notes)

    # Log activity
    from app.services.activity_logger import log_activity
    status_es = "aprobado" if data.status == "approved" else "rechazado"
    log_activity(
        db=db,
        activity_type=f"document_{data.status}",
        title=f"Documento {status_es}",
        description=f"Admin revisó {doc.category}",
        user_id=doc.user_id,
        performed_by_id=admin.id,
        performed_by_email=admin.email
    )

    return updated_doc

from app.models.client import Client
from app.models.user import User
import csv
import io
from fastapi.responses import StreamingResponse

@router.get("/export/dashboard", response_class=StreamingResponse)
def export_dashboard_csv(db: Session = Depends(get_db), admin = Depends(require_admin)):
    # Query clients with user email
    results = db.query(Client, User.email).join(User, Client.user_id == User.id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "ID", "Nombres", "Apellidos", "Email", "Teléfono", 
        "Destino", "Visa", "Estado", "Progreso (%)", 
        "Docs Totales", "Docs Pendientes", "Fecha Registro"
    ])
    
    for client, email in results:
        writer.writerow([
            client.id,
            client.first_name or "",
            client.last_name or "",
            email,
            client.phone or "",
            client.destination_country or "",
            client.visa_type or "",
            client.status,
            client.progress,
            client.total_documents,
            client.pending_documents,
            client.created_at.strftime("%Y-%m-%d %H:%M")
        ])
        
    output.seek(0)
    
    response = StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = "attachment; filename=reporte_clientes.csv"
    return response

@router.get("/documents", response_model=list[DocumentOut])
def list_all_documents(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return DocumentRepo(db).list_all()
