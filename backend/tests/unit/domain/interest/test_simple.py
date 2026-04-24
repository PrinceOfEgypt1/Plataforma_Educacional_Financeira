"""Testes unitários — juros simples (F2).

Cobertura pretendida:
    - casos canônicos (Doc 15 §JS-01, JS-02);
    - rejeição de entradas inválidas (JS-03 + tipos);
    - casos-limite válidos (taxa zero, principal zero);
    - consistência da tabela por período;
    - invariância J + PV == FV;
    - imutabilidade do resultado.

Marca: ``unit`` (markers declarados em backend/pyproject.toml).
"""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path

import pytest

from app.domain.interest import (
    DomainValidationError,
    PeriodoSimples,
    SimplesResultado,
    calcular_juros_simples,
)

pytestmark = pytest.mark.unit

FIXTURES_PATH = Path(__file__).resolve().parents[3] / "fixtures" / "financial_cases.json"


def _load_fixture() -> dict:
    with FIXTURES_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


# ─── Casos canônicos (Doc 15) ─────────────────────────────────────────


def test_js01_principal_1000_taxa_1pct_12m() -> None:
    """JS-01: 1000 × 1% a.m. × 12m → juros 120,00; montante 1120,00."""
    r = calcular_juros_simples(
        principal=Decimal("1000.00"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert isinstance(r, SimplesResultado)
    assert r.juros_totais == Decimal("120.00")
    assert r.montante_final == Decimal("1120.00")
    assert len(r.tabela) == 12


def test_js02_principal_5000_taxa_2pct_3m() -> None:
    """JS-02: 5000 × 2% a.m. × 3m → juros 300,00; montante 5300,00."""
    r = calcular_juros_simples(
        principal=Decimal("5000.00"),
        taxa_mensal=Decimal("0.02"),
        prazo_meses=3,
    )
    assert r.juros_totais == Decimal("300.00")
    assert r.montante_final == Decimal("5300.00")
    assert len(r.tabela) == 3


def test_golden_cases_from_fixture_simples() -> None:
    """Percorre todos os casos simples declarados no fixture oficial."""
    data = _load_fixture()
    for raw in data["simples"]:
        r = calcular_juros_simples(
            principal=Decimal(raw["principal"]),
            taxa_mensal=Decimal(raw["taxa_mensal"]),
            prazo_meses=int(raw["prazo_meses"]),
        )
        esperado_juros = Decimal(raw["juros_esperado"])
        esperado_mont = Decimal(raw["montante_esperado"])
        assert r.juros_totais == esperado_juros, raw["id"]
        assert r.montante_final == esperado_mont, raw["id"]


def test_grid_massa_100_cenarios_simples_from_fixture() -> None:
    """Valida a massa de cenários determinísticos de juros simples."""
    data = _load_fixture()
    massa = data.get("massa_grid", {}).get("simples", [])
    assert len(massa) >= 50, f"esperava >=50 cenários simples, achei {len(massa)}"
    for raw in massa:
        r = calcular_juros_simples(
            principal=Decimal(raw["principal"]),
            taxa_mensal=Decimal(raw["taxa_mensal"]),
            prazo_meses=int(raw["prazo_meses"]),
        )
        assert r.juros_totais == Decimal(raw["juros_esperado"]), raw["id"]
        assert r.montante_final == Decimal(raw["montante_esperado"]), raw["id"]


# ─── Rejeições explícitas ─────────────────────────────────────────────


def test_rejeita_prazo_zero() -> None:
    """JS-03: prazo zero deve levantar DomainValidationError."""
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=0,
        )
    assert exc.value.code == "NON_POSITIVE_PRAZO"
    assert exc.value.field == "prazo_meses"


def test_rejeita_prazo_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=-3,
        )
    assert exc.value.code == "NON_POSITIVE_PRAZO"


def test_rejeita_principal_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("-1.00"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
        )
    assert exc.value.code == "NEGATIVE_PRINCIPAL"


def test_rejeita_taxa_negativa() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("-0.01"),
            prazo_meses=12,
        )
    assert exc.value.code == "NEGATIVE_TAXA"


def test_rejeita_principal_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=1000,  # type: ignore[arg-type]
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
        )
    assert exc.value.code == "INVALID_PRINCIPAL_TYPE"


def test_rejeita_taxa_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=0.01,  # type: ignore[arg-type]
            prazo_meses=12,
        )
    assert exc.value.code == "INVALID_TAXA_TYPE"


def test_rejeita_prazo_bool() -> None:
    """Bool é subclasse de int em Python; deve ser rejeitado."""
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=True,  # type: ignore[arg-type]
        )
    assert exc.value.code == "INVALID_PRAZO_TYPE"


def test_rejeita_prazo_string() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses="12",  # type: ignore[arg-type]
        )
    assert exc.value.code == "INVALID_PRAZO_TYPE"


# ─── Casos-limite válidos ─────────────────────────────────────────────


def test_principal_zero_com_taxa_positiva() -> None:
    """Principal zero é válido; produz juros e montante zero."""
    r = calcular_juros_simples(
        principal=Decimal("0"),
        taxa_mensal=Decimal("0.05"),
        prazo_meses=10,
    )
    assert r.juros_totais == Decimal("0.00")
    assert r.montante_final == Decimal("0.00")
    assert len(r.tabela) == 10


def test_taxa_zero() -> None:
    """Taxa zero é válida; juros são zero, montante == principal."""
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0"),
        prazo_meses=12,
    )
    assert r.juros_totais == Decimal("0.00")
    assert r.montante_final == Decimal("1000.00")


def test_prazo_unitario() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=1,
    )
    assert r.juros_totais == Decimal("10.00")
    assert r.montante_final == Decimal("1010.00")
    assert len(r.tabela) == 1


# ─── Consistência da tabela por período ───────────────────────────────


def test_tabela_tem_tamanho_correto() -> None:
    r = calcular_juros_simples(
        principal=Decimal("2000"),
        taxa_mensal=Decimal("0.015"),
        prazo_meses=7,
    )
    assert len(r.tabela) == 7
    for i, linha in enumerate(r.tabela, start=1):
        assert isinstance(linha, PeriodoSimples)
        assert linha.periodo == i


def test_tabela_saldo_final_ultimo_igual_montante() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert r.tabela[-1].saldo_final == r.montante_final


def test_tabela_saldo_inicial_primeiro_igual_principal() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1234.56"),
        taxa_mensal=Decimal("0.013"),
        prazo_meses=9,
    )
    assert r.tabela[0].saldo_inicial == Decimal("1234.56")


def test_tabela_juros_por_periodo_constante() -> None:
    """Em juros simples, juros_periodo é constante."""
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=5,
    )
    esperados = [linha.juros_periodo for linha in r.tabela]
    assert esperados == [Decimal("10.00")] * 5


def test_invariante_juros_mais_principal_igual_montante() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert r.juros_totais + r.principal == r.montante_final


# ─── Imutabilidade dos resultados ─────────────────────────────────────


def test_resultado_eh_frozen() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=3,
    )
    with pytest.raises((AttributeError, TypeError)):
        r.principal = Decimal("9999")  # type: ignore[misc]


def test_periodo_simples_frozen() -> None:
    r = calcular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=2,
    )
    with pytest.raises((AttributeError, TypeError)):
        r.tabela[0].periodo = 99  # type: ignore[misc]
