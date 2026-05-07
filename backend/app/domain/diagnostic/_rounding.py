"""Política de arredondamento para o domínio de diagnóstico financeiro."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal, getcontext

INTERNAL_PRECISION: int = 28
DISPLAY_QUANTUM: Decimal = Decimal("0.01")
ROUNDING_MODE = ROUND_HALF_EVEN


def ensure_precision() -> None:
    ctx = getcontext()
    ctx.prec = INTERNAL_PRECISION
    ctx.rounding = ROUNDING_MODE


def money(value: Decimal) -> Decimal:
    return value.quantize(DISPLAY_QUANTUM, rounding=ROUNDING_MODE)
