"""Contract — envelope de sucesso no endpoint-demo ``/api/v1/contract/ping``."""

from __future__ import annotations

from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_contract_ping_retorna_envelope_padrao() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/contract/ping", params={"echo": "hello"})

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/json")

    body = response.json()
    assert body["success"] is True
    assert body["message"] == "pong"
    assert body["data"]["pong"] is True
    assert body["data"]["echo"] == "hello"

    meta = body["meta"]
    assert meta["version"] == "v1"
    UUID(meta["request_id"], version=4)
    assert "generated_at" in meta


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_contract_ping_propaga_x_request_id_do_cliente() -> None:
    rid = "22222222-2222-4222-8222-222222222222"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(
            "/api/v1/contract/ping",
            headers={"X-Request-ID": rid},
        )

    assert response.status_code == 200
    assert response.headers["x-request-id"] == rid
    assert response.json()["meta"]["request_id"] == rid


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_contract_ping_gera_x_request_id_quando_ausente() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/contract/ping")

    rid = response.headers["x-request-id"]
    UUID(rid, version=4)
    assert response.json()["meta"]["request_id"] == rid
