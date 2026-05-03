"""Integracao -- respostas de erro RFC 7807 dos endpoints de amortizacao."""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
PRICE = "/api/v1/amortization/price"
SAC = "/api/v1/amortization/sac"
COMPARE = "/api/v1/amortization/compare"


def _assert_problem(body: dict[str, Any], status: int, code: str) -> None:
    assert body["status"] == status
    assert body["code"] == code
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.integration
@pytest.mark.asyncio
async def test_price_payload_vazio_retorna_problem_422() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(PRICE, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_price_principal_zero_rejeitado_na_borda_api() -> None:
    payload = {"principal": "0.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(PRICE, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_sac_principal_negativo_rejeitado_na_borda_api() -> None:
    payload = {"principal": "-1.00", "taxa_periodo": "0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(SAC, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_compare_taxa_negativa_retorna_problem_422() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "-0.01", "n_periodos": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(COMPARE, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_compare_n_periodos_zero_retorna_problem_422() -> None:
    payload = {"principal": "100000.00", "taxa_periodo": "0.01", "n_periodos": 0}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(COMPARE, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_price_campo_extra_forbid_retorna_problem_422() -> None:
    payload = {
        "principal": "100000.00",
        "taxa_periodo": "0.01",
        "n_periodos": 12,
        "campo_nao_declarado": "x",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(PRICE, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_price_method_get_nao_permitido() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get(PRICE)

    assert response.status_code == 405
    assert "POST" in response.headers.get("allow", "")
