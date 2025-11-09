from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.db import models
from app.schemas import LoginRequest, Token, UserCreate, UserRead
from app.services import users as user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(deps.get_db_session)):
    user = user_service.create_user(db, user_in=user_in)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(deps.get_db_session)):
    """Authenticate the canonical admin user and issue JWT tokens."""

    # Step 1: look up the user by email (always stored in lowercase).
    user = user_service.get_user_by_email(db, email=payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Step 2: verify the submitted password against the bcrypt hash.
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Step 3: ensure the user has ADMIN privileges before issuing tokens.
    if user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")

    # Step 4: mint short-lived access and refresh tokens for the frontend to store.
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.get("/me", response_model=UserRead)
def read_users_me(current_user: models.User = Depends(deps.require_active_user)):
    return current_user
