"""Domínio de Juros — Sprint 2 / F2.

Expõe as funções públicas de cálculo de juros simples e compostos,
bem como os tipos de resultado e o erro estruturado de validação.

Referências:
    - Plano Sprint 2 v1.2 §5.2 (F2 — Domínio de Juros)
    - Doc 15 §3-§4 (casos canônicos JS-01..03, JC-01..03)
    - Doc 09 §12.2 (política de arredondamento)
    - Doc 04 (arquitetura, Decimal como fonte da verdade)
    - PROMPT_OPERACIONAL_FINAL_SPRINT_2 §10 (regras matemáticas)

Política de tipos:
    - Todas as entradas monetárias e de taxa são ``decimal.Decimal``.
    - Prazos são ``int`` estritos (``bool`` é explicitamente rejeitado,
      apesar de ``bool`` ser subclasse de ``int`` em Python).
    - Resultados expõem valores ``Decimal`` já quantizados em 2 casas
      (apresentação). Os cálculos internos mantêm precisão ≥ 28.

Política de erros:
    - Qualquer violação de precondição levanta
      :class:`DomainValidationError`. É uma exceção *pura de domínio*,
      sem acoplamento a HTTP. A camada de API (F3) é responsável por
      traduzir para ``app.core.errors.ValidationError`` (status 422 /
      RFC 7807) conforme ``docs/06_API_e_Contratos.md``.
"""

from __future__ import annotations

from typing import Any

from .compound import (
    CompostosResultado,
    PeriodoComposto,
    calcular_juros_compostos,
)
from .simple import PeriodoSimples, SimplesResultado, calcular_juros_simples


class DomainValidationError(ValueError):
    """Erro estruturado de validação do domínio financeiro.

    Atributos:
        code: identificador estável (UPPER_SNAKE_CASE) do motivo do erro.
        message: mensagem legível por humanos, em português.
        field: nome do parâmetro que causou a violação, se aplicável.
        value: valor recebido que causou a violação, se aplicável.

    Não herda de nenhuma exceção do pacote ``app.core.errors`` por
    decisão explícita: o domínio não deve conhecer HTTP. A tradução
    para ``core.errors.ValidationError`` (status 422 / RFC 7807) é
    feita exclusivamente na camada de API (F3).
    """

    def __init__(
        self,
        *,
        code: str,
        message: str,
        field: str | None = None,
        value: Any = None,
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


__all__ = [
    "CompostosResultado",
    "DomainValidationError",
    "PeriodoComposto",
    "PeriodoSimples",
    "SimplesResultado",
    "calcular_juros_compostos",
    "calcular_juros_simples",
]
