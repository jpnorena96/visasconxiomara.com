from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, documents, me, admin, users, clients, forms, categories, activities

app = FastAPI(title=settings.APP_NAME)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(',') if o]
# Ensure development frontend is allowed even if not in .env
dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
for origin in dev_origins:
    if origin not in origins:
        origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

print(f"CORS Origins configured: {[o.strip() for o in settings.CORS_ORIGINS.split(',') if o]}")

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

