"""Integracao -- POST /api/v1/amortization/price."""

from __future__ import annotations

from decimal import Decimal
from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/amortization/price"


def _d(value: str) -> Decimal:
    return Decimal(value)


def _assert_invariants(data: dict[str, Any], principal: Decimal) -> None:
    rows = data["tables"]["amortizacao"]
    summary = data["summary"]
    for row in rows:
        assert _d(row["juros"]) + _d(row["amortizacao"]) == _d(row["parcela"])

    assert sum((_d(row["parcela"]) for row in rows), Decimal("0.00")) == _d(summary["total_pago"])
    assert sum((_d(row["juros"]) for row in rows), Decimal("0.00")) == _d(summary["total_juros"])
    assert sum((_d(row["amortizacao"]) for row in rows), Decimal("0.00")) == principal
    assert _d(rows[-1]["saldo_final"]) == _d(summary["saldo_final"])
    assert _d(summary["saldo_final"]) == Decimal("0.00")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_caso_canonico_retorna_envelope_e_tabela_fechada() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert body["message"] == "amortizacao_price_calculada"
    UUID(body["meta"]["request_id"], version=4)

    data = body["data"]
    assert set(data.keys()) == {"summary", "tables", "charts", "interpretation", "alerts"}
    assert data["summary"]["sistema"] == "PRICE"
    assert data["summary"]["parcela"] == "8884.88"
    assert data["summary"]["total_pago"] == "106618.53"
    assert data["summary"]["total_juros"] == "6618.53"
    assert len(data["tables"]["amortizacao"]) == 12
    _assert_invariants(data, Decimal("100000.00"))


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_propaga_x_request_id() -> None:
    rid = "22222222-2222-4222-8222-222222222222"
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}

    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload, headers={"X-Request-ID": rid})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == rid
    assert response.json()["meta"]["request_id"] == rid


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_price_aceita_idempotency_key_sem_alterar_payload() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        r1 = await client.post(URL, json=payload, headers={"Idempotency-Key": "f3-price"})
        r2 = await client.post(URL, json=payload, headers={"Idempotency-Key": "f3-price"})

    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json()["data"] == r2.json()["data"]
    assert r1.json()["meta"]["request_id"] != r2.json()["meta"]["request_id"]
