"""Juros compostos — função pura `calcular_juros_compostos`.

Modelo iterativo, aporte ao **fim** de cada período (annuity-ordinary):

    M_0 = principal
    para k = 1..n:
        juros_k = M_{k-1} · taxa
        M_k     = M_{k-1} + juros_k + aporte_mensal

Propriedades:
    juros_total    = M_n − principal − aporte_mensal · n
    total_aportado = aporte_mensal · n
"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal

from ._rounding import domain_context, quantize_display


@dataclass(frozen=True, slots=True)
class CompoundPeriod:
    """Linha da tabela de juros compostos para o período `period` (1-indexed).

    `juros_periodo` é o juro gerado NO período; `juros_acumulado` é a soma
    dos juros do período 1 até `period`, inclusive.
    """

    period: int
    aporte: Decimal
    juros_periodo: Decimal
    juros_acumulado: Decimal
    montante: Decimal


@dataclass(frozen=True, slots=True)
class CompoundInterestResult:
    """Resultado imutável do cálculo de juros compostos."""

    principal: Decimal
    taxa: Decimal
    prazo: int
    aporte_mensal: Decimal
    total_aportado: Decimal
    juros_total: Decimal
    montante_final: Decimal
    periodos: tuple[CompoundPeriod, ...]


def _validate(
    principal: Decimal,
    taxa: Decimal,
    prazo: int,
    aporte_mensal: Decimal,
) -> None:
    from . import (
        InvalidContributionError,
        InvalidPrincipalError,
        InvalidRateError,
        InvalidTermError,
    )

    if not isinstance(principal, Decimal):
        raise InvalidPrincipalError(
            f"principal deve ser Decimal; recebido tipo {type(principal).__name__}"
        )
    if principal < 0:
        raise InvalidPrincipalError(f"principal deve ser não-negativo; recebido {principal}")
    if not isinstance(taxa, Decimal):
        raise InvalidRateError(f"taxa deve ser Decimal; recebido tipo {type(taxa).__name__}")
    if taxa < 0:
        raise InvalidRateError(f"taxa deve ser não-negativa; recebido {taxa}")
    if isinstance(prazo, bool) or not isinstance(prazo, int):
        raise InvalidTermError(f"prazo deve ser int; recebido tipo {type(prazo).__name__}")
    if prazo <= 0:
        raise InvalidTermError(f"prazo deve ser positivo; recebido {prazo}")
    if not isinstance(aporte_mensal, Decimal):
        tipo = type(aporte_mensal).__name__
        raise InvalidContributionError(f"aporte_mensal deve ser Decimal; recebido tipo {tipo}")
    if aporte_mensal < 0:
        raise InvalidContributionError(
            f"aporte_mensal deve ser não-negativo; recebido {aporte_mensal}"
        )
    # Regra de domínio: um cálculo de compostos sem principal E sem aporte
    # é degenerado (resultado trivialmente 0) e quase sempre indica erro
    # de entrada. Rejeitar é mais seguro que retornar zeros silenciosamente.
    if principal == Decimal(0) and aporte_mensal == Decimal(0):
        raise InvalidPrincipalError("principal e aporte_mensal não podem ser ambos zero")


def calcular_juros_compostos(
    *,
    principal: Decimal,
    taxa: Decimal,
    prazo: int,
    aporte_mensal: Decimal = Decimal(0),
) -> CompoundInterestResult:
    """Calcula juros compostos com aporte mensal opcional ao fim de cada período.

    Parâmetros (todos nomeados):
        principal:     `Decimal` ≥ 0. Capital inicial.
        taxa:          `Decimal` ≥ 0. Taxa periódica em forma decimal.
        prazo:         `int` > 0. Número de períodos.
        aporte_mensal: `Decimal` ≥ 0. Aporte ao fim de cada período.
                       Default `Decimal(0)`.

    Restrição: `principal == 0 and aporte_mensal == 0` é rejeitado
    (InvalidPrincipalError) por ser degenerado.

    Retorna:
        `CompoundInterestResult` imutável.

    Ergue:
        InvalidPrincipalError, InvalidRateError, InvalidTermError,
        InvalidContributionError.

    Pureza:
        Sem IO. Sem log. Sem mutação externa. Contexto decimal local.
    """
    _validate(principal, taxa, prazo, aporte_mensal)

    with domain_context():
        periodos_list: list[CompoundPeriod] = []
        montante_hp = principal  # acumulador em alta precisão
        juros_acum_hp = Decimal(0)
        for k in range(1, prazo + 1):
            juros_k_hp = montante_hp * taxa
            juros_acum_hp = juros_acum_hp + juros_k_hp
            montante_hp = montante_hp + juros_k_hp + aporte_mensal
            periodos_list.append(
                CompoundPeriod(
                    period=k,
                    aporte=quantize_display(aporte_mensal),
                    juros_periodo=quantize_display(juros_k_hp),
                    juros_acumulado=quantize_display(juros_acum_hp),
                    montante=quantize_display(montante_hp),
                )
            )

        total_aportado = quantize_display(aporte_mensal * Decimal(prazo))
        juros_total = quantize_display(juros_acum_hp)
        montante_final = quantize_display(montante_hp)

    return CompoundInterestResult(
        principal=principal,
        taxa=taxa,
        prazo=prazo,
        aporte_mensal=aporte_mensal,
        total_aportado=total_aportado,
        juros_total=juros_total,
        montante_final=montante_final,
        periodos=tuple(periodos_list),
    )
