"""Endpoints REST do diagnóstico financeiro — Sprint 4 / F2."""

from __future__ import annotations

import structlog
from fastapi import APIRouter, Header, Request
from prometheus_client import Counter

from app.core.envelope import ResponseEnvelope, ok
from app.core.request_id import get_request_id
from app.schemas.diagnostic.analyze import (
    DiagnosticAnalyzeRequest,
    DiagnosticAnalyzeResponseData,
)
from app.services.diagnostic.diagnostico_service import analisar

logger = structlog.get_logger()

diagnostico_calculos_total = Counter(
    "diagnostico_calculos_total",
    "Total de diagnósticos financeiros executados com sucesso.",
)

router = APIRouter()


@router.post(
    "/analyze",
    response_model=ResponseEnvelope[DiagnosticAnalyzeResponseData],
    summary="Executa o diagnóstico financeiro completo.",
    responses={
        422: {
            "description": "Validação de entrada falhou (Problem+JSON).",
            "content": {"application/problem+json": {}},
        },
    },
)
async def post_diagnostic_analyze(
    payload: DiagnosticAnalyzeRequest,
    request: Request,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
) -> ResponseEnvelope[DiagnosticAnalyzeResponseData]:
    request_id = get_request_id(request)
    logger.info(
        "diagnostic_analyze_request",
        request_id=request_id,
        idempotency_key=idempotency_key,
        renda_mensal=str(payload.renda_mensal),
    )
    data = analisar(
        renda_mensal=payload.renda_mensal,
        total_despesas_fixas=payload.total_despesas_fixas,
        total_despesas_variaveis=payload.total_despesas_variaveis,
        total_dividas_mensais=payload.total_dividas_mensais,
        total_reserva_atual=payload.total_reserva_atual,
    )
    out = DiagnosticAnalyzeResponseData.model_validate(data)
    diagnostico_calculos_total.inc()
    return ok(out, message="diagnostico_financeiro_analisado", request_id=request_id)
