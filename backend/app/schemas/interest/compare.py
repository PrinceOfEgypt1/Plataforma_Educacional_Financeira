"""Schemas do endpoint ``POST /api/v1/interest/compare`` — F3.

Gera duas simulações (simples e composta) sobre o mesmo
``(principal, taxa_mensal, prazo_meses)`` e expõe a diferença
numérica e pedagógica entre elas. Não aceita aporte (intencional:
é uma comparação didática pura sobre a mesma carga de entrada).

Forma canônica preservada: a resposta usa exatamente os cinco
campos do envelope de ``data`` oficial —
``summary/tables/charts/interpretation/alerts``. O campo
``tables`` é um objeto composto (``TablesComparar``) que expõe as
duas tabelas sob chaves estáveis ``simple`` e ``compound``, sem
quebrar a unicidade do campo.
"""

from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.interest.base import (
    Alert,
    Chart,
    Interpretation,
    SummaryComparar,
    TablesComparar,
)


class CompararJurosIn(BaseModel):
    """Corpo da requisição para comparar simples × compostos."""

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
        description="Prazo em meses.",
        examples=[12],
    )


class CompararJurosOut(BaseModel):
    """Carga útil (``data``) da resposta de comparação.

    Campos (na ordem canônica do envelope):
        - ``summary``        — ``SummaryComparar`` com PV, taxa, prazo,
          montantes simples/composto, diferença e razão.
        - ``tables``         — ``TablesComparar`` com ``simple`` e
          ``compound`` aninhados sob um único campo.
        - ``charts``         — lista com um único ``Chart`` contendo
          duas séries (``simples`` e ``composto``), prontos para
          renderização comparativa no frontend.
        - ``interpretation`` — bloco pedagógico (headline + body).
        - ``alerts``         — lista (usualmente vazia) de alertas
          não-bloqueantes.
    """

    model_config = ConfigDict(extra="forbid")

    summary: SummaryComparar
    tables: TablesComparar = Field(default_factory=TablesComparar)
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
