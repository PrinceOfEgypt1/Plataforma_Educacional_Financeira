"""Testes do contrato educacional do piloto de financiamento imobiliario."""

from __future__ import annotations

from decimal import Decimal
from typing import cast

import pytest

from app.services.financing.simular_financiamento_service import (
    comparar_financiamentos,
    simular_financiamento_imobiliario,
)

ServiceResult = dict[str, object]


def _dict(value: object) -> dict[str, object]:
    return cast(dict[str, object], value)


def _simular(prazo_meses: int = 360, sistema: str = "PRICE") -> ServiceResult:
    return simular_financiamento_imobiliario(
        valor_imovel=Decimal("300000.00"),
        valor_entrada=Decimal("60000.00"),
        prazo_meses=prazo_meses,
        taxa_juros_mensal_percentual=Decimal("0.7"),
        sistema_amortizacao=sistema,
    )


@pytest.mark.unit
def test_resposta_contem_contrato_educacional_com_memoria_e_alertas() -> None:
    result = _simular()

    assert result["inputs_normalizados"]["valor_financiado"] == Decimal("240000.00")
    assert result["memoria_calculo"]["metodo"] == "PRICE"
    assert "formula" in result["memoria_calculo"]
    assert result["formulas_usadas"]
    assert result["explicacoes_pedagogicas"]
    assert result["alertas"]
    assert result["fontes"]
    assert result["limites"]
    assert result["metadados_calculo"]["contrato_educacional_api"] == "Item 13"
    assert result["mensagens_interface"]


@pytest.mark.unit
@pytest.mark.parametrize("prazo", [120, 360, 600])
def test_tabela_dinamica_respeita_prazo_em_meses(prazo: int) -> None:
    result = _simular(prazo_meses=prazo)

    assert len(result["parcelas"]) == prazo
    assert len(result["chart_data"]["saldo_devedor"]) == prazo
    assert result["metadados_calculo"]["linhas_tabela"] == prazo
    assert result["metadados_calculo"]["prazo_dinamico_respeitado"] is True


@pytest.mark.unit
def test_memoria_de_calculo_rastreia_primeira_e_ultima_parcela() -> None:
    result = _simular(sistema="SAC")
    memoria = result["memoria_calculo"]

    assert memoria["primeira_parcela"]["numero"] == 1
    assert memoria["ultima_parcela"]["numero"] == 360
    assert memoria["resultado_final"]["saldo_final"] == Decimal("0.00")
    assert "ROUND_HALF_EVEN" in memoria["arredondamento"]


@pytest.mark.unit
def test_comparacao_price_sac_contem_diferencas_e_explicacao() -> None:
    result = comparar_financiamentos(
        valor_imovel=Decimal("300000.00"),
        valor_entrada=Decimal("60000.00"),
        prazo_meses=360,
        taxa_juros_mensal_percentual=Decimal("0.7"),
    )

    price = _dict(result["price"])
    sac = _dict(result["sac"])
    price_summary = _dict(price["summary"])
    sac_summary = _dict(sac["summary"])
    comparacao = _dict(result["comparacao"])

    assert price_summary["sistema_amortizacao"] == "PRICE"
    assert sac_summary["sistema_amortizacao"] == "SAC"
    assert cast(Decimal, comparacao["diferenca_total_juros"]) > Decimal("0.00")
    assert "SAC" in str(comparacao["explicacao_pedagogica"])
