# F5 — Testes e Gates

**Sprint:** 4 / Fatia: F5  
**Feature:** RF-FIN-001 — Financiamento Imobiliário  
**Data:** 2026-05-08

## Backend — ruff

```
ruff check .        → All checks passed!
ruff format --check → 144 files already formatted
```

## Backend — pytest (financing)

```
tests/unit/domain/financing/test_real_estate.py       29 passed
tests/unit/services/financing/test_simular_financiamento_service.py  9 passed
tests/integration/api/financing/test_real_estate.py    6 passed
tests/integration/api/financing/test_errors.py         6 passed
tests/contract/test_financing.py                       7 passed
─────────────────────────────────────────────────────
Total: 57 passed in 0.92s
```

## Frontend — Prettier

```
pnpm format:check → All matched files use Prettier code style!
```

## Frontend — ESLint

```
pnpm lint → ✔ No ESLint warnings or errors
```

## Frontend — TypeScript

```
pnpm typecheck → (saída vazia — sem erros)
```

## Frontend — Vitest

```
Test Files  38 passed (38)
Tests       354 passed (354)
Start at    19:15:33
Duration    14.22s

Distribuição dos novos testes F5:
  financiamento-imobiliario.test.tsx     12 testes
  FinanciamentoSaibaMais.test.tsx         8 testes
  conteudo.test.ts                       39 testes
  financiamentoService.test.ts            3 testes
  ─────────────────────────────────────
  Subtotal F5                            62 testes
  Total anterior (F4)                   293 testes
  Total consolidado                     354 testes
```

## Frontend — Next.js Build

```
pnpm build → exit 0
/financiamento-imobiliario  10.6 kB   240 kB  (○ Static)
```

## Resumo dos gates

| Gate | Resultado |
|------|-----------|
| ruff check (backend) | VERDE |
| ruff format --check (backend) | VERDE |
| pytest 57 financing tests | VERDE |
| Prettier (frontend) | VERDE |
| ESLint | VERDE |
| tsc typecheck | VERDE |
| Vitest 354/354 | VERDE |
| Next.js build | VERDE |
