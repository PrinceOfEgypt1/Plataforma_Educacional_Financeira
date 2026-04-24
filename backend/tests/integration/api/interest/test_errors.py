"""Integração — respostas de erro RFC 7807 dos endpoints de juros."""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um ``Callable`` estrito; FastAPI usa ``MutableMapping``
# no __call__, gerando incompatibilidade nominal no stub do httpx. O cast
# abaixo localiza a supressão em um único ponto por arquivo de teste.
_APP = cast(Any, app)

SIMPLE = "/api/v1/interest/simple"
COMPOUND = "/api/v1/interest/compound"
COMPARE = "/api/v1/interest/compare"


def _assert_problem_envelope(body: dict[str, Any], status: int, code: str) -> None:
    assert body["status"] == status
    assert body["code"] == code
    assert "detail" in body
    assert "instance" in body
    assert "request_id" in body
    assert "title" in body


@pytest.mark.integration
@pytest.mark.asyncio
async def test_simple_payload_vazio_retorna_problem_422() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(SIMPLE, json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_simple_principal_negativo_retorna_problem_422() -> None:
    """Pydantic (ge=0) barra antes de chegar ao service — igualmente 422."""
    payload = {"principal": "-1", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(SIMPLE, json=payload)

    assert response.status_code == 422
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_compound_aporte_negativo_retorna_problem_422() -> None:
    payload = {
        "principal": "1000",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
        "aporte_mensal": "-10",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(COMPOUND, json=payload)

    assert response.status_code == 422
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_compare_prazo_zero_retorna_problem_422() -> None:
    payload = {"principal": "1000", "taxa_mensal": "0.01", "prazo_meses": 0}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(COMPARE, json=payload)

    assert response.status_code == 422
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_simple_campo_extra_forbid_retorna_422() -> None:
    payload = {
        "principal": "1000",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
        "campo_nao_declarado": "xyz",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(SIMPLE, json=payload)

    assert response.status_code == 422
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_simple_tipo_invalido_prazo_retorna_422() -> None:
    payload = {
        "principal": "1000",
        "taxa_mensal": "0.01",
        "prazo_meses": "doze",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(SIMPLE, json=payload)

    assert response.status_code == 422
    _assert_problem_envelope(response.json(), 422, "VALIDATION_ERROR")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_simple_method_get_nao_permitido() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get(SIMPLE)

    assert response.status_code == 405
    assert "POST" in response.headers.get("allow", "")

    body = response.json()
    assert body["detail"] == "Method Not Allowed"
    assert "status" not in body
    assert "code" not in body
