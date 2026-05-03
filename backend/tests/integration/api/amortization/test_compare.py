"""Integracao -- POST /api/v1/amortization/compare."""

from __future__ import annotations

from decimal import Decimal
from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/amortization/compare"


def _d(value: str) -> Decimal:
    return Decimal(value)


def _assert_table_invariants(rows: list[dict[str, str]], principal: Decimal) -> None:
    for row in rows:
        assert _d(row["juros"]) + _d(row["amortizacao"]) == _d(row["parcela"])
    assert sum((_d(row["amortizacao"]) for row in rows), Decimal("0.00")) == principal
    assert _d(rows[-1]["saldo_final"]) == Decimal("0.00")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_retorna_price_sac_e_prova_menor_juros_sac() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["message"] == "amortizacao_compare_calculada"

    data = body["data"]
    assert set(data.keys()) == {"summary", "tables", "charts", "interpretation", "alerts"}
    assert set(data["tables"].keys()) == {"price", "sac"}

    summary = data["summary"]
    price = summary["price"]
    sac = summary["sac"]
    assert _d(sac["total_juros"]) < _d(price["total_juros"])
    assert summary["menor_total_juros"] == "SAC"
    assert _d(summary["diferenca_juros"]) == _d(price["total_juros"]) - _d(sac["total_juros"])
    assert _d(summary["diferenca_total_pago"]) == _d(price["total_pago"]) - _d(sac["total_pago"])

    price_rows = data["tables"]["price"]
    sac_rows = data["tables"]["sac"]
    _assert_table_invariants(price_rows, Decimal("100000.00"))
    _assert_table_invariants(sac_rows, Decimal("100000.00"))
    assert sum((_d(row["parcela"]) for row in price_rows), Decimal("0.00")) == _d(
        price["total_pago"]
    )
    assert sum((_d(row["juros"]) for row in sac_rows), Decimal("0.00")) == _d(sac["total_juros"])


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_taxa_zero_retorna_empate() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    summary = response.json()["data"]["summary"]
    assert summary["diferenca_juros"] == "0.00"
    assert summary["diferenca_total_pago"] == "0.00"
    assert summary["menor_total_juros"] == "EMPATE"
