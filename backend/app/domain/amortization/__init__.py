"""Dominio de Amortizacao ? Sprint 3 / F2.

Expoe as funcoes puras de calculo PRICE e SAC, os tipos de resultado
e um erro estruturado de validacao do dominio.

Referencias:
    - Plano Sprint 3 ?5.2 (F2 ? Dominio Amortizacao PRICE + SAC)
    - Doc 03 ?10-?11 (formulas PRICE e SAC)
    - Doc 15 ?5-?6 (casos PR-01/PR-02 e SAC-01/SAC-02)
    - Doc 04 (domain puro, sem framework e sem I/O)

Politica matematica:
    - Entradas monetarias e taxas sao ``decimal.Decimal``.
    - O prazo e ``int`` estrito; ``bool`` e rejeitado.
    - Valores exibidos sao quantizados em centavos com
      ``ROUND_HALF_EVEN``.
    - Cada linha da tabela fecha por construcao:
      ``juros + amortizacao == parcela``.
    - A ultima linha absorve residuo de amortizacao para garantir
      ``sum(amortizacao) == principal`` e saldo final zero.
"""

from __future__ import annotations

from ._common import AmortizationPeriod


class DomainValidationError(ValueError):
    """Erro estruturado de validacao do dominio de amortizacao.

    Atributos:
        code: identificador estavel do motivo do erro.
        message: mensagem legivel por humanos.
        field: parametro associado a violacao, quando aplicavel.
        value: valor recebido que causou a violacao, quando aplicavel.

    A excecao permanece pura de dominio; nenhuma dependencia HTTP,
    FastAPI ou Pydantic e conhecida nesta camada.
    """

    def __init__(
        self,
        *,
        code: str,
        message: str,
        field: str | None = None,
        value: object | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.field = field
        self.value = value

    def __repr__(self) -> str:
        return (
            f"DomainValidationError(code={self.code!r}, "
            f"message={self.message!r}, field={self.field!r})"
        )


from .price import PriceResultado, calcular_price  # noqa: E402
from .sac import SacResultado, calcular_sac  # noqa: E402

__all__ = [
    "AmortizationPeriod",
    "DomainValidationError",
    "PriceResultado",
    "SacResultado",
    "calcular_price",
    "calcular_sac",
]
