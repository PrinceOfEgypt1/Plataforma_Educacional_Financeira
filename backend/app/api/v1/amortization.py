"""Endpoints REST de amortizacao - Sprint 3 / F3."""

from __future__ import annotations

import structlog
from fastapi import APIRouter, Header, Request
from prometheus_client import Counter

from app.core.envelope import ResponseEnvelope, ok
from app.core.request_id import get_request_id
from app.schemas.amortization.compare import (
    CompareAmortizationIn,
    CompareAmortizationOut,
)
from app.schemas.amortization.price import PriceIn, PriceOut
from app.schemas.amortization.sac import SacIn, SacOut
from app.services.amortization.calcular_amortizacao_service import (
    comparar_price_sac,
    simular_price,
    simular_sac,
)

logger = structlog.get_logger()

amortizacao_calculos_total = Counter(
    "amortizacao_calculos_total",
    "Total de calculos de amortizacao executados com sucesso.",
    labelnames=["tipo"],
)

router = APIRouter()


@router.post(
    "/price",
    response_model=ResponseEnvelope[PriceOut],
    summary="Calcula tabela PRICE de amortizacao.",
    responses={
        422: {
            "description": "Validacao de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_amortizacao_price(
    payload: PriceIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[PriceOut]:
    request_id = get_request_id(request)
    logger.info(
        "amortizacao_price_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        n_periodos=payload.n_periodos,
    )
    data = simular_price(
        principal=payload.principal,
        taxa_periodo=payload.taxa_periodo,
        n_periodos=payload.n_periodos,
    )
    out = PriceOut.model_validate(data)
    amortizacao_calculos_total.labels(tipo="price").inc()
    return ok(out, message="amortizacao_price_calculada", request_id=request_id)


@router.post(
    "/sac",
    response_model=ResponseEnvelope[SacOut],
    summary="Calcula tabela SAC de amortizacao.",
    responses={
        422: {
            "description": "Validacao de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_amortizacao_sac(
    payload: SacIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[SacOut]:
    request_id = get_request_id(request)
    logger.info(
        "amortizacao_sac_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        n_periodos=payload.n_periodos,
    )
    data = simular_sac(
        principal=payload.principal,
        taxa_periodo=payload.taxa_periodo,
        n_periodos=payload.n_periodos,
    )
    out = SacOut.model_validate(data)
    amortizacao_calculos_total.labels(tipo="sac").inc()
    return ok(out, message="amortizacao_sac_calculada", request_id=request_id)


@router.post(
    "/compare",
    response_model=ResponseEnvelope[CompareAmortizationOut],
    summary="Compara PRICE e SAC para as mesmas premissas.",
    responses={
        422: {
            "description": "Validacao de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_comparar_amortizacao(
    payload: CompareAmortizationIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[CompareAmortizationOut]:
    request_id = get_request_id(request)
    logger.info(
        "amortizacao_compare_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        n_periodos=payload.n_periodos,
    )
    data = comparar_price_sac(
        principal=payload.principal,
        taxa_periodo=payload.taxa_periodo,
        n_periodos=payload.n_periodos,
    )
    out = CompareAmortizationOut.model_validate(data)
    amortizacao_calculos_total.labels(tipo="compare").inc()
    return ok(out, message="amortizacao_compare_calculada", request_id=request_id)
