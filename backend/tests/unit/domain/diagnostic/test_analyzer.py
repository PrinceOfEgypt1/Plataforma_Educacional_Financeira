"""Testes unitários do analisador de diagnóstico financeiro.

Inclui os casos canônicos DG-01 e DG-02 do Doc 15 §7.
"""

from __future__ import annotations

from dataclasses import FrozenInstanceError
from decimal import Decimal

import pytest

from app.domain.diagnostic import (
    DiagnosticAlert,
    DiagnosticoResultado,
    DomainValidationError,
    analisar_diagnostico,
)

pytestmark = pytest.mark.unit


# ---------------------------------------------------------------------------
# Casos canônicos (Doc 15 §7)
# ---------------------------------------------------------------------------


class TestCasosCanonicos:
    def test_dg01_saude_boa(self) -> None:
        """DG-01: situação saudável com comprometimento baixo e sobra boa."""
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("5000.00"),
            total_despesas_fixas=Decimal("2000.00"),
            total_despesas_variaveis=Decimal("800.00"),
            total_dividas_mensais=Decimal("500.00"),
            total_reserva_atual=Decimal("4000.00"),
        )
        assert isinstance(resultado, DiagnosticoResultado)
        assert resultado.sobra_mensal == Decimal("1700.00")
        assert resultado.despesas_essenciais_mensais == Decimal("2800.00")
        assert resultado.comprometimento_percentual == Decimal("10.00")
        assert resultado.sobra_percentual == Decimal("34.00")
        # reserva = 4000/2800 ≈ 1.4286
        assert resultado.reserva_em_meses == Decimal("1.43")
        assert resultado.comprometimento_nivel == "baixo"
        assert resultado.reserva_nivel == "insuficiente"
        assert resultado.sobra_nivel == "boa"
        assert resultado.pontos_comprometimento == 3
        assert resultado.pontos_reserva == 1
        assert resultado.pontos_sobra == 3
        assert resultado.score == 7
        assert resultado.saude_nivel == "boa"

    def test_dg01_alertas(self) -> None:
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("5000.00"),
            total_despesas_fixas=Decimal("2000.00"),
            total_despesas_variaveis=Decimal("800.00"),
            total_dividas_mensais=Decimal("500.00"),
            total_reserva_atual=Decimal("4000.00"),
        )
        assert len(resultado.alertas) == 1
        alerta = resultado.alertas[0]
        assert alerta.code == "RESERVA_INSUFICIENTE"
        assert alerta.level == "warning"
        assert alerta.dimension == "reserva"

    def test_dg02_saude_critica_por_override(self) -> None:
        """DG-02: sobra negativa + reserva zero → override para 'critica'."""
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("3000.00"),
            total_despesas_fixas=Decimal("2200.00"),
            total_despesas_variaveis=Decimal("700.00"),
            total_dividas_mensais=Decimal("500.00"),
            total_reserva_atual=Decimal("0.00"),
        )
        assert resultado.sobra_mensal == Decimal("-400.00")
        assert resultado.despesas_essenciais_mensais == Decimal("2900.00")
        assert resultado.reserva_em_meses == Decimal("0.00")
        assert resultado.comprometimento_nivel == "baixo"
        assert resultado.reserva_nivel == "critica"
        assert resultado.sobra_nivel == "negativa"
        assert resultado.pontos_comprometimento == 3
        assert resultado.pontos_reserva == 0
        assert resultado.pontos_sobra == 0
        assert resultado.score == 3
        assert resultado.saude_nivel == "critica"

    def test_dg02_alertas(self) -> None:
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("3000.00"),
            total_despesas_fixas=Decimal("2200.00"),
            total_despesas_variaveis=Decimal("700.00"),
            total_dividas_mensais=Decimal("500.00"),
            total_reserva_atual=Decimal("0.00"),
        )
        codigos = {a.code for a in resultado.alertas}
        assert "RESERVA_CRITICA" in codigos
        assert "SOBRA_NEGATIVA" in codigos
        levels = {a.level for a in resultado.alertas}
        assert levels == {"critical"}


# ---------------------------------------------------------------------------
# Validação de entradas
# ---------------------------------------------------------------------------


class TestValidacaoEntradas:
    def test_renda_zero_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("0"),
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "RENDA_NAO_POSITIVA"
        assert exc_info.value.field == "renda_mensal"

    def test_renda_negativa_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("-1"),
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "RENDA_NAO_POSITIVA"

    def test_despesas_fixas_negativas_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("5000"),
                Decimal("-1"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "VALOR_NEGATIVO"
        assert exc_info.value.field == "total_despesas_fixas"

    def test_dividas_negativas_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("5000"),
                Decimal("2000"),
                Decimal("500"),
                Decimal("-1"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "VALOR_NEGATIVO"
        assert exc_info.value.field == "total_dividas_mensais"

    def test_reserva_negativa_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("5000"),
                Decimal("2000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("-1"),
            )
        assert exc_info.value.code == "VALOR_NEGATIVO"
        assert exc_info.value.field == "total_reserva_atual"

    def test_despesas_essenciais_zero_levanta_erro(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("5000"),
                Decimal("0"),
                Decimal("0"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "DESPESAS_ESSENCIAIS_ZERO"

    def test_tipo_invalido_bool_renda(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                True,  # type: ignore[arg-type]
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "TIPO_INVALIDO"

    def test_tipo_invalido_float(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                5000.0,  # type: ignore[arg-type]
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "TIPO_INVALIDO"

    def test_tipo_invalido_nan(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("NaN"),
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "VALOR_NAO_FINITO"

    def test_tipo_invalido_infinito(self) -> None:
        with pytest.raises(DomainValidationError) as exc_info:
            analisar_diagnostico(
                Decimal("Infinity"),
                Decimal("1000"),
                Decimal("500"),
                Decimal("200"),
                Decimal("1000"),
            )
        assert exc_info.value.code == "VALOR_NAO_FINITO"


# ---------------------------------------------------------------------------
# Imutabilidade dos resultados
# ---------------------------------------------------------------------------


class TestImutabilidade:
    def test_resultado_frozen(self) -> None:
        resultado = analisar_diagnostico(
            Decimal("5000"),
            Decimal("2000"),
            Decimal("800"),
            Decimal("500"),
            Decimal("4000"),
        )
        with pytest.raises((FrozenInstanceError, AttributeError)):
            resultado.saude_nivel = "otima"  # type: ignore[misc]

    def test_alerta_frozen(self) -> None:
        alerta = DiagnosticAlert(code="TEST", level="warning", dimension="comprometimento")
        with pytest.raises((FrozenInstanceError, AttributeError)):
            alerta.code = "CHANGED"  # type: ignore[misc]


# ---------------------------------------------------------------------------
# Alertas — cobertura completa
# ---------------------------------------------------------------------------


class TestAlertas:
    def test_comprometimento_critico_gera_alerta_critical(self) -> None:
        # comprometimento > 40%
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("1000"),
            total_despesas_fixas=Decimal("100"),
            total_despesas_variaveis=Decimal("100"),
            total_dividas_mensais=Decimal("500"),  # 50% comprometimento
            total_reserva_atual=Decimal("500"),
        )
        codigos = {a.code for a in resultado.alertas}
        assert "COMPROMETIMENTO_CRITICO" in codigos
        alerta = next(a for a in resultado.alertas if a.code == "COMPROMETIMENTO_CRITICO")
        assert alerta.level == "critical"

    def test_comprometimento_alto_gera_alerta_warning(self) -> None:
        # comprometimento entre 30-40%
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("1000"),
            total_despesas_fixas=Decimal("200"),
            total_despesas_variaveis=Decimal("200"),
            total_dividas_mensais=Decimal("350"),  # 35% comprometimento
            total_reserva_atual=Decimal("600"),
        )
        codigos = {a.code for a in resultado.alertas}
        assert "COMPROMETIMENTO_ALTO" in codigos
        alerta = next(a for a in resultado.alertas if a.code == "COMPROMETIMENTO_ALTO")
        assert alerta.level == "warning"

    def test_sobra_minima_gera_alerta_warning(self) -> None:
        # sobra entre 0-10%
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("1000"),
            total_despesas_fixas=Decimal("800"),
            total_despesas_variaveis=Decimal("100"),
            total_dividas_mensais=Decimal("50"),  # sobra=50 → 5%
            total_reserva_atual=Decimal("500"),
        )
        codigos = {a.code for a in resultado.alertas}
        assert "SOBRA_MINIMA" in codigos
        alerta = next(a for a in resultado.alertas if a.code == "SOBRA_MINIMA")
        assert alerta.level == "warning"

    def test_sem_alertas_situacao_saudavel(self) -> None:
        # comprometimento baixo, reserva adequada, sobra boa
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("10000"),
            total_despesas_fixas=Decimal("2000"),
            total_despesas_variaveis=Decimal("1000"),
            total_dividas_mensais=Decimal("500"),  # 5% comprometimento
            total_reserva_atual=Decimal("30000"),  # 10 meses
        )
        assert resultado.alertas == ()

    def test_multiplos_alertas_situacao_critica(self) -> None:
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("3000"),
            total_despesas_fixas=Decimal("2200"),
            total_despesas_variaveis=Decimal("700"),
            total_dividas_mensais=Decimal("500"),
            total_reserva_atual=Decimal("0"),
        )
        assert len(resultado.alertas) >= 2


# ---------------------------------------------------------------------------
# Cenários de saúde — cobertura de todos os níveis
# ---------------------------------------------------------------------------


class TestCenariosNiveisCompletos:
    def test_saude_otima(self) -> None:
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("10000"),
            total_despesas_fixas=Decimal("1000"),
            total_despesas_variaveis=Decimal("1000"),
            total_dividas_mensais=Decimal("500"),  # 5% → baixo (3)
            total_reserva_atual=Decimal("60000"),  # 30m → confortavel (3)
            # sobra = 7500 → 75% → boa (3); score=9 → otima
        )
        assert resultado.score == 9
        assert resultado.saude_nivel == "otima"

    def test_saude_fragil_sem_override(self) -> None:
        # score=3 (fragil), sobra >= 0
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("2000"),
            total_despesas_fixas=Decimal("800"),
            total_despesas_variaveis=Decimal("400"),
            total_dividas_mensais=Decimal("700"),  # 35% → alto (1)
            total_reserva_atual=Decimal("800"),  # 800/1200 ≈ 0.67m → critica (0)
            # sobra = 100 → 5% → minima (1); score=2 → fragil
        )
        assert resultado.score == 2
        assert resultado.saude_nivel == "fragil"

    def test_override_fragil_com_reserva(self) -> None:
        # sobra negativa mas reserva >= 1m → máximo fragil
        resultado = analisar_diagnostico(
            renda_mensal=Decimal("2000"),
            total_despesas_fixas=Decimal("1200"),
            total_despesas_variaveis=Decimal("500"),
            total_dividas_mensais=Decimal("400"),  # 20% → baixo (3)
            total_reserva_atual=Decimal("2000"),  # 2000/1700 ≈ 1.18m → insuficiente (1)
            # sobra = 2000-1200-500-400 = -100 < 0; reserva ≈ 1.18 >= 1
            # score = 3+1+0 = 4 → moderada, mas override cap → fragil
        )
        assert resultado.sobra_mensal < Decimal("0")
        assert resultado.reserva_em_meses >= Decimal("1")
        assert resultado.saude_nivel == "fragil"
