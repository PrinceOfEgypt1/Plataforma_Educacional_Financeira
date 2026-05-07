"""Testes unitários das funções de classificação do diagnóstico financeiro.

Fonte das regras: docs/baseline/03_Regras_de_Negocio.md §7.3–§7.6
"""

from __future__ import annotations

from decimal import Decimal

import pytest

from app.domain.diagnostic.rules import (
    _score_to_nivel,
    calcular_saude_nivel,
    classificar_comprometimento,
    classificar_reserva,
    classificar_sobra,
)

pytestmark = pytest.mark.unit


# ---------------------------------------------------------------------------
# classificar_comprometimento
# ---------------------------------------------------------------------------


class TestClassificarComprometimento:
    def test_limite_inferior_baixo(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("0"))
        assert nivel == "baixo"
        assert pts == 3

    def test_exato_20_baixo(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("20"))
        assert nivel == "baixo"
        assert pts == 3

    def test_acima_20_moderado(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("20.01"))
        assert nivel == "moderado"
        assert pts == 2

    def test_exato_30_moderado(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("30"))
        assert nivel == "moderado"
        assert pts == 2

    def test_acima_30_alto(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("30.01"))
        assert nivel == "alto"
        assert pts == 1

    def test_exato_40_alto(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("40"))
        assert nivel == "alto"
        assert pts == 1

    def test_acima_40_critico(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("40.01"))
        assert nivel == "critico"
        assert pts == 0

    def test_extremo_alto_critico(self) -> None:
        nivel, pts = classificar_comprometimento(Decimal("100"))
        assert nivel == "critico"
        assert pts == 0


# ---------------------------------------------------------------------------
# classificar_reserva
# ---------------------------------------------------------------------------


class TestClassificarReserva:
    def test_zero_critica(self) -> None:
        nivel, pts = classificar_reserva(Decimal("0"))
        assert nivel == "critica"
        assert pts == 0

    def test_abaixo_1_critica(self) -> None:
        nivel, pts = classificar_reserva(Decimal("0.99"))
        assert nivel == "critica"
        assert pts == 0

    def test_exato_1_insuficiente(self) -> None:
        nivel, pts = classificar_reserva(Decimal("1"))
        assert nivel == "insuficiente"
        assert pts == 1

    def test_entre_1_e_3_insuficiente(self) -> None:
        nivel, pts = classificar_reserva(Decimal("2.5"))
        assert nivel == "insuficiente"
        assert pts == 1

    def test_exato_3_minima(self) -> None:
        nivel, pts = classificar_reserva(Decimal("3"))
        assert nivel == "minima"
        assert pts == 2

    def test_entre_3_e_6_minima(self) -> None:
        nivel, pts = classificar_reserva(Decimal("4"))
        assert nivel == "minima"
        assert pts == 2

    def test_exato_6_adequada(self) -> None:
        nivel, pts = classificar_reserva(Decimal("6"))
        assert nivel == "adequada"
        assert pts == 3

    def test_entre_6_e_12_adequada(self) -> None:
        nivel, pts = classificar_reserva(Decimal("9"))
        assert nivel == "adequada"
        assert pts == 3

    def test_exato_12_confortavel(self) -> None:
        nivel, pts = classificar_reserva(Decimal("12"))
        assert nivel == "confortavel"
        assert pts == 3

    def test_acima_12_confortavel(self) -> None:
        nivel, pts = classificar_reserva(Decimal("24"))
        assert nivel == "confortavel"
        assert pts == 3


# ---------------------------------------------------------------------------
# classificar_sobra
# ---------------------------------------------------------------------------


class TestClassificarSobra:
    def test_negativa(self) -> None:
        nivel, pts = classificar_sobra(Decimal("-1"))
        assert nivel == "negativa"
        assert pts == 0

    def test_negativa_extremo(self) -> None:
        nivel, pts = classificar_sobra(Decimal("-100"))
        assert nivel == "negativa"
        assert pts == 0

    def test_zero_minima(self) -> None:
        nivel, pts = classificar_sobra(Decimal("0"))
        assert nivel == "minima"
        assert pts == 1

    def test_entre_0_e_10_minima(self) -> None:
        nivel, pts = classificar_sobra(Decimal("5"))
        assert nivel == "minima"
        assert pts == 1

    def test_exato_10_moderada(self) -> None:
        nivel, pts = classificar_sobra(Decimal("10"))
        assert nivel == "moderada"
        assert pts == 2

    def test_entre_10_e_20_moderada(self) -> None:
        nivel, pts = classificar_sobra(Decimal("15"))
        assert nivel == "moderada"
        assert pts == 2

    def test_exato_20_boa(self) -> None:
        nivel, pts = classificar_sobra(Decimal("20"))
        assert nivel == "boa"
        assert pts == 3

    def test_acima_20_boa(self) -> None:
        nivel, pts = classificar_sobra(Decimal("50"))
        assert nivel == "boa"
        assert pts == 3


# ---------------------------------------------------------------------------
# _score_to_nivel
# ---------------------------------------------------------------------------


class TestScoreToNivel:
    @pytest.mark.parametrize(
        ("score", "expected"),
        [
            (0, "critica"),
            (1, "critica"),
            (2, "fragil"),
            (3, "fragil"),
            (4, "moderada"),
            (5, "moderada"),
            (6, "boa"),
            (7, "boa"),
            (8, "otima"),
            (9, "otima"),
        ],
    )
    def test_todos_scores(self, score: int, expected: str) -> None:
        assert _score_to_nivel(score) == expected


# ---------------------------------------------------------------------------
# calcular_saude_nivel (com override)
# ---------------------------------------------------------------------------


class TestCalcularSaudeNivel:
    def test_sem_override_score_alto(self) -> None:
        resultado = calcular_saude_nivel(9, Decimal("500"), Decimal("6"))
        assert resultado == "otima"

    def test_sem_override_score_baixo(self) -> None:
        resultado = calcular_saude_nivel(1, Decimal("100"), Decimal("2"))
        assert resultado == "critica"

    def test_override_sobra_negativa_sem_reserva_forca_critica(self) -> None:
        # sobra<0 e reserva<1m → critica independente do score
        resultado = calcular_saude_nivel(9, Decimal("-1"), Decimal("0.5"))
        assert resultado == "critica"

    def test_override_sobra_negativa_sem_reserva_score_zero(self) -> None:
        resultado = calcular_saude_nivel(0, Decimal("-400"), Decimal("0"))
        assert resultado == "critica"

    def test_override_sobra_negativa_com_reserva_cap_fragil_de_boa(self) -> None:
        # score=7 → "boa", mas sobra<0 e reserva>=1 → cap "fragil"
        resultado = calcular_saude_nivel(7, Decimal("-100"), Decimal("2"))
        assert resultado == "fragil"

    def test_override_sobra_negativa_com_reserva_cap_fragil_de_moderada(self) -> None:
        resultado = calcular_saude_nivel(5, Decimal("-50"), Decimal("1"))
        assert resultado == "fragil"

    def test_override_sobra_negativa_com_reserva_mantém_fragil(self) -> None:
        # score=2 → "fragil", sobra<0 e reserva>=1 → permanece "fragil"
        resultado = calcular_saude_nivel(2, Decimal("-10"), Decimal("1.5"))
        assert resultado == "fragil"

    def test_override_sobra_negativa_com_reserva_mantém_critica(self) -> None:
        # score=1 → "critica", sobra<0 e reserva>=1 → permanece "critica"
        resultado = calcular_saude_nivel(1, Decimal("-10"), Decimal("3"))
        assert resultado == "critica"

    def test_reserva_exatamente_1_com_sobra_negativa_é_fragil(self) -> None:
        # reserva_em_meses = 1 (exatamente) → segundo nível (max fragil)
        resultado = calcular_saude_nivel(6, Decimal("-5"), Decimal("1"))
        assert resultado == "fragil"
