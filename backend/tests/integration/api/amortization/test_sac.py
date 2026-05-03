"""Integracao -- POST /api/v1/amortization/sac."""

from __future__ import annotations

from decimal import Decimal
from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/amortization/sac"


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
async def test_post_sac_caso_canonico_retorna_envelope_e_tabela_fechada() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["message"] == "amortizacao_sac_calculada"

    data = body["data"]
    assert set(data.keys()) == {"summary", "tables", "charts", "interpretation", "alerts"}
    assert data["summary"]["sistema"] == "SAC"
    assert data["summary"]["amortizacao_constante"] == "8333.33"
    assert data["summary"]["parcela_inicial"] == "9333.33"
    assert data["summary"]["parcela_final"] == "8416.70"
    assert data["summary"]["total_pago"] == "106500.00"
    assert data["summary"]["total_juros"] == "6500.00"
    assert len(data["tables"]["amortizacao"]) == 12
    _assert_invariants(data, Decimal("100000.00"))


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_sac_taxa_zero_mantem_fechamento() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["summary"]["total_juros"] == "0.00"
    _assert_invariants(data, Decimal("100000.00"))
