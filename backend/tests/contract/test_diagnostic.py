"""Contract — endpoint POST /api/v1/diagnostic/analyze."""

from __future__ import annotations

from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
DIAGNOSTIC_PATH = "/api/v1/diagnostic/analyze"

CANONICAL_DATA_KEYS = {
    "renda_mensal",
    "total_despesas_fixas",
    "total_despesas_variaveis",
    "total_dividas_mensais",
    "total_reserva_atual",
    "sobra_mensal",
    "despesas_essenciais_mensais",
    "comprometimento_percentual",
    "sobra_percentual",
    "reserva_em_meses",
    "comprometimento_nivel",
    "reserva_nivel",
    "sobra_nivel",
    "pontos_comprometimento",
    "pontos_reserva",
    "pontos_sobra",
    "score",
    "saude_nivel",
    "alertas",
}

DG01_PAYLOAD = {
    "renda_mensal": "5000.00",
    "total_despesas_fixas": "2000.00",
    "total_despesas_variaveis": "800.00",
    "total_dividas_mensais": "500.00",
    "total_reserva_atual": "4000.00",
}


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_endpoint_existe() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(DIAGNOSTIC_PATH, json=DG01_PAYLOAD)

    assert response.status_code == 200


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_envelope_padronizado() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(DIAGNOSTIC_PATH, json=DG01_PAYLOAD)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert isinstance(body["message"], str)
    UUID(body["meta"]["request_id"], version=4)
    assert body["meta"]["version"] == "v1"
    assert "generated_at" in body["meta"]


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_data_keys_canonicas() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(DIAGNOSTIC_PATH, json=DG01_PAYLOAD)

    assert set(response.json()["data"].keys()) == CANONICAL_DATA_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_erro_segue_rfc_7807() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(DIAGNOSTIC_PATH, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["status"] == 422
    assert body["code"] == "VALIDATION_ERROR"
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.contract
def test_contract_openapi_expoe_diagnostic_analyze() -> None:
    schema = app.openapi()
    paths = schema["paths"]
    assert DIAGNOSTIC_PATH in paths
    operation = paths[DIAGNOSTIC_PATH]["post"]
    assert "requestBody" in operation
    assert "200" in operation["responses"]
    assert "422" in operation["responses"]


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_openapi_runtime_expoe_diagnostic() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/api/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert DIAGNOSTIC_PATH in paths
    assert "post" in paths[DIAGNOSTIC_PATH]
    assert "requestBody" in paths[DIAGNOSTIC_PATH]["post"]
    assert "200" in paths[DIAGNOSTIC_PATH]["post"]["responses"]
    assert "422" in paths[DIAGNOSTIC_PATH]["post"]["responses"]


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_nao_quebra_amortizacao_existente() -> None:
    payload_amort = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/amortization/price", json=payload_amort)

    assert response.status_code == 200
    assert response.json()["success"] is True


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_diagnostic_nao_quebra_juros_existente() -> None:
    payload_interest: dict[str, Any] = {
        "principal": "10000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/interest/compound", json=payload_interest)

    assert response.status_code == 200
    assert response.json()["success"] is True
