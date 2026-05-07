"""Domínio de Diagnóstico Financeiro — Sprint 4 / F1.

Expõe o analisador principal, os tipos de resultado e o erro estruturado
de validação do domínio.

Referências:
    - docs/baseline/03_Regras_de_Negocio.md §7 (v1.1)
    - docs/sprints/sprint-04/evidencias/F1-dominio-regras.md
    - Doc 15 §7 (casos DG-01 e DG-02)

Política de tipos:
    - Todas as entradas monetárias são ``decimal.Decimal``.
    - ``bool`` é explicitamente rejeitado (é subclasse de ``int`` em Python).
    - Resultados expõem valores quantizados em 2 casas decimais.

Política de erros:
    - Qualquer violação de precondição levanta ``DomainValidationError``.
    - Exceção pura de domínio, sem acoplamento a HTTP.
"""

from __future__ import annotations

from .analyzer import DiagnosticAlert, DiagnosticoResultado, analisar_diagnostico


class DomainValidationError(ValueError):
    """Erro estruturado de validação do domínio de diagnóstico.

    Atributos:
        code: identificador estável (UPPER_SNAKE_CASE) do motivo do erro.
        message: mensagem legível em português.
        field: parâmetro que causou a violação, quando aplicável.
        value: valor recebido que causou a violação, quando aplicável.
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


__all__ = [
    "DiagnosticAlert",
    "DiagnosticoResultado",
    "DomainValidationError",
    "analisar_diagnostico",
]
