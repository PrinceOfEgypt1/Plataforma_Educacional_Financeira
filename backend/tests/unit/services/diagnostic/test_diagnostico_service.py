"""Unitários do service de diagnóstico financeiro — Sprint 4 / F2."""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.core.errors import ValidationError
from app.services.diagnostic import analisar

CANONICAL_DATA_KEYS = {
    "renda_mensal",
    "total_despesas_fixas",
    "total_despesas_variaveis",
    "total_dividas_mensais",
    "total_reserva_atual",
    "sobra_mensal",
    "despesas_essenciais_mensais",
    "comprometimento_percentual",
    "sobra_percentual",
    "reserva_em_meses",
    "comprometimento_nivel",
    "reserva_nivel",
    "sobra_nivel",
    "pontos_comprometimento",
    "pontos_reserva",
    "pontos_sobra",
    "score",
    "saude_nivel",
    "alertas",
}


# ---------------------------------------------------------------------------
# DG-01 — cenário saudável com reserva insuficiente
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_analisar_dg01_retorna_chaves_canonicas() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    assert set(data.keys()) == CANONICAL_DATA_KEYS


@pytest.mark.unit
def test_analisar_dg01_valores_canonicos() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    assert data["sobra_mensal"] == Decimal("1700.00")
    assert data["despesas_essenciais_mensais"] == Decimal("2800.00")
    assert data["comprometimento_percentual"] == Decimal("10.00")
    assert data["sobra_percentual"] == Decimal("34.00")
    assert data["reserva_em_meses"] == Decimal("1.43")
    assert data["comprometimento_nivel"] == "baixo"
    assert data["reserva_nivel"] == "insuficiente"
    assert data["sobra_nivel"] == "boa"
    assert data["score"] == 7
    assert data["saude_nivel"] == "boa"


@pytest.mark.unit
def test_analisar_dg01_alerta_reserva_insuficiente() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    codes = [a["code"] for a in data["alertas"]]
    assert "RESERVA_INSUFICIENTE" in codes
    alerta = next(a for a in data["alertas"] if a["code"] == "RESERVA_INSUFICIENTE")
    assert alerta["level"] == "warning"
    assert alerta["dimension"] == "reserva"


# ---------------------------------------------------------------------------
# DG-02 — cenário crítico por sobra negativa e reserva crítica
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_analisar_dg02_valores_canonicos() -> None:
    data = analisar(
        renda_mensal=Decimal("3000.00"),
        total_despesas_fixas=Decimal("2200.00"),
        total_despesas_variaveis=Decimal("700.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("0.00"),
    )
    assert data["sobra_mensal"] == Decimal("-400.00")
    assert data["comprometimento_percentual"] == Decimal("16.67")
    assert data["reserva_em_meses"] == Decimal("0.00")
    assert data["sobra_percentual"] == Decimal("-13.33")
    assert data["comprometimento_nivel"] == "baixo"
    assert data["reserva_nivel"] == "critica"
    assert data["sobra_nivel"] == "negativa"
    assert data["score"] == 3
    assert data["saude_nivel"] == "critica"


@pytest.mark.unit
def test_analisar_dg02_alertas_criticos() -> None:
    data = analisar(
        renda_mensal=Decimal("3000.00"),
        total_despesas_fixas=Decimal("2200.00"),
        total_despesas_variaveis=Decimal("700.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("0.00"),
    )
    codes = [a["code"] for a in data["alertas"]]
    assert "RESERVA_CRITICA" in codes
    assert "SOBRA_NEGATIVA" in codes


# ---------------------------------------------------------------------------
# Erros de domínio propagados como ValidationError
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_analisar_renda_zero_levanta_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        analisar(
            renda_mensal=Decimal("0.00"),
            total_despesas_fixas=Decimal("1000.00"),
            total_despesas_variaveis=Decimal("500.00"),
            total_dividas_mensais=Decimal("200.00"),
            total_reserva_atual=Decimal("3000.00"),
        )
    assert exc_info.value.errors is not None
    codes = [e["code"] for e in exc_info.value.errors]
    assert "RENDA_NAO_POSITIVA" in codes


@pytest.mark.unit
def test_analisar_despesas_essenciais_zero_levanta_validation_error() -> None:
    with pytest.raises(ValidationError) as exc_info:
        analisar(
            renda_mensal=Decimal("5000.00"),
            total_despesas_fixas=Decimal("0.00"),
            total_despesas_variaveis=Decimal("0.00"),
            total_dividas_mensais=Decimal("0.00"),
            total_reserva_atual=Decimal("10000.00"),
        )
    assert exc_info.value.errors is not None
    codes = [e["code"] for e in exc_info.value.errors]
    assert "DESPESAS_ESSENCIAIS_ZERO" in codes


# ---------------------------------------------------------------------------
# Tipos de saída — Decimal preservado no dict retornado pelo service
# ---------------------------------------------------------------------------


@pytest.mark.unit
def test_analisar_retorna_decimal_em_campos_monetarios() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    for campo in (
        "renda_mensal",
        "sobra_mensal",
        "despesas_essenciais_mensais",
        "comprometimento_percentual",
        "sobra_percentual",
        "reserva_em_meses",
    ):
        assert isinstance(data[campo], Decimal), f"{campo} não é Decimal"


@pytest.mark.unit
def test_analisar_retorna_int_em_pontos_e_score() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    for campo in ("pontos_comprometimento", "pontos_reserva", "pontos_sobra", "score"):
        assert isinstance(data[campo], int), f"{campo} não é int"


@pytest.mark.unit
def test_analisar_retorna_lista_alertas() -> None:
    data = analisar(
        renda_mensal=Decimal("5000.00"),
        total_despesas_fixas=Decimal("2000.00"),
        total_despesas_variaveis=Decimal("800.00"),
        total_dividas_mensais=Decimal("500.00"),
        total_reserva_atual=Decimal("4000.00"),
    )
    assert isinstance(data["alertas"], list)
    for alerta in data["alertas"]:
        assert "code" in alerta
        assert "level" in alerta
        assert "dimension" in alerta
