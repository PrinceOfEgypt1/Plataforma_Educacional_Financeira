"""Sistema PRICE - dominio puro.

Formula canonica:
    PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]

Convencao de fechamento:
    - As linhas 1..n-1 usam a parcela canonica quantizada.
    - Juros sao quantizados a partir do saldo exibivel anterior.
    - Amortizacao e calculada por diferenca: parcela - juros.
    - A ultima linha absorve residuo de amortizacao para zerar o saldo.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal

from ._common import AmortizationPeriod, ensure_precision, money, sum_decimal, validate_inputs

ONE = Decimal("1")


@dataclass(frozen=True, slots=True)
class PriceResultado:
    """Resultado do calculo PRICE."""

    principal: Decimal
    taxa_periodo: Decimal
    n_periodos: int
    parcela: Decimal
    total_pago: Decimal
    total_juros: Decimal
    saldo_final: Decimal
    tabela_periodo: tuple[AmortizationPeriod, ...] = field(default_factory=tuple)


def _parcela_price(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> Decimal:
    if taxa_periodo == 0:
        return principal / Decimal(n_periodos)
    fator = (ONE + taxa_periodo) ** n_periodos
    return principal * (taxa_periodo * fator) / (fator - ONE)


def calcular_price(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> PriceResultado:
    """Calcula tabela PRICE com fechamento exato em centavos.

    Args:
        principal: valor presente financiado, Decimal em centavos.
        taxa_periodo: taxa por periodo ja normalizada.
        n_periodos: quantidade de periodos.

    Raises:
        DomainValidationError: se qualquer entrada violar precondicoes.
    """
    ensure_precision()
    principal_q = validate_inputs(principal, taxa_periodo, n_periodos)

    parcela_base_q = money(_parcela_price(principal_q, taxa_periodo, n_periodos))
    saldo = principal_q
    amortizacao_acumulada = Decimal("0.00")
    rows: list[AmortizationPeriod] = []

    for periodo in range(1, n_periodos + 1):
        saldo_inicial_q = saldo
        juros_q = money(saldo_inicial_q * taxa_periodo)

        if periodo == n_periodos:
            amortizacao_q = principal_q - amortizacao_acumulada
            parcela_q = juros_q + amortizacao_q
            saldo_final_q = Decimal("0.00")
        else:
            parcela_q = parcela_base_q
            amortizacao_q = parcela_q - juros_q
            saldo_final_q = saldo_inicial_q - amortizacao_q

        rows.append(
            AmortizationPeriod(
                periodo=periodo,
                saldo_inicial=saldo_inicial_q,
                juros=juros_q,
                amortizacao=amortizacao_q,
                parcela=parcela_q,
                saldo_final=saldo_final_q,
            )
        )
        amortizacao_acumulada += amortizacao_q
        saldo = saldo_final_q

    tabela = tuple(rows)
    parcelas = tuple(row.parcela for row in tabela)
    juros = tuple(row.juros for row in tabela)

    return PriceResultado(
        principal=principal_q,
        taxa_periodo=taxa_periodo,
        n_periodos=n_periodos,
        parcela=parcela_base_q,
        total_pago=sum_decimal(parcelas),
        total_juros=sum_decimal(juros),
        saldo_final=Decimal("0.00"),
        tabela_periodo=tabela,
    )
