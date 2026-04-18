"""Rotas-demo do contrato-base da API.

- ``GET /contract/ping`` — prova viva do envelope de sucesso; integra a OpenAPI
  pública.
- ``GET /contract/errors/{kind}`` — ramifica cada ``DomainError`` da hierarquia
  para os testes de contrato. Marcado ``include_in_schema=False`` (não vaza na
  OpenAPI) e registrado em ``app.main`` apenas quando ``settings.APP_ENV != "prod"``.
"""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Request
from pydantic import BaseModel

from app.core.envelope import ResponseEnvelope, ok
from app.core.errors import (
    BusinessRuleError,
    ConflictError,
    NotFoundError,
    RateLimitedError,
    ValidationError,
)
from app.core.request_id import get_request_id

public_router = APIRouter()
contract_debug_router = APIRouter()


class PingData(BaseModel):
    pong: bool
    echo: str | None = None


@public_router.get(
    "/contract/ping",
    response_model=ResponseEnvelope[PingData],
    summary="Prova de vida do contrato-base de sucesso (Doc 06 §4.1)",
)
async def contract_ping(
    request: Request,
    echo: str | None = None,
) -> ResponseEnvelope[PingData]:
    request_id = get_request_id(request)
    return ok(
        PingData(pong=True, echo=echo),
        message="pong",
        request_id=request_id,
    )


ErrorKind = Literal[
    "validation",
    "business",
    "not_found",
    "conflict",
    "rate_limited",
    "boom",
]


@contract_debug_router.get(
    "/contract/errors/{kind}",
    summary="Ramifica cada DomainError (interno; não aparece na OpenAPI).",
)
async def contract_errors(kind: ErrorKind) -> dict[str, str]:
    if kind == "validation":
        raise ValidationError(
            "payload inválido",
            errors=[{"field": "example", "message": "campo obrigatório"}],
        )
    if kind == "business":
        raise BusinessRuleError("regra de negócio violada: saldo insuficiente")
    if kind == "not_found":
        raise NotFoundError("recurso demo-xyz não encontrado")
    if kind == "conflict":
        raise ConflictError("estado do recurso já foi modificado")
    if kind == "rate_limited":
        raise RateLimitedError("limite de requisições excedido")
    if kind == "boom":
        msg = "explosão sintética — fallback do handler genérico"
        raise RuntimeError(msg)
    # ``kind`` é Literal exaustivo; este ponto só é alcançado em caso de
    # corrupção do tipo e serve como guarda defensiva.
    msg = f"kind desconhecido: {kind}"  # pragma: no cover
    raise RuntimeError(msg)  # pragma: no cover
