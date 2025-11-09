from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class UserRole(str, PyEnum):
    CUSTOMER = "CUSTOMER"
    ADMIN = "ADMIN"


class AccountStatus(str, PyEnum):
    ACTIVE = "active"
    FROZEN = "frozen"
    CLOSED = "closed"


class AccountType(str, PyEnum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT = "credit"


class TransactionType(str, PyEnum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER_IN = "transfer_in"
    TRANSFER_OUT = "transfer_out"


class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum"), default=UserRole.CUSTOMER
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    accounts: Mapped[List["Account"]] = relationship(back_populates="owner")
    audit_logs: Mapped[List["AuditLog"]] = relationship(back_populates="user")


class Account(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), index=True)
    account_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    account_type: Mapped[AccountType] = mapped_column(
        Enum(AccountType, name="account_type_enum"), default=AccountType.CHECKING
    )
    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[AccountStatus] = mapped_column(
        Enum(AccountStatus, name="account_status_enum"), default=AccountStatus.ACTIVE
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    owner: Mapped[User] = relationship(back_populates="accounts")
    transactions: Mapped[List["Transaction"]] = relationship(back_populates="account")
    outgoing_transfers: Mapped[List["Transfer"]] = relationship(
        back_populates="from_account", foreign_keys="Transfer.from_account_id"
    )
    incoming_transfers: Mapped[List["Transfer"]] = relationship(
        back_populates="to_account", foreign_keys="Transfer.to_account_id"
    )


class Transaction(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("account.id"), index=True)
    tx_type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType, name="transaction_type_enum")
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)
    counterparty_account: Mapped[Optional[str]] = mapped_column(String(20), default=None)
    balance_after: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    initiated_by: Mapped[int] = mapped_column(ForeignKey("user.id"))
    transfer_id: Mapped[Optional[int]] = mapped_column(ForeignKey("transfer.id"), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    account: Mapped[Account] = relationship(back_populates="transactions")
    initiator: Mapped[User] = relationship()
    transfer: Mapped[Optional["Transfer"]] = relationship(back_populates="transactions")


class TransferStatus(str, PyEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class Transfer(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    from_account_id: Mapped[int] = mapped_column(ForeignKey("account.id"))
    to_account_id: Mapped[int] = mapped_column(ForeignKey("account.id"))
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    reference: Mapped[Optional[str]] = mapped_column(String(100), default=None)
    status: Mapped[TransferStatus] = mapped_column(
        Enum(TransferStatus, name="transfer_status_enum"),
        default=TransferStatus.COMPLETED,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    from_account: Mapped[Account] = relationship(
        back_populates="outgoing_transfers", foreign_keys=[from_account_id]
    )
    to_account: Mapped[Account] = relationship(
        back_populates="incoming_transfers", foreign_keys=[to_account_id]
    )
    transactions: Mapped[List[Transaction]] = relationship(
        back_populates="transfer", foreign_keys="Transaction.transfer_id"
    )


class AuditLog(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    action: Mapped[str] = mapped_column(String(100))
    entity: Mapped[str] = mapped_column(String(100))
    entity_id: Mapped[str] = mapped_column(String(36))
    details_json: Mapped[Optional[str]] = mapped_column(Text, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="audit_logs")
