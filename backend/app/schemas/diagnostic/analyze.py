"""Schemas HTTP do endpoint POST /api/v1/diagnostic/analyze."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer

_MONEY_QUANTUM = Decimal("0.01")


def _serialize_money(value: Decimal) -> str:
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return format(value.quantize(_MONEY_QUANTUM, rounding=ROUND_HALF_EVEN), "f")


MoneyDecimal = Annotated[
    Decimal,
    PlainSerializer(_serialize_money, return_type=str, when_used="json"),
]

AlertLevel = Literal["info", "warning", "critical"]


class DiagnosticAnalyzeRequest(BaseModel):
    """Corpo da requisição para o diagnóstico financeiro."""

    model_config = ConfigDict(extra="forbid")

    renda_mensal: Decimal = Field(
        ...,
        gt=0,
        description="Renda líquida mensal total em BRL. Deve ser maior que zero.",
        examples=["5000.00"],
    )
    total_despesas_fixas: Decimal = Field(
        ...,
        ge=0,
        description="Total de despesas fixas mensais em BRL.",
        examples=["2000.00"],
    )
    total_despesas_variaveis: Decimal = Field(
        ...,
        ge=0,
        description="Total de despesas variáveis mensais em BRL.",
        examples=["800.00"],
    )
    total_dividas_mensais: Decimal = Field(
        ...,
        ge=0,
        description="Total de parcelas mensais de dívidas em BRL.",
        examples=["500.00"],
    )
    total_reserva_atual: Decimal = Field(
        ...,
        ge=0,
        description="Reserva de emergência disponível em BRL.",
        examples=["4000.00"],
    )


class DiagnosticAlertResponse(BaseModel):
    """Alerta educativo retornado pelo diagnóstico."""

    model_config = ConfigDict(extra="forbid")

    code: str = Field(..., description="Identificador estável em UPPER_SNAKE_CASE.")
    level: AlertLevel = Field(..., description="Severidade do alerta.")
    dimension: str = Field(..., description="Dimensão financeira afetada.")


class DiagnosticAnalyzeResponseData(BaseModel):
    """Carga útil (data) da resposta do diagnóstico financeiro."""

    model_config = ConfigDict(extra="forbid")

    renda_mensal: MoneyDecimal
    total_despesas_fixas: MoneyDecimal
    total_despesas_variaveis: MoneyDecimal
    total_dividas_mensais: MoneyDecimal
    total_reserva_atual: MoneyDecimal
    sobra_mensal: MoneyDecimal
    despesas_essenciais_mensais: MoneyDecimal
    comprometimento_percentual: MoneyDecimal
    sobra_percentual: MoneyDecimal
    reserva_em_meses: MoneyDecimal
    comprometimento_nivel: str
    reserva_nivel: str
    sobra_nivel: str
    pontos_comprometimento: int
    pontos_reserva: int
    pontos_sobra: int
    score: int
    saude_nivel: str
    alertas: list[DiagnosticAlertResponse]
