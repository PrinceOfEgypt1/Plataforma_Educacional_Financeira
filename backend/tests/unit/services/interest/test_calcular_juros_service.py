"""Testes unitários do service de juros — F3.

Escopo: o service é uma bridge fina entre API e domínio. Os testes
aqui cobrem:

    1. Orquestração correta (chama domínio com os tipos certos,
       monta ``data`` canônico com as chaves esperadas).
    2. Conversão obrigatória de ``DomainValidationError`` (puro) em
       ``core.errors.ValidationError`` (status 422 / RFC 7807).
    3. Casos canônicos JS-01/JS-02/JC-01/JC-02/JC-03 (Doc 15 §3–§4).
    4. Forma canônica do ``/compare`` — ``tables`` é um único campo
       do envelope, contendo as duas tabelas aninhadas sob ``simple``
       e ``compound`` (**sem** ``tables_simples``/``tables_compostos``).
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.core.errors import ValidationError
from app.services.interest.calcular_juros_service import (
    comparar_juros,
    simular_juros_compostos,
    simular_juros_simples,
)

# ──────────────────────────────────────────────────────────────────────────
# Juros simples
# ──────────────────────────────────────────────────────────────────────────


@pytest.mark.unit
def test_simular_juros_simples_caso_js01() -> None:
    """JS-01: PV=1000, i=1% a.m., n=12 → J=120, FV=1120."""
    data = simular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )

    assert set(data.keys()) == {
        "summary",
        "tables",
        "charts",
        "interpretation",
        "alerts",
    }
    summary = data["summary"]
    assert summary["juros_totais"] == Decimal("120.00")
    assert summary["montante_final"] == Decimal("1120.00")

    tabela = data["tables"]["amortizacao"]
    assert len(tabela) == 12
    assert tabela[0]["periodo"] == 1
    assert tabela[-1]["saldo_final"] == Decimal("1120.00")


@pytest.mark.unit
def test_simular_juros_simples_caso_js02() -> None:
    """JS-02: PV=5000, i=2% a.m., n=3 → J=300, FV=5300."""
    data = simular_juros_simples(
        principal=Decimal("5000"),
        taxa_mensal=Decimal("0.02"),
        prazo_meses=3,
    )
    assert data["summary"]["juros_totais"] == Decimal("300.00")
    assert data["summary"]["montante_final"] == Decimal("5300.00")
    assert len(data["tables"]["amortizacao"]) == 3


@pytest.mark.unit
def test_simular_juros_simples_principal_zero() -> None:
    """Principal zero é válido; juros e montante devem ser zero."""
    data = simular_juros_simples(
        principal=Decimal("0"),
        taxa_mensal=Decimal("0.05"),
        prazo_meses=6,
    )
    assert data["summary"]["juros_totais"] == Decimal("0.00")
    assert data["summary"]["montante_final"] == Decimal("0.00")


@pytest.mark.unit
def test_simular_juros_simples_taxa_zero() -> None:
    """Taxa zero é válida; juros devem ser zero, montante = principal."""
    data = simular_juros_simples(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0"),
        prazo_meses=12,
    )
    assert data["summary"]["juros_totais"] == Decimal("0.00")
    assert data["summary"]["montante_final"] == Decimal("1000.00")


@pytest.mark.unit
def test_simular_juros_simples_prazo_invalido_gera_validation_error() -> None:
    """Prazo zero deve ser convertido em core.errors.ValidationError."""
    with pytest.raises(ValidationError) as exc_info:
        simular_juros_simples(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=0,
        )
    assert exc_info.value.code == "VALIDATION_ERROR"
    assert exc_info.value.status_code == 422
    assert exc_info.value.errors
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NON_POSITIVE_PRAZO"


@pytest.mark.unit
def test_simular_juros_simples_principal_negativo_gera_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        simular_juros_simples(
            principal=Decimal("-1"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
        )
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NEGATIVE_PRINCIPAL"


# ──────────────────────────────────────────────────────────────────────────
# Juros compostos
# ──────────────────────────────────────────────────────────────────────────


@pytest.mark.unit
def test_simular_juros_compostos_caso_jc01() -> None:
    """JC-01: PV=1000, i=1% a.m., n=12 → FV ≈ 1126,83."""
    data = simular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=None,
    )

    assert set(data.keys()) == {
        "summary",
        "tables",
        "charts",
        "interpretation",
        "alerts",
    }
    summary = data["summary"]
    assert summary["montante_final"] == Decimal("1126.83")
    assert summary["juros_totais"] == Decimal("126.83")
    assert summary["aporte_mensal"] == Decimal("0.00")
    assert summary["total_aportado"] == Decimal("0.00")
    assert summary["total_investido"] == Decimal("1000.00")

    tabela = data["tables"]["amortizacao"]
    assert len(tabela) == 12


@pytest.mark.unit
def test_simular_juros_compostos_caso_jc02_com_aporte() -> None:
    """JC-02: PV=1000, i=1% a.m., n=12, aporte=100 — verifica montante > JC-01."""
    data = simular_juros_compostos(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=Decimal("100"),
    )
    summary = data["summary"]
    assert summary["aporte_mensal"] == Decimal("100.00")
    assert summary["total_aportado"] == Decimal("1200.00")
    assert summary["total_investido"] == Decimal("2200.00")
    # Montante com aporte é maior que o do principal puro
    assert summary["montante_final"] > Decimal("1126.83")


@pytest.mark.unit
def test_simular_juros_compostos_caso_jc03_prazo_longo() -> None:
    """JC-03: PV=100, i=1% a.m., n=60 — verifica não-quebra com prazo longo."""
    data = simular_juros_compostos(
        principal=Decimal("100"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=60,
        aporte_mensal=None,
    )
    # (1.01)^60 ≈ 1.81669670
    assert data["summary"]["montante_final"] > Decimal("181.00")
    assert data["summary"]["montante_final"] < Decimal("182.00")
    assert len(data["tables"]["amortizacao"]) == 60


@pytest.mark.unit
def test_simular_juros_compostos_aporte_negativo_gera_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        simular_juros_compostos(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=12,
            aporte_mensal=Decimal("-1"),
        )
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NEGATIVE_APORTE"


# ──────────────────────────────────────────────────────────────────────────
# Comparar — forma canônica
# ──────────────────────────────────────────────────────────────────────────


@pytest.mark.unit
def test_comparar_juros_composto_sempre_maior_ou_igual() -> None:
    """Para i>0 e n>1, compostos > simples."""
    data = comparar_juros(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )
    assert data["summary"]["montante_composto"] > data["summary"]["montante_simples"]
    assert data["summary"]["diferenca"] > Decimal("0")
    # Forma canônica: tables é dict com chaves simple/compound.
    assert "simple" in data["tables"]
    assert "compound" in data["tables"]
    assert len(data["tables"]["simple"]) == 12
    assert len(data["tables"]["compound"]) == 12


@pytest.mark.unit
def test_comparar_juros_igualdade_quando_taxa_zero() -> None:
    """Taxa zero ⇒ composto == simples."""
    data = comparar_juros(
        principal=Decimal("1000"),
        taxa_mensal=Decimal("0"),
        prazo_meses=12,
    )
    assert data["summary"]["montante_simples"] == data["summary"]["montante_composto"]
    assert data["summary"]["diferenca"] == Decimal("0.00")


@pytest.mark.unit
def test_comparar_juros_prazo_invalido_gera_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        comparar_juros(
            principal=Decimal("1000"),
            taxa_mensal=Decimal("0.01"),
            prazo_meses=-1,
        )
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NON_POSITIVE_PRAZO"


# ──────────────────────────────────────────────────────────────────────────
# Shape do ``data`` canônico
# ──────────────────────────────────────────────────────────────────────────


@pytest.mark.unit
def test_data_canonico_simples_tem_chaves_esperadas() -> None:
    data = simular_juros_simples(
        Decimal("1000"),
        Decimal("0.01"),
        12,
    )
    assert "summary" in data
    assert "tables" in data
    assert "amortizacao" in data["tables"]
    assert "charts" in data
    assert len(data["charts"]) == 1
    assert "interpretation" in data
    assert {"headline", "body"}.issubset(data["interpretation"])
    assert "alerts" in data


@pytest.mark.unit
def test_data_canonico_comparar_respeita_envelope_unico() -> None:
    """``/compare`` deve ter exatamente 5 campos canônicos, nada a mais.

    Em particular, a forma **não** pode expor ``tables_simples`` ou
    ``tables_compostos`` como campos independentes — as duas tabelas
    ficam aninhadas dentro de ``tables`` sob ``simple`` e ``compound``.
    """
    data = comparar_juros(
        Decimal("1000"),
        Decimal("0.01"),
        12,
    )
    assert set(data.keys()) == {
        "summary",
        "tables",
        "charts",
        "interpretation",
        "alerts",
    }
    assert "tables_simples" not in data
    assert "tables_compostos" not in data
    assert set(data["tables"].keys()) == {"simple", "compound"}
    assert len(data["charts"][0]["series"]) == 2
