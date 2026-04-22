"""Domínio de juros — funções puras de cálculo financeiro.

Este pacote é **puro**:
    * NÃO executa IO;
    * NÃO escreve log;
    * NÃO depende de serviços externos, HTTP, banco de dados ou cache;
    * NÃO conhece HTTP, RFC 7807 ou esquemas Pydantic;
    * retorna dataclasses imutáveis;
    * ergue exceções `DomainError` e subclasses em caso de entrada inválida.

A tradução de `DomainError` para respostas HTTP (RFC 7807) é responsabilidade
exclusiva da camada de serviço/API (F3), que consome este domínio.

API pública:
    calcular_juros_simples, SimpleInterestResult, SimplePeriod
    calcular_juros_compostos, CompoundInterestResult, CompoundPeriod
    DomainError, InvalidPrincipalError, InvalidRateError, InvalidTermError,
    InvalidContributionError
"""

from __future__ import annotations


class DomainError(Exception):
    """Base para erros de regra do domínio de juros.

    Subclasses devem nomear o campo ofensor. A mensagem carrega contexto
    diagnóstico, mas NÃO deve conter detalhes de infraestrutura (HTTP, SQL,
    etc.). A borda HTTP é responsabilidade da camada de serviço.
    """


class InvalidPrincipalError(DomainError):
    """Principal inválido — tipo errado, sinal proibido, ou combinação
    proibida (ex.: principal zero simultâneo a aporte zero em compostos)."""


class InvalidRateError(DomainError):
    """Taxa inválida — tipo errado ou sinal negativo."""


class InvalidTermError(DomainError):
    """Prazo inválido — tipo errado, zero, ou negativo. `bool` é rejeitado
    explicitamente apesar de ser subtipo de `int` em Python."""


class InvalidContributionError(DomainError):
    """Aporte mensal inválido — tipo errado ou sinal negativo."""


# Re-exports. Colocados após as definições de exceção para que os submódulos,
# ao importarem `from . import InvalidXError`, encontrem as classes já
# presentes no módulo-pacote parcialmente inicializado.
from .compound import (  # noqa: E402
    CompoundInterestResult,
    CompoundPeriod,
    calcular_juros_compostos,
)
from .simple import (  # noqa: E402
    SimpleInterestResult,
    SimplePeriod,
    calcular_juros_simples,
)

__all__ = [
    "DomainError",
    "InvalidPrincipalError",
    "InvalidRateError",
    "InvalidTermError",
    "InvalidContributionError",
    "calcular_juros_simples",
    "SimpleInterestResult",
    "SimplePeriod",
    "calcular_juros_compostos",
    "CompoundInterestResult",
    "CompoundPeriod",
]
