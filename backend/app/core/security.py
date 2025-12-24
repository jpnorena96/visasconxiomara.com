from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from app.core.config import settings

ALGO = "HS256"

def hash_password(p: str) -> str:
    # Convert to bytes, truncate to 72 for safety, and hash
    # gensalt() generates a salt for us
    pwd_bytes = p.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes[:72], salt).decode('utf-8')

def verify_password(p: str, hp: str) -> bool:
    pwd_bytes = p.encode('utf-8')
    # If the hash in DB was stored as string, encode it back to bytes
    hash_bytes = hp.encode('utf-8')
    try:
        return bcrypt.checkpw(pwd_bytes[:72], hash_bytes)
    except Exception:
        return False

def create_token(sub: str) -> str:
    exp = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": sub, "exp": exp}, settings.SECRET_KEY, algorithm=ALGO)

def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGO])
