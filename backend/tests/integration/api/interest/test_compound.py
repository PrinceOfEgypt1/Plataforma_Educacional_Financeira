"""Integração — ``POST /api/v1/interest/compound``."""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um ``Callable`` estrito; FastAPI usa ``MutableMapping``
# no __call__, gerando incompatibilidade nominal no stub do httpx. O cast
# abaixo localiza a supressão em um único ponto por arquivo de teste.
_APP = cast(Any, app)

URL = "/api/v1/interest/compound"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compound_caso_jc01_sem_aporte() -> None:
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
    assert body["message"] == "juros_compostos_calculados"

    summary = body["data"]["summary"]
    assert summary["montante_final"] == "1126.83"
    assert summary["juros_totais"] == "126.83"
    assert summary["aporte_mensal"] == "0.00"
    assert summary["total_aportado"] == "0.00"

    tabela = body["data"]["tables"]["amortizacao"]
    assert len(tabela) == 12
    assert tabela[0]["aporte"] == "0.00"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compound_caso_jc02_com_aporte() -> None:
    payload = {
        "principal": "1000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
        "aporte_mensal": "100.00",
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    summary = response.json()["data"]["summary"]
    assert summary["aporte_mensal"] == "100.00"
    assert summary["total_aportado"] == "1200.00"
    # Montante final > 1126.83 (JC-01)
    assert float(summary["montante_final"]) > 1126.83


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compound_aporte_nulo_equivale_a_sem_aporte() -> None:
    """Payload com ``aporte_mensal: null`` equivale ao campo ausente."""
    p_null = {
        "principal": "1000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
        "aporte_mensal": None,
    }
    p_ausente = {
        "principal": "1000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        r1 = await client.post(URL, json=p_null)
        r2 = await client.post(URL, json=p_ausente)

    assert r1.status_code == 200
    assert r2.status_code == 200
    montante_null = r1.json()["data"]["summary"]["montante_final"]
    montante_ausente = r2.json()["data"]["summary"]["montante_final"]
    assert montante_null == montante_ausente


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compound_prazo_longo_nao_quebra() -> None:
    payload = {
        "principal": "100.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 60,
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)
    assert response.status_code == 200
    tabela = response.json()["data"]["tables"]["amortizacao"]
    assert len(tabela) == 60
