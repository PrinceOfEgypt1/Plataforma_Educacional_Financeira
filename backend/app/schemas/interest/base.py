"""Tipos compartilhados dos schemas de juros — Sprint 2 / F3.

Este módulo concentra os blocos de construção reutilizáveis pelos
schemas de entrada e saída dos três endpoints de juros
(``/simple``, ``/compound``, ``/compare``).

Decisões de contrato (Doc 06 §4.3, §5.3 do PLANO v1.2):
    - Valores monetários e taxas são serializados como ``str`` no JSON
      de saída para preservar precisão decimal ponta-a-ponta.
    - Monetários são quantizados em 2 casas (``Decimal("0.01")``) com
      ``ROUND_HALF_EVEN`` (bankers).
    - Taxas são quantizadas em 6 casas (``Decimal("0.000001")``) com
      ``ROUND_HALF_EVEN``.
    - Forma canônica de ``data``: ``summary`` / ``tables`` / ``charts``
      / ``interpretation`` / ``alerts``. Cada endpoint tipa o
      conteúdo das tabelas de forma apropriada em seu próprio schema
      ``*Out``. Em ``/compare``, ``tables`` é um objeto composto
      (``TablesComparar``) que aninha as tabelas dos dois regimes
      sob um único campo — preservando a forma canônica.
"""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, PlainSerializer

# ─────────────────────────────────────────────────────────────────────────
# Serializadores de Decimal (fronteira HTTP)
# ─────────────────────────────────────────────────────────────────────────

_MONEY_QUANTUM = Decimal("0.01")
_RATE_QUANTUM = Decimal("0.000001")


def _serialize_money(value: Decimal) -> str:
    """Serializa valor monetário como string com 2 casas decimais.

    Fronteira de apresentação — não faz parte do domínio. O domínio
    já entrega ``Decimal`` quantizado; esta função reafirma o quantum
    de apresentação e transforma para string JSON-safe.
    """
    if not isinstance(value, Decimal):  # defesa em profundidade
        value = Decimal(str(value))
    return format(
        value.quantize(_MONEY_QUANTUM, rounding=ROUND_HALF_EVEN),
        "f",
    )


def _serialize_rate(value: Decimal) -> str:
    """Serializa taxa como string com 6 casas decimais."""
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return format(
        value.quantize(_RATE_QUANTUM, rounding=ROUND_HALF_EVEN),
        "f",
    )


MoneyDecimal = Annotated[
    Decimal,
    PlainSerializer(_serialize_money, return_type=str, when_used="json"),
]
"""Tipo de anotação para valores monetários (BRL) na resposta."""

RateDecimal = Annotated[
    Decimal,
    PlainSerializer(_serialize_rate, return_type=str, when_used="json"),
]
"""Tipo de anotação para taxas (decimal puro, ex.: 0.01 == 1%) na resposta."""


# ─────────────────────────────────────────────────────────────────────────
# Tabela de amortização — linhas por período
# ─────────────────────────────────────────────────────────────────────────


class PeriodoSimplesRow(BaseModel):
    """Linha da tabela de juros simples."""

    model_config = ConfigDict(extra="forbid")

    periodo: int = Field(..., ge=1, description="Número do período (1-indexed).")
    saldo_inicial: MoneyDecimal = Field(
        ..., description="Saldo no início do período (BRL, 2 casas)."
    )
    juros_periodo: MoneyDecimal = Field(..., description="Juros gerados no período (BRL, 2 casas).")
    saldo_final: MoneyDecimal = Field(..., description="Saldo ao final do período (BRL, 2 casas).")


class PeriodoCompostoRow(BaseModel):
    """Linha da tabela de juros compostos."""

    model_config = ConfigDict(extra="forbid")

    periodo: int = Field(..., ge=1, description="Número do período (1-indexed).")
    saldo_inicial: MoneyDecimal = Field(
        ..., description="Saldo no início do período (BRL, 2 casas)."
    )
    juros_periodo: MoneyDecimal = Field(..., description="Juros gerados no período (BRL, 2 casas).")
    aporte: MoneyDecimal = Field(
        ...,
        description="Aporte creditado ao final do período (BRL, 2 casas).",
    )
    saldo_final: MoneyDecimal = Field(
        ...,
        description="Saldo ao final do período após juros e aporte (BRL, 2 casas).",
    )


# ─────────────────────────────────────────────────────────────────────────
# Blocos de ``data`` — summary / charts / interpretation / alerts
# ─────────────────────────────────────────────────────────────────────────


class SummarySimples(BaseModel):
    """Resumo canônico de uma simulação de juros simples."""

    model_config = ConfigDict(extra="forbid")

    principal: MoneyDecimal = Field(..., description="PV de entrada.")
    taxa_mensal: RateDecimal = Field(..., description="Taxa mensal (ex.: 0.010000).")
    prazo_meses: int = Field(..., ge=1)
    juros_totais: MoneyDecimal = Field(..., description="Juros acumulados (BRL).")
    montante_final: MoneyDecimal = Field(..., description="FV = PV + J (BRL).")


class SummaryCompostos(BaseModel):
    """Resumo canônico de uma simulação de juros compostos."""

    model_config = ConfigDict(extra="forbid")

    principal: MoneyDecimal = Field(..., description="PV de entrada.")
    taxa_mensal: RateDecimal = Field(..., description="Taxa mensal (ex.: 0.010000).")
    prazo_meses: int = Field(..., ge=1)
    aporte_mensal: MoneyDecimal = Field(
        ..., description="Aporte mensal postecipado (0 quando ausente)."
    )
    juros_totais: MoneyDecimal = Field(..., description="Juros acumulados (BRL).")
    total_aportado: MoneyDecimal = Field(..., description="Soma dos aportes (BRL).")
    total_investido: MoneyDecimal = Field(..., description="principal + total_aportado (BRL).")
    montante_final: MoneyDecimal = Field(..., description="Saldo final (BRL).")


class SummaryComparar(BaseModel):
    """Resumo canônico de uma comparação simples × compostos."""

    model_config = ConfigDict(extra="forbid")

    principal: MoneyDecimal
    taxa_mensal: RateDecimal
    prazo_meses: int = Field(..., ge=1)
    montante_simples: MoneyDecimal
    montante_composto: MoneyDecimal
    diferenca: MoneyDecimal = Field(
        ...,
        description="montante_composto - montante_simples (BRL).",
    )
    razao: str = Field(
        ...,
        description="montante_composto / montante_simples, como string (6 casas).",
    )


class ChartSeries(BaseModel):
    """Série de pontos de um gráfico de evolução."""

    model_config = ConfigDict(extra="forbid")

    label: str = Field(..., description="Rótulo humano da série.")
    kind: Literal["simples", "composto"] = Field(
        ..., description="Tipo de cálculo que gerou a série."
    )
    points: list[MoneyDecimal] = Field(
        ...,
        description="Saldo ao final de cada período (BRL). ``len == prazo_meses``.",
    )


class Chart(BaseModel):
    """Meta-gráfico de evolução de saldo.

    Não renderiza: descreve. Frontend é responsável por transformar
    isto em visualização (Chart.js, Recharts, etc.).
    """

    model_config = ConfigDict(extra="forbid")

    x_label: str = Field(default="Período (meses)")
    y_label: str = Field(default="Saldo (BRL)")
    series: list[ChartSeries]


class Interpretation(BaseModel):
    """Bloco pedagógico narrativo — explica o resultado em PT-BR."""

    model_config = ConfigDict(extra="forbid")

    headline: str = Field(
        ...,
        description="Frase curta e direta com o resultado principal.",
    )
    body: str = Field(
        ...,
        description="Explicação narrativa (1–3 parágrafos).",
    )


class Alert(BaseModel):
    """Alerta pedagógico/operacional anexado à resposta."""

    model_config = ConfigDict(extra="forbid")

    code: str = Field(
        ...,
        description="Código estável do alerta (UPPER_SNAKE_CASE).",
    )
    severity: Literal["info", "warning"] = Field(
        default="info",
        description="Severidade do alerta (nunca 'error' aqui — erros usam Problem).",
    )
    message: str = Field(..., description="Mensagem legível em PT-BR.")


# ─────────────────────────────────────────────────────────────────────────
# Tabelas compostas — usadas apenas por /compare (forma canônica)
# ─────────────────────────────────────────────────────────────────────────


class TablesComparar(BaseModel):
    """Agrupamento canônico das tabelas no endpoint ``/compare``.

    A forma preserva o campo único ``tables`` do envelope canônico
    (``summary/tables/charts/interpretation/alerts``) e aninha, sob
    chaves estáveis, as duas tabelas período-a-período que o
    endpoint precisa devolver.

    Chaves:
        - ``simple``   — tabela de juros simples (``PeriodoSimplesRow``).
        - ``compound`` — tabela de juros compostos (``PeriodoCompostoRow``).
    """

    model_config = ConfigDict(extra="forbid")

    simple: list[PeriodoSimplesRow] = Field(
        default_factory=list,
        description="Tabela período-a-período — juros simples.",
    )
    compound: list[PeriodoCompostoRow] = Field(
        default_factory=list,
        description="Tabela período-a-período — juros compostos.",
    )
