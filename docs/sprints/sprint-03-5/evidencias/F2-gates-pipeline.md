# Sprint 3.5/F2 — Gates e pipeline

## Gates frontend

```text
pnpm lint
EXIT=0

pnpm format:check
EXIT=0

pnpm typecheck
EXIT=0

pnpm test -- --run
EXIT=0
26 arquivos / 187 testes

pnpm build
EXIT=0
16/16 páginas estáticas
```

## Lint pedagógico

```text
make lint-pedagogical
edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
EXIT_LINT_PED=0
```

## Pipeline oficial

```text
bash scripts/pipeline.sh
Resultado: PIPELINE VERDE
EXIT_PIPELINE=0
```

Resumo do pipeline:

- backend ruff: OK;
- backend ruff format check: OK;
- backend mypy: OK;
- backend bandit: OK;
- backend unit: 138 testes passando;
- frontend install/lint/format/typecheck/test/build: OK;
- frontend test: 26 arquivos / 187 testes;
- frontend build: 16/16 páginas estáticas.

Observação: o warning de Recharts/jsdom permanece como ruído de ambiente de teste, sem falha funcional.
