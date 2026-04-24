"""Schemas do endpoint ``POST /api/v1/interest/compound`` — F3.

Mesma mecânica do simple, com o campo opcional ``aporte_mensal``
postecipado (``None`` = sem aporte). Aporte ``>= 0``.
"""

from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.interest.base import (
    Alert,
    Chart,
    Interpretation,
    PeriodoCompostoRow,
    SummaryCompostos,
)


class JurosCompostosIn(BaseModel):
    """Corpo da requisição para juros compostos.

    O parâmetro ``aporte_mensal`` é postecipado (aplicado ao final do
    período, após a incidência dos juros). Quando ausente ou
    ``null``, a simulação é de juros compostos puros
    (``FV = PV × (1 + i)^n``).
    """

    model_config = ConfigDict(extra="forbid")

    principal: Decimal = Field(
        ...,
        ge=0,
        description="Valor presente (PV) em BRL.",
        examples=["1000.00"],
    )
    taxa_mensal: Decimal = Field(
        ...,
        ge=0,
        description="Taxa mensal como decimal puro (ex.: 0.01 = 1% a.m.).",
        examples=["0.01"],
    )
    prazo_meses: int = Field(
        ...,
        ge=1,
        le=1200,
        description="Prazo em meses (estritamente positivo).",
        examples=[12],
    )
    aporte_mensal: Decimal | None = Field(
        default=None,
        ge=0,
        description="Aporte mensal postecipado (BRL). Opcional; default 0.",
        examples=["100.00"],
    )


class JurosCompostosOut(BaseModel):
    """Carga útil (``data``) da resposta de juros compostos."""

    model_config = ConfigDict(extra="forbid")

    summary: SummaryCompostos
    tables: dict[str, list[PeriodoCompostoRow]] = Field(
        default_factory=dict,
        description="Chave canônica: 'amortizacao'.",
    )
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
