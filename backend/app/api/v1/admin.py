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
    return FileResponse(path, media_type=doc.mime_type, filename=doc.original_name)

@router.patch("/documents/{doc_id}", response_model=DocumentOut)
def review_document(doc_id:int, data: AdminReviewIn, db: Session = Depends(get_db), admin = Depends(require_admin)):
    if data.status not in ("approved","rejected"):
        raise HTTPException(400, "status debe ser 'approved' o 'rejected'")
    repo = DocumentRepo(db)
    doc = repo.get(doc_id)
    if not doc:
        raise HTTPException(404, "No encontrado")
    return repo.review(doc=doc, status=data.status, admin_notes=data.admin_notes)

@router.get("/documents", response_model=list[DocumentOut])
def list_all_documents(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return DocumentRepo(db).list_all()
