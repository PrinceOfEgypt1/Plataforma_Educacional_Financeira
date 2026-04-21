"""Contrato-base de sucesso — envelope padrão da Plataforma Educacional Financeira.

Conforme Doc 06 §4.1 (API e Contratos v2.0) e ADR-0006 (versionamento por URL).
Toda rota de domínio herda este envelope via ``ResponseEnvelope[T]``.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Generic, TypeVar, cast
from uuid import uuid4

from pydantic import BaseModel, Field

T = TypeVar("T")

API_VERSION = "v1"


class Meta(BaseModel):
    """Metadados canônicos do envelope de sucesso (Doc 06 §4.1)."""

    request_id: str = Field(
        ...,
        description="Identificador único da requisição (UUID4), propagado em X-Request-ID.",
    )
    version: str = Field(
        default=API_VERSION,
        description="Versão da API que respondeu (casa com o prefixo /api/v1).",
    )
    generated_at: datetime = Field(
        ...,
        description="Timestamp ISO-8601 UTC do momento de geração da resposta.",
    )


class ResponseEnvelope(BaseModel, Generic[T]):
    """Envelope canônico de sucesso — Doc 06 §4.1."""

    success: bool = Field(default=True, description="Sempre True em respostas 2xx.")
    message: str = Field(..., description="Mensagem curta legível para o consumidor.")
    data: T = Field(..., description="Carga útil tipada da resposta.")
    meta: Meta = Field(..., description="Metadados da resposta.")


def make_meta(request_id: str | None = None) -> Meta:
    """Cria ``Meta`` com ``request_id`` (novo UUID4 se não fornecido) e timestamp UTC."""
    return Meta(
        request_id=request_id or str(uuid4()),
        version=API_VERSION,
        generated_at=datetime.now(UTC),
    )


def ok(
    data: T,
    message: str = "ok",
    request_id: str | None = None,
) -> ResponseEnvelope[T]:
    """Factory da resposta de sucesso com envelope padrão."""
    envelope = ResponseEnvelope[Any](
        success=True,
        message=message,
        data=data,
        meta=make_meta(request_id),
    )
    return cast("ResponseEnvelope[T]", envelope)
