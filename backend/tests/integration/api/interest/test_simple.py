"""Integração — ``POST /api/v1/interest/simple``.

Valida o ciclo completo: middleware, validação Pydantic, service,
conversão de erro, envelope canônico e header X-Request-ID.
"""

from __future__ import annotations

from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um ``Callable`` estrito; FastAPI usa ``MutableMapping``
# no __call__, gerando incompatibilidade nominal no stub do httpx. O cast
# abaixo localiza a supressão em um único ponto por arquivo de teste.
_APP = cast(Any, app)

URL = "/api/v1/interest/simple"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_simple_caso_js01_retorna_envelope_canonico() -> None:
    payload = {
        "principal": "1000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    body = response.json()

    assert body["success"] is True
    assert body["message"] == "juros_simples_calculados"

    meta = body["meta"]
    UUID(meta["request_id"], version=4)
    assert meta["version"] == "v1"
    assert "generated_at" in meta

    data = body["data"]
    assert data["summary"]["juros_totais"] == "120.00"
    assert data["summary"]["montante_final"] == "1120.00"
    assert data["summary"]["prazo_meses"] == 12
    assert data["summary"]["taxa_mensal"] == "0.010000"

    tabela = data["tables"]["amortizacao"]
    assert len(tabela) == 12
    assert tabela[0]["periodo"] == 1
    assert tabela[-1]["saldo_final"] == "1120.00"

    assert "interpretation" in data
    assert data["interpretation"]["headline"]
    assert len(data["charts"]) == 1


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_simple_propaga_x_request_id() -> None:
    rid = "11111111-1111-4111-8111-111111111111"
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}

    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload, headers={"X-Request-ID": rid})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == rid
    assert response.json()["meta"]["request_id"] == rid


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_simple_aceita_idempotency_key_sem_efeito_colateral() -> None:
    """A chave é aceita e logada; a resposta não altera semântica."""
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        r1 = await client.post(URL, json=payload, headers={"Idempotency-Key": "abc-123"})
        r2 = await client.post(URL, json=payload, headers={"Idempotency-Key": "abc-123"})

    assert r1.status_code == 200
    assert r2.status_code == 200
    # Ambas as respostas têm o mesmo payload de dados (operação determinística).
    assert r1.json()["data"] == r2.json()["data"]
    # Request IDs distintos (log-only idempotency).
    assert r1.json()["meta"]["request_id"] != r2.json()["meta"]["request_id"]
