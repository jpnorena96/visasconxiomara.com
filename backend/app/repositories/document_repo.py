from sqlalchemy.orm import Session
from app.models.document import Document

class DocumentRepo:
    def __init__(self, db: Session):
        self.db = db

    def create(self, *, user_id:int, category:str, original_name:str, stored_name:str, mime_type:str, size_bytes:int, family_member_name:str|None=None):
        d = Document(user_id=user_id, category=category, original_name=original_name,
                     stored_name=stored_name, mime_type=mime_type, size_bytes=size_bytes, family_member_name=family_member_name)
        self.db.add(d); self.db.commit(); self.db.refresh(d); return d

    def list_by_user(self, *, user_id:int):
        return self.db.query(Document).filter(Document.user_id==user_id).order_by(Document.id.desc()).all()

    def get_owned(self, *, doc_id:int, user_id:int):
        return self.db.query(Document).filter(Document.id==doc_id, Document.user_id==user_id).first()

    def get(self, doc_id:int):
        return self.db.query(Document).filter(Document.id==doc_id).first()

    def list_by_user_admin(self, *, user_id:int):
        return self.db.query(Document).filter(Document.user_id==user_id).order_by(Document.id.desc()).all()

    def review(self, *, doc: Document, status: str, admin_notes: str | None):
        doc.status = status
        doc.admin_notes = admin_notes
        self.db.commit(); self.db.refresh(doc); return doc

    def delete(self, *, doc: Document):
        self.db.delete(doc); self.db.commit()

    def list_all(self):
        return self.db.query(Document).order_by(Document.id.desc()).all()
