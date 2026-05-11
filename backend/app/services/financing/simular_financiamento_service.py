"""Service de orquestracao da simulacao de financiamento imobiliario."""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from typing import TypeAlias, cast

from app.core.errors import ValidationError
from app.domain.financing import (
    DomainValidationError,
    FinanciamentoImobResultado,
    FinanciamentoPeriodo,
    calcular_financiamento_imobiliario,
)

JsonObject: TypeAlias = dict[str, object]


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def _raise_as_validation(exc: DomainValidationError) -> None:
    raise ValidationError(
        exc.message,
        errors=[{"code": exc.code, "field": exc.field, "message": exc.message}],
    ) from exc


def _periodo_to_dict(row: FinanciamentoPeriodo) -> JsonObject:
    return {
        "numero": row.numero,
        "saldo_inicial": row.saldo_inicial,
        "juros": row.juros,
        "amortizacao": row.amortizacao,
        "encargos": row.encargos,
        "prestacao": row.prestacao,
        "saldo_final": row.saldo_final,
    }


def _inputs_normalizados(resultado: FinanciamentoImobResultado) -> JsonObject:
    return {
        "valor_imovel": resultado.valor_imovel,
        "valor_entrada": resultado.valor_entrada,
        "valor_financiado": resultado.valor_financiado,
        "prazo_meses": resultado.prazo_meses,
        "taxa_juros_mensal": resultado.taxa_juros_mensal,
        "sistema_amortizacao": resultado.sistema_amortizacao,
    }


def _formula_parcela_price(resultado: FinanciamentoImobResultado) -> str:
    taxa = resultado.taxa_juros_mensal
    prazo = resultado.prazo_meses
    if taxa == Decimal("0"):
        return "parcela = valor_financiado / prazo_meses"
    return (
        "parcela = PV * i * (1 + i)^n / ((1 + i)^n - 1), "
        f"com PV={resultado.valor_financiado}, i={taxa} e n={prazo}"
    )


def _memoria_calculo(resultado: FinanciamentoImobResultado) -> JsonObject:
    primeira = resultado.parcelas[0]
    ultima = resultado.parcelas[-1]
    formula = (
        _formula_parcela_price(resultado)
        if resultado.sistema_amortizacao == "PRICE"
        else "amortizacao = valor_financiado / prazo_meses; juros = saldo_devedor * taxa"
    )
    return {
        "metodo": resultado.sistema_amortizacao,
        "entradas": _inputs_normalizados(resultado),
        "formula": formula,
        "variaveis": {
            "PV": resultado.valor_financiado,
            "i": resultado.taxa_juros_mensal,
            "n": resultado.prazo_meses,
        },
        "substituicao": (
            f"PV={resultado.valor_financiado}; i={resultado.taxa_juros_mensal}; "
            f"n={resultado.prazo_meses}; sistema={resultado.sistema_amortizacao}"
        ),
        "arredondamento": "Valores monetarios arredondados para centavos com ROUND_HALF_EVEN.",
        "primeira_parcela": _periodo_to_dict(primeira),
        "ultima_parcela": _periodo_to_dict(ultima),
        "custo_total": resultado.custo_total,
        "resultado_final": {
            "total_pago": resultado.total_pago,
            "total_juros": resultado.total_juros,
            "total_encargos": resultado.total_encargos,
            "saldo_final": ultima.saldo_final,
        },
    }


def _formulas_usadas(resultado: FinanciamentoImobResultado) -> list[JsonObject]:
    formulas: list[JsonObject] = [
        {
            "nome": "juros_do_periodo",
            "expressao": "juros = saldo_inicial * taxa_juros_mensal",
            "uso": "Calcula os juros de cada mes sobre o saldo devedor inicial.",
        },
        {
            "nome": "prestacao",
            "expressao": "prestacao = juros + amortizacao + encargos",
            "uso": "Mostra a composicao da parcela exibida ao usuario.",
        },
        {
            "nome": "custo_total",
            "expressao": "custo_total = total_juros + total_encargos",
            "uso": "Explica quanto custa financiar alem do valor amortizado.",
        },
    ]
    if resultado.sistema_amortizacao == "PRICE":
        formulas.append(
            {
                "nome": "parcela_price",
                "expressao": "PMT = PV * i * (1 + i)^n / ((1 + i)^n - 1)",
                "uso": "Calcula parcela constante no sistema PRICE.",
            }
        )
    else:
        formulas.append(
            {
                "nome": "amortizacao_sac",
                "expressao": "amortizacao = valor_financiado / prazo_meses",
                "uso": "Calcula amortizacao constante no sistema SAC.",
            }
        )
    return formulas


def _explicacoes(resultado: FinanciamentoImobResultado) -> list[str]:
    if resultado.sistema_amortizacao == "PRICE":
        sistema = (
            "No PRICE, a parcela sem encargos tende a ser constante; no inicio, "
            "uma fatia maior da parcela paga juros."
        )
    else:
        sistema = (
            "No SAC, a amortizacao e constante; por isso a parcela tende a cair ao longo do tempo."
        )
    return [
        sistema,
        "O custo total soma juros e encargos, sem confundir esse valor com o principal amortizado.",
        (
            "A tabela mostra cada mes do prazo informado, preservando saldo, "
            "juros, amortizacao e prestacao."
        ),
    ]


def _alertas() -> list[str]:
    return [
        (
            "Simulacao educacional: nao representa contrato, proposta bancaria "
            "ou aprovacao de credito."
        ),
        (
            "Taxas, seguros, tarifas, impostos, CET e regras de credito podem "
            "alterar o resultado real."
        ),
        (
            "O resultado depende dos dados informados pelo usuario e deve ser "
            "conferido antes de qualquer decisao."
        ),
    ]


def _fontes() -> list[JsonObject]:
    return [
        {
            "nome": "Banco Central do Brasil",
            "tipo": "referencia institucional",
            "observacao": (
                "Referencia conceitual sobre credito, CET e educacao financeira; "
                "sem integracao automatica neste item."
            ),
        },
        {
            "nome": "Formula financeira PRICE e metodo SAC",
            "tipo": "referencia matematica",
            "observacao": "Calculos executados localmente a partir das entradas do usuario.",
        },
    ]


def _limites() -> list[str]:
    return [
        "Nao ha consulta a API oficial externa neste Item 12.",
        (
            "A simulacao nao inclui avaliacao de credito, seguros reais, "
            "impostos cartoriais ou regras bancarias especificas."
        ),
        "O CET real pode diferir da taxa mensal informada.",
    ]


def _chart_data(resultado: FinanciamentoImobResultado) -> JsonObject:
    return {
        "saldo_devedor": [
            {"periodo": row.numero, "valor": row.saldo_final} for row in resultado.parcelas
        ],
        "prestacoes": [
            {"periodo": row.numero, "valor": row.prestacao} for row in resultado.parcelas
        ],
        "juros_amortizacao": [
            {
                "periodo": row.numero,
                "juros": row.juros,
                "amortizacao": row.amortizacao,
            }
            for row in resultado.parcelas
        ],
    }


def _resultado_to_dict(resultado: FinanciamentoImobResultado) -> JsonObject:
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
        "inputs_normalizados": _inputs_normalizados(resultado),
        "memoria_calculo": _memoria_calculo(resultado),
        "formulas_usadas": _formulas_usadas(resultado),
        "explicacoes_pedagogicas": _explicacoes(resultado),
        "alertas": _alertas(),
        "fontes": _fontes(),
        "limites": _limites(),
        "metadados_calculo": {
            "moeda": "BRL",
            "criterio_arredondamento": "ROUND_HALF_EVEN para centavos",
            "linhas_tabela": resultado.prazo_meses,
            "prazo_dinamico_respeitado": True,
            "contrato_educacional_api": "Item 7",
        },
        "mensagens_interface": [
            "Compare SAC e PRICE antes de decidir.",
            "Leia a memoria de calculo para entender a composicao da parcela.",
            "Confira fontes e limites antes de interpretar a simulacao.",
        ],
        "chart_data": _chart_data(resultado),
    }


def _decimal_from_summary(summary: object, key: str) -> Decimal:
    if not isinstance(summary, dict):
        raise TypeError("summary deve ser objeto")
    value = cast(JsonObject, summary)[key]
    if not isinstance(value, Decimal):
        raise TypeError(f"{key} deve ser Decimal")
    return value


def _comparacao_to_dict(price: JsonObject, sac: JsonObject) -> JsonObject:
    price_summary = price["summary"]
    sac_summary = sac["summary"]
    return {
        "diferenca_primeira_parcela": _money(
            _decimal_from_summary(sac_summary, "primeira_parcela")
            - _decimal_from_summary(price_summary, "primeira_parcela")
        ),
        "diferenca_ultima_parcela": _money(
            _decimal_from_summary(sac_summary, "ultima_parcela")
            - _decimal_from_summary(price_summary, "ultima_parcela")
        ),
        "diferenca_total_pago": _money(
            _decimal_from_summary(price_summary, "total_pago")
            - _decimal_from_summary(sac_summary, "total_pago")
        ),
        "diferenca_total_juros": _money(
            _decimal_from_summary(price_summary, "total_juros")
            - _decimal_from_summary(sac_summary, "total_juros")
        ),
        "comportamento_saldo_devedor": (
            "O SAC reduz o saldo devedor de forma linear; o PRICE reduz mais lentamente no inicio."
        ),
        "explicacao_pedagogica": (
            "SAC costuma comecar com parcela maior e custo total menor; PRICE suaviza a parcela "
            "inicial, mas pode acumular mais juros no prazo."
        ),
        "recomendacoes": [
            "Use SAC quando quiser reduzir juros totais e puder absorver parcela inicial maior.",
            "Use PRICE na comparacao quando previsibilidade de parcela for prioridade.",
        ],
    }


def comparar_financiamentos(
    valor_imovel: Decimal,
    valor_entrada: Decimal,
    prazo_meses: int,
    taxa_juros_mensal_percentual: Decimal,
    seguro_mensal: Decimal = Decimal("0.00"),
    tarifa_mensal: Decimal = Decimal("0.00"),
    custo_administrativo_mensal: Decimal = Decimal("0.00"),
) -> JsonObject:
    """Compara PRICE x SAC com os mesmos parametros e devolve ambos os resultados."""
    price = simular_financiamento_imobiliario(
        valor_imovel=valor_imovel,
        valor_entrada=valor_entrada,
        prazo_meses=prazo_meses,
        taxa_juros_mensal_percentual=taxa_juros_mensal_percentual,
        sistema_amortizacao="PRICE",
        seguro_mensal=seguro_mensal,
        tarifa_mensal=tarifa_mensal,
        custo_administrativo_mensal=custo_administrativo_mensal,
    )
    sac = simular_financiamento_imobiliario(
        valor_imovel=valor_imovel,
        valor_entrada=valor_entrada,
        prazo_meses=prazo_meses,
        taxa_juros_mensal_percentual=taxa_juros_mensal_percentual,
        sistema_amortizacao="SAC",
        seguro_mensal=seguro_mensal,
        tarifa_mensal=tarifa_mensal,
        custo_administrativo_mensal=custo_administrativo_mensal,
    )
    return {"price": price, "sac": sac, "comparacao": _comparacao_to_dict(price, sac)}


def simular_financiamento_imobiliario(
    valor_imovel: Decimal,
    valor_entrada: Decimal,
    prazo_meses: int,
    taxa_juros_mensal_percentual: Decimal,
    sistema_amortizacao: str,
    seguro_mensal: Decimal = Decimal("0.00"),
    tarifa_mensal: Decimal = Decimal("0.00"),
    custo_administrativo_mensal: Decimal = Decimal("0.00"),
) -> JsonObject:
    """Orquestra simulacao de financiamento imobiliario e devolve dict serializavel."""
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
        raise

    return _resultado_to_dict(resultado)
