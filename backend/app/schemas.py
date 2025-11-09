from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from app.db.models import (
    AccountStatus,
    AccountType,
    TransactionType,
    TransferStatus,
    UserRole,
)


class Message(BaseModel):
    detail: str


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=8)
    role: UserRole = UserRole.CUSTOMER


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=8)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserStatusUpdate(BaseModel):
    is_active: bool


# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None
    role: UserRole | None = None
    exp: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Account Schemas
class AccountBase(BaseModel):
    account_type: AccountType = AccountType.CHECKING
    currency: str = Field(default="USD", min_length=3, max_length=3)


class AccountCreate(AccountBase):
    initial_deposit: Decimal = Field(default=Decimal("0.00"), ge=Decimal("0.00"))
    user_id: Optional[int] = Field(default=None, description="Target user for admin-created accounts")


class AccountUpdate(BaseModel):
    account_type: Optional[AccountType] = None
    status: Optional[AccountStatus] = None


class AccountRead(AccountBase):
    id: int
    user_id: int
    account_number: str
    balance: Decimal
    status: AccountStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionBase(BaseModel):
    amount: Decimal = Field(..., gt=Decimal("0.00"))
    description: Optional[str] = None


class DepositRequest(TransactionBase):
    account_id: int


class WithdrawalRequest(TransactionBase):
    account_id: int


class TransferRequest(TransactionBase):
    from_account_id: int
    to_account_id: int
    reference: Optional[str] = None


class TransactionRead(BaseModel):
    id: int
    account_id: int
    tx_type: TransactionType
    amount: Decimal
    description: Optional[str]
    counterparty_account: Optional[str]
    balance_after: Decimal
    initiated_by: int
    transfer_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class TransferRead(BaseModel):
    id: int
    from_account_id: int
    to_account_id: int
    amount: Decimal
    reference: Optional[str]
    status: TransferStatus
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedTransactions(BaseModel):
    total: int
    items: List[TransactionRead]


# Dashboard / Reports
class AccountSummary(AccountRead):
    recent_transactions: List[TransactionRead] = Field(default_factory=list)
    total_in: Decimal
    total_out: Decimal
