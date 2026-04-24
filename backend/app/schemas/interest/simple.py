"""Schemas do endpoint ``POST /api/v1/interest/simple`` — F3.

Entrada: principal, taxa_mensal, prazo_meses.
Saída: envelope canônico ``data`` com summary, tables, charts,
interpretation e alerts (ver ``base.py``).
"""

from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.interest.base import (
    Alert,
    Chart,
    Interpretation,
    PeriodoSimplesRow,
    SummarySimples,
)


class JurosSimplesIn(BaseModel):
    """Corpo da requisição para juros simples.

    Validações de borda:
        - ``principal >= 0`` e tipo ``Decimal`` (Pydantic v2 coage
          string/float para Decimal com precisão preservada).
        - ``taxa_mensal >= 0``. Interpretada como decimal puro — 1% a.m.
          deve ser enviado como ``"0.01"``, **não** como ``"1"``.
        - ``prazo_meses`` estritamente positivo e menor que 1200
          (limite superior defensivo — 100 anos de prazo mensal).
    """

    model_config = ConfigDict(extra="forbid")

    principal: Decimal = Field(
        ...,
        ge=0,
        description="Valor presente (PV) em BRL. Envie como string para preservar precisão.",
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
        description="Prazo em meses. Estritamente positivo; limite superior defensivo.",
        examples=[12],
    )


class JurosSimplesOut(BaseModel):
    """Carga útil (``data``) da resposta de juros simples."""

    model_config = ConfigDict(extra="forbid")

    summary: SummarySimples
    tables: dict[str, list[PeriodoSimplesRow]] = Field(
        default_factory=dict,
        description="Chave canônica: 'amortizacao' — tabela período-a-período.",
    )
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
