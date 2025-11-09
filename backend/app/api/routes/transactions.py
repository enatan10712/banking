from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api import deps
from app.db import models
from app.schemas import (
    DepositRequest,
    PaginatedTransactions,
    TransactionRead,
    TransferRead,
    TransferRequest,
    WithdrawalRequest,
)
from app.services import accounts as account_service
from app.services import transactions as transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/deposit", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def deposit(
    payload: DepositRequest,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    account = account_service.get_account(db, payload.account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    account_service.ensure_account_access(account, current_user)
    transaction = transaction_service.deposit(
        db,
        account=account,
        amount=payload.amount,
        description=payload.description,
        initiated_by=current_user,
    )
    db.commit()
    db.refresh(account)
    db.refresh(transaction)
    return transaction


@router.post("/withdraw", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def withdraw(
    payload: WithdrawalRequest,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    account = account_service.get_account(db, payload.account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    account_service.ensure_account_access(account, current_user)
    transaction = transaction_service.withdraw(
        db,
        account=account,
        amount=payload.amount,
        description=payload.description,
        initiated_by=current_user,
    )
    db.commit()
    db.refresh(account)
    db.refresh(transaction)
    return transaction


@router.post("/transfer", response_model=TransferRead, status_code=status.HTTP_201_CREATED)
def transfer(
    payload: TransferRequest,
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
):
    from_account = account_service.get_account(db, payload.from_account_id)
    to_account = account_service.get_account(db, payload.to_account_id)
    if not from_account or not to_account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    account_service.ensure_account_access(from_account, current_user)
    transfer_record = transaction_service.transfer(
        db,
        from_account=from_account,
        to_account=to_account,
        amount=payload.amount,
        reference=payload.reference,
        initiated_by=current_user,
    )
    db.commit()
    db.refresh(from_account)
    db.refresh(to_account)
    db.refresh(transfer_record)
    return transfer_record


@router.get("", response_model=PaginatedTransactions)
def list_transactions(
    db: Session = Depends(deps.get_db_session),
    current_user: models.User = Depends(deps.require_active_user),
    account_id: Optional[int] = Query(default=None),
    tx_type: Optional[models.TransactionType] = Query(default=None),
    min_amount: Optional[Decimal] = Query(default=None, ge=0),
    max_amount: Optional[Decimal] = Query(default=None, ge=0),
    start_date: Optional[datetime] = Query(default=None),
    end_date: Optional[datetime] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    decimal_min = None if min_amount is None else account_service.normalize_amount(min_amount)
    decimal_max = None if max_amount is None else account_service.normalize_amount(max_amount)
    total, items = transaction_service.list_transactions(
        db,
        current_user=current_user,
        account_id=account_id,
        tx_type=tx_type,
        min_amount=decimal_min,
        max_amount=decimal_max,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset,
    )
    return PaginatedTransactions(total=total, items=items)
