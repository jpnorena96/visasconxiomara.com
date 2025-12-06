# app/api/v1/documents.py
import os, uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.config import settings
from app.core.deps import current_user
from app.core.categories import REQUIRED_CATEGORIES
from app.repositories.document_repo import DocumentRepo
from app.schemas.document import DocumentOut

router = APIRouter()

ALLOWED = {"application/pdf", "image/jpeg", "image/png"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

@router.get("/categories", response_model=list[str])
def categories():
    return REQUIRED_CATEGORIES

def _delete_file_if_exists(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        # no interrumpir flujo por error de filesystem
        pass

@router.post("/documents", response_model=DocumentOut)
async def upload_document(
    # Ahora la categoría viene en el cuerpo como form-data (más natural para multipart)
    category: str = Form(..., description="Categoría requerida exactamente como en /categories"),
    file: UploadFile = File(...),
    # Opcional: reemplazar si ya existe un documento en la misma categoría
    replace: bool = Query(False, description="Si true, reemplaza el documento existente en esta categoría"),
    family_member_name: str | None = Form(None),
    db: Session = Depends(get_db),
    user = Depends(current_user),
):
    if category not in REQUIRED_CATEGORIES:
        raise HTTPException(400, "Categoría inválida. Consulta /api/v1/categories")
    if file.content_type not in ALLOWED:
        raise HTTPException(415, "Tipo de archivo no permitido (PDF, JPG o PNG)")
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "Archivo demasiado grande (máx 10MB)")

    repo = DocumentRepo(db)

    # ¿Ya hay documento(s) de esta categoría?
    # TODO: Si es familia, permitir múltiples docs por categoría si son de diferentes miembros
    existing_docs = [d for d in repo.list_by_user(user_id=user.id) if d.category == category]
    
    # Si no especifican miembro, asumimos que es el principal y verificamos duplicados
    # Si especifican miembro, verificamos si ese miembro ya tiene doc en esa categoría
    if family_member_name:
        existing_docs = [d for d in existing_docs if d.family_member_name == family_member_name]
    else:
        # Si no hay nombre, buscamos docs que tampoco tengan nombre (principal)
        existing_docs = [d for d in existing_docs if not d.family_member_name]

    if existing_docs and not replace:
        raise HTTPException(
            status_code=409,
            detail="Ya existe un documento para esta categoría/miembro. Usa ?replace=true para reemplazarlo."
        )

    # Guardar archivo en disco
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}_{file.filename}"
    path = os.path.join(settings.UPLOAD_DIR, stored_name)
    with open(path, "wb") as f:
        f.write(content)

    # Si hay existente(s) y replace=true, borrar físicamente y en BD
    if existing_docs and replace:
        for old in existing_docs:
            _delete_file_if_exists(os.path.join(settings.UPLOAD_DIR, old.stored_name))
            repo.delete(doc=old)

    # Crear registro nuevo
    doc = repo.create(
        user_id=user.id,
        category=category,
        original_name=file.filename,
        stored_name=stored_name,
        mime_type=file.content_type,
        size_bytes=len(content),
        family_member_name=family_member_name
    )
    return doc

@router.get("/documents", response_model=list[DocumentOut])
def my_documents(db: Session = Depends(get_db), user = Depends(current_user)):
    return DocumentRepo(db).list_by_user(user_id=user.id)

@router.get("/documents/{doc_id}")
def download_document(doc_id: int, db: Session = Depends(get_db), user = Depends(current_user)):
    doc = DocumentRepo(db).get_owned(doc_id=doc_id, user_id=user.id)
    if not doc:
        raise HTTPException(404, "No encontrado")
    path = os.path.join(settings.UPLOAD_DIR, doc.stored_name)
    return FileResponse(path, media_type=doc.mime_type, filename=doc.original_name)

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db), user = Depends(current_user)):
    repo = DocumentRepo(db)
    doc = repo.get_owned(doc_id=doc_id, user_id=user.id)
    if not doc:
        raise HTTPException(404, "No encontrado")
    _delete_file_if_exists(os.path.join(settings.UPLOAD_DIR, doc.stored_name))
    repo.delete(doc=doc)
    return {"message": "Eliminado"}
