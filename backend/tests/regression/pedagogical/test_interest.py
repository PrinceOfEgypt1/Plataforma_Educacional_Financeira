"""Regressao pedagogica herdada da Sprint 2 para o modulo de juros."""

from __future__ import annotations

from decimal import Decimal
from typing import Any

import pytest

from app.services.interest.calcular_juros_service import (
    comparar_juros,
    simular_juros_compostos,
    simular_juros_simples,
)

pytestmark = pytest.mark.regression

CANONICAL_KEYS = {"summary", "tables", "charts", "interpretation", "alerts"}


def _assert_payload_pedagogico(data: dict[str, Any]) -> None:
    assert set(data.keys()) == CANONICAL_KEYS
    assert isinstance(data["summary"], dict)
    assert data["summary"]
    assert isinstance(data["tables"], dict)
    assert data["tables"]
    assert isinstance(data["charts"], list)
    assert data["charts"]
    assert isinstance(data["interpretation"], dict)
    assert {"headline", "body"}.issubset(data["interpretation"])
    assert isinstance(data["alerts"], list)


def test_juros_simples_preserva_blocos_pedagogicos() -> None:
    data = simular_juros_simples(
        principal=Decimal("1000.00"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )

    _assert_payload_pedagogico(data)
    assert "amortizacao" in data["tables"]
    assert data["charts"][0]["series"]


def test_juros_compostos_preserva_blocos_pedagogicos() -> None:
    data = simular_juros_compostos(
        principal=Decimal("1000.00"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
        aporte_mensal=Decimal("100.00"),
    )

    _assert_payload_pedagogico(data)
    assert "amortizacao" in data["tables"]
    assert data["charts"][0]["series"]


def test_comparar_juros_preserva_blocos_pedagogicos_e_tabelas_aninhadas() -> None:
    data = comparar_juros(
        principal=Decimal("1000.00"),
        taxa_mensal=Decimal("0.01"),
        prazo_meses=12,
    )

    _assert_payload_pedagogico(data)
    assert set(data["tables"].keys()) == {"simple", "compound"}
    assert len(data["charts"][0]["series"]) == 2
