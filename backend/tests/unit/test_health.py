"""Teste mínimo de sanidade da API."""

from unittest.mock import AsyncMock

import pytest
from httpx import ASGITransport, AsyncClient

import app.db.session as db_session_module
from app.main import app


class _FakeSessionManager:
    """Gerenciador assíncrono mínimo para simular AsyncSessionLocal em teste unitário."""

    def __init__(self, execute_mock: AsyncMock) -> None:
        self._execute_mock = execute_mock

    async def __aenter__(self) -> object:
        class _FakeSession:
            def __init__(self, execute_mock: AsyncMock) -> None:
                self.execute = execute_mock

        return _FakeSession(self._execute_mock)

    async def __aexit__(self, exc_type: object, exc: object, tb: object) -> None:
        return None


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ok() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_live() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health/live")
    assert response.status_code == 200


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ready(monkeypatch: pytest.MonkeyPatch) -> None:
    execute_mock = AsyncMock(return_value=None)

    monkeypatch.setattr(
        db_session_module,
        "AsyncSessionLocal",
        lambda: _FakeSessionManager(execute_mock),
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health/ready")

    assert response.status_code == 200
    assert response.json()["status"] == "ready"
    execute_mock.assert_awaited_once()
