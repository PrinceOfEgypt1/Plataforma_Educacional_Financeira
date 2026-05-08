"""Contract -- endpoint POST /api/v1/financing/real_estate."""

from __future__ import annotations

from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
FINANCING_PATH = "/api/v1/financing/real_estate"

CANONICAL_SUMMARY_KEYS = {
    "sistema_amortizacao",
    "valor_imovel",
    "valor_entrada",
    "valor_financiado",
    "prazo_meses",
    "taxa_juros_mensal",
    "total_pago",
    "total_juros",
    "total_amortizado",
    "total_encargos",
    "custo_total",
    "primeira_parcela",
    "ultima_parcela",
}

CANONICAL_PERIODO_KEYS = {
    "numero",
    "saldo_inicial",
    "juros",
    "amortizacao",
    "encargos",
    "prestacao",
    "saldo_final",
}

CANONICAL_PAYLOAD = {
    "valor_imovel": "300000.00",
    "valor_entrada": "60000.00",
    "prazo_meses": 360,
    "taxa_juros_mensal_percentual": "0.7",
    "sistema_amortizacao": "PRICE",
}


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_financing_envelope_padronizado() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json=CANONICAL_PAYLOAD)

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
async def test_contract_financing_data_contem_summary_e_parcelas() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json=CANONICAL_PAYLOAD)

    data = response.json()["data"]
    assert set(data.keys()) == {"summary", "parcelas"}


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_financing_summary_contem_todos_campos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json=CANONICAL_PAYLOAD)

    summary = response.json()["data"]["summary"]
    assert set(summary.keys()) >= CANONICAL_SUMMARY_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_financing_primeira_parcela_contem_todos_campos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json=CANONICAL_PAYLOAD)

    parcelas = response.json()["data"]["parcelas"]
    assert len(parcelas) > 0
    assert set(parcelas[0].keys()) >= CANONICAL_PERIODO_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_financing_erro_segue_rfc_7807() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["status"] == 422
    assert body["code"] == "VALIDATION_ERROR"
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.contract
@pytest.mark.asyncio
@pytest.mark.parametrize("sistema", ["PRICE", "SAC"])
async def test_contract_financing_ambos_sistemas_retornam_200(sistema: str) -> None:
    payload = {**CANONICAL_PAYLOAD, "sistema_amortizacao": sistema}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(FINANCING_PATH, json=payload)

    assert response.status_code == 200
    assert response.json()["data"]["summary"]["sistema_amortizacao"] == sistema
