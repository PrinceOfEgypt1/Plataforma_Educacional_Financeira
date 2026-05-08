"""Integração — POST /api/v1/diagnostic/analyze."""

from __future__ import annotations

from typing import Any, cast
from uuid import UUID

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app

_APP = cast(Any, app)
URL = "/api/v1/diagnostic/analyze"

DG01_PAYLOAD = {
    "renda_mensal": "5000.00",
    "total_despesas_fixas": "2000.00",
    "total_despesas_variaveis": "800.00",
    "total_dividas_mensais": "500.00",
    "total_reserva_atual": "4000.00",
}

DG02_PAYLOAD = {
    "renda_mensal": "3000.00",
    "total_despesas_fixas": "2200.00",
    "total_despesas_variaveis": "700.00",
    "total_dividas_mensais": "500.00",
    "total_reserva_atual": "0.00",
}

CANONICAL_DATA_KEYS = {
    "renda_mensal",
    "total_despesas_fixas",
    "total_despesas_variaveis",
    "total_dividas_mensais",
    "total_reserva_atual",
    "sobra_mensal",
    "despesas_essenciais_mensais",
    "comprometimento_percentual",
    "sobra_percentual",
    "reserva_em_meses",
    "comprometimento_nivel",
    "reserva_nivel",
    "sobra_nivel",
    "pontos_comprometimento",
    "pontos_reserva",
    "pontos_sobra",
    "score",
    "saude_nivel",
    "alertas",
}


# ---------------------------------------------------------------------------
# DG-01 — cenário saudável com reserva insuficiente
# ---------------------------------------------------------------------------


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg01_retorna_200_e_envelope() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert body["message"] == "diagnostico_financeiro_analisado"
    UUID(body["meta"]["request_id"], version=4)
    assert body["meta"]["version"] == "v1"
    assert "generated_at" in body["meta"]


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg01_data_keys_canonicas() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD)

    data = response.json()["data"]
    assert set(data.keys()) == CANONICAL_DATA_KEYS


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg01_valores_canonicos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD)

    data = response.json()["data"]
    assert data["sobra_mensal"] == "1700.00"
    assert data["despesas_essenciais_mensais"] == "2800.00"
    assert data["comprometimento_percentual"] == "10.00"
    assert data["sobra_percentual"] == "34.00"
    assert data["reserva_em_meses"] == "1.43"
    assert data["comprometimento_nivel"] == "baixo"
    assert data["reserva_nivel"] == "insuficiente"
    assert data["sobra_nivel"] == "boa"
    assert data["score"] == 7
    assert data["saude_nivel"] == "boa"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg01_alerta_reserva_insuficiente() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD)

    alertas = response.json()["data"]["alertas"]
    codes = [a["code"] for a in alertas]
    assert "RESERVA_INSUFICIENTE" in codes


# ---------------------------------------------------------------------------
# DG-02 — cenário crítico
# ---------------------------------------------------------------------------


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg02_retorna_200() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG02_PAYLOAD)

    assert response.status_code == 200


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg02_valores_canonicos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG02_PAYLOAD)

    data = response.json()["data"]
    assert data["sobra_mensal"] == "-400.00"
    assert data["comprometimento_percentual"] == "16.67"
    assert data["reserva_em_meses"] == "0.00"
    assert data["sobra_percentual"] == "-13.33"
    assert data["comprometimento_nivel"] == "baixo"
    assert data["reserva_nivel"] == "critica"
    assert data["sobra_nivel"] == "negativa"
    assert data["score"] == 3
    assert data["saude_nivel"] == "critica"


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_dg02_alertas_criticos() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG02_PAYLOAD)

    codes = [a["code"] for a in response.json()["data"]["alertas"]]
    assert "RESERVA_CRITICA" in codes
    assert "SOBRA_NEGATIVA" in codes


# ---------------------------------------------------------------------------
# Propagação de X-Request-ID
# ---------------------------------------------------------------------------


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_propaga_x_request_id() -> None:
    rid = "33333333-3333-4333-8333-333333333333"
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD, headers={"X-Request-ID": rid})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == rid
    assert response.json()["meta"]["request_id"] == rid


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_gera_request_id_quando_ausente() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post(URL, json=DG01_PAYLOAD)

    rid = response.headers["x-request-id"]
    UUID(rid, version=4)
    assert response.json()["meta"]["request_id"] == rid


@pytest.mark.integration
@pytest.mark.asyncio
async def test_post_analyze_aceita_idempotency_key() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        r1 = await client.post(URL, json=DG01_PAYLOAD, headers={"Idempotency-Key": "f2-diagnostic"})
        r2 = await client.post(URL, json=DG01_PAYLOAD, headers={"Idempotency-Key": "f2-diagnostic"})

    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json()["data"] == r2.json()["data"]
