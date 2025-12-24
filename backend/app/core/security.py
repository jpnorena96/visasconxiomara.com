from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

ALGO = "HS256"
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str) -> str:
    # Bcrypt has a limit of 72 bytes. We prevent the crash by truncating.
    return pwd.hash(p[:72])

def verify_password(p: str, hp: str) -> bool:
    return pwd.verify(p, hp)

def create_token(sub: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": sub, "exp": exp}, settings.SECRET_KEY, algorithm=ALGO)

def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGO])
