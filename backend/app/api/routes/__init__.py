from fastapi import APIRouter

from app.api.routes import accounts, auth, transactions, users


router = APIRouter()
router.include_router(auth.router)
router.include_router(accounts.router)
router.include_router(transactions.router)
router.include_router(users.router)

__all__ = ["router"]
