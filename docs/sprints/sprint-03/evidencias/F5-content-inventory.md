# F5 — Inventário de conteúdo

Data: 2026-05-03

## Arquivos de conteúdo criados

```bash
find frontend/src/content/amortizacao -maxdepth 1 -type f -print | sort
```

Saída:

```text
frontend/src/content/amortizacao/alertas.ts
frontend/src/content/amortizacao/glossario.ts
frontend/src/content/amortizacao/index.ts
frontend/src/content/amortizacao/nivel-1.ts
frontend/src/content/amortizacao/nivel-2.ts
frontend/src/content/amortizacao/types.ts
```

## Conteúdo materializado

- `nivel-1.ts`: 4 blocos essenciais.
  - `amortizacao`
  - `sistema-price`
  - `sistema-sac`
  - `comparacao-price-sac`
- `nivel-2.ts`: 4 blocos intermediários com os mesmos slugs.
- `glossario.ts`: 12 termos essenciais.
- `alertas.ts`: 4 cuidados educacionais.
- `types.ts`: tipos próprios do domínio de conteúdo de amortização.

## Termos essenciais cobertos

- principal
- taxa por período
- número de períodos
- parcela
- juros
- amortização
- saldo devedor
- total pago
- total de juros
- saldo final
- PRICE
- SAC

## Teste editorial direcionado

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

## Interpretação

O conteúdo educacional da F5 foi materializado em diretório próprio,
sem acoplamento com `frontend/src/content/juros/`. O teste editorial
prova presença de PRICE, SAC, comparação, glossário, cuidados e limites
educacionais da simulação.
