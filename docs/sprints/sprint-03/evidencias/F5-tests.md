# F5 — Testes

Data: 2026-05-03

## Testes direcionados de conteúdo

```bash
cd frontend
pnpm test -- --run src/__tests__/content/amortizacao/conteudo.test.ts
```

Saída relevante:

```text
✓ src/__tests__/content/amortizacao/conteudo.test.ts  (27 tests) 6ms

Test Files  1 passed (1)
Tests  27 passed (27)
```

## Testes direcionados da página `/amortizacao`

```bash
cd frontend
pnpm test -- --run src/__tests__/app/amortizacao.test.tsx
```

Saída relevante:

```text
✓ src/__tests__/app/amortizacao.test.tsx  (8 tests) 703ms

Test Files  1 passed (1)
Tests  8 passed (8)
```

## Testes frontend completos

```bash
cd frontend
pnpm test -- --run
```

Saída relevante:

```text
Test Files  24 passed (24)
Tests  189 passed (189)
```

Avisos reais:

```text
The width(0) and height(0) of chart should be greater than 0
```

Interpretação: aviso de Recharts no jsdom, sem falha de teste.

## Smoke backend recomendado

```bash
cd backend
.venv/bin/python -m pytest tests/unit/domain/amortization -q
.venv/bin/python -m pytest tests/unit/services/amortization -q
.venv/bin/python -m pytest tests/integration/api/amortization -q
.venv/bin/python -m pytest tests/contract -q
```

Saídas:

```text
39 passed in 0.74s
5 passed in 0.14s
14 passed in 0.65s
22 passed in 0.73s
```

## Interpretação

Os testes da F5 cobrem conteúdo estático, presença real na UI e
preservação dos fluxos de simulação existentes. O backend não foi
alterado, mas os smokes de amortização e contrato passaram.
