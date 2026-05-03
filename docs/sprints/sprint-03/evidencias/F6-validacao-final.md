# F6 — Validação final

Data: 2026-05-03

## 1. Estado Git de validação

```bash
git status -sb
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Saída:

```text
## sprint-3/f6-fechamento-governanca-codex
sprint-3/f6-fechamento-governanca-codex
81e8cbb
81e8cbb
```

## 2. OpenAPI

```bash
backend/.venv/bin/python scripts/export_openapi.py --check
```

Saída:

```text
openapi.json sincronizado: /home/moses/workspace/Plataforma_Educacional_Financeira/docs/api/openapi.json
```

Resultado: `EXIT_OPENAPI_CHECK=0`.

## 3. Backend

```bash
cd backend
.venv/bin/python -m ruff check .
.venv/bin/python -m ruff format --check .
.venv/bin/python -m mypy app/
.venv/bin/python -m bandit -r app/ -c pyproject.toml
.venv/bin/python -m pytest tests/unit -m unit
.venv/bin/python -m pytest tests/integration -q
.venv/bin/python -m pytest tests/contract -q
```

Saídas relevantes:

```text
All checks passed!
115 files already formatted
Success: no issues found in 73 source files
No issues identified.
138 passed in 2.97s
36 passed in 0.73s
22 passed in 0.70s
```

## 4. Frontend

```bash
cd frontend
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test -- --run
pnpm build
```

Saídas relevantes:

```text
No ESLint warnings or errors
All matched files use Prettier code style!
tsc --noEmit
Test Files  24 passed (24)
Tests  189 passed (189)
Compiled successfully
Generating static pages (16/16)
```

## 5. Observações reais

O primeiro `pnpm build` falhou depois de compilar por cache `.next`
inconsistente:

```text
ENOENT: no such file or directory, open '.../.next/server/pages/_app.js.nft.json'
```

A correção foi remover apenas o cache gerado `frontend/.next` após
verificar o caminho absoluto. O build repetido passou.

Os testes frontend mantêm warning não bloqueante de Recharts/jsdom:

```text
The width(0) and height(0) of chart should be greater than 0
```

Interpretação: warning de ambiente jsdom sem layout real; não falha os
testes nem o build.

## 6. Resultado

Validação final local verde para a F6.
