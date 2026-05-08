"""Integracao -- erros do endpoint POST /api/v1/financing/real_estate."""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/financing/real_estate"

_VALID_BASE = {
    "valor_imovel": "300000.00",
    "valor_entrada": "60000.00",
    "prazo_meses": 360,
    "taxa_juros_mensal_percentual": "0.7",
    "sistema_amortizacao": "PRICE",
}


def _assert_problem(body: dict[str, Any], status: int) -> None:
    assert body["status"] == status
    assert "code" in body
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.integration
@pytest.mark.asyncio
async def test_payload_vazio_retorna_422() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    _assert_problem(response.json(), 422)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_sistema_amortizacao_invalido_retorna_422() -> None:
    payload = {**_VALID_BASE, "sistema_amortizacao": "INVALIDO"}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_entrada_igual_imovel_retorna_422() -> None:
    payload = {**_VALID_BASE, "valor_entrada": "300000.00"}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_prazo_zero_retorna_422() -> None:
    payload = {**_VALID_BASE, "prazo_meses": 0}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_valor_imovel_zero_retorna_422() -> None:
    payload = {**_VALID_BASE, "valor_imovel": "0.00", "valor_entrada": "0.00"}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_encargo_negativo_retorna_422() -> None:
    payload = {**_VALID_BASE, "seguro_mensal": "-10.00"}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 422
    _assert_problem(response.json(), 422)
