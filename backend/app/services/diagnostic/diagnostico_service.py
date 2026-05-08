"""Service de orquestração do diagnóstico financeiro."""

from __future__ import annotations

from decimal import Decimal
from typing import TypedDict

from app.core.errors import ValidationError
from app.domain.diagnostic import DomainValidationError, analisar_diagnostico


class DiagnosticAlertData(TypedDict):
    """Alerta canônico produzido pelo domínio para serialização HTTP."""

    code: str
    level: str
    dimension: str


class DiagnosticData(TypedDict):
    """Resultado canônico do diagnóstico financeiro usado pelo schema HTTP."""

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
    alertas: list[DiagnosticAlertData]


def _raise_as_validation(exc: DomainValidationError) -> None:
    raise ValidationError(
        exc.message,
        errors=[
            {
                "code": exc.code,
                "field": exc.field,
                "message": exc.message,
            }
        ],
    ) from exc


def analisar(
    renda_mensal: Decimal,
    total_despesas_fixas: Decimal,
    total_despesas_variaveis: Decimal,
    total_dividas_mensais: Decimal,
    total_reserva_atual: Decimal,
) -> DiagnosticData:
    """Orquestra o diagnóstico financeiro e devolve data canônico para o schema."""
    try:
        resultado = analisar_diagnostico(
            renda_mensal=renda_mensal,
            total_despesas_fixas=total_despesas_fixas,
            total_despesas_variaveis=total_despesas_variaveis,
            total_dividas_mensais=total_dividas_mensais,
            total_reserva_atual=total_reserva_atual,
        )
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    return {
        "renda_mensal": resultado.renda_mensal,
        "total_despesas_fixas": resultado.total_despesas_fixas,
        "total_despesas_variaveis": resultado.total_despesas_variaveis,
        "total_dividas_mensais": resultado.total_dividas_mensais,
        "total_reserva_atual": resultado.total_reserva_atual,
        "sobra_mensal": resultado.sobra_mensal,
        "despesas_essenciais_mensais": resultado.despesas_essenciais_mensais,
        "comprometimento_percentual": resultado.comprometimento_percentual,
        "sobra_percentual": resultado.sobra_percentual,
        "reserva_em_meses": resultado.reserva_em_meses,
        "comprometimento_nivel": resultado.comprometimento_nivel,
        "reserva_nivel": resultado.reserva_nivel,
        "sobra_nivel": resultado.sobra_nivel,
        "pontos_comprometimento": resultado.pontos_comprometimento,
        "pontos_reserva": resultado.pontos_reserva,
        "pontos_sobra": resultado.pontos_sobra,
        "score": resultado.score,
        "saude_nivel": resultado.saude_nivel,
        "alertas": [
            {"code": a.code, "level": a.level, "dimension": a.dimension} for a in resultado.alertas
        ],
    }


class DiagnosticoService:
    """Fachada sem estado para usos futuros com injeção/instrumentação."""

    @staticmethod
    def analisar(
        renda_mensal: Decimal,
        total_despesas_fixas: Decimal,
        total_despesas_variaveis: Decimal,
        total_dividas_mensais: Decimal,
        total_reserva_atual: Decimal,
    ) -> DiagnosticData:
        return analisar(
            renda_mensal=renda_mensal,
            total_despesas_fixas=total_despesas_fixas,
            total_despesas_variaveis=total_despesas_variaveis,
            total_dividas_mensais=total_dividas_mensais,
            total_reserva_atual=total_reserva_atual,
        )
