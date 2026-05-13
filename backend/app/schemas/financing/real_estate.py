"""Schemas do endpoint POST /api/v1/financing/real_estate."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from enum import StrEnum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer, model_validator

_MONEY_QUANTUM = Decimal("0.01")
_RATE_QUANTUM = Decimal("0.000001")


def _serialize_money(value: Decimal) -> str:
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return format(value.quantize(_MONEY_QUANTUM, rounding=ROUND_HALF_EVEN), "f")


def _serialize_rate(value: Decimal) -> str:
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return format(value.quantize(_RATE_QUANTUM, rounding=ROUND_HALF_EVEN), "f")


MoneyDecimal = Annotated[
    Decimal,
    PlainSerializer(_serialize_money, return_type=str, when_used="json"),
]
RateDecimal = Annotated[
    Decimal,
    PlainSerializer(_serialize_rate, return_type=str, when_used="json"),
]


class SistemaAmortizacaoSchema(StrEnum):
    PRICE = "PRICE"
    SAC = "SAC"


class FinanciamentoImobIn(BaseModel):
    """Corpo da requisição para simulação de financiamento imobiliario."""

    model_config = ConfigDict(extra="forbid")

    valor_imovel: Decimal = Field(
        ...,
        gt=0,
        description="Valor total do imovel em BRL.",
        examples=["300000.00"],
    )
    valor_entrada: Decimal = Field(
        ...,
        ge=0,
        description="Valor da entrada em BRL. Deve ser menor que valor_imovel.",
        examples=["60000.00"],
    )
    prazo_meses: int = Field(
        ...,
        ge=1,
        le=600,
        description="Prazo do financiamento em meses (max 600 = 50 anos).",
        examples=[360],
    )
    taxa_juros_mensal_percentual: Decimal = Field(
        ...,
        ge=0,
        le=100,
        description="Taxa de juros mensal em percentual (ex.: 0.7 = 0,7% ao mes).",
        examples=["0.7"],
    )
    sistema_amortizacao: SistemaAmortizacaoSchema = Field(
        ...,
        description="Sistema de amortizacao: PRICE ou SAC.",
        examples=["PRICE"],
    )
    # Campos legados (retrocompat) — aceitos de forma agregada
    seguro_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description=(
            "Seguro habitacional mensal agregado (MIP + DFI/DFC juntos), em BRL. "
            "Opcional. Use mip_mensal + dfi_dfc_mensal para separação individual."
        ),
        examples=["150.00"],
    )
    tarifa_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Taxa de administração mensal em BRL. Não é seguro. Opcional.",
        examples=["25.00"],
    )
    custo_administrativo_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Outros custos mensais em BRL. Opcional.",
        examples=["0.00"],
    )
    # Campos granulares — separação individual MIP e DFI/DFC
    mip_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description=(
            "MIP mensal em BRL (Seguro de Morte e Invalidez Permanente). Opcional. "
            "Quando informado com dfi_dfc_mensal, mantenha seguro_mensal em 0 "
            "para evitar dupla contagem."
        ),
        examples=["80.00"],
    )
    dfi_dfc_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description=(
            "DFI/DFC mensal em BRL (Seguro de Danos Fisicos ao Imovel / Construcao). "
            "Opcional. Informar junto com mip_mensal para separacao completa."
        ),
        examples=["35.00"],
    )
    taxa_administracao_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description=(
            "Taxa de administracao mensal em BRL. Alias de tarifa_mensal. "
            "Não é seguro. Não soma a seguros_total."
        ),
        examples=["25.00"],
    )

    @model_validator(mode="after")
    def _validar_entrada_menor_que_imovel(self) -> FinanciamentoImobIn:
        if self.valor_entrada >= self.valor_imovel:
            raise ValueError("valor_entrada deve ser menor que valor_imovel.")
        return self


class FinanciamentoPeriodoRow(BaseModel):
    """Linha da tabela de parcelas serializada pela API.

    Nomenclatura canonica:
        prestacao_financeira = juros + amortizacao
        seguro_mensal        = MIP + DFI (campo separado)
        tarifa_mensal        = taxa de administracao (campo separado)
        custo_admin_mensal   = outros custos mensais (campo separado)
        encargos             = seguro + tarifa + custo_admin
        encargo_mensal_total = prestacao_financeira + encargos
        prestacao            = alias retrocompat = encargo_mensal_total
    """

    model_config = ConfigDict(extra="forbid")

    numero: int = Field(..., ge=1)
    saldo_inicial: MoneyDecimal
    juros: MoneyDecimal
    amortizacao: MoneyDecimal
    prestacao_financeira: MoneyDecimal  # juros + amortizacao
    seguro_mensal: MoneyDecimal  # MIP + DFI (separado)
    tarifa_mensal: MoneyDecimal  # taxa de administracao
    custo_admin_mensal: MoneyDecimal  # outros custos mensais
    encargos: MoneyDecimal  # acessorios agregados
    encargo_mensal_total: MoneyDecimal  # prestacao_financeira + encargos
    prestacao: MoneyDecimal  # retrocompat = encargo_mensal_total
    saldo_final: MoneyDecimal


class ComponenteCet(BaseModel):
    """Componente individual do CET demonstrativo educacional.

    Naturezas:
        calculado        - derivado das entradas com formula precisa
        informado        - fornecido pelo usuário como entrada
        nao_calculado    - existe no CET real mas nao modelado aqui
        alerta           - custo mencionado para consciencia, sem valor calculado

    Categorias pedagogicas:
        base_operacao          - dados da operacao (nao sao custos)
        componente_encargo     - entra no encargo mensal
        componente_cet         - impacta o CET demonstrativo
        custo_inicial          - custo fora do encargo mensal (alerta)
        totalizador_indicador  - total ou indicador derivado
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    nome: str
    natureza: Literal["calculado", "informado", "nao_calculado", "alerta"]
    categoria: Literal[
        "base_operacao",
        "componente_encargo",
        "componente_cet",
        "custo_inicial",
        "totalizador_indicador",
    ]
    # Valor nominal (zero para nao_calculado/alerta)
    valor_total: MoneyDecimal
    valor_mensal_referencia: MoneyDecimal
    # Percentuais — tres bases para completude educacional
    # (zero quando nao aplicavel; nunca causa divisao por zero)
    pct_sobre_financiado: RateDecimal  # valor_total / valor_financiado
    pct_sobre_total_pago: RateDecimal  # valor_total / total_pago
    pct_sobre_custo_financeiro_total: RateDecimal  # valor_total / custo_financeiro_total
    # Flags
    entra_no_encargo_mensal: bool
    entra_no_custo_total_educacional: bool
    # Descricao educacional
    formula: str
    explicacao: str


class AnatomiaEncargo(BaseModel):
    """Decomposicao do encargo mensal do primeiro periodo.

    Regra de composicao:
        seguros_total = mip_mensal + dfi_dfc_mensal
                        (ou seguro_mensal legado quando nao discriminado)
        componentes_acessorios = seguros_total + taxa_administracao_mensal + custo_admin_mensal
        encargo_mensal_total   = prestacao_financeira + componentes_acessorios

    Quando apenas seguro_mensal legado for informado:
        mip_mensal = zero, dfi_dfc_mensal = zero, seguros_nao_discriminados = True.
    Taxa administrativa nunca entra em seguros_total.
    """

    model_config = ConfigDict(extra="forbid")

    # Prestacao financeira
    amortizacao: MoneyDecimal
    juros: MoneyDecimal
    prestacao_financeira: MoneyDecimal  # = amortizacao + juros
    # Seguros — granulares quando informados individualmente
    mip_mensal: MoneyDecimal  # MIP individual (zero se nao informado)
    dfi_dfc_mensal: MoneyDecimal  # DFI/DFC individual (zero se nao informado)
    seguros_total: MoneyDecimal  # mip + dfi, ou seguro_mensal legado
    seguros_nao_discriminados: bool  # True quando só seguro_mensal legado disponível
    # Taxa administrativa — separada de seguros
    taxa_administracao_mensal: MoneyDecimal  # tarifa + taxa_administracao (nunca e seguro)
    custo_admin_mensal: MoneyDecimal  # outros custos mensais
    # Totais
    componentes_acessorios: MoneyDecimal  # = seguros_total + taxa_adm + custo_admin
    encargo_mensal_total: MoneyDecimal  # = prestacao_financeira + componentes_acessorios
    # Aliases legados (retrocompat)
    seguro_mensal: MoneyDecimal  # = seguros_total
    tarifa_mensal: MoneyDecimal  # = taxa_administracao_mensal
    encargos: MoneyDecimal  # = componentes_acessorios
    # Percentuais sobre encargo_mensal_total
    pct_amortizacao: RateDecimal
    pct_juros: RateDecimal
    pct_prestacao_financeira: RateDecimal
    pct_mip: RateDecimal  # zero se nao discriminado
    pct_dfi_dfc: RateDecimal  # zero se nao discriminado
    pct_seguros: RateDecimal  # sobre total de seguros
    pct_taxa_administracao: RateDecimal
    pct_custo_admin: RateDecimal
    pct_encargos: RateDecimal
    # Aliases legados
    pct_seguro: RateDecimal  # = pct_seguros
    pct_tarifa: RateDecimal  # = pct_taxa_administracao


class FinanciamentoImobSummary(BaseModel):
    """Resumo do financiamento imobiliario."""

    model_config = ConfigDict(extra="forbid")

    sistema_amortizacao: Literal["PRICE", "SAC"]
    valor_imovel: MoneyDecimal
    valor_entrada: MoneyDecimal
    valor_financiado: MoneyDecimal
    prazo_meses: int = Field(..., ge=1)
    taxa_juros_mensal: RateDecimal
    # Taxas anuais (6 casas — nao e MoneyDecimal)
    taxa_juros_anual_nominal: RateDecimal
    taxa_juros_anual_efetiva: RateDecimal
    # Prestacao financeira (sem encargos)
    primeira_prestacao_financeira: MoneyDecimal
    ultima_prestacao_financeira: MoneyDecimal
    # Encargo mensal total (com encargos)
    primeiro_encargo_mensal_total: MoneyDecimal
    ultimo_encargo_mensal_total: MoneyDecimal
    # Totais
    total_pago: MoneyDecimal
    total_juros: MoneyDecimal
    total_amortizado: MoneyDecimal
    total_mip: MoneyDecimal
    total_dfi_dfc: MoneyDecimal
    total_seguros: MoneyDecimal
    total_tarifas: MoneyDecimal
    total_custo_admin: MoneyDecimal
    seguros_nao_discriminados: bool
    total_encargos: MoneyDecimal
    custo_total: MoneyDecimal
    custo_financeiro_total: MoneyDecimal
    # Retrocompat
    primeira_parcela: MoneyDecimal
    ultima_parcela: MoneyDecimal


class FinanciamentoInputsNormalizados(BaseModel):
    """Entradas normalizadas devolvidas para rastreabilidade educacional."""

    model_config = ConfigDict(extra="forbid")

    valor_imovel: MoneyDecimal
    valor_entrada: MoneyDecimal
    valor_financiado: MoneyDecimal
    prazo_meses: int = Field(..., ge=1)
    taxa_juros_mensal: RateDecimal
    sistema_amortizacao: Literal["PRICE", "SAC"]


class FinanciamentoFormulaUsada(BaseModel):
    """Formula financeira usada no calculo."""

    model_config = ConfigDict(extra="forbid")

    nome: str
    expressao: str
    uso: str


class FinanciamentoFonte(BaseModel):
    """Fonte ou referencia declarada pela resposta educacional."""

    model_config = ConfigDict(extra="forbid")

    nome: str
    tipo: str
    observacao: str


class FinanciamentoChartPoint(BaseModel):
    """Ponto simples para graficos financeiros."""

    model_config = ConfigDict(extra="forbid")

    periodo: int = Field(..., ge=1)
    valor: MoneyDecimal


class FinanciamentoJurosAmortizacaoPoint(BaseModel):
    """Ponto de grafico com decomposicao de juros e amortizacao."""

    model_config = ConfigDict(extra="forbid")

    periodo: int = Field(..., ge=1)
    juros: MoneyDecimal
    amortizacao: MoneyDecimal


class FinanciamentoChartData(BaseModel):
    """Dados preparados para graficos do frontend."""

    model_config = ConfigDict(extra="forbid")

    saldo_devedor: list[FinanciamentoChartPoint] = Field(default_factory=list)
    prestacoes: list[FinanciamentoChartPoint] = Field(default_factory=list)
    juros_amortizacao: list[FinanciamentoJurosAmortizacaoPoint] = Field(default_factory=list)


class FinanciamentoMemoriaCalculo(BaseModel):
    """Memoria de calculo estruturada para explicar o resultado."""

    model_config = ConfigDict(extra="allow")

    metodo: Literal["PRICE", "SAC"]
    entradas: FinanciamentoInputsNormalizados
    formula: str
    variaveis: dict[str, Decimal]
    substituicao: str
    arredondamento: str
    primeira_parcela: FinanciamentoPeriodoRow
    ultima_parcela: FinanciamentoPeriodoRow
    custo_total: MoneyDecimal
    resultado_final: dict[str, Decimal]


class FinanciamentoMetadadosCalculo(BaseModel):
    """Metadados de rastreabilidade do calculo."""

    model_config = ConfigDict(extra="forbid")

    moeda: str
    criterio_arredondamento: str
    linhas_tabela: int = Field(..., ge=1)
    prazo_dinamico_respeitado: bool
    contrato_educacional_api: str


class FinanciamentoImobOut(BaseModel):
    """Carga útil (data) da resposta de simulação de financiamento imobiliario."""

    model_config = ConfigDict(extra="forbid")

    summary: FinanciamentoImobSummary
    parcelas: list[FinanciamentoPeriodoRow] = Field(default_factory=list)
    inputs_normalizados: FinanciamentoInputsNormalizados
    anatomia_encargo: AnatomiaEncargo
    componentes_cet: list[ComponenteCet] = Field(default_factory=list)
    memoria_calculo: FinanciamentoMemoriaCalculo
    formulas_usadas: list[FinanciamentoFormulaUsada] = Field(default_factory=list)
    explicacoes_pedagogicas: list[str] = Field(default_factory=list)
    alertas: list[str] = Field(default_factory=list)
    fontes: list[FinanciamentoFonte] = Field(default_factory=list)
    limites: list[str] = Field(default_factory=list)
    metadados_calculo: FinanciamentoMetadadosCalculo
    mensagens_interface: list[str] = Field(default_factory=list)
    chart_data: FinanciamentoChartData


class FinanciamentoImobCompareIn(BaseModel):
    """Corpo da requisicao para comparacao PRICE x SAC com os mesmos dados."""

    model_config = ConfigDict(extra="forbid")

    valor_imovel: Decimal = Field(
        ...,
        gt=0,
        description="Valor total do imovel em BRL.",
        examples=["300000.00"],
    )
    valor_entrada: Decimal = Field(
        ...,
        ge=0,
        description="Valor da entrada em BRL. Deve ser menor que valor_imovel.",
        examples=["60000.00"],
    )
    prazo_meses: int = Field(
        ...,
        ge=1,
        le=600,
        description="Prazo do financiamento em meses (max 600 = 50 anos).",
        examples=[360],
    )
    taxa_juros_mensal_percentual: Decimal = Field(
        ...,
        ge=0,
        le=100,
        description="Taxa de juros mensal em percentual (ex.: 0.7 = 0,7% ao mes).",
        examples=["0.7"],
    )
    seguro_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Seguro habitacional mensal agregado em BRL (opcional).",
        examples=["150.00"],
    )
    tarifa_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Taxa de administração mensal em BRL (opcional). Não é seguro.",
        examples=["25.00"],
    )
    custo_administrativo_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Outros custos mensais em BRL (opcional).",
        examples=["0.00"],
    )
    mip_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="MIP mensal em BRL (opcional, separado).",
        examples=["80.00"],
    )
    dfi_dfc_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="DFI/DFC mensal em BRL (opcional, separado).",
        examples=["35.00"],
    )
    taxa_administracao_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Taxa de administracao mensal em BRL. Alias de tarifa_mensal.",
        examples=["25.00"],
    )

    @model_validator(mode="after")
    def _validar_entrada_menor_que_imovel(self) -> FinanciamentoImobCompareIn:
        if self.valor_entrada >= self.valor_imovel:
            raise ValueError("valor_entrada deve ser menor que valor_imovel.")
        return self


class FinanciamentoComparacaoEducacional(BaseModel):
    """Resumo educacional da comparacao entre PRICE e SAC."""

    model_config = ConfigDict(extra="forbid")

    diferenca_primeira_prestacao_financeira: MoneyDecimal
    diferenca_ultima_prestacao_financeira: MoneyDecimal
    diferenca_primeiro_encargo_mensal: MoneyDecimal
    diferenca_ultimo_encargo_mensal: MoneyDecimal
    diferenca_total_pago: MoneyDecimal
    diferenca_total_juros: MoneyDecimal
    # Retrocompat
    diferenca_primeira_parcela: MoneyDecimal
    diferenca_ultima_parcela: MoneyDecimal
    comportamento_saldo_devedor: str
    explicacao_pedagogica: str
    interpretacao_dinamica: str
    recomendacoes: list[str] = Field(default_factory=list)


class FinanciamentoImobCompareOut(BaseModel):
    """Resultado da comparacao PRICE x SAC com os mesmos parametros de entrada."""

    model_config = ConfigDict(extra="forbid")

    price: FinanciamentoImobOut
    sac: FinanciamentoImobOut
    comparacao: FinanciamentoComparacaoEducacional
