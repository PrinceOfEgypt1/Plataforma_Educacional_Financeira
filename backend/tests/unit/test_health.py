"""Teste mínimo de sanidade da API.

`/health/ready` é coberto por dependency override do FastAPI: substituímos
``app.db.session.get_db`` por uma sessão assíncrona falsa que não abre
conexão real com Postgres. Isso mantém o teste como unitário puro
(sem banco, sem rede, sem dependência de event loop selector/proactor)
e funciona em qualquer plataforma — inclusive Windows com ProactorEventLoop.

O caminho real (com Postgres) continua coberto pelos testes de
``tests/integration/api/test_health_integration.py`` (marker
``@pytest.mark.integration``).
"""

from collections.abc import AsyncIterator
from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.main import app

# ASGITransport espera um Callable estrito; FastAPI usa MutableMapping
# no __call__, gerando incompatibilidade nominal no stub do httpx.
_APP = cast(Any, app)


class _FakeAsyncSession:
    """Substituto mínimo da AsyncSession para o teste de /health/ready.

    Implementa apenas o subset chamado pelo endpoint (``execute``), sem
    abrir conexão real, sem usar driver assíncrono e sem depender do
    event loop selector/proactor. O retorno de ``execute`` é deliberadamente
    opaco: o endpoint não consome o resultado, apenas precisa que a
    chamada não levante.
    """

    async def execute(self, statement: object) -> object:
        # statement não é usado: o endpoint só precisa que a coroutine
        # complete sem erro. Mantemos o parâmetro tipado como ``object``
        # para evitar ``Any`` indevido sem amarrar a assinatura ao tipo
        # interno da SQLAlchemy.
        del statement
        return None


async def _fake_get_db() -> AsyncIterator[AsyncSession]:
    """Override de ``get_db`` para testes unitários.

    Entrega uma ``_FakeAsyncSession`` no formato esperado pelo
    ``Depends(get_db)`` do endpoint. O ``cast`` é o ponto único onde
    afirmamos a compatibilidade estrutural com ``AsyncSession`` — o
    endpoint só usa ``execute``, que ``_FakeAsyncSession`` implementa.
    """
    yield cast(AsyncSession, _FakeAsyncSession())


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ok() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_live() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/health/live")
    assert response.status_code == 200


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ready() -> None:
    """Validação unitária do contrato HTTP de /health/ready.

    Usa ``app.dependency_overrides`` para isolar a dependência de banco;
    o endpoint passa a receber uma ``_FakeAsyncSession`` em vez de uma
    sessão real. O bloco ``finally`` restaura o estado para não vazar
    o override para outros testes.
    """
    app.dependency_overrides[get_db] = _fake_get_db
    try:
        async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
            response = await client.get("/health/ready")
        assert response.status_code == 200
        assert response.json()["status"] == "ready"
    finally:
        app.dependency_overrides.pop(get_db, None)
