# F3 ? Staging proof

Data: 2026-05-03

## Diff check

Comando:

```bash
git -C /home/moses/workspace/Plataforma_Educacional_Financeira diff --check
```

Saida real:

```text
<sem saida>
```

Exit code: 0.

## Diff stat antes do staging

Comando:

```bash
git -C /home/moses/workspace/Plataforma_Educacional_Financeira diff --stat
```

Saida real para arquivos rastreados antes de adicionar untracked:

```text
 backend/app/api/v1/router.py                  |    7 +-
 backend/app/schemas/amortization/__init__.py  |   14 +
 backend/app/services/amortization/__init__.py |   15 +
 docs/06_API_e_Contratos.md                    |   48 +
 docs/19_Matriz_Rastreabilidade.md             |   17 +-
 docs/_meta/living_docs.json                   |    2 +-
 docs/api/openapi.json                         | 1924 ++++++++++++++++++++++++-
 7 files changed, 1967 insertions(+), 60 deletions(-)
```

## Status antes do staging

Comando:

```bash
git -C /home/moses/workspace/Plataforma_Educacional_Financeira status -sb
```

Saida real antes de materializar as evidencias:

```text
## sprint-3/f3-api-amortizacao-codex
 M backend/app/api/v1/router.py
 M backend/app/schemas/amortization/__init__.py
 M backend/app/services/amortization/__init__.py
 M docs/06_API_e_Contratos.md
 M docs/19_Matriz_Rastreabilidade.md
 M docs/_meta/living_docs.json
 M docs/api/openapi.json
?? backend/app/api/v1/amortization.py
?? backend/app/schemas/amortization/base.py
?? backend/app/schemas/amortization/compare.py
?? backend/app/schemas/amortization/price.py
?? backend/app/schemas/amortization/sac.py
?? backend/app/services/amortization/calcular_amortizacao_service.py
?? backend/tests/contract/test_amortization.py
?? backend/tests/integration/api/amortization/
?? backend/tests/unit/services/amortization/
```

## Escopo negativo conferido

Nao houve alteracao em:

- frontend;
- `docs/baseline/**`;
- Prompt-Mestre;
- planilha operacional;
- workflows;
- Makefile;
- matematica F2 de dominio puro.

Nao houve merge e nao houve push.

## Status staged antes do commit

Comando:

```bash
git -C /home/moses/workspace/Plataforma_Educacional_Financeira status -sb
git -C /home/moses/workspace/Plataforma_Educacional_Financeira diff --cached --name-status
```

Saida real relevante:

```text
## sprint-3/f3-api-amortizacao-codex
A  backend/app/api/v1/amortization.py
M  backend/app/api/v1/router.py
M  backend/app/schemas/amortization/__init__.py
A  backend/app/schemas/amortization/base.py
A  backend/app/schemas/amortization/compare.py
A  backend/app/schemas/amortization/price.py
A  backend/app/schemas/amortization/sac.py
M  backend/app/services/amortization/__init__.py
A  backend/app/services/amortization/calcular_amortizacao_service.py
A  backend/tests/contract/test_amortization.py
A  backend/tests/integration/api/amortization/__init__.py
A  backend/tests/integration/api/amortization/test_compare.py
A  backend/tests/integration/api/amortization/test_errors.py
A  backend/tests/integration/api/amortization/test_price.py
A  backend/tests/integration/api/amortization/test_sac.py
A  backend/tests/unit/services/amortization/__init__.py
A  backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py
M  docs/06_API_e_Contratos.md
M  docs/19_Matriz_Rastreabilidade.md
M  docs/_meta/living_docs.json
M  docs/api/openapi.json
A  docs/sprints/sprint-03/evidencias/F3-base-branch.md
A  docs/sprints/sprint-03/evidencias/F3-contract-validation.md
A  docs/sprints/sprint-03/evidencias/F3-gates-pipeline.md
A  docs/sprints/sprint-03/evidencias/F3-openapi-diff.md
A  docs/sprints/sprint-03/evidencias/F3-relatorio-execucao-codex.md
A  docs/sprints/sprint-03/evidencias/F3-service-api-tests.md
A  docs/sprints/sprint-03/evidencias/F3-staging-proof.md
```
