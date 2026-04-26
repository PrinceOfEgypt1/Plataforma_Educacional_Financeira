"""Lint pedagógico — implementação mínima (Sprint 2 / F5).

Implementa o subset determinístico das regras do Doc 08 §20 que pode
rodar sem dependências externas. A implementação completa, incluindo
contagem por sigla, leitura cruzada com glossário e telemetria, fica
para a Sprint 7 conforme roadmap (`tools/edu_lint/` em Doc 08 §20).
"""

__all__ = ["main"]
from .edu_lint import main  # re-exporta para `python -m tools.edu_lint`
