"""Testes unitários de `calcular_juros_compostos`.

Estrutura espelha `test_simple.py`:
    * Canônicos Doc 15: JC-01 (sem aporte), JC-02 (sem aporte, P/i diferentes),
      JC-03 (com aporte=100).
    * Grade determinística GC-001..GC-047 (48 − 1 por exclusão JC-02).
    * Rejeições do fixture (tipos, sinais, degenerado 0+0).
    * Propriedades estruturais: imutabilidade, tuple, monotonicidade,
      taxa=0 ⇒ juros=0 (mas aporte ainda soma ao montante).

A identidade `juros_total = montante_final − principal − aporte·n` é
verificada em todos os cenários da grade.
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.domain.interest import (
    CompoundInterestResult,
    CompoundPeriod,
    InvalidContributionError,
    InvalidPrincipalError,
    InvalidRateError,
    InvalidTermError,
    calcular_juros_compostos,
    calcular_juros_simples,
)


def _find(cases: list[dict], case_id: str) -> dict:
    for c in cases:
        if c["id"] == case_id:
            return c
    raise AssertionError(f"Caso {case_id!r} ausente no fixture")


# ---------- canônicos Doc 15 ----------------------------------------------


def _run_canonical(case: dict) -> CompoundInterestResult:
    return calcular_juros_compostos(
        principal=Decimal(case["principal"]),
        taxa=Decimal(case["taxa"]),
        prazo=int(case["prazo"]),
        aporte_mensal=Decimal(case["aporte_mensal"]),
    )


def test_jc_01_canonico_doc15_sem_aporte(compound_cases):
    c = _find(compound_cases, "JC-01")
    r = _run_canonical(c)
    assert r.juros_total == Decimal(c["expected"]["juros_total"])
    assert r.montante_final == Decimal(c["expected"]["montante_final"])
    assert r.total_aportado == Decimal(c["expected"]["total_aportado"])
    assert r.total_aportado == Decimal("0.00")


def test_jc_02_canonico_doc15_sem_aporte(compound_cases):
    """JC-02 (plano Sprint 2 §linha 54): P=10.000, i=2% a.m., n=24m,
    sem aporte; propriedade do caso canônico é COMPOSTO > SIMPLES."""
    c = _find(compound_cases, "JC-02")
    r = _run_canonical(c)
    assert r.juros_total == Decimal(c["expected"]["juros_total"])
    assert r.montante_final == Decimal(c["expected"]["montante_final"])
    assert r.total_aportado == Decimal("0.00")
    # Enunciado literal do caso canônico: composto > simples (n=24, i=2%).
    r_simples = calcular_juros_simples(
        principal=Decimal(c["principal"]),
        taxa=Decimal(c["taxa"]),
        prazo=int(c["prazo"]),
    )
    assert r.montante_final > r_simples.montante_final
    assert r.juros_total > r_simples.juros_total


def test_jc_03_canonico_doc15_com_aporte(compound_cases):
    """JC-03 é o canônico-chave com aporte=100; cobre a iteração com aporte
    ao fim do período."""
    c = _find(compound_cases, "JC-03")
    r = _run_canonical(c)
    assert r.juros_total == Decimal(c["expected"]["juros_total"])
    assert r.montante_final == Decimal(c["expected"]["montante_final"])
    assert r.total_aportado == Decimal(c["expected"]["total_aportado"])
    # identidade: M = P + J + aporte·n (quantizado)
    assert r.montante_final == (
        Decimal(c["principal"]) + r.juros_total + r.total_aportado
    ).quantize(Decimal("0.01"))


# ---------- grade determinística ------------------------------------------


def test_grade_compostos_50_cenarios(compound_cases):
    failures: list[str] = []
    for c in compound_cases:
        r = calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )
        exp_j = Decimal(c["expected"]["juros_total"])
        exp_m = Decimal(c["expected"]["montante_final"])
        exp_t = Decimal(c["expected"]["total_aportado"])
        if r.juros_total != exp_j or r.montante_final != exp_m or r.total_aportado != exp_t:
            failures.append(
                f"{c['id']}: "
                f"J esperado={exp_j} obtido={r.juros_total}; "
                f"M esperado={exp_m} obtido={r.montante_final}; "
                f"T esperado={exp_t} obtido={r.total_aportado}; "
                f"inputs P={c['principal']} i={c['taxa']} n={c['prazo']} "
                f"aporte={c['aporte_mensal']}"
            )
    assert not failures, "Divergências na grade composta:\n" + "\n".join(failures)


# ---------- rejeições ------------------------------------------------------


def test_rejeicao_degenerada_principal_e_aporte_zero(compound_rejections):
    """Regra de domínio explícita: P=0 ∧ aporte=0 é degenerado."""
    c = _find(compound_rejections, "JC-REJ-bothzero")
    with pytest.raises(InvalidPrincipalError):
        calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )


def test_rejeicao_prazo_zero(compound_rejections):
    c = _find(compound_rejections, "JC-REJ-zeroprazo")
    with pytest.raises(InvalidTermError):
        calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )


def test_rejeicao_principal_negativo(compound_rejections):
    c = _find(compound_rejections, "JC-REJ-negprincipal")
    with pytest.raises(InvalidPrincipalError):
        calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )


def test_rejeicao_taxa_negativa(compound_rejections):
    c = _find(compound_rejections, "JC-REJ-negtaxa")
    with pytest.raises(InvalidRateError):
        calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )


def test_rejeicao_aporte_negativo(compound_rejections):
    c = _find(compound_rejections, "JC-REJ-negaporte")
    with pytest.raises(InvalidContributionError):
        calcular_juros_compostos(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
            aporte_mensal=Decimal(c["aporte_mensal"]),
        )


def test_rejeicao_bool_como_prazo():
    with pytest.raises(InvalidTermError):
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa=Decimal("0.01"),
            prazo=True,  # type: ignore[arg-type]
            aporte_mensal=Decimal("0"),
        )


def test_rejeicao_tipo_nao_decimal_aporte():
    with pytest.raises(InvalidContributionError):
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa=Decimal("0.01"),
            prazo=12,
            aporte_mensal=100,  # type: ignore[arg-type]
        )


def test_rejeicao_tipo_nao_decimal_principal():
    with pytest.raises(InvalidPrincipalError):
        calcular_juros_compostos(
            principal=1000,  # type: ignore[arg-type]
            taxa=Decimal("0.01"),
            prazo=12,
            aporte_mensal=Decimal("0"),
        )


def test_rejeicao_tipo_nao_decimal_taxa():
    with pytest.raises(InvalidRateError):
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa=0.01,  # type: ignore[arg-type]
            prazo=12,
            aporte_mensal=Decimal("0"),
        )


# ---------- propriedades estruturais --------------------------------------


def test_resultado_imutavel_e_tipado():
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=12,
        aporte_mensal=Decimal("0"),
    )
    assert isinstance(r, CompoundInterestResult)
    assert isinstance(r.periodos, tuple)
    assert all(isinstance(p, CompoundPeriod) for p in r.periodos)
    with pytest.raises((AttributeError, Exception)):
        r.juros_total = Decimal(0)  # type: ignore[misc]


def test_tamanho_periodos_igual_prazo():
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=12,
        aporte_mensal=Decimal("0"),
    )
    assert len(r.periodos) == 12
    assert [p.period for p in r.periodos] == list(range(1, 13))


def test_monotonicidade_juros_acumulado_composto():
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=24,
        aporte_mensal=Decimal("0"),
    )
    for a, b in zip(r.periodos, r.periodos[1:], strict=False):
        assert b.juros_acumulado >= a.juros_acumulado
        assert b.montante > a.montante


def test_default_aporte_zero_equivale_explicito():
    r1 = calcular_juros_compostos(principal=Decimal("1000"), taxa=Decimal("0.01"), prazo=12)
    r2 = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=12,
        aporte_mensal=Decimal("0"),
    )
    assert r1.juros_total == r2.juros_total
    assert r1.montante_final == r2.montante_final
    assert r1.total_aportado == r2.total_aportado


def test_taxa_zero_com_aporte_soma_exata():
    """i=0 e aporte=A ⇒ J=0; M=P+A·n; total_aportado=A·n."""
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0"),
        prazo=12,
        aporte_mensal=Decimal("100"),
    )
    assert r.juros_total == Decimal("0.00")
    assert r.total_aportado == Decimal("1200.00")
    assert r.montante_final == Decimal("2200.00")


def test_principal_zero_com_aporte_valido():
    """P=0 e aporte>0 é caso legítimo (só aportes acumulando juros)."""
    r = calcular_juros_compostos(
        principal=Decimal("0"),
        taxa=Decimal("0.01"),
        prazo=12,
        aporte_mensal=Decimal("100"),
    )
    # Sem principal: M = Σ aporte·(1+i)^k acumulando. Testamos identidades.
    assert r.total_aportado == Decimal("1200.00")
    assert r.montante_final > r.total_aportado  # juros acumularam
    assert r.juros_total > Decimal("0.00")


def test_somente_keyword_arguments():
    with pytest.raises(TypeError):
        calcular_juros_compostos(
            Decimal("1000"),
            Decimal("0.01"),
            12,
            Decimal("0"),  # type: ignore[misc]
        )


def test_resultado_composto_retem_campos_de_entrada():
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=12,
        aporte_mensal=Decimal("100"),
    )
    assert r.principal == Decimal("1000")
    assert r.taxa == Decimal("0.01")
    assert r.prazo == 12
    assert r.aporte_mensal == Decimal("100")


def test_primeiro_periodo_composto_retem_aporte_e_juros_periodo():
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=1,
        aporte_mensal=Decimal("100"),
    )
    p = r.periodos[0]
    assert p.aporte == Decimal("100.00")
    assert p.juros_periodo == Decimal("10.00")
