"""Juros simples — função pura `calcular_juros_simples`.

Fórmula:
    J_total = P · i · n
    M_final = P + J_total
    J_acumulado(k) = P · i · k,  para k ∈ [1..n]
    M(k)           = P + P · i · k
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal

from ._rounding import domain_context, quantize_display


@dataclass(frozen=True, slots=True)
class SimplePeriod:
    """Linha da tabela de juros simples para o período `period` (1-indexed)."""

    period: int
    juros_acumulado: Decimal
    montante: Decimal


@dataclass(frozen=True, slots=True)
class SimpleInterestResult:
    """Resultado imutável do cálculo de juros simples."""

    principal: Decimal
    taxa: Decimal
    prazo: int
    juros_total: Decimal
    montante_final: Decimal
    periodos: tuple[SimplePeriod, ...]


def _validate(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    # Importar aqui evita ciclo — `__init__` já definiu as exceções quando
    # este módulo é carregado, mas a ordem de import é garantida apenas
    # para nomes já acessíveis no módulo-pai.
    from . import InvalidPrincipalError, InvalidRateError, InvalidTermError

    if not isinstance(principal, Decimal):
        raise InvalidPrincipalError(
            f"principal deve ser Decimal; recebido tipo {type(principal).__name__}"
        )
    if principal <= 0:
        raise InvalidPrincipalError(f"principal deve ser positivo; recebido {principal}")
    if not isinstance(taxa, Decimal):
        raise InvalidRateError(f"taxa deve ser Decimal; recebido tipo {type(taxa).__name__}")
    if taxa < 0:
        raise InvalidRateError(f"taxa deve ser não-negativa; recebido {taxa}")
    # bool herda de int em Python; rejeitar explicitamente antes de int
    if isinstance(prazo, bool) or not isinstance(prazo, int):
        raise InvalidTermError(f"prazo deve ser int; recebido tipo {type(prazo).__name__}")
    if prazo <= 0:
        raise InvalidTermError(f"prazo deve ser positivo; recebido {prazo}")


def calcular_juros_simples(
    *,
    principal: Decimal,
    taxa: Decimal,
    prazo: int,
) -> SimpleInterestResult:
    """Calcula juros simples para `principal` aplicados a `taxa` por `prazo`
    períodos.

    Parâmetros (todos obrigatórios, nomeados):
        principal: `Decimal` > 0. Capital inicial em unidade monetária.
        taxa:      `Decimal` ≥ 0. Taxa periódica em forma decimal
                   (0.01 = 1% ao período).
        prazo:     `int` > 0. Número de períodos.

    Retorna:
        `SimpleInterestResult` imutável com `juros_total`, `montante_final` e
        `periodos` (tabela período-a-período).

    Ergue:
        InvalidPrincipalError, InvalidRateError, InvalidTermError.

    Pureza:
        Sem IO. Sem log. Sem mutação de estado externo. Contexto decimal é
        isolado via `localcontext` (não polui o contexto do chamador).
    """
    _validate(principal, taxa, prazo)

    with domain_context():
        juros_por_periodo = principal * taxa
        periodos: tuple[SimplePeriod, ...] = tuple(
            SimplePeriod(
                period=k,
                juros_acumulado=quantize_display(juros_por_periodo * Decimal(k)),
                montante=quantize_display(principal + juros_por_periodo * Decimal(k)),
            )
            for k in range(1, prazo + 1)
        )
        juros_total = quantize_display(juros_por_periodo * Decimal(prazo))
        montante_final = quantize_display(principal + juros_por_periodo * Decimal(prazo))

    return SimpleInterestResult(
        principal=principal,
        taxa=taxa,
        prazo=prazo,
        juros_total=juros_total,
        montante_final=montante_final,
        periodos=periodos,
    )
