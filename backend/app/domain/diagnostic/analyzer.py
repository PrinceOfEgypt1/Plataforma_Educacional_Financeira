"""Analisador de diagnóstico financeiro — domínio puro.

Ponto de entrada: ``analisar_diagnostico``.
Fonte das regras: docs/baseline/03_Regras_de_Negocio.md §7
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Literal

from ._rounding import ensure_precision, money
from .rules import (
    SaudeNivel,
    calcular_saude_nivel,
    classificar_comprometimento,
    classificar_reserva,
    classificar_sobra,
)

AlertLevel = Literal["info", "warning", "critical"]

_ZERO = Decimal("0")


@dataclass(frozen=True, slots=True)
class DiagnosticAlert:
    """Alerta educativo gerado pelo diagnóstico.

    Atributos:
        code: identificador estável em UPPER_SNAKE_CASE.
        level: "info" | "warning" | "critical".
        dimension: dimensão financeira afetada.
    """

    code: str
    level: AlertLevel
    dimension: str


@dataclass(frozen=True, slots=True)
class DiagnosticoResultado:
    """Resultado completo do diagnóstico financeiro.

    Todos os valores monetários e percentuais são quantizados a 2 casas
    decimais (apresentação). Classificações e score são determinísticos
    conforme Doc 03 §7.
    """

    renda_mensal: Decimal
    total_despesas_fixas: Decimal
    total_despesas_variaveis: Decimal
    total_dividas_mensais: Decimal
    total_reserva_atual: Decimal
    sobra_mensal: Decimal
    despesas_essenciais_mensais: Decimal
    comprometimento_percentual: Decimal
    sobra_percentual: Decimal
    reserva_em_meses: Decimal
    comprometimento_nivel: str
    reserva_nivel: str
    sobra_nivel: str
    pontos_comprometimento: int
    pontos_reserva: int
    pontos_sobra: int
    score: int
    saude_nivel: str
    alertas: tuple[DiagnosticAlert, ...] = field(default_factory=tuple)


def _ensure_decimal(field: str, value: object) -> Decimal:
    from . import DomainValidationError

    if isinstance(value, bool):
        raise DomainValidationError(
            code="TIPO_INVALIDO",
            message=f"'{field}' deve ser Decimal, não bool.",
            field=field,
            value=value,
        )
    if not isinstance(value, Decimal):
        raise DomainValidationError(
            code="TIPO_INVALIDO",
            message=f"'{field}' deve ser Decimal.",
            field=field,
            value=value,
        )
    if not value.is_finite():
        raise DomainValidationError(
            code="VALOR_NAO_FINITO",
            message=f"'{field}' deve ser um valor finito.",
            field=field,
            value=value,
        )
    return value


def _validate(
    renda_mensal: object,
    total_despesas_fixas: object,
    total_despesas_variaveis: object,
    total_dividas_mensais: object,
    total_reserva_atual: object,
) -> None:
    from . import DomainValidationError

    renda = _ensure_decimal("renda_mensal", renda_mensal)
    fixas = _ensure_decimal("total_despesas_fixas", total_despesas_fixas)
    variaveis = _ensure_decimal("total_despesas_variaveis", total_despesas_variaveis)
    dividas = _ensure_decimal("total_dividas_mensais", total_dividas_mensais)
    reserva = _ensure_decimal("total_reserva_atual", total_reserva_atual)

    if renda <= _ZERO:
        raise DomainValidationError(
            code="RENDA_NAO_POSITIVA",
            message="'renda_mensal' deve ser estritamente positiva.",
            field="renda_mensal",
            value=renda,
        )

    for fname, val in [
        ("total_despesas_fixas", fixas),
        ("total_despesas_variaveis", variaveis),
        ("total_dividas_mensais", dividas),
        ("total_reserva_atual", reserva),
    ]:
        if val < _ZERO:
            raise DomainValidationError(
                code="VALOR_NEGATIVO",
                message=f"'{fname}' não pode ser negativo.",
                field=fname,
                value=val,
            )

    despesas_essenciais = fixas + variaveis
    if despesas_essenciais == _ZERO:
        raise DomainValidationError(
            code="DESPESAS_ESSENCIAIS_ZERO",
            message=(
                "A soma de 'total_despesas_fixas' e 'total_despesas_variaveis' "
                "deve ser positiva para calcular reserva_em_meses."
            ),
            field="total_despesas_fixas",
            value=despesas_essenciais,
        )


def _gerar_alertas(
    comprometimento_nivel: str,
    reserva_nivel: str,
    sobra_nivel: str,
) -> tuple[DiagnosticAlert, ...]:
    alertas: list[DiagnosticAlert] = []

    if comprometimento_nivel == "critico":
        alertas.append(
            DiagnosticAlert(
                code="COMPROMETIMENTO_CRITICO",
                level="critical",
                dimension="comprometimento",
            )
        )
    elif comprometimento_nivel == "alto":
        alertas.append(
            DiagnosticAlert(
                code="COMPROMETIMENTO_ALTO",
                level="warning",
                dimension="comprometimento",
            )
        )

    if reserva_nivel == "critica":
        alertas.append(
            DiagnosticAlert(
                code="RESERVA_CRITICA",
                level="critical",
                dimension="reserva",
            )
        )
    elif reserva_nivel == "insuficiente":
        alertas.append(
            DiagnosticAlert(
                code="RESERVA_INSUFICIENTE",
                level="warning",
                dimension="reserva",
            )
        )

    if sobra_nivel == "negativa":
        alertas.append(
            DiagnosticAlert(
                code="SOBRA_NEGATIVA",
                level="critical",
                dimension="sobra",
            )
        )
    elif sobra_nivel == "minima":
        alertas.append(
            DiagnosticAlert(
                code="SOBRA_MINIMA",
                level="warning",
                dimension="sobra",
            )
        )

    return tuple(alertas)


def analisar_diagnostico(
    renda_mensal: Decimal,
    total_despesas_fixas: Decimal,
    total_despesas_variaveis: Decimal,
    total_dividas_mensais: Decimal,
    total_reserva_atual: Decimal,
) -> DiagnosticoResultado:
    """Executa o diagnóstico financeiro completo.

    Args:
        renda_mensal: renda líquida mensal total, ``Decimal > 0``.
        total_despesas_fixas: despesas fixas mensais, ``Decimal >= 0``.
        total_despesas_variaveis: despesas variáveis mensais, ``Decimal >= 0``.
        total_dividas_mensais: parcelas mensais de dívidas, ``Decimal >= 0``.
        total_reserva_atual: reserva de emergência disponível, ``Decimal >= 0``.

    Returns:
        ``DiagnosticoResultado`` com classificações, score, saúde e alertas.

    Raises:
        DomainValidationError: se qualquer precondição for violada.
    """
    ensure_precision()
    _validate(
        renda_mensal,
        total_despesas_fixas,
        total_despesas_variaveis,
        total_dividas_mensais,
        total_reserva_atual,
    )

    despesas_essenciais = total_despesas_fixas + total_despesas_variaveis
    sobra_mensal = (
        renda_mensal - total_despesas_fixas - total_despesas_variaveis - total_dividas_mensais
    )
    comprometimento_pct = (total_dividas_mensais / renda_mensal) * Decimal("100")
    sobra_pct = (sobra_mensal / renda_mensal) * Decimal("100")
    reserva_em_meses = total_reserva_atual / despesas_essenciais

    comprometimento_nivel, pontos_comprometimento = classificar_comprometimento(comprometimento_pct)
    reserva_nivel, pontos_reserva = classificar_reserva(reserva_em_meses)
    sobra_nivel, pontos_sobra = classificar_sobra(sobra_pct)

    score = pontos_comprometimento + pontos_reserva + pontos_sobra
    saude_nivel: SaudeNivel = calcular_saude_nivel(score, sobra_mensal, reserva_em_meses)

    alertas = _gerar_alertas(comprometimento_nivel, reserva_nivel, sobra_nivel)

    return DiagnosticoResultado(
        renda_mensal=money(renda_mensal),
        total_despesas_fixas=money(total_despesas_fixas),
        total_despesas_variaveis=money(total_despesas_variaveis),
        total_dividas_mensais=money(total_dividas_mensais),
        total_reserva_atual=money(total_reserva_atual),
        sobra_mensal=money(sobra_mensal),
        despesas_essenciais_mensais=money(despesas_essenciais),
        comprometimento_percentual=money(comprometimento_pct),
        sobra_percentual=money(sobra_pct),
        reserva_em_meses=money(reserva_em_meses),
        comprometimento_nivel=comprometimento_nivel,
        reserva_nivel=reserva_nivel,
        sobra_nivel=sobra_nivel,
        pontos_comprometimento=pontos_comprometimento,
        pontos_reserva=pontos_reserva,
        pontos_sobra=pontos_sobra,
        score=score,
        saude_nivel=saude_nivel,
        alertas=alertas,
    )
