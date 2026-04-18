"""Agregador dos routers públicos da API v1.

Cada novo módulo de domínio deve registrar seu ``APIRouter`` aqui.
O router resultante é montado em ``app.main`` com prefixo ``/api/v1``.
"""

from fastapi import APIRouter

from app.api.v1 import contract

v1_router = APIRouter()
v1_router.include_router(contract.public_router, tags=["contract"])
