"""Utilitarios puros do dominio de financiamento imobiliario."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal, getcontext

INTERNAL_PRECISION: int = 34
DISPLAY_QUANTUM: Decimal = Decimal("0.01")
ROUNDING_MODE = ROUND_HALF_EVEN
ZERO: Decimal = Decimal("0.00")


def ensure_precision() -> None:
    ctx = getcontext()
    if ctx.prec < INTERNAL_PRECISION:
        ctx.prec = INTERNAL_PRECISION


def money(value: Decimal) -> Decimal:
    """Quantiza um Decimal para centavos com ROUND_HALF_EVEN."""
    if not isinstance(value, Decimal):
        raise TypeError(f"money() requer Decimal; recebeu {type(value).__name__}")
    return value.quantize(DISPLAY_QUANTUM, rounding=ROUNDING_MODE)
