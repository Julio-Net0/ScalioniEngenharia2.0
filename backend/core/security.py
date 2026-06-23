from datetime import datetime, timedelta, timezone

from fastapi import Request
from jose import JWTError, jwt
from passlib.context import CryptContext
from slowapi import Limiter

from backend.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """Decode and validate JWT. Raises JWTError on failure."""
    return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])


def get_client_ip(request: Request) -> str:
    """Extract real client IP considering reverse proxies like Vercel/Render."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    return request.client.host if request.client else "127.0.0.1"


limiter = Limiter(key_func=get_client_ip)


__all__ = ["hash_password", "verify_password", "create_access_token", "decode_access_token", "JWTError", "limiter"]

