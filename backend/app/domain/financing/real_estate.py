"""Financiamento Imobiliario -- dominio puro.

Logica educacional para simulacao de financiamento imobiliario com
sistemas PRICE ou SAC.  Nao representa proposta bancaria, contrato,
CET oficial, aprovacao de credito ou orientacao profissional.

Convencao de encargos:
    - seguro_mensal, tarifa_mensal e custo_administrativo_mensal sao somados
      em encargos_mensais e adicionados a cada periodo, separados de juros
      e amortizacao.
    - prestacao = juros + amortizacao + encargos

Convencao de fechamento:
    - Reutiliza os algoritmos PRICE e SAC do dominio de amortizacao.
    - A ultima linha absorve residuo de amortizacao, zerando o saldo.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from enum import StrEnum

from app.domain.amortization import calcular_price, calcular_sac

from ._common import ZERO, ensure_precision, money


class SistemaAmortizacao(StrEnum):
    PRICE = "PRICE"
    SAC = "SAC"


@dataclass(frozen=True, slots=True)
class FinanciamentoPeriodo:
    """Linha de periodo da tabela de financiamento imobiliario."""

    numero: int
    saldo_inicial: Decimal
    juros: Decimal
    amortizacao: Decimal
    encargos: Decimal
    prestacao: Decimal
    saldo_final: Decimal


@dataclass(frozen=True, slots=True)
class FinanciamentoImobResultado:
    """Resultado completo da simulacao de financiamento imobiliario."""

    valor_imovel: Decimal
    valor_entrada: Decimal
    valor_financiado: Decimal
    sistema_amortizacao: str
    prazo_meses: int
    taxa_juros_mensal: Decimal
    total_pago: Decimal
    total_juros: Decimal
    total_amortizado: Decimal
    total_encargos: Decimal
    custo_total: Decimal
    primeira_parcela: Decimal
    ultima_parcela: Decimal
    parcelas: tuple[FinanciamentoPeriodo, ...] = field(default_factory=tuple)


def _validate_financing_inputs(
    valor_imovel: Decimal,
    valor_entrada: Decimal,
    prazo_meses: int,
    taxa_juros_mensal: Decimal,
    sistema_amortizacao: str,
    seguro_mensal: Decimal,
    tarifa_mensal: Decimal,
    custo_administrativo_mensal: Decimal,
) -> tuple[Decimal, Decimal, Decimal]:
    """Valida entradas e retorna (valor_imovel_q, valor_entrada_q, encargos_q).

    Raises:
        DomainValidationError: se qualquer entrada violar pre-condicoes.
    """
    from . import DomainValidationError

    for fname, fval in (
        ("valor_imovel", valor_imovel),
        ("valor_entrada", valor_entrada),
        ("taxa_juros_mensal", taxa_juros_mensal),
        ("seguro_mensal", seguro_mensal),
        ("tarifa_mensal", tarifa_mensal),
        ("custo_administrativo_mensal", custo_administrativo_mensal),
    ):
        if not isinstance(fval, Decimal):
            raise DomainValidationError(
                code="INVALID_TYPE",
                message=f"{fname} deve ser Decimal.",
                field=fname,
                value=fval,
            )
        if not fval.is_finite():
            raise DomainValidationError(
                code="NON_FINITE",
                message=f"{fname} deve ser finito.",
                field=fname,
                value=fval,
            )

    if isinstance(prazo_meses, bool) or not isinstance(prazo_meses, int):
        raise DomainValidationError(
            code="INVALID_PRAZO_TYPE",
            message="prazo_meses deve ser int (nao bool).",
            field="prazo_meses",
            value=prazo_meses,
        )

    if valor_imovel <= ZERO:
        raise DomainValidationError(
            code="NON_POSITIVE_VALOR_IMOVEL",
            message="valor_imovel deve ser maior que zero.",
            field="valor_imovel",
            value=valor_imovel,
        )
    if valor_entrada < ZERO:
        raise DomainValidationError(
            code="NEGATIVE_ENTRADA",
            message="valor_entrada nao pode ser negativo.",
            field="valor_entrada",
            value=valor_entrada,
        )
    if valor_entrada >= valor_imovel:
        raise DomainValidationError(
            code="ENTRADA_MAIOR_OU_IGUAL_IMOVEL",
            message="valor_entrada deve ser menor que valor_imovel.",
            field="valor_entrada",
            value=valor_entrada,
        )
    if taxa_juros_mensal < ZERO:
        raise DomainValidationError(
            code="NEGATIVE_TAXA",
            message="taxa_juros_mensal nao pode ser negativa.",
            field="taxa_juros_mensal",
            value=taxa_juros_mensal,
        )
    if prazo_meses <= 0:
        raise DomainValidationError(
            code="NON_POSITIVE_PRAZO",
            message="prazo_meses deve ser maior que zero.",
            field="prazo_meses",
            value=prazo_meses,
        )
    if sistema_amortizacao not in (SistemaAmortizacao.PRICE, SistemaAmortizacao.SAC):
        raise DomainValidationError(
            code="INVALID_SISTEMA_AMORTIZACAO",
            message="sistema_amortizacao deve ser 'PRICE' ou 'SAC'.",
            field="sistema_amortizacao",
            value=sistema_amortizacao,
        )
    for ename, eval_ in (
        ("seguro_mensal", seguro_mensal),
        ("tarifa_mensal", tarifa_mensal),
        ("custo_administrativo_mensal", custo_administrativo_mensal),
    ):
        if eval_ < ZERO:
            raise DomainValidationError(
                code="NEGATIVE_ENCARGO",
                message=f"{ename} nao pode ser negativo.",
                field=ename,
                value=eval_,
            )

    valor_imovel_q = money(valor_imovel)
    valor_entrada_q = money(valor_entrada)
    encargos_q = money(seguro_mensal + tarifa_mensal + custo_administrativo_mensal)
    return valor_imovel_q, valor_entrada_q, encargos_q


def calcular_financiamento_imobiliario(
    valor_imovel: Decimal,
    valor_entrada: Decimal,
    prazo_meses: int,
    taxa_juros_mensal: Decimal,
    sistema_amortizacao: str,
    seguro_mensal: Decimal = ZERO,
    tarifa_mensal: Decimal = ZERO,
    custo_administrativo_mensal: Decimal = ZERO,
) -> FinanciamentoImobResultado:
    """Calcula simulacao educacional de financiamento imobiliario.

    Args:
        valor_imovel: valor total do imovel em BRL.
        valor_entrada: entrada em BRL (deve ser < valor_imovel).
        prazo_meses: numero de parcelas mensais.
        taxa_juros_mensal: taxa mensal como decimal puro (ex.: 0.01 = 1%).
        sistema_amortizacao: 'PRICE' ou 'SAC'.
        seguro_mensal: encargo de seguro mensal em BRL (opcional).
        tarifa_mensal: tarifa de administracao mensal em BRL (opcional).
        custo_administrativo_mensal: outros custos mensais em BRL (opcional).

    Raises:
        DomainValidationError: se qualquer entrada violar pre-condicoes.

    Note:
        Esta simulacao e educacional e nao representa proposta bancaria,
        contrato, CET oficial ou aprovacao de credito.
    """
    ensure_precision()
    valor_imovel_q, valor_entrada_q, encargos_mensais_q = _validate_financing_inputs(
        valor_imovel,
        valor_entrada,
        prazo_meses,
        taxa_juros_mensal,
        sistema_amortizacao,
        seguro_mensal,
        tarifa_mensal,
        custo_administrativo_mensal,
    )

    valor_financiado_q = money(valor_imovel_q - valor_entrada_q)

    if sistema_amortizacao == SistemaAmortizacao.PRICE:
        periodos_base = calcular_price(valor_financiado_q, taxa_juros_mensal, prazo_meses).tabela_periodo
    else:
        periodos_base = calcular_sac(valor_financiado_q, taxa_juros_mensal, prazo_meses).tabela_periodo

    rows: list[FinanciamentoPeriodo] = []
    for p in periodos_base:
        prestacao_q = money(p.juros + p.amortizacao + encargos_mensais_q)
        rows.append(
            FinanciamentoPeriodo(
                numero=p.periodo,
                saldo_inicial=p.saldo_inicial,
                juros=p.juros,
                amortizacao=p.amortizacao,
                encargos=encargos_mensais_q,
                prestacao=prestacao_q,
                saldo_final=p.saldo_final,
            )
        )

    parcelas = tuple(rows)
    total_juros = sum((r.juros for r in parcelas), ZERO)
    total_amortizado = sum((r.amortizacao for r in parcelas), ZERO)
    total_encargos = sum((r.encargos for r in parcelas), ZERO)
    total_pago = sum((r.prestacao for r in parcelas), ZERO)
    custo_total = money(total_juros + total_encargos)

    return FinanciamentoImobResultado(
        valor_imovel=valor_imovel_q,
        valor_entrada=valor_entrada_q,
        valor_financiado=valor_financiado_q,
        sistema_amortizacao=sistema_amortizacao,
        prazo_meses=prazo_meses,
        taxa_juros_mensal=taxa_juros_mensal,
        total_pago=total_pago,
        total_juros=total_juros,
        total_amortizado=total_amortizado,
        total_encargos=total_encargos,
        custo_total=custo_total,
        primeira_parcela=parcelas[0].prestacao,
        ultima_parcela=parcelas[-1].prestacao,
        parcelas=parcelas,
    )
