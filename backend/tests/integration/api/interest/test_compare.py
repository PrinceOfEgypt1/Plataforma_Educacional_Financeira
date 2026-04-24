"""Integração — ``POST /api/v1/interest/compare``.

Forma canônica do ``data`` na resposta:

    {
      "summary": {...},
      "tables": {"simple": [...], "compound": [...]},
      "charts": [ {series: [serie_simples, serie_composto]} ],
      "interpretation": {"headline": "...", "body": "..."},
      "alerts": []
    }

**Não** existem campos ``tables_simples`` e ``tables_compostos``
como pares do envelope; as duas tabelas são aninhadas dentro de
``tables`` sob as chaves ``simple`` e ``compound``.
"""

from __future__ import annotations

from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

# ASGITransport espera um ``Callable`` estrito; FastAPI usa ``MutableMapping``
# no __call__, gerando incompatibilidade nominal no stub do httpx. O cast
# abaixo localiza a supressão em um único ponto por arquivo de teste.
_APP = cast(Any, app)

URL = "/api/v1/interest/compare"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_caso_canonico() -> None:
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
    assert body["message"] == "juros_compare_calculados"

    data = body["data"]

    # Envelope canônico: exatamente 5 campos, nem mais nem menos.
    assert set(data.keys()) == {
        "summary",
        "tables",
        "charts",
        "interpretation",
        "alerts",
    }

    summary = data["summary"]
    assert summary["montante_simples"] == "1120.00"
    assert summary["montante_composto"] == "1126.83"
    assert summary["diferenca"] == "6.83"
    # Razão > 1 e próxima de 1.006098
    assert float(summary["razao"]) > 1.0

    # tables é um único campo, com duas chaves aninhadas.
    tables = data["tables"]
    assert set(tables.keys()) == {"simple", "compound"}
    assert len(tables["simple"]) == 12
    assert len(tables["compound"]) == 12


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_envelope_nao_tem_chaves_legadas() -> None:
    """Garante a ausência de ``tables_simples``/``tables_compostos``.

    Esta asserção fecha explicitamente a forma anterior (rejeitada
    na Entrega 01) e prova que o contrato canônico está em vigor.
    """
    payload = {
        "principal": "1000.00",
        "taxa_mensal": "0.01",
        "prazo_meses": 12,
    }
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    data = response.json()["data"]
    assert "tables_simples" not in data
    assert "tables_compostos" not in data


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_taxa_zero_retorna_diferenca_zero() -> None:
    payload = {"principal": "1000.00", "taxa_mensal": "0", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    assert response.status_code == 200
    summary = response.json()["data"]["summary"]
    assert summary["diferenca"] == "0.00"
    assert summary["montante_simples"] == summary["montante_composto"]


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_charts_tem_duas_series() -> None:
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    charts = response.json()["data"]["charts"]
    assert len(charts) == 1
    assert len(charts[0]["series"]) == 2
    kinds = {s["kind"] for s in charts[0]["series"]}
    assert kinds == {"simples", "composto"}


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_compare_tabelas_aninhadas_tem_forma_esperada() -> None:
    """Validação estrutural das linhas dentro de ``tables.simple``/``tables.compound``."""
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=payload)

    tables = response.json()["data"]["tables"]

    simples_row = tables["simple"][0]
    assert set(simples_row.keys()) == {
        "periodo",
        "saldo_inicial",
        "juros_periodo",
        "saldo_final",
    }

    composto_row = tables["compound"][0]
    assert set(composto_row.keys()) == {
        "periodo",
        "saldo_inicial",
        "juros_periodo",
        "aporte",
        "saldo_final",
    }
