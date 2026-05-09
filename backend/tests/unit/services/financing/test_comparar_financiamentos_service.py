"""Testes unitarios do service comparar_financiamentos."""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.services.financing.simular_financiamento_service import (
    comparar_financiamentos,
)


@pytest.fixture
def base_params() -> dict:
    return {
        "valor_imovel": Decimal("300000.00"),
        "valor_entrada": Decimal("60000.00"),
        "prazo_meses": 120,
        "taxa_juros_mensal_percentual": Decimal("0.7"),
    }


class TestCompararFinanciamentos:
    def test_retorna_price_e_sac(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert "price" in result
        assert "sac" in result

    def test_price_tem_sistema_price(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert result["price"]["summary"]["sistema_amortizacao"] == "PRICE"

    def test_sac_tem_sistema_sac(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert result["sac"]["summary"]["sistema_amortizacao"] == "SAC"

    def test_price_parcelas_igual_prazo(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert len(result["price"]["parcelas"]) == base_params["prazo_meses"]

    def test_sac_parcelas_igual_prazo(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert len(result["sac"]["parcelas"]) == base_params["prazo_meses"]

    def test_comparacao_360_meses(self):
        result = comparar_financiamentos(
            valor_imovel=Decimal("500000.00"),
            valor_entrada=Decimal("100000.00"),
            prazo_meses=360,
            taxa_juros_mensal_percentual=Decimal("0.7"),
        )
        assert len(result["price"]["parcelas"]) == 360
        assert len(result["sac"]["parcelas"]) == 360

    def test_comparacao_600_meses(self):
        result = comparar_financiamentos(
            valor_imovel=Decimal("500000.00"),
            valor_entrada=Decimal("100000.00"),
            prazo_meses=600,
            taxa_juros_mensal_percentual=Decimal("0.7"),
        )
        assert len(result["price"]["parcelas"]) == 600
        assert len(result["sac"]["parcelas"]) == 600

    def test_sac_total_juros_menor_que_price(self, base_params):
        result = comparar_financiamentos(**base_params)
        juros_price = Decimal(result["price"]["summary"]["total_juros"])
        juros_sac = Decimal(result["sac"]["summary"]["total_juros"])
        assert juros_sac < juros_price

    def test_mesmos_parametros_base(self, base_params):
        result = comparar_financiamentos(**base_params)
        assert (
            result["price"]["summary"]["valor_financiado"]
            == result["sac"]["summary"]["valor_financiado"]
        )
        assert result["price"]["summary"]["prazo_meses"] == result["sac"]["summary"]["prazo_meses"]
