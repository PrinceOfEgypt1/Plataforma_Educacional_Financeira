"""Endpoints REST de financiamento imobiliario -- Sprint 4 / F5."""

from __future__ import annotations

import structlog
from fastapi import APIRouter, Header, Request
from prometheus_client import Counter

from app.core.envelope import ResponseEnvelope, ok
from app.core.request_id import get_request_id
from app.schemas.financing.real_estate import (
    FinanciamentoImobCompareIn,
    FinanciamentoImobCompareOut,
    FinanciamentoImobIn,
    FinanciamentoImobOut,
)
from app.services.financing.simular_financiamento_service import (
    comparar_financiamentos,
    simular_financiamento_imobiliario,
)

logger = structlog.get_logger()

financiamento_imob_total = Counter(
    "financiamento_imob_total",
    "Total de simulacoes de financiamento imobiliario executadas com sucesso.",
)

financiamento_imob_compare_total = Counter(
    "financiamento_imob_compare_total",
    "Total de comparacoes PRICE x SAC executadas com sucesso.",
)

router = APIRouter()


@router.post(
    "/real_estate",
    response_model=ResponseEnvelope[FinanciamentoImobOut],
    summary="Simula financiamento imobiliario com sistema PRICE ou SAC.",
    responses={
        422: {
            "description": "Validacao de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_financing_real_estate(
    payload: FinanciamentoImobIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[FinanciamentoImobOut]:
    request_id = get_request_id(request)
    logger.info(
        "financing_real_estate_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        sistema=payload.sistema_amortizacao,
        prazo_meses=payload.prazo_meses,
    )
    data = simular_financiamento_imobiliario(
        valor_imovel=payload.valor_imovel,
        valor_entrada=payload.valor_entrada,
        prazo_meses=payload.prazo_meses,
        taxa_juros_mensal_percentual=payload.taxa_juros_mensal_percentual,
        sistema_amortizacao=payload.sistema_amortizacao,
        seguro_mensal=payload.seguro_mensal,
        tarifa_mensal=payload.tarifa_mensal,
        custo_administrativo_mensal=payload.custo_administrativo_mensal,
    )
    out = FinanciamentoImobOut.model_validate(data)
    financiamento_imob_total.inc()
    return ok(out, message="financiamento_imobiliario_simulado", request_id=request_id)


@router.post(
    "/real_estate/compare",
    response_model=ResponseEnvelope[FinanciamentoImobCompareOut],
    summary="Compara PRICE x SAC para os mesmos parametros de financiamento imobiliario.",
    responses={
        422: {
            "description": "Validacao de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_financing_real_estate_compare(
    payload: FinanciamentoImobCompareIn,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[FinanciamentoImobCompareOut]:
    request_id = get_request_id(request)
    logger.info(
        "financing_real_estate_compare_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        prazo_meses=payload.prazo_meses,
    )
    data = comparar_financiamentos(
        valor_imovel=payload.valor_imovel,
        valor_entrada=payload.valor_entrada,
        prazo_meses=payload.prazo_meses,
        taxa_juros_mensal_percentual=payload.taxa_juros_mensal_percentual,
        seguro_mensal=payload.seguro_mensal,
        tarifa_mensal=payload.tarifa_mensal,
        custo_administrativo_mensal=payload.custo_administrativo_mensal,
    )
    out = FinanciamentoImobCompareOut.model_validate(data)
    financiamento_imob_compare_total.inc()
    return ok(out, message="financiamento_imobiliario_comparado", request_id=request_id)
