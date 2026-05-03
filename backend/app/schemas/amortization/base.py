"""Tipos compartilhados dos schemas de amortizacao."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from enum import StrEnum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer

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


class AmortizationSystem(StrEnum):
    PRICE = "PRICE"
    SAC = "SAC"
    EMPATE = "EMPATE"


class AmortizationInBase(BaseModel):
    """Entrada comum dos endpoints de amortizacao."""

    model_config = ConfigDict(extra="forbid")

    principal: Decimal = Field(
        ...,
        gt=0,
        description="Valor presente financiado em BRL. Deve ser maior que zero.",
        examples=["100000.00"],
    )
    taxa_periodo: Decimal = Field(
        ...,
        ge=0,
        description="Taxa por periodo como decimal puro (ex.: 0.01 = 1%).",
        examples=["0.01"],
    )
    n_periodos: int = Field(
        ...,
        ge=1,
        le=1200,
        description="Quantidade de periodos da amortizacao.",
        examples=[12],
    )


class AmortizationPeriodRow(BaseModel):
    """Linha da tabela de amortizacao serializada pela API."""

    model_config = ConfigDict(extra="forbid")

    periodo: int = Field(..., ge=1)
    saldo_inicial: MoneyDecimal
    juros: MoneyDecimal
    amortizacao: MoneyDecimal
    parcela: MoneyDecimal
    saldo_final: MoneyDecimal


class PriceSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sistema: Literal[AmortizationSystem.PRICE] = AmortizationSystem.PRICE
    principal: MoneyDecimal
    taxa_periodo: RateDecimal
    n_periodos: int = Field(..., ge=1)
    parcela: MoneyDecimal
    total_pago: MoneyDecimal
    total_juros: MoneyDecimal
    saldo_final: MoneyDecimal


class SacSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sistema: Literal[AmortizationSystem.SAC] = AmortizationSystem.SAC
    principal: MoneyDecimal
    taxa_periodo: RateDecimal
    n_periodos: int = Field(..., ge=1)
    amortizacao_constante: MoneyDecimal
    parcela_inicial: MoneyDecimal
    parcela_final: MoneyDecimal
    total_pago: MoneyDecimal
    total_juros: MoneyDecimal
    saldo_final: MoneyDecimal


class CompareSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")

    principal: MoneyDecimal
    taxa_periodo: RateDecimal
    n_periodos: int = Field(..., ge=1)
    price: PriceSummary
    sac: SacSummary
    diferenca_juros: MoneyDecimal = Field(..., description="PRICE.total_juros - SAC.total_juros.")
    diferenca_total_pago: MoneyDecimal = Field(
        ..., description="PRICE.total_pago - SAC.total_pago."
    )
    menor_total_juros: AmortizationSystem


class ChartSeries(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str
    kind: Literal["price", "sac"]
    points: list[MoneyDecimal]


class Chart(BaseModel):
    model_config = ConfigDict(extra="forbid")

    x_label: str = Field(default="Periodo")
    y_label: str = Field(default="Saldo devedor (BRL)")
    series: list[ChartSeries]


class Interpretation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    headline: str
    body: str


class Alert(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str
    severity: Literal["info", "warning"] = "info"
    message: str


class TablesCompareAmortization(BaseModel):
    model_config = ConfigDict(extra="forbid")

    price: list[AmortizationPeriodRow] = Field(default_factory=list)
    sac: list[AmortizationPeriodRow] = Field(default_factory=list)
