# Sprint 3.5/F1 - Evidencia gates minimos

Data: 2026-05-03
Branch: `sprint-3.5/f1-uiux-diagnostico-plano-codex`

## 1. Comando consolidado

```bash
PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

echo '=== ROOT STATUS ==='
git status -sb

echo '=== LINT PEDAGOGICO ==='
make lint-pedagogical

echo '=== FRONTEND TYPECHECK ==='
cd frontend
pnpm typecheck

echo '=== FRONTEND TESTS ==='
pnpm test -- --run

echo '=== FRONTEND BUILD ==='
pnpm build
```

## 2. Saidas reais

### Root status

```text
=== ROOT STATUS ===
## sprint-3.5/f1-uiux-diagnostico-plano-codex
?? docs/sprints/sprint-03-5/
```

### Lint pedagogico

```text
=== LINT PEDAGOGICO ===
python3 -m tools.edu_lint

edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

### Frontend typecheck

```text
=== FRONTEND TYPECHECK ===

> plataforma-educacional-financeira-frontend@0.1.0 typecheck /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> tsc --noEmit
```

Resultado: exit code 0.

### Frontend tests

```text
=== FRONTEND TESTS ===

> plataforma-educacional-financeira-frontend@0.1.0 test /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> vitest run "--run"

 RUN  v1.6.1 /home/moses/workspace/Plataforma_Educacional_Financeira/frontend

 Test Files  24 passed (24)
      Tests  189 passed (189)
   Start at  21:35:49
   Duration  3.52s
```

Warnings conhecidos observados:

```text
The CJS build of Vite's Node API is deprecated.

The width(0) and height(0) of chart should be greater than 0,
please check the style of container, or the props width(100%) and height(100%),
or add a minWidth(1) or minHeight(1) or use aspect(undefined) to control the
height and width.
```

Classificacao: warnings nao bloqueantes ja coerentes com o residuo Recharts/jsdom
documentado no fechamento da Sprint 3. Os testes passaram.

### Frontend build

```text
=== FRONTEND BUILD ===

> plataforma-educacional-financeira-frontend@0.1.0 build /home/moses/workspace/Plataforma_Educacional_Financeira/frontend
> next build

  ▲ Next.js 14.2.35
  - Experiments (use with caution):
    · typedRoutes

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (16/16)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    177 B          96.5 kB
├ ○ /amortizacao                         5.29 kB         224 kB
└ ○ /juros                               6.15 kB         225 kB
+ First Load JS shared by all            87.5 kB

○  (Static)  prerendered as static content
```

Resultado: exit code 0.

## 3. Resultado final dos gates

- `make lint-pedagogical`: OK.
- `pnpm typecheck`: OK.
- `pnpm test -- --run`: OK, 24 arquivos / 189 testes.
- `pnpm build`: OK, 16 paginas estaticas geradas.
