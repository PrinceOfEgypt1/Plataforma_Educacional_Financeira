# Sprint 3/F4 - Gates e pipeline

## Frontend

```bash
cd frontend
pnpm lint
```

Saida:

```text
✔ No ESLint warnings or errors
```

```bash
cd frontend
pnpm format:check
```

Saida:

```text
All matched files use Prettier code style!
```

```bash
cd frontend
pnpm typecheck
```

Saida:

```text
tsc --noEmit
```

Exit code: 0.

```bash
cd frontend
pnpm test -- --run
```

Saida:

```text
Test Files  23 passed (23)
Tests  161 passed (161)
```

```bash
cd frontend
pnpm build
```

Saida relevante:

```text
✓ Compiled successfully
✓ Generating static pages (16/16)
/amortizacao                         5.29 kB         224 kB
```

## Lint pedagogico

```bash
make lint-pedagogical
```

Saida:

```text
edu_lint: 5 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

## Pipeline oficial

```bash
bash scripts/pipeline.sh
```

Executado com PATH do Node WSL:

```text
PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:...
```

Saida relevante:

```text
backend.pytest_unit: 138 passed in 2.70s
frontend.test: Test Files 23 passed (23), Tests 161 passed (161)
frontend.build: /amortizacao 5.29 kB 224 kB
=== PIPELINE VERDE ===
Todos os gates obrigatórios passaram.
```

## Resultado

- `EXIT_LINT_PED=0`.
- `EXIT_PIPELINE=0`.
- Pipeline verde.
