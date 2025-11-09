from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app.db import models
from app.services.accounts import ensure_account_access, ensure_account_active, normalize_amount


def _validate_amount(amount: Decimal) -> Decimal:
    normalized = normalize_amount(amount)
    if normalized <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Amount must be greater than zero")
    return normalized


def _create_transaction(
    db: Session,
    *,
    account: models.Account,
    tx_type: models.TransactionType,
    amount: Decimal,
    description: Optional[str],
    initiated_by: int,
    counterparty_account: Optional[str] = None,
    transfer: Optional[models.Transfer] = None,
) -> models.Transaction:
    transaction = models.Transaction(
        account_id=account.id,
        tx_type=tx_type,
        amount=amount,
        description=description,
        balance_after=account.balance,
        counterparty_account=counterparty_account,
        initiated_by=initiated_by,
        transfer_id=transfer.id if transfer else None,
    )
    db.add(transaction)
    return transaction


def deposit(
    db: Session,
    *,
    account: models.Account,
    amount: Decimal,
    description: Optional[str],
    initiated_by: models.User,
) -> models.Transaction:
    ensure_account_active(account)
    amount = _validate_amount(amount)
    account.balance = normalize_amount(account.balance + amount)
    transaction = _create_transaction(
        db,
        account=account,
        tx_type=models.TransactionType.DEPOSIT,
        amount=amount,
        description=description,
        initiated_by=initiated_by.id,
    )
    return transaction


def withdraw(
    db: Session,
    *,
    account: models.Account,
    amount: Decimal,
    description: Optional[str],
    initiated_by: models.User,
) -> models.Transaction:
    ensure_account_active(account)
    amount = _validate_amount(amount)
    if account.balance < amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
    account.balance = normalize_amount(account.balance - amount)
    transaction = _create_transaction(
        db,
        account=account,
        tx_type=models.TransactionType.WITHDRAWAL,
        amount=amount,
        description=description,
        initiated_by=initiated_by.id,
    )
    return transaction


def transfer(
    db: Session,
    *,
    from_account: models.Account,
    to_account: models.Account,
    amount: Decimal,
    reference: Optional[str],
    initiated_by: models.User,
) -> models.Transfer:
    if from_account.id == to_account.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot transfer to the same account")
    ensure_account_active(from_account)
    ensure_account_active(to_account)
    amount = _validate_amount(amount)
    if from_account.balance < amount:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")

    transfer_record = models.Transfer(
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        amount=amount,
        reference=reference,
    )
    db.add(transfer_record)
    db.flush()

    from_account.balance = normalize_amount(from_account.balance - amount)
    to_account.balance = normalize_amount(to_account.balance + amount)

    _create_transaction(
        db,
        account=from_account,
        tx_type=models.TransactionType.TRANSFER_OUT,
        amount=amount,
        description=reference,
        initiated_by=initiated_by.id,
        counterparty_account=to_account.account_number,
        transfer=transfer_record,
    )
    _create_transaction(
        db,
        account=to_account,
        tx_type=models.TransactionType.TRANSFER_IN,
        amount=amount,
        description=reference,
        initiated_by=initiated_by.id,
        counterparty_account=from_account.account_number,
        transfer=transfer_record,
    )

    transfer_record.status = models.TransferStatus.COMPLETED
    return transfer_record


def list_transactions(
    db: Session,
    *,
    current_user: models.User,
    account_id: Optional[int] = None,
    tx_type: Optional[models.TransactionType] = None,
    min_amount: Optional[Decimal] = None,
    max_amount: Optional[Decimal] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[int, list[models.Transaction]]:
    query = db.query(models.Transaction).join(models.Account)

    if current_user.role == models.UserRole.CUSTOMER:
        query = query.filter(models.Account.user_id == current_user.id)

    if account_id is not None:
        query = query.filter(models.Transaction.account_id == account_id)
    if tx_type is not None:
        query = query.filter(models.Transaction.tx_type == tx_type)
    if min_amount is not None:
        query = query.filter(models.Transaction.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(models.Transaction.amount <= max_amount)
    if start_date is not None:
        query = query.filter(models.Transaction.created_at >= start_date)
    if end_date is not None:
        query = query.filter(models.Transaction.created_at <= end_date)

    total = query.with_entities(func.count()).scalar() or 0
    items = (
        query.order_by(models.Transaction.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return total, items
