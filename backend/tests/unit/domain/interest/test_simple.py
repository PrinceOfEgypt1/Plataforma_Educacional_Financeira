"""Testes unitários de `calcular_juros_simples`.

Estrutura:
    * Casos canônicos do Doc 15 (JS-01, JS-02) lidos do fixture e
      verificados exatamente contra `juros_total` e `montante_final`.
    * Grade determinística GS-001..GS-048 parametrizada a partir do fixture
      — o teste compara valores quantizados, nunca recomputa.
    * Rejeições: JS-03 (prazo zero) + variantes explícitas do fixture
      (negativos, zero principal etc.).
    * Propriedades estruturais da saída: imutabilidade, tipo tuple para
      `periodos`, tamanho `n`, monotonicidade por período.

Compara com tolerância ZERO onde a saída já está em 2 casas (o fixture
também está em 2 casas). Diferenças de arredondamento indicariam violação
de política, não de precisão.
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.domain.interest import (
    InvalidPrincipalError,
    InvalidRateError,
    InvalidTermError,
    SimpleInterestResult,
    SimplePeriod,
    calcular_juros_simples,
)

# ---------- canônicos Doc 15 ----------------------------------------------


def _find(cases: list[dict], case_id: str) -> dict:
    for c in cases:
        if c["id"] == case_id:
            return c
    raise AssertionError(f"Caso {case_id!r} ausente no fixture")


def test_js_01_canonico_doc15(simple_cases):
    """JS-01: P=1000, i=1% a.m., n=12m ⇒ J=120,00; M=1120,00."""
    c = _find(simple_cases, "JS-01")
    r = calcular_juros_simples(
        principal=Decimal(c["principal"]),
        taxa=Decimal(c["taxa"]),
        prazo=int(c["prazo"]),
    )
    assert r.juros_total == Decimal(c["expected"]["juros_total"])
    assert r.montante_final == Decimal(c["expected"]["montante_final"])


def test_js_02_canonico_doc15(simple_cases):
    """JS-02: P=5000, i=2% a.m., n=3m ⇒ J=300,00; M=5300,00."""
    c = _find(simple_cases, "JS-02")
    r = calcular_juros_simples(
        principal=Decimal(c["principal"]),
        taxa=Decimal(c["taxa"]),
        prazo=int(c["prazo"]),
    )
    assert r.juros_total == Decimal(c["expected"]["juros_total"])
    assert r.montante_final == Decimal(c["expected"]["montante_final"])


# ---------- grade determinística ------------------------------------------


def _id_from(c: dict) -> str:
    return c["id"]


@pytest.fixture(scope="module")
def all_simple_numeric(simple_cases):
    return simple_cases  # JS-01, JS-02, GS-001..GS-048


def test_grade_simples_50_cenarios(all_simple_numeric):
    """Executa os 50 cenários numéricos de simples e compara contra fixture.

    Falha LOUD com a lista dos IDs divergentes — não escondemos falhas em
    um assert genérico.
    """
    failures: list[tuple[str, str, str, str]] = []
    for c in all_simple_numeric:
        r = calcular_juros_simples(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
        )
        exp_j = Decimal(c["expected"]["juros_total"])
        exp_m = Decimal(c["expected"]["montante_final"])
        if r.juros_total != exp_j or r.montante_final != exp_m:
            failures.append(
                (
                    c["id"],
                    f"juros: esperado {exp_j}, obtido {r.juros_total}",
                    f"montante: esperado {exp_m}, obtido {r.montante_final}",
                    f"inputs: P={c['principal']} i={c['taxa']} n={c['prazo']}",
                )
            )
    assert not failures, "Divergências na grade simples:\n" + "\n".join(
        " | ".join(row) for row in failures
    )


# ---------- rejeições ------------------------------------------------------


@pytest.mark.parametrize("rej_id", ["JS-03", "JS-REJ-negprazo"])
def test_rejeicao_prazo_invalido(simple_rejections, rej_id):
    c = _find(simple_rejections, rej_id)
    with pytest.raises(InvalidTermError):
        calcular_juros_simples(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
        )


@pytest.mark.parametrize("rej_id", ["JS-REJ-zeroprincipal", "JS-REJ-negprincipal"])
def test_rejeicao_principal_invalido(simple_rejections, rej_id):
    c = _find(simple_rejections, rej_id)
    with pytest.raises(InvalidPrincipalError):
        calcular_juros_simples(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
        )


def test_rejeicao_taxa_negativa(simple_rejections):
    c = _find(simple_rejections, "JS-REJ-negtaxa")
    with pytest.raises(InvalidRateError):
        calcular_juros_simples(
            principal=Decimal(c["principal"]),
            taxa=Decimal(c["taxa"]),
            prazo=int(c["prazo"]),
        )


def test_rejeicao_bool_como_prazo():
    """`bool` é subtipo de `int` em Python; domínio rejeita explicitamente."""
    with pytest.raises(InvalidTermError):
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa=Decimal("0.01"),
            prazo=True,  # type: ignore[arg-type]
        )


def test_rejeicao_tipo_nao_decimal_principal():
    with pytest.raises(InvalidPrincipalError):
        calcular_juros_simples(
            principal=1000,  # type: ignore[arg-type]
            taxa=Decimal("0.01"),
            prazo=12,
        )


def test_rejeicao_tipo_nao_decimal_taxa():
    with pytest.raises(InvalidRateError):
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa=0.01,  # type: ignore[arg-type]
            prazo=12,
        )


# ---------- propriedades estruturais --------------------------------------


def test_resultado_imutavel_e_tipado():
    r = calcular_juros_simples(principal=Decimal("1000"), taxa=Decimal("0.01"), prazo=12)
    assert isinstance(r, SimpleInterestResult)
    assert isinstance(r.periodos, tuple)
    assert all(isinstance(p, SimplePeriod) for p in r.periodos)
    with pytest.raises((AttributeError, Exception)):
        r.juros_total = Decimal(0)  # type: ignore[misc]


def test_tamanho_periodos_igual_prazo():
    r = calcular_juros_simples(principal=Decimal("1000"), taxa=Decimal("0.01"), prazo=12)
    assert len(r.periodos) == 12
    # 1-indexed, sequência monotônica crescente
    assert [p.period for p in r.periodos] == list(range(1, 13))


def test_monotonicidade_juros_acumulado_simples():
    """Em juros simples, juros_acumulado(k+1) > juros_acumulado(k) para i>0."""
    r = calcular_juros_simples(principal=Decimal("1000"), taxa=Decimal("0.01"), prazo=24)
    for a, b in zip(r.periodos, r.periodos[1:], strict=False):
        assert b.juros_acumulado > a.juros_acumulado
        assert b.montante > a.montante


def test_taxa_zero_zera_juros():
    """i=0 ⇒ juros_total=0 e M=P."""
    r = calcular_juros_simples(principal=Decimal("1000"), taxa=Decimal("0"), prazo=12)
    assert r.juros_total == Decimal("0.00")
    assert r.montante_final == Decimal("1000.00")


def test_somente_keyword_arguments():
    """Assinatura usa `*`; chamada posicional deve falhar."""
    with pytest.raises(TypeError):
        calcular_juros_simples(Decimal("1000"), Decimal("0.01"), 12)  # type: ignore[misc]


def test_resultado_simples_retem_campos_de_entrada():
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa=Decimal("0.01"),
        prazo=12,
    )
    assert r.principal == Decimal("1000")
    assert r.taxa == Decimal("0.01")
    assert r.prazo == 12


def test_quantize_display_forca_round_half_even_mesmo_com_contexto_half_up():
    from decimal import ROUND_HALF_UP, localcontext

    from app.domain.interest._rounding import quantize_display

    with localcontext() as ctx:
        ctx.rounding = ROUND_HALF_UP
        assert quantize_display(Decimal("1.005")) == Decimal("1.00")
