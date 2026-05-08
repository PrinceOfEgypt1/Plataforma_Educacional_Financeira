"""Testes unitarios do service de financiamento imobiliario."""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.core.errors import ValidationError
from app.services.financing.simular_financiamento_service import (
    simular_financiamento_imobiliario,
)

_D = Decimal


def _simular(**kwargs):
    defaults = {
        "valor_imovel": _D("300000.00"),
        "valor_entrada": _D("60000.00"),
        "prazo_meses": 360,
        "taxa_juros_mensal_percentual": _D("0.7"),
        "sistema_amortizacao": "PRICE",
    }
    defaults.update(kwargs)
    return simular_financiamento_imobiliario(**defaults)


# ─────────────────────────── estrutura da resposta ──────────────────────────


@pytest.mark.unit
def test_service_retorna_summary_e_parcelas() -> None:
    result = _simular()
    assert "summary" in result
    assert "parcelas" in result
    assert isinstance(result["parcelas"], list)
    assert len(result["parcelas"]) == 360


@pytest.mark.unit
def test_service_summary_contem_campos_obrigatorios() -> None:
    result = _simular()
    s = result["summary"]
    campos = {
        "sistema_amortizacao",
        "valor_imovel",
        "valor_entrada",
        "valor_financiado",
        "prazo_meses",
        "taxa_juros_mensal",
        "total_pago",
        "total_juros",
        "total_amortizado",
        "total_encargos",
        "custo_total",
        "primeira_parcela",
        "ultima_parcela",
    }
    assert campos <= set(s.keys())


@pytest.mark.unit
def test_service_parcela_contem_campos_obrigatorios() -> None:
    result = _simular()
    p = result["parcelas"][0]
    campos = {
        "numero",
        "saldo_inicial",
        "juros",
        "amortizacao",
        "encargos",
        "prestacao",
        "saldo_final",
    }
    assert campos <= set(p.keys())


# ─────────────────────────── conversao de taxa ──────────────────────────────


@pytest.mark.unit
def test_service_converte_taxa_percentual_para_decimal() -> None:
    result = _simular(taxa_juros_mensal_percentual=_D("0.7"))
    taxa_decimal = result["summary"]["taxa_juros_mensal"]
    assert taxa_decimal == _D("0.007")


@pytest.mark.unit
def test_service_taxa_zero_gera_juros_zero() -> None:
    result = _simular(taxa_juros_mensal_percentual=_D("0"))
    assert result["summary"]["total_juros"] == _D("0.00")


# ─────────────────────────── casos canonicos ────────────────────────────────


@pytest.mark.unit
def test_service_price_valor_financiado_correto() -> None:
    result = _simular()
    assert result["summary"]["valor_financiado"] == _D("240000.00")


@pytest.mark.unit
def test_service_sac_total_juros_menor_que_price() -> None:
    r_price = _simular()
    r_sac = _simular(sistema_amortizacao="SAC")
    assert r_sac["summary"]["total_juros"] < r_price["summary"]["total_juros"]


# ─────────────────────────── erros de validacao ──────────────────────────────


@pytest.mark.unit
def test_service_entrada_igual_imovel_levanta_validation_error() -> None:
    with pytest.raises(ValidationError):
        _simular(valor_entrada=_D("300000.00"))


@pytest.mark.unit
def test_service_prazo_zero_levanta_validation_error() -> None:
    with pytest.raises(ValidationError):
        _simular(prazo_meses=0)
