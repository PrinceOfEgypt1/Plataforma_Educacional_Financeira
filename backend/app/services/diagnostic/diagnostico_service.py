"""Service de orquestração do diagnóstico financeiro."""

from __future__ import annotations

from decimal import Decimal
from typing import Any

from app.core.errors import ValidationError
from app.domain.diagnostic import DomainValidationError, analisar_diagnostico


def _raise_as_validation(exc: DomainValidationError) -> None:
    errors: list[dict[str, Any]] = [
        {
            "code": exc.code,
            "field": exc.field,
            "message": exc.message,
        }
    ]
    raise ValidationError(exc.message, errors=errors) from exc


def analisar(
    renda_mensal: Decimal,
    total_despesas_fixas: Decimal,
    total_despesas_variaveis: Decimal,
    total_dividas_mensais: Decimal,
    total_reserva_atual: Decimal,
) -> dict[str, Any]:
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
    ) -> dict[str, Any]:
        return analisar(
            renda_mensal=renda_mensal,
            total_despesas_fixas=total_despesas_fixas,
            total_despesas_variaveis=total_despesas_variaveis,
            total_dividas_mensais=total_dividas_mensais,
            total_reserva_atual=total_reserva_atual,
        )
