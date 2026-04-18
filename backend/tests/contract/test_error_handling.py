"""Contract — handlers de erro conformes RFC 7807 (Doc 06 §4.2)."""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.contract()
@pytest.mark.asyncio()
@pytest.mark.parametrize(
    ("kind", "expected_status", "expected_code"),
    [
        ("business", 400, "BUSINESS_RULE_ERROR"),
        ("not_found", 404, "NOT_FOUND"),
        ("conflict", 409, "CONFLICT"),
        ("rate_limited", 429, "RATE_LIMITED"),
    ],
)
async def test_erros_de_dominio_produzem_problem_rfc7807(
    kind: str,
    expected_status: int,
    expected_code: str,
) -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/v1/contract/errors/{kind}")

    assert response.status_code == expected_status
    assert response.headers["content-type"].startswith("application/problem+json")

    body = response.json()
    assert body["code"] == expected_code
    assert body["status"] == expected_status
    assert body["instance"] == f"/api/v1/contract/errors/{kind}"
    for field in ("type", "title", "detail", "request_id"):
        assert field in body


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_validation_error_de_dominio_retorna_422_com_errors_list() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/contract/errors/validation")

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["code"] == "VALIDATION_ERROR"
    assert isinstance(body["errors"], list)
    assert len(body["errors"]) >= 1


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_request_validation_error_do_fastapi_mapeado_em_problem() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # O path param ``kind`` é Literal; valor fora do conjunto dispara
        # RequestValidationError, que nosso handler converte em Problem 422.
        response = await client.get("/api/v1/contract/errors/valor-fora-do-literal")

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["code"] == "VALIDATION_ERROR"
    assert isinstance(body["errors"], list)


@pytest.mark.contract()
@pytest.mark.asyncio()
async def test_internal_error_nao_expoe_stack_trace() -> None:
    # ``raise_app_exceptions=False`` reproduz o comportamento do servidor ASGI
    # real (uvicorn): a exceção não é re-levantada para o cliente — o handler
    # global do FastAPI formata como Problem 500.
    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/contract/errors/boom")

    assert response.status_code == 500
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["code"] == "INTERNAL_ERROR"
    assert body["status"] == 500
    flat = str(body)
    assert "traceback" not in flat.lower()
    assert "RuntimeError" not in flat
    assert "explosão sintética" not in flat
