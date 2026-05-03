"""Service de orquestracao dos calculos de amortizacao."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import Any

from app.core.errors import ValidationError
from app.domain.amortization import (
    AmortizationPeriod,
    DomainValidationError,
    PriceResultado,
    SacResultado,
    calcular_price,
    calcular_sac,
)


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def _raise_as_validation(exc: DomainValidationError) -> None:
    errors: list[dict[str, Any]] = [
        {
            "code": exc.code,
            "field": exc.field,
            "message": exc.message,
        }
    ]
    raise ValidationError(exc.message, errors=errors) from exc


def _reject_non_positive_principal(principal: Decimal) -> None:
    if principal <= 0:
        msg = "principal deve ser maior que zero para a API de amortizacao."
        raise ValidationError(
            msg,
            errors=[
                {
                    "code": "NON_POSITIVE_PRINCIPAL",
                    "field": "principal",
                    "message": msg,
                }
            ],
        )


def _periodo_to_dict(row: AmortizationPeriod) -> dict[str, Any]:
    return {
        "periodo": row.periodo,
        "saldo_inicial": row.saldo_inicial,
        "juros": row.juros,
        "amortizacao": row.amortizacao,
        "parcela": row.parcela,
        "saldo_final": row.saldo_final,
    }


def _price_summary(resultado: PriceResultado) -> dict[str, Any]:
    return {
        "sistema": "PRICE",
        "principal": resultado.principal,
        "taxa_periodo": resultado.taxa_periodo,
        "n_periodos": resultado.n_periodos,
        "parcela": resultado.parcela,
        "total_pago": resultado.total_pago,
        "total_juros": resultado.total_juros,
        "saldo_final": resultado.saldo_final,
    }


def _sac_summary(resultado: SacResultado) -> dict[str, Any]:
    return {
        "sistema": "SAC",
        "principal": resultado.principal,
        "taxa_periodo": resultado.taxa_periodo,
        "n_periodos": resultado.n_periodos,
        "amortizacao_constante": resultado.amortizacao_constante,
        "parcela_inicial": resultado.parcela_inicial,
        "parcela_final": resultado.parcela_final,
        "total_pago": resultado.total_pago,
        "total_juros": resultado.total_juros,
        "saldo_final": resultado.saldo_final,
    }


def _chart(kind: str, label: str, tabela: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "x_label": "Periodo",
        "y_label": "Saldo devedor (BRL)",
        "series": [
            {
                "label": label,
                "kind": kind,
                "points": [row["saldo_final"] for row in tabela],
            }
        ],
    }


def _interpretacao_price(resultado: PriceResultado) -> dict[str, str]:
    pct = (resultado.taxa_periodo * Decimal("100")).quantize(Decimal("0.01"))
    headline = (
        f"No sistema PRICE, a parcela regular e R$ {_money(resultado.parcela)} "
        f"para {resultado.n_periodos} periodos."
    )
    body = (
        f"Para principal de R$ {_money(resultado.principal)} a {pct}% por periodo, "
        f"o total pago e R$ {_money(resultado.total_pago)} e os juros somam "
        f"R$ {_money(resultado.total_juros)}. A ultima linha absorve residuos de "
        "centavos para manter a tabela fechada e saldo final zero."
    )
    return {"headline": headline, "body": body}


def _interpretacao_sac(resultado: SacResultado) -> dict[str, str]:
    pct = (resultado.taxa_periodo * Decimal("100")).quantize(Decimal("0.01"))
    headline = (
        f"No sistema SAC, a amortizacao regular e R$ "
        f"{_money(resultado.amortizacao_constante)} por periodo."
    )
    body = (
        f"Para principal de R$ {_money(resultado.principal)} a {pct}% por periodo, "
        f"a parcela inicial e R$ {_money(resultado.parcela_inicial)} e a final e "
        f"R$ {_money(resultado.parcela_final)}. O total de juros e "
        f"R$ {_money(resultado.total_juros)}, com saldo final zero."
    )
    return {"headline": headline, "body": body}


def _interpretacao_compare(
    price: PriceResultado,
    sac: SacResultado,
    diferenca_juros: Decimal,
) -> dict[str, str]:
    if diferenca_juros > 0:
        headline = f"Neste cenario, SAC reduz os juros em R$ {_money(diferenca_juros)}."
    elif diferenca_juros < 0:
        headline = f"Neste cenario, PRICE reduz os juros em R$ {_money(-diferenca_juros)}."
    else:
        headline = "Neste cenario, PRICE e SAC empatam em juros totais."
    body = (
        f"PRICE soma R$ {_money(price.total_juros)} de juros e SAC soma "
        f"R$ {_money(sac.total_juros)}. A diferenca e calculada como "
        "PRICE.total_juros - SAC.total_juros; valores positivos favorecem SAC."
    )
    return {"headline": headline, "body": body}


def simular_price(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> dict[str, Any]:
    """Orquestra PRICE e devolve data canonico para o schema PriceOut."""
    _reject_non_positive_principal(principal)
    try:
        resultado = calcular_price(principal, taxa_periodo, n_periodos)
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    tabela = [_periodo_to_dict(row) for row in resultado.tabela_periodo]
    return {
        "summary": _price_summary(resultado),
        "tables": {"amortizacao": tabela},
        "charts": [_chart("price", "Saldo devedor - PRICE", tabela)],
        "interpretation": _interpretacao_price(resultado),
        "alerts": [],
    }


def simular_sac(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> dict[str, Any]:
    """Orquestra SAC e devolve data canonico para o schema SacOut."""
    _reject_non_positive_principal(principal)
    try:
        resultado = calcular_sac(principal, taxa_periodo, n_periodos)
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    tabela = [_periodo_to_dict(row) for row in resultado.tabela_periodo]
    return {
        "summary": _sac_summary(resultado),
        "tables": {"amortizacao": tabela},
        "charts": [_chart("sac", "Saldo devedor - SAC", tabela)],
        "interpretation": _interpretacao_sac(resultado),
        "alerts": [],
    }


def comparar_price_sac(
    principal: Decimal,
    taxa_periodo: Decimal,
    n_periodos: int,
) -> dict[str, Any]:
    """Compara PRICE e SAC para uma mesma entrada."""
    _reject_non_positive_principal(principal)
    try:
        price = calcular_price(principal, taxa_periodo, n_periodos)
        sac = calcular_sac(principal, taxa_periodo, n_periodos)
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    tabela_price = [_periodo_to_dict(row) for row in price.tabela_periodo]
    tabela_sac = [_periodo_to_dict(row) for row in sac.tabela_periodo]
    diferenca_juros = price.total_juros - sac.total_juros
    diferenca_total_pago = price.total_pago - sac.total_pago
    if sac.total_juros < price.total_juros:
        menor = "SAC"
    elif price.total_juros < sac.total_juros:
        menor = "PRICE"
    else:
        menor = "EMPATE"

    return {
        "summary": {
            "principal": price.principal,
            "taxa_periodo": price.taxa_periodo,
            "n_periodos": price.n_periodos,
            "price": _price_summary(price),
            "sac": _sac_summary(sac),
            "diferenca_juros": diferenca_juros,
            "diferenca_total_pago": diferenca_total_pago,
            "menor_total_juros": menor,
        },
        "tables": {"price": tabela_price, "sac": tabela_sac},
        "charts": [
            {
                "x_label": "Periodo",
                "y_label": "Saldo devedor (BRL)",
                "series": [
                    {
                        "label": "Saldo devedor - PRICE",
                        "kind": "price",
                        "points": [row["saldo_final"] for row in tabela_price],
                    },
                    {
                        "label": "Saldo devedor - SAC",
                        "kind": "sac",
                        "points": [row["saldo_final"] for row in tabela_sac],
                    },
                ],
            }
        ],
        "interpretation": _interpretacao_compare(price, sac, diferenca_juros),
        "alerts": [],
    }


class CalcularAmortizacaoService:
    """Fachada sem estado para usos futuros com injecao/instrumentacao."""

    @staticmethod
    def price(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> dict[str, Any]:
        return simular_price(principal, taxa_periodo, n_periodos)

    @staticmethod
    def sac(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> dict[str, Any]:
        return simular_sac(principal, taxa_periodo, n_periodos)

    @staticmethod
    def comparar(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> dict[str, Any]:
        return comparar_price_sac(principal, taxa_periodo, n_periodos)
