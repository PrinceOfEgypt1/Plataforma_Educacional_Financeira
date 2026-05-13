"""Testes do adendo corretivo Item 13 — PEF.

Cobre todos os pontos do veredito de auditoria:
    IT13C-BE-01: MIP, DFI/DFC e taxa de admin separados no periodo
    IT13C-BE-02: encargo_mensal_total = prestacao_financeira + encargos
    IT13C-BE-03: prestacao e alias retrocompat de encargo_mensal_total
    IT13C-BE-04: componentes_cet separados corretamente (sem mistura)
    IT13C-BE-05: percentuais sobre valor_financiado E sobre total_pago
    IT13C-BE-06: taxas anuais sem arredondamento monetario (6 casas)
    IT13C-BE-07: encoding UTF-8 nos alertas, fontes e limites
    IT13C-BE-08: interpretacao_dinamica na comparacao
    IT13C-BE-09: saldo final = 0 (regressao)
    IT13C-BE-10: anatomia_encargo com percentuais granulares
"""

from __future__ import annotations

from decimal import Decimal
from typing import cast

import pytest

from app.domain.financing import calcular_financiamento_imobiliario
from app.domain.financing.real_estate import FinanciamentoImobResultado
from app.services.financing.simular_financiamento_service import (
    comparar_financiamentos,
    simular_financiamento_imobiliario,
)

_D = Decimal
_ZERO = _D("0.00")

ServiceResult = dict[str, object]
ComponenteCetDict = dict[str, object]


def _componentes(result: ServiceResult) -> list[ComponenteCetDict]:
    return cast(list[ComponenteCetDict], result["componentes_cet"])


def _str_list(result: ServiceResult, key: str) -> list[str]:
    return cast(list[str], result[key])


def _dict(result: ServiceResult, key: str) -> dict[str, object]:
    return cast(dict[str, object], result[key])


def _fontes(result: ServiceResult) -> list[dict[str, object]]:
    return cast(list[dict[str, object]], result["fontes"])


def _dom(
    *,
    pv: str = "300000.00",
    entrada: str = "60000.00",
    prazo: int = 120,
    taxa: str = "0.007",
    sistema: str = "PRICE",
    seguro: str = "0.00",
    tarifa: str = "0.00",
    admin: str = "0.00",
) -> FinanciamentoImobResultado:
    return calcular_financiamento_imobiliario(
        valor_imovel=_D(pv),
        valor_entrada=_D(entrada),
        prazo_meses=prazo,
        taxa_juros_mensal=_D(taxa),
        sistema_amortizacao=sistema,
        seguro_mensal=_D(seguro),
        tarifa_mensal=_D(tarifa),
        custo_administrativo_mensal=_D(admin),
    )


def _svc(
    *,
    pv: str = "300000.00",
    entrada: str = "60000.00",
    prazo: int = 120,
    taxa_pct: str = "0.7",
    sistema: str = "PRICE",
    seguro: str = "0.00",
    tarifa: str = "0.00",
    admin: str = "0.00",
) -> ServiceResult:
    return simular_financiamento_imobiliario(
        valor_imovel=_D(pv),
        valor_entrada=_D(entrada),
        prazo_meses=prazo,
        taxa_juros_mensal_percentual=_D(taxa_pct),
        sistema_amortizacao=sistema,
        seguro_mensal=_D(seguro),
        tarifa_mensal=_D(tarifa),
        custo_administrativo_mensal=_D(admin),
    )


# ── IT13C-BE-01: campos individuais separados no periodo ─────────────────────


@pytest.mark.unit
def test_it13c_be01_periodo_tem_seguro_tarifa_admin_separados() -> None:
    r = _dom(seguro="80.00", tarifa="25.00", admin="10.00")
    p = r.parcelas[0]
    assert p.seguro_mensal == _D("80.00")
    assert p.tarifa_mensal == _D("25.00")
    assert p.custo_admin_mensal == _D("10.00")


@pytest.mark.unit
def test_it13c_be01_encargos_e_soma_dos_tres() -> None:
    r = _dom(seguro="80.00", tarifa="25.00", admin="10.00")
    for p in r.parcelas:
        esperado = p.seguro_mensal + p.tarifa_mensal + p.custo_admin_mensal
        assert p.encargos == esperado, f"Período {p.numero}: encargos={p.encargos} ≠ {esperado}"


@pytest.mark.unit
def test_it13c_be01_sem_encargos_todos_zero() -> None:
    r = _dom()
    for p in r.parcelas:
        assert p.seguro_mensal == _ZERO
        assert p.tarifa_mensal == _ZERO
        assert p.custo_admin_mensal == _ZERO
        assert p.encargos == _ZERO


# ── IT13C-BE-02: encargo_mensal_total = prestacao_financeira + encargos ───────


@pytest.mark.unit
def test_it13c_be02_encargo_mensal_total_correto() -> None:
    r = _dom(seguro="80.00", tarifa="25.00", admin="10.00")
    for p in r.parcelas:
        esperado = p.prestacao_financeira + p.encargos
        assert p.encargo_mensal_total == esperado


@pytest.mark.unit
def test_it13c_be02_prestacao_financeira_e_juros_mais_amortizacao() -> None:
    r = _dom(seguro="80.00", tarifa="25.00")
    for p in r.parcelas:
        assert p.prestacao_financeira == p.juros + p.amortizacao


# ── IT13C-BE-03: prestacao como alias retrocompat ────────────────────────────


@pytest.mark.unit
def test_it13c_be03_prestacao_alias_encargo_mensal_total() -> None:
    r = _dom(seguro="80.00", tarifa="25.00")
    for p in r.parcelas:
        assert p.prestacao == p.encargo_mensal_total


@pytest.mark.unit
def test_it13c_be03_svc_periodo_row_tem_prestacao_igual_encargo_total() -> None:
    result = _svc(seguro="80.00", tarifa="25.00")
    for row in result["parcelas"]:
        assert row["prestacao"] == row["encargo_mensal_total"]
        assert _D(str(row["prestacao_financeira"])) < _D(str(row["encargo_mensal_total"]))


# ── IT13C-BE-04: componentes_cet separados corretamente ──────────────────────


@pytest.mark.unit
def test_it13c_be04_componentes_nao_misturados() -> None:
    result = _svc(seguro="80.00", tarifa="25.00")
    ids = {c["id"] for c in _componentes(result)}
    # Com seguro_mensal legado: id = seguros_agregados
    assert "seguros_agregados" in ids, "Seguro legado deve aparecer como seguros_agregados"
    assert "taxa_administracao" in ids, "Tarifa deve ter id taxa_administracao"
    # Amortização NÃO é custo — deve estar presente mas custo_total=False
    amort = next(c for c in _componentes(result) if c["id"] == "amortizacao")
    assert amort["entra_no_custo_total_educacional"] is False


@pytest.mark.unit
def test_it13c_be04_componentes_sem_base_operacao() -> None:
    """A base da operação (valor financiado) não deve aparecer nos componentes CET."""
    result = _svc()
    ids = {c["id"] for c in _componentes(result)}
    assert "valor_financiado" not in ids, "Valor financiado não é componente de custo do CET"


@pytest.mark.unit
def test_it13c_be04_sem_seguro_natureza_nao_calculado() -> None:
    result = _svc()  # sem seguro
    seg = next(c for c in _componentes(result) if c["id"] == "seguros_habitacionais")
    assert seg["natureza"] == "nao_calculado"


@pytest.mark.unit
def test_it13c_be04_com_seguro_natureza_informado() -> None:
    result = _svc(seguro="80.00")
    # seguro_mensal legado -> id = seguros_agregados
    seg = next(c for c in _componentes(result) if c["id"] == "seguros_agregados")
    assert seg["natureza"] == "informado"
    assert _D(str(seg["valor_total"])) > _ZERO


# ── IT13C-BE-05: percentuais sobre valor_financiado E sobre total_pago ───────


@pytest.mark.unit
def test_it13c_be05_dois_percentuais_por_componente() -> None:
    result = _svc(seguro="80.00", tarifa="25.00")
    for comp in _componentes(result):
        assert "pct_sobre_financiado" in comp, f"{comp['id']} sem pct_sobre_financiado"
        assert "pct_sobre_total_pago" in comp, f"{comp['id']} sem pct_sobre_total_pago"


@pytest.mark.unit
def test_it13c_be05_juros_pct_sobre_financiado_correto() -> None:
    result = _svc()
    juros_comp = next(c for c in _componentes(result) if c["id"] == "juros")
    vf = _D(str(result["summary"]["valor_financiado"]))
    tj = _D(str(result["summary"]["total_juros"]))
    esperado = (tj / vf * _D("100")).quantize(_D("0.01"))
    assert _D(str(juros_comp["pct_sobre_financiado"])) == esperado


# ── IT13C-BE-06: taxas anuais sem arredondamento monetario ───────────────────


@pytest.mark.unit
def test_it13c_be06_taxa_anual_nominal_seis_casas() -> None:
    result = _svc(taxa_pct="0.7")
    nominal = result["summary"]["taxa_juros_anual_nominal"]
    # 0.007 * 12 = 0.084 — deve ter 6 casas, não 2
    d = _D(str(nominal))
    assert d == _D("0.084000"), f"Esperado 0.084000, recebido {d}"


@pytest.mark.unit
def test_it13c_be06_taxa_efetiva_maior_que_nominal() -> None:
    result = _svc(taxa_pct="0.7")
    efetiva = _D(str(result["summary"]["taxa_juros_anual_efetiva"]))
    nominal = _D(str(result["summary"]["taxa_juros_anual_nominal"]))
    assert efetiva > nominal, "Taxa efetiva deve ser maior que nominal (juros compostos)"


@pytest.mark.unit
def test_it13c_be06_taxa_efetiva_formula_correta() -> None:
    """(1 + 0.007)^12 - 1 = 0.087312... com 6 casas."""
    result = _svc(taxa_pct="0.7")
    efetiva = _D(str(result["summary"]["taxa_juros_anual_efetiva"]))
    # (1.007)^12 - 1 calculado independentemente
    esperado = ((_D("1") + _D("0.007")) ** 12 - _D("1")).quantize(_D("0.000001"))
    assert efetiva == esperado, f"Efetiva {efetiva} ≠ esperado {esperado}"


# ── IT13C-BE-07: encoding UTF-8 ──────────────────────────────────────────────


@pytest.mark.unit
def test_it13c_be07_alertas_utf8_correto() -> None:
    result = _svc()
    texto = " ".join(result["alertas"])
    assert "não" in texto, "Alerta deve ter 'não' com acento"
    assert "bancária" in texto, "Alerta deve ter 'bancária'"
    assert "crédito" in texto, "Alerta deve ter 'crédito'"
    assert "nao representa" not in texto, "Não deve ter 'nao' sem acento"
    assert "Simulacao" not in texto, "Não deve ter 'Simulacao' sem acento"


@pytest.mark.unit
def test_it13c_be07_limites_utf8_correto() -> None:
    result = _svc()
    texto = " ".join(_str_list(result, "limites"))
    assert "Não" in texto or "não" in texto, "Limites devem ter acento"
    assert "Item 12" not in texto, "Item 12 não deve aparecer nos limites do Item 13"


@pytest.mark.unit
def test_it13c_be07_fontes_utf8_correto() -> None:
    result = _svc()
    for fonte in _fontes(result):
        obs = str(fonte.get("observacao", ""))
        # Não deve ter palavras sem acento que deveriam ter
        assert "Referencia" not in obs or "Referência" in obs or "referência" in obs


# ── IT13C-BE-08: interpretacao_dinamica na comparacao ────────────────────────


@pytest.mark.unit
def test_it13c_be08_comparacao_tem_interpretacao_dinamica() -> None:
    result = comparar_financiamentos(
        valor_imovel=_D("300000"),
        valor_entrada=_D("60000"),
        prazo_meses=120,
        taxa_juros_mensal_percentual=_D("0.7"),
    )
    comparacao = _dict(result, "comparacao")
    assert "interpretacao_dinamica" in comparacao
    texto = str(comparacao["interpretacao_dinamica"])
    assert len(texto) > 80, "Interpretação deve ser descritiva"
    assert "SAC" in texto


@pytest.mark.unit
def test_it13c_be08_comparacao_tem_campos_encargo() -> None:
    result = comparar_financiamentos(
        valor_imovel=_D("300000"),
        valor_entrada=_D("60000"),
        prazo_meses=120,
        taxa_juros_mensal_percentual=_D("0.7"),
    )
    comp = _dict(result, "comparacao")
    assert "diferenca_primeiro_encargo_mensal" in comp
    assert "diferenca_primeira_prestacao_financeira" in comp
    assert "diferenca_ultima_prestacao_financeira" in comp


# ── IT13C-BE-09: saldo final = 0 (regressão) ─────────────────────────────────


@pytest.mark.unit
def test_it13c_be09_saldo_final_zero_price() -> None:
    r = _dom(sistema="PRICE")
    assert r.parcelas[-1].saldo_final == _ZERO


@pytest.mark.unit
def test_it13c_be09_saldo_final_zero_sac() -> None:
    r = _dom(sistema="SAC")
    assert r.parcelas[-1].saldo_final == _ZERO


# ── IT13C-BE-10: anatomia_encargo com percentuais granulares ─────────────────


@pytest.mark.unit
def test_it13c_be10_anatomia_presente_no_service() -> None:
    result = _svc(seguro="80.00", tarifa="25.00")
    assert "anatomia_encargo" in result
    a = result["anatomia_encargo"]
    # Campos granulares
    for campo in [
        "seguro_mensal",
        "tarifa_mensal",
        "custo_admin_mensal",
        "prestacao_financeira",
        "encargo_mensal_total",
        "pct_seguro",
        "pct_tarifa",
        "pct_prestacao_financeira",
    ]:
        assert campo in a, f"anatomia_encargo sem campo: {campo}"


@pytest.mark.unit
def test_it13c_be10_anatomia_pct_soma_100() -> None:
    result = _svc(seguro="80.00", tarifa="25.00")
    a = result["anatomia_encargo"]
    soma = (
        _D(str(a["pct_amortizacao"]))
        + _D(str(a["pct_juros"]))
        + _D(str(a["pct_seguro"]))
        + _D(str(a["pct_tarifa"]))
        + _D(str(a["pct_custo_admin"]))
    )
    assert abs(soma - _D("100.00")) <= _D("1.00"), f"Percentuais somam {soma}, esperado ~100"


@pytest.mark.unit
def test_it13c_be10_anatomia_sem_encargos_pct_encargos_zero() -> None:
    result = _svc()  # sem encargos
    a = result["anatomia_encargo"]
    assert _D(str(a["pct_seguro"])) == _ZERO
    assert _D(str(a["pct_tarifa"])) == _ZERO
    assert _D(str(a["pct_encargos"])) == _ZERO
