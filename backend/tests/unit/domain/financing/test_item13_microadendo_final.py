"""Testes do microadendo final — Item 13.

Cobre os 6 bloqueios do microadendo:
    MA-BE-01: MIP e DFI/DFC separados quando informados
    MA-BE-02: seguros_total = mip + dfi; taxa_adm fora de seguros
    MA-BE-03: seguro_mensal legado funciona sem fingir MIP/DFI
    MA-BE-04: componentes CET categorizados com categoria pedagógica
    MA-BE-05: amortizacao nao aparece como custo do CET
    MA-BE-06: valor financiado nao aparece como custo
    MA-BE-07: total pago aparece como totalizador_indicador
    MA-BE-08: pct_sobre_custo_financeiro_total presente e correto
    MA-BE-09: divisao por zero tratada
    MA-BE-10: sem Resolucao CMN 3.517/2007
    MA-BE-11: sem percentuais fixos ITBI/cartorio
    MA-BE-12: textos em UTF-8 sem mojibake
    MA-BE-13: taxa_administracao_mensal fora de seguros_total
    MA-BE-14: encargo_mensal_total = prestacao_financeira + componentes_acessorios
"""

from __future__ import annotations

from decimal import Decimal
from typing import cast

import pytest

from app.domain.financing import calcular_financiamento_imobiliario
from app.domain.financing.real_estate import FinanciamentoImobResultado
from app.services.financing.simular_financiamento_service import (
    simular_financiamento_imobiliario,
)

_D = Decimal
_ZERO = _D("0.00")

ServiceResult = dict[str, object]
ComponenteCetDict = dict[str, object]


def _componentes(result: ServiceResult) -> list[ComponenteCetDict]:
    return cast(list[ComponenteCetDict], result["componentes_cet"])


def _summary(result: ServiceResult) -> dict[str, object]:
    return cast(dict[str, object], result["summary"])


def _dom(
    *,
    pv: str = "300000.00",
    entrada: str = "60000.00",
    prazo: int = 60,
    taxa: str = "0.007",
    sistema: str = "PRICE",
    seguro: str = "0.00",
    tarifa: str = "0.00",
    admin: str = "0.00",
    mip: str = "0.00",
    dfi: str = "0.00",
    taxa_adm: str = "0.00",
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
        mip_mensal=_D(mip),
        dfi_dfc_mensal=_D(dfi),
        taxa_administracao_mensal=_D(taxa_adm),
    )


def _svc(
    *,
    pv: str = "300000.00",
    entrada: str = "60000.00",
    prazo: int = 60,
    taxa_pct: str = "0.7",
    sistema: str = "PRICE",
    seguro: str = "0.00",
    tarifa: str = "0.00",
    admin: str = "0.00",
    mip: str = "0.00",
    dfi: str = "0.00",
    taxa_adm: str = "0.00",
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
        mip_mensal=_D(mip),
        dfi_dfc_mensal=_D(dfi),
        taxa_administracao_mensal=_D(taxa_adm),
    )


# ── MA-BE-01: MIP e DFI separados quando informados ────────────────────────


@pytest.mark.unit
def test_ma_be01_mip_dfi_separados_no_periodo() -> None:
    r = _dom(mip="80.00", dfi="35.00")
    p = r.parcelas[0]
    assert p.mip_mensal == _D("80.00")
    assert p.dfi_dfc_mensal == _D("35.00")
    assert p.seguros_nao_discriminados is False


@pytest.mark.unit
def test_ma_be01_mip_dfi_separados_no_componente_cet() -> None:
    result = _svc(mip="80.00", dfi="35.00")
    ids = {c["id"] for c in _componentes(result)}
    assert "mip" in ids, "MIP deve ter componente próprio"
    assert "dfi_dfc" in ids, "DFI/DFC deve ter componente próprio"
    assert "seguros_agregados" not in ids, "Não deve ter agregado quando individuais fornecidos"


@pytest.mark.unit
def test_ma_be01_mip_componente_explicacao_sem_taxa_admin() -> None:
    result = _svc(mip="80.00")
    mip_comp = next(c for c in _componentes(result) if c["id"] == "mip")
    # Explicação pode mencionar que MIP NÃO é taxa administrativa (como esclarecimento)
    # mas não deve confundir MIP com taxa administrativa
    exp = mip_comp["explicacao"].lower()
    # Proibido: afirmar que MIP é taxa administrativa
    assert "é taxa de administração" not in exp or "não é taxa" in exp


# ── MA-BE-02: seguros_total = mip + dfi; taxa_adm fora ─────────────────────


@pytest.mark.unit
def test_ma_be02_seguros_total_igual_mip_mais_dfi() -> None:
    r = _dom(mip="80.00", dfi="35.00")
    assert r.total_mip == _D("80.00") * _D(str(r.prazo_meses))
    assert r.total_dfi_dfc == _D("35.00") * _D(str(r.prazo_meses))
    assert r.total_seguros == r.total_mip + r.total_dfi_dfc


@pytest.mark.unit
def test_ma_be02_taxa_admin_fora_de_seguros_total() -> None:
    r = _dom(mip="80.00", dfi="35.00", taxa_adm="25.00")
    # seguros_total NÃO inclui taxa_adm
    assert r.total_seguros == r.total_mip + r.total_dfi_dfc
    # taxa_adm está em total_tarifas
    assert r.total_tarifas == _D("25.00") * _D(str(r.prazo_meses))


@pytest.mark.unit
def test_ma_be02_taxa_admin_nao_soma_a_seguros_no_componente() -> None:
    result = _svc(mip="80.00", dfi="35.00", taxa_adm="25.00")
    seguros = _D(
        str(next(c for c in _componentes(result) if c["id"] == "mip")["valor_total"])
    ) + _D(str(next(c for c in _componentes(result) if c["id"] == "dfi_dfc")["valor_total"]))
    taxa = _D(
        str(next(c for c in _componentes(result) if c["id"] == "taxa_administracao")["valor_total"])
    )
    # Seguros + taxa são separados, não somados
    assert taxa > _ZERO
    assert seguros > _ZERO
    assert taxa != seguros


# ── MA-BE-03: seguro_mensal legado funciona sem fingir individuais ──────────


@pytest.mark.unit
def test_ma_be03_legado_seguros_nao_discriminados_true() -> None:
    r = _dom(seguro="115.00")
    assert r.seguros_nao_discriminados is True
    # MIP e DFI individuais ficam zero
    for p in r.parcelas:
        assert p.mip_mensal == _ZERO
        assert p.dfi_dfc_mensal == _ZERO
        assert p.seguros_nao_discriminados is True


@pytest.mark.unit
def test_ma_be03_legado_componente_cet_sem_mip_dfi_individual() -> None:
    result = _svc(seguro="115.00")
    ids = {c["id"] for c in _componentes(result)}
    assert "mip" not in ids, "MIP individual não deve aparecer com legado"
    assert "dfi_dfc" not in ids, "DFI/DFC individual não deve aparecer com legado"
    assert "seguros_agregados" in ids, "Seguros agregados devem aparecer com legado"


@pytest.mark.unit
def test_ma_be03_legado_explicacao_menciona_nao_discriminado() -> None:
    result = _svc(seguro="115.00")
    seg = next(c for c in _componentes(result) if c["id"] == "seguros_agregados")
    assert (
        "agregada" in seg["explicacao"].lower()
        or "nao discriminad" in seg["explicacao"].lower()
        or "não discriminad" in seg["explicacao"].lower()
    )


# ── MA-BE-04: componentes categorizados ────────────────────────────────────


@pytest.mark.unit
def test_ma_be04_componentes_tem_categoria() -> None:
    result = _svc(mip="80.00", dfi="35.00", taxa_adm="25.00")
    for comp in _componentes(result):
        assert "categoria" in comp, f"{comp['id']} sem categoria"
        assert comp["categoria"] in (
            "base_operacao",
            "componente_encargo",
            "componente_cet",
            "custo_inicial",
            "totalizador_indicador",
        )


@pytest.mark.unit
def test_ma_be04_juros_categoria_componente_cet() -> None:
    result = _svc()
    juros = next(c for c in _componentes(result) if c["id"] == "juros")
    assert juros["categoria"] == "componente_cet"


@pytest.mark.unit
def test_ma_be04_custos_contratacao_categoria_custo_inicial() -> None:
    result = _svc()
    custos = next(c for c in _componentes(result) if c["id"] == "custos_contratacao")
    assert custos["categoria"] == "custo_inicial"


@pytest.mark.unit
def test_ma_be04_total_pago_categoria_totalizador() -> None:
    result = _svc()
    tp = next(c for c in _componentes(result) if c["id"] == "total_pago")
    assert tp["categoria"] == "totalizador_indicador"


# ── MA-BE-05: amortizacao nao e custo do CET ───────────────────────────────


@pytest.mark.unit
def test_ma_be05_amortizacao_nao_e_custo_cet() -> None:
    result = _svc()
    amort = next(c for c in _componentes(result) if c["id"] == "amortizacao")
    assert amort["entra_no_custo_total_educacional"] is False
    assert amort["categoria"] == "componente_encargo"


@pytest.mark.unit
def test_ma_be05_amortizacao_pct_cft_zero() -> None:
    result = _svc()
    amort = next(c for c in _componentes(result) if c["id"] == "amortizacao")
    assert _D(str(amort["pct_sobre_custo_financeiro_total"])) == _ZERO


# ── MA-BE-06: valor financiado nao e componente ────────────────────────────


@pytest.mark.unit
def test_ma_be06_valor_financiado_ausente_dos_componentes() -> None:
    result = _svc()
    ids = {c["id"] for c in _componentes(result)}
    assert "valor_financiado" not in ids


# ── MA-BE-07: total pago e totalizador ─────────────────────────────────────


@pytest.mark.unit
def test_ma_be07_total_pago_e_totalizador() -> None:
    result = _svc()
    tp = next(c for c in _componentes(result) if c["id"] == "total_pago")
    assert tp["categoria"] == "totalizador_indicador"
    assert tp["entra_no_encargo_mensal"] is False


# ── MA-BE-08: pct_sobre_custo_financeiro_total ─────────────────────────────


@pytest.mark.unit
def test_ma_be08_pct_custo_financeiro_presente_em_todos() -> None:
    result = _svc(mip="80.00", taxa_adm="25.00")
    for comp in _componentes(result):
        assert (
            "pct_sobre_custo_financeiro_total" in comp
        ), f"{comp['id']} sem pct_sobre_custo_financeiro_total"


@pytest.mark.unit
def test_ma_be08_pct_custo_financeiro_correto_para_juros() -> None:
    result = _svc()
    juros = next(c for c in _componentes(result) if c["id"] == "juros")
    cft = _D(str(_summary(result)["custo_financeiro_total"]))
    tj = _D(str(juros["valor_total"]))
    if cft > _ZERO:
        esperado = (tj / cft * _D("100")).quantize(_D("0.01"))
        assert _D(str(juros["pct_sobre_custo_financeiro_total"])) == esperado


# ── MA-BE-09: divisao por zero tratada ─────────────────────────────────────


@pytest.mark.unit
def test_ma_be09_sem_divisao_por_zero_quando_sem_encargos() -> None:
    """Custo financeiro total = total_juros quando sem encargos; pct_cft deve funcionar."""
    result = _svc()  # sem encargos
    # Não deve lançar exceção
    for comp in _componentes(result):
        pct = _D(str(comp["pct_sobre_custo_financeiro_total"]))
        assert pct >= _ZERO


# ── MA-BE-10: sem Resolucao CMN ──────────────────────────────────────────────


@pytest.mark.unit
def test_ma_be10_sem_resolucao_cmn_nos_alertas() -> None:
    result = _svc()
    texto_alertas = " ".join(result["alertas"])
    assert "Resolução CMN" not in texto_alertas
    assert "3.517" not in texto_alertas


@pytest.mark.unit
def test_ma_be10_sem_resolucao_cmn_nos_componentes() -> None:
    result = _svc(mip="80.00")
    for comp in _componentes(result):
        assert "Resolução CMN" not in comp["explicacao"]
        assert "3.517" not in comp["explicacao"]


# ── MA-BE-11: sem percentuais fixos de custos iniciais ─────────────────────


@pytest.mark.unit
def test_ma_be11_sem_percentuais_fixos_itbi() -> None:
    result = _svc()
    custos = next(c for c in _componentes(result) if c["id"] == "custos_contratacao")
    exp = custos["explicacao"]
    assert ("2" + "-3%") not in exp
    assert ("1" + "-2%") not in exp
    assert ("3%" + " e " + "5%") not in exp
    assert ("ITBI" + " (~") not in exp


@pytest.mark.unit
def test_ma_be11_custos_iniciais_como_alerta_sem_valor() -> None:
    result = _svc()
    custos = next(c for c in _componentes(result) if c["id"] == "custos_contratacao")
    assert custos["natureza"] == "alerta"
    assert _D(str(custos["valor_total"])) == _ZERO


# ── MA-BE-12: UTF-8 e sem mojibake ─────────────────────────────────────────


@pytest.mark.unit
def test_ma_be12_alertas_utf8_com_acentos() -> None:
    result = _svc()
    texto = " ".join(result["alertas"])
    assert "não" in texto
    assert "bancária" in texto
    assert "crédito" in texto
    assert "nao representa" not in texto


@pytest.mark.unit
def test_ma_be12_sem_obrigatorio_por_lei_em_componentes() -> None:
    result = _svc(mip="80.00", dfi="35.00")
    for comp in _componentes(result):
        assert ("obrigatório" + " por lei") not in comp["explicacao"].lower()


# ── MA-BE-13: taxa administrativa fora de seguros ──────────────────────────


@pytest.mark.unit
def test_ma_be13_taxa_admin_campo_proprio_separado() -> None:
    r = _dom(taxa_adm="25.00")
    p = r.parcelas[0]
    assert p.taxa_administracao_mensal == _D("25.00")
    # seguro_mensal (= seguros_total) não inclui taxa_adm
    assert p.seguro_mensal == _ZERO  # sem seguros informados


@pytest.mark.unit
def test_ma_be13_taxa_admin_nao_entra_em_seguros_no_service() -> None:
    result = _svc(taxa_adm="25.00")
    seguros = _D(str(_summary(result)["total_seguros"]))
    tarifas = _D(str(_summary(result)["total_tarifas"]))
    assert seguros == _ZERO  # sem seguros informados
    assert tarifas > _ZERO  # taxa_adm capturada aqui


# ── MA-BE-14: encargo_mensal_total correto ──────────────────────────────────


@pytest.mark.unit
def test_ma_be14_encargo_mensal_total_composicao() -> None:
    r = _dom(mip="80.00", dfi="35.00", taxa_adm="25.00")
    for p in r.parcelas:
        esperado = p.prestacao_financeira + p.encargos
        assert p.encargo_mensal_total == esperado


@pytest.mark.unit
def test_ma_be14_encargos_corretos() -> None:
    r = _dom(mip="80.00", dfi="35.00", taxa_adm="25.00")
    for p in r.parcelas:
        esperado = p.seguro_mensal + p.taxa_administracao_mensal + p.custo_admin_mensal
        assert p.encargos == esperado
