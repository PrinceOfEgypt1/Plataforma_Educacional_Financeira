"""Integração — respostas de erro RFC 7807 do endpoint de diagnóstico."""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/diagnostic/analyze"


def _assert_problem(body: dict[str, Any], status: int, code: str) -> None:
    assert body["status"] == status
    assert body["code"] == code
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.integration
@pytest.mark.asyncio
async def test_payload_vazio_retorna_problem_422() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_renda_zero_retorna_problem_422() -> None:
    payload = {
        "renda_mensal": "0.00",
        "total_despesas_fixas": "1000.00",
        "total_despesas_variaveis": "500.00",
        "total_dividas_mensais": "200.00",
        "total_reserva_atual": "3000.00",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_renda_negativa_retorna_problem_422() -> None:
    payload = {
        "renda_mensal": "-100.00",
        "total_despesas_fixas": "1000.00",
        "total_despesas_variaveis": "500.00",
        "total_dividas_mensais": "200.00",
        "total_reserva_atual": "3000.00",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_despesas_fixas_negativas_retorna_problem_422() -> None:
    payload = {
        "renda_mensal": "5000.00",
        "total_despesas_fixas": "-500.00",
        "total_despesas_variaveis": "800.00",
        "total_dividas_mensais": "200.00",
        "total_reserva_atual": "3000.00",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_despesas_essenciais_zero_retorna_problem_422() -> None:
    payload = {
        "renda_mensal": "5000.00",
        "total_despesas_fixas": "0.00",
        "total_despesas_variaveis": "0.00",
        "total_dividas_mensais": "0.00",
        "total_reserva_atual": "10000.00",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_campo_extra_rejeitado_retorna_problem_422() -> None:
    payload = {
        "renda_mensal": "5000.00",
        "total_despesas_fixas": "2000.00",
        "total_despesas_variaveis": "800.00",
        "total_dividas_mensais": "500.00",
        "total_reserva_atual": "4000.00",
        "campo_extra_invalido": "nao_permitido",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422, "VALIDATION_ERROR")
