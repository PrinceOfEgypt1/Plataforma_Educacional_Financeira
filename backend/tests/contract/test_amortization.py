"""Contract -- endpoints publicos de amortizacao da API v1."""

from __future__ import annotations

from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
CANONICAL_DATA_KEYS = {"summary", "tables", "charts", "interpretation", "alerts"}
AMORTIZATION_PATHS = (
    "/api/v1/amortization/price",
    "/api/v1/amortization/sac",
    "/api/v1/amortization/compare",
)
INTEREST_PATHS = (
    "/api/v1/interest/simple",
    "/api/v1/interest/compound",
    "/api/v1/interest/compare",
)


@pytest.mark.contract
@pytest.mark.asyncio
@pytest.mark.parametrize("path", AMORTIZATION_PATHS)
async def test_contract_amortizacao_envelope_padronizado(path: str) -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(path, json=payload)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert isinstance(body["message"], str)
    UUID(body["meta"]["request_id"], version=4)
    assert body["meta"]["version"] == "v1"
    assert "generated_at" in body["meta"]
    assert set(body["data"].keys()) == CANONICAL_DATA_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_amortizacao_erro_segue_rfc_7807_media_type() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/amortization/price", json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["status"] == 422
    assert body["code"] == "VALIDATION_ERROR"
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_openapi_runtime_expoe_juros_e_amortizacao_publicos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/api/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    for path in (*INTEREST_PATHS, *AMORTIZATION_PATHS):
        assert path in paths
        assert "post" in paths[path]
        assert "requestBody" in paths[path]["post"]
        assert "200" in paths[path]["post"]["responses"]
        assert "422" in paths[path]["post"]["responses"]
    assert "/api/v1/contract/errors/{kind}" not in paths


@pytest.mark.contract
def test_contract_app_openapi_publica_operacoes_de_amortizacao() -> None:
    schema = app.openapi()
    paths = schema["paths"]

    for path in AMORTIZATION_PATHS:
        assert path in paths
        operation = paths[path]["post"]
        assert "requestBody" in operation
        assert "200" in operation["responses"]
        assert "422" in operation["responses"]
