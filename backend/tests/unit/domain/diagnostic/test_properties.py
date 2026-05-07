"""Property-based tests do domínio de diagnóstico financeiro."""

from __future__ import annotations

from decimal import Decimal

import pytest

hypothesis = pytest.importorskip(
    "hypothesis",
    reason="hypothesis não instalado.",
)

from hypothesis import given, settings  # noqa: E402
from hypothesis import strategies as st  # noqa: E402

from app.domain.diagnostic import DiagnosticoResultado, analisar_diagnostico  # noqa: E402

pytestmark = pytest.mark.unit

renda_st = st.decimals(
    min_value=Decimal("1.00"),
    max_value=Decimal("100000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

despesa_st = st.decimals(
    min_value=Decimal("1.00"),
    max_value=Decimal("50000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

divida_st = st.decimals(
    min_value=Decimal("0.00"),
    max_value=Decimal("50000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

reserva_st = st.decimals(
    min_value=Decimal("0.00"),
    max_value=Decimal("1000000.00"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_resultado_e_instancia_valida(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    resultado = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    assert isinstance(resultado, DiagnosticoResultado)


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_score_entre_0_e_9(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    resultado = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    assert 0 <= resultado.score <= 9


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_saude_nivel_valido(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    resultado = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    assert resultado.saude_nivel in ("critica", "fragil", "moderada", "boa", "otima")


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_score_igual_soma_pontos(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    r = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    assert r.score == r.pontos_comprometimento + r.pontos_reserva + r.pontos_sobra


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_sobra_nao_positiva_impede_nivel_acima_fragil(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    r = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    if r.sobra_mensal < Decimal("0"):
        assert r.saude_nivel in ("critica", "fragil")


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_sobra_mensal_correto(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    r = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    esperado = (renda - fixas - variaveis - dividas).quantize(
        Decimal("0.01"), rounding=__import__("decimal").ROUND_HALF_EVEN
    )
    assert r.sobra_mensal == esperado


@given(
    renda=renda_st,
    fixas=despesa_st,
    variaveis=despesa_st,
    dividas=divida_st,
    reserva=reserva_st,
)
@settings(max_examples=200)
def test_alertas_e_tupla(
    renda: Decimal,
    fixas: Decimal,
    variaveis: Decimal,
    dividas: Decimal,
    reserva: Decimal,
) -> None:
    r = analisar_diagnostico(renda, fixas, variaveis, dividas, reserva)
    assert isinstance(r.alertas, tuple)
