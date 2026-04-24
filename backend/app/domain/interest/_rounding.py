"""Política de precisão e arredondamento do domínio de juros.

Referências:
    - Doc 09 §12.2 — Regras de arredondamento
    - Doc 04 — Decimal como fonte oficial da verdade
    - PROMPT_OPERACIONAL_FINAL_SPRINT_2 §10

Decisões fixadas:
    - Precisão interna mínima: 28 dígitos decimais.
    - Arredondamento único: ``ROUND_HALF_EVEN`` (bankers).
    - Quantização de apresentação: duas casas decimais
      (``Decimal("0.01")``).
    - O arredondamento ocorre *apenas* na fronteira de apresentação;
      cálculos intermediários mantêm a precisão do contexto.
"""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal, getcontext

INTERNAL_PRECISION: int = 28
"""Precisão mínima exigida do contexto Decimal durante os cálculos."""

DISPLAY_QUANTUM: Decimal = Decimal("0.01")
"""Quantum de apresentação — duas casas decimais (reais/centavos)."""

ROUNDING_MODE = ROUND_HALF_EVEN
"""Modo de arredondamento oficial do domínio (bankers)."""


def ensure_precision() -> None:
    """Garante que o contexto Decimal tem precisão suficiente.

    Idempotente. Nunca reduz a precisão do contexto corrente — apenas
    eleva até ``INTERNAL_PRECISION`` quando necessário. Evita que
    configurações globais mais frouxas comprometam um cálculo.
    """
    ctx = getcontext()
    if ctx.prec < INTERNAL_PRECISION:
        ctx.prec = INTERNAL_PRECISION


def money(value: Decimal) -> Decimal:
    """Quantiza ``value`` para duas casas decimais, bankers.

    Deve ser usado *exclusivamente* na fronteira de apresentação do
    resultado — nunca em etapa intermediária de cálculo.

    Args:
        value: valor em ``Decimal``. Outros tipos não são aceitos.

    Returns:
        ``Decimal`` com exatamente 2 casas decimais.

    Raises:
        TypeError: se ``value`` não for ``Decimal``.
    """
    if not isinstance(value, Decimal):
        raise TypeError(f"money() requer Decimal; recebeu {type(value).__name__}")
    return value.quantize(DISPLAY_QUANTUM, rounding=ROUNDING_MODE)
