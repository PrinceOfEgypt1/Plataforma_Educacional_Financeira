"""Conftest do pacote de testes backend.

Carrega o fixture JSON canônico em memória uma única vez por sessão, via
`pytest.fixture(scope="session")`, para que os testes parametrizados em
`test_simple.py` e `test_compound.py` consumam a mesma cópia imutável sem
IO por teste. O fixture é um artefato versionado em
`backend/tests/fixtures/financial_cases.json`; NÃO recomputamos valores
aqui, apenas lemos.
"""

from __future__ import annotations

import json
from decimal import Decimal
from pathlib import Path
from typing import Any

import pytest


def _fixture_path() -> Path:
    # conftest.py vive em backend/tests/; o fixture em backend/tests/fixtures/
    return Path(__file__).parent / "fixtures" / "financial_cases.json"


@pytest.fixture(scope="session")
def financial_cases() -> dict[str, Any]:
    """Documento completo lido do JSON canônico, sem transformações."""
    with _fixture_path().open(encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="session")
def simple_cases(financial_cases: dict[str, Any]) -> list[dict[str, Any]]:
    return list(financial_cases["simple_cases"])


@pytest.fixture(scope="session")
def compound_cases(financial_cases: dict[str, Any]) -> list[dict[str, Any]]:
    return list(financial_cases["compound_cases"])


@pytest.fixture(scope="session")
def simple_rejections(financial_cases: dict[str, Any]) -> list[dict[str, Any]]:
    return list(financial_cases["simple_rejections"])


@pytest.fixture(scope="session")
def compound_rejections(financial_cases: dict[str, Any]) -> list[dict[str, Any]]:
    return list(financial_cases["compound_rejections"])


def as_decimal(value: str) -> Decimal:
    """Conversão canônica string→Decimal para valores lidos do fixture.

    Isolada para que quaisquer testes que leiam manualmente o fixture usem a
    mesma política (construção a partir de string, nunca de float).
    """
    return Decimal(value)
