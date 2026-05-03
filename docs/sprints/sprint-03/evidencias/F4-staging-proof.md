# Sprint 3/F4 - Staging proof

## Branch e base

```bash
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Saida:

```text
sprint-3/f4-frontend-amortizacao-codex
a297b9c
a297b9c
```

## Status antes do commit local

```bash
git status -sb
```

Saida relevante:

```text
## sprint-3/f4-frontend-amortizacao-codex
 M frontend/src/app/(app)/amortizacao/page.tsx
 M frontend/src/config/modules.ts
?? docs/sprints/sprint-03/evidencias/F4-api-integration-proof.md
?? docs/sprints/sprint-03/evidencias/F4-base-branch.md
?? docs/sprints/sprint-03/evidencias/F4-frontend-tests.md
?? docs/sprints/sprint-03/evidencias/F4-gates-pipeline.md
?? docs/sprints/sprint-03/evidencias/F4-relatorio-execucao-codex.md
?? docs/sprints/sprint-03/evidencias/F4-staging-proof.md
?? docs/sprints/sprint-03/evidencias/F4-ui-ux-validation.md
?? frontend/src/__tests__/app/amortizacao.test.tsx
?? frontend/src/__tests__/services/amortization/
?? frontend/src/components/amortization/
?? frontend/src/services/amortization/
?? frontend/src/types/amortization.ts
```

## Arquivos fora do escopo proibido

```bash
git diff --name-only -- backend docs/api/openapi.json docs/baseline
```

Saida:

```text

```

Resultado: sem alteracoes em backend, OpenAPI ou docs baseline.

## Higiene de diff

```bash
git diff --check
```

Saida:

```text

```

Resultado: sem whitespace errors detectados.

## Operacoes nao realizadas

- Nao houve merge.
- Nao houve push.
- Nao houve abertura de PR.
