"""Contrato-base de erro — hierarquia de exceções + modelo Problem (RFC 7807).

Conforme Doc 06 §4.2, §5 (API e Contratos v2.0) + ADR-0007 (HTTP errors RFC 7807).

Hierarquia::

    DomainError (raiz)
    ├── ValidationError    (422 — VALIDATION_ERROR)
    ├── BusinessRuleError  (400 — BUSINESS_RULE_ERROR)
    ├── NotFoundError      (404 — NOT_FOUND)
    ├── ConflictError      (409 — CONFLICT)
    └── RateLimitedError   (429 — RATE_LIMITED)

Códigos canônicos reservados pelo Doc 06 §5 para sprints futuras (sem subclasse
ainda neste sprint): ``UNAUTHENTICATED`` (401), ``UNAUTHORIZED`` (403),
``IDEMPOTENCY_REPLAYED``, ``UPSTREAM_TIMEOUT`` (504), ``INTERNAL_ERROR`` (500).
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

PROBLEM_MEDIA_TYPE = "application/problem+json"
PROBLEM_TYPE_BASE = "about:blank"


class Problem(BaseModel):
    """Modelo Problem Details (RFC 7807) — única saída dos handlers de erro."""

    type: str = Field(default=PROBLEM_TYPE_BASE, description="URI do tipo do problema.")
    title: str = Field(..., description="Resumo humano curto do problema.")
    status: int = Field(..., description="Código HTTP.")
    detail: str = Field(..., description="Explicação concreta do problema nesta ocorrência.")
    instance: str = Field(..., description="URI da requisição que gerou o problema.")
    code: str = Field(..., description="Código canônico da plataforma (Doc 06 §5).")
    request_id: str = Field(..., description="Correlação X-Request-ID.")
    errors: list[dict[str, Any]] | None = Field(
        default=None,
        description="Quando VALIDATION_ERROR, lista detalhada por campo.",
    )


class DomainError(Exception):
    """Raiz da hierarquia de erros de domínio."""

    status_code: int = 500
    code: str = "INTERNAL_ERROR"
    title: str = "Internal Server Error"

    def __init__(
        self,
        detail: str,
        *,
        errors: list[dict[str, Any]] | None = None,
    ) -> None:
        super().__init__(detail)
        self.detail = detail
        self.errors = errors


class ValidationError(DomainError):
    status_code = 422
    code = "VALIDATION_ERROR"
    title = "Unprocessable Entity"


class BusinessRuleError(DomainError):
    status_code = 400
    code = "BUSINESS_RULE_ERROR"
    title = "Bad Request"


class NotFoundError(DomainError):
    status_code = 404
    code = "NOT_FOUND"
    title = "Not Found"


class ConflictError(DomainError):
    status_code = 409
    code = "CONFLICT"
    title = "Conflict"


class RateLimitedError(DomainError):
    status_code = 429
    code = "RATE_LIMITED"
    title = "Too Many Requests"
