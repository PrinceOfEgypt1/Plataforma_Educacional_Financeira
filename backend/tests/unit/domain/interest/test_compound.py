"""Testes unitários — juros compostos (F2).

Cobertura pretendida:
    - casos canônicos (Doc 15 §JC-01, JC-02, JC-03);
    - rejeição de entradas inválidas;
    - casos-limite válidos (taxa zero, taxa zero + aporte);
    - consistência da tabela por período;
    - comparação composto vs simples;
    - imutabilidade.

Marca: ``unit``.
"""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path
from typing import Any

import pytest

from app.domain.interest import (
    CompostosResultado,
    DomainValidationError,
    PeriodoComposto,
    calcular_juros_compostos,
    calcular_juros_simples,
)
from app.domain.interest._rounding import money

pytestmark = pytest.mark.unit

FIXTURES_PATH = Path(__file__).resolve().parents[3] / "fixtures" / "financial_cases.json"


def _load_fixture() -> dict[str, Any]:
    with FIXTURES_PATH.open(encoding="utf-8") as fh:
        data: dict[str, Any] = json.load(fh)
    return data


# ─── Casos canônicos (Doc 15) ─────────────────────────────────────────


def test_jc01_principal_1000_taxa_1pct_12m_sem_aporte() -> None:
    """JC-01: 1000 × (1,01)^12 → 1126,83."""
    r = calcular_juros_compostos(
        principal=Decimal("1000.00"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert isinstance(r, CompostosResultado)
    assert r.montante_final == Decimal("1126.83")
    assert r.aporte_mensal == Decimal("0")
    assert len(r.tabela) == 12


def test_jc02_principal_10000_taxa_2pct_24m_sem_aporte() -> None:
    """JC-02: 10000 × (1,02)^24 → 16084,37."""
    r = calcular_juros_compostos(
        principal=Decimal("10000.00"),
        taxa_mensal=Decimal("0.02"),
        prazo_meses=24,
    )
    assert r.montante_final == Decimal("16084.37")


def test_jc03_com_aporte_mensal() -> None:
    """JC-03: 1000, 1%, 12m, aporte 100/mês → 2395,08."""
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=Decimal("100"),
    )
    assert r.montante_final == Decimal("2395.08")
    assert r.total_aportado == Decimal("1200.00")
    assert r.total_investido == Decimal("2200.00")


def test_golden_cases_from_fixture_compostos() -> None:
    data = _load_fixture()
    for raw in data["compostos"]:
        aporte_raw = raw.get("aporte_mensal", "0")
        r = calcular_juros_compostos(
            principal=Decimal(raw["principal"]),
            taxa_mensal=Decimal(raw["taxa_mensal"]),
            prazo_meses=int(raw["prazo_meses"]),
            aporte_mensal=Decimal(aporte_raw),
        )
        assert r.montante_final == Decimal(raw["montante_esperado"]), raw["id"]


def test_grid_massa_100_cenarios_compostos_from_fixture() -> None:
    data = _load_fixture()
    massa = data.get("massa_grid", {}).get("compostos", [])
    assert len(massa) >= 50, f"esperava >=50 cenários compostos, achei {len(massa)}"
    for raw in massa:
        r = calcular_juros_compostos(
            principal=Decimal(raw["principal"]),
            taxa_mensal=Decimal(raw["taxa_mensal"]),
            prazo_meses=int(raw["prazo_meses"]),
        )
        assert r.montante_final == Decimal(raw["montante_esperado"]), raw["id"]


# ─── Rejeições ────────────────────────────────────────────────────────


def test_rejeita_prazo_zero() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=0,
        )
    assert exc.value.code == "NON_POSITIVE_PRAZO"


def test_rejeita_prazo_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=-5,
        )
    assert exc.value.code == "NON_POSITIVE_PRAZO"


def test_rejeita_principal_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("-0.01"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
        )
    assert exc.value.code == "NEGATIVE_PRINCIPAL"


def test_rejeita_taxa_negativa() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("-0.005"),
            prazo_meses=12,
        )
    assert exc.value.code == "NEGATIVE_TAXA"


def test_rejeita_aporte_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
            aporte_mensal=Decimal("-10"),
        )
    assert exc.value.code == "NEGATIVE_APORTE"


def test_rejeita_aporte_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
            aporte_mensal=100.0,  # type: ignore[arg-type]
        )
    assert exc.value.code == "INVALID_APORTE_TYPE"


def test_rejeita_prazo_bool() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=False,
        )
    assert exc.value.code == "INVALID_PRAZO_TYPE"


def test_rejeita_principal_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal="1000",  # type: ignore[arg-type]
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
        )
    assert exc.value.code == "INVALID_PRINCIPAL_TYPE"


def test_rejeita_taxa_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal="0.01",  # type: ignore[arg-type]
            prazo_meses=12,
        )
    assert exc.value.code == "INVALID_TAXA_TYPE"


def test_aporte_none_equivale_a_zero() -> None:
    """``aporte_mensal=None`` deve produzir resultado idêntico a zero."""
    r_none = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=6,
    )
    r_zero = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=6,
        aporte_mensal=Decimal("0"),
    )
    assert r_none.montante_final == r_zero.montante_final
    assert r_none.juros_totais == r_zero.juros_totais


# ─── Casos-limite válidos ─────────────────────────────────────────────


def test_taxa_zero_sem_aporte_retorna_principal() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("500"),
        taxa_mensal=Decimal("0"),
        prazo_meses=12,
    )
    assert r.juros_totais == Decimal("0.00")
    assert r.montante_final == Decimal("500.00")


def test_taxa_zero_com_aporte_equivale_soma_linear() -> None:
    """Com i=0, montante = principal + aporte × n."""
    r = calcular_juros_compostos(
        principal=Decimal("500"),
        taxa_mensal=Decimal("0"),
        prazo_meses=10,
        aporte_mensal=Decimal("50"),
    )
    assert r.montante_final == Decimal("1000.00")
    assert r.juros_totais == Decimal("0.00")


def test_principal_zero_com_aporte() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("0"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=Decimal("100"),
    )
    assert r.total_aportado == Decimal("1200.00")
    assert r.montante_final > Decimal("1200.00")


def test_prazo_unitario_sem_aporte() -> None:
    """Com n=1, montante = principal × (1 + i)."""
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=1,
    )
    assert r.montante_final == Decimal("1010.00")


# ─── Consistência da tabela ───────────────────────────────────────────


def test_tabela_comprimento_igual_prazo() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=5,
    )
    assert len(r.tabela) == 5


def test_tabela_periodos_sequenciais() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=4,
    )
    assert [linha.periodo for linha in r.tabela] == [1, 2, 3, 4]


def test_tabela_ultimo_saldo_igual_montante() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert r.tabela[-1].saldo_final == r.montante_final


def test_tabela_primeiro_saldo_inicial_igual_principal() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1234.56"),
        taxa_mensal=Decimal("0.02"),
        prazo_meses=8,
    )
    assert r.tabela[0].saldo_inicial == Decimal("1234.56")


def test_tabela_saldo_final_igual_inicial_mais_juros_mais_aporte() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=3,
        aporte_mensal=Decimal("50"),
    )
    for linha in r.tabela:
        esperado = linha.saldo_inicial + linha.juros_periodo + linha.aporte
        assert money(esperado) == linha.saldo_final, linha.periodo


def test_composto_maior_que_simples_quando_i_positivo_e_n_maior_1() -> None:
    """Para i > 0 e n > 1, montante composto > montante simples."""
    p = Decimal("1000")
    i = Decimal("0.01")
    n = 12
    simples = calcular_juros_simples(p, i, n)
    composto = calcular_juros_compostos(p, i, n)
    assert composto.montante_final > simples.montante_final


def test_composto_igual_simples_quando_n_igual_1() -> None:
    """Para n=1, composto == simples (sem aporte)."""
    p = Decimal("1000")
    i = Decimal("0.01")
    simples = calcular_juros_simples(p, i, 1)
    composto = calcular_juros_compostos(p, i, 1)
    assert composto.montante_final == simples.montante_final


def test_totais_consistentes_com_aporte() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=Decimal("100"),
    )
    assert r.total_aportado == Decimal("1200.00")
    principal_q = r.principal.quantize(Decimal("0.01"))
    assert r.total_investido == principal_q + r.total_aportado
    assert r.juros_totais == r.montante_final - r.total_investido


# ─── Imutabilidade ────────────────────────────────────────────────────


def test_resultado_composto_frozen() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=3,
    )
    with pytest.raises((AttributeError, TypeError)):
        r.montante_final = Decimal("0")  # type: ignore[misc]


def test_periodo_composto_frozen() -> None:
    r = calcular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=2,
    )
    assert isinstance(r.tabela[0], PeriodoComposto)
    with pytest.raises((AttributeError, TypeError)):
        r.tabela[0].saldo_final = Decimal("0")  # type: ignore[misc]
