"""Juros compostos — domínio puro.

Fórmula canônica (Doc 15 §4):
    FV = PV × (1 + i)^n

Com aporte mensal postecipado:
    saldo_{p} = saldo_{p-1} × (1 + i) + aporte

Convenção:
    - Aporte é postecipado: os juros do período são calculados sobre
      o saldo inicial do período; o aporte é somado ao final, após
      incidência dos juros.
    - O parâmetro ``aporte_mensal`` é opcional; quando ``None``, é
      tratado como ``Decimal("0")`` — equivalente a juros compostos
      puros, ``FV = PV × (1 + i)^n``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal

from ._rounding import ensure_precision, money


@dataclass(frozen=True, slots=True)
class PeriodoComposto:
    """Linha da tabela de amortização em juros compostos.

    Atributos:
        periodo: número do período (1-indexed).
        saldo_inicial: saldo no início do período (quantizado).
        juros_periodo: juros gerados no período (quantizado).
        aporte: aporte creditado ao final do período (quantizado).
        saldo_final: saldo ao final do período, após juros e aporte
            (quantizado).
    """

    periodo: int
    saldo_inicial: Decimal
    juros_periodo: Decimal
    aporte: Decimal
    saldo_final: Decimal


@dataclass(frozen=True, slots=True)
class CompostosResultado:
    """Resultado do cálculo de juros compostos.

    Atributos:
        principal: PV de entrada.
        taxa_mensal: taxa de entrada.
        prazo_meses: prazo de entrada.
        aporte_mensal: aporte postecipado aplicado em cada período.
        juros_totais: juros acumulados ao longo de todos os períodos.
        total_aportado: ``aporte_mensal × prazo_meses``.
        total_investido: ``principal + total_aportado``.
        montante_final: saldo ao final do último período.
        tabela: lista de ``PeriodoComposto`` com ``len == prazo_meses``.
    """

    principal: Decimal
    taxa_mensal: Decimal
    prazo_meses: int
    aporte_mensal: Decimal
    juros_totais: Decimal
    total_aportado: Decimal
    total_investido: Decimal
    montante_final: Decimal
    tabela: list[PeriodoComposto] = field(default_factory=list)


def _validate(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
    aporte_mensal: Decimal,
) -> None:
    """Valida precondições; levanta erro estruturado."""
    from . import DomainValidationError

    if isinstance(prazo_meses, bool) or not isinstance(prazo_meses, int):
        raise DomainValidationError(
            code="INVALID_PRAZO_TYPE",
            message="prazo_meses deve ser int (não bool).",
            field="prazo_meses",
            value=prazo_meses,
        )
    if not isinstance(principal, Decimal):
        raise DomainValidationError(
            code="INVALID_PRINCIPAL_TYPE",
            message="principal deve ser Decimal.",
            field="principal",
            value=principal,
        )
    if not isinstance(taxa_mensal, Decimal):
        raise DomainValidationError(
            code="INVALID_TAXA_TYPE",
            message="taxa_mensal deve ser Decimal.",
            field="taxa_mensal",
            value=taxa_mensal,
        )
    if not isinstance(aporte_mensal, Decimal):
        raise DomainValidationError(
            code="INVALID_APORTE_TYPE",
            message="aporte_mensal deve ser Decimal (ou None).",
            field="aporte_mensal",
            value=aporte_mensal,
        )
    if principal < 0:
        raise DomainValidationError(
            code="NEGATIVE_PRINCIPAL",
            message="principal não pode ser negativo.",
            field="principal",
            value=principal,
        )
    if taxa_mensal < 0:
        raise DomainValidationError(
            code="NEGATIVE_TAXA",
            message="taxa_mensal não pode ser negativa.",
            field="taxa_mensal",
            value=taxa_mensal,
        )
    if aporte_mensal < 0:
        raise DomainValidationError(
            code="NEGATIVE_APORTE",
            message="aporte_mensal não pode ser negativo.",
            field="aporte_mensal",
            value=aporte_mensal,
        )
    if prazo_meses <= 0:
        raise DomainValidationError(
            code="NON_POSITIVE_PRAZO",
            message="prazo_meses deve ser estritamente maior que zero.",
            field="prazo_meses",
            value=prazo_meses,
        )


def calcular_juros_compostos(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
    aporte_mensal: Decimal | None = None,
) -> CompostosResultado:
    """Calcula juros compostos, com ou sem aporte mensal postecipado.

    Args:
        principal: valor presente (PV), ``Decimal >= 0``.
        taxa_mensal: taxa por período mensal, ``Decimal >= 0``.
        prazo_meses: número de períodos mensais, ``int > 0``.
        aporte_mensal: aporte postecipado mensal; ``None`` equivale
            a zero.

    Returns:
        ``CompostosResultado`` com juros totais, totais auxiliares,
        montante final e tabela período-a-período (valores
        quantizados em 2 casas).

    Raises:
        DomainValidationError: se qualquer precondição for violada.
    """
    ensure_precision()

    aporte = aporte_mensal if aporte_mensal is not None else Decimal("0")
    _validate(principal, taxa_mensal, prazo_meses, aporte)

    saldo = principal
    tabela: list[PeriodoComposto] = []
    for p in range(1, prazo_meses + 1):
        saldo_inicial = saldo
        juros_periodo = saldo_inicial * taxa_mensal
        saldo = saldo_inicial + juros_periodo + aporte
        tabela.append(
            PeriodoComposto(
                periodo=p,
                saldo_inicial=money(saldo_inicial),
                juros_periodo=money(juros_periodo),
                aporte=money(aporte),
                saldo_final=money(saldo),
            )
        )

    total_aportado = aporte * Decimal(prazo_meses)
    total_investido = principal + total_aportado
    juros_totais = saldo - total_investido

    return CompostosResultado(
        principal=principal,
        taxa_mensal=taxa_mensal,
        prazo_meses=prazo_meses,
        aporte_mensal=aporte,
        juros_totais=money(juros_totais),
        total_aportado=money(total_aportado),
        total_investido=money(total_investido),
        montante_final=money(saldo),
        tabela=tabela,
    )
