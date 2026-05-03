"""Testes unitarios do dominio SAC."""

from __future__ import annotations

import json
from dataclasses import FrozenInstanceError
from decimal import Decimal
from pathlib import Path
from typing import Any

import pytest

from app.domain.amortization import (
    DomainValidationError,
    SacResultado,
    calcular_price,
    calcular_sac,
)

pytestmark = pytest.mark.unit

FIXTURES_PATH = Path(__file__).resolve().parents[3] / "fixtures" / "financial_cases.json"


def _load_fixture() -> dict[str, Any]:
    with FIXTURES_PATH.open(encoding="utf-8") as fh:
        data: dict[str, Any] = json.load(fh)
    return data


def _assert_resultado_fecha(resultado: SacResultado, principal: Decimal) -> None:
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


def test_sac01_caso_padrao_fecha_tabela_e_totais() -> None:
    resultado = calcular_sac(Decimal("100000.00"), Decimal("0.01"), 12)

    assert isinstance(resultado, SacResultado)
    assert resultado.amortizacao_constante == Decimal("8333.33")
    assert resultado.parcela_inicial == Decimal("9333.33")
    assert resultado.parcela_final == Decimal("8416.70")
    assert resultado.total_pago == Decimal("106500.00")
    assert resultado.total_juros == Decimal("6500.00")
    assert len(resultado.tabela_periodo) == 12
    assert resultado.tabela_periodo[-1].amortizacao == Decimal("8333.37")
    _assert_resultado_fecha(resultado, Decimal("100000.00"))


def test_sac02_total_juros_menor_que_price() -> None:
    sac = calcular_sac(Decimal("100000.00"), Decimal("0.01"), 12)
    price = calcular_price(Decimal("100000.00"), Decimal("0.01"), 12)

    assert sac.total_juros < price.total_juros
    assert sac.total_pago < price.total_pago


def test_sac_parcelas_e_juros_decrescem() -> None:
    resultado = calcular_sac(Decimal("100000.00"), Decimal("0.01"), 12)

    assert all(
        atual.parcela > proxima.parcela
        for atual, proxima in zip(
            resultado.tabela_periodo, resultado.tabela_periodo[1:], strict=False
        )
    )
    assert all(
        atual.juros > proxima.juros
        for atual, proxima in zip(
            resultado.tabela_periodo, resultado.tabela_periodo[1:], strict=False
        )
    )


def test_sac_amortizacao_constante_ate_penultima_linha() -> None:
    resultado = calcular_sac(Decimal("100000.00"), Decimal("0.01"), 12)
    amortizacoes_regulares = [linha.amortizacao for linha in resultado.tabela_periodo[:-1]]

    assert amortizacoes_regulares
    assert all(
        amortizacao == resultado.amortizacao_constante for amortizacao in amortizacoes_regulares
    )


def test_sac_taxa_zero_amortiza_sem_juros() -> None:
    resultado = calcular_sac(Decimal("1000.00"), Decimal("0"), 3)

    assert resultado.total_juros == Decimal("0.00")
    assert resultado.total_pago == Decimal("1000.00")
    assert [linha.parcela for linha in resultado.tabela_periodo] == [
        Decimal("333.33"),
        Decimal("333.33"),
        Decimal("333.34"),
    ]
    _assert_resultado_fecha(resultado, Decimal("1000.00"))


def test_sac_prazo_unitario() -> None:
    resultado = calcular_sac(Decimal("1000.00"), Decimal("0.01"), 1)

    assert len(resultado.tabela_periodo) == 1
    linha = resultado.tabela_periodo[0]
    assert linha.juros == Decimal("10.00")
    assert linha.amortizacao == Decimal("1000.00")
    assert linha.parcela == Decimal("1010.00")
    _assert_resultado_fecha(resultado, Decimal("1000.00"))


def test_sac_principal_zero_e_valido() -> None:
    resultado = calcular_sac(Decimal("0.00"), Decimal("0.05"), 6)

    assert resultado.total_pago == Decimal("0.00")
    assert resultado.total_juros == Decimal("0.00")
    _assert_resultado_fecha(resultado, Decimal("0.00"))


def test_sac_golden_cases_from_fixture() -> None:
    data = _load_fixture()
    cases = data["amortization"]["sac"]
    assert cases

    for raw in cases:
        resultado = calcular_sac(
            Decimal(raw["principal"]),
            Decimal(raw["taxa_periodo"]),
            int(raw["n_periodos"]),
        )
        assert resultado.amortizacao_constante == Decimal(raw["amortizacao_regular"]), raw["id"]
        assert resultado.total_pago == Decimal(raw["total_pago"]), raw["id"]
        assert resultado.total_juros == Decimal(raw["total_juros"]), raw["id"]
        assert resultado.parcela_final == Decimal(raw["ultima_parcela"]), raw["id"]
        _assert_resultado_fecha(resultado, Decimal(raw["principal"]))


def test_sac_rejeita_principal_negativo() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("-0.01"), Decimal("0.01"), 12)
    assert exc.value.code == "NEGATIVE_PRINCIPAL"
    assert exc.value.field == "principal"


def test_sac_rejeita_taxa_negativa() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.00"), Decimal("-0.01"), 12)
    assert exc.value.code == "NEGATIVE_TAXA"


def test_sac_rejeita_prazo_zero() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.00"), Decimal("0.01"), 0)
    assert exc.value.code == "NON_POSITIVE_N_PERIODOS"


def test_sac_rejeita_prazo_bool() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.00"), Decimal("0.01"), False)
    assert exc.value.code == "INVALID_N_PERIODOS_TYPE"


def test_sac_rejeita_prazo_nao_int() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.00"), Decimal("0.01"), "12")  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_N_PERIODOS_TYPE"


def test_sac_rejeita_principal_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(1000, Decimal("0.01"), 12)  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_PRINCIPAL_TYPE"


def test_sac_rejeita_taxa_nao_decimal() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.00"), 0.01, 12)  # type: ignore[arg-type]
    assert exc.value.code == "INVALID_TAXA_TYPE"


def test_sac_rejeita_principal_com_mais_de_duas_casas() -> None:
    with pytest.raises(DomainValidationError) as exc:
        calcular_sac(Decimal("1000.001"), Decimal("0.01"), 12)
    assert exc.value.code == "INVALID_PRINCIPAL_SCALE"


def test_sac_resultado_e_imutavel() -> None:
    resultado = calcular_sac(Decimal("1000.00"), Decimal("0.01"), 2)

    with pytest.raises(FrozenInstanceError):
        resultado.parcela_inicial = Decimal("0.00")  # type: ignore[misc]
    assert isinstance(resultado.tabela_periodo, tuple)
