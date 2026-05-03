# F2 - Staging proof

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Objetivo

Registrar a prova de staging da F2 antes do commit local, com escopo restrito aos arquivos permitidos no prompt operacional.

## 2. Comando de stage executado

```bash
$ git add \
  backend/app/domain/amortization/__init__.py \
  backend/app/domain/amortization/_common.py \
  backend/app/domain/amortization/price.py \
  backend/app/domain/amortization/sac.py \
  backend/tests/unit/domain/amortization/__init__.py \
  backend/tests/unit/domain/amortization/test_price.py \
  backend/tests/unit/domain/amortization/test_sac.py \
  backend/tests/unit/domain/amortization/test_properties.py \
  backend/tests/regression/pedagogical/__init__.py \
  backend/tests/regression/pedagogical/test_interest.py \
  backend/tests/fixtures/financial_cases.json \
  docs/sprints/sprint-03/evidencias/F2-domain-coverage.md \
  docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md \
  docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md \
  docs/sprints/sprint-03/evidencias/F2-staging-proof.md \
  docs/sprints/sprint-03/evidencias/F2-mutation-report.md \
  docs/sprints/sprint-03/evidencias/F2-relatorio-execucao-codex.md
```

## 3. Branch atual

```bash
$ git branch --show-current
sprint-3/f2-dominio-amortizacao-codex
```

## 4. Estado apos stage

```bash
$ git status -sb
## sprint-3/f2-dominio-amortizacao-codex
M  backend/app/domain/amortization/__init__.py
A  backend/app/domain/amortization/_common.py
A  backend/app/domain/amortization/price.py
A  backend/app/domain/amortization/sac.py
M  backend/tests/fixtures/financial_cases.json
A  backend/tests/regression/pedagogical/__init__.py
A  backend/tests/regression/pedagogical/test_interest.py
A  backend/tests/unit/domain/amortization/__init__.py
A  backend/tests/unit/domain/amortization/test_price.py
A  backend/tests/unit/domain/amortization/test_properties.py
A  backend/tests/unit/domain/amortization/test_sac.py
A  docs/sprints/sprint-03/evidencias/F2-domain-coverage.md
A  docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md
A  docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md
A  docs/sprints/sprint-03/evidencias/F2-mutation-report.md
A  docs/sprints/sprint-03/evidencias/F2-relatorio-execucao-codex.md
A  docs/sprints/sprint-03/evidencias/F2-staging-proof.md

$ git status --short
M  backend/app/domain/amortization/__init__.py
A  backend/app/domain/amortization/_common.py
A  backend/app/domain/amortization/price.py
A  backend/app/domain/amortization/sac.py
M  backend/tests/fixtures/financial_cases.json
A  backend/tests/regression/pedagogical/__init__.py
A  backend/tests/regression/pedagogical/test_interest.py
A  backend/tests/unit/domain/amortization/__init__.py
A  backend/tests/unit/domain/amortization/test_price.py
A  backend/tests/unit/domain/amortization/test_properties.py
A  backend/tests/unit/domain/amortization/test_sac.py
A  docs/sprints/sprint-03/evidencias/F2-domain-coverage.md
A  docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md
A  docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md
A  docs/sprints/sprint-03/evidencias/F2-mutation-report.md
A  docs/sprints/sprint-03/evidencias/F2-relatorio-execucao-codex.md
A  docs/sprints/sprint-03/evidencias/F2-staging-proof.md
```

## 5. Arquivos staged

```bash
$ git diff --cached --name-only
backend/app/domain/amortization/__init__.py
backend/app/domain/amortization/_common.py
backend/app/domain/amortization/price.py
backend/app/domain/amortization/sac.py
backend/tests/fixtures/financial_cases.json
backend/tests/regression/pedagogical/__init__.py
backend/tests/regression/pedagogical/test_interest.py
backend/tests/unit/domain/amortization/__init__.py
backend/tests/unit/domain/amortization/test_price.py
backend/tests/unit/domain/amortization/test_properties.py
backend/tests/unit/domain/amortization/test_sac.py
docs/sprints/sprint-03/evidencias/F2-domain-coverage.md
docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md
docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md
docs/sprints/sprint-03/evidencias/F2-mutation-report.md
docs/sprints/sprint-03/evidencias/F2-relatorio-execucao-codex.md
docs/sprints/sprint-03/evidencias/F2-staging-proof.md
```

## 6. Verificacao do diff staged

```bash
$ git diff --check --cached
# sem saida
$ echo EXIT_DIFF_CHECK=0
EXIT_DIFF_CHECK=0
```

## 7. Resultado

Stage restrito aos arquivos permitidos da F2. Nenhum arquivo de API, frontend, OpenAPI, baseline, Makefile, pipeline, workflow ou planilha foi staged.
