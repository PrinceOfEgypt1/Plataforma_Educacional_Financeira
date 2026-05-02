# F1 — Main Verify Baseline — Sprint 3

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F1 — Pré-voo e plano
**Data:** 2026-05-02T18:41:05-03:00
**Ambiente:** WSL Ubuntu

## 1. Objetivo

Registrar a execução do lint pedagógico e do pipeline oficial após a criação da branch da F1 da Sprint 3, antes de qualquer implementação funcional.

## 2. Estado Git antes dos gates

```bash
$ git branch --show-current
sprint-3/f1-preveo

$ git status -sb
## sprint-3/f1-preveo
?? docs/sprints/sprint-03/

$ git rev-parse --short HEAD
840cbcb

$ git rev-parse --short origin/main
840cbcb
```

## 3. Lint pedagógico

```bash
$ make lint-pedagogical
python3 -m tools.edu_lint

edu_lint: 5 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)

$ echo EXIT_LINT_PED=0
EXIT_LINT_PED=0
```

## 4. Pipeline oficial

```bash
$ bash scripts/pipeline.sh

=== Pipeline Oficial de Qualidade (F5-E02) — modo: standard ===
[INFO] Repositório: /home/moses/workspace/Plataforma_Educacional_Financeira

=== Pré-requisito Backend ===
[INFO] Python do venv: /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python
[ OK ] Ferramenta disponível: ruff
[ OK ] Ferramenta disponível: mypy
[ OK ] Ferramenta disponível: bandit
[ OK ] Ferramenta disponível: pytest

=== Pré-requisito Frontend ===
[INFO] Node: v22.21.1
[INFO] pnpm: /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm

=== Backend — modo padrão ===
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/backend] $ /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python -m ruff check .
All checks passed!
[ OK ] backend.ruff_check
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/backend] $ /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python -m ruff format --check .
92 files already formatted
[ OK ] backend.ruff_format_check
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/backend] $ /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python -m mypy app/
Success: no issues found in 64 source files
[ OK ] backend.mypy_app
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/backend] $ /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python -m bandit -r app/ -c pyproject.toml
[main]	INFO	profile include tests: None
[main]	INFO	profile exclude tests: B101
[main]	INFO	cli include tests: None
[main]	INFO	cli exclude tests: None
[main]	INFO	using config: pyproject.toml
[main]	INFO	running on Python 3.12.3
Working... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:00
Run started:2026-05-02 21:41:06.273807+00:00

Test results:
	No issues identified.

Code scanned:
	Total lines of code: 1766
	Total lines skipped (#nosec): 0
	Total potential issues skipped due to specifically being disabled (e.g., #nosec BXXX): 0

Run metrics:
	Total issues (by severity):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
	Total issues (by confidence):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
Files skipped (0):
[ OK ] backend.bandit
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/backend] $ /home/moses/workspace/Plataforma_Educacional_Financeira/backend/.venv/bin/python -m pytest tests/unit -m unit
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-9.0.3, pluggy-1.6.0
rootdir: /home/moses/workspace/Plataforma_Educacional_Financeira/backend
configfile: pyproject.toml
plugins: asyncio-1.3.0, cov-7.1.0, hypothesis-6.152.1, anyio-4.13.0, xdist-3.8.0, schemathesis-4.15.2
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collected 94 items

tests/unit/domain/interest/test_compound.py ............................ [ 29%]
.                                                                        [ 30%]
tests/unit/domain/interest/test_properties.py ............               [ 43%]
tests/unit/domain/interest/test_simple.py ......................         [ 67%]
tests/unit/services/interest/test_calcular_juros_service.py ............ [ 79%]
...                                                                      [ 82%]
tests/unit/test_envelope.py .............                                [ 96%]
tests/unit/test_health.py ...                                            [100%]

============================== 94 passed in 2.44s ==============================
[ OK ] backend.pytest_unit

=== Frontend — modo padrão ===
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm install --frozen-lockfile
Lockfile is up to date, resolution step is skipped
Already up to date

Done in 660ms
[ OK ] frontend.install
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm lint

> plataforma-educacional-financeira-frontend@0.1.0 lint /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> next lint && eslint . --ext .ts,.tsx

✔ No ESLint warnings or errors
[ OK ] frontend.lint
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm format:check

> plataforma-educacional-financeira-frontend@0.1.0 format:check /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
[ OK ] frontend.format_check
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm typecheck

> plataforma-educacional-financeira-frontend@0.1.0 typecheck /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> tsc --noEmit

[ OK ] frontend.typecheck
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm test -- --run

> plataforma-educacional-financeira-frontend@0.1.0 test /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> vitest run "--run"

[33mThe CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.[39m

 RUN  v1.6.1 /home/moses/workspace/Plataforma_Educacional_Financeira/frontend

 ✓ src/__tests__/lib/api/envelope.test.ts  (5 tests) 4ms
 ✓ src/__tests__/tokens.test.ts  (14 tests) 5ms
 ✓ src/__tests__/content/juros/conteudo.test.ts  (24 tests) 15ms
 ✓ src/__tests__/lib/api/problem.test.ts  (6 tests) 4ms
 ✓ src/__tests__/services/interest/interestService.test.ts  (6 tests) 5ms
 ✓ src/__tests__/components/interest/formValidation.test.ts  (8 tests) 4ms
 ✓ src/__tests__/lib/money.test.ts  (5 tests) 5ms
 ✓ src/__tests__/components/Header.test.tsx  (4 tests) 133ms
 ✓ src/__tests__/components/interest/JurosSaibaMais.test.tsx  (5 tests) 122ms
 ✓ src/__tests__/components/ui.test.tsx  (11 tests) 116ms
 ✓ src/__tests__/components/states.test.tsx  (9 tests) 120ms
 ✓ src/__tests__/components/interest/Visualizacao.test.tsx  (7 tests) 117ms
 ✓ src/__tests__/components/ShellLayout.test.tsx  (4 tests) 172ms
 ✓ src/__tests__/app/home.test.tsx  (3 tests) 191ms
 ✓ src/__tests__/components/interest/JurosSimplesForm.test.tsx  (3 tests) 231ms
 ✓ src/__tests__/components/Sidebar.test.tsx  (4 tests) 284ms
 ✓ src/__tests__/components/interest/JurosCompostosForm.test.tsx  (3 tests) 390ms
 ✓ src/__tests__/app/routes.test.tsx  (12 tests) 687ms
 ✓ src/__tests__/components/interest/JurosTabs.test.tsx  (4 tests) 121ms
 ✓ src/__tests__/app/juros.test.tsx  (9 tests) 180ms
stderr | src/__tests__/components/interest/JurosSimplesPanel.test.tsx > JurosSimplesPanel > happy path: envia form e renderiza summary + tabela + interpretação
The width(0) and height(0) of chart should be greater than 0,
       please check the style of container, or the props width(100%) and height(100%),
       or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
       height and width.

 ✓ src/__tests__/components/interest/JurosSimplesPanel.test.tsx  (3 tests) 291ms

 Test Files  21 passed (21)
      Tests  149 passed (149)
   Start at  18:41:17
   Duration  2.78s (transform 2.69s, setup 1.57s, collect 8.97s, tests 3.20s, environment 14.17s, prepare 6.74s)

[ OK ] frontend.test
[INFO] [cwd=/home/moses/workspace/Plataforma_Educacional_Financeira/frontend] $ sh -c /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm build

> plataforma-educacional-financeira-frontend@0.1.0 build /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> next build

  ▲ Next.js 14.2.35
  - Experiments (use with caution):
    · typedRoutes

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/16) ...
   Generating static pages (4/16)
   Generating static pages (8/16)
   Generating static pages (12/16)
 ✓ Generating static pages (16/16)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    177 B          96.5 kB
├ ○ /_not-found                          875 B          88.4 kB
├ ○ /amortizacao                         165 B          87.7 kB
├ ○ /atraso                              164 B          87.7 kB
├ ○ /cartao-rotativo                     164 B          87.7 kB
├ ○ /cdc                                 164 B          87.7 kB
├ ○ /consignado                          165 B          87.7 kB
├ ○ /diagnostico                         165 B          87.7 kB
├ ○ /educacao                            164 B          87.7 kB
├ ○ /financiamento-imobiliario           164 B          87.7 kB
├ ○ /financiamento-veiculo               165 B          87.7 kB
├ ○ /indicadores                         165 B          87.7 kB
├ ○ /investir-vs-quitar                  164 B          87.7 kB
└ ○ /juros                               130 kB          224 kB
+ First Load JS shared by all            87.5 kB
  ├ chunks/253-38bb2e41d210cc1a.js       31.9 kB
  ├ chunks/6f86bd72-c0d36f005a507a6c.js  53.6 kB
  └ other shared chunks (total)          2 kB


○  (Static)  prerendered as static content

[ OK ] frontend.build

=== PIPELINE VERDE ===
[INFO] Modo: standard
[INFO] Todos os gates obrigatórios passaram.

$ echo EXIT_PIPELINE=0
EXIT_PIPELINE=0
```

## 5. Resultado


✅ Baseline verde para a F1 da Sprint 3.

- EXIT_LINT_PED=0
- EXIT_PIPELINE=0
