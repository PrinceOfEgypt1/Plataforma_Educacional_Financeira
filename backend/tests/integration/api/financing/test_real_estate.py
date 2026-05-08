"""Integracao -- POST /api/v1/financing/real_estate."""

from __future__ import annotations

from decimal import Decimal
from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/financing/real_estate"

_CANONICAL_PRICE = {
    "valor_imovel": "300000.00",
    "valor_entrada": "60000.00",
    "prazo_meses": 360,
    "taxa_juros_mensal_percentual": "0.7",
    "sistema_amortizacao": "PRICE",
}

_CANONICAL_SAC = {**_CANONICAL_PRICE, "sistema_amortizacao": "SAC"}


def _d(v: str) -> Decimal:
    return Decimal(v)


def _assert_envelope(body: dict[str, Any]) -> None:
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert body["message"] == "financiamento_imobiliario_simulado"
    UUID(body["meta"]["request_id"], version=4)
    assert body["meta"]["version"] == "v1"
    assert "generated_at" in body["meta"]


def _assert_data_structure(data: dict[str, Any]) -> None:
    assert "summary" in data
    assert "parcelas" in data


def _assert_invariants(data: dict[str, Any]) -> None:
    summary = data["summary"]
    parcelas = data["parcelas"]

    for p in parcelas:
        assert _d(p["prestacao"]) == _d(p["juros"]) + _d(p["amortizacao"]) + _d(p["encargos"])

    assert _d(parcelas[-1]["saldo_final"]) == _d("0.00")

    soma_amort = sum((_d(p["amortizacao"]) for p in parcelas), _d("0.00"))
    assert soma_amort == _d(summary["valor_financiado"])

    soma_prestacoes = sum((_d(p["prestacao"]) for p in parcelas), _d("0.00"))
    assert soma_prestacoes == _d(summary["total_pago"])


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_retorna_envelope_valido() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=_CANONICAL_PRICE)

    assert response.status_code == 200
    body = response.json()
    _assert_envelope(body)
    _assert_data_structure(body["data"])
    _assert_invariants(body["data"])


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_summary_campos_corretos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=_CANONICAL_PRICE)

    data = response.json()["data"]
    s = data["summary"]
    assert s["sistema_amortizacao"] == "PRICE"
    assert s["valor_financiado"] == "240000.00"
    assert s["prazo_meses"] == 360
    assert _d(s["taxa_juros_mensal"]) == _d("0.007000")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_360_parcelas() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=_CANONICAL_PRICE)

    assert len(response.json()["data"]["parcelas"]) == 360


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_sac_retorna_envelope_valido() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=_CANONICAL_SAC)

    assert response.status_code == 200
    body = response.json()
    _assert_envelope(body)
    _assert_invariants(body["data"])


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_sac_total_juros_menor_que_price() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        r_price = await client.post(URL, json=_CANONICAL_PRICE)
        r_sac = await client.post(URL, json=_CANONICAL_SAC)

    juros_price = _d(r_price.json()["data"]["summary"]["total_juros"])
    juros_sac = _d(r_sac.json()["data"]["summary"]["total_juros"])
    assert juros_sac < juros_price


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_com_encargos_aparece_em_cada_parcela() -> None:
    payload = {**_CANONICAL_PRICE, "seguro_mensal": "150.00", "tarifa_mensal": "25.00"}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    data = response.json()["data"]
    encargos_esperados = _d("175.00")
    for p in data["parcelas"]:
        assert _d(p["encargos"]) == encargos_esperados
