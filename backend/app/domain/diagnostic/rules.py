"""Funções puras de classificação para o diagnóstico financeiro.

Todas as funções são determinísticas e sem efeitos colaterais.
Fonte das regras: docs/baseline/03_Regras_de_Negocio.md §7.3–§7.6
"""

from __future__ import annotations

from decimal import Decimal
from typing import Literal

ComprometimentoNivel = Literal["baixo", "moderado", "alto", "critico"]
ReservaNivel = Literal["critica", "insuficiente", "minima", "adequada", "confortavel"]
SobraNivel = Literal["negativa", "minima", "moderada", "boa"]
SaudeNivel = Literal["critica", "fragil", "moderada", "boa", "otima"]

_ZERO = Decimal("0")
_TEN = Decimal("10")
_TWENTY = Decimal("20")
_THIRTY = Decimal("30")
_FORTY = Decimal("40")
_ONE = Decimal("1")
_THREE = Decimal("3")
_SIX = Decimal("6")
_TWELVE = Decimal("12")


def classificar_comprometimento(
    comprometimento_pct: Decimal,
) -> tuple[ComprometimentoNivel, int]:
    """Classifica o percentual de comprometimento de renda com dívidas.

    Doc 03 §7.3: ≤20%→baixo(3), ≤30%→moderado(2), ≤40%→alto(1), >40%→critico(0).
    """
    if comprometimento_pct <= _TWENTY:
        return "baixo", 3
    if comprometimento_pct <= _THIRTY:
        return "moderado", 2
    if comprometimento_pct <= _FORTY:
        return "alto", 1
    return "critico", 0


def classificar_reserva(
    reserva_em_meses: Decimal,
) -> tuple[ReservaNivel, int]:
    """Classifica a reserva de emergência em meses de despesas essenciais.

    Doc 03 §7.4: <1m→critica(0), <3m→insuficiente(1), <6m→minima(2),
    <12m→adequada(3), ≥12m→confortavel(3).
    """
    if reserva_em_meses < _ONE:
        return "critica", 0
    if reserva_em_meses < _THREE:
        return "insuficiente", 1
    if reserva_em_meses < _SIX:
        return "minima", 2
    if reserva_em_meses < _TWELVE:
        return "adequada", 3
    return "confortavel", 3


def classificar_sobra(
    sobra_pct: Decimal,
) -> tuple[SobraNivel, int]:
    """Classifica a sobra mensal como percentual da renda.

    Doc 03 §7.5: <0%→negativa(0), <10%→minima(1), <20%→moderada(2), ≥20%→boa(3).
    """
    if sobra_pct < _ZERO:
        return "negativa", 0
    if sobra_pct < _TEN:
        return "minima", 1
    if sobra_pct < _TWENTY:
        return "moderada", 2
    return "boa", 3


def calcular_saude_nivel(
    score: int,
    sobra_mensal: Decimal,
    reserva_em_meses: Decimal,
) -> SaudeNivel:
    """Aplica o algoritmo consolidado de saúde financeira com override.

    Doc 03 §7.6: score 0-9 → critica/fragil/moderada/boa/otima.
    Override dois níveis para sobra negativa (DECISÃO DO PO):
      - sobra < 0 e reserva < 1m → "critica" (força)
      - sobra < 0 e reserva >= 1m → máximo "fragil"
    """
    if sobra_mensal < _ZERO:
        if reserva_em_meses < _ONE:
            return "critica"
        nivel = _score_to_nivel(score)
        if nivel not in ("critica", "fragil"):
            return "fragil"
        return nivel
    return _score_to_nivel(score)


def _score_to_nivel(score: int) -> SaudeNivel:
    """Converte score 0-9 para nível de saúde financeira.

    Doc 03 §7.6: 0-1→critica, 2-3→fragil, 4-5→moderada, 6-7→boa, 8-9→otima.
    """
    if score <= 1:
        return "critica"
    if score <= 3:
        return "fragil"
    if score <= 5:
        return "moderada"
    if score <= 7:
        return "boa"
    return "otima"
