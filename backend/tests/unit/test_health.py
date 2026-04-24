"""Teste mínimo de sanidade da API."""

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um Callable estrito; FastAPI usa MutableMapping
# no __call__, gerando incompatibilidade nominal no stub do httpx.
_APP = cast(Any, app)


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ok() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_live() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health/live")
    assert response.status_code == 200


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ready() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health/ready")
    assert response.status_code == 200
