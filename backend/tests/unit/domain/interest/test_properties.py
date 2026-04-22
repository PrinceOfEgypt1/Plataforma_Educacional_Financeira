"""Testes baseados em propriedade (Hypothesis) do domínio de juros.

Objetivo: derivar propriedades robustas da matemática financeira e atacá-las
com entradas geradas aleatoriamente (mas com seed controlável por CI) para
encontrar regressões de borda que a grade determinística não cobre.

Propriedades:

1. Simples — linearidade em `principal`:
      J(λ·principal, i, n) = λ · J(principal, i, n), para λ ∈ {1, 2, 5, 10}.
   Como a quantização introduz ruído no display, verificamos em Decimal de
   alta precisão e toleramos ±0.01 por quantização.

2. Simples — homogeneidade em `n`:
      J(principal, i, 2n) = 2 · J(principal, i, n).

3. Simples — montante estritamente crescente em `n` para i>0.

4. Composto — `montante_final ≥ principal + aporte·n` sempre.

5. Composto ≥ Simples para mesmos (principal, i, n) e aporte=0, n≥1 e i>0.

6. Simples — `juros_total == principal·i·n` (identidade exata, respeitada a
   quantização de display).
"""

from __future__ import annotations

from decimal import Decimal

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from app.domain.interest import (
    calcular_juros_compostos,
    calcular_juros_simples,
)

# Estratégias conservadoras: evitam explosão numérica e overflow de display.
principals = st.decimals(
    min_value=Decimal("0.01"),
    max_value=Decimal("1000000"),
    places=2,
    allow_nan=False,
    allow_infinity=False,
)
taxas = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("0.10"),  # ≤10% por período
    places=4,
    allow_nan=False,
    allow_infinity=False,
)
prazos = st.integers(min_value=1, max_value=60)
aportes = st.decimals(
    min_value=Decimal("0"),
    max_value=Decimal("10000"),
    places=2,
    allow_nan=False,
    allow_infinity=False,
)


TOL = Decimal("0.02")  # 2× quantização de display por lado


@given(principals, taxas, prazos, st.integers(min_value=1, max_value=10))
@settings(max_examples=80, deadline=None)
def test_simples_linearidade_em_principal(principal, i, n, lam):
    """J(λ·principal, i, n) ≈ λ · J(principal, i, n)."""
    lam_d = Decimal(lam)
    r1 = calcular_juros_simples(principal=principal, taxa=i, prazo=n)
    r2 = calcular_juros_simples(principal=principal * lam_d, taxa=i, prazo=n)
    # Tolerância acumula com o fator λ (cada lado quantiza 1x)
    assert abs(r2.juros_total - lam_d * r1.juros_total) <= TOL * lam_d


@given(principals, taxas, prazos)
@settings(max_examples=80, deadline=None)
def test_simples_homogeneidade_em_prazo(principal, i, n):
    """J(principal, i, 2n) ≈ 2 · J(principal, i, n)."""
    r1 = calcular_juros_simples(principal=principal, taxa=i, prazo=n)
    r2 = calcular_juros_simples(principal=principal, taxa=i, prazo=2 * n)
    assert abs(r2.juros_total - Decimal(2) * r1.juros_total) <= TOL * Decimal(2)


@given(
    principals,
    st.decimals(min_value=Decimal("0.0001"), max_value=Decimal("0.10"), places=4),
)
@settings(max_examples=50, deadline=None)
def test_simples_monotonicidade_em_n_para_taxa_positiva(principal, i):
    """Para i>0 e n'>n, M(n') > M(n), desde que o incremento de juros
    entre n e 2n seja observável no grid de display (2 casas).

    Sem a pré-condição, inputs como principal=0.01, i=0.0001 produzem juros
    quantizados a 0.00 em cada período — monotonicidade estrita é
    indistinguível no display. Nesses casos a propriedade correta é
    M_long ≥ M_short, não estrita. Filtramos para o regime observável.
    """
    from hypothesis import assume

    assume(principal * i * Decimal(6) >= Decimal("0.01"))
    r_short = calcular_juros_simples(principal=principal, taxa=i, prazo=6)
    r_long = calcular_juros_simples(principal=principal, taxa=i, prazo=12)
    assert r_long.montante_final > r_short.montante_final


@given(principals, taxas, prazos)
@settings(max_examples=80, deadline=None)
def test_simples_identidade_j_igual_pin(principal, i, n):
    """J_total == quantize(principal · i · n).

    Propriedade fundamental da forma fechada. Comparamos quantizados dos
    dois lados para neutralizar a quantização final.
    """
    from decimal import ROUND_HALF_EVEN

    r = calcular_juros_simples(principal=principal, taxa=i, prazo=n)
    esperado = (principal * i * Decimal(n)).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
    assert r.juros_total == esperado


@given(principals, taxas, prazos, aportes)
@settings(max_examples=80, deadline=None)
def test_composto_montante_nunca_menor_que_base(principal, i, n, a):
    """M_final ≥ principal + aporte·n. Juros sempre não-negativos."""
    r = calcular_juros_compostos(principal=principal, taxa=i, prazo=n, aporte_mensal=a)
    base = (principal + a * Decimal(n)).quantize(Decimal("0.01"))
    # tolerância de 1 centavo por acúmulo de quantização
    assert r.montante_final >= base - Decimal("0.01")


@given(
    principals,
    st.decimals(min_value=Decimal("0.0001"), max_value=Decimal("0.10"), places=4),
    st.integers(min_value=2, max_value=60),
)
@settings(max_examples=80, deadline=None)
def test_composto_maior_ou_igual_simples_sem_aporte(principal, i, n):
    """Para i>0 e n≥2, montante composto (sem aporte) ≥ montante simples.

    Propriedade matemática clássica: (1+i)^n ≥ 1 + ni para i≥0, n≥0,
    com igualdade apenas em i=0 ou n≤1.
    """
    r_s = calcular_juros_simples(principal=principal, taxa=i, prazo=n)
    r_c = calcular_juros_compostos(principal=principal, taxa=i, prazo=n, aporte_mensal=Decimal("0"))
    # Aceita diferença de 1 centavo por conta da quantização de display.
    assert r_c.montante_final >= r_s.montante_final - Decimal("0.01")


@given(principals, prazos, aportes)
@settings(max_examples=40, deadline=None)
def test_composto_taxa_zero_colapsa_em_soma_aritmetica(principal, n, a):
    """i=0 ⇒ M_final = principal + aporte·n, juros_total = 0."""
    r = calcular_juros_compostos(principal=principal, taxa=Decimal("0"), prazo=n, aporte_mensal=a)
    assert r.juros_total == Decimal("0.00")
    assert r.total_aportado == (a * Decimal(n)).quantize(Decimal("0.01"))
    assert r.montante_final == (principal + a * Decimal(n)).quantize(Decimal("0.01"))


@pytest.mark.parametrize(
    ("principal", "taxa", "prazo"),
    [
        (Decimal("1000"), Decimal("0.01"), 12),
        (Decimal("5000"), Decimal("0.02"), 6),
        (Decimal("250"), Decimal("0.005"), 36),
    ],
)
def test_simples_soma_dos_juros_por_periodo_igual_juros_total(principal, taxa, prazo):
    """Σ (juros_acumulado(k) − juros_acumulado(k-1)) == juros_total."""
    r = calcular_juros_simples(principal=principal, taxa=taxa, prazo=prazo)
    # juros_por_periodo em simples é constante = principal·taxa quantizado
    incrementos = []
    anterior = Decimal("0")
    for p in r.periodos:
        incrementos.append(p.juros_acumulado - anterior)
        anterior = p.juros_acumulado
    assert sum(incrementos) == r.juros_total
