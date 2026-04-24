"""Teste de integração: health/ready com banco real."""

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um Callable estrito; FastAPI usa MutableMapping
# no __call__, gerando incompatibilidade nominal no stub do httpx.
_APP = cast(Any, app)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_health_ok_integration() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_health_ready_with_real_db() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_health_live_integration() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health/live")
    assert response.status_code == 200
    assert response.json()["status"] == "live"
