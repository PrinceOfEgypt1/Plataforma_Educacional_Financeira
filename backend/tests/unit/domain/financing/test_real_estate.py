"""Testes unitarios do dominio de financiamento imobiliario.

Casos canonicos:
    FI-01: PRICE PV=300000, i=0.7%/mes, n=360
    FI-02: SAC  PV=300000, i=0.7%/mes, n=360
    FI-03: PRICE taxa zero
    FI-04: SAC taxa zero
    FI-05: Com encargos mensais
    FI-06..FI-12: Validacoes de entradas invalidas
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.domain.financing import (
    DomainValidationError,
    calcular_financiamento_imobiliario,
)

ZERO = Decimal("0.00")
_D = Decimal


def _calc(
    *,
    valor_imovel: str = "300000.00",
    valor_entrada: str = "60000.00",
    prazo_meses: int = 360,
    taxa: str = "0.007",
    sistema: str = "PRICE",
    seguro: str = "0.00",
    tarifa: str = "0.00",
    admin: str = "0.00",
):
    return calcular_financiamento_imobiliario(
        valor_imovel=_D(valor_imovel),
        valor_entrada=_D(valor_entrada),
        prazo_meses=prazo_meses,
        taxa_juros_mensal=_D(taxa),
        sistema_amortizacao=sistema,
        seguro_mensal=_D(seguro),
        tarifa_mensal=_D(tarifa),
        custo_administrativo_mensal=_D(admin),
    )


# ─────────────────────────────────── FI-01 PRICE ────────────────────────────


@pytest.mark.unit
def test_fi01_price_valor_financiado_correto() -> None:
    r = _calc()
    assert r.valor_financiado == _D("240000.00")


@pytest.mark.unit
def test_fi01_price_saldo_final_zero() -> None:
    r = _calc()
    assert r.parcelas[-1].saldo_final == ZERO


@pytest.mark.unit
def test_fi01_price_soma_amortizacoes_igual_financiado() -> None:
    r = _calc()
    soma = sum((p.amortizacao for p in r.parcelas), ZERO)
    assert soma == r.valor_financiado


@pytest.mark.unit
def test_fi01_price_juros_decrescentes() -> None:
    r = _calc()
    juros = [p.juros for p in r.parcelas]
    for i in range(len(juros) - 1):
        assert juros[i] >= juros[i + 1]


@pytest.mark.unit
def test_fi01_price_amortizacao_crescente() -> None:
    r = _calc()
    amort = [p.amortizacao for p in r.parcelas]
    for i in range(len(amort) - 1):
        assert amort[i] <= amort[i + 1]


@pytest.mark.unit
def test_fi01_price_total_pago_coerente() -> None:
    r = _calc()
    soma_prestacoes = sum((p.prestacao for p in r.parcelas), ZERO)
    assert soma_prestacoes == r.total_pago


@pytest.mark.unit
def test_fi01_price_total_juros_coerente() -> None:
    r = _calc()
    soma_juros = sum((p.juros for p in r.parcelas), ZERO)
    assert soma_juros == r.total_juros


@pytest.mark.unit
def test_fi01_price_custo_total_e_juros_mais_encargos() -> None:
    r = _calc()
    assert r.custo_total == r.total_juros + r.total_encargos


@pytest.mark.unit
def test_fi01_price_prestacao_igual_juros_mais_amort() -> None:
    r = _calc()
    for p in r.parcelas:
        assert p.prestacao == p.juros + p.amortizacao + p.encargos


@pytest.mark.unit
def test_fi01_price_primeira_e_ultima_parcela() -> None:
    r = _calc()
    assert r.primeira_parcela == r.parcelas[0].prestacao
    assert r.ultima_parcela == r.parcelas[-1].prestacao


# ─────────────────────────────────── FI-02 SAC ──────────────────────────────


@pytest.mark.unit
def test_fi02_sac_saldo_final_zero() -> None:
    r = _calc(sistema="SAC")
    assert r.parcelas[-1].saldo_final == ZERO


@pytest.mark.unit
def test_fi02_sac_soma_amortizacoes_igual_financiado() -> None:
    r = _calc(sistema="SAC")
    soma = sum((p.amortizacao for p in r.parcelas), ZERO)
    assert soma == r.valor_financiado


@pytest.mark.unit
def test_fi02_sac_juros_decrescentes() -> None:
    r = _calc(sistema="SAC")
    juros = [p.juros for p in r.parcelas]
    for i in range(len(juros) - 1):
        assert juros[i] >= juros[i + 1]


@pytest.mark.unit
def test_fi02_sac_parcela_decrescente() -> None:
    r = _calc(sistema="SAC")
    prestacoes = [p.prestacao for p in r.parcelas]
    for i in range(len(prestacoes) - 1):
        assert prestacoes[i] >= prestacoes[i + 1]


@pytest.mark.unit
def test_fi02_sac_total_juros_menor_que_price() -> None:
    r_price = _calc()
    r_sac = _calc(sistema="SAC")
    assert r_sac.total_juros < r_price.total_juros


# ─────────────────────────────────── FI-03 taxa zero ───────────────────────


@pytest.mark.unit
def test_fi03_price_taxa_zero_juros_sao_zero() -> None:
    r = _calc(taxa="0.0")
    assert r.total_juros == ZERO


@pytest.mark.unit
def test_fi03_price_taxa_zero_saldo_fecha() -> None:
    r = _calc(taxa="0.0")
    assert r.parcelas[-1].saldo_final == ZERO


# ─────────────────────────────────── FI-04 SAC taxa zero ───────────────────


@pytest.mark.unit
def test_fi04_sac_taxa_zero_juros_sao_zero() -> None:
    r = _calc(taxa="0.0", sistema="SAC")
    assert r.total_juros == ZERO


@pytest.mark.unit
def test_fi04_sac_taxa_zero_saldo_fecha() -> None:
    r = _calc(taxa="0.0", sistema="SAC")
    assert r.parcelas[-1].saldo_final == ZERO


# ─────────────────────────────────── FI-05 encargos ────────────────────────


@pytest.mark.unit
def test_fi05_encargos_aparecem_em_cada_periodo() -> None:
    r = _calc(seguro="150.00", tarifa="25.00", admin="10.00")
    encargos_esperados = _D("185.00")
    for p in r.parcelas:
        assert p.encargos == encargos_esperados


@pytest.mark.unit
def test_fi05_total_encargos_correto() -> None:
    r = _calc(seguro="150.00", tarifa="25.00", admin="10.00")
    assert r.total_encargos == _D("185.00") * r.prazo_meses


@pytest.mark.unit
def test_fi05_prestacao_inclui_encargos() -> None:
    r = _calc(seguro="150.00")
    for p in r.parcelas:
        assert p.prestacao == p.juros + p.amortizacao + p.encargos


# ─────────────────────────────────── FI-06..FI-12 validacoes ───────────────


@pytest.mark.unit
def test_fi06_valor_imovel_zero_rejeitado() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(valor_imovel="0.00")
    assert exc_info.value.code == "NON_POSITIVE_VALOR_IMOVEL"


@pytest.mark.unit
def test_fi07_entrada_igual_imovel_rejeitada() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(valor_entrada="300000.00")
    assert exc_info.value.code == "ENTRADA_MAIOR_OU_IGUAL_IMOVEL"


@pytest.mark.unit
def test_fi08_entrada_maior_que_imovel_rejeitada() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(valor_entrada="350000.00")
    assert exc_info.value.code == "ENTRADA_MAIOR_OU_IGUAL_IMOVEL"


@pytest.mark.unit
def test_fi09_prazo_zero_rejeitado() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(prazo_meses=0)
    assert exc_info.value.code == "NON_POSITIVE_PRAZO"


@pytest.mark.unit
def test_fi10_taxa_negativa_rejeitada() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(taxa="-0.01")
    assert exc_info.value.code == "NEGATIVE_TAXA"


@pytest.mark.unit
def test_fi11_encargo_negativo_rejeitado() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(seguro="-10.00")
    assert exc_info.value.code == "NEGATIVE_ENCARGO"


@pytest.mark.unit
def test_fi12_sistema_invalido_rejeitado() -> None:
    with pytest.raises(DomainValidationError) as exc_info:
        _calc(sistema="INVALIDO")
    assert exc_info.value.code == "INVALID_SISTEMA_AMORTIZACAO"


@pytest.mark.unit
def test_fi12_bool_prazo_rejeitado() -> None:
    with pytest.raises(DomainValidationError):
        calcular_financiamento_imobiliario(
            valor_imovel=_D("300000.00"),
            valor_entrada=_D("60000.00"),
            prazo_meses=True,  # type: ignore[arg-type]
            taxa_juros_mensal=_D("0.007"),
            sistema_amortizacao="PRICE",
        )
