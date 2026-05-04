# Sprint 3.5/F2 - Evidencia gates

Data: 2026-05-03
Branch: `sprint-3.5/f2-fundacao-visual-design-system-codex`

## 1. Gates executados

Ambiente WSL:

```bash
export PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Comandos executados:

```bash
make lint-pedagogical
cd frontend && pnpm lint
cd frontend && pnpm format:check
cd frontend && pnpm typecheck
cd frontend && pnpm test -- --run
cd frontend && pnpm build
bash scripts/pipeline.sh
```

## 2. Resultados finais

### Lint pedagogico

```text
python3 -m tools.edu_lint

edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

Resultado: `EXIT_LINT_PED=0`.

### Frontend lint

```text
> next lint && eslint . --ext .ts,.tsx

✔ No ESLint warnings or errors
```

Resultado: `EXIT_FRONTEND_LINT=0`.

### Frontend format check

```text
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

Resultado: `EXIT_FRONTEND_FORMAT_CHECK=0`.

### Frontend typecheck

```text
> tsc --noEmit
```

Resultado: `EXIT_FRONTEND_TYPECHECK=0`.

### Frontend tests

```text
Test Files  24 passed (24)
Tests       192 passed (192)
```

Resultado: `EXIT_FRONTEND_TEST=0`.

Warnings conhecidos observados:

```text
The CJS build of Vite's Node API is deprecated.

The width(0) and height(0) of chart should be greater than 0
```

Classificacao: warnings nao bloqueantes ja coerentes com o residuo
Recharts/jsdom documentado no fechamento da Sprint 3.

### Frontend build

```text
✓ Compiled successfully
✓ Generating static pages (16/16)

Route (app)                              Size     First Load JS
┌ ○ /                                    204 B          96.5 kB
├ ○ /amortizacao                         5.31 kB         233 kB
└ ○ /juros                               6.16 kB         234 kB
```

Resultado: `EXIT_FRONTEND_BUILD=0`.

### Pipeline oficial

```text
=== PIPELINE VERDE ===
[INFO] Modo: standard
[INFO] Todos os gates obrigatórios passaram.
```

Resultados materiais do pipeline:

- Backend ruff, ruff format, mypy, bandit e unit tests: OK.
- Backend unit tests: 138 passed.
- Frontend install, lint, format check, typecheck, tests e build: OK.
- Frontend tests: 24 arquivos / 192 testes.

Resultado: `EXIT_PIPELINE=0`.

## 3. Evidencia visual Playwright

Foi tentado smoke visual em `/juros` com servidor local em
`http://127.0.0.1:3100/juros`.

Saida material:

```text
=== CURL /JUROS ===
HTTP/1.1 200 OK

=== PLAYWRIGHT SCREENSHOT /JUROS ===
EXIT_PLAYWRIGHT=1
Error: Executable doesn't exist at /home/moses/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell
Looks like Playwright was just installed or updated.
Please run the following command to download new browsers:
pnpm exec playwright install
```

Classificacao: pendencia ambiental nao bloqueante. A rota respondeu 200, mas o
screenshot nao foi materializado porque o Chromium do Playwright nao esta
instalado no WSL.

## 4. Observacoes de execucao

- Uma execucao intermediaria de `pnpm typecheck` foi descartada por corrida com
  `next build` sobre `.next/types`; o typecheck isolado posterior passou.
- Uma execucao intermediaria de `pnpm build` dentro de here-string PowerShell
  recebeu `build\r`; o build isolado posterior passou.
- Nenhuma dessas ocorrencias alterou codigo, dependencias ou escopo.

## 5. Resultado final dos gates

- `EXIT_LINT_PED=0`.
- `EXIT_FRONTEND_LINT=0`.
- `EXIT_FRONTEND_FORMAT_CHECK=0`.
- `EXIT_FRONTEND_TYPECHECK=0`.
- `EXIT_FRONTEND_TEST=0`.
- `EXIT_FRONTEND_BUILD=0`.
- `EXIT_PIPELINE=0`.
- Pipeline oficial verde.
