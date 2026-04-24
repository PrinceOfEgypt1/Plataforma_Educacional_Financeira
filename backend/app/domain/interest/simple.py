"""Juros simples — domínio puro.

Fórmulas canônicas (Doc 15 §3):
    J  = PV × i × n
    FV = PV × (1 + i × n)

Onde:
    PV = principal
    i  = taxa no mesmo período de n (aqui: mensal)
    n  = prazo em meses

A tabela por período é *linear*: cada período adiciona juros
constantes iguais a ``principal × taxa_mensal`` ao saldo, sem
capitalização. Isto distingue juros simples de juros compostos.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal

from ._rounding import ensure_precision, money


@dataclass(frozen=True, slots=True)
class PeriodoSimples:
    """Linha da tabela de amortização em juros simples.

    Atributos:
        periodo: número do período (1-indexed).
        saldo_inicial: saldo no início do período (quantizado).
        juros_periodo: juros gerados no período (quantizado).
        saldo_final: saldo ao final do período (quantizado).
    """

    periodo: int
    saldo_inicial: Decimal
    juros_periodo: Decimal
    saldo_final: Decimal


@dataclass(frozen=True, slots=True)
class SimplesResultado:
    """Resultado do cálculo de juros simples.

    Atributos:
        principal: PV de entrada (preservado, não quantizado).
        taxa_mensal: taxa de entrada (preservada, não quantizada).
        prazo_meses: prazo de entrada.
        juros_totais: ``principal * taxa * prazo``, quantizado.
        montante_final: ``principal + juros_totais``, quantizado.
        tabela: lista de ``PeriodoSimples`` com ``len == prazo_meses``.
    """

    principal: Decimal
    taxa_mensal: Decimal
    prazo_meses: int
    juros_totais: Decimal
    montante_final: Decimal
    tabela: list[PeriodoSimples] = field(default_factory=list)


def _validate(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
) -> None:
    """Valida precondições de entrada; levanta erro estruturado.

    Importação local de ``DomainValidationError`` para evitar ciclo
    de importação entre ``__init__.py`` e este módulo.
    """
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
    if prazo_meses <= 0:
        raise DomainValidationError(
            code="NON_POSITIVE_PRAZO",
            message="prazo_meses deve ser estritamente maior que zero.",
            field="prazo_meses",
            value=prazo_meses,
        )


def calcular_juros_simples(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
) -> SimplesResultado:
    """Calcula juros simples conforme fórmulas canônicas.

    Args:
        principal: valor presente (PV), ``Decimal >= 0``.
        taxa_mensal: taxa por período mensal, ``Decimal >= 0``
            (ex.: ``Decimal("0.01")`` para 1% a.m.).
        prazo_meses: número de períodos mensais, ``int > 0``.

    Returns:
        ``SimplesResultado`` com juros totais, montante final e
        tabela período-a-período (valores quantizados em 2 casas).

    Raises:
        DomainValidationError: se qualquer precondição for violada.
    """
    ensure_precision()
    _validate(principal, taxa_mensal, prazo_meses)

    juros_por_periodo = principal * taxa_mensal
    juros_totais = juros_por_periodo * Decimal(prazo_meses)
    montante_final = principal + juros_totais

    tabela: list[PeriodoSimples] = []
    for p in range(1, prazo_meses + 1):
        saldo_inicial = principal + juros_por_periodo * Decimal(p - 1)
        saldo_final = principal + juros_por_periodo * Decimal(p)
        tabela.append(
            PeriodoSimples(
                periodo=p,
                saldo_inicial=money(saldo_inicial),
                juros_periodo=money(juros_por_periodo),
                saldo_final=money(saldo_final),
            )
        )

    return SimplesResultado(
        principal=principal,
        taxa_mensal=taxa_mensal,
        prazo_meses=prazo_meses,
        juros_totais=money(juros_totais),
        montante_final=money(montante_final),
        tabela=tabela,
    )
