"""Política de precisão e arredondamento do domínio de juros.

Isolada em módulo privado para permitir auditoria regulatória e troca pontual
sem espalhar decisões de política pelo resto do domínio. Este módulo NÃO
depende de nenhum outro do pacote; pode ser importado por qualquer submódulo
do domínio sem risco de ciclo.

Política:
    * ROUND_HALF_EVEN (banker's rounding) como default. Escolha alinhada a
      convenções contábeis e regulatórias que evitam o viés sistemático do
      half-up em volumes grandes.
    * Precisão interna de 50 dígitos decimais (muito acima dos ≥28 exigidos
      pelo plano) para tornar o acúmulo de erro em iterações compostas
      irrelevante frente à quantização final de 2 casas.
    * Quantização de display em 2 casas decimais (`Decimal("0.01")`).
    * Tolerância canônica de comparação em ±0.01 (consumida por testes).
"""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from decimal import ROUND_HALF_EVEN, Decimal, localcontext
from typing import Final

# Precisão interna (significant digits) usada dentro de `domain_context`.
COMPUTATION_PRECISION: Final[int] = 50

# Quantizador do display em moeda (2 casas decimais).
DISPLAY_QUANTIZER: Final[Decimal] = Decimal("0.01")

# Tolerância canônica para comparações em testes (±0.01 na unidade de display).
DISPLAY_TOLERANCE: Final[Decimal] = Decimal("0.01")


@contextmanager
def domain_context() -> Iterator[None]:
    """Contexto decimal local com alta precisão e ROUND_HALF_EVEN.

    Uso:
        with domain_context():
            # todas as operações Decimal aqui usam prec=50 e ROUND_HALF_EVEN
            ...

    Não altera o contexto global — o `localcontext` é por-thread/por-bloco e
    restaurado na saída, garantindo que o domínio não polua chamadores.
    """
    with localcontext() as ctx:
        ctx.prec = COMPUTATION_PRECISION
        ctx.rounding = ROUND_HALF_EVEN
        yield


def quantize_display(value: Decimal) -> Decimal:
    """Quantiza valor Decimal em 2 casas decimais via ROUND_HALF_EVEN.

    Deve ser chamado apenas na borda do domínio, nos campos que compõem a
    saída de display. O acumulador iterativo NÃO é quantizado a cada passo —
    só os valores finais/tabelados, para preservar precisão interna.
    """
    return value.quantize(DISPLAY_QUANTIZER, rounding=ROUND_HALF_EVEN)


__all__ = [
    "COMPUTATION_PRECISION",
    "DISPLAY_QUANTIZER",
    "DISPLAY_TOLERANCE",
    "domain_context",
    "quantize_display",
]
