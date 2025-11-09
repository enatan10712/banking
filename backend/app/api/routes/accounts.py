from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.schemas import AccountCreate, AccountRead, AccountUpdate, Message
from app.services import accounts as account_service

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.post("", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(
    account_in: AccountCreate,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    owner = current_user
    if current_user.role == models.UserRole.ADMIN and account_in.user_id is not None:
        owner = db.get(models.User, account_in.user_id)
        if not owner:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found")
    account = account_service.create_account(
        db,
        owner=owner,
        created_by=current_user,
        account_type=account_in.account_type,
        currency=account_in.currency,
        initial_deposit=account_in.initial_deposit,
    )
    db.commit()
    db.refresh(account)
    return account


@router.get("", response_model=List[AccountRead])
def list_accounts(
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    query = db.query(models.Account)
    if current_user.role == models.UserRole.CUSTOMER:
        query = query.filter(models.Account.user_id == current_user.id)
    accounts = query.all()
    return accounts


@router.get("/{account_id}", response_model=AccountRead)
def get_account(
    account_id: int,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    account = db.get(models.Account, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if current_user.role == models.UserRole.CUSTOMER and account.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return account


@router.patch("/{account_id}", response_model=AccountRead)
def update_account(
    account_id: int,
    account_in: AccountUpdate,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_admin),
):
    account = db.get(models.Account, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    if account_in.account_type is not None:
        account.account_type = account_in.account_type
    if account_in.status is not None:
        account.status = account_in.status

    db.commit()
    db.refresh(account)
    return account


@router.delete("/{account_id}", response_model=Message)
def delete_account(
    account_id: int,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_admin),
):
    account = db.get(models.Account, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    db.delete(account)
    db.commit()
    return Message(detail="Account deleted")
