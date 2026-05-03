"""Unitarios do service de amortizacao da Sprint 3/F3."""

from __future__ import annotations

from decimal import Decimal
from typing import Any

import pytest

from app.core.errors import ValidationError
from app.services.amortization import comparar_price_sac, simular_price, simular_sac

CANONICAL_DATA_KEYS = {
    "summary",
    "tables",
    "charts",
    "interpretation",
    "alerts",
}


def _assert_rows_close(rows: list[dict[str, Any]], principal: Decimal) -> None:
    for row in rows:
        assert row["juros"] + row["amortizacao"] == row["parcela"]

    assert sum((row["parcela"] for row in rows), Decimal("0.00")) >= principal
    assert sum((row["juros"] for row in rows), Decimal("0.00")) >= Decimal("0.00")
    assert sum((row["amortizacao"] for row in rows), Decimal("0.00")) == principal
    assert rows[-1]["saldo_final"] == Decimal("0.00")


def _assert_summary_matches_rows(data: dict[str, Any], principal: Decimal) -> None:
    rows = data["tables"]["amortizacao"]
    summary = data["summary"]
    _assert_rows_close(rows, principal)
    assert sum((row["parcela"] for row in rows), Decimal("0.00")) == summary["total_pago"]
    assert sum((row["juros"] for row in rows), Decimal("0.00")) == summary["total_juros"]
    assert sum((row["amortizacao"] for row in rows), Decimal("0.00")) == principal
    assert summary["saldo_final"] == Decimal("0.00")


@pytest.mark.unit
def test_simular_price_caso_canonico_preserva_fechamento_f2() -> None:
    data = simular_price(
        principal=Decimal("100000.00"),
        taxa_periodo=Decimal("0.01"),
        n_periodos=12,
    )

    assert set(data.keys()) == CANONICAL_DATA_KEYS
    summary = data["summary"]
    assert summary["sistema"] == "PRICE"
    assert summary["parcela"] == Decimal("8884.88")
    assert summary["total_pago"] == Decimal("106618.53")
    assert summary["total_juros"] == Decimal("6618.53")
    assert len(data["tables"]["amortizacao"]) == 12
    _assert_summary_matches_rows(data, Decimal("100000.00"))


@pytest.mark.unit
def test_simular_sac_caso_canonico_preserva_fechamento_f2() -> None:
    data = simular_sac(
        principal=Decimal("100000.00"),
        taxa_periodo=Decimal("0.01"),
        n_periodos=12,
    )

    assert set(data.keys()) == CANONICAL_DATA_KEYS
    summary = data["summary"]
    assert summary["sistema"] == "SAC"
    assert summary["amortizacao_constante"] == Decimal("8333.33")
    assert summary["total_pago"] == Decimal("106500.00")
    assert summary["total_juros"] == Decimal("6500.00")
    assert len(data["tables"]["amortizacao"]) == 12
    _assert_summary_matches_rows(data, Decimal("100000.00"))


@pytest.mark.unit
def test_comparar_price_sac_caso_canonico() -> None:
    data = comparar_price_sac(
        principal=Decimal("100000.00"),
        taxa_periodo=Decimal("0.01"),
        n_periodos=12,
    )

    assert set(data.keys()) == CANONICAL_DATA_KEYS
    summary = data["summary"]
    assert summary["price"]["total_juros"] == Decimal("6618.53")
    assert summary["sac"]["total_juros"] == Decimal("6500.00")
    assert summary["diferenca_juros"] == Decimal("118.53")
    assert summary["menor_total_juros"] == "SAC"
    assert summary["sac"]["total_juros"] < summary["price"]["total_juros"]
    assert set(data["tables"].keys()) == {"price", "sac"}


@pytest.mark.unit
def test_service_rejeita_principal_zero_na_borda_f3() -> None:
    with pytest.raises(ValidationError) as exc_info:
        simular_price(
            principal=Decimal("0.00"),
            taxa_periodo=Decimal("0.01"),
            n_periodos=12,
        )

    assert exc_info.value.status_code == 422
    assert exc_info.value.code == "VALIDATION_ERROR"
    assert exc_info.value.errors
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NON_POSITIVE_PRINCIPAL"
    assert errors[0]["field"] == "principal"


@pytest.mark.unit
def test_service_converte_erros_do_dominio_para_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        simular_sac(
            principal=Decimal("1000.00"),
            taxa_periodo=Decimal("-0.01"),
            n_periodos=12,
        )

    assert exc_info.value.status_code == 422
    assert exc_info.value.errors
    errors = exc_info.value.errors
    assert errors is not None
    assert errors[0]["code"] == "NEGATIVE_TAXA"
