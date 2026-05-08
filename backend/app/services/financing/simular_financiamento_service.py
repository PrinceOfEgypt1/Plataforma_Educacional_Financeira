"""Service de orquestracao da simulacao de financiamento imobiliario."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import Any

from app.core.errors import ValidationError
from app.domain.financing import (
    DomainValidationError,
    FinanciamentoImobResultado,
    FinanciamentoPeriodo,
    calcular_financiamento_imobiliario,
)


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def _raise_as_validation(exc: DomainValidationError) -> None:
    raise ValidationError(
        exc.message,
        errors=[{"code": exc.code, "field": exc.field, "message": exc.message}],
    ) from exc


def _periodo_to_dict(row: FinanciamentoPeriodo) -> dict[str, Any]:
    return {
        "numero": row.numero,
        "saldo_inicial": row.saldo_inicial,
        "juros": row.juros,
        "amortizacao": row.amortizacao,
        "encargos": row.encargos,
        "prestacao": row.prestacao,
        "saldo_final": row.saldo_final,
    }


def _resultado_to_dict(resultado: FinanciamentoImobResultado) -> dict[str, Any]:
    return {
        "summary": {
            "sistema_amortizacao": resultado.sistema_amortizacao,
            "valor_imovel": resultado.valor_imovel,
            "valor_entrada": resultado.valor_entrada,
            "valor_financiado": resultado.valor_financiado,
            "prazo_meses": resultado.prazo_meses,
            "taxa_juros_mensal": resultado.taxa_juros_mensal,
            "total_pago": resultado.total_pago,
            "total_juros": resultado.total_juros,
            "total_amortizado": resultado.total_amortizado,
            "total_encargos": resultado.total_encargos,
            "custo_total": resultado.custo_total,
            "primeira_parcela": resultado.primeira_parcela,
            "ultima_parcela": resultado.ultima_parcela,
        },
        "parcelas": [_periodo_to_dict(p) for p in resultado.parcelas],
    }


def simular_financiamento_imobiliario(
    valor_imovel: Decimal,
    valor_entrada: Decimal,
    prazo_meses: int,
    taxa_juros_mensal_percentual: Decimal,
    sistema_amortizacao: str,
    seguro_mensal: Decimal = Decimal("0.00"),
    tarifa_mensal: Decimal = Decimal("0.00"),
    custo_administrativo_mensal: Decimal = Decimal("0.00"),
) -> dict[str, Any]:
    """Orquestra simulacao de financiamento imobiliario e devolve dict serializavel.

    Args:
        taxa_juros_mensal_percentual: taxa em formato percentual (ex.: 0.7 para 0,7%).
            Convertida internamente para decimal puro antes de chamar o dominio.

    Raises:
        ValidationError: se o dominio rejeitar as entradas.
    """
    taxa_mensal = taxa_juros_mensal_percentual / Decimal("100")

    try:
        resultado = calcular_financiamento_imobiliario(
            valor_imovel=valor_imovel,
            valor_entrada=valor_entrada,
            prazo_meses=prazo_meses,
            taxa_juros_mensal=taxa_mensal,
            sistema_amortizacao=sistema_amortizacao,
            seguro_mensal=seguro_mensal,
            tarifa_mensal=tarifa_mensal,
            custo_administrativo_mensal=custo_administrativo_mensal,
        )
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise  # pragma: no cover — satisfaz mypy

    return _resultado_to_dict(resultado)
