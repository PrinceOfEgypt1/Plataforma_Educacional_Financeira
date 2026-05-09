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
    """Corpo da requisicao para simulacao de financiamento imobiliario."""

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
    seguro_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Seguro habitacional mensal em BRL (opcional).",
        examples=["150.00"],
    )
    tarifa_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Tarifa de administracao mensal em BRL (opcional).",
        examples=["25.00"],
    )
    custo_administrativo_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Outros custos administrativos mensais em BRL (opcional).",
        examples=["0.00"],
    )

    @model_validator(mode="after")
    def _validar_entrada_menor_que_imovel(self) -> FinanciamentoImobIn:
        if self.valor_entrada >= self.valor_imovel:
            raise ValueError("valor_entrada deve ser menor que valor_imovel.")
        return self


class FinanciamentoPeriodoRow(BaseModel):
    """Linha da tabela de parcelas serializada pela API."""

    model_config = ConfigDict(extra="forbid")

    numero: int = Field(..., ge=1)
    saldo_inicial: MoneyDecimal
    juros: MoneyDecimal
    amortizacao: MoneyDecimal
    encargos: MoneyDecimal
    prestacao: MoneyDecimal
    saldo_final: MoneyDecimal


class FinanciamentoImobSummary(BaseModel):
    """Resumo do financiamento imobiliario."""

    model_config = ConfigDict(extra="forbid")

    sistema_amortizacao: Literal["PRICE", "SAC"]
    valor_imovel: MoneyDecimal
    valor_entrada: MoneyDecimal
    valor_financiado: MoneyDecimal
    prazo_meses: int = Field(..., ge=1)
    taxa_juros_mensal: RateDecimal
    total_pago: MoneyDecimal
    total_juros: MoneyDecimal
    total_amortizado: MoneyDecimal
    total_encargos: MoneyDecimal
    custo_total: MoneyDecimal
    primeira_parcela: MoneyDecimal
    ultima_parcela: MoneyDecimal


class FinanciamentoImobOut(BaseModel):
    """Carga util (data) da resposta de simulacao de financiamento imobiliario."""

    model_config = ConfigDict(extra="forbid")

    summary: FinanciamentoImobSummary
    parcelas: list[FinanciamentoPeriodoRow] = Field(default_factory=list)


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
        description="Seguro habitacional mensal em BRL (opcional).",
        examples=["150.00"],
    )
    tarifa_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Tarifa de administracao mensal em BRL (opcional).",
        examples=["25.00"],
    )
    custo_administrativo_mensal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Outros custos administrativos mensais em BRL (opcional).",
        examples=["0.00"],
    )

    @model_validator(mode="after")
    def _validar_entrada_menor_que_imovel(self) -> "FinanciamentoImobCompareIn":
        if self.valor_entrada >= self.valor_imovel:
            raise ValueError("valor_entrada deve ser menor que valor_imovel.")
        return self


class FinanciamentoImobCompareOut(BaseModel):
    """Resultado da comparacao PRICE x SAC com os mesmos parametros de entrada."""

    model_config = ConfigDict(extra="forbid")

    price: FinanciamentoImobOut
    sac: FinanciamentoImobOut
