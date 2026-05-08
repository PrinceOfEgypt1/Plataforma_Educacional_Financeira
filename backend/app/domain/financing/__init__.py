"""Dominio de Financiamento Imobiliario -- Sprint 4 / F5.

Expoe a funcao pura de calculo de financiamento imobiliario (PRICE e SAC)
e o erro estruturado de validacao do dominio.

Referencias:
    - Doc 03 §10-§11 (formulas PRICE e SAC)
    - Doc 15 §FI-01..FI-10 (casos planejados)
    - Doc 04 (domain puro, sem framework e sem I/O)

Politica matematica:
    - Entradas monetarias e taxas sao ``decimal.Decimal``.
    - O prazo e ``int`` estrito; ``bool`` e rejeitado.
    - Valores exibidos sao quantizados em centavos com ROUND_HALF_EVEN.
    - Encargos mensais (seguro, tarifa, admin) sao separados de juros
      e amortizacao e adicionados como campo independente em cada periodo.
    - A ultima linha absorve residuo de amortizacao para garantir saldo zero.
"""

from __future__ import annotations


class DomainValidationError(ValueError):
    """Erro estruturado de validacao do dominio de financiamento.

    Atributos:
        code: identificador estavel do motivo do erro.
        message: mensagem legivel por humanos.
        field: parametro associado a violacao, quando aplicavel.
        value: valor recebido que causou a violacao, quando aplicavel.
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


from .real_estate import (  # noqa: E402
    FinanciamentoImobResultado,
    FinanciamentoPeriodo,
    SistemaAmortizacao,
    calcular_financiamento_imobiliario,
)

__all__ = [
    "DomainValidationError",
    "FinanciamentoImobResultado",
    "FinanciamentoPeriodo",
    "SistemaAmortizacao",
    "calcular_financiamento_imobiliario",
]
