"""Testes unitarios do dominio PRICE."""

from __future__ import annotations

import json
from dataclasses import FrozenInstanceError
from decimal import Decimal
from pathlib import Path
from typing import Any

import pytest

from app.domain.amortization import DomainValidationError, PriceResultado, calcular_price

pytestmark = pytest.mark.unit

FIXTURES_PATH = Path(__file__).resolve().parents[3] / "fixtures" / "financial_cases.json"


def _load_fixture() -> dict[str, Any]:
    with FIXTURES_PATH.open(encoding="utf-8") as fh:
        data: dict[str, Any] = json.load(fh)
    return data


def _assert_resultado_fecha(resultado: PriceResultado, principal: Decimal) -> None:
    tabela = resultado.tabela_periodo
    assert tabela
    for linha in tabela:
        assert linha.juros + linha.amortizacao == linha.parcela
        assert linha.saldo_inicial - linha.amortizacao == linha.saldo_final

    assert sum((linha.parcela for linha in tabela), Decimal("0.00")) == resultado.total_pago
    assert sum((linha.juros for linha in tabela), Decimal("0.00")) == resultado.total_juros
    assert sum((linha.amortizacao for linha in tabela), Decimal("0.00")) == principal
    assert tabela[-1].saldo_final == resultado.saldo_final
    assert resultado.saldo_final == Decimal("0.00")


def test_price_pr01_caso_padrao_fecha_tabela_e_totais() -> None:
    resultado = calcular_price(Decimal("100000.00"), Decimal("0.01"), 12)

    assert isinstance(resultado, PriceResultado)
    assert resultado.parcela == Decimal("8884.88")
    assert resultado.total_pago == Decimal("106618.53")
    assert resultado.total_juros == Decimal("6618.53")
    assert len(resultado.tabela_periodo) == 12
    assert resultado.tabela_periodo[0].parcela == Decimal("8884.88")
    assert resultado.tabela_periodo[-1].parcela == Decimal("8884.85")
    _assert_resultado_fecha(resultado, Decimal("100000.00"))


def test_price_pr02_juros_decrescem_e_amortizacao_cresce() -> None:
    resultado = calcular_price(Decimal("100000.00"), Decimal("0.01"), 12)
    primeira = resultado.tabela_periodo[0]
    ultima = resultado.tabela_periodo[-1]

    assert primeira.juros > ultima.juros
    assert ultima.amortizacao > primeira.amortizacao
    assert all(
        atual.juros >= proxima.juros
        for atual, proxima in zip(
            resultado.tabela_periodo, resultado.tabela_periodo[1:], strict=False
        )
    )
    assert all(
        atual.amortizacao <= proxima.amortizacao
        for atual, proxima in zip(
            resultado.tabela_periodo, resultado.tabela_periodo[1:], strict=False
        )
    )


def test_price_parcela_canonica_constante_ate_penultima_linha() -> None:
    resultado = calcular_price(Decimal("100000.00"), Decimal("0.01"), 12)
    parcelas_regulares = [linha.parcela for linha in resultado.tabela_periodo[:-1]]

    assert parcelas_regulares
    assert all(parcela == resultado.parcela for parcela in parcelas_regulares)


def test_price_taxa_zero_amortiza_sem_juros() -> None:
    resultado = calcular_price(Decimal("1000.00"), Decimal("0"), 3)

    assert resultado.total_juros == Decimal("0.00")
    assert resultado.total_pago == Decimal("1000.00")
    assert [linha.parcela for linha in resultado.tabela_periodo] == [
        Decimal("333.33"),
        Decimal("333.33"),
        Decimal("333.34"),
    ]
    _assert_resultado_fecha(resultado, Decimal("1000.00"))


def test_price_prazo_unitario() -> None:
    resultado = calcular_price(Decimal("1000.00"), Decimal("0.01"), 1)

    assert len(resultado.tabela_periodo) == 1
    linha = resultado.tabela_periodo[0]
    assert linha.juros == Decimal("10.00")
    assert linha.amortizacao == Decimal("1000.00")
    assert linha.parcela == Decimal("1010.00")
    _assert_resultado_fecha(resultado, Decimal("1000.00"))


def test_price_principal_zero_e_valido() -> None:
    resultado = calcular_price(Decimal("0.00"), Decimal("0.05"), 6)

    assert resultado.total_pago == Decimal("0.00")
    assert resultado.total_juros == Decimal("0.00")
    _assert_resultado_fecha(resultado, Decimal("0.00"))


def test_price_golden_cases_from_fixture() -> None:
    data = _load_fixture()
    cases = data["amortization"]["price"]
    assert cases

    for raw in cases:
        resultado = calcular_price(
            Decimal(raw["principal"]),
            Decimal(raw["taxa_periodo"]),
            int(raw["n_periodos"]),
        )
        assert resultado.parcela == Decimal(raw["parcela_regular"]), raw["id"]
        assert resultado.total_pago == Decimal(raw["total_pago"]), raw["id"]
        assert resultado.total_juros == Decimal(raw["total_juros"]), raw["id"]
        assert resultado.tabela_periodo[-1].parcela == Decimal(raw["ultima_parcela"]), raw["id"]
        _assert_resultado_fecha(resultado, Decimal(raw["principal"]))


def test_price_rejeita_principal_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("-0.01"), Decimal("0.01"), 12)
    assert exc.value.code == "NEGATIVE_PRINCIPAL"
    assert exc.value.field == "principal"


def test_price_rejeita_taxa_negativa() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.00"), Decimal("-0.01"), 12)
    assert exc.value.code == "NEGATIVE_TAXA"


def test_price_rejeita_prazo_zero() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.00"), Decimal("0.01"), 0)
    assert exc.value.code == "NON_POSITIVE_N_PERIODOS"


def test_price_rejeita_prazo_bool() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.00"), Decimal("0.01"), True)
    assert exc.value.code == "INVALID_N_PERIODOS_TYPE"


def test_price_rejeita_prazo_nao_int() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.00"), Decimal("0.01"), "12")  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_N_PERIODOS_TYPE"


def test_price_rejeita_principal_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(1000, Decimal("0.01"), 12)  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_PRINCIPAL_TYPE"


def test_price_rejeita_taxa_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.00"), 0.01, 12)  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_TAXA_TYPE"


def test_price_rejeita_principal_com_mais_de_duas_casas() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_price(Decimal("1000.001"), Decimal("0.01"), 12)
    assert exc.value.code == "INVALID_PRINCIPAL_SCALE"


def test_price_resultado_e_imutavel() -> None:
    resultado = calcular_price(Decimal("1000.00"), Decimal("0.01"), 2)

    with pytest.raises(FrozenInstanceError):
        resultado.parcela = Decimal("0.00")  # type: ignore[misc]
    assert isinstance(resultado.tabela_periodo, tuple)
