"""Unit — contrato-base de sucesso (envelope) e de erro (Problem/DomainError).

Cobre as invariantes declaradas pelo plano da Sprint 1 §4.4:

- ``ResponseEnvelope`` preserva tipagem de ``data`` em round-trip Pydantic.
- ``Problem`` expõe ``application/problem+json`` como media-type canônico.
- ``DomainError`` e subclasses herdam ``status_code`` e ``code`` corretos.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

import pytest
from pydantic import BaseModel

from app.core.envelope import API_VERSION, ResponseEnvelope, make_meta, ok
from app.core.errors import (
    PROBLEM_MEDIA_TYPE,
    BusinessRuleError,
    ConflictError,
    DomainError,
    NotFoundError,
    Problem,
    RateLimitedError,
    ValidationError,
)


class _PingModel(BaseModel):
    value: int
    label: str


# ── Envelope ───────────────────────────────────────────────────────────────
@pytest.mark.unit
def test_make_meta_gera_uuid4_e_timestamp_utc() -> None:
    meta = make_meta()
    UUID(meta.request_id, version=4)
    assert meta.version == API_VERSION
    assert isinstance(meta.generated_at, datetime)
    assert meta.generated_at.tzinfo is not None


@pytest.mark.unit
def test_make_meta_preserva_request_id_fornecido() -> None:
    rid = "11111111-1111-4111-8111-111111111111"
    meta = make_meta(rid)
    assert meta.request_id == rid


@pytest.mark.unit
def test_ok_monta_envelope_com_data_tipada() -> None:
    envelope = ok(_PingModel(value=42, label="pong"), message="alive")
    assert envelope.success is True
    assert envelope.message == "alive"
    assert envelope.data.value == 42
    assert envelope.data.label == "pong"
    assert envelope.meta.version == API_VERSION


@pytest.mark.unit
def test_response_envelope_roundtrip_preserva_tipo() -> None:
    envelope = ok(_PingModel(value=1, label="x"))
    dumped = envelope.model_dump()
    assert dumped["success"] is True
    assert dumped["data"] == {"value": 1, "label": "x"}
    assert dumped["meta"]["version"] == API_VERSION
    rebuilt = ResponseEnvelope[_PingModel].model_validate(dumped)
    assert rebuilt.data.value == 1
    assert rebuilt.data.label == "x"


# ── Problem / DomainError ──────────────────────────────────────────────────
@pytest.mark.unit
def test_problem_media_type_constante_eh_rfc7807() -> None:
    assert PROBLEM_MEDIA_TYPE == "application/problem+json"


@pytest.mark.unit
def test_problem_serializa_campos_obrigatorios() -> None:
    problem = Problem(
        title="Not Found",
        status=404,
        detail="demo",
        instance="/api/v1/demo",
        code="NOT_FOUND",
        request_id="abc",
    )
    dumped = problem.model_dump(exclude_none=True)
    assert dumped["type"] == "about:blank"
    assert dumped["status"] == 404
    assert dumped["code"] == "NOT_FOUND"
    assert dumped["request_id"] == "abc"
    assert "errors" not in dumped  # exclude_none elimina o campo ausente


@pytest.mark.unit
@pytest.mark.parametrize(
    ("exc_cls", "expected_status", "expected_code"),
    [
        (ValidationError, 422, "VALIDATION_ERROR"),
        (BusinessRuleError, 400, "BUSINESS_RULE_ERROR"),
        (NotFoundError, 404, "NOT_FOUND"),
        (ConflictError, 409, "CONFLICT"),
        (RateLimitedError, 429, "RATE_LIMITED"),
    ],
)
def test_domainerror_subclasses_mantem_status_e_code(
    exc_cls: type[DomainError],
    expected_status: int,
    expected_code: str,
) -> None:
    exc = exc_cls("detalhe do caso")
    assert exc.status_code == expected_status
    assert exc.code == expected_code
    assert exc.detail == "detalhe do caso"


@pytest.mark.unit
def test_domainerror_raiz_default_eh_internal_error() -> None:
    exc = DomainError("boom")
    assert exc.status_code == 500
    assert exc.code == "INTERNAL_ERROR"
    assert exc.title == "Internal Server Error"


@pytest.mark.unit
def test_validation_error_aceita_lista_errors() -> None:
    errs = [{"field": "principal", "message": "deve ser positivo"}]
    exc = ValidationError("inválido", errors=errs)
    assert exc.errors == errs
