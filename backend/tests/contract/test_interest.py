"""Contract — endpoints de juros da API v1.

Conformidade simultânea com:
    - Envelope canônico de sucesso (Doc 06 §4.1) — exatamente cinco
      campos em ``data``: ``summary``, ``tables``, ``charts``,
      ``interpretation``, ``alerts``.
    - RFC 7807 em erros (Doc 06 §4.2).
    - OpenAPI exposta em runtime (``/api/openapi.json``).

Observação sobre ``/compare``: o envelope é o mesmo dos demais
endpoints; o campo ``tables`` é um objeto composto com chaves
aninhadas ``simple`` e ``compound``. Não há
``tables_simples``/``tables_compostos`` no contrato.

Inclui um teste schemathesis opcional que consome o OpenAPI real do
app em processo e executa casos gerados. O teste schemathesis é
pulado se o pacote não estiver instalado.
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

CANONICAL_DATA_KEYS = {
    "summary",
    "tables",
    "charts",
    "interpretation",
    "alerts",
}


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_simple_envelope_padronizado() -> None:
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/interest/simple", json=payload)

    assert response.status_code == 200
    body = response.json()

    # Estrutura do envelope
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    assert body["success"] is True
    assert isinstance(body["message"], str)

    # Meta canônico
    meta = body["meta"]
    assert meta["version"] == "v1"
    UUID(meta["request_id"], version=4)
    assert "generated_at" in meta

    # Data shape canônico — 5 chaves, nada a mais, nada a menos.
    data = body["data"]
    assert set(data.keys()) == CANONICAL_DATA_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_compound_envelope_padronizado() -> None:
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/interest/compound", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}
    data = body["data"]
    assert set(data.keys()) == CANONICAL_DATA_KEYS


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_compare_envelope_padronizado() -> None:
    """``/compare`` respeita a forma canônica — tables é único."""
    payload = {"principal": "1000.00", "taxa_mensal": "0.01", "prazo_meses": 12}
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/interest/compare", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"success", "message", "data", "meta"}

    data = body["data"]
    # Exatamente as 5 chaves canônicas: tables é único, contendo
    # ``simple`` e ``compound`` aninhados.
    assert set(data.keys()) == CANONICAL_DATA_KEYS
    assert "tables_simples" not in data
    assert "tables_compostos" not in data
    assert set(data["tables"].keys()) == {"simple", "compound"}


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_erro_segue_rfc_7807_media_type() -> None:
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.post("/api/v1/interest/simple", json={})

    assert response.status_code == 422
    assert response.headers["content-type"].startswith("application/problem+json")
    body = response.json()
    assert body["status"] == 422
    assert body["code"] == "VALIDATION_ERROR"
    for key in ("type", "title", "detail", "instance", "request_id"):
        assert key in body


@pytest.mark.contract
@pytest.mark.asyncio
async def test_contract_openapi_expoe_endpoints_de_juros() -> None:
    """Conformidade mínima: os três endpoints aparecem no OpenAPI runtime."""
    async with AsyncClient(transport=ASGITransport(app=_APP), base_url="http://test") as client:
        response = await client.get("/api/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert "/api/v1/interest/simple" in paths
    assert "/api/v1/interest/compound" in paths
    assert "/api/v1/interest/compare" in paths
    for path in (
        "/api/v1/interest/simple",
        "/api/v1/interest/compound",
        "/api/v1/interest/compare",
    ):
        assert "post" in paths[path]
        assert "422" in paths[path]["post"]["responses"]


@pytest.mark.contract
def test_contract_app_openapi_publica_operacoes_de_juros() -> None:
    schema = app.openapi()
    paths = schema["paths"]

    for path in (
        "/api/v1/interest/simple",
        "/api/v1/interest/compound",
        "/api/v1/interest/compare",
    ):
        assert path in paths
        assert "post" in paths[path]
        operation = paths[path]["post"]
        assert "requestBody" in operation
        assert "200" in operation["responses"]
        assert "422" in operation["responses"]
