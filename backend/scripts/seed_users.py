"""Seed the database with sample users."""

from __future__ import annotations

import random
from typing import Iterable

from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings
from app.core.security import get_password_hash
from app.db import models

fake = Faker()
settings = get_settings()

engine = create_engine(settings.sqlalchemy_database_uri, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def generate_users(count: int) -> Iterable[models.User]:
    roles = [models.UserRole.CUSTOMER, models.UserRole.ADMIN]
    for _ in range(count):
        full_name = fake.name()
        email = fake.unique.email()
        role = random.choices(roles, weights=[0.95, 0.05])[0]
        password_hash = get_password_hash("Passw0rd!")
        yield models.User(
            email=email,
            full_name=full_name,
            password_hash=password_hash,
            role=role,
        )


def seed_users(count: int = 1000) -> None:
    models.Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        session.execute(models.User.__table__.delete())
        session.bulk_save_objects(list(generate_users(count)))
        session.commit()
        print(f"Inserted {count} users")


if __name__ == "__main__":
    seed_users()
