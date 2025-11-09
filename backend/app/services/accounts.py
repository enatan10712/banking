from __future__ import annotations

import secrets
from decimal import Decimal
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db import models

_DECIMAL_PLACES = Decimal("0.01")


def normalize_amount(amount: Decimal) -> Decimal:
    return amount.quantize(_DECIMAL_PLACES)


def _generate_account_number() -> str:
    return "".join(str(secrets.randbelow(10)) for _ in range(12))


def generate_unique_account_number(db: Session) -> str:
    while True:
        candidate = _generate_account_number()
        exists = db.query(models.Account).filter(models.Account.account_number == candidate).first()
        if not exists:
            return candidate


def get_account(db: Session, account_id: int) -> Optional[models.Account]:
    return db.get(models.Account, account_id)


def ensure_account_access(account: models.Account, user: models.User) -> None:
    if user.role == models.UserRole.ADMIN:
        return
    if account.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this account")


def ensure_account_active(account: models.Account) -> None:
    if account.status != models.AccountStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account is not active")


def create_account(
    db: Session,
    *,
    owner: models.User,
    created_by: models.User,
    account_type: models.AccountType,
    currency: str,
    initial_deposit: Decimal,
) -> models.Account:
    if owner.role != models.UserRole.CUSTOMER:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Owner must be a customer")

    account = models.Account(
        user_id=owner.id,
        account_type=account_type,
        currency=currency,
        account_number=generate_unique_account_number(db),
    )
    account.balance = Decimal("0.00")
    db.add(account)
    db.flush()

    initial_deposit = normalize_amount(initial_deposit)
    if initial_deposit > 0:
        account.balance = initial_deposit
        transaction = models.Transaction(
            account_id=account.id,
            tx_type=models.TransactionType.DEPOSIT,
            amount=initial_deposit,
            description="Initial deposit",
            balance_after=initial_deposit,
            counterparty_account=None,
            initiated_by=created_by.id,
        )
        db.add(transaction)

    return account
