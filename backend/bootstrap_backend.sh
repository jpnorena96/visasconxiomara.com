EOF

# ───────────────────────────────────────── app tree
mkdir -p app/{api/v1,core,models,repositories,schemas}
touch app/__init__.py app/api/__init__.py app/api/v1/__init__.py \
      app/core/__init__.py app/models/__init__.py app/repositories/__init__.py app/schemas/__init__.py

# main.py
cat > app/main.py <<'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, documents, me, admin

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(',') if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(me.router,   prefix="/api/v1", tags=["me"])
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
EOF

# core/config.py
cat > app/core/config.py <<'EOF'
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Xiomara Upload API"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    CORS_ORIGINS: str = "*"

    DB_HOST: str
    DB_PORT: int = 3306
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    UPLOAD_DIR: str = "/data/uploads"

    @property
    def DB_URI(self) -> str:
        return f"mysql+mysqldb://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    class Config:
        env_file = ".env"

settings = Settings()
EOF

# core/db.py
cat > app/core/db.py <<'EOF'
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(settings.DB_URI, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

from contextlib import contextmanager
@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
EOF

# core/security.py
cat > app/core/security.py <<'EOF'
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

ALGO = "HS256"
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str) -> str:
    return pwd.hash(p)

def verify_password(p: str, hp: str) -> bool:
    return pwd.verify(p, hp)

def create_token(sub: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": sub, "exp": exp}, settings.SECRET_KEY, algorithm=ALGO)

def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGO])
EOF

# core/deps.py
cat > app/core/deps.py <<'EOF'
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import decode_token
from app.repositories.user_repo import UserRepo
from app.models.user import User

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

def current_user(db: Session = Depends(get_db), token: str = Depends(oauth2)) -> User:
    try:
        payload = decode_token(token)
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    user = UserRepo(db).get_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user

def require_admin(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo admin")
    return user
EOF

# core/categories.py
cat > app/core/categories.py <<'EOF'
REQUIRED_CATEGORIES = [
    "ACTA DE MATRIMONIO",
    "ACTIVOS (PROPIEDADES Y VEHICULOS)",
    "BOLETAS DE PAGO O CUENTAS DE PAGO",
    "CONSTANCIAS DE ESTUDIOS O CV",
    "DNI",
    "DOCUMENTOS ADICIONALES",
    "EMPRESAS O CONSTANCIA DE TRABAJO",
    "ESTADOS DE CUENTA X 6 MESES",
    "FOTO",
    "PASAPORTE",
]
EOF

# models/user.py
cat > app/models/user.py <<'EOF'
from sqlalchemy import String, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="customer", nullable=False)  # admin|customer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
EOF

# models/document.py
cat > app/models/document.py <<'EOF'
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.core.db import Base

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # requerida
    original_name: Mapped[str] = mapped_column(String(255))
    stored_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)  # pending|approved|rejected
    admin_notes: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
EOF

# repositories/user_repo.py
cat > app/repositories/user_repo.py <<'EOF'
from sqlalchemy.orm import Session
from app.models.user import User

class UserRepo:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def create(self, *, email: str, hashed_password: str, role: str = "customer"):
        u = User(email=email, hashed_password=hashed_password, role=role)
        self.db.add(u)
        self.db.commit()
        self.db.refresh(u)
        return u

    def list_customers(self):
        return self.db.query(User).filter(User.role == "customer").order_by(User.id.desc()).all()
EOF

# repositories/document_repo.py
cat > app/repositories/document_repo.py <<'EOF'
from sqlalchemy.orm import Session
from app.models.document import Document

class DocumentRepo:
    def __init__(self, db: Session):
        self.db = db

    def create(self, *, user_id:int, category:str, original_name:str, stored_name:str, mime_type:str, size_bytes:int):
        d = Document(user_id=user_id, category=category, original_name=original_name,
                     stored_name=stored_name, mime_type=mime_type, size_bytes=size_bytes)
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
EOF

# schemas/auth.py
cat > app/schemas/auth.py <<'EOF'
from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
EOF

# schemas/document.py
cat > app/schemas/document.py <<'EOF'
from pydantic import BaseModel
from datetime import datetime

class DocumentOut(BaseModel):
    id: int
    category: str
    original_name: str
    mime_type: str
    size_bytes: int
    status: str
    admin_notes: str | None = None
    created_at: datetime
    class Config:
        from_attributes = True

class AdminReviewIn(BaseModel):
    status: str  # "approved" | "rejected"
    admin_notes: str | None = None
EOF

# schemas/user.py
cat > app/schemas/user.py <<'EOF'
from pydantic import BaseModel, EmailStr

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    class Config:
        from_attributes = True
EOF

# api/v1/auth.py
cat > app/api/v1/auth.py <<'EOF'
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
EOF

# api/v1/me.py
cat > app/api/v1/me.py <<'EOF'
from fastapi import APIRouter, Depends
from app.core.deps import current_user

router = APIRouter()

@router.get("/me")
def me(user = Depends(current_user)):
    return {"id": user.id, "email": user.email, "role": user.role}
EOF

# api/v1/documents.py
cat > app/api/v1/documents.py <<'EOF'
import os, uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.config import settings
from app.core.deps import current_user
from app.core.categories import REQUIRED_CATEGORIES
from app.repositories.document_repo import DocumentRepo
from app.schemas.document import DocumentOut

router = APIRouter()

ALLOWED = {"application/pdf","image/jpeg","image/png"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

@router.get("/categories", response_model=list[str])
def categories():
    return REQUIRED_CATEGORIES

@router.post('/documents', response_model=DocumentOut)
async def upload_document(
    category: str = Query(..., description="Categoría requerida exactamente como en /categories"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(current_user)
):
    if category not in REQUIRED_CATEGORIES:
        raise HTTPException(400, "Categoría inválida")
    if file.content_type not in ALLOWED:
        raise HTTPException(415, 'Tipo de archivo no permitido')
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, 'Archivo demasiado grande (máx 10MB)')
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}_{file.filename}"
    path = os.path.join(settings.UPLOAD_DIR, stored_name)
    with open(path, 'wb') as f:
        f.write(content)

    doc = DocumentRepo(db).create(
        user_id=user.id, category=category,
        original_name=file.filename, stored_name=stored_name,
        mime_type=file.content_type, size_bytes=len(content)
    )
    return doc

@router.get('/documents', response_model=list[DocumentOut])
def my_documents(db: Session = Depends(get_db), user = Depends(current_user)):
    return DocumentRepo(db).list_by_user(user_id=user.id)

@router.get('/documents/{doc_id}')
def download_document(doc_id:int, db: Session = Depends(get_db), user = Depends(current_user)):
    doc = DocumentRepo(db).get_owned(doc_id=doc_id, user_id=user.id)
    if not doc:
        raise HTTPException(404, 'No encontrado')
    path = os.path.join(settings.UPLOAD_DIR, doc.stored_name)
    return FileResponse(path, media_type=doc.mime_type, filename=doc.original_name)

@router.delete('/documents/{doc_id}')
def delete_document(doc_id:int, db: Session = Depends(get_db), user = Depends(current_user)):
    repo = DocumentRepo(db)
    doc = repo.get_owned(doc_id=doc_id, user_id=user.id)
    if not doc:
        raise HTTPException(404, 'No encontrado')
    path = os.path.join(settings.UPLOAD_DIR, doc.stored_name)
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass
    repo.delete(doc=doc)
    return {"message":"Eliminado"}
EOF

# api/v1/admin.py
cat > app/api/v1/admin.py <<'EOF'
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
EOF

# ───────────────────────────────────────── simple auto-create tables helper
cat > app/_init_db_once.py <<'EOF'
# Uso de emergencia para desarrollo: crear tablas si no existen.
from app.core.db import engine
from app.models import user, document  # noqa
from app.core.db import Base

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas (si no existían).")
EOF

echo "Proyecto creado en $(pwd)"
echo "Sugerencia (DEV):"
echo "  python -m app._init_db_once   # crea tablas inmediatamente si no usas Alembic"
