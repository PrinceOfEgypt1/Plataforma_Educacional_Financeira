# Sprint 3/F4 - Prova de integracao com API

## Objetivo

Comprovar que o frontend consome a API materializada na F3 sem reimplementar matematica financeira.

## Endpoints consumidos pelo frontend

- `POST /api/v1/amortization/price` via path frontend `/amortization/price`;
- `POST /api/v1/amortization/sac` via path frontend `/amortization/sac`;
- `POST /api/v1/amortization/compare` via path frontend `/amortization/compare`.

Arquivo:

```text
frontend/src/services/amortization/amortizationService.ts
```

O service usa `postJson<TIn, TOut>` e normaliza erros via `toInterestApiError`. Nao ha calculo PRICE/SAC no frontend.

## Teste de service frontend

```bash
cd frontend
pnpm test -- --run
```

Saida relevante:

```text
src/__tests__/services/amortization/amortizationService.test.ts  (5 tests)
Test Files  23 passed (23)
Tests  161 passed (161)
```

## Smoke backend recomendado

```bash
cd backend
.venv/bin/python -m pytest tests/unit/services/amortization -q
```

Saida:

```text
5 passed in 0.21s
```

```bash
cd backend
.venv/bin/python -m pytest tests/integration/api/amortization -q
```

Saida:

```text
14 passed in 0.76s
```

```bash
cd backend
.venv/bin/python -m pytest tests/contract -q
```

Saida:

```text
22 passed in 0.83s
```

Observacao: apos os comandos backend apareceu ruido do perfil WSL:

```text
/mnt/c/Program Files/nodejs/pnpm: 11: exec: node: not found
```

Impacto: nenhum. O pytest ja havia finalizado com exit code 0.
