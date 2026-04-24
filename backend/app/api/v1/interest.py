"""Endpoints REST de juros — Sprint 2 / F3.

Três rotas POST expõem as simulações:

    - ``POST /api/v1/interest/simple``   — juros simples
    - ``POST /api/v1/interest/compound`` — juros compostos
    - ``POST /api/v1/interest/compare``  — comparação simples × compostos

Todas retornam ``ResponseEnvelope[T]`` com ``T`` sendo o schema ``*Out``
correspondente. Em caso de erro de validação de pré-condição do
domínio, o service converte em ``core.errors.ValidationError`` e o
handler global responde com ``application/problem+json`` (RFC 7807).

Observabilidade:
    - Contador Prometheus ``juros_calculos_total{tipo=...}`` é
      incrementado a cada requisição bem-sucedida.
    - Header ``Idempotency-Key`` é aceito e registrado em log.
      Não há armazenamento de chave nesta sprint — idempotência
      efetiva fica para F5+ (Doc 06 §6).

Observação sobre imports
    Por mandato da Entrega 02, este módulo **não** depende dos
    agregadores globais ``app.schemas`` e ``app.services`` (ambos
    pacotes namespace vazios no repositório). Todos os imports
    apontam diretamente para os submódulos concretos.
"""

from __future__ import annotations

import structlog
from fastapi import APIRouter, Header, Request
from prometheus_client import Counter

from app.core.envelope import ResponseEnvelope, ok
from app.core.request_id import get_request_id
from app.schemas.interest.compare import CompararJurosIn, CompararJurosOut
from app.schemas.interest.compound import JurosCompostosIn, JurosCompostosOut
from app.schemas.interest.simple import JurosSimplesIn, JurosSimplesOut
from app.services.interest.calcular_juros_service import (
    comparar_juros,
    simular_juros_compostos,
    simular_juros_simples,
)

logger = structlog.get_logger()

juros_calculos_total = Counter(
    "juros_calculos_total",
    "Total de cálculos de juros executados com sucesso.",
    labelnames=["tipo"],
)

router = APIRouter()


@router.post(
    "/simple",
    response_model=ResponseEnvelope[JurosSimplesOut],
    summary="Calcula juros simples (Doc 15 §3).",
    responses={
        422: {
            "description": "Validação de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_juros_simples(
    payload: JurosSimplesIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[JurosSimplesOut]:
    request_id = get_request_id(request)
    logger.info(
        "juros_simples_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        prazo_meses=payload.prazo_meses,
    )
    data = simular_juros_simples(
        principal=payload.principal,
        taxa_mensal=payload.taxa_mensal,
        prazo_meses=payload.prazo_meses,
    )
    out = JurosSimplesOut.model_validate(data)
    juros_calculos_total.labels(tipo="simple").inc()
    return ok(
        out,
        message="juros_simples_calculados",
        request_id=request_id,
    )


@router.post(
    "/compound",
    response_model=ResponseEnvelope[JurosCompostosOut],
    summary="Calcula juros compostos (Doc 15 §4), aporte mensal opcional.",
    responses={
        422: {
            "description": "Validação de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_juros_compostos(
    payload: JurosCompostosIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[JurosCompostosOut]:
    request_id = get_request_id(request)
    logger.info(
        "juros_compostos_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        prazo_meses=payload.prazo_meses,
        tem_aporte=payload.aporte_mensal is not None,
    )
    data = simular_juros_compostos(
        principal=payload.principal,
        taxa_mensal=payload.taxa_mensal,
        prazo_meses=payload.prazo_meses,
        aporte_mensal=payload.aporte_mensal,
    )
    out = JurosCompostosOut.model_validate(data)
    juros_calculos_total.labels(tipo="compound").inc()
    return ok(
        out,
        message="juros_compostos_calculados",
        request_id=request_id,
    )


@router.post(
    "/compare",
    response_model=ResponseEnvelope[CompararJurosOut],
    summary="Compara simples × compostos sobre a mesma entrada.",
    responses={
        422: {
            "description": "Validação de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_comparar_juros(
    payload: CompararJurosIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[CompararJurosOut]:
    request_id = get_request_id(request)
    logger.info(
        "juros_compare_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        prazo_meses=payload.prazo_meses,
    )
    data = comparar_juros(
        principal=payload.principal,
        taxa_mensal=payload.taxa_mensal,
        prazo_meses=payload.prazo_meses,
    )
    out = CompararJurosOut.model_validate(data)
    juros_calculos_total.labels(tipo="compare").inc()
    return ok(
        out,
        message="juros_compare_calculados",
        request_id=request_id,
    )
