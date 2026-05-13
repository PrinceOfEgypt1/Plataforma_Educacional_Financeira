"""Service de orquestração da simulação de financiamento imobiliario."""

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
        "prestacao_financeira": row.prestacao_financeira,
        "seguro_mensal": row.seguro_mensal,
        "tarifa_mensal": row.tarifa_mensal,
        "custo_admin_mensal": row.custo_admin_mensal,
        "encargos": row.encargos,
        "encargo_mensal_total": row.encargo_mensal_total,
        "prestacao": row.encargo_mensal_total,  # retrocompat
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
            "uso": "Mostra a composição da parcela exibida ao usuário.",
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
            "Simulação educacional: não representa contrato, proposta bancária "
            "ou aprovação de crédito."
        ),
        (
            "Taxas, seguros, tarifas, impostos, CET e regras de crédito podem "
            "alterar o resultado real."
        ),
        (
            "O resultado depende dos dados informados pelo usuário e deve ser "
            "conferido antes de qualquer decisão."
        ),
        "Solicite o CET oficial à instituição financeira antes de contratar.",
        (
            "Os seguros informados (seguro_mensal) correspondem ao MIP + DFI "
            "de forma agregada. Valores reais variam por idade, banco e imóvel."
        ),
    ]


def _anatomia_encargo(resultado: FinanciamentoImobResultado) -> JsonObject:
    """Decompoe o encargo mensal do primeiro periodo com MIP/DFI separados.

    Taxa administrativa nunca entra em seguros_total.
    Quando apenas seguro_mensal legado: seguros_nao_discriminados=True,
    mip/dfi ficam zero e a UI exibe "nao discriminado na entrada".
    """
    p = resultado.parcelas[0]
    enc = p.encargo_mensal_total
    cem = Decimal("100")
    zero = Decimal("0.00")

    def _pct(v: Decimal) -> Decimal:
        if enc == zero:
            return zero
        return (v / enc * cem).quantize(Decimal("0.01"))

    return {
        "amortizacao": p.amortizacao,
        "juros": p.juros,
        "prestacao_financeira": p.prestacao_financeira,
        "mip_mensal": p.mip_mensal,
        "dfi_dfc_mensal": p.dfi_dfc_mensal,
        "seguros_total": p.seguro_mensal,
        "seguros_nao_discriminados": p.seguros_nao_discriminados,
        "taxa_administracao_mensal": p.taxa_administracao_mensal,
        "custo_admin_mensal": p.custo_admin_mensal,
        "componentes_acessorios": p.encargos,
        "encargo_mensal_total": enc,
        # Aliases legados
        "seguro_mensal": p.seguro_mensal,
        "tarifa_mensal": p.tarifa_mensal,
        "encargos": p.encargos,
        # Percentuais
        "pct_amortizacao": _pct(p.amortizacao),
        "pct_juros": _pct(p.juros),
        "pct_prestacao_financeira": _pct(p.prestacao_financeira),
        "pct_mip": _pct(p.mip_mensal),
        "pct_dfi_dfc": _pct(p.dfi_dfc_mensal),
        "pct_seguros": _pct(p.seguro_mensal),
        "pct_taxa_administracao": _pct(p.taxa_administracao_mensal),
        "pct_custo_admin": _pct(p.custo_admin_mensal),
        "pct_encargos": _pct(p.encargos),
        # Aliases legados
        "pct_seguro": _pct(p.seguro_mensal),
        "pct_tarifa": _pct(p.taxa_administracao_mensal),
    }


def _componentes_cet(resultado: FinanciamentoImobResultado) -> list[JsonObject]:
    """CET demonstrativo com categorias pedagogicas.

    Categorias: base_operacao | componente_encargo | componente_cet |
                custo_inicial | totalizador_indicador

    Amortizacao: componente_encargo, NAO e custo do CET.
    Valor financiado: nao aparece como custo.
    Total pago: aparece como totalizador, nao como componente.
    Percentuais sobre tres bases: financiado, total_pago, custo_financeiro_total.
    Divisao por zero evitada em todos os calculos.
    """
    vf = resultado.valor_financiado
    tp = resultado.total_pago
    cft = resultado.custo_financeiro_total
    zero = Decimal("0.00")

    def _pct_vf(v: Decimal) -> Decimal:
        return _money((v / vf * Decimal("100")).quantize(Decimal("0.01"))) if vf > zero else zero

    def _pct_tp(v: Decimal) -> Decimal:
        return _money((v / tp * Decimal("100")).quantize(Decimal("0.01"))) if tp > zero else zero

    def _pct_cft(v: Decimal) -> Decimal:
        return _money((v / cft * Decimal("100")).quantize(Decimal("0.01"))) if cft > zero else zero

    def _c(
        id_: str,
        nome: str,
        natureza: str,
        categoria: str,
        valor_total: Decimal,
        valor_mensal: Decimal,
        formula: str,
        explicacao: str,
        entra_enc: bool,
        entra_cet: bool,
        usa_cft: bool,
    ) -> JsonObject:
        return {
            "id": id_,
            "nome": nome,
            "natureza": natureza,
            "categoria": categoria,
            "valor_total": valor_total,
            "valor_mensal_referencia": valor_mensal,
            "pct_sobre_financiado": _pct_vf(valor_total),
            "pct_sobre_total_pago": _pct_tp(valor_total),
            "pct_sobre_custo_financeiro_total": _pct_cft(valor_total) if usa_cft else zero,
            "entra_no_encargo_mensal": entra_enc,
            "entra_no_custo_total_educacional": entra_cet,
            "formula": formula,
            "explicacao": explicacao,
        }

    p0 = resultado.parcelas[0]
    tem_mip = resultado.total_mip > zero
    tem_dfi = resultado.total_dfi_dfc > zero
    tem_seguro_legado = not tem_mip and not tem_dfi and resultado.total_seguros > zero
    tem_tarifa = resultado.total_tarifas > zero
    tem_custo_admin = resultado.total_custo_admin > zero
    sistema = resultado.sistema_amortizacao

    out: list[JsonObject] = []

    # ── Amortizacao: encargo, NAO custo ──────────────────────────────────
    out.append(
        _c(
            "amortizacao",
            "Amortização acumulada",
            "calculado",
            "componente_encargo",
            resultado.total_amortizado,
            p0.amortizacao,
            "A = PV/n (SAC)" if sistema == "SAC" else "A_t = PMT − J_t (PRICE)",
            "Redução do saldo devedor. Não é custo — é devolução do principal emprestado.",
            True,
            False,
            False,
        )
    )

    # ── Juros: custo principal ────────────────────────────────────────────
    out.append(
        _c(
            "juros",
            "Juros acumulados",
            "calculado",
            "componente_cet",
            resultado.total_juros,
            p0.juros,
            "J_t = saldo_devedor_t × taxa_mensal",
            "Custo financeiro do crédito. Maior no início, decresce com o saldo devedor.",
            True,
            True,
            True,
        )
    )

    # ── Seguros: MIP individual ───────────────────────────────────────────
    if tem_mip:
        out.append(
            _c(
                "mip",
                "MIP — Seguro de Morte e Invalidez Permanente",
                "informado",
                "componente_cet",
                resultado.total_mip,
                p0.mip_mensal,
                "mip_mensal × prazo_meses",
                "Seguro de Morte e Invalidez Permanente, informado individualmente. "
                "A proposta pode incluir este seguro conforme a modalidade "
                "e a operação contratada. Não é taxa de administração.",
                True,
                True,
                True,
            )
        )

    # ── Seguros: DFI/DFC individual ───────────────────────────────────────
    if tem_dfi:
        out.append(
            _c(
                "dfi_dfc",
                "DFI/DFC — Seguro de Danos Físicos ao Imóvel",
                "informado",
                "componente_cet",
                resultado.total_dfi_dfc,
                p0.dfi_dfc_mensal,
                "dfi_dfc_mensal × prazo_meses",
                "Seguro de Danos Físicos ao Imóvel ou à Construção, informado individualmente. "
                "Não é taxa de administração.",
                True,
                True,
                True,
            )
        )

    # ── Seguros: legado agregado ──────────────────────────────────────────
    if tem_seguro_legado:
        out.append(
            _c(
                "seguros_agregados",
                "Seguros habitacionais (MIP + DFI/DFC — não discriminados na entrada)",
                "informado",
                "componente_cet",
                resultado.total_seguros,
                p0.seguro_mensal,
                "seguro_mensal × prazo_meses",
                "Seguros informados de forma agregada. "
                "Para separação individual, informe mip_mensal e dfi_dfc_mensal. "
                "A proposta pode incluir estes seguros conforme a modalidade contratada.",
                True,
                True,
                True,
            )
        )

    # ── Seguros: nao informados ───────────────────────────────────────────
    if not tem_mip and not tem_dfi and not tem_seguro_legado:
        out.append(
            _c(
                "seguros_habitacionais",
                "Seguros habitacionais (MIP e DFI/DFC)",
                "nao_calculado",
                "componente_cet",
                zero,
                zero,
                "Não informado nesta simulação",
                "A proposta pode incluir seguros como MIP e DFI/DFC conforme a modalidade, "
                "a operação contratada e a regulamentação aplicável. "
                "Informe nos campos mip_mensal e dfi_dfc_mensal.",
                False,
                True,
                False,
            )
        )

    # ── Taxa de administracao: NAO e seguro ───────────────────────────────
    if tem_tarifa:
        out.append(
            _c(
                "taxa_administracao",
                "Taxa de administração do contrato",
                "informado",
                "componente_cet",
                resultado.total_tarifas,
                p0.taxa_administracao_mensal,
                "taxa_administracao_mensal × prazo_meses",
                "Taxa de administração mensal. Não é seguro. "
                "Não compõe o total de seguros. Nem todas as propostas incluem esta cobrança.",
                True,
                True,
                True,
            )
        )

    if tem_custo_admin:
        out.append(
            _c(
                "outros_custos",
                "Outros custos mensais",
                "informado",
                "componente_cet",
                resultado.total_custo_admin,
                p0.custo_admin_mensal,
                "custo_admin_mensal × prazo_meses",
                "Outros custos mensais informados na simulação.",
                True,
                True,
                True,
            )
        )

    # ── IOF ───────────────────────────────────────────────────────────────
    out.append(
        _c(
            "iof",
            "IOF",
            "nao_calculado",
            "componente_cet",
            zero,
            zero,
            "Não calculado nesta simulação",
            "Pode existir dependendo da modalidade. Não modelado nesta simulação educacional.",
            False,
            True,
            False,
        )
    )

    # ── Custos iniciais: alerta, sem percentuais fixos ────────────────────
    out.append(
        _c(
            "custos_contratacao",
            "Custos de contratação (ITBI, cartório, registro, avaliação)",
            "alerta",
            "custo_inicial",
            zero,
            zero,
            "Fora do escopo desta simulação",
            "Custos como ITBI, cartório, registro, avaliação do imóvel e contratação "
            "podem existir e variam conforme município, estado, instituição financeira "
            "e características da operação. "
            "Verifique na proposta formal e nos documentos oficiais.",
            False,
            False,
            False,
        )
    )

    # ── Totalizadores ─────────────────────────────────────────────────────
    out.append(
        _c(
            "custo_financeiro_total",
            "Custo financeiro total",
            "calculado",
            "totalizador_indicador",
            resultado.custo_financeiro_total,
            zero,
            "total_pago − valor_financiado",
            "Tudo pago acima do principal emprestado. Indicador derivado.",
            False,
            True,
            False,
        )
    )

    out.append(
        _c(
            "total_pago",
            "Total pago",
            "calculado",
            "totalizador_indicador",
            resultado.total_pago,
            zero,
            "∑ encargo_mensal_total_t",
            "Soma de todos os encargos mensais. Totalizador — não é componente de si mesmo.",
            False,
            True,
            False,
        )
    )

    return out


def _fontes() -> list[JsonObject]:
    return [
        {
            "nome": "Banco Central do Brasil",
            "tipo": "referência institucional",
            "observacao": (
                "Referência sobre crédito imobiliário e educação financeira. "
                "Sem integração automática neste item."
            ),
        },
        {
            "nome": "SUSEP — Superintendência de Seguros Privados",
            "tipo": "referência regulatória",
            "observacao": (
                "Órgão regulador dos seguros habitacionais MIP e DFI. "
                "Valores reais de prêmio variam por banco, faixa etária e imóvel."
            ),
        },
        {
            "nome": "Fórmulas PRICE e SAC",
            "tipo": "referência matemática",
            "observacao": (
                "Cálculos executados localmente com Decimal de alta precisão "
                "e arredondamento ROUND_HALF_EVEN (padrão bancário)."
            ),
        },
    ]


def _limites() -> list[str]:
    return [
        "Não há consulta a API oficial externa neste Item 13.",
        (
            "A simulação não inclui avaliação de crédito, seguros reais calculados "
            "individualmente, impostos cartoriais ou regras bancárias específicas."
        ),
        "O CET real pode diferir da taxa mensal informada.",
        (
            "Taxas anuais exibidas são derivadas matematicamente da taxa mensal "
            "informada. Não representam a taxa anual do contrato real."
        ),
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
            "taxa_juros_anual_nominal": resultado.taxa_juros_anual_nominal,
            "taxa_juros_anual_efetiva": resultado.taxa_juros_anual_efetiva,
            "primeira_prestacao_financeira": resultado.primeira_prestacao_financeira,
            "ultima_prestacao_financeira": resultado.ultima_prestacao_financeira,
            "primeiro_encargo_mensal_total": resultado.primeiro_encargo_mensal_total,
            "ultimo_encargo_mensal_total": resultado.ultimo_encargo_mensal_total,
            "total_pago": resultado.total_pago,
            "total_juros": resultado.total_juros,
            "total_amortizado": resultado.total_amortizado,
            "total_mip": resultado.total_mip,
            "total_dfi_dfc": resultado.total_dfi_dfc,
            "total_seguros": resultado.total_seguros,
            "total_tarifas": resultado.total_tarifas,
            "total_custo_admin": resultado.total_custo_admin,
            "seguros_nao_discriminados": resultado.seguros_nao_discriminados,
            "total_encargos": resultado.total_encargos,
            "custo_total": resultado.custo_total,
            "custo_financeiro_total": resultado.custo_financeiro_total,
            "primeira_parcela": resultado.primeira_parcela,
            "ultima_parcela": resultado.ultima_parcela,
        },
        "parcelas": [_periodo_to_dict(p) for p in resultado.parcelas],
        "inputs_normalizados": _inputs_normalizados(resultado),
        "anatomia_encargo": _anatomia_encargo(resultado),
        "componentes_cet": _componentes_cet(resultado),
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
            "contrato_educacional_api": "Item 13",
        },
        "mensagens_interface": [
            "Compare SAC e PRICE antes de decidir.",
            "Leia a memoria de calculo para entender a composicao da parcela.",
            "Confira fontes e limites antes de interpretar a simulação.",
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

    dif_pf_1 = _money(
        _decimal_from_summary(sac_summary, "primeira_prestacao_financeira")
        - _decimal_from_summary(price_summary, "primeira_prestacao_financeira")
    )
    dif_pf_u = _money(
        _decimal_from_summary(sac_summary, "ultima_prestacao_financeira")
        - _decimal_from_summary(price_summary, "ultima_prestacao_financeira")
    )
    dif_enc_1 = _money(
        _decimal_from_summary(sac_summary, "primeiro_encargo_mensal_total")
        - _decimal_from_summary(price_summary, "primeiro_encargo_mensal_total")
    )
    dif_enc_u = _money(
        _decimal_from_summary(sac_summary, "ultimo_encargo_mensal_total")
        - _decimal_from_summary(price_summary, "ultimo_encargo_mensal_total")
    )
    dif_total_pago = _money(
        _decimal_from_summary(price_summary, "total_pago")
        - _decimal_from_summary(sac_summary, "total_pago")
    )
    dif_total_juros = _money(
        _decimal_from_summary(price_summary, "total_juros")
        - _decimal_from_summary(sac_summary, "total_juros")
    )

    price_total_juros = _decimal_from_summary(price_summary, "total_juros")
    pct_economia = (
        _money((dif_total_juros / price_total_juros) * Decimal("100"))
        if price_total_juros > Decimal("0")
        else Decimal("0.00")
    )

    sac_enc_1 = _decimal_from_summary(sac_summary, "primeiro_encargo_mensal_total")
    price_enc_1 = _decimal_from_summary(price_summary, "primeiro_encargo_mensal_total")

    interpretacao = (
        f"Neste cenário, o SAC reduz o total de juros em R\u00a0{dif_total_juros} "
        f"({pct_economia}% a menos que o PRICE), mas inicia com encargo mensal "
        f"R\u00a0{abs(dif_enc_1)} maior "
        f"(R\u00a0{sac_enc_1} vs R\u00a0{price_enc_1}). "
        "Se a renda comporta o encargo inicial do SAC, "
        "a economia no longo prazo tende a compensar. "
        "Solicite o CET oficial de cada modalidade antes de decidir."
    )

    return {
        "diferenca_primeira_prestacao_financeira": dif_pf_1,
        "diferenca_ultima_prestacao_financeira": dif_pf_u,
        "diferenca_primeiro_encargo_mensal": dif_enc_1,
        "diferenca_ultimo_encargo_mensal": dif_enc_u,
        "diferenca_total_pago": dif_total_pago,
        "diferenca_total_juros": dif_total_juros,
        # retrocompat
        "diferenca_primeira_parcela": dif_enc_1,
        "diferenca_ultima_parcela": dif_enc_u,
        "comportamento_saldo_devedor": (
            "O SAC reduz o saldo devedor de forma linear; o PRICE reduz mais lentamente no início."
        ),
        "explicacao_pedagogica": (
            "SAC costuma começar com encargo mensal maior e custo total menor; "
            "PRICE suaviza o encargo inicial, mas pode acumular mais juros no prazo."
        ),
        "interpretacao_dinamica": interpretacao,
        "recomendacoes": [
            "Use SAC quando quiser reduzir juros totais e puder absorver encargo inicial maior.",
            "Use PRICE quando previsibilidade do encargo mensal for prioridade.",
            "Solicite o CET oficial de cada modalidade à instituição financeira antes de decidir.",
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
    mip_mensal: Decimal = Decimal("0.00"),
    dfi_dfc_mensal: Decimal = Decimal("0.00"),
    taxa_administracao_mensal: Decimal = Decimal("0.00"),
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
        mip_mensal=mip_mensal,
        dfi_dfc_mensal=dfi_dfc_mensal,
        taxa_administracao_mensal=taxa_administracao_mensal,
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
        mip_mensal=mip_mensal,
        dfi_dfc_mensal=dfi_dfc_mensal,
        taxa_administracao_mensal=taxa_administracao_mensal,
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
    mip_mensal: Decimal = Decimal("0.00"),
    dfi_dfc_mensal: Decimal = Decimal("0.00"),
    taxa_administracao_mensal: Decimal = Decimal("0.00"),
) -> JsonObject:
    """Orquestra simulação de financiamento imobiliário e devolve dict serializavel."""
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
            mip_mensal=mip_mensal,
            dfi_dfc_mensal=dfi_dfc_mensal,
            taxa_administracao_mensal=taxa_administracao_mensal,
        )
    except DomainValidationError as exc:
        _raise_as_validation(exc)
        raise

    return _resultado_to_dict(resultado)
