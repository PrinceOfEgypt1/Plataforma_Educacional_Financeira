"""Property-based tests — juros simples e compostos (F2).

Dependência externa: ``hypothesis`` (declarada em
``backend/pyproject.toml`` linha 48 — ``hypothesis>=6.103.0``).
Se a dependência estiver ausente no ambiente, este módulo inteiro
é *pulado* via ``pytest.importorskip`` e a bateria ``unit`` não
falha — mas o plano de sprint exige que o job de CI instale a
dependência para que o gate property-based seja verde.

Invariantes matemáticas verificadas:
    - Juros simples:
        - ``juros + principal == montante``;
        - ``montante == principal × (1 + taxa × prazo)``;
        - tabela tem tamanho ``prazo``;
        - saldo_final do último período == montante;
        - juros_periodo é constante.
    - Juros compostos:
        - sem aporte, ``montante == principal × (1 + taxa)^prazo``;
        - taxa zero com aporte → soma linear;
        - composto ≥ simples para taxa positiva (igualdade em n=1);
        - tabela tem tamanho ``prazo``;
        - monotonia do saldo para taxa e aporte não-negativos.

Configuração:
    - Seed fixado (``20260423``) para reprodutibilidade;
    - ``max_examples=200`` — dentro do alvo ≥ 100 do Plano §5.2.

Marca: ``unit``.
"""

from __future__ import annotations

from decimal import Decimal

import pytest

hypothesis = pytest.importorskip(
    "hypothesis",
    reason="hypothesis não instalado; bloqueio registrado no relatório.",
)

from hypothesis import HealthCheck, given, seed, settings  # noqa: E402
from hypothesis import strategies as st  # noqa: E402

from app.domain.interest import (  # noqa: E402
    calcular_juros_compostos,
    calcular_juros_simples,
)
from app.domain.interest._rounding import money  # noqa: E402

pytestmark = pytest.mark.unit


# ─── Estratégias ──────────────────────────────────────────────────────

principal_st = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("1000000"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)

taxa_st = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("0.5"),
    allow_nan=False,
    allow_infinity=False,
    places=6,
)

taxa_positiva_st = st.decimals(
    min_value=Decimal("0.0001"),
    max_value=Decimal("0.5"),
    allow_nan=False,
    allow_infinity=False,
    places=6,
)

prazo_st = st.integers(min_value=1, max_value=120)
prazo_maior_1_st = st.integers(min_value=2, max_value=120)
aporte_st = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("100000"),
    allow_nan=False,
    allow_infinity=False,
    places=2,
)


HYP_SETTINGS = settings(
    max_examples=200,
    deadline=None,
    suppress_health_check=[HealthCheck.too_slow, HealthCheck.filter_too_much],
)


# ─── Invariantes — juros simples ──────────────────────────────────────


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_simples_juros_mais_principal_igual_montante(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    r = calcular_juros_simples(principal, taxa, prazo)
    assert r.juros_totais + money(principal) == r.montante_final


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_simples_formula_fechada(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    r = calcular_juros_simples(principal, taxa, prazo)
    esperado = money(principal * (Decimal(1) + taxa * Decimal(prazo)))
    assert r.montante_final == esperado


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_simples_tabela_tem_tamanho_prazo(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    r = calcular_juros_simples(principal, taxa, prazo)
    assert len(r.tabela) == prazo


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_simples_ultimo_saldo_igual_montante(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    r = calcular_juros_simples(principal, taxa, prazo)
    assert r.tabela[-1].saldo_final == r.montante_final


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_simples_juros_por_periodo_constante(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    r = calcular_juros_simples(principal, taxa, prazo)
    juros = [linha.juros_periodo for linha in r.tabela]
    assert all(j == juros[0] for j in juros)


# ─── Invariantes — juros compostos ────────────────────────────────────


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_composto_sem_aporte_igual_formula_fechada(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    r = calcular_juros_compostos(principal, taxa, prazo)
    esperado = money(principal * (Decimal(1) + taxa) ** prazo)
    assert r.montante_final == esperado


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_composto_tabela_tem_tamanho_prazo(principal: Decimal, taxa: Decimal, prazo: int) -> None:
    r = calcular_juros_compostos(principal, taxa, prazo)
    assert len(r.tabela) == prazo


@seed(20260423)
@HYP_SETTINGS
@given(principal=principal_st, taxa=taxa_st, prazo=prazo_st)
def test_composto_ultimo_saldo_igual_montante(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    r = calcular_juros_compostos(principal, taxa, prazo)
    assert r.tabela[-1].saldo_final == r.montante_final


@seed(20260423)
@HYP_SETTINGS
@given(
    principal=principal_st,
    taxa=taxa_positiva_st,
    prazo=prazo_maior_1_st,
)
def test_composto_maior_que_simples_para_taxa_positiva_e_prazo_gt_1(
    principal: Decimal, taxa: Decimal, prazo: int
) -> None:
    """Para i > 0 e n > 1 com principal > 0, composto > simples.
    Para principal = 0 ambos dão 0 (igualdade)."""
    s = calcular_juros_simples(principal, taxa, prazo)
    c = calcular_juros_compostos(principal, taxa, prazo)
    assert c.montante_final >= s.montante_final


@seed(20260423)
@HYP_SETTINGS
@given(
    principal=principal_st,
    prazo=prazo_st,
    aporte=aporte_st,
)
def test_composto_taxa_zero_com_aporte_linear(
    principal: Decimal, prazo: int, aporte: Decimal
) -> None:
    """Com i=0, montante = principal + aporte × n."""
    r = calcular_juros_compostos(
        principal=principal,
        taxa_mensal=Decimal("0"),
        prazo_meses=prazo,
        aporte_mensal=aporte,
    )
    esperado = money(principal + aporte * Decimal(prazo))
    assert r.montante_final == esperado


@seed(20260423)
@HYP_SETTINGS
@given(
    principal=principal_st,
    taxa=taxa_st,
    prazo=prazo_st,
    aporte=aporte_st,
)
def test_composto_totais_consistentes_com_aporte(
    principal: Decimal, taxa: Decimal, prazo: int, aporte: Decimal
) -> None:
    r = calcular_juros_compostos(principal, taxa, prazo, aporte)
    assert r.total_aportado == money(aporte * Decimal(prazo))
    soma = money(principal + aporte * Decimal(prazo))
    assert r.total_investido == soma
    assert r.juros_totais == r.montante_final - r.total_investido


@seed(20260423)
@HYP_SETTINGS
@given(
    principal=principal_st,
    taxa=taxa_st,
    prazo=prazo_st,
    aporte=aporte_st,
)
def test_composto_tabela_monotona_quando_taxa_e_aporte_nao_negativos(
    principal: Decimal, taxa: Decimal, prazo: int, aporte: Decimal
) -> None:
    """Com i ≥ 0 e aporte ≥ 0, saldo_final ≥ saldo_inicial em cada período."""
    r = calcular_juros_compostos(principal, taxa, prazo, aporte)
    for linha in r.tabela:
        assert linha.saldo_final >= linha.saldo_inicial
