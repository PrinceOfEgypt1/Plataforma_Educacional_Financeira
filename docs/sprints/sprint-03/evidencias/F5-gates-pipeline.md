# F5 — Gates e pipeline

Data: 2026-05-03

## Frontend

```bash
cd frontend
pnpm lint
```

Saída relevante:

```text
✔ No ESLint warnings or errors
```

```bash
pnpm format:check
```

Saída relevante:

```text
Checking formatting...
All matched files use Prettier code style!
```

```bash
pnpm typecheck
```

Saída relevante:

```text
tsc --noEmit
```

Exit code: 0.

```bash
pnpm test -- --run
```

Saída relevante:

```text
Test Files  24 passed (24)
Tests  189 passed (189)
```

```bash
pnpm build
```

Saída relevante:

```text
✓ Compiled successfully
✓ Generating static pages (16/16)
```

## Lint pedagógico

```bash
make lint-pedagogical
```

Saída:

```text
edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

Resultado: `EXIT_LINT_PED=0`.

## Pipeline oficial

```bash
bash scripts/pipeline.sh
```

Saída relevante:

```text
=== PIPELINE VERDE ===
[INFO] Modo: standard
[INFO] Todos os gates obrigatórios passaram.
```

Resultado: `EXIT_PIPELINE=0`.

## Observações reais de ambiente

Alguns comandos executados via WSL emitiram ao final:

```text
/mnt/c/Program Files/nodejs/pnpm: 11: exec: node: not found
```

Interpretação: ruído do perfil/shell após a execução do comando. Os
comandos acima retornaram exit code 0 e produziram os resultados verdes
registrados.
