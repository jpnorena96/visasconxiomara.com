from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, documents, me, admin, users, clients, forms, categories, activities

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(',') if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth and user endpoints
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(me.router, prefix="/api/v1", tags=["me"])

# Document endpoints
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])

# Client endpoints
app.include_router(clients.router, prefix="/api/v1")

# Form endpoints
app.include_router(forms.router, prefix="/api/v1")

# Category endpoints
app.include_router(categories.router, prefix="/api/v1")

# Activity endpoints
app.include_router(activities.router, prefix="/api/v1")

# Admin endpoints
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(users.router, prefix="/api/v1/admin/users", tags=["users"])

