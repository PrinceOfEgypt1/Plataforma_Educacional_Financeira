"""Property-based tests do dominio de amortizacao PRICE/SAC."""

from __future__ import annotations

from decimal import Decimal

import pytest

hypothesis = pytest.importorskip(
    "hypothesis",
    reason="hypothesis nao instalado; bloqueio deve ser registrado no relatorio.",
)

from hypothesis import HealthCheck, given, seed, settings  # noqa: E402
from hypothesis import strategies as st  # noqa: E402

from app.domain.amortization import (  # noqa: E402
    PriceResultado,
    SacResultado,
    calcular_price,
    calcular_sac,
)

pytestmark = pytest.mark.unit

principal_st = st.decimals(
    min_value=Decimal("0.00"),
    max_value=Decimal("1000000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

principal_comparavel_st = st.decimals(
    min_value=Decimal("10000.00"),
    max_value=Decimal("1000000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

taxa_st = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("0.10"),
    allow_nan=False,
    allow_infinity=False,
    places=6,
)

taxa_positiva_st = st.decimals(
    min_value=Decimal("0.005"),
    max_value=Decimal("0.10"),
    allow_nan=False,
    allow_infinity=False,
    places=6,
)

prazo_st = st.integers(min_value=1, max_value=120)
prazo_maior_1_st = st.integers(min_value=3, max_value=120)

HYP_SETTINGS = settings(
    max_examples=150,
    deadline=None,
    suppress_health_check=[HealthCheck.too_slow, HealthCheck.filter_too_much],
)


def _assert_price_fecha(resultado: PriceResultado, principal: Decimal, prazo: int) -> None:
    assert len(resultado.tabela_periodo) == prazo
    for linha in resultado.tabela_periodo:
        assert linha.juros + linha.amortizacao == linha.parcela
        assert linha.saldo_inicial - linha.amortizacao == linha.saldo_final
    assert (
        sum((linha.parcela for linha in resultado.tabela_periodo), Decimal("0.00"))
        == resultado.total_pago
    )
    assert (
        sum((linha.juros for linha in resultado.tabela_periodo), Decimal("0.00"))
        == resultado.total_juros
    )
    assert (
        sum((linha.amortizacao for linha in resultado.tabela_periodo), Decimal("0.00")) == principal
    )
    assert resultado.tabela_periodo[-1].saldo_final == resultado.saldo_final
    assert resultado.saldo_final == Decimal("0.00")


def _assert_sac_fecha(resultado: SacResultado, principal: Decimal, prazo: int) -> None:
    assert len(resultado.tabela_periodo) == prazo
    for linha in resultado.tabela_periodo:
        assert linha.juros + linha.amortizacao == linha.parcela
        assert linha.saldo_inicial - linha.amortizacao == linha.saldo_final
    assert (
        sum((linha.parcela for linha in resultado.tabela_periodo), Decimal("0.00"))
        == resultado.total_pago
    )
    assert (
        sum((linha.juros for linha in resultado.tabela_periodo), Decimal("0.00"))
        == resultado.total_juros
    )
    assert (
        sum((linha.amortizacao for linha in resultado.tabela_periodo), Decimal("0.00")) == principal
    )
    assert resultado.tabela_periodo[-1].saldo_final == resultado.saldo_final
    assert resultado.saldo_final == Decimal("0.00")


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_price_fecha_linhas_totais_e_saldo(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    resultado = calcular_price(principal, taxa, prazo)
    _assert_price_fecha(resultado, principal, prazo)


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_sac_fecha_linhas_totais_e_saldo(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    resultado = calcular_sac(principal, taxa, prazo)
    _assert_sac_fecha(resultado, principal, prazo)


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_maior_1_st)
def test_price_parcela_regular_constante_ate_penultima(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    resultado = calcular_price(principal, taxa, prazo)
    assert all(linha.parcela == resultado.parcela for linha in resultado.tabela_periodo[:-1])


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_maior_1_st)
def test_sac_amortizacao_regular_constante_ate_penultima(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    resultado = calcular_sac(principal, taxa, prazo)
    assert all(
        linha.amortizacao == resultado.amortizacao_constante
        for linha in resultado.tabela_periodo[:-1]
    )


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_comparavel_st, taxa=taxa_positiva_st, prazo=prazo_maior_1_st)
def test_sac_tem_menos_juros_que_price_para_taxa_positiva_e_prazo_maior_1(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    price = calcular_price(principal, taxa, prazo)
    sac = calcular_sac(principal, taxa, prazo)
    assert sac.total_juros < price.total_juros


@seed(20260502)
@HYP_SETTINGS
@given(principal=principal_st, prazo=prazo_st)
def test_taxa_zero_nao_gera_juros(principal: Decimal, prazo: int) -> None:
    price = calcular_price(principal, Decimal("0"), prazo)
    sac = calcular_sac(principal, Decimal("0"), prazo)
    assert price.total_juros == Decimal("0.00")
    assert sac.total_juros == Decimal("0.00")
    assert price.total_pago == principal
    assert sac.total_pago == principal
