"""Service de orquestração dos cálculos de juros — F3.

Ponte fina entre a camada de API (``app.api.v1.interest``) e o
domínio (``app.domain.interest``). Responsabilidades:

    1. Chamar as funções do domínio com os valores ``Decimal`` já
       coagidos pelos schemas Pydantic.
    2. Converter ``DomainValidationError`` (exceção pura de domínio,
       ver ``app/domain/interest/__init__.py``) em
       ``app.core.errors.ValidationError`` (RFC 7807, status 422).
    3. Montar a estrutura de saída canônica
       (``summary`` / ``tables`` / ``charts`` / ``interpretation`` /
       ``alerts``) em ``dict`` pronto para o schema ``*Out`` validar.
       Em ``/compare`` especificamente, ``tables`` é um objeto
       composto com chaves aninhadas ``simple`` e ``compound``,
       preservando a unicidade do campo canônico.

Não há acesso a banco, cache ou serviço externo nesta sprint.
Não há retentativa, timeout ou idempotência aqui — idempotência é
log-only (header), tratada na camada de endpoint.
"""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import Any

from app.core.errors import ValidationError
from app.domain.interest import (
    DomainValidationError,
    calcular_juros_compostos,
    calcular_juros_simples,
)

# ─────────────────────────────────────────────────────────────────────────
# Helpers internos
# ─────────────────────────────────────────────────────────────────────────


def _raise_as_validation(exc: DomainValidationError) -> None:
    """Converte erro puro de domínio em ValidationError (RFC 7807)."""
    errors: list[dict[str, Any]] = [
        {
            "code": exc.code,
            "field": exc.field,
            "message": exc.message,
        }
    ]
    raise ValidationError(exc.message, errors=errors) from exc


def _money(value: Decimal) -> Decimal:
    """Quantização defensiva para apresentação (2 casas, bankers)."""
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def _periodo_simples_to_dict(row: Any) -> dict[str, Any]:
    return {
        "periodo": row.periodo,
        "saldo_inicial": row.saldo_inicial,
        "juros_periodo": row.juros_periodo,
        "saldo_final": row.saldo_final,
    }


def _periodo_composto_to_dict(row: Any) -> dict[str, Any]:
    return {
        "periodo": row.periodo,
        "saldo_inicial": row.saldo_inicial,
        "juros_periodo": row.juros_periodo,
        "aporte": row.aporte,
        "saldo_final": row.saldo_final,
    }


def _interpretacao_simples(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo: int,
    juros_totais: Decimal,
    montante: Decimal,
) -> dict[str, str]:
    pct = (taxa_mensal * Decimal("100")).quantize(Decimal("0.01"))
    headline = (
        f"Em juros simples, R$ {_money(principal)} a {pct}% a.m. por "
        f"{prazo} meses gera R$ {_money(juros_totais)} de juros."
    )
    body = (
        "Os juros simples incidem sempre sobre o valor principal original: "
        "a cada mês, o saldo cresce por um valor fixo igual a "
        f"principal × taxa = R$ {_money(principal * taxa_mensal)}. "
        f"Ao final de {prazo} meses, o montante total é "
        f"R$ {_money(montante)} (PV + juros). Diferentemente do regime "
        "composto, a progressão do saldo é estritamente linear."
    )
    return {"headline": headline, "body": body}


def _interpretacao_compostos(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo: int,
    aporte: Decimal,
    juros_totais: Decimal,
    montante: Decimal,
) -> dict[str, str]:
    pct = (taxa_mensal * Decimal("100")).quantize(Decimal("0.01"))
    aporte_txt = f" com aporte mensal de R$ {_money(aporte)}" if aporte > 0 else ""
    headline = (
        f"Em juros compostos, R$ {_money(principal)} a {pct}% a.m. "
        f"por {prazo} meses{aporte_txt} resulta em R$ {_money(montante)}."
    )
    body = (
        "No regime composto, os juros do período são somados ao saldo "
        "e passam a render juros nos períodos seguintes. Isso é o "
        "efeito exponencial da capitalização: os juros totais foram "
        f"R$ {_money(juros_totais)}, acima do que o regime simples "
        "produziria nas mesmas condições."
    )
    return {"headline": headline, "body": body}


def _interpretacao_comparar(
    simples_montante: Decimal,
    composto_montante: Decimal,
    prazo: int,
) -> dict[str, str]:
    diferenca = composto_montante - simples_montante
    headline = f"Após {prazo} meses, o regime composto supera o simples em R$ {_money(diferenca)}."
    body = (
        "A diferença é o chamado 'efeito dos juros sobre juros': no "
        "regime simples, os juros incidem sempre sobre o principal "
        "original; no regime composto, eles incidem sobre o saldo já "
        "acumulado. Quanto maior o prazo, maior a divergência entre "
        "os dois regimes."
    )
    return {"headline": headline, "body": body}


# ─────────────────────────────────────────────────────────────────────────
# API pública do service
# ─────────────────────────────────────────────────────────────────────────


def simular_juros_simples(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
) -> dict[str, Any]:
    """Orquestra um cálculo de juros simples e devolve ``data`` canônico.

    Retorno: ``dict`` com a forma de ``JurosSimplesOut``.

    Levanta ``app.core.errors.ValidationError`` (status 422) para
    qualquer violação de pré-condição detectada pelo domínio.
    """
    try:
        resultado = calcular_juros_simples(principal, taxa_mensal, prazo_meses)
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise  # unreachable — mantém mypy feliz

    tabela = [_periodo_simples_to_dict(r) for r in resultado.tabela]
    pontos = [r["saldo_final"] for r in tabela]

    interpretacao = _interpretacao_simples(
        principal=principal,
        taxa_mensal=taxa_mensal,
        prazo=prazo_meses,
        juros_totais=resultado.juros_totais,
        montante=resultado.montante_final,
    )

    return {
        "summary": {
            "principal": principal,
            "taxa_mensal": taxa_mensal,
            "prazo_meses": prazo_meses,
            "juros_totais": resultado.juros_totais,
            "montante_final": resultado.montante_final,
        },
        "tables": {"amortizacao": tabela},
        "charts": [
            {
                "x_label": "Período (meses)",
                "y_label": "Saldo (BRL)",
                "series": [
                    {
                        "label": "Saldo acumulado — simples",
                        "kind": "simples",
                        "points": pontos,
                    }
                ],
            }
        ],
        "interpretation": interpretacao,
        "alerts": [],
    }


def simular_juros_compostos(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
    aporte_mensal: Decimal | None = None,
) -> dict[str, Any]:
    """Orquestra um cálculo de juros compostos e devolve ``data`` canônico."""
    try:
        resultado = calcular_juros_compostos(
            principal,
            taxa_mensal,
            prazo_meses,
            aporte_mensal,
        )
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    tabela = [_periodo_composto_to_dict(r) for r in resultado.tabela]
    pontos = [r["saldo_final"] for r in tabela]

    interpretacao = _interpretacao_compostos(
        principal=principal,
        taxa_mensal=taxa_mensal,
        prazo=prazo_meses,
        aporte=resultado.aporte_mensal,
        juros_totais=resultado.juros_totais,
        montante=resultado.montante_final,
    )

    return {
        "summary": {
            "principal": principal,
            "taxa_mensal": taxa_mensal,
            "prazo_meses": prazo_meses,
            "aporte_mensal": resultado.aporte_mensal,
            "juros_totais": resultado.juros_totais,
            "total_aportado": resultado.total_aportado,
            "total_investido": resultado.total_investido,
            "montante_final": resultado.montante_final,
        },
        "tables": {"amortizacao": tabela},
        "charts": [
            {
                "x_label": "Período (meses)",
                "y_label": "Saldo (BRL)",
                "series": [
                    {
                        "label": "Saldo acumulado — compostos",
                        "kind": "composto",
                        "points": pontos,
                    }
                ],
            }
        ],
        "interpretation": interpretacao,
        "alerts": [],
    }


def comparar_juros(
    principal: Decimal,
    taxa_mensal: Decimal,
    prazo_meses: int,
) -> dict[str, Any]:
    """Orquestra uma comparação entre simples e compostos.

    Forma canônica do retorno:
        {
          "summary": {...},
          "tables": {"simple": [...], "compound": [...]},
          "charts": [ {series: [serie_simples, serie_composto]} ],
          "interpretation": {...},
          "alerts": []
        }

    Ou seja: ``tables`` é **um único campo** do envelope, contendo
    ambas as tabelas aninhadas sob chaves estáveis ``simple`` e
    ``compound``. Não há ``tables_simples``/``tables_compostos``.
    """
    try:
        simples = calcular_juros_simples(principal, taxa_mensal, prazo_meses)
        compostos = calcular_juros_compostos(
            principal,
            taxa_mensal,
            prazo_meses,
            None,
        )
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    tabela_simples = [_periodo_simples_to_dict(r) for r in simples.tabela]
    tabela_compostos = [_periodo_composto_to_dict(r) for r in compostos.tabela]

    pontos_simples = [r["saldo_final"] for r in tabela_simples]
    pontos_compostos = [r["saldo_final"] for r in tabela_compostos]

    diferenca = compostos.montante_final - simples.montante_final
    if simples.montante_final == 0:
        razao = "NaN"
    else:
        razao = str(
            (compostos.montante_final / simples.montante_final).quantize(
                Decimal("0.000001"),
                rounding=ROUND_HALF_EVEN,
            )
        )

    interpretacao = _interpretacao_comparar(
        simples.montante_final,
        compostos.montante_final,
        prazo_meses,
    )

    return {
        "summary": {
            "principal": principal,
            "taxa_mensal": taxa_mensal,
            "prazo_meses": prazo_meses,
            "montante_simples": simples.montante_final,
            "montante_composto": compostos.montante_final,
            "diferenca": _money(diferenca),
            "razao": razao,
        },
        "tables": {
            "simple": tabela_simples,
            "compound": tabela_compostos,
        },
        "charts": [
            {
                "x_label": "Período (meses)",
                "y_label": "Saldo (BRL)",
                "series": [
                    {
                        "label": "Simples",
                        "kind": "simples",
                        "points": pontos_simples,
                    },
                    {
                        "label": "Compostos",
                        "kind": "composto",
                        "points": pontos_compostos,
                    },
                ],
            }
        ],
        "interpretation": interpretacao,
        "alerts": [],
    }


class CalcularJurosService:
    """Fachada opcional caso a API queira injetar um objeto-serviço.

    Nenhum estado — é apenas açúcar semântico para compor com
    eventuais decoradores/instrumentações no futuro. Os endpoints
    atuais usam as funções livres acima.
    """

    @staticmethod
    def simples(
        principal: Decimal,
        taxa_mensal: Decimal,
        prazo_meses: int,
    ) -> dict[str, Any]:
        return simular_juros_simples(principal, taxa_mensal, prazo_meses)

    @staticmethod
    def compostos(
        principal: Decimal,
        taxa_mensal: Decimal,
        prazo_meses: int,
        aporte_mensal: Decimal | None = None,
    ) -> dict[str, Any]:
        return simular_juros_compostos(
            principal,
            taxa_mensal,
            prazo_meses,
            aporte_mensal,
        )

    @staticmethod
    def comparar(
        principal: Decimal,
        taxa_mensal: Decimal,
        prazo_meses: int,
    ) -> dict[str, Any]:
        return comparar_juros(principal, taxa_mensal, prazo_meses)
