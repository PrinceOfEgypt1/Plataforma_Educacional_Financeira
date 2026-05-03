"""Sistema SAC - dominio puro.

Formula canonica:
    A = PV / n

Convencao de fechamento:
    - As linhas 1..n-1 usam a amortizacao canonica quantizada.
    - Juros sao quantizados a partir do saldo exibivel anterior.
    - Parcela e sempre calculada por soma: juros + amortizacao.
    - A ultima linha absorve residuo de amortizacao para zerar o saldo.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal

from ._common import AmortizationPeriod, ensure_precision, money, sum_decimal, validate_inputs


@dataclass(frozen=True, slots=True)
class SacResultado:
    """Resultado do calculo SAC."""

    principal: Decimal
    taxa_periodo: Decimal
    n_periodos: int
    amortizacao_constante: Decimal
    parcela_inicial: Decimal
    parcela_final: Decimal
    total_pago: Decimal
    total_juros: Decimal
    saldo_final: Decimal
    tabela_periodo: tuple[AmortizationPeriod, ...] = field(default_factory=tuple)


def calcular_sac(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> SacResultado:
    """Calcula tabela SAC com fechamento exato em centavos.

    Args:
        principal: valor presente financiado, Decimal em centavos.
        taxa_periodo: taxa por periodo ja normalizada.
        n_periodos: quantidade de periodos.

    Raises:
        DomainValidationError: se qualquer entrada violar precondicoes.
    """
    ensure_precision()
    principal_q = validate_inputs(principal, taxa_periodo, n_periodos)

    amortizacao_base_q = money(principal_q / Decimal(n_periodos))
    saldo = principal_q
    amortizacao_acumulada = Decimal("0.00")
    rows: list[AmortizationPeriod] = []

    for periodo in range(1, n_periodos + 1):
        saldo_inicial_q = saldo
        juros_q = money(saldo_inicial_q * taxa_periodo)

        if periodo == n_periodos:
            amortizacao_q = principal_q - amortizacao_acumulada
            saldo_final_q = Decimal("0.00")
        else:
            amortizacao_q = amortizacao_base_q
            saldo_final_q = saldo_inicial_q - amortizacao_q

        parcela_q = juros_q + amortizacao_q
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

    return SacResultado(
        principal=principal_q,
        taxa_periodo=taxa_periodo,
        n_periodos=n_periodos,
        amortizacao_constante=amortizacao_base_q,
        parcela_inicial=tabela[0].parcela,
        parcela_final=tabela[-1].parcela,
        total_pago=sum_decimal(parcelas),
        total_juros=sum_decimal(juros),
        saldo_final=Decimal("0.00"),
        tabela_periodo=tabela,
    )
