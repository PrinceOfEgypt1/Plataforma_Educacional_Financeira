# Sprint 3.5/F3 - Gates

Data: 2026-05-06

Este arquivo registra os gates exigidos pela F3. Os resultados finais devem ser
atualizados apos a execucao local completa.

## Gates frontend

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test -- --run
pnpm build
```

## Gates raiz

```text
make lint-pedagogical
bash scripts/pipeline.sh
```

## Escopo proibido

Validar:

```text
git diff --name-only origin/main...HEAD | grep -E '^(backend/|docs/api/openapi.json|scripts/pipeline|\.github/workflows/|PROMPT|docs/baseline/|.*backlog.*\.xlsx)' || true
```

Resultado esperado: vazio.

## Zone.Identifier

Validar:

```text
find . -name '*Zone.Identifier*' -o -name '*:Zone.Identifier' -o -name '#Uf03aZone.Identifier'
```

Resultado esperado: vazio.

## Resultado local da F3

```text
=== PNPM LINT ===
✔ No ESLint warnings or errors

=== PNPM FORMAT CHECK ===
All matched files use Prettier code style!

=== PNPM TYPECHECK ===
tsc --noEmit

=== PNPM TEST ===
Test Files  26 passed (26)
Tests       188 passed (188)

=== PNPM BUILD ===
✓ Compiled successfully
✓ Generating static pages (16/16)

=== LINT PEDAGOGICO ===
edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)

=== PIPELINE OFICIAL ===
backend: 138 passed
frontend: Test Files 26 passed (26)
frontend: Tests 188 passed (188)
frontend build: OK
=== PIPELINE VERDE ===
```

- `EXIT_FRONTEND_LINT=0`
- `EXIT_FRONTEND_FORMAT_CHECK=0`
- `EXIT_FRONTEND_TYPECHECK=0`
- `EXIT_FRONTEND_TEST=0`
- `EXIT_FRONTEND_BUILD=0`
- `EXIT_LINT_PED=0`
- `EXIT_PIPELINE=0`

## Runtime limpo

```text
=== BUILD LIMPO ===
✓ Compiled successfully
✓ Generating static pages (16/16)

=== DEV LIMPO ===
✓ Ready

/              HTTP/1.1 200 OK
/juros         HTTP/1.1 200 OK
/amortizacao   HTTP/1.1 200 OK
/diagnostico   HTTP/1.1 200 OK
```

## Residuos nao bloqueantes

- Warning conhecido Recharts/jsdom sobre dimensoes zero durante testes.
- Warning Vite CJS deprecation durante testes.
