from datetime import datetime, timedelta
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_token(*, subject: str | int, expires_delta: timedelta, secret_key: str) -> str:
    to_encode: dict[str, Any] = {
        "exp": datetime.utcnow() + expires_delta,
        "sub": str(subject),
    }
    return jwt.encode(to_encode, secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str | int) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expires_minutes)
    return create_token(subject=subject, expires_delta=expires_delta, secret_key=settings.jwt_secret_key)


def create_refresh_token(subject: str | int) -> str:
    expires_delta = timedelta(minutes=settings.refresh_token_expires_minutes)
    return create_token(
        subject=subject,
        expires_delta=expires_delta,
        secret_key=settings.jwt_refresh_secret_key,
    )


def decode_token(token: str, *, secret_key: str) -> Optional[dict[str, Any]]:
    try:
        payload = jwt.decode(token, secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None
