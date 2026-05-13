"""Financiamento Imobiliario -- dominio puro.

Lógica educacional para simulação de financiamento imobiliario com
sistemas PRICE ou SAC.  Não representa proposta bancária, contrato,
CET oficial, aprovação de crédito ou orientação profissional.

Convencao de encargos:
    - seguro_mensal (MIP + DFI), tarifa_mensal e custo_administrativo_mensal
      sao armazenados individualmente no periodo e somados em encargos.
    - prestacao_financeira = juros + amortizacao  (sem acessorios)
    - encargos = seguro_mensal + tarifa_mensal + custo_administrativo_mensal
    - encargo_mensal_total = prestacao_financeira + encargos
    - prestacao = encargo_mensal_total  (alias de retrocompatibilidade)

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
    """Linha de periodo da tabela de financiamento imobiliario.

    Nomenclatura canonica:
        prestacao_financeira    = juros + amortizacao
        mip_mensal              = MIP individual (zero se não informado)
        dfi_dfc_mensal          = DFI/DFC individual (zero se não informado)
        seguros_nao_discriminados = True quando apenas seguro_mensal legado
        seguro_mensal           = mip + dfi (ou legado)
        taxa_administracao_mensal = tarifa + taxa_adm (nunca é seguro)
        tarifa_mensal           = alias = taxa_administracao_mensal
        encargos                = seguro + taxa_adm + custo_admin
        encargo_mensal_total    = prestacao_financeira + encargos
        prestacao               = encargo_mensal_total (alias retrocompat)
    """

    numero: int
    saldo_inicial: Decimal
    juros: Decimal
    amortizacao: Decimal
    prestacao_financeira: Decimal  # juros + amortizacao
    mip_mensal: Decimal  # MIP individual
    dfi_dfc_mensal: Decimal  # DFI/DFC individual
    seguros_nao_discriminados: bool  # True quando legado
    seguro_mensal: Decimal  # = mip + dfi (ou legado)
    taxa_administracao_mensal: Decimal  # tarifa mensal (nunca é seguro)
    tarifa_mensal: Decimal  # alias retrocompat
    custo_admin_mensal: Decimal  # outros custos mensais
    encargos: Decimal  # seguro + taxa_adm + custo_admin
    encargo_mensal_total: Decimal  # prestacao_financeira + encargos
    saldo_final: Decimal

    @property
    def prestacao(self) -> Decimal:
        """Alias de encargo_mensal_total para retrocompatibilidade."""
        return self.encargo_mensal_total


@dataclass(frozen=True, slots=True)
class FinanciamentoImobResultado:
    """Resultado completo da simulação de financiamento imobiliario."""

    valor_imovel: Decimal
    valor_entrada: Decimal
    valor_financiado: Decimal
    sistema_amortizacao: str
    prazo_meses: int
    taxa_juros_mensal: Decimal
    # Taxas anuais derivadas (sem arredondamento monetario — 6 casas)
    taxa_juros_anual_nominal: Decimal  # taxa_mensal * 12 (convencao bancaria)
    taxa_juros_anual_efetiva: Decimal  # (1 + taxa_mensal)^12 - 1
    # Totais
    total_pago: Decimal
    total_juros: Decimal
    total_amortizado: Decimal
    total_mip: Decimal  # total MIP acumulado
    total_dfi_dfc: Decimal  # total DFI/DFC acumulado
    total_seguros: Decimal  # total_mip + total_dfi_dfc (ou legado)
    total_tarifas: Decimal  # total taxa_administracao acumulada
    total_custo_admin: Decimal  # total custo_admin acumulado
    total_encargos: Decimal  # total_seguros + total_tarifas + total_custo_admin
    custo_total: Decimal  # total_juros + total_encargos
    custo_financeiro_total: Decimal  # total_pago - valor_financiado
    seguros_nao_discriminados: bool  # True quando apenas seguro_mensal legado
    # Primeira/ultima prestacao financeira (sem encargos)
    primeira_prestacao_financeira: Decimal
    ultima_prestacao_financeira: Decimal
    # Primeira/ultimo encargo mensal total (com encargos)
    primeiro_encargo_mensal_total: Decimal
    ultimo_encargo_mensal_total: Decimal
    # Retrocompatibilidade
    primeira_parcela: Decimal  # alias = primeiro_encargo_mensal_total
    ultima_parcela: Decimal  # alias = ultimo_encargo_mensal_total
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
    mip_mensal: Decimal = ZERO,
    dfi_dfc_mensal: Decimal = ZERO,
    taxa_administracao_mensal: Decimal = ZERO,
) -> FinanciamentoImobResultado:
    """Calcula simulação educacional de financiamento imobiliario.

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
        Esta simulação é educacional e não representa proposta bancária,
        contrato, CET oficial ou aprovação de crédito.
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
        periodos_base = calcular_price(
            valor_financiado_q,
            taxa_juros_mensal,
            prazo_meses,
        ).tabela_periodo
    else:
        periodos_base = calcular_sac(
            valor_financiado_q,
            taxa_juros_mensal,
            prazo_meses,
        ).tabela_periodo

    # Resolver MIP e DFI/DFC: campos granulares ou legado
    _mip_q = money(mip_mensal)
    _dfi_q = money(dfi_dfc_mensal)
    _granular = _mip_q + _dfi_q > ZERO
    seguro_q = money(seguro_mensal) if not _granular else money(_mip_q + _dfi_q)
    _nao_discriminados = not _granular  # True quando apenas legado disponivel

    # Taxa administrativa: taxa_administracao_mensal ou tarifa_mensal (alias)
    _taxa_adm_q = (
        money(taxa_administracao_mensal)
        if taxa_administracao_mensal > ZERO
        else money(tarifa_mensal)
    )
    tarifa_q = _taxa_adm_q  # alias legado

    custo_admin_q = money(custo_administrativo_mensal)
    encargos_mensais_q = money(seguro_q + _taxa_adm_q + custo_admin_q)

    rows: list[FinanciamentoPeriodo] = []
    for p in periodos_base:
        pf_q = money(p.juros + p.amortizacao)
        enc_total_q = money(pf_q + encargos_mensais_q)
        rows.append(
            FinanciamentoPeriodo(
                numero=p.periodo,
                saldo_inicial=p.saldo_inicial,
                juros=p.juros,
                amortizacao=p.amortizacao,
                prestacao_financeira=pf_q,
                mip_mensal=_mip_q,
                dfi_dfc_mensal=_dfi_q,
                seguros_nao_discriminados=_nao_discriminados,
                seguro_mensal=seguro_q,
                taxa_administracao_mensal=_taxa_adm_q,
                tarifa_mensal=tarifa_q,
                custo_admin_mensal=custo_admin_q,
                encargos=encargos_mensais_q,
                encargo_mensal_total=enc_total_q,
                saldo_final=p.saldo_final,
            )
        )

    parcelas = tuple(rows)
    total_juros = sum((r.juros for r in parcelas), ZERO)
    total_amortizado = sum((r.amortizacao for r in parcelas), ZERO)
    total_mip = money(_mip_q * Decimal(str(prazo_meses)))
    total_dfi_dfc = money(_dfi_q * Decimal(str(prazo_meses)))
    total_seguros = money(seguro_q * Decimal(str(prazo_meses)))
    total_tarifas = money(_taxa_adm_q * Decimal(str(prazo_meses)))
    total_custo_admin = money(custo_admin_q * Decimal(str(prazo_meses)))
    total_encargos = money(total_seguros + total_tarifas + total_custo_admin)
    total_pago = sum((r.encargo_mensal_total for r in parcelas), ZERO)
    custo_total = money(total_juros + total_encargos)
    custo_financeiro_total = money(total_pago - valor_financiado_q)

    # Taxas anuais derivadas com 6 casas decimais (nao usa money() — nao e valor monetario)
    _one = Decimal("1")
    taxa_anual_nominal = (taxa_juros_mensal * Decimal("12")).quantize(Decimal("0.000001"))
    taxa_anual_efetiva = ((_one + taxa_juros_mensal) ** 12 - _one).quantize(Decimal("0.000001"))

    return FinanciamentoImobResultado(
        valor_imovel=valor_imovel_q,
        valor_entrada=valor_entrada_q,
        valor_financiado=valor_financiado_q,
        sistema_amortizacao=sistema_amortizacao,
        prazo_meses=prazo_meses,
        taxa_juros_mensal=taxa_juros_mensal,
        taxa_juros_anual_nominal=taxa_anual_nominal,
        taxa_juros_anual_efetiva=taxa_anual_efetiva,
        total_pago=total_pago,
        total_juros=total_juros,
        total_amortizado=total_amortizado,
        total_mip=total_mip,
        total_dfi_dfc=total_dfi_dfc,
        total_seguros=total_seguros,
        total_tarifas=total_tarifas,
        total_custo_admin=total_custo_admin,
        seguros_nao_discriminados=_nao_discriminados,
        total_encargos=total_encargos,
        custo_total=custo_total,
        custo_financeiro_total=custo_financeiro_total,
        primeira_prestacao_financeira=parcelas[0].prestacao_financeira,
        ultima_prestacao_financeira=parcelas[-1].prestacao_financeira,
        primeiro_encargo_mensal_total=parcelas[0].encargo_mensal_total,
        ultimo_encargo_mensal_total=parcelas[-1].encargo_mensal_total,
        primeira_parcela=parcelas[0].encargo_mensal_total,
        ultima_parcela=parcelas[-1].encargo_mensal_total,
        parcelas=parcelas,
    )
