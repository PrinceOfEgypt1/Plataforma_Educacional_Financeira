"""Utilitarios puros do dominio de amortizacao."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_EVEN, Decimal, getcontext

INTERNAL_PRECISION: int = 34
DISPLAY_QUANTUM: Decimal = Decimal("0.01")
ROUNDING_MODE = ROUND_HALF_EVEN
ZERO: Decimal = Decimal("0.00")


@dataclass(frozen=True, slots=True)
class AmortizationPeriod:
    """Linha exibivel de uma tabela de amortizacao."""

    periodo: int
    saldo_inicial: Decimal
    juros: Decimal
    amortizacao: Decimal
    parcela: Decimal
    saldo_final: Decimal


def ensure_precision() -> None:
    """Eleva a precisao Decimal quando necessario, sem reduzi-la."""
    ctx = getcontext()
    if ctx.prec < INTERNAL_PRECISION:
        ctx.prec = INTERNAL_PRECISION


def money(value: Decimal) -> Decimal:
    """Quantiza um Decimal para centavos com ROUND_HALF_EVEN."""
    if not isinstance(value, Decimal):
        raise TypeError(f"money() requer Decimal; recebeu {type(value).__name__}")
    return value.quantize(DISPLAY_QUANTUM, rounding=ROUNDING_MODE)


def validate_inputs(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> Decimal:
    """Valida entradas comuns e devolve principal quantizado em centavos."""
    from . import DomainValidationError

    if isinstance(n_periodos, bool) or not isinstance(n_periodos, int):
        raise DomainValidationError(
            code="INVALID_N_PERIODOS_TYPE",
            message="n_periodos deve ser int (nao bool).",
            field="n_periodos",
            value=n_periodos,
        )
    if not isinstance(principal, Decimal):
        raise DomainValidationError(
            code="INVALID_PRINCIPAL_TYPE",
            message="principal deve ser Decimal.",
            field="principal",
            value=principal,
        )
    if not isinstance(taxa_periodo, Decimal):
        raise DomainValidationError(
            code="INVALID_TAXA_TYPE",
            message="taxa_periodo deve ser Decimal.",
            field="taxa_periodo",
            value=taxa_periodo,
        )
    if not principal.is_finite():
        raise DomainValidationError(
            code="NON_FINITE_PRINCIPAL",
            message="principal deve ser finito.",
            field="principal",
            value=principal,
        )
    if not taxa_periodo.is_finite():
        raise DomainValidationError(
            code="NON_FINITE_TAXA",
            message="taxa_periodo deve ser finita.",
            field="taxa_periodo",
            value=taxa_periodo,
        )
    if principal < 0:
        raise DomainValidationError(
            code="NEGATIVE_PRINCIPAL",
            message="principal nao pode ser negativo.",
            field="principal",
            value=principal,
        )
    if taxa_periodo < 0:
        raise DomainValidationError(
            code="NEGATIVE_TAXA",
            message="taxa_periodo nao pode ser negativa.",
            field="taxa_periodo",
            value=taxa_periodo,
        )
    if n_periodos <= 0:
        raise DomainValidationError(
            code="NON_POSITIVE_N_PERIODOS",
            message="n_periodos deve ser estritamente maior que zero.",
            field="n_periodos",
            value=n_periodos,
        )

    principal_q = money(principal)
    if principal_q != principal:
        raise DomainValidationError(
            code="INVALID_PRINCIPAL_SCALE",
            message="principal deve estar expresso em centavos (ate 2 casas decimais).",
            field="principal",
            value=principal,
        )

    return principal_q


def sum_decimal(values: tuple[Decimal, ...]) -> Decimal:
    """Soma Decimals com elemento neutro Decimal de centavos."""
    return sum(values, ZERO)
